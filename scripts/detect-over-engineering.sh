#!/bin/bash

# Over-Engineering Detection Script for GYMovoo
# הסקריפט מזהה אוטומטית קבצים שיכולים להכיל over-engineering

echo "🔍 GYMovoo Over-Engineering Detection"
echo "====================================="
echo ""

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to count lines in TypeScript/React files
count_large_files() {
    echo -e "${BLUE}📊 בדיקת קבצים גדולים (מעל 300 שורות):${NC}"
    echo "================================================"
    
    find src -name "*.tsx" -o -name "*.ts" | while read file; do
        lines=$(wc -l < "$file")
        if [ "$lines" -gt 500 ]; then
            echo -e "${RED}🚨 CRITICAL: $file - $lines שורות${NC}"
        elif [ "$lines" -gt 300 ]; then
            echo -e "${YELLOW}⚠️  WARNING: $file - $lines שורות${NC}"
        fi
    done
    echo ""
}

# Function to find files with many useState hooks
count_state_usage() {
    echo -e "${BLUE}📊 בדיקת שימוש ב-useState (מעל 5 hooks):${NC}"
    echo "=============================================="
    
    grep -r "useState" src --include="*.tsx" --include="*.ts" | cut -d: -f1 | sort | uniq -c | sort -nr | while read count file; do
        if [ "$count" -gt 7 ]; then
            echo -e "${RED}🚨 CRITICAL: $file - $count useState hooks${NC}"
        elif [ "$count" -gt 5 ]; then
            echo -e "${YELLOW}⚠️  WARNING: $file - $count useState hooks${NC}"
        fi
    done
    echo ""
}

# Function to find files with many useEffect hooks
count_effect_usage() {
    echo -e "${BLUE}📊 בדיקת שימוש ב-useEffect (מעל 3 effects):${NC}"
    echo "=============================================="
    
    grep -r "useEffect" src --include="*.tsx" --include="*.ts" | cut -d: -f1 | sort | uniq -c | sort -nr | while read count file; do
        if [ "$count" -gt 5 ]; then
            echo -e "${RED}🚨 CRITICAL: $file - $count useEffect hooks${NC}"
        elif [ "$count" -gt 3 ]; then
            echo -e "${YELLOW}⚠️  WARNING: $file - $count useEffect hooks${NC}"
        fi
    done
    echo ""
}

# Function to find files with 'any' type usage
check_any_usage() {
    echo -e "${BLUE}📊 בדיקת שימוש ב-any type:${NC}"
    echo "================================"
    
    grep -r ": any\|as any" src --include="*.tsx" --include="*.ts" | cut -d: -f1 | sort | uniq -c | sort -nr | while read count file; do
        if [ "$count" -gt 3 ]; then
            echo -e "${YELLOW}⚠️  WARNING: $file - $count 'any' usages${NC}"
        fi
    done
    echo ""
}

# Function to suggest refactoring actions
suggest_refactoring() {
    echo -e "${BLUE}💡 הצעות לרפקטורינג:${NC}"
    echo "======================"
    echo -e "${GREEN}✅ לקבצים עם 500+ שורות:${NC}"
    echo "   - פצל לכמה קומפוננטים קטנים"
    echo "   - הפרד לוגיקה עסקית ל-custom hooks"
    echo "   - העבר חישובים לקבצי utility"
    echo ""
    echo -e "${GREEN}✅ לקבצים עם הרבה useState:${NC}"
    echo "   - שקול שימוש ב-useReducer"
    echo "   - צור custom hook לניהול ה-state"
    echo "   - הפרד local state מ-global state"
    echo ""
    echo -e "${GREEN}✅ לקבצים עם הרבה useEffect:${NC}"
    echo "   - מזג effects דומים"
    echo "   - העבר side effects ל-custom hooks"
    echo "   - השתמש ב-useMemo/useCallback במקום effects"
    echo ""
    echo -e "${GREEN}✅ לקבצים עם 'any' types:${NC}"
    echo "   - הגדר interfaces מדויקות"
    echo "   - השתמש ב-TypeScript generics"
    echo "   - צור type guards לvaliation"
    echo ""
}

# Function to show current progress
show_progress() {
    echo -e "${BLUE}📈 התקדמות הרפקטורינג:${NC}"
    echo "=========================="
    echo -e "${GREEN}✅ הושלמו:${NC}"
    echo "   - MainScreen.tsx: 1700+ → 771 שורות (55% חיסכון)"
    echo "   - QuestionnaireNavigator.tsx: הוסר לחלוטין"
    echo ""
    echo -e "${YELLOW}🔄 בתהליך:${NC}"
    echo "   - ProfileScreen.tsx: 1926 שורות (בפיצול)"
    echo "   - BMIBMRCalculator.tsx: 620 שורות (בפיצול)"
    echo ""
    echo -e "${RED}⏳ ממתינים:${NC}"
    echo "   - PersonalInfoScreen.tsx: 500 שורות"
    echo "   - ExerciseDetailsScreen.tsx: 413 שורות"
    echo ""
}

# Main execution
main() {
    count_large_files
    count_state_usage
    count_effect_usage
    check_any_usage
    suggest_refactoring
    show_progress
    
    echo -e "${BLUE}🔗 למידע נוסף:${NC}"
    echo "   - .github/CODE_REVIEW_CHECKLIST.md"
    echo "   - .github/OVER_ENGINEERING_DETECTION.md"
    echo ""
    echo -e "${GREEN}💡 זכור: 'למה הפונקציה הזאת כל כך מורכבת?' ו-'אפשר לעשות את זה בשורה אחת?'${NC}"
}

# Run the main function
main