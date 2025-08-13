<#
=======================================================================
 GYMovoo Project Structure Initialization Script
 סקריפט יצירת מבנה הפרויקט של GYMovoo
=======================================================================
 Description: Creates / reconciles the folder + file structure for GYMovoo.
 תיאור: יוצר או משלים את מבנה התיקיות והקבצים (Idempotent)
 Added Features (2025-08-09):
  - Parameters: -DryRun -SkipPlaceholders -Verbose
  - Centralized logging helpers (bilingual)
  - Extended data folders (src/data/...)
  - Safe: no overwrite of existing non-empty files
  - Summary breakdown (Created / Existing / Skipped)
 Future Option: external JSON manifest (structure.json)
=======================================================================
#>

[CmdletBinding()]
param(
  [switch]$DryRun,
  [switch]$SkipPlaceholders,
  [switch]$Verbose
)

function Write-Info($msgHe, $msgEn) { Write-Host "ℹ️  $msgHe | $msgEn" -ForegroundColor Cyan }
function Write-Ok($msgHe, $msgEn)   { Write-Host "✓ $msgHe | $msgEn" -ForegroundColor Green }
function Write-WarnMsg($msgHe, $msgEn){ Write-Host "⚠️  $msgHe | $msgEn" -ForegroundColor Yellow }
function Write-Action($msgHe,$msgEn){ Write-Host "➡ $msgHe | $msgEn" -ForegroundColor Magenta }
function Write-Title($tHe,$tEn){ Write-Host "`n===== $tHe | $tEn =====" -ForegroundColor White }

if ($DryRun) { Write-WarnMsg "מצב סימולציה בלבד – לא יבוצעו שינויים" "DryRun mode – no changes will be written" }

Write-Title "התחלת יצירת / סנכרון מבנה הפרויקט" "Starting project structure sync"

# הרץ בספריית הפרויקט שלך | Run in your project directory
# רשימת תיקיות ליצירה | Folders to create
${folders} = @(
  # Screens & feature modules
  "src/screens/welcome/components",
  "src/screens/auth/components",
  "src/screens/questionnaire/components",
  "src/screens/summary/components",          # TODO: Validate still in use
  "src/screens/plans/components",             # Legacy? keep pending cleanup
  "src/screens/plan-detail/components",       # Legacy? mark for audit
  "src/screens/workout/components",
  "src/screens/exercises",                    # New consolidated exercises dir
  "src/screens/exercise",                     # Transitional (legacy single list)
  # Shared components & infra
  "src/components/common",
  "src/components/forms",
  "src/components/workout",
  "src/components/ui",
  # Data & domain
  "src/data",
  "src/data/exercises",
  "src/data/equipment",
  "src/data/fixtures",
  # Core support
  "src/hooks",
  "src/stores",
  "src/services",
  "src/types",
  "src/utils",
  "src/constants",
  "src/styles",
  "src/navigation",
  # Assets / docs / scripts
  "assets/equipment",
  "assets/exercises",
  "assets/questionnaire",
  "docs",
  "scripts"
)

Write-Action "יוצר/מסנכרן תיקיות" "Creating / reconciling directories"

$createdFolders = 0
foreach ($folder in $folders) {
  if (!(Test-Path $folder)) {
    if ($DryRun) {
      Write-Host "  [DRY] Missing -> would create: $folder" -ForegroundColor DarkYellow
    } else {
      New-Item -ItemType Directory -Force -Path $folder | Out-Null
      $createdFolders++
      Write-Host "  ✓ Created: $folder" -ForegroundColor Green
    }
  } else {
    Write-Host "  → Exists: $folder" -ForegroundColor DarkGray
  }
}
Write-Host "📁 Created $createdFolders new folders" -ForegroundColor Cyan

# יצירת קבצי app layout | Create app layout files
Write-Action "(מדלג) קבצי app layout (Expo Router הוסר)" "Skipping app layout (Expo Router removed)"

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
if (-not $SkipPlaceholders) {
  Write-Action "יוצר קבצי placeholder חסרים" "Creating missing placeholder files"
} else {
  Write-WarnMsg "דילוג על יצירת קבצי placeholder" "Skipping placeholder file generation"
}

${files} = @(
  # Screens (existing)
  "src/screens/welcome/WelcomeScreen.tsx",
  "src/screens/auth/LoginScreen.tsx",
  "src/screens/profile/ProfileScreen.tsx",
  "src/screens/history/HistoryScreen.tsx",
  "src/screens/questionnaire/UnifiedQuestionnaireScreen.tsx",
  "src/screens/workout/ActiveWorkoutScreen.tsx",
  "src/screens/workout/WorkoutPlansScreen.tsx",
  # Exercises (add if missing)
  "src/screens/exercises/ExercisesScreen.tsx",
  "src/screens/exercises/ExerciseDetailsScreen.tsx",
  "src/screens/exercise/ExerciseListScreen.tsx",

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
  # "src/services/realisticDemoService.ts", # הוסר – דמו לא בשימוש
  "src/services/workoutHistoryService.ts",
  # "src/services/workoutSimulationService.ts", # הוסר בניקוי 2025-08-13
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

if (-not $SkipPlaceholders) {
  foreach ($file in $files) {
    $parent = Split-Path -Path $file -Parent
    if (!(Test-Path $file) -and (Test-Path $parent)) {
      if ($DryRun) {
        Write-Host "  [DRY] Would create: $file" -ForegroundColor DarkYellow
      } else {
        $placeholderContent | Set-Content -Path $file
        $createdFiles++
        Write-Host "  ✓ Created: $file" -ForegroundColor Green
      }
    } elseif (!(Test-Path $parent)) {
      Write-WarnMsg "דילוג (תיקיית אב חסרה): $file" "Skipped (missing parent folder): $file"
    } else {
      if ($Verbose) { Write-Host "  → Exists: $file" -ForegroundColor DarkGray }
    }
  }
}
Write-Host "📄 Created $createdFiles new placeholder files" -ForegroundColor Cyan

# סיכום | Summary
Write-Host ""
Write-Title "הושלם" "Completed"
Write-Ok "בדיקת מבנה הסתיימה" "Structure reconciliation complete"
Write-Host "📊 Folders created: $createdFolders" -ForegroundColor Cyan
if (-not $SkipPlaceholders) { Write-Host "📄 Files created: $createdFiles" -ForegroundColor Cyan }
if ($DryRun) { Write-WarnMsg "לא בוצעו שינויים בפועל (DryRun)" "No actual changes were made (DryRun)" }
Write-Host "🚀 מוכן להמשך פיתוח | Ready for development" -ForegroundColor Green
