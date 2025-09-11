/**
 * @file auth.types.ts
 * @description טיפוסים הקשורים לאימות משתמשים ומסכי התחברות/הרשמה
 */

/**
 * טיפוס משתמש
 */
export interface User {
  id: string;
  email: string;
  name: string;
  profileImage?: string | null;
  createdAt: string;
  preferences?: {
    theme: string;
    notifications: boolean;
  };
}

/**
 * טיפוסי שגיאות טופס התחברות
 */
export interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  fullName?: string;
  name?: string;
  terms?: string;
  age?: string;
  agreeToTerms?: string;
  [key: string]: string | undefined;
}

/**
 * נתוני משתמש להתחברות
 */
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * אלייאס לטיפוס LoginCredentials עבור תאימות
 */
export type UserCredentials = LoginCredentials;

/**
 * נתוני משתמש להרשמה
 */
export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  agreeToTerms: boolean;
}

/**
 * אלייאס לטיפוס RegisterCredentials עבור תאימות
 */
export type RegisterUserData = RegisterCredentials;

/**
 * נתוני משתמש להרשמה (פורמט ישן)
 */
export interface RegistrationData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  is16Plus: boolean;
  acceptTerms: boolean;
}

/**
 * טיפוס שגיאת אימות
 */
export interface AuthError {
  code: string;
  message: string;
  details?: unknown;
}

/**
 * העדפות משתמש
 */
export interface UserPreferences {
  rememberMe?: boolean;
  email?: string;
  theme?: string;
  language?: string;
  notifications?: boolean;
  [key: string]: unknown;
}

/**
 * מצב מודאל אישור
 */
export interface ConfirmationModalState {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "error" | "success" | "warning" | "info";
  singleButton?: boolean;
}

/**
 * תשובת התחברות
 */
export interface AuthResponse {
  success: boolean;
  user?: Omit<User, "password">;
  error?: string;
  token?: string;
  message?: string;
}

/**
 * מצב אימות כללי
 */
export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  authToken: string | null;
}

/**
 * פרמטרים למסך התחברות
 */
export interface LoginScreenParams {
  google?: boolean;
  redirect?: string;
}

/**
 * פרמטרים למסך הרשמה
 */
export interface RegisterScreenParams {
  fromQuestionnaire?: boolean;
}
