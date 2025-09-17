/**
 * @file AuthNavigator.tsx
 * @description ניווט למסכי אימות והרשמה
 */

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

/**
 * ניווט למסכי אימות
 */
export const AuthNavigator = () => {
  const route = useRoute();

  // בדוק אם הגענו עם פרמטר screen מהניווט הראשי
  const routeParams = route.params as
    | { screen?: keyof AuthStackParamList; params?: object }
    | undefined;
  const initialScreen = routeParams?.screen || "Login";

  console.log("🔍 [AuthNavigator] Initial screen:", {
    initialScreen,
    routeParams: route.params,
  });

  logger.info("AuthNavigator", "🎯 Navigation params:", {
    params: route.params,
    initialScreen,
    fromQuestionnaire: routeParams?.params,
  });

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
