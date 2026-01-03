from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import joblib
import pandas as pd
import numpy as np
from pathlib import Path
import logging

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
    rank: int

class BatchPredictionResponse(BaseModel):
    success: bool
    predictions: List[DonorPredictionResult]
    topDonors: List[DonorPredictionResult]
    totalEvaluated: int

# Global variable to store loaded model and SHAP explainer
model = None
shap_explainer = None
THRESHOLD = 0.5  # Classification threshold

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
    Categorize risk based on probability
    Research thresholds: Low (0-30%), Medium (31-60%), High (>60%)
    """
    if probability <= 0.30:
        return {
            "category": "Low Risk",
            "color": "green",
            "description": "Favorable match with low rejection risk. Recommended for transplant consideration."
        }
    elif probability <= 0.60:
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
        # For demonstration purposes, use mock predictions
        # The actual model requires exact feature alignment which can be configured later
        logger.info("ℹ️  Using mock predictions for demonstration")
        logger.info("   Mock predictions provide realistic results for testing")
        return None
        
        # Uncomment below to use actual model when features are properly aligned
        # model_path = Path(__file__).parent / 'model' / 'donor_match_model_final_random_forest.pkl'
        # 
        # if not model_path.exists():
        #     model_path = Path(__file__).parent.parent / 'donor_match_model_final_random_forest.pkl'
        # 
        # if not model_path.exists():
        #     logger.warning(f"Model file not found. Using mock predictions.")
        #     return None
        # 
        # model = joblib.load(model_path)
        # logger.info("✅ Model loaded successfully")
        # 
        # if SHAP_AVAILABLE and model is not None:
        #     try:
        #         shap_explainer = shap.TreeExplainer(model)
        #         logger.info("✅ SHAP explainer initialized")
        #     except Exception as e:
        #         logger.warning(f"⚠️ SHAP explainer initialization failed: {e}")
        #         shap_explainer = None
        # 
        # return model
    except Exception as e:
        logger.error(f"❌ Error loading model: {e}")
        return None

def generate_shap_explanation(features_df: pd.DataFrame, shap_values: np.ndarray) -> List[dict]:
    """
    Generate human-readable SHAP explanations
    Returns top 5 most influential features
    """
    try:
        if shap_values is None or len(shap_values) == 0:
            return []
        
        # Get feature names
        feature_names = features_df.columns.tolist()
        
        # Get SHAP values for this prediction (class 1 - positive outcome)
        if len(shap_values.shape) == 3:
            # Multi-output format
            shap_vals = shap_values[0][:, 1]
        else:
            shap_vals = shap_values[0]
        
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
        return []

def generate_feature_description(feature: str, importance: float) -> str:
    """Generate human-readable description for feature importance"""
    impact = "increases" if importance > 0 else "decreases"
    
    descriptions = {
        'donor_age': f"Donor age {impact} compatibility risk",
        'recipient_age': f"Recipient age {impact} compatibility risk",
        'age_difference': f"Age gap between donor and recipient {impact} risk",
        'donor_gfr': f"Donor kidney function (GFR) {impact} success probability",
        'recipient_gfr': f"Recipient kidney function {impact} outcome",
        'donor_diabetes': f"Donor diabetes status {impact} rejection risk",
        'recipient_diabetes': f"Recipient diabetes {impact} transplant risk",
        'donor_hypertension': f"Donor hypertension {impact} compatibility",
        'recipient_hypertension': f"Recipient hypertension {impact} outcomes",
        'recipient_dialysis_years': f"Time on dialysis {impact} transplant urgency",
        'recipient_previous_transplants': f"Previous transplant history {impact} risk",
        'donor_creatinine': f"Donor creatinine levels {impact} kidney health assessment",
        'recipient_creatinine': f"Recipient creatinine {impact} baseline health",
        'bmi_difference': f"BMI difference {impact} surgical risk",
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
    """Prepare features for model prediction matching the trained model's feature names"""
    
    # Blood group encoding (A=0, B=1, AB=2, O=3)
    blood_group_map = {'A+': 0, 'A-': 0, 'B+': 1, 'B-': 1, 'AB+': 2, 'AB-': 2, 'O+': 3, 'O-': 3}
    donor_abo = blood_group_map.get(donor.bloodGroup, 3)
    recipient_abo = blood_group_map.get(recipient.bloodGroup, 3)
    
    # Check blood compatibility (1 if compatible, 0 if not)
    abo_compatibility = 1 if check_blood_group_compatibility(donor.bloodGroup, recipient.bloodGroup) else 0
    
    # Calculate HLA match score (mock - in real system this would be calculated from HLA typing)
    # For now, use a random value between 0-6 based on age similarity
    age_diff = abs(donor.age - recipient.age)
    hla_match_score = max(0, 6 - int(age_diff / 10))
    
    # Calculate compatibility index (composite score)
    compatibility_index = (
        (1 if abo_compatibility else 0) * 0.4 +
        (hla_match_score / 6) * 0.3 +
        (1 - min(1, age_diff / 50)) * 0.3
    )
    
    # Calculate donor risk index
    donor_risk_index = (
        (1 if donor.smoking else 0) * 0.2 +
        (1 if donor.diabetes else 0) * 0.3 +
        (1 if donor.hypertension else 0) * 0.3 +
        (1 - min(1, donor.gfr / 100)) * 0.2
    )
    
    # Age gap
    age_gap = abs(donor.age - recipient.age)
    
    # Recipient PRA (Panel Reactive Antibody) - mock value based on previous transplants
    recipient_pra = min(100, recipient.previousTransplants * 30 + (1 if recipient.diabetes else 0) * 20)
    
    # Risk category (0=low, 1=medium, 2=high) - based on multiple factors
    risk_score = donor_risk_index + (recipient.previousTransplants * 0.2) + ((100 - donor.gfr) / 100 * 0.3)
    if risk_score < 0.3:
        risk_category = 0
    elif risk_score < 0.6:
        risk_category = 1
    else:
        risk_category = 2
    
    # Risk probability (continuous value 0-1)
    risk_probability = min(1.0, max(0.0, risk_score))
    
    # Create feature dictionary with exact names the model expects
    features = {
        'Donor_ABO': donor_abo,
        'Donor_BMI': donor.bmi,
        'Dialysis_Years': recipient.dialysisYears,
        'ABO_Compatibility': abo_compatibility,
        'Donor_HTN': int(donor.hypertension),
        'Donor_DM': int(donor.diabetes),  # DM = Diabetes Mellitus
        'Recipient_PRA': recipient_pra,
        'Recipient_ABO': recipient_abo,
        'Recipient_Age': recipient.age,
        'HLA_Match_Score': hla_match_score,
        'Donor_eGFR': donor.gfr,
        'Age_Gap': age_gap,
        'Donor_Age': donor.age,
        'Compatibility_Index': compatibility_index,
        'Donor_Risk_Index': donor_risk_index,
        'Risk_Category': risk_category,
        'Risk_Probability': risk_probability
    }
    
    return pd.DataFrame([features])


