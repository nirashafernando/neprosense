"""
HLA Matching Utility for Kidney Transplant Compatibility

This module provides functions to calculate HLA (Human Leukocyte Antigen) 
compatibility scores between donors and recipients based on clinical matching criteria.

HLA matching is critical for transplant success:
- Perfect match (6/6): Best outcome, lowest rejection risk
- Good match (4-5/6): Acceptable for transplant
- Poor match (0-2/6): High rejection risk

Author: NephroSense ML Team
Version: 1.0.0
"""

import re
from typing import Dict, List, Tuple


def parse_hla_typing(hla_string: str) -> Dict[str, List[str]]:
    """
    Parse HLA typing string into structured format by locus.
    
    HLA typing format: "A1,A2,B8,B44,DR1,DR4"
    - HLA-A: 2 antigens (e.g., A1, A2)
    - HLA-B: 2 antigens (e.g., B8, B44)
    - HLA-DR: 2 antigens (e.g., DR1, DR4)
    
    Args:
        hla_string (str): Comma-separated HLA antigens
        
    Returns:
        dict: Dictionary with keys 'A', 'B', 'DR' containing lists of antigens
        
    Example:
        >>> parse_hla_typing("A1,A2,B8,B44,DR1,DR4")
        {'A': ['A1', 'A2'], 'B': ['B8', 'B44'], 'DR': ['DR1', 'DR4']}
    """
    if not hla_string or not isinstance(hla_string, str):
        return {'A': [], 'B': [], 'DR': []}
    
    # Split and clean antigens
    antigens = [a.strip().upper() for a in hla_string.split(',') if a.strip()]
    
    hla_dict = {'A': [], 'B': [], 'DR': []}
    
    for antigen in antigens:
        # Remove any whitespace
        antigen = antigen.replace(' ', '')
        
        # Classify by locus
        if antigen.startswith('A') and not antigen.startswith('AB'):
            # HLA-A locus (avoid matching AB blood group)
            hla_dict['A'].append(antigen)
        elif antigen.startswith('B') and not antigen.startswith('BW'):
            # HLA-B locus (BW is a broad antigen classification)
            hla_dict['B'].append(antigen)
        elif antigen.startswith('DR'):
            # HLA-DR locus
            hla_dict['DR'].append(antigen)
    
    return hla_dict


def calculate_hla_match_score(donor_hla: str, recipient_hla: str) -> int:
    """
    Calculate HLA match score based on antigen matching.
    
    Compares HLA antigens across three loci (A, B, DR) and counts matches.
    Maximum score is 6 (2 matches per locus × 3 loci).
    
    Clinical Interpretation:
    - 6/6: Perfect match (ideal)
    - 5/6: Excellent match
    - 4/6: Good match
    - 3/6: Acceptable match
    - 0-2/6: Poor match (high rejection risk)
    
    Args:
        donor_hla (str): Donor HLA typing string
        recipient_hla (str): Recipient HLA typing string
        
    Returns:
        int: Match score from 0 (no match) to 6 (perfect match)
        
    Example:
        >>> calculate_hla_match_score("A1,A2,B8,B44,DR1,DR4", "A1,A3,B8,B44,DR1,DR7")
        4  # Matches: A1, B8, B44, DR1
    """
    try:
        # Parse both HLA strings
        donor_dict = parse_hla_typing(donor_hla)
        recipient_dict = parse_hla_typing(recipient_hla)
        
        match_count = 0
        
        # Compare HLA-A locus (max 2 matches)
        for donor_a in donor_dict['A']:
            if donor_a in recipient_dict['A']:
                match_count += 1
        
        # Compare HLA-B locus (max 2 matches)
        for donor_b in donor_dict['B']:
            if donor_b in recipient_dict['B']:
                match_count += 1
        
        # Compare HLA-DR locus (max 2 matches)
        for donor_dr in donor_dict['DR']:
            if donor_dr in recipient_dict['DR']:
                match_count += 1
        
        # Cap at 6 (maximum possible matches)
        return min(match_count, 6)
        
    except Exception as e:
        print(f"Error calculating HLA match: {e}")
        # Default to 0 on error (safest assumption)
        return 0


