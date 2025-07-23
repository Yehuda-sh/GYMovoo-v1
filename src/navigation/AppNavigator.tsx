/**
 * @file src/navigation/AppNavigator.tsx
 * @description Expo Stack Navigator — כל מסכי ה-core flow, ניווט ללא header, תואם theme, כולל מסך תרגילים
 * English: Expo Stack Navigator — core app screens, header hidden, theme-friendly, with ExerciseListScreen.
 */

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// --- מסכים עיקריים (Main screens) ---
import WelcomeScreen from "../screens/welcome/WelcomeScreen";
import QuestionnaireScreen from "../screens/questionnaire/QuestionnaireScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import TermsScreen from "../screens/auth/TermsScreen";
import MainScreen from "../screens/main/MainScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import ExerciseListScreen from "../screens/exercise/ExerciseListScreen"; // חדש: מסך תרגילים
import QuickWorkoutScreen from "../screens/workout/QuickWorkoutScreen";
import DynamicQuestionnaireScreen from "../screens/questionnaire/DynamicQuestionnaireScreen";
const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false, // אין header של React Navigation
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Terms" component={TermsScreen} />
        <Stack.Screen
          name="Questionnaire"
          component={DynamicQuestionnaireScreen}
        />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="ExerciseList" component={ExerciseListScreen} />
        <Stack.Screen name="QuickWorkout" component={QuickWorkoutScreen} />
        {/* הוסף מסכים נוספים כאן בהמשך */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
