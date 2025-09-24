Write-Host "GYMovoo Over-Engineering Detection" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Checking large files (over 300 lines):" -ForegroundColor Blue
Write-Host "======================================="

Get-ChildItem -Recurse -Path "src" -Include "*.tsx","*.ts" | ForEach-Object {
    $lines = (Get-Content $_.FullName | Measure-Object -Line).Lines
    if ($lines -gt 500) {
        Write-Host "CRITICAL: $($_.Name) - $lines lines" -ForegroundColor Red
    } elseif ($lines -gt 300) {
        Write-Host "WARNING: $($_.Name) - $lines lines" -ForegroundColor Yellow
    }
}

Write-Host ""

Write-Host "Checking useState usage (over 5 hooks):" -ForegroundColor Blue
Write-Host "======================================="

$stateFiles = @{}
Get-ChildItem -Recurse -Path "src" -Include "*.tsx","*.ts" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $matches = [regex]::Matches($content, "useState")
    if ($matches.Count -gt 0) {
        $stateFiles[$_.Name] = $matches.Count
    }
}

$stateFiles.GetEnumerator() | Sort-Object Value -Descending | ForEach-Object {
    if ($_.Value -gt 7) {
        Write-Host "CRITICAL: $($_.Key) - $($_.Value) useState hooks" -ForegroundColor Red
    } elseif ($_.Value -gt 5) {
        Write-Host "WARNING: $($_.Key) - $($_.Value) useState hooks" -ForegroundColor Yellow
    }
}

Write-Host ""

Write-Host "Checking useEffect usage (over 3 effects):" -ForegroundColor Blue
Write-Host "=========================================="

$effectFiles = @{}
Get-ChildItem -Recurse -Path "src" -Include "*.tsx","*.ts" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $matches = [regex]::Matches($content, "useEffect")
    if ($matches.Count -gt 0) {
        $effectFiles[$_.Name] = $matches.Count
    }
}

$effectFiles.GetEnumerator() | Sort-Object Value -Descending | ForEach-Object {
    if ($_.Value -gt 5) {
        Write-Host "CRITICAL: $($_.Key) - $($_.Value) useEffect hooks" -ForegroundColor Red
    } elseif ($_.Value -gt 3) {
        Write-Host "WARNING: $($_.Key) - $($_.Value) useEffect hooks" -ForegroundColor Yellow
    }
}

Write-Host ""

Write-Host "Checking 'any' type usage:" -ForegroundColor Blue
Write-Host "=========================="

$anyFiles = @{}
Get-ChildItem -Recurse -Path "src" -Include "*.tsx","*.ts" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $matches = [regex]::Matches($content, ": any|as any")
    if ($matches.Count -gt 0) {
        $anyFiles[$_.Name] = $matches.Count
    }
}

$anyFiles.GetEnumerator() | Sort-Object Value -Descending | ForEach-Object {
    if ($_.Value -gt 3) {
        Write-Host "WARNING: $($_.Key) - $($_.Value) 'any' usages" -ForegroundColor Yellow
    }
}

Write-Host ""

Write-Host "Refactoring Suggestions:" -ForegroundColor Blue
Write-Host "======================"
Write-Host "For files with 500+ lines:" -ForegroundColor Green
Write-Host "   - Split into smaller components"
Write-Host "   - Separate business logic into custom hooks"
Write-Host "   - Move calculations to utility files"
Write-Host ""
Write-Host "For files with many useState:" -ForegroundColor Green
Write-Host "   - Consider using useReducer"
Write-Host "   - Create custom hook for state management"
Write-Host "   - Separate local state from global state"
Write-Host ""
Write-Host "For files with many useEffect:" -ForegroundColor Green
Write-Host "   - Merge similar effects"
Write-Host "   - Move side effects to custom hooks"
Write-Host "   - Use useMemo/useCallback instead of effects"
Write-Host ""
Write-Host "For files with 'any' types:" -ForegroundColor Green
Write-Host "   - Define precise interfaces"
Write-Host "   - Use TypeScript generics"
Write-Host "   - Create type guards for validation"
Write-Host ""

Write-Host "Refactoring Progress:" -ForegroundColor Blue
Write-Host "===================="
Write-Host "Completed:" -ForegroundColor Green
Write-Host "   - MainScreen.tsx: 1700+ -> 771 lines (55% reduction)"
Write-Host "   - QuestionnaireNavigator.tsx: completely removed"
Write-Host ""
Write-Host "In Progress:" -ForegroundColor Yellow
Write-Host "   - ProfileScreen.tsx: 1926 lines (splitting in progress)"
Write-Host "   - BMIBMRCalculator.tsx: 620 lines (splitting in progress)"
Write-Host ""
Write-Host "Pending:" -ForegroundColor Red
Write-Host "   - PersonalInfoScreen.tsx: 500 lines"
Write-Host "   - ExerciseDetailsScreen.tsx: 413 lines"
Write-Host ""

Write-Host "For more info:" -ForegroundColor Blue
Write-Host "   - .github/CODE_REVIEW_CHECKLIST.md"
Write-Host "   - .github/OVER_ENGINEERING_DETECTION.md"
Write-Host ""
Write-Host "Remember: 'Why is this function so complex?' and 'Can we do this in one line?'" -ForegroundColor Green