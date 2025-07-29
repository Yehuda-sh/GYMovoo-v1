// src\components\README.md

# Shared Components

This directory contains reusable components that are used throughout the GYMovoo application. All components are designed with RTL support and follow the app's design system.

## Component List

### Common Components (`common/`)

#### `BackButton.tsx` ✅ Existing

Universal back button component used across screens.

- **Usage**: Already used in 6+ screens
- **Features**: RTL support, customizable positioning

#### `DefaultAvatar.tsx` ✅ Existing

Avatar component for user profiles.

- **Usage**: Profile screens and user representations
- **Features**: Customizable size, fallback initials

#### `LoadingSpinner.tsx` 🆕 New

Reusable loading spinner with optional text.

```tsx
<LoadingSpinner text="טוען נתונים..." size="large" />
```

- **Props**: `text`, `size`, `color`
- **Replaces**: 10+ instances of repetitive ActivityIndicator code

#### `EmptyState.tsx` 🆕 New

Empty state component for when no data is available.

```tsx
<EmptyState
  icon="folder-open-outline"
  title="אין תרגילים"
  description="התחל להוסיף תרגילים לרשימה שלך"
>
  <UniversalButton title="הוסף תרגיל" onPress={addExercise} />
</EmptyState>
```

- **Props**: `icon`, `title`, `description`, `children`
- **Replaces**: Empty state patterns across multiple screens

#### `IconButton.tsx` 🆕 New

Customizable icon button component.

```tsx
<IconButton
  icon="heart"
  onPress={toggleFavorite}
  color={theme.colors.error}
  backgroundColor={theme.colors.surface}
/>
```

- **Props**: `icon`, `onPress`, `size`, `color`, `backgroundColor`, etc.
- **Replaces**: TouchableOpacity + Ionicons patterns

#### `ConfirmationModal.tsx` 🆕 New

Modal for confirmation dialogs.

```tsx
<ConfirmationModal
  visible={showDeleteModal}
  title="מחיקת תרגיל"
  message="האם אתה בטוח שברצונך למחוק תרגיל זה?"
  confirmText="מחק"
  cancelText="ביטול"
  destructive
  onConfirm={deleteExercise}
  onClose={() => setShowDeleteModal(false)}
/>
```

- **Props**: `visible`, `title`, `message`, `onConfirm`, `onClose`, `destructive`
- **Replaces**: Modal confirmation patterns

#### `InputField.tsx` 🆕 New

Enhanced text input with validation and icons.

```tsx
<InputField
  label="שם משתמש"
  placeholder="הכנס שם משתמש"
  value={username}
  onChangeText={setUsername}
  leftIcon="person-outline"
  required
  error={usernameError}
/>
```

- **Props**: `label`, `placeholder`, `value`, `onChangeText`, `leftIcon`, `rightIcon`, `error`, etc.
- **Features**: Password toggle, validation, RTL support
- **Replaces**: TextInput patterns across auth and profile screens

### UI Components (`ui/`)

#### `ScreenContainer.tsx` ✅ Existing

Base container for all screens with consistent padding and behavior.

#### `UniversalButton.tsx` ✅ Existing

Primary button component used throughout the app.

#### `UniversalCard.tsx` ✅ Existing

Card component for content grouping.

### Workout Components (`workout/`)

#### `FloatingActionButton.tsx` ✅ Existing

Floating action button for workout screens.

## Usage

Import components from the main index file:

```tsx
import {
  LoadingSpinner,
  EmptyState,
  IconButton,
  ConfirmationModal,
  InputField,
} from "../../components";
```

## Migration Benefits

### Before (Repetitive Code)

```tsx
// Loading state (repeated 10+ times)
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

// Icon button (repeated many times)
<TouchableOpacity onPress={onPress} style={styles.iconButton}>
  <Ionicons name="heart" size={24} color={theme.colors.text} />
</TouchableOpacity>;
```

### After (Shared Components)

```tsx
// Clean, reusable, consistent
{
  loading && <LoadingSpinner text="טוען נתונים..." />;
}

<IconButton icon="heart" onPress={toggleFavorite} />;
```

## Benefits

- **Code Reduction**: Eliminates 50+ lines of repetitive code
- **Consistency**: Unified look and behavior across screens
- **Maintainability**: Changes in one place affect all usages
- **RTL Support**: All components handle Hebrew RTL automatically
- **Type Safety**: Full TypeScript support with proper interfaces
- **Accessibility**: Built-in accessibility features

## Next Steps

1. Gradually replace existing patterns with these shared components
2. Add more specialized components as patterns emerge
3. Consider creating compound components for complex patterns
4. Add Storybook or similar for component documentation
