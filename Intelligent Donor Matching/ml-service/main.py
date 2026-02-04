from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import joblib
import pandas as pd
import numpy as np
from pathlib import Path
import logging
from utils.hla_matching import calculate_hla_match_score, get_hla_match_level

# Try to import SHAP
try:
    import shap
    SHAP_AVAILABLE = True
except ImportError:
    SHAP_AVAILABLE = False
    logging.warning("SHAP not available. Install with: pip install shap")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="NephroSense ML Service",
    description="ML prediction service for kidney donor-recipient matching",
    version="2.0.0"  # Upgraded for research-grade features
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class DonorData(BaseModel):
    donorId: Optional[str] = Field(None, description="Donor ID")
    age: float = Field(..., ge=18, le=100, description="Donor age")
    bloodGroup: str = Field(..., description="Donor blood group (A+, A-, B+, B-, AB+, AB-, O+, O-)")
    hlaTyping: Optional[str] = Field(None, description="HLA typing (e.g., A1,A2,B8,B44,DR1,DR4)")
    bmi: float = Field(..., ge=15, le=50, description="Donor BMI")
    creatinine: float = Field(..., ge=0.5, le=10, description="Donor serum creatinine (mg/dL)")
    gfr: float = Field(..., ge=0, le=200, description="Donor GFR (mL/min/1.73m²)")
    systolicBP: float = Field(..., ge=80, le=200, description="Donor systolic BP (mmHg)")
    diastolicBP: float = Field(..., ge=40, le=130, description="Donor diastolic BP (mmHg)")
    smoking: bool = Field(..., description="Donor smoking status")
    diabetes: bool = Field(..., description="Donor diabetes status")
    hypertension: bool = Field(..., description="Donor hypertension status")

class RecipientData(BaseModel):
    recipientId: Optional[str] = Field(None, description="Recipient ID")
    age: float = Field(..., ge=18, le=100, description="Recipient age")
    bloodGroup: str = Field(..., description="Recipient blood group")
    hlaTyping: Optional[str] = Field(None, description="HLA typing (e.g., A1,A3,B8,B44,DR1,DR7)")
    bmi: float = Field(..., ge=15, le=50, description="Recipient BMI")
    creatinine: float = Field(..., ge=0.5, le=20, description="Recipient serum creatinine (mg/dL)")
    gfr: float = Field(..., ge=0, le=200, description="Recipient GFR (mL/min/1.73m²)")
    systolicBP: float = Field(..., ge=80, le=200, description="Recipient systolic BP (mmHg)")
    diastolicBP: float = Field(..., ge=40, le=130, description="Recipient diastolic BP (mmHg)")
    dialysisYears: float = Field(..., ge=0, le=30, description="Years on dialysis")
    diabetes: bool = Field(..., description="Recipient diabetes status")
    hypertension: bool = Field(..., description="Recipient hypertension status")
    previousTransplants: int = Field(..., ge=0, le=5, description="Number of previous transplants")

class PredictionRequest(BaseModel):
    donor: DonorData
    recipient: RecipientData

class BatchPredictionRequest(BaseModel):
    recipient: RecipientData
    donors: List[DonorData]

class RiskCategory(BaseModel):
    category: str = Field(..., description="Risk category: Low Risk, Medium Risk, High Risk")
    color: str = Field(..., description="Color code for UI")
    description: str = Field(..., description="Human-readable description")

class SHAPExplanation(BaseModel):
    feature: str
    importance: float
    description: str

class PredictionResponse(BaseModel):
    probability: float = Field(..., description="Compatibility probability (0-1)")
    suitability: str = Field(..., description="Suitability classification")
    threshold: float = Field(..., description="Classification threshold used")
    confidence: str = Field(..., description="Confidence level")
    message: str = Field(..., description="Additional information")
    riskCategory: Optional[RiskCategory] = None
    shapExplanation: Optional[List[SHAPExplanation]] = None

