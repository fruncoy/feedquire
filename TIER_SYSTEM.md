# Feedquire Tier System

## Overview
The Feedquire platform uses a 3-tier account status system to manage user progression and access levels.

## Account Status Tiers

### Tier 1 - New Account
- **Status**: `tier1`
- **Description**: Account has just been created
- **Access**: 
  - Can access dashboard
  - Can view setup tasks
  - Cannot perform assessments
  - Cannot access AI platform reviews
- **Next Step**: Complete human verification payment ($1.00)

### Tier 2 - Human Verified
- **Status**: `tier2` 
- **Description**: Account has completed human verification payment
- **Access**:
  - All Tier 1 access
  - Can access assessment test
  - Cannot access AI platform reviews yet
- **Next Step**: Complete assessment test on Perplexity.ai

### Tier 3 - Assessment Passed
- **Status**: `tier3`
- **Description**: Account has passed the assessment test
- **Access**:
  - Full platform access
  - Can perform AI platform reviews
  - Can earn money from feedback submissions
  - Access to all dashboard features

## Additional Status Values
- **rejected**: Account rejected after assessment
- **banned**: Account banned for violations

## Database Schema
```sql
-- profiles table
account_status: 'tier1' | 'tier2' | 'tier3' | 'rejected' | 'banned'
```

## Progression Flow
1. **Sign Up** → `tier1`
2. **Pay $1.00** → `tier2` 
3. **Pass Assessment** → `tier3`
4. **Start Earning** → Full access to platform

## Assessment Details
- **Platform**: Perplexity.ai (https://www.perplexity.ai/)
- **Questions**: 5 sections covering first impressions, experience, quality, value, and overall impact
- **Format**: Detailed written responses required
- **Evaluation**: Manual review by admin team