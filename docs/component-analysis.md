# Main Components Analysis

This document analyzes the key components in the GYMovoo application and their responsibilities.

## MainScreen.tsx

The MainScreen is the central hub of the application, functioning as the home screen. It's a large component that handles multiple responsibilities:

### Key Responsibilities:

- User greeting and welcome header
- Display of user statistics and progress
- Workout day selection
- Quick workout button
- Recent workouts list
- Navigation to other screens

### State Management:

- Uses `useUserStore` to access user data
- Manages loading, refreshing, and error states
- Fetches advanced statistics via `workoutFacadeService`
- Uses animations for UI elements

### Refactoring Opportunities:

- Split into smaller component files
- Create custom hooks for data fetching logic
- Move animation logic to shared utilities
- Separate state management concerns

## ProfileScreen.tsx

The ProfileScreen displays user information and settings.

### Key Responsibilities:

- Display user avatar and basic info
- Show user level and XP progress
- Display achievements and badges
- Provide settings options
- Logout functionality

### State Management:

- Uses `useUserStore` for user data
- Manages modal states and UI interactions
- Handles avatar selection

### Refactoring Opportunities:

- Extract settings into a separate component
- Create dedicated achievements component
- Move avatar selection to its own module

## useUserPreferences.ts

This is a complex custom hook that manages user preferences derived from questionnaire data.

### Key Responsibilities:

- Load and manage user preferences
- Convert questionnaire data into smart insights
- Generate personalized workout recommendations
- Calculate user metrics (motivation, consistency, etc.)
- Manage equipment preferences

### Data Flow:

- Accesses user data from `useUserStore`
- Interacts with `questionnaireService` for data
- Transforms raw questionnaire data into actionable insights
- Provides personalized workout recommendations

### Refactoring Opportunities:

- Split into multiple smaller hooks
- Create a dedicated preferences service
- Separate concerns (data loading, analysis, recommendations)
- Implement proper caching and memoization

## BottomNavigation.tsx

Manages the main navigation tabs in the application.

### Key Responsibilities:

- Defines the bottom tab navigator
- Configures tab appearance and icons
- Links to main app screens

### Structure:

- Profile tab
- History tab
- WorkoutPlans tab
- QuickWorkout tab
- Main (Home) tab

### Refactoring Opportunities:

- Move to core/navigation
- Create a more flexible configuration approach
- Add support for deep linking

## WorkoutPlansScreen.tsx

Displays workout plans and allows users to select a workout.

### Key Responsibilities:

- Display available workout plans
- Allow selection and customization
- Start a workout session

### State Management:

- Likely uses a combination of local state and shared state
- Interacts with workout services

### Refactoring Opportunities:

- Separate display and logic concerns
- Create dedicated components for plan items
- Extract workout generation logic

## UnifiedQuestionnaireScreen.tsx

Handles the user onboarding questionnaire process.

### Key Responsibilities:

- Guide user through questionnaire steps
- Collect and validate responses
- Save responses to user profile

### State Management:

- Manages questionnaire state and navigation
- Stores responses in AsyncStorage and userStore

### Refactoring Opportunities:

- Create smaller, focused components for question types
- Extract validation logic
- Implement a more flexible questionnaire configuration

## userStore.ts

The central state management store for user data.

### Key Responsibilities:

- Manage user authentication state
- Store user profile information
- Handle questionnaire data
- Manage subscription status
- Sync with AsyncStorage and server

### Structure:

- Uses Zustand for state management
- Implements persistence with AsyncStorage
- Provides actions for state manipulation

### Refactoring Opportunities:

- Split into smaller domain-specific stores
- Create separate auth store
- Move questionnaire data to its own store
- Improve typing and error handling
