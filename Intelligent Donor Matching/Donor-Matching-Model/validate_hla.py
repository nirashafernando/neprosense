"""
HLA Matching Module - Validation Script
========================================

This script validates the HLA matching module with clinical test cases.
"""

import sys
sys.path.append('utils')
from hla_matching import HLAMatcher, get_hla_match_score

print("="*70)
print("HLA MATCHING MODULE - VALIDATION TESTS")
print("="*70)

# Initialize matcher
matcher = HLAMatcher()

# Test cases with expected results
test_cases = [
    {
        'name': 'Perfect Match (6/6)',
        'donor': 'A1,A2,B7,B8,DR3,DR4',
        'recipient': 'A1,A2,B7,B8,DR3,DR4',
        'expected_score': 6,
        'expected_quality': 'Excellent'
    },
    {
        'name': 'Good Match (5/6)',
        'donor': 'A1,A2,B7,B8,DR3,DR4',
        'recipient': 'A1,A2,B7,B8,DR3,DR15',
        'expected_score': 5,
        'expected_quality': 'Good'
    },
    {
        'name': 'Good Match (4/6)',
        'donor': 'A1,A2,B7,B8,DR3,DR4',
        'recipient': 'A1,A3,B7,B27,DR3,DR15',
        'expected_score': 3,  # A1(1) + B7(1) + DR3(1) = 3
        'expected_quality': 'Fair'
    },
    {
        'name': 'Poor Match (2/6)',
        'donor': 'A1,A2,B7,B8,DR3,DR4',
        'recipient': 'A3,A11,B27,B35,DR1,DR15',
        'expected_score': 0,
        'expected_quality': 'Poor'
    },
    {
        'name': 'Partial Match (3/6)',
        'donor': 'A1,A2,B7,B8,DR3,DR4',
        'recipient': 'A1,A11,B7,B35,DR3,DR15',
        'expected_score': 3,  # A1(1) + B7(1) + DR3(1) = 3
        'expected_quality': 'Fair'
    }
]

# Run tests
passed = 0
failed = 0

for test in test_cases:
    print(f"\nTest: {test['name']}")
    print(f"Donor HLA:     {test['donor']}")
    print(f"Recipient HLA: {test['recipient']}")
    
    result = matcher.compute_match_with_details(test['donor'], test['recipient'])
    
    score = result['HLA_Match_Score']
    quality = result['Match_Quality']
    
    print(f"Result:        {score}/6 ({quality})")
    print(f"Breakdown:     A={result['Locus_Breakdown']['A']}, "
          f"B={result['Locus_Breakdown']['B']}, "
          f"DR={result['Locus_Breakdown']['DR']}")
    
    # Validate
    if score == test['expected_score'] and quality == test['expected_quality']:
        print("✅ PASS")
        passed += 1
    else:
        print(f"❌ FAIL - Expected {test['expected_score']}/6 ({test['expected_quality']})")
        failed += 1

print("\n" + "="*70)
print("VALIDATION SUMMARY")
print("="*70)
print(f"Tests Passed: {passed}/{len(test_cases)}")
print(f"Tests Failed: {failed}/{len(test_cases)}")

if failed == 0:
    print("\n✅ All tests passed! HLA matching module is validated.")
else:
    print(f"\n⚠️ {failed} test(s) failed. Review implementation.")

print("="*70)

# Test edge cases
print("\n" + "="*70)
print("EDGE CASE TESTS")
print("="*70)

edge_cases = [
    ('Empty donor', '', 'A1,A2,B7,B8,DR3,DR4', 0),
    ('Empty recipient', 'A1,A2,B7,B8,DR3,DR4', '', 0),
    ('Both empty', '', '', 0),
    ('Malformed HLA', 'A1,B7', 'A1,A2,B7,B8,DR3,DR4', 2),  # Only A1 and B7 match
]

for name, donor, recipient, expected in edge_cases:
    score = get_hla_match_score(donor, recipient)
    status = "✅" if score == expected else "❌"
    print(f"{status} {name}: Score={score} (Expected={expected})")

print("="*70)
print("✓ Edge case testing complete")
print("="*70)
