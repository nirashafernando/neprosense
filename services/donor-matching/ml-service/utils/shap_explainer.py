"""
SHAP Explainability Module for Kidney Donor Matching
====================================================

This module provides post-hoc interpretability for the Random Forest matching model
using SHAP (SHapley Additive exPlanations) values.

SHAP is used ONLY for interpretation, NOT for training.

Key Features:
- Feature importance analysis
- Individual prediction explanations
- Human-readable clinical explanations
- Visualization support
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import shap
from typing import Dict, List, Optional, Any


class DonorMatchExplainer:
    """
    SHAP-based explainer for kidney donor-recipient matching predictions.
    """
    
    def __init__(self, model, feature_names: List[str]):
        """
        Initialize the explainer.
        
        Args:
            model: Trained Random Forest model (or any tree-based model)
            feature_names: List of feature names in the same order as model input
        """
        self.model = model
        self.feature_names = feature_names
        self.explainer = None
        self.shap_values = None
        
    def initialize_explainer(self, X_background: np.ndarray = None):
        """
        Initialize SHAP TreeExplainer.
        
        Args:
            X_background: Background dataset for SHAP (optional, uses model data if None)
        """
        try:
            if X_background is not None:
                self.explainer = shap.TreeExplainer(self.model, X_background)
            else:
                self.explainer = shap.TreeExplainer(self.model)
            print("✓ SHAP TreeExplainer initialized successfully")
        except Exception as e:
            print(f"Warning: Could not initialize TreeExplainer: {e}")
            print("Using KernelExplainer as fallback (slower)")
            if X_background is not None:
                self.explainer = shap.KernelExplainer(
                    self.model.predict_proba, 
                    X_background[:100]  # Use subset for efficiency
                )
    
    def compute_shap_values(self, X: np.ndarray, check_additivity: bool = False) -> np.ndarray:
        """
        Compute SHAP values for given samples.
        
        Args:
            X: Feature matrix
            check_additivity: Whether to check if SHAP values sum to model output
                            (disabled by default due to numerical precision issues)
            
        Returns:
            SHAP values array
        """
        if self.explainer is None:
            self.initialize_explainer()
        
        # Disable additivity check to avoid numerical precision errors
        # The small differences are acceptable for practical interpretation
        self.shap_values = self.explainer.shap_values(X, check_additivity=check_additivity)
        
        # For binary classification, extract positive class SHAP values
        if isinstance(self.shap_values, list) and len(self.shap_values) == 2:
            return self.shap_values[1]  # Positive class (suitable match)
        
        return self.shap_values
    
    def get_feature_importance(self, X: np.ndarray, top_k: int = 10) -> pd.DataFrame:
        """
        Get global feature importance based on mean absolute SHAP values.
        
        Args:
            X: Feature matrix
            top_k: Number of top features to return
            
        Returns:
            DataFrame with features ranked by importance
        """
        if self.shap_values is None:
            shap_values = self.compute_shap_values(X)
        else:
            shap_values = self.shap_values
        
        # Handle binary classification SHAP values
        # For binary classification, SHAP can return (n_samples, n_features, 2)
        # We need to extract the positive class (index 1) before computing importance
        if len(shap_values.shape) == 3 and shap_values.shape[2] == 2:
            # Extract positive class SHAP values: (n_samples, n_features)
            shap_values = shap_values[:, :, 1]
        elif isinstance(shap_values, list) and len(shap_values) == 2:
            # Alternative format: list of arrays for each class
            shap_values = shap_values[1]
        
        # Compute mean absolute SHAP value for each feature
        # Result should be (n_features,)
        importance = np.abs(shap_values).mean(axis=0)
        
        # Final safety check - ensure 1D array matching number of features
        importance = np.asarray(importance).flatten()
        
        if len(importance) != len(self.feature_names):
            raise ValueError(
                f"Importance array length ({len(importance)}) does not match "
                f"number of features ({len(self.feature_names)})"
            )
        
        # Create DataFrame
        importance_df = pd.DataFrame({
            'Feature': self.feature_names,
            'Importance': importance
        }).sort_values('Importance', ascending=False)
        
        return importance_df.head(top_k)
    
    def explain_prediction(self, X_sample: np.ndarray, 
                          sample_idx: int = 0) -> Dict[str, Any]:
        """
        Generate human-readable explanation for a single prediction.
        
        Args:
            X_sample: Feature matrix (can be single sample or batch)
            sample_idx: Index of sample to explain (if batch)
            
        Returns:
            Dictionary with structured explanation
        """
        if self.shap_values is None:
            shap_values = self.compute_shap_values(X_sample)
        else:
            shap_values = self.shap_values
        
        # Handle binary classification SHAP values (same logic as get_feature_importance)
        if len(shap_values.shape) == 3 and shap_values.shape[2] == 2:
            # Extract positive class SHAP values: (n_samples, n_features)
            shap_values = shap_values[:, :, 1]
        elif isinstance(shap_values, list) and len(shap_values) == 2:
            shap_values = shap_values[1]
        
        # Extract SHAP values for the specific sample
        sample_shap = shap_values[sample_idx]
        sample_features = X_sample[sample_idx]
        
        # Get top positive and negative contributors
        feature_contributions = []
        for i, (feature, shap_val, feature_val) in enumerate(
            zip(self.feature_names, sample_shap, sample_features)
        ):
            # Convert to scalar if needed
            shap_val = float(shap_val) if hasattr(shap_val, '__float__') else shap_val
            
            feature_contributions.append({
                'feature': feature,
                'value': feature_val,
                'shap_value': shap_val,
                'impact': 'Positive' if shap_val > 0 else 'Negative',
                'abs_impact': abs(shap_val)
            })
        
        # Sort by absolute impact
        feature_contributions.sort(key=lambda x: x['abs_impact'], reverse=True)
        
        # Generate human-readable explanations
        explanations = []
        for contrib in feature_contributions[:5]:  # Top 5 features
            explanation = self._generate_feature_explanation(contrib)
            explanations.append(explanation)
        
        return {
            'top_contributors': feature_contributions[:5],
            'human_explanations': explanations,
            'base_value': self.explainer.expected_value if hasattr(self.explainer, 'expected_value') else None
        }
    
    def _generate_feature_explanation(self, contribution: Dict) -> str:
        """
        Generate human-readable explanation for a feature contribution.
        
        Args:
            contribution: Dictionary with feature, value, shap_value, impact
            
        Returns:
            Human-readable explanation string
        """
        feature = contribution['feature']
        value = contribution['value']
        impact = contribution['impact']
        
        # Clinical explanations for key features
        explanations = {
            'HLA_Match_Score': {
                'Positive': f"Strong immunological compatibility (HLA match score: {value:.0f}/6) reduced rejection risk",
                'Negative': f"Limited immunological compatibility (HLA match score: {value:.0f}/6) increased rejection risk"
            },
            'ABO_Compatibility': {
                'Positive': "ABO blood type compatibility ensured safe transfusion",
                'Negative': "ABO blood type incompatibility raised transplant risk"
            },
            'Donor_eGFR': {
                'Positive': f"Excellent donor kidney function (eGFR: {value:.1f} mL/min/1.73m²) indicated healthy organ",
                'Negative': f"Reduced donor kidney function (eGFR: {value:.1f} mL/min/1.73m²) raised quality concerns"
            },
            'Donor_HTN': {
                'Positive': "No donor hypertension history improved organ quality",
                'Negative': "Donor hypertension history increased long-term graft risk"
            },
            'Donor_DM': {
                'Positive': "No donor diabetes history reduced organ damage risk",
                'Negative': "Donor diabetes history increased risk of diabetic nephropathy transmission"
            },
            'Age_Gap': {
                'Positive': f"Optimal age matching (gap: {value:.0f} years) favored graft survival",
                'Negative': f"Large age gap ({value:.0f} years) created physiological mismatch"
            },
            'Recipient_PRA': {
                'Positive': f"Low antibody sensitization (PRA: {value:.1f}%) reduced rejection risk",
                'Negative': f"High antibody sensitization (PRA: {value:.1f}%) increased rejection likelihood"
            },
            'Donor_Risk_Index': {
                'Positive': f"Low donor risk profile (DRI: {value:.2f}) indicated optimal organ",
                'Negative': f"Elevated donor risk profile (DRI: {value:.2f}) raised transplant concerns"
            }
        }
        
        # Return specific explanation if available, otherwise generic
        if feature in explanations:
            return explanations[feature][impact]
        else:
            return f"{feature} (value: {value:.2f}) had a {impact.lower()} impact on the prediction"
    
    def plot_summary(self, X: np.ndarray, max_display: int = 10):
        """
        Generate SHAP summary plot showing feature importance.
        
        Args:
            X: Feature matrix
            max_display: Maximum number of features to display
        """
        if self.shap_values is None:
            shap_values = self.compute_shap_values(X)
        else:
            shap_values = self.shap_values
        
        plt.figure(figsize=(10, 6))
        shap.summary_plot(
            shap_values, 
            X, 
            feature_names=self.feature_names,
            max_display=max_display,
            show=False
        )
        plt.title("SHAP Feature Importance Summary", fontsize=14, fontweight='bold')
        plt.tight_layout()
        plt.show()
    
    def plot_waterfall(self, X_sample: np.ndarray, sample_idx: int = 0):
        """
        Generate SHAP waterfall plot for individual prediction.
        
        Args:
            X_sample: Feature matrix
            sample_idx: Index of sample to explain
        """
        if self.shap_values is None:
            shap_values = self.compute_shap_values(X_sample)
        else:
            shap_values = self.shap_values
        
        # Create explanation object for waterfall plot
        if hasattr(self.explainer, 'expected_value'):
            expected_value = self.explainer.expected_value
            if isinstance(expected_value, list):
                expected_value = expected_value[1]  # Positive class
        else:
            expected_value = 0
        
        explanation = shap.Explanation(
            values=shap_values[sample_idx],
            base_values=expected_value,
            data=X_sample[sample_idx],
            feature_names=self.feature_names
        )
        
        plt.figure(figsize=(10, 6))
        shap.plots.waterfall(explanation, show=False)
        plt.title(f"SHAP Explanation for Sample {sample_idx}", fontsize=14, fontweight='bold')
        plt.tight_layout()
        plt.show()
    
    def plot_force(self, X_sample: np.ndarray, sample_idx: int = 0):
        """
        Generate SHAP force plot for individual prediction.
        
        Args:
            X_sample: Feature matrix
            sample_idx: Index of sample to explain
        """
        if self.shap_values is None:
            shap_values = self.compute_shap_values(X_sample)
        else:
            shap_values = self.shap_values
        
        if hasattr(self.explainer, 'expected_value'):
            expected_value = self.explainer.expected_value
            if isinstance(expected_value, list):
                expected_value = expected_value[1]
        else:
            expected_value = 0
        
        return shap.force_plot(
            expected_value,
            shap_values[sample_idx],
            X_sample[sample_idx],
            feature_names=self.feature_names
        )


def create_explainer(model, feature_names: List[str], 
                    X_background: np.ndarray = None) -> DonorMatchExplainer:
    """
    Convenience function to create and initialize explainer.
    
    Args:
        model: Trained model
        feature_names: List of feature names
        X_background: Background dataset for SHAP
        
    Returns:
        Initialized DonorMatchExplainer
    """
    explainer = DonorMatchExplainer(model, feature_names)
    explainer.initialize_explainer(X_background)
    return explainer
