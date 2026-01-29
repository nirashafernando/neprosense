"""
HLA Matching Model Integration Script
=====================================

This script demonstrates how to integrate the advanced HLA matching model
with the kidney donor dataset and use it for enhanced predictions.

Features:
- Load and analyze HLA data from dataset
- Calculate enhanced HLA compatibility scores
- Generate visualizations of HLA matching importance
- Compare simple vs weighted HLA scoring
- Export enhanced dataset with HLA features

Author: NephroSense ML Team
Date: January 2026
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from hla_matching_model import HLAMatchingModel, HLADatasetAnalyzer
import joblib
from pathlib import Path


def load_dataset(filepath='kidney_donor_dataset.csv'):
    """Load the kidney donor dataset."""
    try:
        df = pd.read_csv(filepath)
        print(f"✓ Loaded dataset: {len(df)} records")
        print(f"  Columns: {list(df.columns)}")
        return df
    except Exception as e:
        print(f"✗ Error loading dataset: {e}")
        return None


def generate_sample_hla_data(df, n_samples=100):
    """
    Generate sample HLA typing data for testing.
    
    In production, this would be replaced with actual HLA typing from database.
    """
    np.random.seed(42)
    
    # Common HLA alleles pool
    a_alleles = ['A1', 'A2', 'A3', 'A11', 'A23', 'A24', 'A25', 'A26', 'A29', 'A30', 'A31', 'A32']
    b_alleles = ['B7', 'B8', 'B13', 'B18', 'B27', 'B35', 'B44', 'B51', 'B52', 'B53', 'B57', 'B58']
    dr_alleles = ['DR1', 'DR3', 'DR4', 'DR7', 'DR11', 'DR13', 'DR15']
    
    def generate_hla_string():
        """Generate realistic HLA typing string."""
        a = np.random.choice(a_alleles, 2, replace=False)
        b = np.random.choice(b_alleles, 2, replace=False)
        dr = np.random.choice(dr_alleles, 2, replace=False)
        return ','.join([*a, *b, *dr])
    
    # Generate donor and recipient HLA data
    donor_hla = [generate_hla_string() for _ in range(min(n_samples, len(df)))]
    
    # For recipients, sometimes match donor partially (simulate real matching)
    recipient_hla = []
    for d_hla in donor_hla:
        if np.random.random() < 0.3:  # 30% chance of some matching
            # Keep some alleles the same
            d_parts = d_hla.split(',')
            r_parts = d_parts.copy()
            # Randomly change some alleles
            n_changes = np.random.randint(1, 5)
            for _ in range(n_changes):
                idx = np.random.randint(0, 6)
                if idx < 2:
                    r_parts[idx] = np.random.choice(a_alleles)
                elif idx < 4:
                    r_parts[idx] = np.random.choice(b_alleles)
                else:
                    r_parts[idx] = np.random.choice(dr_alleles)
            recipient_hla.append(','.join(r_parts))
        else:
            # Completely different
            recipient_hla.append(generate_hla_string())
    
    return donor_hla, recipient_hla


def calculate_enhanced_hla_features(df, donor_hla_col='Donor_HLA', 
                                   recipient_hla_col='Recipient_HLA'):
    """
    Calculate enhanced HLA features using the advanced HLA model.
    
    Returns dataframe with additional HLA-related columns:
    - HLA_Weighted_Score: Clinically weighted match score (0-1)
    - HLA_DR_Matches: Number of DR matches (0-2)
    - HLA_B_Matches: Number of B matches (0-2)
    - HLA_A_Matches: Number of A matches (0-2)
    - HLA_Survival_Probability: Estimated 5-year graft survival
    - HLA_Compatibility_Level: Clinical interpretation
    """
    model = HLAMatchingModel(use_clinical_weights=True)
    
    results = []
    for _, row in df.iterrows():
        match_result = model.calculate_match_score(
            row[donor_hla_col],
            row[recipient_hla_col]
        )
        
        results.append({
            'HLA_Match_Score': match_result['total_score'],
            'HLA_Weighted_Score': match_result['weighted_score'],
            'HLA_DR_Matches': match_result['locus_scores']['DR']['matches'],
            'HLA_B_Matches': match_result['locus_scores']['B']['matches'],
            'HLA_A_Matches': match_result['locus_scores']['A']['matches'],
            'HLA_Survival_Probability': match_result['survival_probability'],
            'HLA_Compatibility_Level': match_result['compatibility_level']
        })
    
    enhanced_df = pd.concat([df, pd.DataFrame(results)], axis=1)
    
    return enhanced_df


def visualize_hla_analysis(df):
    """Create visualizations of HLA matching patterns."""
    fig, axes = plt.subplots(2, 2, figsize=(15, 12))
    
    # 1. HLA Match Score Distribution
    ax1 = axes[0, 0]
    if 'HLA_Match_Score' in df.columns:
        score_counts = df['HLA_Match_Score'].value_counts().sort_index()
        ax1.bar(score_counts.index, score_counts.values, color='steelblue', alpha=0.7)
        ax1.set_xlabel('HLA Match Score (0-6)', fontsize=12, fontweight='bold')
        ax1.set_ylabel('Frequency', fontsize=12, fontweight='bold')
        ax1.set_title('Distribution of HLA Match Scores', fontsize=14, fontweight='bold')
        ax1.grid(axis='y', alpha=0.3)
        
        # Add statistics
        mean_score = df['HLA_Match_Score'].mean()
        ax1.axvline(mean_score, color='red', linestyle='--', linewidth=2, 
                   label=f'Mean: {mean_score:.2f}')
        ax1.legend()
    
    # 2. Weighted vs Simple Score Comparison
    ax2 = axes[0, 1]
    if 'HLA_Weighted_Score' in df.columns and 'HLA_Match_Score' in df.columns:
        simple_score = df['HLA_Match_Score'] / 6.0
        weighted_score = df['HLA_Weighted_Score']
        
        ax2.scatter(simple_score, weighted_score, alpha=0.5, s=50)
        ax2.plot([0, 1], [0, 1], 'r--', linewidth=2, label='Equal weighting')
        ax2.set_xlabel('Simple Match Score (normalized)', fontsize=12, fontweight='bold')
        ax2.set_ylabel('Weighted Match Score', fontsize=12, fontweight='bold')
        ax2.set_title('Clinical Weighting Effect', fontsize=14, fontweight='bold')
        ax2.legend()
        ax2.grid(alpha=0.3)
    
    # 3. Locus-specific Match Distribution
    ax3 = axes[1, 0]
    if all(col in df.columns for col in ['HLA_A_Matches', 'HLA_B_Matches', 'HLA_DR_Matches']):
        locus_data = {
            'HLA-A': df['HLA_A_Matches'].value_counts().sort_index(),
            'HLA-B': df['HLA_B_Matches'].value_counts().sort_index(),
            'HLA-DR': df['HLA_DR_Matches'].value_counts().sort_index()
        }
        
        x = np.arange(3)  # 0, 1, 2 matches
        width = 0.25
        
        for i, (locus, counts) in enumerate(locus_data.items()):
            positions = x + (i - 1) * width
            values = [counts.get(j, 0) for j in range(3)]
            ax3.bar(positions, values, width, label=locus, alpha=0.7)
        
        ax3.set_xlabel('Number of Matches', fontsize=12, fontweight='bold')
        ax3.set_ylabel('Frequency', fontsize=12, fontweight='bold')
        ax3.set_title('Locus-Specific Match Distribution', fontsize=14, fontweight='bold')
        ax3.set_xticks(x)
        ax3.set_xticklabels(['0', '1', '2'])
        ax3.legend()
        ax3.grid(axis='y', alpha=0.3)
    
    # 4. Survival Probability Distribution
    ax4 = axes[1, 1]
    if 'HLA_Survival_Probability' in df.columns:
        ax4.hist(df['HLA_Survival_Probability'] * 100, bins=20, 
                color='green', alpha=0.6, edgecolor='black')
        ax4.set_xlabel('Estimated 5-Year Graft Survival (%)', fontsize=12, fontweight='bold')
        ax4.set_ylabel('Frequency', fontsize=12, fontweight='bold')
        ax4.set_title('HLA-Based Survival Probability', fontsize=14, fontweight='bold')
        ax4.grid(axis='y', alpha=0.3)
        
        # Add median line
        median_survival = df['HLA_Survival_Probability'].median() * 100
        ax4.axvline(median_survival, color='red', linestyle='--', linewidth=2,
                   label=f'Median: {median_survival:.1f}%')
        ax4.legend()
    
    plt.tight_layout()
    plt.savefig('hla_analysis_visualization.png', dpi=300, bbox_inches='tight')
    print("✓ Saved visualization: hla_analysis_visualization.png")
    
    return fig


def compare_model_performance(df):
    """Compare predictions with and without weighted HLA scoring."""
    if 'HLA_Match_Score' not in df.columns or 'HLA_Weighted_Score' not in df.columns:
        print("⚠ HLA features not found. Run calculate_enhanced_hla_features first.")
        return
    
    # Load the trained model
    model_path = Path('../ml-service/model/donor_match_model.pkl')
    if not model_path.exists():
        print(f"⚠ Model not found at {model_path}")
        return
    
    print("\nHLA Feature Importance Analysis")
    print("=" * 70)
    
    # Show correlation with outcomes
    if 'Suitability' in df.columns:
        correlations = {
            'HLA_Match_Score': df['HLA_Match_Score'].corr(df['Suitability']),
            'HLA_Weighted_Score': df['HLA_Weighted_Score'].corr(df['Suitability']),
            'HLA_DR_Matches': df['HLA_DR_Matches'].corr(df['Suitability']),
            'HLA_B_Matches': df['HLA_B_Matches'].corr(df['Suitability']),
            'HLA_A_Matches': df['HLA_A_Matches'].corr(df['Suitability']),
        }
        
        print("\nCorrelation with Suitability:")
        for feature, corr in sorted(correlations.items(), key=lambda x: abs(x[1]), reverse=True):
            print(f"  {feature:25s}: {corr:+.4f}")
    
    # Show statistics
    print("\nHLA Match Statistics:")
    print(f"  Average Match Score:     {df['HLA_Match_Score'].mean():.2f}/6")
    print(f"  Average Weighted Score:  {df['HLA_Weighted_Score'].mean():.3f}")
    print(f"  Perfect Matches (6/6):   {(df['HLA_Match_Score'] == 6).sum()} ({(df['HLA_Match_Score'] == 6).sum() / len(df) * 100:.1f}%)")
    print(f"  Poor Matches (≤2/6):     {(df['HLA_Match_Score'] <= 2).sum()} ({(df['HLA_Match_Score'] <= 2).sum() / len(df) * 100:.1f}%)")
    
    print("\nLocus-Specific Statistics:")
    print(f"  DR Perfect Match (2/2):  {(df['HLA_DR_Matches'] == 2).sum()} ({(df['HLA_DR_Matches'] == 2).sum() / len(df) * 100:.1f}%)")
    print(f"  B  Perfect Match (2/2):  {(df['HLA_B_Matches'] == 2).sum()} ({(df['HLA_B_Matches'] == 2).sum() / len(df) * 100:.1f}%)")
    print(f"  A  Perfect Match (2/2):  {(df['HLA_A_Matches'] == 2).sum()} ({(df['HLA_A_Matches'] == 2).sum() / len(df) * 100:.1f}%)")


def main():
    """Main execution function."""
    print("HLA Matching Model Integration")
    print("=" * 70)
    
    # Load dataset
    df = load_dataset()
    if df is None:
        return
    
    # Check if HLA data exists
    has_donor_hla = 'Donor_HLA' in df.columns
    has_recipient_hla = 'Recipient_HLA' in df.columns
    
    if not (has_donor_hla and has_recipient_hla):
        print("\n⚠ HLA typing columns not found. Generating sample data...")
        donor_hla, recipient_hla = generate_sample_hla_data(df)
        df['Donor_HLA'] = donor_hla
        df['Recipient_HLA'] = recipient_hla
        print("✓ Generated sample HLA data")
    
    # Calculate enhanced HLA features
    print("\nCalculating enhanced HLA features...")
    df_enhanced = calculate_enhanced_hla_features(df)
    print("✓ Enhanced features calculated")
    
    # Show sample results
    print("\nSample Enhanced Records (first 5):")
    print("-" * 70)
    display_cols = ['HLA_Match_Score', 'HLA_Weighted_Score', 'HLA_DR_Matches', 
                   'HLA_Compatibility_Level', 'HLA_Survival_Probability']
    if all(col in df_enhanced.columns for col in display_cols):
        print(df_enhanced[display_cols].head())
    
    # Generate visualizations
    print("\nGenerating visualizations...")
    visualize_hla_analysis(df_enhanced)
    
    # Compare model performance
    compare_model_performance(df_enhanced)
    
    # Save enhanced dataset
    output_file = 'kidney_donor_dataset_with_enhanced_hla.csv'
    df_enhanced.to_csv(output_file, index=False)
    print(f"\n✓ Saved enhanced dataset: {output_file}")
    
    print("\n" + "=" * 70)
    print("✅ HLA Matching Model Integration Complete!")
    print("=" * 70)


if __name__ == "__main__":
    main()
