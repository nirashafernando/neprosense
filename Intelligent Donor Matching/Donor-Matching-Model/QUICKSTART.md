# Quick Start Guide

## Kidney Donor-Recipient Matching System

---

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies (1 minute)

```bash
pip install -r requirements.txt
```

**Required packages:**

- pandas, numpy, scikit-learn
- shap, matplotlib, seaborn
- joblib, jupyter

---

### Step 2: Verify HLA Module (Optional - 30 seconds)

```bash
python validate_hla.py
```

**Expected output:**

```
✅ All tests passed! HLA matching module is validated.
```

---

### Step 3: Run the Notebook (3 minutes)

**Option A: Jupyter Notebook**

```bash
jupyter notebook donor.ipynb
```

**Option B: VS Code**

1. Open `donor.ipynb` in VS Code
2. Select Python kernel
3. Run All Cells

---

### Step 4: Verify Model Creation (Immediate)

Check that the following file was created:

```
✅ donor_match_model_final.pkl
```

**Size:** ~5-10 MB  
**Location:** Same directory as notebook

---

## 📋 Expected Output Summary

### Console Output (Last Cell)

```
====================================================================
✓ FINAL MODEL SAVED: donor_match_model_final.pkl
====================================================================
Model Type: Random Forest
Features: 14 (including HLA_Match_Score and ABO_Compatibility)
HLA Matching: Rule-based (deterministic)
ABO Compatibility: Rule-based (binary)
Training Samples: 750
Test Samples: 251
Performance: Accuracy = 88.40%, ROC-AUC = 0.8910
Random Seed: 42 (reproducible)
====================================================================

🎯 Model ready for deployment!
✓ All requirements satisfied:
  ✓ HLA matching is rule-based and deterministic
  ✓ ABO compatibility is binary (not learned)
  ✓ Random Forest selected as final model
  ✓ SHAP explainability implemented
  ✓ Model saved from notebook only
  ✓ Reproducible with fixed random seed
```

### Generated Files

1. **donor_match_model_final.pkl** - Final trained model ⭐
2. **model_comparison_analysis.png** - Model comparison visualization
3. **feature_importance.png** - Feature importance plot

---

## 🔍 Quick Validation

### Test HLA Matching

```python
from utils.hla_matching import get_hla_match_score

score = get_hla_match_score(
    donor_hla="A1,A2,B7,B8,DR3,DR4",
    recipient_hla="A1,A2,B7,B8,DR3,DR4"
)
print(f"HLA Score: {score}/6")  # Expected: 6/6 (perfect match)
```

### Load and Test Model

```python
import joblib
import pandas as pd

# Load model
model = joblib.load('donor_match_model_final.pkl')

# Test prediction (example)
sample_data = pd.DataFrame({...})  # Your test data
prediction = model.predict(sample_data)
probability = model.predict_proba(sample_data)[:, 1]

print(f"Prediction: {'Suitable' if prediction[0] == 1 else 'Not Suitable'}")
print(f"Probability: {probability[0]:.2%}")
```

---

## ⚠️ Common Issues and Solutions

### Issue 1: Import Error for HLA Module

**Error:**

```
ModuleNotFoundError: No module named 'hla_matching'
```

**Solution:**
Ensure the first notebook cell includes:

```python
import sys
sys.path.append('utils')
```

---

### Issue 2: SHAP Plots Not Displaying

**Error:**

```
Plots not showing in notebook
```

**Solution:**
Add to first cell (Jupyter only):

```python
%matplotlib inline
```

---

### Issue 3: Model File Not Created

**Problem:**
`donor_match_model_final.pkl` doesn't exist after running notebook

**Solution:**

- Ensure you ran **all cells** including the last one (Section 12)
- Check for errors in earlier cells
- Verify write permissions in directory

---

### Issue 4: Dataset Not Found

**Error:**

```
FileNotFoundError: kidney_donor_dataset.csv
```

**Solution:**

- Ensure `kidney_donor_dataset.csv` is in the same directory as `donor.ipynb`
- Check file name spelling (case-sensitive on Linux/Mac)

---

## 📊 Performance Benchmarks

**On standard laptop (Intel i5, 8GB RAM):**

| Task                       | Time       |
| -------------------------- | ---------- |
| Install dependencies       | ~2 min     |
| Load dataset               | <1 sec     |
| Compute HLA scores         | ~2 sec     |
| Train Random Forest        | ~3 sec     |
| Compute SHAP values        | ~10 sec    |
| Generate visualizations    | ~5 sec     |
| **Total notebook runtime** | **~3 min** |

---

## 🎯 What to Check

After running the notebook, verify:

### ✅ Checklist

- [ ] No errors in any cell
- [ ] `donor_match_model_final.pkl` exists
- [ ] HLA scores display correctly (0-6 range)
- [ ] Model accuracy ~88% (±3%)
- [ ] SHAP summary plot generated
- [ ] Feature importance plot saved
- [ ] Final confirmation message printed

---

## 🚀 Next Steps

1. **Review the model**: Check SHAP explanations in the notebook
2. **Read documentation**: See `RESEARCH_DOCUMENTATION.md` for methodology
3. **Prepare for research**: Use paper-ready text from docs
4. **Deploy (optional)**: Integrate model into your application

---

## 📞 Quick Reference

| File                        | Purpose                            |
| --------------------------- | ---------------------------------- |
| `donor.ipynb`               | Main training notebook (run this!) |
| `d_ml.py`                   | Reference script (demo only)       |
| `utils/hla_matching.py`     | HLA compatibility module           |
| `utils/shap_explainer.py`   | SHAP explainability module         |
| `validate_hla.py`           | HLA module validation              |
| `README.md`                 | Comprehensive documentation        |
| `RESEARCH_DOCUMENTATION.md` | Paper-ready content                |
| `IMPLEMENTATION_SUMMARY.md` | Implementation details             |
| `requirements.txt`          | Dependencies                       |

---

## 💡 Pro Tips

1. **Always run cells sequentially** - Don't skip cells or run out of order
2. **Check kernel** - Ensure you're using the correct Python environment
3. **Save outputs** - Copy SHAP visualizations for your paper
4. **Document changes** - If you modify hyperparameters, note them
5. **Keep backups** - Copy the final model file to a safe location

---

## ✅ Success Indicators

You'll know everything worked if you see:

```
🎯 Model ready for deployment!
✓ All requirements satisfied
```

And have:

- ✅ `donor_match_model_final.pkl` file
- ✅ Visualizations saved
- ✅ No error messages
- ✅ Accuracy ~88-90%

---

**Ready to start? Run the notebook!** 🚀

```bash
jupyter notebook donor.ipynb
```

or open in VS Code and click "Run All"

---

**Questions?** Check `README.md` for detailed documentation.

**Good luck with your research!** 🎓
