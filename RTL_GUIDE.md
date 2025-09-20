# מדריך תמיכה מלאה בעברית (RTL) 🚀

## 📋 סקירה כללית

מערכת ה-RTL של האפליקציה כוללת תמיכה מקיפה בעברית עם כללים מתקדמים לפורמטים, סגנונות ותצוגה נכונה.

## 🎯 כללים עיקריים

### 1. **פונקציות בסיסיות**

```typescript
import {
  isRTL,
  getTextDirection,
  getTextAlign,
  getFlexDirection,
  getRTLStyles,
  getDynamicStyles,
} from "../utils/rtlHelpers";

// שימוש בסיסי
const rtl = isRTL(); // true/false
const direction = getTextDirection(); // 'rtl' | 'ltr'
const align = getTextAlign(); // 'right' | 'left'
const flex = getFlexDirection(); // 'row-reverse' | 'row'
```

### 2. **פורמטים בעברית**

```typescript
import {
  formatHebrewNumber,
  formatHebrewDate,
  formatHebrewDateShort,
  formatHebrewTime,
  formatWeightRTL,
  formatHeightRTL,
  formatCaloriesRTL,
  formatWorkoutTimeRTL,
} from "../utils/rtlHelpers";

// דוגמאות
formatHebrewNumber(12345); // "12,345"
formatHebrewDate(new Date()); // "1 בינואר 2024"
formatWeightRTL(75); // "75 ק״ג"
formatWorkoutTimeRTL(90); // "שעה ו-30 דקות"
```

### 3. **סגנונות דינמיים**

```typescript
import {
  getNavigationButtonStyles,
  getFormStyles,
  getHorizontalScrollStyles,
  getModalStyles,
  getTableStyles,
  getToastStyles,
  getCardStyles,
  getListStyles,
  getButtonStyles,
} from "../utils/rtlHelpers";

// שימוש
const navStyles = getNavigationButtonStyles();
const formStyles = getFormStyles();
const cardStyles = getCardStyles();
```

### 4. **המרת אייקונים**

```typescript
import { getRTLIconName } from "../utils/rtlHelpers";

// המרת אייקונים אוטומטית
const backIcon = getRTLIconName("chevron-left"); // 'chevron-right' ב-RTL
const menuIcon = getRTLIconName("menu"); // 'menu-right' ב-RTL
```

## 🔧 Hook מותאם אישית

```typescript
import { useRTL, useHebrewFormatters } from '../hooks/useRTL';

const MyComponent = () => {
  const {
    isRTL,
    textAlign,
    flexDirection,
    writingDirection,
    rtlStyles,
    dynamicStyles,
    alignItems,
    marginStart,
    marginEnd
  } = useRTL();

  const {
    formatNumber,
    formatDate,
    formatTime,
    formatCurrency,
    formatPercent
  } = useHebrewFormatters();

  return (
    <View style={{ flexDirection }}>
      <Text style={{ textAlign, writingDirection }}>
        {formatNumber(12345)}
      </Text>
    </View>
  );
};
```

## 📱 דוגמאות שימוש

### **כפתור ניווט**

```typescript
const NavigationButton = ({ onPress, title }) => {
  const { flexDirection, textAlign, writingDirection } = useRTL();

  return (
    <TouchableOpacity
      style={{ flexDirection }}
      onPress={onPress}
    >
      <Icon name={isRTL ? "chevron-right" : "chevron-left"} />
      <Text style={{ textAlign, writingDirection }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
```

### **טופס עם RTL**

```typescript
const RTLTextInput = ({ label, placeholder, ...props }) => {
  const { textAlign, writingDirection } = useRTL();

  return (
    <View>
      <Text style={{ textAlign, writingDirection }}>
        {label}
      </Text>
      <TextInput
        style={{ textAlign, writingDirection }}
        placeholder={placeholder}
        {...props}
      />
    </View>
  );
};
```

### **כרטיס עם גבול דינמי**

```typescript
const RTLCard = ({ children }) => {
  const rtl = isRTL();

  return (
    <View style={{
      borderLeftWidth: rtl ? 0 : 4,
      borderRightWidth: rtl ? 4 : 0,
      borderLeftColor: rtl ? 'transparent' : theme.colors.primary,
      borderRightColor: rtl ? theme.colors.primary : 'transparent',
    }}>
      {children}
    </View>
  );
};
```

### **גלילה אופקית**

```typescript
const HorizontalScroll = ({ children }) => {
  const rtl = isRTL();

  return (
    <ScrollView
      horizontal
      contentContainerStyle={{
        flexDirection: rtl ? 'row-reverse' : 'row'
      }}
    >
      {children}
    </ScrollView>
  );
};
```

