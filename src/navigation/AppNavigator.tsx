/**
 * @file src/navigation/AppNavigator.tsx
 * @brief ניווט ראשי - משלב Stack Navigator עם Bottom Tabs
 * @dependencies React Navigation, Bottom Tabs, WorkoutPlanScreen
 * @notes מסכי Auth ו-Onboarding בנפרד, Bottom Tabs למסכים העיקריים
 */

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// ניווט תחתון // Bottom navigation
import BottomNavigation from "./BottomNavigation";

// מסכי Onboarding ו-Auth // Onboarding and Auth screens
import WelcomeScreen from "../screens/welcome/WelcomeScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import TermsScreen from "../screens/auth/TermsScreen";
import DynamicQuestionnaireScreen from "../screens/questionnaire/DynamicQuestionnaireScreen";

// מסכי אימון // Workout screens
import WorkoutPlanScreen from "../screens/workout/WorkoutPlansScreen";
import QuickWorkoutScreen from "../screens/workout/QuickWorkoutScreen";

// מסכים נוספים שלא ב-Bottom Tabs // Additional screens not in Bottom Tabs
import ExerciseListScreen from "../screens/exercise/ExerciseListScreen";

const Stack = createStackNavigator();

// טיפוסי ניווט מעודכנים // Updated navigation types
export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Terms: undefined;
  DynamicQuestionnaire: undefined;
  WorkoutPlan: {
    regenerate?: boolean;
    autoStart?: boolean;
    returnFromWorkout?: boolean;
    completedWorkoutId?: string;
  };
  MainApp: undefined;
  QuickWorkout: {
    exercises?: any[];
    workoutName?: string;
    workoutId?: string;
    source?: "workout_plan" | "quick_start";
    planData?: {
      targetMuscles: string[];
      estimatedDuration: number;
      equipment: string[];
    };
  };
  ExerciseList: {
    fromScreen?: string;
    mode?: "view" | "selection";
    onSelectExercise?: (exercise: any) => void;
  };
};

// הגדרת טיפוסי ניווט גלובליים
// Global navigation types declaration
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

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
          name="DynamicQuestionnaire"
          component={DynamicQuestionnaireScreen}
          options={{
            gestureEnabled: false, // מונע חזרה אחורה בשאלון
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
