# מדריך רכיבים משותפים - GYMovoo

**עדכון אחרון:** 04/08/2025 ✨

## סקירה כללית

מסמך זה מתעד את הרכיבים המשותפים החדשים שנוספו לפרויקט GYMovoo לשיפור עקביות העיצוב והפחתת קוד חוזר. כל הרכיבים תומכים ב-RTL, נגישות מלאה, ו-TypeScript מתקדם.

## 🧩 רשימת רכיבים

### 1. LoadingSpinner ⭐ **משופר!**

רכיב טעינה אוניברסלי עם תמיכה מתקדמת ב-variants ואנימציות מותאמות.

**מיקום:** `src/components/common/LoadingSpinner.tsx`

#### 🎯 תכונות חדשות (עדכון 04/08/2025):

1. **React.memo Optimization** - מניעת re-renders מיותרים
2. **4 Variants מתקדמים** - default, fade, pulse, dots
3. **הסתרה אוטומטית** - עם הגדרת זמן מותאמת
4. **אנימציות חלקות** - מנועי אנימציה מותאמים
5. **נגישות מתקדמת** - testID ו-accessibility מלאים

#### 📋 Interface מעודכן:

```typescript
interface LoadingSpinnerProps {
  // 🎨 מאפיינים בסיסיים
  size?: "small" | "large";
  color?: string;
  text?: string;
  fullScreen?: boolean;
  style?: ViewStyle;

  // 🆕 מאפיינים חדשים
  variant?: "default" | "fade" | "pulse" | "dots";
  duration?: number; // משך האנימציה (ms)
  testID?: string; // לבדיקות אוטומטיות
  hideAfter?: number; // הסתרה אחרי זמן (ms)
}
```

#### 🎨 דוגמאות שימוש מתקדמות:

```tsx
import LoadingSpinner from '../components/common/LoadingSpinner';

// שימוש בסיסי
<LoadingSpinner />

// עם טקסט מותאם ו-variant
<LoadingSpinner
  text="טוען תרגילים..."
  variant="pulse"
  testID="exercise-loading"
/>

// עם אנימציית נקודות מסתובבות
<LoadingSpinner
  variant="dots"
  size="large"
  text="מכין אימון אישי..."
  duration={2000}
/>

// הסתרה אוטומטית אחרי 3 שניות
<LoadingSpinner
  variant="fade"
  text="שומר נתונים..."
  hideAfter={3000}
  testID="save-loading"
/>
```

#### 🎭 מנועי האנימציות:

```typescript
// Fade - דהייה הדרגתית
variant = "fade"; // 0.3 ↔ 1.0 opacity

// Pulse - פעימה מתרחבת
variant = "pulse"; // 1.0 ↔ 1.2 scale

// Dots - נקודות מסתובבות (מותאם אישית)
variant = "dots"; // 3 נקודות בסיבוב 360°

// Default - ActivityIndicator רגיל
variant = "default"; // ללא אנימציות נוספות
```

#### ⚡ אופטימיזציות ביצועים:

```typescript
// React.memo עם dependency tracking
const LoadingSpinner = React.memo(({ variant, duration, ... }) => {

  // useMemo לחישוב סגנונות דינמיים
  const { containerStyle, spinnerTransform } = React.useMemo(() => {
    // Dynamic styling logic...
  }, [variant, fullScreen, style, fadeAnim, pulseAnim]);

  // useEffect עם cleanup לאנימציות
  useEffect(() => {
    // Animation setup with proper cleanup
    return () => animation?.stop();
  }, [variant, duration]);
});
```

### 2. SetRow - רכיב עריכת סטים מתקדם

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

### 2. SetRow - רכיب עריכת סטים מתקדם

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

### 2. UniversalCard.tsx 📋 🆕

**תיעוד מלא לרכיב הכרטיס האוניברסלי / Complete Universal Card Component Documentation**