class DonorPredictionResult(BaseModel):
    donorId: str
    probability: float
    riskCategory: RiskCategory
    shapExplanation: List[SHAPExplanation]
    explanationText: str
    parameters: Optional[dict] = None  # Add parameters field for HLA scores and clinical metrics
    rank: int

class BatchPredictionResponse(BaseModel):
    success: bool
    predictions: List[DonorPredictionResult]
    topDonors: List[DonorPredictionResult]
    totalEvaluated: int

# Global variable to store loaded model and SHAP explainer
model = None
shap_explainer = None
THRESHOLD = 0.58  # Clinical decision threshold (optimized during training)

# Blood group compatibility matrix
BLOOD_GROUP_COMPATIBILITY = {
    'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    'O+': ['O+', 'A+', 'B+', 'AB+'],
    'A-': ['A-', 'A+', 'AB-', 'AB+'],
    'A+': ['A+', 'AB+'],
    'B-': ['B-', 'B+', 'AB-', 'AB+'],
    'B+': ['B+', 'AB+'],
    'AB-': ['AB-', 'AB+'],
    'AB+': ['AB+']
}

def categorize_risk(probability: float) -> dict:
    """
    Categorize risk based on SUITABILITY probability from model
    Model returns probability of being SUITABLE (class 1)
    - High suitability (>70%) = Low Risk
    - Medium suitability (40-70%) = Medium Risk  
    - Low suitability (<40%) = High Risk
    """
    if probability >= 0.70:
        return {
            "category": "Low Risk",
            "color": "green",
            "description": "Favorable match with low rejection risk. Recommended for transplant consideration."
        }
    elif probability >= 0.40:
        return {
            "category": "Medium Risk",
            "color": "yellow",
            "description": "Moderate risk detected. Careful clinical monitoring recommended post-transplant."
        }
    else:
        return {
            "category": "High Risk",
            "color": "red",
            "description": "High rejection risk identified. Consider alternative donor options or additional evaluation."
        }

def load_model():
    """Load the Random Forest model and initialize SHAP explainer"""
    global model, shap_explainer
    try:
        # Load the optimized Random Forest model (sklearn Pipeline)
        model_path = Path(__file__).parent / 'model' / 'donor_match_model.pkl'
        
        if not model_path.exists():
            logger.warning(f"Model file not found. Using mock predictions.")
            logger.info("   Place model at: ml-service/model/donor_match_model.pkl")
            return None
        
        model = joblib.load(model_path)
        logger.info(f"✅ Model loaded successfully from: {model_path.name}")
        logger.info(f"   Model type: {type(model).__name__}")
        
        # The model is a Pipeline with 'preprocessor' and 'classifier' steps
        if hasattr(model, 'named_steps'):
            classifier = model.named_steps.get('classifier')
            if classifier:
                logger.info(f"   Classifier: {type(classifier).__name__}")
                logger.info(f"   Random Forest n_estimators: {getattr(classifier, 'n_estimators', 'N/A')}")
                logger.info(f"   Random Forest max_depth: {getattr(classifier, 'max_depth', 'N/A')}")
        
        # Initialize SHAP if available
        if SHAP_AVAILABLE and model is not None:
            try:
                # For sklearn Pipeline, we need the classifier step
                if hasattr(model, 'named_steps') and 'classifier' in model.named_steps:
                    actual_classifier = model.named_steps['classifier']
                    shap_explainer = shap.TreeExplainer(actual_classifier)
                    logger.info("✅ SHAP explainer initialized for Random Forest classifier")
                else:
                    shap_explainer = shap.TreeExplainer(model)
                    logger.info("✅ SHAP explainer initialized")
            except Exception as e:
                logger.warning(f"⚠️  SHAP explainer initialization failed: {e}")
                shap_explainer = None
        
        return model
    except Exception as e:
        logger.error(f"❌ Error loading model: {e}")
        import traceback
        traceback.print_exc()
        return None

