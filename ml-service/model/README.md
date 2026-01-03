# ML Service Model Directory

This directory should contain the trained Random Forest model file:
- `donor_match_model_final_random_forest.pkl`

## Model File Location

If you have a trained model, place it in this directory. The ML service will automatically load it on startup.

If no model file is found, the service will use mock predictions based on clinical rules:
- Blood group compatibility
- Age difference
- Donor health factors (GFR, diabetes, hypertension)
- Recipient history (previous transplants)

## Expected Model Features

The model should accept the following features (in order):
1. donor_age
2. donor_bmi
3. donor_creatinine
4. donor_gfr
5. donor_systolic_bp
6. donor_diastolic_bp
7. donor_smoking (0/1)
8. donor_diabetes (0/1)
9. donor_hypertension (0/1)
10. recipient_age
11. recipient_bmi
12. recipient_creatinine
13. recipient_gfr
14. recipient_systolic_bp
15. recipient_diastolic_bp
16. recipient_dialysis_years
17. recipient_diabetes (0/1)
18. recipient_hypertension (0/1)
19. recipient_previous_transplants
20. age_difference
21. bmi_difference

## Training Your Model

If you need to train a new model, ensure it:
- Is a scikit-learn RandomForestClassifier
- Is saved using joblib.dump()
- Has probability calibration enabled
- Uses the features listed above