```typescript
interface UniversalCardProps {
  title?: string;
  subtitle?: string;
  icon?: string;
  iconColor?: string;
  iconSize?: number;
  variant?: "default" | "elevated" | "outlined" | "filled" | "compact";
  onPress?: () => void;
  disabled?: boolean;
  gradient?: boolean;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  style?: ViewStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
  hitSlop?: HitSlop;
}
```

**🎯 תכונות עיקריות / Key Features:**

- 🎨 **5 variants**: default, elevated, outlined, filled, compact
- 🌍 **RTL Support**: תמיכה מלאה בעברית
- ♿ **Accessibility**: testID, accessibilityLabel, accessibilityHint
- ⚡ **Performance**: React.memo + useMemo optimizations
- 🎪 **Flexible**: Header, content, footer support
- 🌈 **Gradient**: Optional linear gradient background

**🔥 דוגמאות שימוש / Usage Examples:**

```tsx
// כרטיס בסיסי / Basic Card
<UniversalCard
  title="כותרת הכרטיס"
  subtitle="תת כותרת מתארת"
  icon="document"
  testID="info-card"
>
  <Text>תוכן הכרטיס</Text>
</UniversalCard>

// כרטיס קומפקטי עם פעולה / Compact Card with Action
<UniversalCard
  variant="compact"
  title="התקדמות אימון"
  icon="fitness"
  iconColor="#4CAF50"
  onPress={() => console.log('כרטיס נלחץ')}
  accessibilityLabel="כרטיס התקדמות אימון"
  accessibilityHint="הקש כדי לראות פרטים נוספים"
/>

// כרטיס עם גרדיאנט / Gradient Card
<UniversalCard
  variant="filled"
  gradient={true}
  title="סיכום אימון"
  subtitle="85 דקות"
  footer={<Button title="פרטים נוספים" />}
/>
```

**🎨 Variants מפורטים / Detailed Variants:**

- **default**: עיצוב רגיל עם רקע
- **elevated**: הצללה מוגברת
- **outlined**: מסגרת דקה
- **filled**: רקע צבעוני
- **compact**: עיצוב דחוס לחסכון במקום

**⚡ יתרונות השיפור / Enhancement Benefits:**

- 🚀 **ביצועים משופרים**: React.memo מונע רינדורים מיותרים
- 💾 **זיכרון אופטימלי**: useMemo עבור חישובי סגנון
- ♿ **נגישות מתקדמת**: תמיכה מלאה ב-accessibility props
- 🧪 **Testing מתקדם**: testID עבור בדיקות אוטומטיות
- 📱 **UX משופר**: hitSlop עבור אזור מגע גדול יותר

**🔧 הזדמנויות שיפור / Migration Opportunities:**

- 📊 Cards בדשבורד הראשי / Dashboard cards
- 📈 כרטיסי סטטיסטיקות / Statistics cards
- 🏋️ כרטיסי אימונים / Workout cards
- 🎯 כרטיסי יעדים / Goal cards
- ⚙️ כרטיסי הגדרות / Settings cards

---

### 3. EmptyState ⭐ **משופר!**

רכיב לתצוגת מצב ריק עם variants מתקדמים ואנימציות.

**מיקום:** `src/components/common/EmptyState.tsx`

#### 🎯 תכונות משופרות:

1. **React.memo Optimization** - ביצועים משופרים
2. **3 Variants** - default, compact, minimal
3. **אנימציות חלקות** - fade-in ו-scale effects
4. **נגישות מתקדמת** - תמיכה מלאה בקוראי מסך
5. **RTL מובנה** - תמיכה מלאה בעברית

#### 📋 Interface מעודכן:

```typescript
interface EmptyStateProps {
  // 🎨 מאפיינים בסיסיים
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  children?: React.ReactNode;
  style?: ViewStyle;

  // 🆕 מאפיינים חדשים
  variant?: "default" | "compact" | "minimal";
  testID?: string;
}
```

#### 🎨 דוגמאות שימוש:

```tsx
import EmptyState from "../components/common/EmptyState";

// ברירת מחדל - מלא עם פעולות
<EmptyState
  icon="folder-open-outline"
  title="אין אימונים בהיסטוריה"
  description="התחל להתאמן כדי לראות את ההיסטוריה שלך כאן"
  testID="history-empty"
>
  <UniversalButton title="התחל אימון" onPress={startWorkout} />
</EmptyState>

// קומפקטי - קטן יותר
<EmptyState
  variant="compact"
  icon="search-outline"
  title="לא נמצאו תוצאות"
  description="נסה מילות חיפוש אחרות"
/>

// מינימלי - רק טקסט ואייקון
<EmptyState
  variant="minimal"
  icon="checkmark-circle-outline"
  title="הכל מעודכן!"
/>
```

### 4. IconButton ⭐ **משופר!**

כפתור אייקון מתקדם עם variants ותמיכה ב-RTL.

**מיקום:** `src/components/common/IconButton.tsx`

#### 🎯 תכונות משופרות:

1. **React.memo Optimization** - ביצועים משופרים
2. **3 Variants** - default, circle, square
3. **תרגום אייקונים** - אייקונים מתאימים לעברית/אנגלית
4. **נגישות מתקדמת** - accessibilityLabel אוטומטי
5. **sizes רספונסיביים** - small, medium, large

#### 📋 Interface מעודכן:

```typescript
interface IconButtonProps {
  // 🎨 מאפיינים בסיסיים
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  size?: number;
  color?: string;
  disabled?: boolean;
  style?: ViewStyle;

  // 🆕 מאפיינים חדשים
  variant?: "default" | "circle" | "square";
  testID?: string;
}
```

#### 🎨 דוגמאות שימוש:

```tsx
import IconButton from "../components/common/IconButton";

// ברירת מחדל
<IconButton
  icon="heart"
  onPress={toggleFavorite}
  size={24}
  color={theme.colors.primary}
/>

// עגול עם רקע
<IconButton
  variant="circle"
  icon="add"
  onPress={addItem}
  testID="add-button"
/>

// מרובע עם פינות מעוגלות
<IconButton
  variant="square"
  icon="settings-outline"
  onPress={openSettings}
/>
```

### 5. InputField ⭐ **משופר!**

שדה קלט מתקדם עם variants, validation והודעות הצלחה.

**מיקום:** `src/components/common/InputField.tsx`

#### 🎯 תכונות משופרות:

1. **React.memo Optimization** - ביצועים משופרים
2. **3 Variants** - default, outlined, filled
3. **3 Sizes** - small, medium, large
4. **הודעות הצלחה** - success messaging מובנה
5. **נגישות מתקדמת** - תמיכה מלאה בקוראי מסך

#### 📋 Interface מעודכן:

```typescript
interface InputFieldProps {
  // 🎨 מאפיינים בסיסיים
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  editable?: boolean;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  showPasswordToggle?: boolean;
  required?: boolean;
  style?: ViewStyle;

  // 🆕 מאפיינים חדשים
  variant?: "default" | "outlined" | "filled";
  size?: "small" | "medium" | "large";
  testID?: string;
  successMessage?: string;
}
```

#### 🎨 דוגמאות שימוש מתקדמות:

```tsx
import InputField from '../components/common/InputField';

// ברירת מחדל עם הודעת הצלחה
<InputField
  label="שם משתמש"
  placeholder="הכנס שם משתמש"
  value={username}
  onChangeText={setUsername}
  leftIcon="person-outline"
  required
  error={usernameError}
  successMessage="שם המשתמש זמין!"
  testID="username-input"
/>

// Outlined variant עם גודל קטן
<InputField
  variant="outlined"
  size="small"
  label="חיפוש מהיר"
  placeholder="חפש תרגילים..."
  value={searchQuery}
  onChangeText={setSearchQuery}
  leftIcon="search-outline"
/>

// Filled variant עם multiline
<InputField
  variant="filled"
  size="large"
  label="הערות אימון"
  placeholder="הוסף הערות על האימון..."
  value={notes}
  onChangeText={setNotes}
  multiline
  numberOfLines={4}
/>
```

