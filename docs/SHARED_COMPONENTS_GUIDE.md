# מדריך רכיבים משותפים - GYMovoo

**עדכון אחרון:** 02/08/2025

## סקירה כללית

מסמך זה מתעד את הרכיבים המשותפים החדשים שנוספו לפרויקט GYMovoo לשיפור עקביות העיצוב והפחתת קוד חוזר.

## 🧩 רשימת רכיבים

### 1. SetRow - רכיב עריכת סטים מתקדם

רכיב מתקדם לעריכת סטי אימון עם מצב עריכה מלא, חצי מעלית וקלט מקלדת מיועל.

**מיקום:** `src/screens/workout/components/ExerciseCard/SetRow.tsx`

#### 🎯 תכונות עיקריות:

1. **מצב עריכה מתקדם** - הסתרת כפתור השלמה במצב עריכה
2. **חצי מעלית** - העברת סטים למעלה/למטה בעיצוב אלגנטי
3. **קלט מקלדת מיועל** - פתרון לבעיות Android עם פוקוס יציב
4. **ביטול השלמת סט** - לחיצה נוספת מבטלת השלמה
5. **אנימציות חלקות** - מעברים ויזואליים מלוטשים

#### 📋 Interface:

```typescript
interface SetRowProps {
  set: ExtendedSet;
  setNumber: number;
  onUpdate: (updates: Partial<ExtendedSet>) => void;
  onDelete: () => void;
  onComplete: () => void;
  onLongPress: () => void;
  isActive?: boolean;
  exercise: Exercise;
  // מצב עריכה
  isEditMode?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDuplicate?: () => void;
  // מידע על מיקום הסט
  isFirst?: boolean;
  isLast?: boolean;
}
```

#### 🎨 חצי מעלית (Elevator Buttons):

```typescript
// עיצוב מעלית עם משולשים מסתובבים
<View style={styles.elevatorButtonsContainer}>
  {!isFirst && (
    <TouchableOpacity onPress={onMoveUp}>
      <MaterialCommunityIcons
        name="triangle"
        style={{ transform: [{ rotate: '0deg' }] }}
      />
    </TouchableOpacity>
  )}
  {!isLast && (
    <TouchableOpacity onPress={onMoveDown}>
      <MaterialCommunityIcons
        name="triangle"
        style={{ transform: [{ rotate: '180deg' }] }}
      />
    </TouchableOpacity>
  )}
</View>
```

#### 🔧 אופטימיזציה לקלט מקלדת:

```typescript
// פתרון לבעיות Android - TouchableOpacity עטיפה עם פוקוס מפורש
<TouchableOpacity
  activeOpacity={1}
  onPress={() => {
    const input = inputRef.current;
    if (input) {
      input.focus();
    }
  }}
>
  <TextInput
    ref={inputRef}
    keyboardType="numeric"
    selectTextOnFocus={true}
    blurOnSubmit={false}
    showSoftInputOnFocus={true}
    autoCorrect={false}
    spellCheck={false}
  />
</TouchableOpacity>
```

#### ✨ סגנונות מפתח:

```typescript
// חצי מעלית
elevatorButtonsContainer: {
  flexDirection: "column",
  backgroundColor: theme.colors.card,
  borderRadius: 6,
  borderWidth: 1,
  borderColor: theme.colors.cardBorder,
  padding: 2,
  marginHorizontal: 4,
},
elevatorButton: {
  width: 20,
  height: 16,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: theme.colors.background,
  borderRadius: 3,
  marginVertical: 1,
}
```

### 2. LoadingSpinner

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

- `icon: string` - שם אייקון Ionicons
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

- `icon: string` - שם אייקון Ionicons
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

_מסמך זה מעודכן ב-01/08/2025_