def generate_shap_explanation(features_df: pd.DataFrame, model_pipeline, shap_values: np.ndarray) -> List[dict]:
    """
    Generate human-readable SHAP explanations
    Returns top 5 most influential features
    
    Args:
        features_df: Original feature DataFrame (before preprocessing)
        model_pipeline: The sklearn Pipeline with preprocessor and classifier
        shap_values: SHAP values from TreeExplainer (operates on transformed features)
    """
    try:
        if shap_values is None or len(shap_values) == 0:
            return []
        
        # Get SHAP values for this prediction
        # TreeExplainer returns shape (n_samples, n_features, n_classes) for binary classification
        if len(shap_values.shape) == 3:
            # Binary classification - take positive class (index 1)
            shap_vals = shap_values[0, :, 1]
        elif len(shap_values.shape) == 2:
            shap_vals = shap_values[0]
        else:
            logger.warning(f"Unexpected SHAP values shape: {shap_values.shape}")
            return []
        
        # Get transformed feature names from the pipeline
        # The preprocessor expands categorical features via one-hot encoding
        try:
            if hasattr(model_pipeline, 'named_steps') and 'preprocessor' in model_pipeline.named_steps:
                preprocessor = model_pipeline.named_steps['preprocessor']
                
                # Get numeric feature names (unchanged)
                numeric_features = preprocessor.transformers_[0][2]  # ('num', transformer, columns)
                feature_names = list(numeric_features)
                
                # Get categorical feature names (one-hot encoded)
                if len(preprocessor.transformers_) > 1:
                    cat_transformer = preprocessor.transformers_[1][1]  # ('cat', transformer, columns)
                    if hasattr(cat_transformer, 'named_steps') and 'encoder' in cat_transformer.named_steps:
                        encoder = cat_transformer.named_steps['encoder']
                        if hasattr(encoder, 'get_feature_names_out'):
                            cat_features = encoder.get_feature_names_out()
                            feature_names.extend(cat_features)
            else:
                # Fallback: use original feature names
                feature_names = features_df.columns.tolist()
        except Exception as e:
            logger.warning(f"Could not extract feature names from pipeline: {e}")
            feature_names = [f"feature_{i}" for i in range(len(shap_vals))]
        
        # Ensure we have matching lengths
        if len(feature_names) != len(shap_vals):
            logger.warning(f"Feature name count ({len(feature_names)}) != SHAP value count ({len(shap_vals)})")
            feature_names = [f"feature_{i}" for i in range(len(shap_vals))]
        
        # Create feature-importance pairs
        feature_importance = list(zip(feature_names, shap_vals))
        
        # Sort by absolute importance
        feature_importance.sort(key=lambda x: abs(x[1]), reverse=True)
        
        # Get top 5
        top_features = feature_importance[:5]
        
        # Generate explanations
        explanations = []
        for feature, importance in top_features:
            explanations.append({
                "feature": feature,
                "importance": float(importance),
                "description": generate_feature_description(feature, importance)
            })
        
        return explanations
    except Exception as e:
        logger.error(f"Error generating SHAP explanation: {e}")
        import traceback
        traceback.print_exc()
        return []

def generate_feature_description(feature: str, importance: float) -> str:
    """Generate human-readable description for feature importance"""
    impact = "increases" if importance > 0 else "decreases"
    
    # Handle one-hot encoded categorical features
    if 'Donor_ABO_' in feature or 'Recipient_ABO_' in feature:
        blood_type = feature.split('_')[-1]
        if 'Donor' in feature:
            return f"Donor blood type {blood_type} {impact} compatibility"
        else:
            return f"Recipient blood type {blood_type} {impact} compatibility"
    
    descriptions = {
        'Donor_Age': f"Donor age {impact} compatibility risk",
        'Recipient_Age': f"Recipient age {impact} compatibility risk",
        'Age_Gap': f"Age gap between donor and recipient {impact} risk",
        'Donor_eGFR': f"Donor kidney function (GFR) {impact} success probability",
        'Recipient_PRA': f"Recipient antibody sensitization {impact} rejection risk",
        'Donor_DM': f"Donor diabetes status {impact} rejection risk",
        'Donor_HTN': f"Donor hypertension {impact} compatibility",
        'Donor_Smoking': f"Donor smoking history {impact} organ quality",
        'Dialysis_Years': f"Time on dialysis {impact} transplant urgency",
        'Previous_Transplants': f"Previous transplant history {impact} risk",
        'Donor_BMI': f"Donor BMI {impact} surgical risk",
        'Donor_Risk_Index': f"Composite donor health score {impact} overall risk",
        'HLA_Match_Score': f"HLA tissue compatibility {impact} rejection risk (strongest factor)",
        'ABO_Compatibility': f"Blood type compatibility {impact} safety (critical factor)",
    }
    
    return descriptions.get(feature, f"{feature} {impact} prediction")