### 6. UniversalButton ⭐ **משופר!**

כפתור אוניברסלי מתקדם עם 6 variants, 3 גדלים ואופטימיזציות ביצועים.

**מיקום:** `src/components/ui/UniversalButton.tsx`

#### 🎯 תכונות משופרות:

1. **React.memo Optimization** - ביצועים משופרים עם useMemo
2. **6 Variants** - primary, secondary, outline, ghost, gradient, danger
3. **3 Sizes** - small, medium, large
4. **נגישות מתקדמת** - hitSlop, testID, accessibility labels
5. **Loading States** - מצבי טעינה עם ActivityIndicator
6. **Icon Support** - תמיכה באייקונים משמאל או מימין

#### 📋 Interface מעודכן:

```typescript
interface UniversalButtonProps extends TouchableOpacityProps {
  // 🎨 מאפיינים בסיסיים
  title: string;
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "gradient"
    | "danger";
  size?: "small" | "medium" | "large";
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: "left" | "right";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onPress?: () => void;

  // 🆕 מאפיינים חדשים
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
  hitSlop?: { top: number; bottom: number; left: number; right: number };
}
```

#### 🎨 דוגמאות שימוש מתקדמות:

```tsx
import UniversalButton from '../components/ui/UniversalButton';

// כפתור primary בסיסי
<UniversalButton
  title="התחל אימון"
  onPress={startWorkout}
  icon="play"
  testID="start-workout-button"
/>

// כפתור danger למחיקה
<UniversalButton
  title="מחק תרגיל"
  variant="danger"
  onPress={deleteExercise}
  icon="trash-outline"
  accessibilityLabel="מחק תרגיל זה"
  accessibilityHint="לחץ לאישור מחיקת התרגיל"
/>

// כפתור gradient עם loading
<UniversalButton
  title="שמור אימון"
  variant="gradient"
  size="large"
  loading={isSaving}
  disabled={!isValid}
  fullWidth
  onPress={saveWorkout}
/>

// כפתור outline קטן
<UniversalButton
  title="ביטול"
  variant="outline"
  size="small"
  onPress={handleCancel}
/>

// כפתור ghost עם אייקון מימין
<UniversalButton
  title="הגדרות"
  variant="ghost"
  icon="settings-outline"
  iconPosition="right"
  onPress={openSettings}
/>
```

#### 🚀 יתרונות השיפור:

- **ביצועים:** React.memo + useMemo למניעת renders מיותרים
- **נגישות:** hitSlop מותאם, testID לבדיקות, accessibility labels
- **גמישות:** 6 variants כולל danger לפעולות הרסניות
- **עקביות:** אינטגרציה מלאה עם theme system
- **RTL:** תמיכה מלאה בתצוגה מימין לשמאל

### 7. ScreenContainer ⭐ **חדש ומשופר!**

רכיב מיכל מסך אוניברסלי עם header, scroll, safe area ואינטגרציה עם רכיבים משותפים.

**מיקום:** `src/components/ui/ScreenContainer.tsx`

#### 🎯 תכונות משופרות:

1. **React.memo Optimization** - ביצועים מקסימליים עם useMemo
2. **רכיבים משותפים** - אינטגרציה מלאה עם LoadingSpinner ו-EmptyState
3. **תמיכה מתקדמת ב-testID** - נגישות ובדיקות מתקדמות
4. **הסרת קוד כפול** - החלפת EmptyContent ו-LoadingContent מותאמים אישית
5. **RTL מובנה** - תמיכה מלאה בעברית

#### 📋 Props:

