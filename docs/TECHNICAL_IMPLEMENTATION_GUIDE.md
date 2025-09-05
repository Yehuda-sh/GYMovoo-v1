# 🔧 Technical Implementation Guide - GYMovoo

**Last Updated:** September 5, 2025  
**Purpose:** Core technical architecture overview for developers

---

## 🎯 Architecture Overview

GYMovoo is a React Native fitness app with TypeScript, built for RTL support and gender adaptation.

### 📁 Key Directories:

```
src/
├── components/       # Reusable UI components
├── screens/         # Main application screens
├── navigation/      # Navigation setup and types
├── stores/         # Zustand state management
├── services/       # API and business logic
├── utils/          # Helper functions and utilities
├── styles/         # Theme and styling system
└── types/          # TypeScript type definitions
```

---

## 🏗️ Core Systems

### 1. **Authentication & Navigation**

- **Files:** `src/navigation/AppNavigator.tsx`, `src/stores/userStore.ts`
- **Features:** Auto-login, smart routing, session persistence
- **Flow:** Welcome → Questionnaire → Register → MainApp

### 2. **State Management (Zustand)**

- **Files:** `src/stores/userStore.ts`
- **Features:** User data, workout history, questionnaire results
- **Key Hook:** `useAuthState()` for authentication status

### 3. **RTL & Internationalization**

- **Files:** `src/utils/rtlHelpers.ts`, `src/styles/theme.ts`
- **Features:** Hebrew support, automatic layout direction
- **Functions:** `getFlexDirection()`, `getRTLTextStyle()`

### 4. **Gender Adaptation**

- **Files:** `src/utils/genderAdaptation.ts`
- **Features:** Text adaptation based on user gender
- **Function:** `adaptBasicTextToGender(text, gender)`

---

## 🔧 Key Components

### SetRow Component

- **Location:** `src/screens/workout/components/ExerciseCard/SetRow.tsx`
- **Purpose:** Interactive set editing during workouts
- **Features:** Animations, RTL support, haptic feedback

### WorkoutSummary Components

- **Location:** `src/screens/workout/components/WorkoutSummary/`
- **Components:** AchievementsSection, FeedbackSection, ActionButtons, WorkoutStatsGrid
- **Purpose:** Post-workout summary and feedback collection

---

## 🎨 Styling & Theme

### Theme System

- **File:** `src/styles/theme.ts`
- **Features:** Consistent colors, RTL-aware layouts, responsive design
- **Usage:** Import theme object for consistent styling

### RTL Support

```typescript
// Example RTL-aware styling
const styles = StyleSheet.create({
  container: {
    flexDirection: theme.isRTL ? "row-reverse" : "row",
    textAlign: theme.isRTL ? "right" : "left",
  },
});
```

---

## 🛡️ Best Practices

### 1. **Type Safety**

- Use TypeScript interfaces for all data structures
- Implement type guards for runtime safety
- Define proper navigation types

### 2. **Performance**

- Use `React.memo` for expensive components
- Implement `useMemo` and `useCallback` appropriately
- Use FlatList for long lists

### 3. **RTL Compliance**

- Always use RTL helpers for layout direction
- Test Hebrew text rendering
- Ensure proper icon orientation

### 4. **Error Handling**

- Implement try-catch blocks for async operations
- Use type guards to prevent runtime errors
- Provide fallback values for calculations

---

## 🚀 Development Commands

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run tests
npm test

# Type checking
npx tsc --noEmit
```

---

## 📚 Key Files for New Developers

1. **`src/navigation/types.ts`** - Navigation type definitions
2. **`src/stores/userStore.ts`** - Main state management
3. **`src/styles/theme.ts`** - Design system
4. **`src/utils/rtlHelpers.ts`** - RTL utilities
5. **`src/services/auth/quickLoginService.ts`** - Authentication logic

---

**For detailed implementation, refer to the source code and inline documentation.**
