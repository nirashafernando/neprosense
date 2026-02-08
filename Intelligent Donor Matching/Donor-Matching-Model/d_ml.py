"""
Kidney Donor-Recipient Matching Model (Reference Script)
=======================================================

This script demonstrates the hybrid rule-based + ML approach:
- HLA matching: Rule-based (deterministic)
- ABO compatibility: Binary (not learned)
- ML model: Random Forest (interpretable, SHAP-compatible)
"""

import pandas as pd
import numpy as np
import joblib
import os
import sys
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, roc_auc_score

# Import HLA matching module
sys.path.append('utils')
from hla_matching import HLAMatcher, compute_hla_matches

# Configuration
DATA_PATH = "kidney_donor_dataset.csv"
RANDOM_STATE = 42

print("="*70)
print("KIDNEY DONOR MATCHING - REFERENCE TRAINING SCRIPT")
print("="*70)
print("⚠️  This is a reference script for reproducibility")
print("✓  Final model must be created from donor.ipynb")
print("="*70)

# Load dataset
df = pd.read_csv(DATA_PATH)
print(f"\nLoaded dataset: {df.shape}")
print(f"Columns: {df.columns.tolist()}")

# Compute HLA match scores (rule-based)
print("\n" + "="*70)
print("COMPUTING HLA MATCH SCORES (RULE-BASED)")
print("="*70)

hla_matcher = HLAMatcher()
hla_scores, hla_qualities = compute_hla_matches(
    df['Donor_HLA_Typing'], 
    df['Recipient_HLA_Typing']
)

df['HLA_Match_Score'] = hla_scores
df['HLA_Match_Quality'] = hla_qualities

print(f"✓ HLA scores computed")
print(f"HLA score distribution:\n{df['HLA_Match_Score'].value_counts().sort_index()}")

# Identify target column
possible_target_names = ['match_label', 'Suitability', 'target']
target_col = None
for name in possible_target_names:
    if name in df.columns:
        target_col = name
        break

if target_col is None:
    target_col = df.columns[-1]

print(f"\nTarget column: {target_col}")

print(f"\nTarget column: {target_col}")

# Convert target to binary
if df[target_col].dtype == 'object':
    df['target'] = df[target_col].apply(lambda x: 1 if 'Suitable' in str(x) else 0)
else:
    df['target'] = df[target_col]

print(f"Class distribution:\n{df['target'].value_counts()}")

# Feature selection
exclude_cols = [
    'target', target_col, 'donor_id', 'Donor_ID', 'Recipient_ID',
    'Donor_HLA_Typing', 'Recipient_HLA_Typing',  # Raw HLA strings
    'HLA_Match_Quality',  # Qualitative label (use numeric score)
    'Compatibility_Index', 'Risk_Probability', 'Risk_Category'  # Derived columns
]

feature_cols = [col for col in df.columns if col not in exclude_cols]

print(f"\n" + "="*70)
print(f"FEATURE SELECTION")
print(f"="*70)
print(f"Total features: {len(feature_cols)}")
print(f"Features: {feature_cols}")

# Verify rule-based features
if 'HLA_Match_Score' in feature_cols:
    print("✓ HLA_Match_Score included (rule-based)")
if 'ABO_Compatibility' in feature_cols:
    print("✓ ABO_Compatibility included (binary)")

# Prepare feature matrix
X = df[feature_cols]
y = df['target']

# Identify numeric and categorical features
numeric_cols = X.select_dtypes(include=['int64', 'float64']).columns.tolist()
cat_cols = X.select_dtypes(include=['object', 'category']).columns.tolist()

print(f"Numeric features: {len(numeric_cols)}")
print(f"Categorical features: {len(cat_cols)}")

# Build preprocessing pipeline
numeric_pipeline = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='mean')), 
    ('scaler', StandardScaler())
])

categorical_pipeline = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='most_frequent')), 
    ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
])

preprocessor = ColumnTransformer(
    transformers=[
        ('num', numeric_pipeline, numeric_cols), 
        ('cat', categorical_pipeline, cat_cols)
    ], 
    remainder='drop'
)

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=RANDOM_STATE, stratify=y
)

print(f"\n" + "="*70)
print(f"DATA SPLIT")
print(f"="*70)
print(f"Training: {X_train.shape[0]} samples")
print(f"Test: {X_test.shape[0]} samples")

# Build Random Forest pipeline
print(f"\n" + "="*70)
print(f"TRAINING RANDOM FOREST")
print(f"="*70)

model = RandomForestClassifier(
    n_estimators=150,
    max_depth=8,
    min_samples_split=15,
    min_samples_leaf=10,
    random_state=RANDOM_STATE
)

pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor), 
    ('model', model)
])

pipeline.fit(X_train, y_train)

pipeline.fit(X_train, y_train)

# Evaluate model
y_pred = pipeline.predict(X_test)
y_probs = pipeline.predict_proba(X_test)[:, 1]

acc = accuracy_score(y_test, y_pred)
roc_auc = roc_auc_score(y_test, y_probs)

print(f"\n" + "="*70)
print(f"MODEL PERFORMANCE")
print(f"="*70)
print(f"Accuracy: {acc * 100:.2f}%")
print(f"ROC-AUC: {roc_auc:.4f}")
print(f"\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=['Not Suitable', 'Suitable']))

print(f"\n" + "="*70)
print(f"⚠️  MODEL NOT SAVED (Reference Script Only)")
print(f"="*70)
print(f"✓  This script demonstrates the training process")
print(f"✓  Final model must be saved from donor.ipynb")
print(f"✓  Expected final model file: donor_match_model_final.pkl")
print(f"="*70)

print("\n📋 Summary:")
print(f"  - HLA matching: Rule-based (not ML-learned)")
print(f"  - ABO compatibility: Binary (not ML-learned)")
print(f"  - Model type: Random Forest")
print(f"  - Features: {len(feature_cols)}")
print(f"  - Accuracy: {acc * 100:.2f}%")
print(f"  - ROC-AUC: {roc_auc:.4f}")
print(f"  - Random seed: {RANDOM_STATE} (reproducible)")
print("\n✓ Training script complete")
