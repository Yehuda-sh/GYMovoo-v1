/**
 * @file index.ts
 * @description נקודת יציאה למודול האימות
 */

// ייצוא רכיבים
export { LoginForm } from "./components/LoginForm";
export { RegisterForm } from "./components/RegisterForm";

// ייצוא מסכים
export { LoginScreen } from "./screens/LoginScreen";
export { RegisterScreen } from "./screens/RegisterScreen";
export { ForgotPasswordScreen } from "./screens/ForgotPasswordScreen";
export { TermsScreen } from "./screens/TermsScreen";

// ייצוא ניווט
export { AuthNavigator } from "./navigation/AuthNavigator";
export type { AuthStackParamList } from "./navigation/AuthNavigator";

// ייצוא hooks
export { useAuth } from "./hooks/useAuth";
export { useAuthStore } from "./hooks/useAuth";

// ייצוא טיפוסים
export * from "./types";
