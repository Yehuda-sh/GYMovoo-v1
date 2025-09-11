# Feature-Based Architecture Plan

This document outlines our feature-based architecture plan for reorganizing the GYMovoo application code.

## Core Structure

```
src/
├── core/               # Core application functionality
│   ├── config/         # App configuration
│   ├── constants/      # Global constants
│   ├── navigation/     # Navigation setup
│   ├── storage/        # Storage utilities
│   ├── services/       # Shared services
│   ├── styles/         # Global styles
│   ├── types/          # Shared type definitions
│   └── utils/          # Utility functions
│
├── features/           # Feature modules
│   ├── auth/           # Authentication
│   ├── home/           # Home screen
│   ├── profile/        # User profile
│   ├── questionnaire/  # Onboarding questionnaire
│   ├── workouts/       # Workout planning and execution
│   ├── exercises/      # Exercise library
│   ├── history/        # Workout history
│   └── progress/       # Progress tracking
│
└── shared/             # Shared components and hooks
    ├── components/     # Reusable UI components
    ├── hooks/          # Custom React hooks
    └── context/        # React Context providers
```

## Feature Module Structure

Each feature module follows a consistent structure:

```
features/feature-name/
├── api/           # API services specific to this feature
├── components/    # UI components for this feature
├── hooks/         # Custom hooks specific to this feature
├── navigation/    # Navigation configuration for this feature
├── screens/       # Screen components
├── store/         # State management for this feature
├── types/         # TypeScript types for this feature
└── utils/         # Utility functions specific to this feature
```

## Core and Shared Types

All type definitions are centralized in `src/core/types` for better organization:

```
core/types/
├── index.ts            # Re-exports all types
├── user.types.ts       # User and authentication types
├── questionnaire.types.ts # Questionnaire related types
├── workout.types.ts    # Workout related types
├── exercise.types.ts   # Exercise related types
├── equipment.types.ts  # Equipment related types
├── navigation.types.ts # Navigation related types
└── api.types.ts        # API related types
```

## Feature Implementation Plan

### 1. Auth Feature

**Files to Create:**

```
features/auth/
├── components/
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   └── SocialLogin.tsx
├── screens/
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   ├── WelcomeScreen.tsx
│   └── TermsScreen.tsx
├── hooks/
│   └── useAuth.ts
└── types/
    └── index.ts
```

### 2. Questionnaire Feature

**Files to Create:**

```
features/questionnaire/
├── components/
│   ├── QuestionnaireForm.tsx
│   ├── QuestionSlide.tsx
│   └── ProgressIndicator.tsx
├── screens/
│   └── UnifiedQuestionnaireScreen.tsx
├── hooks/
│   └── useQuestionnaire.ts
├── services/
│   └── questionnaireService.ts
└── types/
    └── index.ts
```

### 3. Home Feature

**Files to Create:**

```
features/home/
├── components/
│   ├── WelcomeHeader.tsx
│   ├── ScientificStats.tsx
│   ├── DaySelection.tsx
│   ├── QuickWorkoutButton.tsx
│   └── RecentWorkouts.tsx
├── screens/
│   └── MainScreen.tsx
├── hooks/
│   └── useHomeData.ts
└── types/
    └── index.ts
```

### 4. Profile Feature

**Files to Create:**

```
features/profile/
├── components/
│   ├── UserAvatar.tsx
│   ├── UserLevel.tsx
│   ├── Achievements.tsx
│   └── Settings.tsx
├── screens/
│   └── ProfileScreen.tsx
├── hooks/
│   └── useUserProfile.ts
└── types/
    └── index.ts
```

### 5. Workouts Feature

**Files to Create:**

```
features/workouts/
├── components/
│   ├── WorkoutCard.tsx
│   ├── ExerciseItem.tsx
│   ├── WorkoutControls.tsx
│   └── RestTimer.tsx
├── screens/
│   ├── WorkoutPlansScreen.tsx
│   └── ActiveWorkoutScreen.tsx
├── hooks/
│   ├── useWorkout.ts
│   └── useTimer.ts
├── services/
│   └── workoutService.ts
└── types/
    └── index.ts
```

### 6. Exercises Feature

**Files to Create:**

```
features/exercises/
├── components/
│   ├── ExerciseCard.tsx
│   ├── MuscleGroupSelector.tsx
│   └── ExerciseDetails.tsx
├── screens/
│   ├── ExercisesScreen.tsx
│   ├── ExerciseListScreen.tsx
│   └── ExerciseDetailsScreen.tsx
├── hooks/
│   └── useExercises.ts
├── services/
│   └── exercisesService.ts
└── types/
    └── index.ts
```

### 7. History Feature

**Files to Create:**

```
features/history/
├── components/
│   ├── WorkoutHistoryList.tsx
│   ├── WorkoutSummary.tsx
│   └── HistoryFilters.tsx
├── screens/
│   └── HistoryScreen.tsx
├── hooks/
│   └── useHistory.ts
└── types/
    └── index.ts
```

### 8. Progress Feature

**Files to Create:**

```
features/progress/
├── components/
│   ├── ProgressCharts.tsx
│   ├── StatsCard.tsx
│   └── TimeRangeSelector.tsx
├── screens/
│   └── ProgressScreen.tsx
├── hooks/
│   └── useProgressStats.ts
└── types/
    └── index.ts
```

## Shared Components

```
shared/components/
├── common/
│   ├── AppButton.tsx
│   ├── LoadingSpinner.tsx
│   ├── ErrorBoundary.tsx
│   └── ...
├── ui/
│   ├── TouchableButton.tsx
│   ├── Card.tsx
│   └── ...
└── layout/
    ├── Container.tsx
    ├── Grid.tsx
    └── ...
```

## State Management Strategy

1. **Core User State**: Centralized in userStore using Zustand
2. **Feature-specific State**: Isolated within each feature module
3. **Shared Services**: Located in core/services for cross-feature functionality

## Migration Strategy

1. Create the new folder structure
2. Define and implement shared types
3. Migrate features one by one, starting with more isolated ones
4. Refactor and test each feature after migration
5. Update imports across the application
6. Remove obsolete files after successful migration
