# 🔐 Authentication System Guide - מדריך מערכת ההתחברות

## 📋 Overview

This guide explains how the authentication system works in GYMovoo, including automatic navigation, user state management, and security features.

**Last Updated:** September 5, 2025  
**Implementation Files:**

- `src/stores/userStore.ts` - Main auth state management
- `src/navigation/AppNavigator.tsx` - Navigation logic
- `src/screens/main/MainScreen.tsx` - Guard implementation

---

## 🔐 How Authentication Works

### 🚀 Automatic Navigation Flow

The authentication system works automatically with smart routing:

1. **App Launch** →
   - User + Complete Questionnaire → `MainApp`
   - User + No Questionnaire → `Questionnaire`
   - No User → `Welcome`

2. **Authenticated User without Questionnaire** → Immediate redirect to `Questionnaire` (Guard)

3. **Unauthenticated User** → `Welcome` → `Questionnaire` (collect answers) → `Register` (attach answers) → `MainApp`

### 🔄 Auto-Login Behavior

When opening the app, Zustand automatically loads the last user data from AsyncStorage for seamless experience.

### 🚪 Complete Logout Process

When logging out, the system clears **everything** from local storage:

- ✅ Basic user data
- ✅ Questionnaire data and results
- ✅ Workout data and history
- ✅ Settings and preferences

---

## � Implementation Usage

### Checking Authentication State:

```typescript
import { useAuthState } from '../stores/userStore';

function MyComponent() {
  const { user, isLoggedIn, hasQuestionnaire } = useAuthState();

  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  if (!hasQuestionnaire) {
    return <UnifiedQuestionnaireScreen />;
  }

  return <MainApp />;
}
```

### Available State Properties:

```typescript
interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  hasQuestionnaire: boolean;
  hasBasicInfo: boolean;
  logout: () => Promise<void>;
  clearAllData: () => Promise<void>;
}
```

---

## 🔄 Expected Behavior & Flow

### ✅ Normal Authentication Flow:

```
1. App Launch
2. Load local user data (if exists)
3. If user && hasQuestionnaire → MainApp
4. If user && !hasQuestionnaire → Questionnaire (cannot skip)
5. If no user → Welcome → Questionnaire → Register → MainApp
```

### ✅ Complete Logout Flow:

```
1. User clicks "Logout" in Profile
2. Confirmation dialog appears
3. User confirms → Clear all AsyncStorage data
4. Navigate to Welcome screen
```

---

## 🚨 Important Security & Performance Notes

### 🔒 Security Features:

- ✅ **No password storage** in AsyncStorage
- ✅ **Token-based authentication** only
- ✅ **Complete data clearing** on logout
- ✅ **Secure state management** with Zustand

### ⚡ Performance Optimizations:

- ✅ **Fast loading** - Data stored locally
- ✅ **Efficient cleanup** with `AsyncStorage.multiRemove`
- ✅ **Detailed logging** for debugging
- ✅ **Optimized re-renders** with selective subscriptions

---

## 🛡️ Navigation Guards

The system implements strict guards to enforce proper onboarding flow:

### MainScreen Guard:

```typescript
// Before rendering - checks for questionnaire data
if (!hasQuestionnaire) {
  navigation.reset({
    index: 0,
    routes: [{ name: "Questionnaire" }],
  });
}
```

### Questionnaire Completion:

```typescript
// On completion without user → reset to Register (not MainApp)
if (!user) {
  navigation.reset({
    index: 0,
    routes: [{ name: "Register" }],
  });
}
```

### Register Screen:

```typescript
// If local questionnaire results exist → attach and enter MainApp
if (smart_questionnaire_results) {
  // Attach results and navigate to MainApp with reset
}
```

---

## 🎉 System Status

**The system is updated and working with strict onboarding flow!**

- ✅ Automatic navigation working
- ✅ Guards properly implemented
- ✅ Security measures in place
- ✅ Performance optimized
- ✅ Full test coverage

**Last tested:** September 5, 2025
