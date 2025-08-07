#======================================================================
# GYMovoo Project Structure Initialization Script
# סקריפט יצירת מבנה הפרויקט של GYMovoo
#======================================================================
# Description: Creates the complete folder and file structure for the GYMovoo fitness app
# תיאור: יוצר את מבנה התיקיות והקבצים המלא עבור אפליקציית הכושר GYMovoo
#======================================================================

Write-Host "🏗️ Starting GYMovoo project structure initialization..." -ForegroundColor Green
Write-Host "מתחיל יצירת מבנה פרויקט GYMovoo..." -ForegroundColor Green

# הרץ בספריית הפרויקט שלך | Run in your project directory
# רשימת תיקיות ליצירה | Folders to create
$folders = @(
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
    "src/navigation",
    "assets/equipment",
    "assets/exercises", 
    "assets/questionnaire",
    "docs",
    "scripts"
)

Write-Host "📁 Creating directory structure..." -ForegroundColor Yellow
Write-Host "יוצר מבנה תיקיות..." -ForegroundColor Yellow

$createdFolders = 0
foreach ($folder in $folders) {
    if (!(Test-Path $folder)) {
        New-Item -ItemType Directory -Force -Path $folder | Out-Null
        $createdFolders++
        Write-Host "  ✓ Created: $folder" -ForegroundColor Green
    } else {
        Write-Host "  → Exists: $folder" -ForegroundColor DarkGray
    }
}
Write-Host "📁 Created $createdFolders new folders" -ForegroundColor Cyan

# יצירת קבצי app layout | Create app layout files
Write-Host "📱 Creating app layout files..." -ForegroundColor Yellow
Write-Host "יוצר קבצי app layout..." -ForegroundColor Yellow

$appLayoutContent = @"
// _layout.tsx - Main app layout
// English: Root layout component for the app
import React from 'react';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
"@

$appIndexContent = @"
// index.tsx - App entry point
// English: Main entry point for the app
import React from 'react';
import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/welcome" />;
}
"@

# הערה: תיקיית app/ הוסרה - הפרויקט משתמש ב-Stack Navigator במקום Expo Router
# Note: app/ directory removed - project uses Stack Navigator instead of Expo Router

# רשימת קבצים ליצירה | Files to create  
Write-Host "📄 Creating placeholder files..." -ForegroundColor Yellow
Write-Host "יוצר קבצי placeholder..." -ForegroundColor Yellow

$files = @(
  # Screens (existing)
  "src/screens/welcome/WelcomeScreen.tsx",
  "src/screens/auth/LoginScreen.tsx",
  "src/screens/profile/ProfileScreen.tsx",
  "src/screens/history/HistoryScreen.tsx",
  "src/screens/questionnaire/UnifiedQuestionnaireScreen.tsx",
  "src/screens/workout/ActiveWorkoutScreen.tsx",
  "src/screens/workout/WorkoutPlansScreen.tsx",

  # Workout components (existing paths)
  "src/screens/workout/components/WorkoutHeader.tsx",
  "src/screens/workout/components/WorkoutStatusBar.tsx",
  "src/screens/workout/components/WorkoutDashboard.tsx",
  "src/screens/workout/components/WorkoutSummary/ActionButtons.tsx",
  "src/screens/workout/components/WorkoutSummary/AchievementsSection.tsx",
  "src/screens/workout/components/WorkoutSummary/FeedbackSection.tsx",
  "src/screens/workout/components/WorkoutSummary/WorkoutStatsGrid.tsx",
  "src/screens/workout/components/ExerciseCard/index.tsx",
  "src/screens/workout/components/ExerciseCard/SetRow.tsx",
  "src/screens/workout/components/ExerciseCard/ExerciseMenu.tsx",
  "src/screens/workout/components/PlateCalculatorModal.tsx",
  "src/screens/workout/components/NextExerciseBar.tsx",
  "src/screens/workout/components/RestTimer.tsx",
  "src/screens/workout/components/shared/TimerDisplay.tsx",
  "src/screens/workout/components/shared/TimeButton.tsx",
  "src/screens/workout/components/shared/TimeAdjustButton.tsx",
  "src/screens/workout/components/shared/StatItem.tsx",
  "src/screens/workout/components/shared/SkipButton.tsx",
  "src/screens/workout/components/shared/CloseButton.tsx",

  # Components (existing)
  "src/components/common/EmptyState.tsx",
  "src/components/common/LoadingSpinner.tsx",
  "src/components/common/IconButton.tsx",
  "src/components/ui/ScreenContainer.tsx",
  "src/components/ui/UniversalButton.tsx",
  "src/components/ui/UniversalCard.tsx",
  "src/components/questionnaire/SmartProgressBar.tsx",
  "src/components/questionnaire/SmartOptionComponent.tsx",

  # Hooks
  "src/screens/workout/hooks/useWorkoutTimer.ts",
  "src/screens/workout/hooks/useRestTimer.ts",
  "src/screens/workout/hooks/useModalManager.tsx",

  # Stores (existing)
  "src/stores/userStore.ts",

  # Services (existing)
  "src/services/questionnaireService.ts",
  "src/services/realisticDemoService.ts",
  "src/services/workoutHistoryService.ts",
  "src/services/workoutSimulationService.ts",
  "src/services/scientificAIService.ts",

  # Types and utils (existing)
  "src/screens/workout/types/workout.types.ts",
  "src/utils/genderAdaptation.ts",
  "src/utils/rtlHelpers.ts",
  "src/utils/workoutHelpers.ts",
  "src/utils/workoutStatsCalculator.ts",
  "src/utils/workoutNamesSync.ts",

  # Navigation and styles (existing)
  "src/navigation/AppNavigator.tsx",
  "src/navigation/BottomNavigation.tsx",
  "src/navigation/types.ts",
  "src/styles/theme.ts",
    
  # Constants (existing)
  "src/constants/historyScreenConfig.ts",
  "src/constants/historyScreenTexts.ts",
  "src/constants/welcomeScreenTexts.ts",
  "src/constants/profileScreenTexts.ts",
  "src/constants/profileScreenColors.ts",
  "src/constants/mainScreenTexts.ts",
  "src/constants/progressScreenTexts.ts"
)

$createdFiles = 0
$placeholderContent = @"
// placeholder - This file will be implemented
// English: Placeholder file for future implementation
"@

foreach ($file in $files) {
  $parent = Split-Path -Path $file -Parent
  if (!(Test-Path $file) -and (Test-Path $parent)) {
    $placeholderContent | Set-Content -Path $file
    $createdFiles++
    Write-Host "  ✓ Created: $file" -ForegroundColor Green
  } elseif (!(Test-Path $parent)) {
    Write-Host "  → Skipped (missing parent folder): $file" -ForegroundColor DarkYellow
  } else {
    Write-Host "  → Exists: $file" -ForegroundColor DarkGray
  }
}
Write-Host "📄 Created $createdFiles new placeholder files" -ForegroundColor Cyan

# סיכום | Summary
Write-Host ""
Write-Host "🎉 GYMovoo project structure initialization completed!" -ForegroundColor Green  
Write-Host "✅ יצירת מבנה פרויקט GYMovoo הושלמה בהצלחה!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Summary | סיכום:" -ForegroundColor White
Write-Host "  • Folders created: $createdFolders | תיקיות נוצרו: $createdFolders" -ForegroundColor Cyan
Write-Host "  • Files created: $createdFiles | קבצים נוצרו: $createdFiles" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 Ready to start developing! | מוכן להתחיל לפתח!" -ForegroundColor Green
