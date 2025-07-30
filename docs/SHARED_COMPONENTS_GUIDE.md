// docs/SHARED_COMPONENTS_GUIDE.md

# מדריך רכיבים משותפים - GYMovoo

## סקירה כללית

מסמך זה מתעד את הרכיבים המשותפים החדשים שנוספו לפרויקט GYMovoo לשיפור עקביות העיצוב והפחתת קוד חוזר.

## 🧩 רשימת רכיבים

### 1. LoadingSpinner

רכיב טעינה אוניברסלי עם תמיכה בטקסט אופציונלי.

```tsx
import LoadingSpinner from '../components/common/LoadingSpinner';

// שימוש בסיסי
<LoadingSpinner />

// עם טקסט מותאם
<LoadingSpinner text="טוען תרגילים..." />

// עם גודל מותאם
<LoadingSpinner size="large" text="מכין אימון אישי..." />
```

**Props:**

- `text?: string` - טקסט להצגה מתחת לספינר
- `size?: "small" | "large"` - גודל הספינר
- `color?: string` - צבע הספינר

### 2. EmptyState

רכיב לתצוגת מצב ריק עם אייקון ופעולות.

```tsx
import EmptyState from "../components/common/EmptyState";

<EmptyState
  icon="folder-open-outline"
  title="אין אימונים בהיסטוריה"
  description="התחל להתאמן כדי לראות את ההיסטוריה שלך כאן"
>
  <UniversalButton title="התחל אימון" onPress={startWorkout} />
</EmptyState>;
```

**Props:**

- `icon: string` - שם אייקון MaterialCommunityIcons
- `title: string` - כותרת המצב הריק
- `description: string` - תיאור המצב
- `children?: ReactNode` - כפתורי פעולה אופציונליים

### 3. IconButton

כפתור אייקון פשוט ונקי לשימוש חוזר.

```tsx
import IconButton from "../components/common/IconButton";

<IconButton
  icon="heart"
  onPress={toggleFavorite}
  size={24}
  color={theme.colors.primary}
/>;
```

**Props:**

- `icon: string` - שם אייקון MaterialCommunityIcons
- `onPress: () => void` - פונקציית לחיצה
- `size?: number` - גודל האייקון (ברירת מחדל: 24)
- `color?: string` - צבע האייקון
- `disabled?: boolean` - האם הכפתור מבוטל

### 4. ConfirmationModal

מודל אישור לפעולות חשובות.

```tsx
import ConfirmationModal from "../components/common/ConfirmationModal";

<ConfirmationModal
  visible={showDeleteModal}
  title="מחיקת אימון"
  message="האם אתה בטוח שברצונך למחוק את האימון? פעולה זו לא ניתנת לביטול."
  confirmText="מחק"
  cancelText="ביטול"
  onConfirm={deleteWorkout}
  onCancel={() => setShowDeleteModal(false)}
  isDestructive={true}
/>;
```

**Props:**

- `visible: boolean` - האם המודל מוצג
- `title: string` - כותרת המודל
- `message: string` - הודעת האישור
- `confirmText?: string` - טקסט כפתור האישור
- `cancelText?: string` - טקסט כפתור הביטול
- `onConfirm: () => void` - פונקציית אישור
- `onCancel: () => void` - פונקציית ביטול
- `isDestructive?: boolean` - האם הפעולה הרסנית (צבע אדום)

### 5. InputField

שדה קלט משופר עם תמיכה מלאה ב-RTL וvalidation.

```tsx
import InputField from '../components/common/InputField';

<InputField
  label="שם משתמש"
  placeholder="הכנס שם משתמש"
  value={username}
  onChangeText={setUsername}
  leftIcon="person-outline"
  required
  error={usernameError}
/>

// שדה סיסמה עם הצגה/הסתרה
<InputField
  label="סיסמה"
  placeholder="הכנס סיסמה"
  value={password}
  onChangeText={setPassword}
  leftIcon="lock-closed-outline"
  secureTextEntry
  required
/>
```

**Props:**

- `label: string` - תווית השדה
- `placeholder?: string` - טקסט placeholder
- `value: string` - הערך הנוכחי
- `onChangeText: (text: string) => void` - פונקציית שינוי טקסט
- `leftIcon?: string` - אייקון שמאלי
- `rightIcon?: string` - אייקון ימני
- `secureTextEntry?: boolean` - האם זה שדה סיסמה
- `required?: boolean` - האם השדה חובה
- `error?: string` - הודעת שגיאה
- `editable?: boolean` - האם השדה ניתן לעריכה

## 🎯 יתרונות השימוש

### לפני - קוד חוזר

```tsx
// קוד טעינה שחזר על עצמו 10+ פעמים
{
  loading && (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={{ marginTop: 16, color: theme.colors.textSecondary }}>
        טוען...
      </Text>
    </View>
  );
}

// כפתור אייקון שחזר על עצמו רבות
<TouchableOpacity onPress={onPress} style={styles.iconButton}>
  <Ionicons name="heart" size={24} color={theme.colors.text} />
</TouchableOpacity>;
```

### אחרי - רכיבים משותפים

```tsx
// נקי, אחיד ותחזוקה קלה
{
  loading && <LoadingSpinner text="טוען נתונים..." />;
}

<IconButton icon="heart" onPress={toggleFavorite} />;
```

## 📊 השפעה על הפרויקט

- **הפחתת קוד**: ביטול 50+ שורות קוד חוזר
- **עקביות**: מראה ותחושה אחידים בכל האפליקציה
- **תחזוקה**: שינויים במקום אחד משפיעים על כל השימושים
- **RTL**: תמיכה מובנית בעברית בכל הרכיבים
- **TypeScript**: בטיחות טיפוסים מלאה
- **נגישות**: תכונות נגישות מובנות

## 🔄 הגירה הדרגתית

### שלב 1: החלפת דפוסים קיימים

- החלפת ActivityIndicator חוזר ב-LoadingSpinner
- החלפת TouchableOpacity + Ionicons ב-IconButton

### שלב 2: הוספת רכיבים מתקדמים

- שימוש ב-EmptyState במקום תצוגות ריקות מותאמות אישית
- שימוש ב-ConfirmationModal למודלי אישור

### שלב 3: שיפורי UX

- הוספת InputField לטפסים עם validation משופרת
- יצירת רכיבים מורכבים על בסיס הרכיבים הבסיסיים

## 🚀 צעדים הבאים

1. החלפה הדרגתית של דפוסים קיימים ברכיבים המשותפים
2. הוספת רכיבים מיוחדים נוספים לפי הצורך
3. שיקול יצירת רכיבים מורכבים לדפוסים מתקדמים
4. הוספת Storybook או כלי דומה לתיעוד הרכיבים

---

_מסמך זה מעודכן ב-29/07/2025_
