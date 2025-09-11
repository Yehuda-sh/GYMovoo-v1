# Legacy Files to Delete

Now that we've migrated the questionnaire feature to a feature-based architecture, the following files can be deleted:

## Files to Delete

1. `src/screens/questionnaire/UnifiedQuestionnaireScreen.tsx`
   - Replaced by `src/features/questionnaire/screens/QuestionnaireScreen.tsx`

2. `src/data/unifiedQuestionnaire.ts`
   - Replaced by `src/features/questionnaire/data/unifiedQuestionnaire.ts`

3. `src/hooks/useQuestionnaireStatus.ts`
   - Replaced by `src/features/questionnaire/hooks/useQuestionnaireStatus.ts`

4. `src/hooks/__tests__/useQuestionnaireStatus.test.ts`
   - Replaced by `src/features/questionnaire/hooks/__tests__/useQuestionnaireStatus.test.ts`

## Completed Migration

✅ Moved the questionnaire functionality to feature-based architecture
✅ Updated AppNavigator to use the new QuestionnaireNavigator
✅ Updated ProfileScreen to use the new hooks
✅ Created tests for the new hooks

## Note

Be sure to run all tests before deleting these files to ensure that everything works as expected. While we've moved all the necessary code to the new feature-based architecture, it's always good practice to verify that nothing breaks before removing old files.
