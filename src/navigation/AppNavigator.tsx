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
import ActiveWorkoutScreen from "../features/workout/screens/workout_screens/ActiveWorkoutScreen";
import WorkoutSummaryScreen from "../features/workout/screens/workout_screens/WorkoutSummaryScreen";

// Additional screens
import ExercisesScreen from "../screens/exercises/ExercisesScreen";
import ExerciseDetailsScreen from "../screens/exercises/ExerciseDetailsScreen";
import { PersonalInfoScreen } from "../features/profile/screens/PersonalInfoScreen";
import { useUserStore } from "../stores/userStore";
import BottomNavigation from "./BottomNavigation";
import { RootStackParamList } from "./types";
import { logger } from "../utils/logger";
import React from "react";

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { user, getCompletionStatus, hydrated, hasSeenWelcome } =
    useUserStore();

  React.useEffect(() => {
    logger.info("AppNavigator", "🎯 Component mounted/updated");
  }, []);

  if (!hydrated) {
    return null;
  }

  const initialRoute: keyof RootStackParamList = (() => {
    if (!user) return hasSeenWelcome ? "Auth" : "Welcome";
    const completion = getCompletionStatus();

    // DEBUG: לוג לבדיקה
    console.log("🔍 [AppNavigator] Navigation decision:", {
      hasUser: !!user,
      hasBasicInfo: completion.hasBasicInfo,
      hasSmartQuestionnaire: completion.hasSmartQuestionnaire,
      isFullySetup: completion.isFullySetup,
      userHasEmail: !!user?.email,
      userHasId: !!user?.id,
      userHasName: !!user?.name,
    });

    // אם המשתמש הושלם לחלוטין - מסך ראשי
    if (completion.isFullySetup) return "MainApp";

    // אם יש שאלון אבל אין פרטים בסיסיים - רישום
    if (completion.hasSmartQuestionnaire && !completion.hasBasicInfo) {
      console.log(
        "🔍 [AppNavigator] Going to Auth - has questionnaire but no basic info"
      );
      return "Auth";
    }

    // אם אין שאלון - שאלון
    console.log(
      "🔍 [AppNavigator] Going to Questionnaire - no questionnaire found"
    );
    return "Questionnaire";
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

        {/* Workout Summary */}
        <Stack.Screen
          name="WorkoutSummary"
          component={WorkoutSummaryScreen}
          options={{ headerShown: false, gestureEnabled: false }}
        />

        {/* Exercise screens */}
        <Stack.Screen
          name="ExerciseList"
          component={ExercisesScreen}
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name="ExerciseDetails"
          component={ExerciseDetailsScreen}
        />
        <Stack.Screen name="ExercisesScreen" component={ExercisesScreen} />

        {/* Personal Info screen */}
        <Stack.Screen
          name="PersonalInfo"
          component={PersonalInfoScreen}
          options={{
            title: "מידע אישי",
            headerShown: false,
          }}
        />

        {/* Developer screen (development only) */}
        {__DEV__ && (
          <Stack.Screen name="DeveloperScreen" component={DeveloperScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
