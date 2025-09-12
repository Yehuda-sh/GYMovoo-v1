# GYMovoo App Structure Analysis

This document provides an analysis of the current application structure and flow to guide our refactoring efforts.

## Navigation Structure

The app uses React Navigation with a combination of stack and tab navigators:

### Main Navigation Flow (AppNavigator.tsx)

```
Stack Navigator
├── Auth screens
│   ├── Welcome
│   ├── Login
│   ├── Register
│   └── Terms
├── Questionnaire
│   └── UnifiedQuestionnaireScreen
├── Main App (Bottom Tab Navigator)
│   ├── Profile
│   ├── History
│   ├── WorkoutPlans
│   ├── QuickWorkout
│   └── Main (Home)
├── Workout screens
│   ├── WorkoutPlan
│   └── ActiveWorkout
├── Exercise screens
│   ├── ExerciseList
│   ├── ExerciseDetails
│   └── ExercisesScreen
└── Additional screens
    └── Progress
```

The initial route is determined by user state:

- If no user: "Welcome" screen
- If user exists but not fully set up: "Questionnaire" screen
- If user fully set up: "MainApp" (which is the BottomNavigation component)

## User Flow

The typical user journey follows this path:

1. **Welcome Screen**
   - User can start the questionnaire or login
   - "התחל עכשיו" (Start Now) → Questionnaire
   - "כניסה" (Login) → Login Screen

2. **Questionnaire or Login**
   - New users complete the questionnaire
   - Returning users login with email or Google

3. **Completion Status Check**
   - After login, system checks if user has completed:
     - Basic info (hasBasicInfo)
     - Smart questionnaire (hasSmartQuestionnaire)
   - Redirects to appropriate screen if setup is incomplete

4. **Main App Experience**
   - Bottom navigation with 5 tabs
   - Home (Main) as the central hub
   - Various workout options and user stats

## Core Features by Screen

### 1. MainScreen (Home)

- Welcome header with personalized greeting
- Scientific stats section
- Day selection for workouts
- Quick workout button
- Stats section showing user progress
- Recent workouts section

### 2. ProfileScreen

- User information and avatar
- Level and XP progress
- Achievements and badges
- Settings
- Logout functionality

### 3. WorkoutPlansScreen

- AI-generated workout plans
- Workout selection
- Plan details

### 4. HistoryScreen

- Past workout records
- Performance metrics
- Progress visualization

### 5. QuickWorkout (ActiveWorkoutScreen)

- Direct access to start a workout
- Exercise instructions
- Tracking functionality

## State Management

The app uses Zustand for state management:

### UserStore

- Handles user authentication state
- Manages questionnaire data
- Tracks subscription status
- Handles user preferences at a basic level

### useUserPreferences Hook

- Complex hook for detailed user preferences
- Handles workout recommendations
- Manages equipment selection
- Processes questionnaire data into smart insights

## Data Flow

1. **User Data**
   - Stored in `userStore` (Zustand)
   - Persisted with AsyncStorage
   - Can be synced with server

2. **Preferences**
   - Managed through `useUserPreferences` hook
   - Derives from questionnaire data
   - Creates personalized workout recommendations

3. **Workout Data**
   - Generated based on user preferences
   - Stored in state and AsyncStorage
   - History tracked for progress metrics

## Key Components and Services

- **workoutFacadeService**: Central service for workout functionality
- **questionnaireService**: Handles questionnaire data
- **userApi**: Interface for user data operations
- **AsyncStorage**: Local persistence for all user data

## Potential Refactoring Areas

1. **MainScreen**: Very large component with many responsibilities
2. **useUserPreferences**: Complex hook managing too many concerns
3. **userStore**: Contains both auth logic and user data management
4. **Questionnaire flow**: Could be simplified and modularized

## Feature-Based Organization

For our feature-based architecture, we can organize around these core features:

1. **Auth** - Login, Register, Welcome
2. **Questionnaire** - User onboarding
3. **Home** - Main dashboard
4. **Workouts** - Planning, execution, and tracking
5. **Exercises** - Database and details
6. **History** - Past workouts and achievements
7. **Profile** - User settings and information
8. **Progress** - Analytics and metrics

Each feature will contain its own:

- Components
- Hooks
- Types
- Services
- State management
