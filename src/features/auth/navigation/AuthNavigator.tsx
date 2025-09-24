/**
 * @file AuthNavigator.tsx
 * @description ניווט למסכי אימות והרשמה
 */

import React, { useMemo } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useRoute } from "@react-navigation/native";

import { LoginScreen } from "../screens/LoginScreen";
import { RegisterScreen } from "../screens/RegisterScreen";
import { ForgotPasswordScreen } from "../screens/ForgotPasswordScreen";
import { TermsScreen } from "../screens/TermsScreen";
import { logger } from "../../../utils/logger";

// טיפוס פרמטרים לניווט
export type AuthStackParamList = {
  Login: undefined;
  Register: {
    fromQuestionnaire?: boolean;
  };
  ForgotPassword: undefined;
  Terms: { type?: "terms" | "privacy" };
};

// יצירת מחסנית ניווט
const Stack = createStackNavigator<AuthStackParamList>();

// בדיקת תקינות למסך ראשי
const isValidScreen = (screen?: string): screen is keyof AuthStackParamList =>
  !!screen && ["Login", "Register", "ForgotPassword", "Terms"].includes(screen);

/**
 * ניווט למסכי אימות
 */
export const AuthNavigator = () => {
  const route = useRoute();

  // קבלת פרמטרים לניווט
  const routeParams = route.params as
    | { screen?: keyof AuthStackParamList; params?: object }
    | undefined;

  // שימוש ב־useMemo לחישוב המסך הראשי + בדיקת תקינות
  const initialScreen = useMemo<keyof AuthStackParamList>(
    () => (isValidScreen(routeParams?.screen) ? routeParams?.screen : "Login"),
    [routeParams]
  );

  // לוגינג חכם – ידפיס רק בסביבות לא-Production
  if (__DEV__) {
    logger.info("AuthNavigator", "🎯 Navigation params:", {
      params: route.params,
      initialScreen,
      fromQuestionnaire: routeParams?.params,
    });
  }

  return (
    <Stack.Navigator
      initialRouteName={initialScreen}
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: "white" },
        animationEnabled: true,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="Terms" component={TermsScreen} />
    </Stack.Navigator>
  );
};