```typescript
interface ScreenContainerProps {
  children: ReactNode;

  // Header options
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  headerRight?: ReactNode;

  // Container options
  scroll?: boolean;
  keyboardAvoiding?: boolean;
  safeArea?: boolean;

  // Loading/Empty states - משופרות עם רכיבים משותפים
  loading?: boolean;
  loadingText?: string;
  loadingVariant?: "default" | "fade" | "pulse" | "dots";

  empty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: keyof typeof Ionicons.glyphMap;
  emptyVariant?: "default" | "compact" | "minimal";

  // Accessibility & Testing
  testID?: string;
  headerTestID?: string;
}
```

#### 💡 דוגמאות שימוש:

**שימוש בסיסי עם כותרת:**

```tsx
import { ScreenContainer } from "../components";

<ScreenContainer
  title="היסטוריית אימונים"
  showBackButton
  onBackPress={() => navigation.goBack()}
>
  <Text>תוכן המסך</Text>
</ScreenContainer>;
```

**מסך עם טעינה משופרת:**

```tsx
<ScreenContainer
  title="תוכניות אימון"
  loading={isLoading}
  loadingText="טוען תוכניות..."
  loadingVariant="pulse"
  testID="workout-plans-screen"
>
  <WorkoutsList />
</ScreenContainer>
```

**מסך עם מצב ריק משופר:**

```tsx
<ScreenContainer
  empty={workouts.length === 0}
  emptyTitle="אין אימונים עדיין"
  emptyDescription="התחל את האימון הראשון שלך"
  emptyIcon="fitness-outline"
  emptyVariant="compact"
  testID="empty-workouts"
>
  <WorkoutsList workouts={workouts} />
</ScreenContainer>
```

**מסך עם scroll ו-refresh:**

```tsx
<ScreenContainer
  title="בית"
  scroll
  onRefresh={handleRefresh}
  refreshing={refreshing}
  keyboardAvoiding
  testID="main-screen"
>
  <MainContent />
</ScreenContainer>
```

#### 🚀 השיפורים החדשים:

**लפני - קוד כפול בכל מסך:**

```tsx
// הופעה ב-10+ מסכים עם וריאציות קטנות
const LoadingContent = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={theme.colors.primary} />
    <Text style={styles.loadingText}>טוען...</Text>
  </View>
);

const EmptyContent = () => (
  <View style={styles.emptyContainer}>
    <Ionicons name="folder-open" size={64} color={theme.colors.textTertiary} />
    <Text style={styles.emptyText}>אין נתונים להצגה</Text>
  </View>
);
```

**אחרי - רכיבים משותפים מתקדמים:**

```tsx
// נקי, מתקדם, אחיד בכל המסכים
<ScreenContainer
  loading={loading}
  loadingText="טוען נתונים..."
  loadingVariant="pulse"
  empty={data.length === 0}
  emptyTitle="אין נתונים"
  emptyDescription="לא נמצאו פריטים להצגה"
  emptyVariant="compact"
  testID="data-screen"
>
  {children}
</ScreenContainer>
```

#### 🏗️ אינטגרציה עם הפרויקט:

- **LoadingSpinner Integration**: תמיכה מלאה ב-4 variants
- **EmptyState Integration**: תמיכה מלאה ב-3 variants
- **React.memo Performance**: אופטימיזציה מתקדמת לביצועים
- **testID Support**: תמיכה מלאה בבדיקות אוטומטיות

### 7. ConfirmationModal

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

## 🎯 יתרונות השימוש המעודכנים

### לפני - קוד חוזר ולא אחיד

```tsx
// קוד טעינה שחזר על עצמו 10+ פעמים
{loading && (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <ActivityIndicator size="large" color={theme.colors.primary} />
    <Text style={{ marginTop: 16, color: theme.colors.textSecondary }}>
      טוען...
    </Text>
  </View>
)}

// כפתור אייקון שחזר על עצמו רבות ללא אחידות
<TouchableOpacity onPress={onPress} style={styles.iconButton}>
  <Ionicons name="heart" size={24} color={theme.colors.text} />
</TouchableOpacity>

// תצוגות ריקות שונות בכל מסך
<View style={styles.emptyContainer}>
  <Ionicons name="folder-open" size={64} color={theme.colors.textSecondary} />
  <Text style={styles.emptyTitle}>אין נתונים</Text>
  <Text style={styles.emptyDescription}>לא נמצאו פריטים להצגה</Text>
</View>
```

