# 📐 מדריך שילוב עברית, אימוג'ים וכפתורים - GYMovoo

## 🎯 עקרונות יסוד

### 1. **סדר האלמנטים בעברית**

```
[טקסט עברי] [אימוג'י]  ✅
[אימוג'י] [טקסט עברי]  ❌
```

### 2. **יישור אוניברסלי**

- **כותרות ראשיות:** מרכז תמיד
- **כותרות משנה:** ימין ב-RTL
- **טקסט רגיל:** ימין ב-RTL
- **כפתורים:** מרכז או מלא

## 📱 דוגמאות מעשיות

### **כותרות עם אימוג'ים**

```tsx
// ✅ נכון - אימוג'י בסוף
<Text style={styles.title}>ברוך הבא 👋</Text>
<Text style={styles.subtitle}>התקדמות האימונים שלך 💪</Text>

// ❌ לא נכון - אימוג'י בהתחלה
<Text style={styles.title}>👋 ברוך הבא</Text>
```

### **כפתורים עם אייקונים**

```tsx
// כפתור ראשי - טקסט במרכז, אייקון מימין
<AppButton
  title="התחל אימון"
  icon="play-circle"
  iconPosition="right"  // תמיד מימין בעברית
  variant="primary"
/>

// כפתור משני - אותו עיקרון
<AppButton
  title="הוסף תרגיל"
  icon="plus"
  iconPosition="right"
  variant="secondary"
/>
```

### **רשימות עם אייקונים**

```tsx
// ✅ נכון - אייקון מימין, טקסט משמאל
<View style={styles.listItem}>
  <Icon name="check-circle" />
  <Text>השלמת 5 אימונים השבוע</Text>
</View>

// סגנון מומלץ
listItem: {
  flexDirection: 'row-reverse',  // חשוב!
  alignItems: 'center',
  gap: 8,
}
```

## 🎨 סגנונות סטנדרטיים

### **היררכיית כותרות**

```tsx
const textStyles = {
  // כותרת ראשית - תמיד במרכז
  h1: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },

  // כותרת משנית - יישור לימין
  h2: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "right",
    marginBottom: 16,
  },

  // כותרת סעיף
  h3: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "right",
    marginBottom: 12,
  },

  // טקסט רגיל
  body: {
    fontSize: 16,
    textAlign: "right",
    lineHeight: 24,
  },

  // תיאור/הערה
  caption: {
    fontSize: 14,
    color: "#666",
    textAlign: "right",
  },
};
```

### **סגנונות כפתורים**

```tsx
const buttonStyles = {
  // כפתור ראשי מלא
  primaryFull: {
    width: "100%",
    flexDirection: "row-reverse",
    justifyContent: "center",
    gap: 8,
  },

  // כפתור משני
  secondary: {
    flexDirection: "row-reverse",
    paddingHorizontal: 16,
    gap: 6,
  },

  // כפתור טקסט בלבד
  textButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
  },
};
```

## 📋 טבלת התאמות אימוג'ים

### **אימוג'ים לפעולות**

| פעולה | אימוג'י מומלץ | מיקום      |
| ----- | ------------- | ---------- |
| התחלה | ▶️ 🏃‍♂️ 💪      | אחרי הטקסט |
| הוספה | ➕ ✨         | אחרי הטקסט |
| מחיקה | 🗑️ ❌         | אחרי הטקסט |
| עריכה | ✏️ 📝         | אחרי הטקסט |
| שמירה | 💾 ✅         | אחרי הטקסט |
| ביטול | ❌ 🚫         | אחרי הטקסט |

### **אימוג'ים לסטטוסים**

| סטטוס | אימוג'י | דוגמה                     |
| ----- | ------- | ------------------------- |
| הצלחה | ✅ 🎉   | "האימון הושלם בהצלחה! 🎉" |
| אזהרה | ⚠️ 🟡   | "שים לב למשקל 🟡"         |
| שגיאה | ❌ 🔴   | "משהו השתבש ❌"           |
| מידע  | ℹ️ 💡   | "טיפ: שמור על גב ישר 💡"  |

## 🔧 פונקציות עזר מומלצות

### **עטיפת טקסט עם אימוג'י**

```tsx
// filepath: src/utils/textHelpers.ts
import { isRTL } from "./rtlHelpers";

export const wrapWithEmoji = (
  text: string,
  emoji: string,
  position: "start" | "end" = "end"
): string => {
  if (isRTL()) {
    // בעברית - אימוג'י תמיד בסוף
    return `${text} ${emoji}`;
  }
  return position === "start" ? `${emoji} ${text}` : `${text} ${emoji}`;
};
```

### **יצירת כפתור עם אייקון**

```tsx
interface ButtonConfig {
  title: string;
  icon?: string;
  emoji?: string;
}

export const createButtonText = ({ title, emoji }: ButtonConfig): string => {
  if (!emoji) return title;
  return isRTL() ? `${title} ${emoji}` : `${emoji} ${title}`;
};
```

## 📏 מרווחים וריווח

### **מרווחים סטנדרטיים**

```tsx
const spacing = {
  xs: 4, // בין אייקון לטקסט בכפתור קטן
  sm: 8, // בין אייקון לטקסט בכפתור רגיל
  md: 12, // בין אלמנטים ברשימה
  lg: 16, // בין סעיפים
  xl: 24, // בין חלקים ראשיים
};
```

### **דוגמת מימוש**