def generate_explanation_text(shap_explanations: List[dict]) -> str:
    """Generate concise explanation text from SHAP values"""
    if not shap_explanations:
        return "Match assessed based on clinical parameters."
    
    top_factor = shap_explanations[0]
    return f"Primary factor: {top_factor['description']}"

def check_blood_group_compatibility(donor_bg: str, recipient_bg: str) -> bool:
    """Check if donor blood group is compatible with recipient"""
    return recipient_bg in BLOOD_GROUP_COMPATIBILITY.get(donor_bg, [])

def prepare_features(donor: DonorData, recipient: RecipientData) -> pd.DataFrame:
    """
    Prepare features for model prediction matching the EXACT trained model schema.
    
    The trained model was built with a preprocessing pipeline that includes:
    - Numeric features: mean imputation + standard scaling
    - Categorical features: most frequent imputation + one-hot encoding
    
    Feature order matches the trained notebook model.
    """
    
    # Blood group encoding for categorical features (will be one-hot encoded)
    donor_abo_raw = donor.bloodGroup[0] if donor.bloodGroup else 'O'  # Extract A, B, AB, O
    recipient_abo_raw = recipient.bloodGroup[0] if recipient.bloodGroup else 'O'
    
    # Normalize AB blood group
    if donor.bloodGroup.startswith('AB'):
        donor_abo_raw = 'AB'
    if recipient.bloodGroup.startswith('AB'):
        recipient_abo_raw = 'AB'
    
    # ABO Compatibility (1 if compatible, 0 if not)
    abo_compatibility = 1 if check_blood_group_compatibility(donor.bloodGroup, recipient.bloodGroup) else 0
    
    # Age Gap
    age_gap = abs(donor.age - recipient.age)
    
    # HLA Match Score (0-6) - REAL clinical HLA matching
    donor_hla = getattr(donor, 'hlaTyping', '') or ''
    recipient_hla = getattr(recipient, 'hlaTyping', '') or ''
    hla_match_score = calculate_hla_match_score(donor_hla, recipient_hla)
    
    # Recipient PRA calculation (0-100) - Panel Reactive Antibody
    # Estimate based on sensitization factors
    recipient_pra = min(100, recipient.previousTransplants * 30 + (20 if recipient.diabetes else 0))
    
    # Donor Risk Index - Composite score of donor health (matching training data)
    age_factor = (donor.age - 20) / 30  # Normalized age risk (0-1.3 for ages 20-60)
    bmi_factor = abs(donor.bmi - 24) / 10  # Deviation from ideal BMI (~24)
    gfr_factor = max(0, (120 - donor.gfr) / 60)  # Lower GFR = higher risk
    comorbidity_factor = (int(donor.hypertension) * 0.5) + (int(donor.diabetes) * 0.8)
    donor_risk_index = 1.0 + age_factor + bmi_factor + gfr_factor + comorbidity_factor
    
    # Create feature dictionary matching TRAINED MODEL schema
    # These must match the columns used during training in donor.ipynb
    features = {
        # Donor features
        'Donor_Age': float(donor.age),
        'Donor_BMI': float(donor.bmi),
        'Donor_eGFR': float(donor.gfr),
        'Donor_HTN': int(donor.hypertension),
        'Donor_DM': int(donor.diabetes),
        'Donor_Smoking': int(donor.smoking),
        'Donor_ABO': donor_abo_raw,  # Categorical: will be one-hot encoded
        
        # Recipient features  
        'Recipient_Age': float(recipient.age),
        'Recipient_ABO': recipient_abo_raw,  # Categorical: will be one-hot encoded
        'Recipient_PRA': float(recipient_pra),
        'Dialysis_Years': float(recipient.dialysisYears),
        'Previous_Transplants': int(recipient.previousTransplants),
        
        # Rule-based features (computed, not learned)
        'HLA_Match_Score': int(hla_match_score),
        'ABO_Compatibility': int(abo_compatibility),
        
        # Derived features
        'Age_Gap': float(age_gap),
        'Donor_Risk_Index': float(donor_risk_index)
    }
    
    # Create DataFrame
    df = pd.DataFrame([features])
    
    return df