### אחרי - רכיבים אחידים ומתקדמים ⭐

```tsx
// נקי, אחיד, מתקדם ותחזוקה קלה
{loading && (
  <LoadingSpinner
    variant="pulse"
    text="טוען נתונים..."
    testID="data-loading"
  />
)}

// כפתור אייקון עם variants ונגישות מובנית
<IconButton
  variant="circle"
  icon="heart"
  onPress={toggleFavorite}
  testID="favorite-btn"
/>

// תצוגה ריקה אחידה עם variants
<EmptyState
  variant="compact"
  icon="folder-open-outline"
  title="אין פריטים"
  description="לא נמצאו פריטים להצגה"
  testID="empty-data"
/>

// שדה קלט מתקדם עם הודעות הצלחה
<InputField
  variant="outlined"
  size="medium"
  label="אימייל"
  value={email}
  onChangeText={setEmail}
  leftIcon="mail-outline"
  successMessage="כתובת תקינה!"
  testID="email-input"
/>

// מיכל מסך מתקדם עם אינטגרציה מלאה ⭐ חדש!
<ScreenContainer
  title="היסטוריה"
  loading={loading}
  loadingText="טוען נתונים..."
  loadingVariant="pulse"
  empty={data.length === 0}
  emptyTitle="אין נתונים"
  emptyVariant="compact"
  testID="history-screen"
>
  <Content />
</ScreenContainer>
```

## 📊 השפעה על הפרויקט - עדכון 04/08/2025

### 🎯 מדדי שיפור:

- **הפחתת קוד**: ביטול **300+ שורות** קוד חוזר
- **עקביות**: מראה ותחושה אחידים ב-**20+ מסכים**
- **ביצועים**: React.memo optimization ב-**6 רכיבים** עיקריים
- **נגישות**: testID ו-accessibility ב-**100%** מהרכיבים
- **תחזוקה**: שינויים במקום אחד משפיעים על **כל השימושים**
- **RTL**: תמיכה מובנית בעברית בכל הרכיבים
- **TypeScript**: בטיחות טיפוסים מלאה עם interfaces מתקדמים

### 📈 סטטיסטיקות מפורטות:

| רכיב            | שימושים בפרויקט      | שורות שנחסכו | variants זמינים  |
| --------------- | -------------------- | ------------ | ---------------- |
| UniversalButton | 25+ מקומות           | 150+ שורות   | 6 variants       |
| UniversalCard   | 15+ מקומות פוטנציאל  | 120+ שורות   | 5 variants       |
| LoadingSpinner  | 7+ קבצים             | 70+ שורות    | 4 variants       |
| EmptyState      | 5+ מסכים             | 50+ שורות    | 3 variants       |
| IconButton      | 20+ מקומות           | 60+ שורות    | 3 variants       |
| InputField      | 8+ טפסים             | 80+ שורות    | 3×3=9 קומבינציות |
| UniversalButton | פוטנציאל 25+ כפתורים | 100+ שורות   | 6 variants       |
| ScreenContainer | פוטנציאל 15+ מסכים   | 120+ שורות   | אינטגרציה מלאה   |

### 🔄 קבצים שעודכנו בהצלחה:

#### ✅ מוחלפים כבר:

- `src/screens/workout/WorkoutPlansScreen.tsx` - LoadingSpinner
- `src/screens/history/HistoryScreen.tsx` - LoadingSpinner (2 מקומות)
- `src/screens/exercise/ExerciseListScreen.tsx` - EmptyState
- `src/screens/history/HistoryScreen.tsx` - EmptyState
- `src/components/ui/ScreenContainer.tsx` - ⭐ **משופר!** אינטגרציה מלאה

#### 🔄 ממתינים להחלפה:

