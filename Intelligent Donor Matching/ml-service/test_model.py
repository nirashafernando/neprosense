"""
Quick test script to verify model loading and prediction
"""
import joblib
import pandas as pd
import numpy as np
from pathlib import Path

# Load model
model_path = Path('model/donor_match_model.pkl')
print(f"Loading model from: {model_path}")
print(f"Model exists: {model_path.exists()}")

if model_path.exists():
    model = joblib.load(model_path)
    print(f"\n✅ Model loaded successfully!")
    print(f"   Type: {type(model).__name__}")
    
    # Check if it's a pipeline
    if hasattr(model, 'named_steps'):
        print(f"   Pipeline steps: {list(model.named_steps.keys())}")
        
        if 'preprocessor' in model.named_steps:
            preprocessor = model.named_steps['preprocessor']
            print(f"   Preprocessor: {type(preprocessor).__name__}")
            
        if 'classifier' in model.named_steps:
            classifier = model.named_steps['classifier']
            print(f"   Classifier: {type(classifier).__name__}")
            print(f"   N-estimators: {getattr(classifier, 'n_estimators', 'N/A')}")
            print(f"   Max depth: {getattr(classifier, 'max_depth', 'N/A')}")
    
    # Create test data
    print("\n📊 Creating test prediction...")
    
    # Calculate Donor_Risk_Index (composite score based on donor health)
    # Formula: age_factor + bmi_factor + gfr_factor + comorbidity_factor
    donor_age = 35.0
    donor_bmi = 24.5
    donor_gfr = 95.0
    donor_htn = 0
    donor_dm = 0
    
    age_factor = (donor_age - 20) / 30  # Normalized age risk
    bmi_factor = abs(donor_bmi - 24) / 10  # Deviation from ideal BMI
    gfr_factor = max(0, (120 - donor_gfr) / 60)  # Lower GFR = higher risk
    comorbidity_factor = (donor_htn * 0.5) + (donor_dm * 0.8)  # Health conditions
    donor_risk_index = 1.0 + age_factor + bmi_factor + gfr_factor + comorbidity_factor
    
    test_data = pd.DataFrame([{
        'Donor_Age': donor_age,
        'Donor_BMI': donor_bmi,
        'Donor_eGFR': donor_gfr,
        'Donor_HTN': donor_htn,
        'Donor_DM': donor_dm,
        'Donor_ABO': 'O',
        'Recipient_Age': 45.0,
        'Recipient_ABO': 'A',
        'Recipient_PRA': 10.0,
        'Dialysis_Years': 2.0,
        'Previous_Transplants': 0,
        'HLA_Match_Score': 4,
        'ABO_Compatibility': 1,
        'Age_Gap': 10.0,
        'Donor_Risk_Index': donor_risk_index
    }])
    
    print(f"   Test data shape: {test_data.shape}")
    print(f"   Test data columns: {test_data.columns.tolist()}")
    
    try:
        # Make prediction
        prediction = model.predict_proba(test_data)
        print(f"\n✅ Prediction successful!")
        print(f"   Probability (Not Suitable): {prediction[0][0]:.4f}")
        print(f"   Probability (Suitable): {prediction[0][1]:.4f}")
        print(f"   Classification: {'Suitable' if prediction[0][1] >= 0.58 else 'Not Suitable'}")
    except Exception as e:
        print(f"\n❌ Prediction failed:")
        print(f"   Error: {e}")
        import traceback
        traceback.print_exc()
else:
    print("\n❌ Model file not found!")
    print("   Make sure to copy donor_match_model_final.pkl to model/donor_match_model.pkl")
