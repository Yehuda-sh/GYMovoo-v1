# Demo Data Management Guidelines

## 🚨 Critical Rules for Demo Data Creation & User Data Modification

### Rule #1: Never Add Non-Existent Data
**NEVER** add fields or values that don't exist in the original source data.

### Rule #2: Source Data Only
Use **ONLY** structure and data that comes from existing tables:
- `users.questionnaire`
- `users.smartquestionnairedata` 
- `users.preferences`
- `users.activityhistory`
- Other existing database fields

### Rule #3: Missing Data Protocol
If something is missing:
1. ✅ **Document** what is missing
2. ✅ **Report** to user/developer 
3. ⚠️ **Wait for approval** before adding any data
4. ❌ **DO NOT** fabricate or assume values

### Rule #4: Data Integrity
- Only use data that exists in the original `smartquestionnairedata.answers`
- Preserve the exact structure and values from the source
- If completion is needed, base it on existing partial data only

## 📋 Approved Data Sources

### ✅ Safe to Use (From Original Data):
- Basic demographics (age, gender, height, weight) if present in smart data
- Fitness goals from `smartquestionnairedata.answers.goals`
- Equipment from `smartquestionnairedata.answers.equipment`
- Workout preferences (frequency, duration, location, time) if in smart data
- Experience level from `smartquestionnairedata.answers.experience`
- Diet type from `smartquestionnairedata.answers.diet_type`

### ❌ NEVER Fabricate:
- Activity levels (sedentary/active/very_active)
- Sleep hours 
- Stress levels
- Target weights
- Detailed motivation factors not in original data
- Previous experience not in smart data
- Social preferences
- Equipment budgets
- Health conditions not reported
- Any biographical details

## 🔧 Process for Demo Data Scripts

### Before Creating/Modifying User Data:
1. **Analyze existing data** with inspection scripts
2. **Document current state** vs desired state
3. **Identify missing fields** explicitly
4. **Request approval** for any additions
5. **Only proceed** with confirmed existing data

### Script Templates:
```javascript
// ✅ GOOD: Using existing data
const existingGoals = userData.smartquestionnairedata?.answers?.goals || [];
const questionnaire = {
  specific_goals: existingGoals, // From source
  // ... other existing fields only
};

// ❌ BAD: Adding non-existent data  
const questionnaire = {
  activity_level: "active", // NOT in source!
  sleep_hours: 7, // NOT in source!
  // ... fabricated fields
};
```

## 📊 Verification Requirements

### Every Demo Data Script Must:
1. **Show source analysis** - what exists vs what's missing
2. **Document data origins** - where each field comes from
3. **Provide comparison** - before vs after changes
4. **Include verification** - confirm only source data used

### Example Verification Output:
```
🔍 Source Analysis for User X:
✅ Available: age (32), goals ([...]), equipment ([...])
❌ Missing: activity_level, sleep_hours, stress_level
📊 Action: Using available data only, leaving missing fields empty
⚠️ Note: Missing fields require approval before addition
```

## 🎯 Demo User Profile Standards

### Minimal Complete Profile:
- Name, age, gender (if in source)
- Fitness goals (from smart data)
- Available equipment (from smart data) 
- Basic workout preferences (from smart data)
- Experience level (from smart data)
- Completion flag and timestamp

### No Fabrication of:
- Lifestyle details
- Health metrics
- Personal preferences beyond what was answered
- Motivational factors not in original responses
- Detailed schedules or routines

## 📝 Implementation Notes

This guideline was created after discovering that demo data scripts had fabricated detailed user profiles with information not present in the original `smartquestionnairedata`, leading to confusion about data sources.

**Last Updated:** August 25, 2025  
**Context:** Demo user questionnaire data cleanup  
**Reference Issue:** Artificial data in demo profiles