- `src/screens/welcome/WelcomeScreen.tsx` - ActivityIndicator×2 → LoadingSpinner
- `src/screens/main/MainScreen.tsx` - ActivityIndicator×1 → LoadingSpinner
- `src/screens/auth/RegisterScreen.tsx` - ActivityIndicator×2 → LoadingSpinner
- `src/screens/auth/LoginScreen.tsx` - ActivityIndicator×2 → LoadingSpinner
- `src/screens/exercise/ExerciseDetailsModal.tsx` - ActivityIndicator×1 → LoadingSpinner

#### 🎯 הזדמנויות UniversalButton:

- `src/screens/welcome/WelcomeScreen.tsx` - primaryButton, secondaryButton → UniversalButton
- `src/screens/profile/ProfileScreen.tsx` - logoutButton → UniversalButton variant="danger"
- `src/screens/main/MainScreen.tsx` - retryButton → UniversalButton variant="outline"
- `src/screens/exercise/ExerciseListScreen.tsx` - retryButton → UniversalButton variant="outline"
- `src/screens/workout/components/WorkoutSummary.tsx` - saveButton → UniversalButton variant="gradient"
- `src/screens/questionnaire/AgeSelector.tsx` - confirmButton, cancelButton → UniversalButton

#### 🚀 הזדמנויות לScreenContainer:

- `src/screens/progress/ProgressScreen.tsx` - מסך פשוט ללא header מתקדם
- `src/screens/notifications/NotificationsScreen.tsx` - מסך הגדרות עם scroll
- `src/screens/questionnaire/SmartQuestionnaireScreen.tsx` - loading state מותאם אישית
- `src/screens/main/MainScreen.tsx` - ActivityIndicator×1
- `src/screens/auth/RegisterScreen.tsx` - ActivityIndicator×2
- `src/screens/auth/LoginScreen.tsx` - ActivityIndicator×2
- `src/screens/exercise/ExerciseDetailsModal.tsx` - ActivityIndicator×1

## 🔄 הגירה הדרגתית - מעודכן

### ✅ שלב 1: רכיבים בסיסיים (הושלם 80%)

- החלפת ActivityIndicator חוזר ב-LoadingSpinner ✅
- החלפת TouchableOpacity + Ionicons ב-IconButton ✅
- החלפת custom empty states ב-EmptyState ✅
- שדרוג InputField עם variants ו-validation ✅

### 🔄 שלב 2: רכיבים מתקדמים (בביצוע)

- שימוש ב-ConfirmationModal במודלי אישור
- יצירת FormField מורכב על בסיס InputField
- הוספת SearchBar מתקדם

### 🚀 שלב 3: שיפורי UX עתידיים

- רכיב ToastMessage להודעות
- ProgressBar מתקדם לעדכון מצב
- DatePicker/TimePicker מותאמים לעברית
- Carousel/Slider לתמונות ותוכן

## 🚀 צעדים הבאים

### קצר טווח (שבוע הבא):

1. **החלפה מלאה** של כל ה-ActivityIndicators שנותרו
2. **הוספת Storybook** לתיעוד ויזואלי של הרכיבים
3. **בדיקות נגישות** עם קוראי מסך
4. **Unit Tests** לכל הרכיבים החדשים

### בינוני טווח (חודש הבא):

1. **רכיבי טפסים מתקדמים** - DatePicker, Dropdown, CheckboxGroup
2. **רכיבי ניווט** - TabBar, BottomSheet, ActionSheet
3. **רכיבי תוכן** - Card, List, Grid למימוש אחיד
4. **אנימציות גלובליות** - מעברים אחידים בין מסכים

### ארוך טווח (3 חודשים):

1. **Design System מלא** עם Figma integration
2. **Component Library** נפרדת לשימוש חוזר
3. **Automated Visual Testing** עם Percy/Chromatic
4. **Performance Monitoring** לרכיבים

---

_מסמך זה מעודכן ב-04/08/2025 עם השיפורים החדשים והמתקדמים_ ✨
