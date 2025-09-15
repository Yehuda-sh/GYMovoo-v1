/**
 * @file auth.types.ts
 * @description טיפוסים הקשורים לאימות משתמשים ומסכי התחברות/הרשמה
 */

/**
 * נתוני משתמש להתחברות
 */
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

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
