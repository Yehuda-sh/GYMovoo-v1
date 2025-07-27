import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// ניווט תחתון // Bottom navigation
import BottomNavigation from "./BottomNavigation";

// טיפוסי ניווט
import { RootStackParamList } from "./types";

// מסכי Onboarding ו-Auth // Onboarding and Auth screens
import WelcomeScreen from "../screens/welcome/WelcomeScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import TermsScreen from "../screens/auth/TermsScreen";
import TwoStageQuestionnaireScreen from "../screens/questionnaire/TwoStageQuestionnaireScreen";
// מסכי אימון // Workout screens
import WorkoutPlanScreen from "../screens/workout/WorkoutPlansScreen";
import QuickWorkoutScreen from "../screens/workout/QuickWorkoutScreen";

// מסכים נוספים שלא ב-Bottom Tabs // Additional screens not in Bottom Tabs
import ExerciseListScreen from "../screens/exercise/ExerciseListScreen";

// מסכים חדשים שנוספו
import NotificationsScreen from "../screens/notifications/NotificationsScreen";
import ProgressScreen from "../screens/progress/ProgressScreen";
import ExercisesScreen from "../screens/exercises/ExercisesScreen";

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: "horizontal-inverted", // RTL תמיכה
          animationTypeForReplace: "push",
        }}
      >
        {/* מסכי Onboarding ו-Auth */}
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{
            gestureEnabled: false, // מונע יציאה מהמסך הראשון
          }}
        />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Terms" component={TermsScreen} />

        {/* שאלון דינמי */}
        <Stack.Screen
          name="Questionnaire"
          component={TwoStageQuestionnaireScreen}
          options={{
            headerShown: false,
            presentation: "modal",
          }}
        />

        {/* מסך תוכנית אימון AI */}
        <Stack.Screen
          name="WorkoutPlan"
          component={WorkoutPlanScreen}
          options={{
            presentation: "card",
            gestureDirection: "horizontal-inverted", // RTL
            animationTypeForReplace: "push",
          }}
        />

        {/* אפליקציה ראשית עם Bottom Tabs */}
        <Stack.Screen
          name="MainApp"
          component={BottomNavigation}
          options={{
            gestureEnabled: false, // מונע יציאה מהאפליקציה הראשית
          }}
        />

        {/* מסך אימון פעיל */}
        <Stack.Screen
          name="QuickWorkout"
          component={QuickWorkoutScreen}
          options={{
            gestureEnabled: false, // מונע יציאה בטעות מאימון פעיל
            presentation: "card",
          }}
        />

        {/* מסכים נוספים */}
        <Stack.Screen
          name="ExerciseList"
          component={ExerciseListScreen}
          options={{
            presentation: "modal", // פתיחה כמודל
            gestureDirection: "vertical", // סגירה למטה
          }}
        />

        {/* מסכים נוספים שנוספו */}
        <Stack.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{
            presentation: "card",
            gestureDirection: "horizontal-inverted", // RTL
          }}
        />

        <Stack.Screen
          name="Progress"
          component={ProgressScreen}
          options={{
            presentation: "card",
            gestureDirection: "horizontal-inverted", // RTL
          }}
        />

        <Stack.Screen
          name="Exercises"
          component={ExercisesScreen}
          options={{
            presentation: "card",
            gestureDirection: "horizontal-inverted", // RTL
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
