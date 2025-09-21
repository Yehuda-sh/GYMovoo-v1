# 📚 דוגמאות RTL ועברית

תיקייה זו מכילה דוגמאות מעשיות לשימוש נכון בעברית, אימוג'ים וכפתורים באפליקציה.

## 📁 קבצים

### `RTLExamples.tsx`

רכיבי דוגמה מוכנים לשימוש:

- `ExampleTitle` - כותרות עם אימוג'ים
- `ExampleButton` - כפתורים עם אימוג'ים/אייקונים
- `ExampleWorkoutCard` - כרטיס אימון מלא
- `ExampleExerciseList` - רשימת תרגילים
- `ExampleScreen` - מסך מלא לדוגמה

## 🎯 שימוש

```tsx
import { ExampleTitle, ExampleButton } from './components/examples/RTLExamples';

// כותרת עם אימוג'י
<ExampleTitle title="ברוך הבא" emoji="👋" level="h1" />

// כפתור עם אימוג'י אוטומטי
<ExampleButton
  title="התחל אימון"
  action="start"
  onPress={() => {}}
/>
```

## 📋 עקרונות מיושמים

✅ אימוג'ים בסוף הטקסט העברי  
✅ flexDirection: 'row-reverse'  
✅ textAlign: 'right' לטקסט רגיל  
✅ textAlign: 'center' לכותרות ראשיות  
✅ השימוש ב-rtlHelpers.ts

## 🔗 קישורים

- [מדריך מלא](../../docs/hebrew-ui-guide.md)
- [rtlHelpers.ts](../../utils/rtlHelpers.ts)