```tsx
// כרטיס אימון
<View style={styles.workoutCard}>
  <View style={styles.header}>
    <Text style={styles.title}>אימון חזה וגב 💪</Text>
    <Text style={styles.duration}>45 דקות ⏱️</Text>
  </View>

  <View style={styles.stats}>
    <View style={styles.statItem}>
      <Icon name="fire" />
      <Text>320 קלוריות</Text>
    </View>
    <View style={styles.statItem}>
      <Icon name="dumbbell" />
      <Text>8 תרגילים</Text>
    </View>
  </View>

  <AppButton
    title="התחל אימון"
    icon="play-circle"
    iconPosition="right"
    fullWidth
  />
</View>;

const styles = {
  workoutCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 4,
  },
  duration: {
    fontSize: 16,
    color: "#666",
    textAlign: "right",
  },
  stats: {
    flexDirection: "row-reverse",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  statItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
  },
};
```

## ✅ כללי אצבע

1. **אימוג'ים תמיד בסוף** הטקסט העברי
2. **אייקונים תמיד מימין** לטקסט בכפתורים
3. **flexDirection: 'row-reverse'** בכל מקום
4. **textAlign: 'right'** לכל טקסט (מלבד כותרות ראשיות)
5. **gap** במקום marginLeft/Right למרווחים
6. **כותרות ראשיות במרכז** - יוצרות היררכיה ברורה

## 🚫 טעויות נפוצות

```tsx
// ❌ לא נכון
<Text>💪 בואו נתחיל</Text>
<Button icon="chevron-left" />  // חץ שמאלה בעברית
<View style={{ marginLeft: 10 }}>  // margin שמאלי

// ✅ נכון
<Text>בואו נתחיל 💪</Text>
<Button icon="chevron-right" />  // חץ ימינה בעברית
<View style={{ marginRight: 10 }}>  // margin ימני
```

## 🎯 דוגמת מסך מושלם

```tsx
const PerfectRTLScreen = () => (
  <ScrollView style={styles.container}>
    {/* כותרת ראשית מרכזית */}
    <Text style={styles.mainTitle}>האימונים שלי 🏋️</Text>

    {/* כותרת משנה מיושרת ימין */}
    <Text style={styles.subtitle}>השבוע הזה</Text>

    {/* כרטיסי אימון */}
    <View style={styles.workoutsList}>
      {workouts.map((workout) => (
        <TouchableOpacity style={styles.workoutCard} key={workout.id}>
          <View style={styles.cardHeader}>
            <Text style={styles.workoutTitle}>
              {workout.name} {workout.emoji}
            </Text>
            <Icon name="chevron-right" />
          </View>
          <Text style={styles.workoutInfo}>
            {workout.duration} דקות • {workout.exercises} תרגילים
          </Text>
        </TouchableOpacity>
      ))}
    </View>

    {/* כפתור פעולה ראשי */}
    <AppButton
      title="הוסף אימון חדש"
      icon="plus"
      iconPosition="right"
      variant="primary"
      fullWidth
    />
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
    color: "#333",
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "right",
    marginBottom: 16,
    color: "#666",
  },
  workoutsList: {
    gap: 12,
    marginBottom: 24,
  },
  workoutCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "right",
    color: "#333",
  },
  workoutInfo: {
    fontSize: 14,
    color: "#666",
    textAlign: "right",
  },
});
```

## 🎨 שילוב עם rtlHelpers.ts

### **שימוש בפונקציות קיימות**

```tsx
import {
  isRTL,
  getFlexDirection,
  getTextAlign,
  getRTLIconName,
  getButtonStyles,
  formatHebrewNumber,
} from "../utils/rtlHelpers";

// דוגמת שימוש
const ExerciseCard = ({ exercise }) => {
  const buttonStyles = getButtonStyles();

  return (
    <View style={styles.card}>
      <Text style={{ textAlign: getTextAlign() }}>
        {exercise.name} {exercise.emoji}
      </Text>
      <Text style={{ textAlign: getTextAlign() }}>
        {formatHebrewNumber(exercise.sets)} סטים
      </Text>
      <TouchableOpacity style={buttonStyles.container}>
        <Icon name={getRTLIconName("chevron-right")} />
        <Text>התחל תרגיל 🏃‍♂️</Text>
      </TouchableOpacity>
    </View>
  );
};
```

### **הוספת פונקציות חדשות ל-rtlHelpers.ts**

```tsx
/**
 * עטיפת טקסט עם אימוג'י בהתאם ל-RTL
 */
export const wrapTextWithEmoji = (
  text: string,
  emoji: string,
  position: "start" | "end" = "end"
): string => {
  if (isRTL()) {
    return `${text} ${emoji}`; // תמיד בסוף בעברית
  }
  return position === "start" ? `${emoji} ${text}` : `${text} ${emoji}`;
};

/**
 * סגנונות כפתור עם אימוג'י
 */
export const getEmojiButtonStyles = () => {
  const rtl = isRTL();

  return {
    container: {
      flexDirection: rtl ? "row-reverse" : "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    text: {
      textAlign: rtl ? "right" : "left",
    },
  };
};

/**
 * פורמט כותרת עם אימוג'י
 */
export const formatTitleWithEmoji = (title: string, emoji: string): string => {
  return wrapTextWithEmoji(title, emoji, "end");
};
```

---

**שימוש במדריך זה יבטיח עקביות וחוויית משתמש מושלמת בעברית! 🎯**

## 📚 משאבים נוספים

- [דוקומנטציה RTL Helpers](./rtlHelpers.ts)
- [מדריך עיצוב כללי](./app-structure.md)
- [רכיבי UI בסיסיים](../src/components/ui/)
