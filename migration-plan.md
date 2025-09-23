# Migration Plan: Expo to React Native CLI

## Current Expo Dependencies Analysis

### Dependencies to Replace:

#### 1. @expo/vector-icons → react-native-vector-icons

**Usage:** 49 files use MaterialCommunityIcons, Ionicons, FontAwesome, MaterialIcons
**Replacement:** react-native-vector-icons with separate icon sets
**Action:** Update imports and icon component usage

#### 2. expo-linear-gradient → react-native-linear-gradient

**Usage:** 7 files use LinearGradient
**Files:** WelcomeScreen, MainScreen, QuickStatsCard, ExercisesScreen, WorkoutSummaryScreen, QuestionnaireScreen, NextWorkoutCard
**Action:** Update import and verify API compatibility

#### 3. expo-haptics → react-native-haptic-feedback

**Usage:** 4 files use Haptics.selectionAsync(), Haptics.impactAsync()
**Files:** MainScreen, WorkoutSummaryScreen, ConfirmationModal, AppButton
**Action:** Replace with ReactNativeHapticFeedback.trigger()

#### 4. expo-status-bar → react-native StatusBar

**Usage:** 4 auth screens use StatusBar
**Files:** TermsScreen, RegisterScreen, LoginScreen, ForgotPasswordScreen
**Action:** Import from react-native instead

#### 5. expo-image-picker → react-native-image-picker

**Usage:** 1 file (ProfileScreen)
**Action:** Replace ImagePicker API calls

#### 6. Other Expo Dependencies (not currently used in code):

- expo-blur
- expo-constants → react-native-device-info
- expo-device → react-native-device-info
- expo-font → manual font loading
- expo-system-ui → react-native StatusBar

### Files Requiring Updates:

#### High Priority (Core functionality):

- App.tsx (main entry point)
- Navigation files
- All screen files using icons
- Components using LinearGradient

#### Medium Priority:

- Utility functions
- Constants files

#### Low Priority:

- Development/example files

### New Dependencies to Install:

```json
{
  "react-native-vector-icons": "^10.0.0",
  "react-native-linear-gradient": "^2.8.3",
  "react-native-haptic-feedback": "^2.2.0",
  "react-native-image-picker": "^7.1.0",
  "react-native-device-info": "^10.11.0"
}
```

### Platform-specific Setup Required:

- Android: Update build.gradle for vector icons, linear gradient
- iOS: Update Podfile, link native dependencies
- Add fonts to platform asset folders

### Estimated Migration Time:

- Core dependencies replacement: 2-3 hours
- Code updates and testing: 4-6 hours
- Platform configuration: 2-3 hours
- Total: 8-12 hours

### Risk Assessment:

- **Low Risk:** StatusBar, basic icon replacements
- **Medium Risk:** LinearGradient API differences
- **High Risk:** Haptics feedback API changes, Image picker permissions
