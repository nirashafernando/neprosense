"""
Utility Modules for Kidney Donor Matching
==========================================

This package contains utility modules for the hybrid rule-based + ML
kidney donor-recipient matching system.

Modules:
--------
- hla_matching: Rule-based HLA compatibility scoring
- shap_explainer: Post-hoc SHAP explainability for Random Forest
"""

from .hla_matching import HLAMatcher, compute_hla_matches, get_hla_match_score
from .shap_explainer import DonorMatchExplainer, create_explainer

__all__ = [
    'HLAMatcher',
    'compute_hla_matches',
    'get_hla_match_score',
    'DonorMatchExplainer',
    'create_explainer'
]

__version__ = '1.0.0'
