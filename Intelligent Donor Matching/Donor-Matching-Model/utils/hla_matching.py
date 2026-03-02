"""
HLA Matching Module for Kidney Transplantation
===============================================

This module provides deterministic, rule-based HLA (Human Leukocyte Antigen) 
compatibility scoring for kidney donor-recipient matching.

HLA matching is NOT learned by the ML model. It is computed separately using
established clinical guidelines and injected as a derived feature during preprocessing.

Standard HLA Loci for Kidney Transplantation:
- HLA-A (2 antigens)
- HLA-B (2 antigens)  
- HLA-DR (2 antigens)

Total possible matches: 6
"""

import re
from typing import Dict, Tuple, List


class HLAMatcher:
    """
    Deterministic HLA compatibility scorer based on clinical transplant guidelines.
    """
    
    def __init__(self):
        """Initialize the HLA matcher with standard loci definitions."""
        self.standard_loci = ['A', 'B', 'DR']
        self.max_score = 6  # Maximum possible HLA matches (2 per locus × 3 loci)
        
    def parse_hla_typing(self, hla_string: str) -> Dict[str, List[str]]:
        """
        Parse HLA typing string into structured format.
        
        Expected format: "A1,A2,B7,B8,DR3,DR4"
        
        Args:
            hla_string: Comma-separated HLA antigens
            
        Returns:
            Dictionary with loci as keys and antigen lists as values
            Example: {'A': ['1', '2'], 'B': ['7', '8'], 'DR': ['3', '4']}
        """
        if not isinstance(hla_string, str) or not hla_string.strip():
            return {'A': [], 'B': [], 'DR': []}
        
        hla_dict = {'A': [], 'B': [], 'DR': []}
        
        # Split by comma and process each antigen
        antigens = [ag.strip() for ag in hla_string.split(',')]
        
        for antigen in antigens:
            # Match patterns like A1, A2, B7, B8, DR3, DR4
            match = re.match(r'([A-Z]+)(\d+)', antigen, re.IGNORECASE)
            if match:
                locus = match.group(1).upper()
                allele = match.group(2)
                
                # Map common variations
                if locus == 'DRB1' or locus == 'DR':
                    locus = 'DR'
                
                if locus in hla_dict:
                    hla_dict[locus].append(allele)
        
        return hla_dict
    
    def compute_locus_matches(self, donor_antigens: List[str], 
                             recipient_antigens: List[str]) -> int:
        """
        Count matches for a specific HLA locus.
        
        Args:
            donor_antigens: List of donor antigens for this locus
            recipient_antigens: List of recipient antigens for this locus
            
        Returns:
            Number of matches (0-2)
        """
        if not donor_antigens or not recipient_antigens:
            return 0
        
        matches = 0
        donor_set = set(donor_antigens)
        
        for rec_ag in recipient_antigens:
            if rec_ag in donor_set:
                matches += 1
                
        # Cap at 2 (standard number of antigens per locus)
        return min(matches, 2)
    
    def compute_hla_score(self, donor_hla: str, recipient_hla: str) -> int:
        """
        Compute total HLA match score across all loci.
        
        Args:
            donor_hla: Donor HLA typing string
            recipient_hla: Recipient HLA typing string
            
        Returns:
            HLA match score (0-6)
        """
        donor_dict = self.parse_hla_typing(donor_hla)
        recipient_dict = self.parse_hla_typing(recipient_hla)
        
        total_score = 0
        
        for locus in self.standard_loci:
            locus_score = self.compute_locus_matches(
                donor_dict.get(locus, []),
                recipient_dict.get(locus, [])
            )
            total_score += locus_score
        
        # Ensure score is within valid range
        return min(total_score, self.max_score)
    
    def get_match_quality(self, hla_score: int) -> str:
        """
        Convert HLA score to qualitative label.
        
        Args:
            hla_score: HLA match score (0-6)
            
        Returns:
            Qualitative match quality label
        """
        if hla_score >= 6:
            return "Excellent"
        elif hla_score >= 4:
            return "Good"
        elif hla_score == 3:
            return "Fair"
        else:
            return "Poor"
    
    def compute_match_with_details(self, donor_hla: str, 
                                   recipient_hla: str) -> Dict:
        """
        Compute HLA match score with detailed breakdown.
        
        Args:
            donor_hla: Donor HLA typing string
            recipient_hla: Recipient HLA typing string
            
        Returns:
            Dictionary with score, quality, and locus-level details
        """
        donor_dict = self.parse_hla_typing(donor_hla)
        recipient_dict = self.parse_hla_typing(recipient_hla)
        
        locus_details = {}
        total_score = 0
        
        for locus in self.standard_loci:
            locus_score = self.compute_locus_matches(
                donor_dict.get(locus, []),
                recipient_dict.get(locus, [])
            )
            locus_details[locus] = locus_score
            total_score += locus_score
        
        total_score = min(total_score, self.max_score)
        
        return {
            'HLA_Match_Score': total_score,
            'Match_Quality': self.get_match_quality(total_score),
            'Locus_Breakdown': locus_details,
            'Donor_HLA': donor_dict,
            'Recipient_HLA': recipient_dict
        }


def compute_hla_matches(donor_hla_series, recipient_hla_series) -> Tuple[List[int], List[str]]:
    """
    Batch compute HLA scores for pandas Series.
    
    Args:
        donor_hla_series: Pandas Series of donor HLA typing strings
        recipient_hla_series: Pandas Series of recipient HLA typing strings
        
    Returns:
        Tuple of (scores list, qualities list)
    """
    matcher = HLAMatcher()
    scores = []
    qualities = []
    
    for donor_hla, recipient_hla in zip(donor_hla_series, recipient_hla_series):
        score = matcher.compute_hla_score(str(donor_hla), str(recipient_hla))
        quality = matcher.get_match_quality(score)
        scores.append(score)
        qualities.append(quality)
    
    return scores, qualities


# Convenience function for single-call usage
def get_hla_match_score(donor_hla: str, recipient_hla: str) -> int:
    """
    Quick function to get HLA match score for a single pair.
    
    Args:
        donor_hla: Donor HLA typing string
        recipient_hla: Recipient HLA typing string
        
    Returns:
        HLA match score (0-6)
    """
    matcher = HLAMatcher()
    return matcher.compute_hla_score(donor_hla, recipient_hla)
