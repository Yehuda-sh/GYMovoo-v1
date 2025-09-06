import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import BottomNavigation from "./BottomNavigation";
import { RootStackParamList } from "./types";

// Auth screens
import WelcomeScreen from "../screens/welcome/WelcomeScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import TermsScreen from "../screens/auth/TermsScreen";

// Questionnaire
import UnifiedQuestionnaireScreen from "../screens/questionnaire/UnifiedQuestionnaireScreen";

// Developer screen
import DeveloperScreen from "../screens/developer/DeveloperScreen";

// Workout screens
import WorkoutPlanScreen from "../screens/workout/WorkoutPlansScreen";
import ActiveWorkoutScreen from "../screens/workout/ActiveWorkoutScreen";

// Additional screens
import ExerciseListScreen from "../screens/exercise/ExerciseListScreen";
import NotificationsScreen from "../screens/notifications/NotificationsScreen";
import ProgressScreen from "../screens/progress/ProgressScreen";
import ExercisesScreen from "../screens/exercises/ExercisesScreen";
import ExerciseDetailsScreen from "../screens/exercises/ExerciseDetailsScreen";

import { useUserStore } from "../stores/userStore";

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { user, getCompletionStatus } = useUserStore();

  // Determine initial screen based on user state
  const getInitialRoute = () => {
    if (!user) return "Welcome";
    
    const completion = getCompletionStatus();
    return completion.isFullySetup ? "MainApp" : "Questionnaire";
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={getInitialRoute()}
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
        }}
      >
        {/* Auth screens */}
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Terms" component={TermsScreen} />

        {/* Questionnaire */}
        <Stack.Screen
          name="Questionnaire"
          component={UnifiedQuestionnaireScreen}
          options={{ gestureEnabled: false }}
        />

        {/* Workout */}
        <Stack.Screen name="WorkoutPlan" component={WorkoutPlanScreen} />

        {/* Main app */}
        <Stack.Screen
          name="MainApp"
          component={BottomNavigation}
          options={{ gestureEnabled: false }}
        />

        {/* Active workout */}
        <Stack.Screen
          name="ActiveWorkout"
          component={ActiveWorkoutScreen}
          options={{ gestureEnabled: false }}
        />

        {/* Exercise screens */}
        <Stack.Screen
          name="ExerciseList"
          component={ExerciseListScreen}
          options={{ presentation: "modal" }}
        />
        <Stack.Screen name="ExerciseDetails" component={ExerciseDetailsScreen} />
        <Stack.Screen name="ExercisesScreen" component={ExercisesScreen} />

        {/* Additional screens */}
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="Progress" component={ProgressScreen} />

        {/* Developer screen (development only) */}
        {__DEV__ && (
          <Stack.Screen name="DeveloperScreen" component={DeveloperScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
