/**
 * @file AuthNavigator.tsx
 * @description ניווט למסכי אימות והרשמה
 */

import { createStackNavigator } from "@react-navigation/stack";

import { LoginScreen } from "../screens/LoginScreen";
import { RegisterScreen } from "../screens/RegisterScreen";
import { ForgotPasswordScreen } from "../screens/ForgotPasswordScreen";
import { TermsScreen } from "../screens/TermsScreen";

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
  return (
    <Stack.Navigator
      initialRouteName="Login"
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
