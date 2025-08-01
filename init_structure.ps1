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

# Create app files only if they don't exist or are placeholders
if (!(Test-Path "app/_layout.tsx") -or (Get-Content "app/_layout.tsx" -Raw).Trim() -eq '// placeholder') {
    $appLayoutContent | Set-Content -Path "app/_layout.tsx"
    Write-Host "  ✓ Created: app/_layout.tsx" -ForegroundColor Green
}

if (!(Test-Path "app/index.tsx") -or (Get-Content "app/index.tsx" -Raw).Trim() -eq '// placeholder') {
    $appIndexContent | Set-Content -Path "app/index.tsx"  
    Write-Host "  ✓ Created: app/index.tsx" -ForegroundColor Green
}

# רשימת קבצים ליצירה | Files to create  
Write-Host "📄 Creating placeholder files..." -ForegroundColor Yellow
Write-Host "יוצר קבצי placeholder..." -ForegroundColor Yellow

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
    "src/screens/workout/QuickWorkoutScreen.tsx",
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
    "src/services/workoutService.ts",
    "src/services/storageService.ts",
    "src/types/user.ts",
    "src/types/workout.ts",
    "src/types/common.ts",
    "src/utils/validation.ts",
    "src/utils/formatting.ts",
    "src/constants/colors.ts",
    "src/constants/strings.ts", 
    "src/constants/config.ts",
    "src/styles/theme.ts",
    "src/styles/rtl.ts",
    "src/styles/components.ts",
    "src/styles/workout.ts",
    "src/navigation/types.ts"
)

$createdFiles = 0
$placeholderContent = @"
// placeholder - This file will be implemented
// English: Placeholder file for future implementation
"@

foreach ($file in $files) {
    if (!(Test-Path $file)) {
        $placeholderContent | Set-Content -Path $file
        $createdFiles++
        Write-Host "  ✓ Created: $file" -ForegroundColor Green
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
