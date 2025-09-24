# Over-Engineering Detection Rules

## 🔍 GitHub Issues Templates

### Issue Template: Over-Engineering Detection

```markdown
---
name: Over-Engineering Detection
about: קובץ שנראה מורכב מדי ודורש בדיקה
title: "🔍 Over-Engineering: [FILE_NAME]"
labels: ["refactoring", "over-engineering", "code-quality"]
assignees: []
---

## 📊 מדדי המורכבות שזוהו

### בדיקות בסיסיות

- [ ] מספר שורות: \_\_\_
- [ ] מספר פונקציות: \_\_\_
- [ ] מספר hooks/state variables: \_\_\_
- [ ] רמות nesting מקסימליות: \_\_\_

### שאלות חובה

1. **"למה הפונקציה הזאת כל כך מורכבת?"**
   - [ ] מה בדיוק עושה הקובץ/פונקציה הזאת?
   - [ ] אילו אחריות שונות מעורבות כאן?
2. **"אפשר לעשות את זה בשורה אחת?"**
   - [ ] אילו חלקים יכולים להפוך לפונקציות utility?
   - [ ] אילו components יכולים להיות עצמאיים?

### דירוג חומרה

- [ ] 🚨 קריטי (1500+ שורות)
- [ ] ⚠️ גבוה (500-1500 שורות)
- [ ] 💛 בינוני (200-500 שורות)
- [ ] ✅ תקין (< 200 שורות)

## 🛠️ תוכנית פעולה מוצעת

### שלב 1: ניתוח

- [ ] זהה את הכ responsibilities השונות
- [ ] מפה dependencies בין החלקים
- [ ] חפש קוד חוזר או דומה

### שלב 2: פיצול

- [ ] צור custom hooks ללוגיקה
- [ ] חלק UI components
- [ ] העבר utility functions לקבצים נפרדים

### שלב 3: אימות

- [ ] בדוק שהפונקציונליות נשמרה
- [ ] מדוד ביצועים לפני ואחרי
- [ ] וודא שהקוד קריא יותר

## 📈 מדדי הצלחה

- [ ] הקטנה של לפחות 30% בגודל הקובץ
- [ ] פיצול לפחות 3 רכיבים עצמאיים
- [ ] ביטול שימוש ב-any types
- [ ] שיפור readability score
```

### Automated Detection Script

```bash
#!/bin/bash
# detect_over_engineering.sh

echo "🔍 מחפש קבצים שייתכן שמוכלים Over-Engineering..."

# Find large files
echo "📊 קבצים גדולים (מעל 300 שורות):"
find src -name "*.tsx" -o -name "*.ts" | xargs wc -l | sort -nr | head -20

# Find files with many useState calls (potential complex state)
echo "📊 קבצים עם הרבה state (מעל 5 useState):"
grep -r "useState" src --include="*.tsx" --include="*.ts" | cut -d: -f1 | sort | uniq -c | sort -nr | head -10

# Find files with many useEffect calls
echo "📊 קבצים עם הרבה effects (מעל 3 useEffect):"
grep -r "useEffect" src --include="*.tsx" --include="*.ts" | cut -d: -f1 | sort | uniq -c | sort -nr | head -10

# Find functions with many parameters
echo "📊 פונקציות עם הרבה פרמטרים:"
grep -r "function.*(" src --include="*.tsx" --include="*.ts" | grep -o "(.*)" | grep "," | wc -l

# Find deeply nested code
echo "📊 קוד עם nesting עמוק:"
grep -r "        {" src --include="*.tsx" --include="*.ts" | wc -l
```

### Pre-commit Hook

```bash
#!/bin/sh
# pre-commit hook to detect over-engineering

# Check for files over 300 lines
large_files=$(find src -name "*.tsx" -o -name "*.ts" | xargs wc -l | awk '$1 > 300 {print $2}')

if [ ! -z "$large_files" ]; then
    echo "⚠️  זוהו קבצים גדולים שיכולים להיות over-engineered:"
    echo "$large_files"
    echo ""
    echo "💡 שקול לפצל את הקבצים הללו לרכיבים קטנים יותר"
    echo "📖 קרא את .github/CODE_REVIEW_CHECKLIST.md למידע נוסף"
    echo ""
    echo "❓ להמשיך עם ה-commit? (y/N)"
    read -r response
    if [ "$response" != "y" ] && [ "$response" != "Y" ]; then
        echo "Commit בוטל"
        exit 1
    fi
fi
```

### VSCode Settings for Detection

```json
{
  "eslint.rules.customizations": [
    {
      "rule": "max-lines",
      "severity": "warn",
      "fixable": false
    },
    {
      "rule": "complexity",
      "severity": "warn"
    },
    {
      "rule": "max-lines-per-function",
      "severity": "warn"
    }
  ],
  "eslint.options": {
    "overrides": [
      {
        "files": ["*.tsx", "*.ts"],
        "rules": {
          "max-lines": ["warn", { "max": 300, "skipBlankLines": true }],
          "max-lines-per-function": ["warn", { "max": 30 }],
          "complexity": ["warn", { "max": 10 }],
          "max-params": ["warn", { "max": 5 }],
          "@typescript-eslint/no-explicit-any": "error"
        }
      }
    ]
  }
}
```

## 🎯 רשימת קבצים לבדיקה בפרוייקט

### ✅ כבר טופלו

- [x] MainScreen.tsx (1700+ → 771 שורות, 55% חיסכון)
- [x] QuestionnaireNavigator.tsx (הוסר לחלוטין)

### 🔄 בטיפול

- [ ] ProfileScreen.tsx (1926 שורות - בתהליך פיצול)
- [ ] BMIBMRCalculator.tsx (620 שורות - בתהליך פיצול)

### ⏳ ממתינים לבדיקה

- [ ] PersonalInfoScreen.tsx (500 שורות)
- [ ] ExerciseDetailsScreen.tsx (413 שורות - נמצא בחיפוש)
- [ ] WorkoutSummaryScreen.tsx (לבדיקה)
- [ ] ActiveWorkoutScreen.tsx (לבדיקה)

### 🔍 לזיהוי אוטומטי

קבצים שיכולים להכיל over-engineering ויזוהו על ידי הסקריפטים:

- כל קובץ מעל 300 שורות
- כל קובץ עם יותר מ-5 useState
- כל קובץ עם יותר מ-3 useEffect
- כל פונקציה מעל 30 שורות

---

_"המטרה היא לא לכתוב פחות קוד, אלא לכתוב קוד פשוט יותר"_
