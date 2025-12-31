
import pandas as pd, numpy as np, joblib, os
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import accuracy_score, classification_report, mean_squared_error

DATA_PATH = "/mnt/data/don_data (1).csv"
df = pd.read_csv(DATA_PATH, encoding='latin1')
print("Loaded CSV shape:", df.shape)
print("Columns sample:", df.columns.tolist()[:10])

possible_target_names = ['match', 'is_match', 'compatible', 'label', 'match_label', 'match_score', 'score', 'target']
target_col = None
for name in possible_target_names:
    if name in df.columns.str.lower():
        target_col = [c for c in df.columns if c.lower() == name][0]
        break
if target_col is None:
    target_col = df.columns[-1]
    print("Defaulting to last column as target:", target_col)
else:
    print("Detected target:", target_col)

X = df.drop(columns=[target_col])
y = df[target_col]

is_classification = False
if y.dtype == 'object' or y.dtype.name == 'category':
    is_classification = True
else:
    if y.nunique() <= 10:
        is_classification = True

numeric_cols = X.select_dtypes(include=['number']).columns.tolist()
cat_cols = X.select_dtypes(include=['object', 'category', 'bool']).columns.tolist()
print("Numeric cols count:", len(numeric_cols), "Categorical cols count:", len(cat_cols))

numeric_pipeline = Pipeline(steps=[('imputer', SimpleImputer(strategy='mean')), ('scaler', StandardScaler())])
categorical_pipeline = Pipeline(steps=[('imputer', SimpleImputer(strategy='most_frequent')), ('onehot', OneHotEncoder(handle_unknown='ignore', sparse=False))])
preprocessor = ColumnTransformer(transformers=[('num', numeric_pipeline, numeric_cols), ('cat', categorical_pipeline, cat_cols)], remainder='drop')

if is_classification:
    model = RandomForestClassifier(n_estimators=200, random_state=42)
else:
    model = RandomForestRegressor(n_estimators=200, random_state=42)

pipeline = Pipeline(steps=[('preprocessor', preprocessor), ('model', model)])

stratify_param = None
if is_classification:
    vc = y.value_counts()
    if (vc >= 2).all():
        stratify_param = y
    else:
        stratify_param = None
        print("Some classes in target have <2 samples; skipping stratify to avoid errors.")

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=42, stratify=stratify_param)
print("Training on", X_train.shape[0], "rows; testing on", X_test.shape[0], "rows")

pipeline.fit(X_train, y_train)

if is_classification:
    y_pred = pipeline.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print("Test accuracy:", acc)
    print("Classification report:")
    print(classification_report(y_test, y_pred))
else:
    y_pred = pipeline.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    print("Test RMSE:", rmse)

MODEL_PATH = "/mnt/data/donor_match_model.pkl"
joblib.dump(pipeline, MODEL_PATH)
print("Saved model to:", MODEL_PATH)

def recommend_for_patient(patient_row, donors_df, donor_id_col=None, top_k=5):
    donor_candidates = donors_df.copy()
    if donor_id_col and donor_id_col in donor_candidates.columns and donor_id_col in patient_row.index:
        donor_candidates = donor_candidates[donor_candidates[donor_id_col] != patient_row[donor_id_col]]
    features = donor_candidates.drop(columns=[target_col], errors='ignore')
    try:
        if is_classification and hasattr(pipeline.named_steps['model'], "predict_proba"):
            probs = pipeline.predict_proba(features)
            if probs.shape[1] == 2:
                scores = probs[:,1]
            else:
                scores = probs.max(axis=1)
        else:
            scores = pipeline.predict(features)
    except Exception:
        num_cols = numeric_cols.copy()
        if len(num_cols) == 0:
            scores = np.zeros(len(features))
        else:
            pat_vals = patient_row[num_cols].astype(float).fillna(0).values
            feat_vals = features[num_cols].fillna(0).values
            dists = np.linalg.norm(feat_vals - pat_vals, axis=1)
            scores = -dists
    donor_candidates = donor_candidates.reset_index(drop=True)
    donor_candidates['match_score'] = scores
    return donor_candidates.sort_values('match_score', ascending=False).head(top_k)

id_cols = [c for c in df.columns if 'id' in c.lower()]
patient_id_col = id_cols[0] if len(id_cols)>=1 else None
donor_id_col = id_cols[1] if len(id_cols)>=2 else None
print("ID columns heuristic:", id_cols)

role_cols = [c for c in df.columns if c.lower() in ('role','party','type')]
patient_row = None
if role_cols:
    rc = role_cols[0]
    if 'recipient' in df[rc].astype(str).str.lower().unique():
        patient_row = df[df[rc].str.lower()=='recipient'].iloc[0]
    elif 'patient' in df[rc].astype(str).str.lower().unique():
        patient_row = df[df[rc].str.lower()=='patient'].iloc[0]
if patient_row is None:
    patient_row = df.iloc[0]

print("Using patient row:")
display(patient_row.head(20))

recs = recommend_for_patient(patient_row, df, donor_id_col=donor_id_col, top_k=5)
print("Top recommendations:")
display(recs.head(10))

RECO_PATH = "/mnt/data/donor_recommendations_sample.csv"
recs.to_csv(RECO_PATH, index=False)
print("Saved recommendations to:", RECO_PATH)
