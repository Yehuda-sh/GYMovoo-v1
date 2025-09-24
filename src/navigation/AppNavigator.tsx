/**
 * @file src/navigation/AppNavigator.tsx
 * @description מנהל הניווט הראשי של האפליקציה עם מסלולים מותנים
 */
import { useMemo } from "react";
import { ActivityIndicator, View, Text } from "react-native";
import {
  NavigationContainer,
  DefaultTheme,
  Theme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Auth Navigator - מודול אימות
import { AuthNavigator } from "../features/auth";

// Questionnaire Screen - מסך שאלון
import { QuestionnaireScreen } from "../features/questionnaire";

// Welcome screen
import WelcomeScreen from "../screens/welcome/WelcomeScreen";

// Developer screen
import DeveloperScreen from "../screens/developer/DeveloperScreen";

// Workout screens
import ActiveWorkoutScreen from "../features/workout/screens/workout_screens/ActiveWorkoutScreen";
import WorkoutSummaryScreen from "../features/workout/screens/workout_screens/WorkoutSummaryScreen";

// Exercise screens
import ExercisesScreen from "../screens/exercises/ExercisesScreen";
import ExerciseDetailsScreen from "../screens/exercises/ExerciseDetailsScreen";

// Profile screens
import { PersonalInfoScreen } from "../features/profile/screens/PersonalInfoScreen";

// Stores and types
import { useUserStore } from "../stores/userStore";
import BottomNavigation from "./BottomNavigation";
import { RootStackParamList } from "./types";
import { theme } from "../core/theme";

const Stack = createStackNavigator<RootStackParamList>();

// מסך טעינה קטן בזמן הידרציה/קביעת מסלול
function LoadingScreen() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
    >
      <ActivityIndicator size="large" />
      <Text style={{ fontSize: 16 }}>טוען…</Text>
    </View>
  );
}

// נושא הניווט – מותאם לצבעים שלך
const navTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: theme.colors.background,
    text: theme.colors.text,
    primary: theme.colors.primary,
    border: theme.colors.divider,
    card: theme.colors.card,
    notification: theme.colors.secondary,
  },
};

export default function AppNavigator() {
  const { user, getCompletionStatus, hydrated, hasSeenWelcome } =
    useUserStore();

  // חישוב המסלול הראשוני
  const initialRoute = useMemo<keyof RootStackParamList>(() => {
    if (!user) return hasSeenWelcome ? "Auth" : "Welcome";

    const completion = getCompletionStatus();

    // אם המשתמש הושלם לחלוטין - מסך ראשי
    if (completion.isFullySetup) return "MainApp";

    // אם יש שאלון אבל אין פרטים בסיסיים - רישום
    if (completion.hasSmartQuestionnaire && !completion.hasBasicInfo) {
      return "Auth";
    }

    // אם אין שאלון - שאלון
    return "Questionnaire";
  }, [user, hasSeenWelcome, getCompletionStatus]);

  // המתן עד שהנתונים נטענים
  if (!hydrated) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer theme={navTheme}>
      {/* המפתח כאן "מאלץ" יישום מחדש אם המסלול הראשוני השתנה מהר */}
      <Stack.Navigator
        key={String(initialRoute)}
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
        }}
      >
        {/* Welcome screen - מסך פתיחה למשתמשים חדשים */}
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ gestureEnabled: false }}
        />

        {/* Auth module - הרשמה והתחברות */}
        <Stack.Screen
          name="Auth"
          component={AuthNavigator}
          options={{ gestureEnabled: false }}
        />

        {/* Questionnaire module - שאלון כושר */}
        <Stack.Screen
          name="Questionnaire"
          component={QuestionnaireScreen}
          options={{ gestureEnabled: false }}
        />

        {/* Main app - האפליקציה הראשית עם התפריט התחתון */}
        <Stack.Screen
          name="MainApp"
          component={BottomNavigation}
          options={{ gestureEnabled: false }}
        />

        {/* Active workout - אימון פעיל */}
        <Stack.Screen
          name="ActiveWorkout"
          component={ActiveWorkoutScreen}
          options={{ gestureEnabled: false }}
        />

        {/* Workout Summary - סיכום אימון */}
        <Stack.Screen
          name="WorkoutSummary"
          component={WorkoutSummaryScreen}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />

        {/* Exercise screens - מסכי תרגילים */}
        <Stack.Screen
          name="ExercisesScreen"
          component={ExercisesScreen}
          options={{
            presentation: "modal",
          }}
        />

        <Stack.Screen
          name="ExerciseDetails"
          component={ExerciseDetailsScreen}
        />

        {/* Personal Info - מידע אישי */}
        <Stack.Screen
          name="PersonalInfo"
          component={PersonalInfoScreen}
          options={{
            title: "מידע אישי",
            headerShown: false,
          }}
        />

        {/* Developer screen - מסך פיתוח (רק במצב פיתוח) */}
        {__DEV__ && (
          <Stack.Screen
            name="DeveloperScreen"
            component={DeveloperScreen}
            options={{
              title: "מסך פיתוח",
              headerShown: true,
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