def get_hla_match_level(score: int) -> str:
    """
    Get clinical interpretation of HLA match score.
    
    Args:
        score (int): HLA match score (0-6)
        
    Returns:
        str: Clinical match level
        
    Match Levels:
    - Perfect (6/6): Ideal transplant candidate
    - Excellent (5/6): Very good match
    - Good (4/6): Acceptable match
    - Acceptable (3/6): Marginal match
    - Poor (0-2/6): High rejection risk
    """
    if score == 6:
        return 'Perfect'
    elif score >= 5:
        return 'Excellent'
    elif score >= 4:
        return 'Good'
    elif score >= 3:
        return 'Acceptable'
    else:
        return 'Poor'


def get_hla_mismatch_count(donor_hla: str, recipient_hla: str) -> int:
    """
    Calculate number of HLA mismatches (inverse of match score).
    
    Args:
        donor_hla (str): Donor HLA typing
        recipient_hla (str): Recipient HLA typing
        
    Returns:
        int: Number of mismatches (0-6)
    """
    match_score = calculate_hla_match_score(donor_hla, recipient_hla)
    return 6 - match_score


def validate_hla_format(hla_string: str) -> Tuple[bool, str]:
    """
    Validate HLA typing string format.
    
    Args:
        hla_string (str): HLA typing string to validate
        
    Returns:
        tuple: (is_valid, error_message)
        
    Example:
        >>> validate_hla_format("A1,A2,B8,B44,DR1,DR4")
        (True, "")
        >>> validate_hla_format("Invalid")
        (False, "HLA string must contain at least one valid antigen")
    """
    if not hla_string or not isinstance(hla_string, str):
        return False, "HLA string is empty or invalid type"
    
    parsed = parse_hla_typing(hla_string)
    
    # Check if we have at least some antigens
    total_antigens = len(parsed['A']) + len(parsed['B']) + len(parsed['DR'])
    
    if total_antigens == 0:
        return False, "HLA string must contain at least one valid antigen"
    
    # Ideally should have 2 antigens per locus (6 total)
    if total_antigens < 6:
        return True, f"Warning: Only {total_antigens}/6 antigens found. Complete typing recommended."
    
    return True, ""


# Clinical reference data
HLA_LOCI = ['A', 'B', 'DR']
MAX_HLA_SCORE = 6
ANTIGENS_PER_LOCUS = 2


if __name__ == "__main__":
    # Example usage and testing
    print("HLA Matching Utility - Test Cases\n")
    
    # Test Case 1: Perfect match
    donor1 = "A1,A2,B8,B44,DR1,DR4"
    recipient1 = "A1,A2,B8,B44,DR1,DR4"
    score1 = calculate_hla_match_score(donor1, recipient1)
    print(f"Test 1 - Perfect Match:")
    print(f"  Donor:     {donor1}")
    print(f"  Recipient: {recipient1}")
    print(f"  Score: {score1}/6 ({get_hla_match_level(score1)})\n")
    
    # Test Case 2: Good match (4/6)
    donor2 = "A1,A2,B8,B44,DR1,DR4"
    recipient2 = "A1,A3,B8,B44,DR1,DR7"
    score2 = calculate_hla_match_score(donor2, recipient2)
    print(f"Test 2 - Good Match:")
    print(f"  Donor:     {donor2}")
    print(f"  Recipient: {recipient2}")
    print(f"  Score: {score2}/6 ({get_hla_match_level(score2)})\n")
    
    # Test Case 3: Poor match (1/6)
    donor3 = "A1,A2,B8,B44,DR1,DR4"
    recipient3 = "A3,A11,B7,B35,DR3,DR15"
    score3 = calculate_hla_match_score(donor3, recipient3)
    print(f"Test 3 - Poor Match:")
    print(f"  Donor:     {donor3}")
    print(f"  Recipient: {recipient3}")
    print(f"  Score: {score3}/6 ({get_hla_match_level(score3)})\n")
    
    # Test Case 4: Validation
    valid, msg = validate_hla_format("A1,A2,B8")
    print(f"Test 4 - Validation:")
    print(f"  HLA String: 'A1,A2,B8'")
    print(f"  Valid: {valid}")
    print(f"  Message: {msg}\n")