def mock_prediction(donor: DonorData, recipient: RecipientData) -> float:
    """Generate mock prediction when model is not available"""
    
    # Check blood group compatibility
    blood_compatible = check_blood_group_compatibility(donor.bloodGroup, recipient.bloodGroup)
    
    # Calculate simple risk score
    score = 0.7  # Base score
    
    # Adjust based on blood compatibility
    if not blood_compatible:
        score -= 0.3
    
    # Age difference penalty
    age_diff = abs(donor.age - recipient.age)
    if age_diff > 20:
        score -= 0.1
    
    # Health factors
    if donor.diabetes or donor.hypertension:
        score -= 0.15
    
    if donor.gfr < 60:
        score -= 0.2
    
    if recipient.previousTransplants > 0:
        score -= 0.1 * recipient.previousTransplants
    
    # Ensure score is between 0 and 1
    score = max(0.0, min(1.0, score))
    
    return score

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
                    shap_values = shap_explainer.shap_values(features_df)
                    shap_explanation = generate_shap_explanation(features_df, shap_values)
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
            
            # Check blood group compatibility
            blood_compatible = check_blood_group_compatibility(donor.bloodGroup, recipient.bloodGroup)
            
            shap_explanation = []
            
            if model is not None:
                # Use actual trained model
                features_df = prepare_features(donor, recipient)
                probability = float(model.predict_proba(features_df)[0][1])
                
                # Generate SHAP explanation if available
                if shap_explainer is not None:
                    try:
                        shap_values = shap_explainer.shap_values(features_df)
                        shap_explanation = generate_shap_explanation(features_df, shap_values)
                    except Exception as e:
                        logger.warning(f"SHAP explanation failed for {donor_id}: {e}")
            else:
                # Use mock prediction
                probability = mock_prediction(donor, recipient)
            
            # Apply blood group compatibility constraint
            if not blood_compatible:
                probability = min(probability, 0.3)
            
            # Categorize risk
            risk_category = categorize_risk(probability)
            
            # Generate explanation text
            explanation_text = generate_explanation_text(shap_explanation)
            
            predictions.append({
                "donorId": donor_id,
                "probability": round(probability, 4),
                "riskCategory": risk_category,
                "shapExplanation": shap_explanation,
                "explanationText": explanation_text,
                "rank": 0  # Will be assigned after sorting
            })
        
        # Sort by probability (ascending - lower risk first)
        predictions.sort(key=lambda x: x["probability"])
        
        # Assign ranks
        for idx, pred in enumerate(predictions):
            pred["rank"] = idx + 1
        
        # Get top 3 donors (lowest risk)
        top_donors = predictions[:3]
        
        # Convert to response models
        pred_results = [
            DonorPredictionResult(
                donorId=p["donorId"],
                probability=p["probability"],
                riskCategory=RiskCategory(**p["riskCategory"]),
                shapExplanation=[SHAPExplanation(**exp) for exp in p["shapExplanation"]],
                explanationText=p["explanationText"],
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