def mock_prediction(donor: DonorData, recipient: RecipientData) -> float:
    """Generate mock prediction when model is not available"""
    
    # Check blood group compatibility
    blood_compatible = check_blood_group_compatibility(donor.bloodGroup, recipient.bloodGroup)
    
    # Calculate HLA match score (0-6)
    donor_hla = getattr(donor, 'hlaTyping', '') or ''
    recipient_hla = getattr(recipient, 'hlaTyping', '') or ''
    hla_match_score = calculate_hla_match_score(donor_hla, recipient_hla)
    
    # Calculate risk score (0-1, where 0 = no risk, 1 = high risk)
    # Start with base risk based on HLA matching (most important factor)
    # Perfect HLA match (6/6) = 0.15 base risk (15% rejection)
    # No HLA match (0/6) = 0.75 base risk (75% rejection)
    base_risk = 0.75 - (hla_match_score / 6) * 0.6  # 6/6 = 0.15, 0/6 = 0.75
    
    # Blood compatibility adjustment (critical factor)
    if not blood_compatible:
        base_risk += 0.2  # Incompatible blood = +20% risk
    
    # Age difference penalty (moderate factor)
    age_diff = abs(donor.age - recipient.age)
    if age_diff > 20:
        base_risk += 0.05
    elif age_diff > 30:
        base_risk += 0.10
    
    # Donor health factors (moderate impact)
    if donor.diabetes:
        base_risk += 0.08
    if donor.hypertension:
        base_risk += 0.05
    if donor.smoking:
        base_risk += 0.05
    
    # Donor kidney function (important factor)
    if donor.gfr < 60:
        base_risk += 0.15  # Reduced function = +15% risk
    elif donor.gfr < 90:
        base_risk += 0.05  # Slightly reduced = +5% risk
    
    # Recipient sensitization (previous transplants increase risk)
    if recipient.previousTransplants > 0:
        base_risk += 0.08 * recipient.previousTransplants  # +8% per previous transplant
    
    # Ensure risk is between 0 and 1
    risk = max(0.0, min(1.0, base_risk))
    
    # Log the calculation for debugging
    print(f"\n=== Mock Prediction Calculation ===")
    print(f"HLA Match: {hla_match_score}/6 → Base Risk: {0.75 - (hla_match_score / 6) * 0.6:.2f}")
    print(f"Blood Compatible: {blood_compatible}")
    print(f"Age Diff: {age_diff} years")
    print(f"Donor Health: DM={donor.diabetes}, HTN={donor.hypertension}, Smoking={donor.smoking}")
    print(f"Donor GFR: {donor.gfr}")
    print(f"Previous Transplants: {recipient.previousTransplants}")
    print(f"Final Risk Probability: {risk:.2f} ({risk*100:.0f}%)")
    print(f"Compatibility Score: {(1-risk)*100:.0f}%")
    print(f"===================================\n")
    
    return risk

