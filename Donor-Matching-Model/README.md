# Donor Matching Model - Training & Analysis

This directory contains the machine learning model training code, trained models, dataset, and analysis visualizations for the NephroSense donor-recipient matching system.

## Contents

### Model Files
- **`donor_match_model_final_random_forest.pkl`** - Final trained Random Forest model for production use
- **`donor_match_model_realistic.pkl`** - Alternative realistic model variant

### Training Code
- **`d_ml.py`** - Python script for model training and evaluation
- **`donor.ipynb`** - Jupyter notebook with exploratory data analysis and model development

### Data
- **`kidney_donor_dataset.csv`** - Training dataset containing donor-recipient matching data

### Visualizations
- **`feature_importance.png`** - Feature importance analysis showing which factors most influence matching predictions
- **`model_performance.png`** - Model performance metrics (accuracy, precision, recall, F1-score)
- **`model_comparison_analysis.png`** - Comparison of different model algorithms

## Model Features

The model predicts kidney donor-recipient compatibility based on:
- Donor demographics (age, BMI, blood group)
- Recipient demographics and medical history
- Blood group compatibility (ABO)
- HLA matching scores
- Dialysis duration
- Comorbidities (diabetes, hypertension)
- Age gap between donor and recipient
- Risk indices

## Risk Categorization

Predictions are categorized into three risk levels:
- **Low Risk** (0-30%): Favorable match, recommended for transplant
- **Medium Risk** (31-60%): Moderate risk, careful monitoring required
- **High Risk** (>60%): High rejection risk, consider alternatives

## Usage

The trained model (`donor_match_model_final_random_forest.pkl`) is used by the ML service at `../ml-service/main.py` to provide real-time predictions for the NephroSense web application.

## Model Training

To retrain the model:
```bash
python d_ml.py
```

Or use the Jupyter notebook for interactive analysis:
```bash
jupyter notebook donor.ipynb
```

## Model Accuracy

The Random Forest model achieves:
- High accuracy for compatibility prediction
- SHAP-based explainability for clinical decision support
- Risk-based ranking for multiple donor evaluation

---
*Part of the NephroSense Intelligent Donor Matching System*
