import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Auth Navigator - מודול אימות חדש
import { AuthNavigator } from "../features/auth";

// Questionnaire Navigator - מודול שאלון חדש
import { QuestionnaireNavigator } from "../features/questionnaire";

// Welcome screen
import WelcomeScreen from "../screens/welcome/WelcomeScreen";

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
import BottomNavigation from "./BottomNavigation";
import { RootStackParamList } from "./types";

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { user, getCompletionStatus, hydrated, hasSeenWelcome } =
    useUserStore();

  if (!hydrated) {
    return null; // TODO: ניתן להוסיף Splash מותאם
  }

  const initialRoute: keyof RootStackParamList = (() => {
    if (!user) return hasSeenWelcome ? "Auth" : "Welcome";
    const completion = getCompletionStatus();
    return completion.isFullySetup ? "MainApp" : "Questionnaire";
  })();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
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

        {/* מודול אימות חדש - השתמש בו לכל צרכי האימות */}
        <Stack.Screen
          name="Auth"
          component={AuthNavigator}
          options={{ gestureEnabled: false }}
        />

        {/* מסכי אימות ישנים - לא בשימוש יותר, יוסרו בעתיד 
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Terms" component={TermsScreen} />
        */}

        {/* Questionnaire - מודול שאלון חדש */}
        <Stack.Screen
          name="Questionnaire"
          component={QuestionnaireNavigator}
          options={{ gestureEnabled: false }}
        />

        {/* מסך שאלון ישן - לא בשימוש יותר
        <Stack.Screen
          name="OldQuestionnaire"
          component={null} // הוסר מהקוד
          options={{ gestureEnabled: false }}
        />
        */}

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
        <Stack.Screen
          name="ExerciseDetails"
          component={ExerciseDetailsScreen}
        />
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