@app.on_event("startup")
async def startup_event():
    """Load model on startup"""
    load_model()

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "NephroSense ML Service",
        "version": "1.0.0",
        "status": "running",
        "model_loaded": model is not None
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_status": "loaded" if model is not None else "not_loaded"
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    """
    Predict donor-recipient compatibility with SHAP explanations
    
    Returns compatibility probability, risk category, and SHAP-based explanation
    """
    try:
        donor = request.donor
        recipient = request.recipient
        
        # Check blood group compatibility first
        blood_compatible = check_blood_group_compatibility(donor.bloodGroup, recipient.bloodGroup)
        
        shap_explanation = []
        
        if model is not None:
            # Use actual trained model
            features_df = prepare_features(donor, recipient)
            probability = float(model.predict_proba(features_df)[0][1])
            
            # Generate SHAP explanation if available
            if shap_explainer is not None:
                try:
                    # Transform features for SHAP (TreeExplainer operates on transformed space)
                    X_transformed = model.named_steps['preprocessor'].transform(features_df)
                    shap_values = shap_explainer.shap_values(X_transformed)
                    shap_explanation = generate_shap_explanation(features_df, model, shap_values)
                except Exception as e:
                    logger.warning(f"SHAP explanation failed: {e}")
        else:
            # Use mock prediction
            probability = mock_prediction(donor, recipient)
            logger.info("Using mock prediction (model not loaded)")
        
        # Apply blood group compatibility constraint
        if not blood_compatible:
            probability = min(probability, 0.3)  # Cap probability for incompatible blood groups
        
        # Categorize risk
        risk_category = categorize_risk(probability)
        
        # Determine suitability based on threshold
        suitability = "Suitable" if probability >= THRESHOLD else "Not Suitable"
        
        # Determine confidence level
        if probability >= 0.8 or probability <= 0.2:
            confidence = "High"
        elif probability >= 0.6 or probability <= 0.4:
            confidence = "Moderate"
        else:
            confidence = "Low"
        
        # Additional message
        if not blood_compatible:
            message = "Blood group incompatibility detected. This significantly reduces compatibility."
        elif suitability == "Suitable":
            message = "Prediction indicates suitable match. Clinical review recommended."
        else:
            message = "Prediction indicates potential concerns. Detailed clinical assessment required."
        
        return PredictionResponse(
            probability=round(probability, 4),
            suitability=suitability,
            threshold=THRESHOLD,
            confidence=confidence,
            message=message,
            riskCategory=RiskCategory(**risk_category),
            shapExplanation=[SHAPExplanation(**exp) for exp in shap_explanation] if shap_explanation else None
        )
        
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/predict-batch", response_model=BatchPredictionResponse)
async def predict_batch(request: BatchPredictionRequest):
    """
    Batch prediction for multiple donors against one recipient
    
    Returns ranked list of donors with risk categorization and SHAP explanations
    """
    try:
        recipient = request.recipient
        donors = request.donors
        
        if not donors:
            raise HTTPException(status_code=400, detail="No donors provided")
        
        predictions = []
        
        # Process each donor
        for donor in donors:
            donor_id = donor.donorId or f"Donor_{len(predictions) + 1}"
            
            # ===== ENHANCED DEBUG LOGGING =====
            print(f"\n{'='*70}")
            print(f"PROCESSING DONOR: {donor_id}")
            print(f"{'='*70}")
            print(f"Donor object type: {type(donor)}")
            print(f"Donor has hlaTyping attr: {hasattr(donor, 'hlaTyping')}")
            if hasattr(donor, 'hlaTyping'):
                donor_hla_value = getattr(donor, 'hlaTyping', None)
                print(f"Donor hlaTyping value: '{donor_hla_value}'")
                print(f"Donor hlaTyping type: {type(donor_hla_value)}")
                print(f"Donor hlaTyping length: {len(donor_hla_value) if donor_hla_value else 0}")
            
            print(f"\nRecipient object type: {type(recipient)}")
            print(f"Recipient has hlaTyping attr: {hasattr(recipient, 'hlaTyping')}")
            if hasattr(recipient, 'hlaTyping'):
                recipient_hla_value = getattr(recipient, 'hlaTyping', None)
                print(f"Recipient hlaTyping value: '{recipient_hla_value}'")
                print(f"Recipient hlaTyping type: {type(recipient_hla_value)}")
                print(f"Recipient hlaTyping length: {len(recipient_hla_value) if recipient_hla_value else 0}")
            print(f"{'='*70}\n")
            # ===== END DEBUG LOGGING =====
            
            # Calculate HLA match score
            donor_hla = getattr(donor, 'hlaTyping', '') or ''
            recipient_hla = getattr(recipient, 'hlaTyping', '') or ''
            hla_match_score = calculate_hla_match_score(donor_hla, recipient_hla)
            hla_match_level = get_hla_match_level(hla_match_score)
            
            # Check blood group compatibility
            blood_compatible = check_blood_group_compatibility(donor.bloodGroup, recipient.bloodGroup)
            
            # Initialize SHAP explanation
            shap_explanation = []
            
            # Make prediction
            if model is not None:
                try:
                    # Use actual trained model
                    features_df = prepare_features(donor, recipient)
                    
                    # Log features being sent to model
                    print(f"\n{'🔬 FEATURES DEBUG ' + '='*52}")
                    print(f"  Donor: {donor_id}")
                    print(f"  HLA Match Score: {hla_match_score}/6 ({hla_match_level})")
                    print(f"  Blood Compatible: {blood_compatible}")
                    print(f"\n  Input Features to Model:")
                    # Assuming features_df is a DataFrame with a single row
                    if not features_df.empty:
                        for idx, (key, value) in enumerate(features_df.iloc[0].items()):
                            print(f"    [{idx+1:2d}] {key:25s}: {value:.4f}" if isinstance(value, (int, float)) else f"    [{idx+1:2d}] {key:25s}: {value}")
                    else:
                        print("    ⚠️  No features generated for prediction.")
                    print(f"{'='*70}")
                    
                    # Get raw model output
                    raw_proba = model.predict_proba(features_df)[0][1]
                    probability = float(raw_proba)
                    
                    # CRITICAL DEBUG: Track unique probabilities
                    print(f"\n{'🔍 MODEL OUTPUT DEBUG ' + '='*50}")
                    print(f"  Donor ID: {donor_id}")
                    print(f"  Raw Model Probability: {raw_proba}")
                    print(f"  After float conversion: {probability}")
                    print(f"  After rounding: {round(probability, 4)}")
                    print(f"  Model type: {type(model).__name__}")
                    print(f"  Features shape: {features_df.shape}")
                    print(f"  Features hash: {hash(str(features_df.values.tolist()))}")
                    print(f"\nModel Prediction:")
                    print(f"  Suitability Probability: {probability:.4f} ({probability*100:.1f}%)")
                    print(f"{'='*70}\n")
                    
                    # Generate SHAP explanation if available
                    if shap_explainer is not None:
                        try:
                            # Transform features for SHAP
                            X_transformed = model.named_steps['preprocessor'].transform(features_df)
                            shap_values = shap_explainer.shap_values(X_transformed)
                            shap_explanation = generate_shap_explanation(features_df, model, shap_values)
                        except Exception as e:
                            logger.warning(f"SHAP explanation failed for {donor_id}: {e}")
                except Exception as e:
                    logger.warning(f"Model prediction failed for {donor_id}: {e}")
                    # If model prediction fails, probability might not be set, handle gracefully
                    probability = 0.5 # Default to neutral if prediction fails
            else:
                # Use mock prediction
                probability = mock_prediction(donor, recipient)
            
            # Model already accounts for blood compatibility via ABO_Compatibility feature
            # No need for hard constraint - let model's learned weights handle it
            # Note: Blood incompatibility is factored into the model's 15 features
            
            # Categorize risk
            risk_category = categorize_risk(probability)
            
            # Generate explanation text
            explanation_text = generate_explanation_text(shap_explanation)
            
            # Create parameters object with clinical metrics
            parameters = {
                "hlaMatchScore": hla_match_score,
                "hlaMatchLevel": hla_match_level,
                "bloodGroupCompatible": blood_compatible,
                "donorAge": donor.age,
                "recipientAge": recipient.age,
                "donorGFR": donor.gfr,
                "recipientGFR": recipient.gfr,
                "donorBMI": donor.bmi,
                "recipientBMI": recipient.bmi
            }
            
            # DEBUG: Log what's being stored
            stored_probability = round(probability, 4)
            print(f"📦 STORING: {donor_id} → Probability: {stored_probability}, Risk: {risk_category['category']}")
            
            predictions.append({
                "donorId": donor_id,
                "probability": stored_probability,
                "riskCategory": risk_category,
                "shapExplanation": shap_explanation,
                "explanationText": explanation_text,
                "parameters": parameters,  # Add parameters to response
                "rank": 0  # Will be assigned after sorting
            })
        
        # DEBUG: Log all probabilities before sorting
        print(f"\n{'🔍 PRE-SORT DEBUG ' + '='*55}")
        print(f"Total predictions: {len(predictions)}")
        for p in predictions:
            print(f"  {p['donorId']}: {p['probability']} ({p['riskCategory']['category']})")
        print(f"{'='*70}\n")
        
        # Sort by probability (descending - highest compatibility first)
        # Probability represents SUITABILITY, so higher is better
        predictions.sort(key=lambda x: x["probability"], reverse=True)
        
        # DEBUG: Log all probabilities after sorting
        print(f"\n{'🔍 POST-SORT DEBUG ' + '='*54}")
        for idx, p in enumerate(predictions):
            print(f"  Rank {idx+1}: {p['donorId']} → {p['probability']} ({p['riskCategory']['category']})")
        print(f"{'='*70}\n")
        
        # Assign ranks
        for idx, pred in enumerate(predictions):
            pred["rank"] = idx + 1
        
        # Get top 3 donors (highest compatibility = lowest risk)
        top_donors = predictions[:3]
        
        # Convert to response models
        pred_results = [
            DonorPredictionResult(
                donorId=p["donorId"],
                probability=p["probability"],
                riskCategory=RiskCategory(**p["riskCategory"]),
                shapExplanation=[SHAPExplanation(**exp) for exp in p["shapExplanation"]],
                explanationText=p["explanationText"],
                parameters=p.get("parameters"),  # Include parameters with HLA scores
                rank=p["rank"]
            )
            for p in predictions
        ]
        
        top_donor_results = [
            DonorPredictionResult(
                donorId=p["donorId"],
                probability=p["probability"],
                riskCategory=RiskCategory(**p["riskCategory"]),
                shapExplanation=[SHAPExplanation(**exp) for exp in p["shapExplanation"]],
                explanationText=p["explanationText"],
                parameters=p.get("parameters"),  # Include parameters with HLA scores
                rank=p["rank"]
            )
            for p in top_donors
        ]
        
        logger.info(f"✅ Batch prediction completed: {len(predictions)} donors evaluated")
        
        return BatchPredictionResponse(
            success=True,
            predictions=pred_results,
            topDonors=top_donor_results,
            totalEvaluated=len(predictions)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Batch prediction error: {e}")
        raise HTTPException(status_code=500, detail=f"Batch prediction failed: {str(e)}")

@app.get("/model-info")
async def model_info():
    """Get information about the loaded model"""
    if model is None:
        return {
            "model_loaded": False,
            "message": "Model not loaded. Using mock predictions.",
            "threshold": THRESHOLD,
            "shap_available": SHAP_AVAILABLE
        }
    
    return {
        "model_loaded": True,
        "model_type": type(model).__name__,
        "threshold": THRESHOLD,
        "shap_available": SHAP_AVAILABLE and shap_explainer is not None,
        "features_count": len(model.feature_names_in_) if hasattr(model, 'feature_names_in_') else "Unknown"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
