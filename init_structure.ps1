# הרץ בספריית הפרויקט שלך
$folders = @(
    "app",
    "src/screens/welcome/components",
    "src/screens/auth/components",
    "src/screens/questionnaire/components",
    "src/screens/summary/components",
    "src/screens/plans/components",
    "src/screens/plan-detail/components",
    "src/screens/workout/components",
    "src/components/common",
    "src/components/forms",
    "src/components/workout",
    "src/components/ui",
    "src/hooks",
    "src/stores",
    "src/services",
    "src/types",
    "src/utils",
    "src/constants",
    "src/styles",
    "assets",
    "docs"
)
foreach ($folder in $folders) {
    New-Item -ItemType Directory -Force -Path $folder
}

# קבצי placeholder (דוגמה)
@"
"// placeholder"
"@ | Set-Content -Path app/_layout.tsx
@"
"// placeholder"
"@ | Set-Content -Path app/index.tsx

$files = @(
    "src/screens/welcome/WelcomeScreen.tsx",
    "src/screens/welcome/types.ts",
    "src/screens/auth/LoginScreen.tsx",
    "src/screens/auth/RegisterScreen.tsx",
    "src/screens/auth/types.ts",
    "src/screens/questionnaire/QuestionnaireScreen.tsx",
    "src/screens/questionnaire/types.ts",
    "src/screens/summary/SummaryScreen.tsx",
    "src/screens/summary/types.ts",
    "src/screens/plans/PlansListScreen.tsx",
    "src/screens/plans/types.ts",
    "src/screens/plan-detail/PlanDetailScreen.tsx",
    "src/screens/plan-detail/types.ts",
    "src/screens/workout/ActiveWorkoutScreen.tsx",
    "src/screens/workout/types.ts",
    "src/components/workout/ExerciseCard.tsx",
    "src/components/workout/SetRow.tsx",
    "src/components/workout/WorkoutHeader.tsx",
    "src/components/workout/ProgressBar.tsx",
    "src/hooks/useWorkout.ts",
    "src/hooks/useExercise.ts",
    "src/hooks/useAuth.ts",
    "src/stores/userStore.ts",
    "src/stores/workoutStore.ts",
    "src/stores/historyStore.ts",
    "src/services/authService.ts",
    "src/services/workoutService.ts",
    "src/services/storageService.ts",
    "src/types/user.ts",
    "src/types/workout.ts",
    "src/types/common.ts",
    "src/utils/validation.ts",
    "src/utils/formatting.ts",
    "src/utils/constants.ts",
    "src/constants/colors.ts",
    "src/constants/strings.ts",
    "src/constants/config.ts",
    "src/styles/theme.ts",
    "src/styles/rtl.ts",
    "src/styles/components.ts",
    "src/styles/workout.ts",
    "README.md"
)

foreach ($file in $files) {
    if (!(Test-Path $file)) {
        @"
// placeholder
"@ | Set-Content -Path $file
    }
}
Write-Host "✅ כל התיקיות והקבצים נוצרו עם placeholder!"