## 🎨 סגנונות מומלצים

### **טקסט**

```typescript
const textStyles = {
  title: {
    textAlign: isRTL() ? "right" : "left",
    writingDirection: isRTL() ? "rtl" : "ltr",
    fontSize: 18,
    fontWeight: "bold",
  },
  body: {
    textAlign: isRTL() ? "right" : "left",
    writingDirection: isRTL() ? "rtl" : "ltr",
    lineHeight: 24,
  },
};
```

### **כפתורים**

```typescript
const buttonStyles = {
  container: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    alignItems: "center",
    padding: 12,
  },
  icon: {
    marginLeft: isRTL() ? 0 : 8,
    marginRight: isRTL() ? 8 : 0,
  },
  text: {
    textAlign: isRTL() ? "right" : "left",
    writingDirection: isRTL() ? "rtl" : "ltr",
  },
};
```

### **טפסים**

```typescript
const formStyles = {
  input: {
    textAlign: isRTL() ? "right" : "left",
    writingDirection: isRTL() ? "rtl" : "ltr",
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  label: {
    textAlign: isRTL() ? "right" : "left",
    writingDirection: isRTL() ? "rtl" : "ltr",
    marginBottom: 8,
    fontWeight: "600",
  },
};
```

## 🔍 בדיקות ופתרון בעיות

### **בדיקת מצב RTL**

```typescript
// הוסף לקומפוננטה לבדיקה
useEffect(() => {
  console.log("RTL Debug:", {
    isRTL: isRTL(),
    I18nManager: I18nManager.isRTL,
    deviceLanguage: getDeviceLanguage(),
  });
}, []);
```

### **פתרון בעיות נפוצות**

1. **RTL לא עובד:**

   ```typescript
   // וודא אתחול נכון ב-App.tsx
   useEffect(() => {
     initializeRTL();
   }, []);
   ```

2. **טקסט לא מיושר נכון:**

   ```typescript
   // השתמש בשני המאפיינים
   style={{
     textAlign: isRTL() ? 'right' : 'left',
     writingDirection: isRTL() ? 'rtl' : 'ltr',
   }}
   ```

3. **אייקונים בכיוון הלא נכון:**
   ```typescript
   // השתמש בפונקציית ההמרה
   const iconName = getRTLIconName("chevron-left");
   ```

## 📚 רשימת כל הפונקציות

### **פונקציות בסיסיות**

- `isRTL()` - בדיקת מצב RTL
- `initializeRTL()` - אתחול מערכת RTL
- `toggleRTL()` - החלפת מצב RTL
- `needsRestart()` - בדיקה אם צריך הפעלה מחדש

### **פורמטים**

- `formatHebrewNumber()` - פורמט מספרים
- `formatHebrewDate()` - פורמט תאריכים מלא
- `formatHebrewDateShort()` - פורמט תאריכים קצר
- `formatHebrewTime()` - פורמט זמן
- `formatWeightRTL()` - פורמט משקל
- `formatHeightRTL()` - פורמט גובה
- `formatCaloriesRTL()` - פורמט קלוריות
- `formatWorkoutTimeRTL()` - פורמט זמן אימון

### **סגנונות דינמיים**

- `getRTLStyles()` - סגנונות RTL בסיסיים
- `getDynamicStyles()` - סגנונות עם מרווחים דינמיים
- `getNavigationButtonStyles()` - סגנונות כפתורי ניווט
- `getFormStyles()` - סגנונות טפסים
- `getHorizontalScrollStyles()` - סגנונות גלילה אופקית
- `getModalStyles()` - סגנונות מודלים
- `getTableStyles()` - סגנונות טבלאות
- `getToastStyles()` - סגנונות התראות
- `getCardStyles()` - סגנונות כרטיסים
- `getListStyles()` - סגנונות רשימות
- `getButtonStyles()` - סגנונות כפתורים

### **עזרים**

- `getRTLIconName()` - המרת שמות אייקונים
- `getRTLConfig()` - קונפיגורציה מלאה
- `numberToHebrewWords()` - המרת מספרים למילים

## 🎉 סיכום

מערכת ה-RTL של האפליקציה מספקת תמיכה מקיפה וגמישה בעברית עם:

- ✅ פורמטים מקומיים
- ✅ סגנונות דינמיים
- ✅ תמיכה באייקונים
- ✅ Hook מותאם אישית
- ✅ בדיקות ופתרון בעיות

השימוש במערכת פשוט ואינטואיטיבי, ומספק חווית משתמש מושלמת למשתמשים דוברי עברית! 🇮🇱
