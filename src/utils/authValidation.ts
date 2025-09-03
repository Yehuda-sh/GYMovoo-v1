/**
 * @file src/utils/authValidation.ts
 * @description אימות אוטנטיקציה פשוט
 * @brief Simple authentication validation
 */

// ===============================================
// 🏷️ Types
// ===============================================

export interface FormErrors {
  email?: string;
  password?: string;
  fullName?: string;
  confirmPassword?: string;
  general?: string;
}

// ===============================================
// ✅ Validation Functions
// ===============================================

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * אימות אימייל
 * Email validation
 */
export const validateEmail = (email: string): string | null => {
  if (!email?.trim()) return "אנא הזן כתובת אימייל";

  const normalized = email.trim().toLowerCase();
  if (normalized.length > 254) return "כתובת אימייל ארוכה מדי";
  if (!EMAIL_REGEX.test(normalized)) return "פורמט אימייל לא תקין";

  return null;
};

/**
 * אימות סיסמה
 * Password validation
 */
export const validatePassword = (password: string): string | null => {
  if (!password) return "אנא הזן סיסמה";
  if (password.length < 6) return "הסיסמה חייבת להכיל לפחות 6 תווים";

  return null;
};

/**
 * אימות שם מלא
 * Full name validation
 */
export const validateFullName = (name: string): string | null => {
  if (!name?.trim()) return "אנא הזן שם מלא";

  const trimmed = name.trim();
  if (trimmed.length < 2) return "שם מלא חייב להכיל לפחות 2 תווים";
  if (trimmed.length > 100) return "שם מלא ארוך מדי";

  return null;
};

/**
 * אימות אישור סיסמה
 * Password confirmation validation
 */
export const validatePasswordConfirm = (
  password: string,
  confirm: string
): string | null => {
  if (!confirm) return "אנא אשר את הסיסמה";
  if (password !== confirm) return "הסיסמאות אינן תואמות";

  return null;
};

// ===============================================
// 🏷️ Form Validation
// ===============================================

/**
 * אימות טופס התחברות
 * Login form validation
 */
export const validateLoginForm = (
  email: string,
  password: string
): FormErrors => {
  const errors: FormErrors = {};

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;

  return errors;
};

/**
 * אימות טופס הרשמה
 * Register form validation
 */
export const validateRegisterForm = (
  fullName: string,
  email: string,
  password: string,
  confirmPassword: string
): FormErrors => {
  const errors: FormErrors = {};

  const nameError = validateFullName(fullName);
  if (nameError) errors.fullName = nameError;

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;

  const confirmError = validatePasswordConfirm(password, confirmPassword);
  if (confirmError) errors.confirmPassword = confirmError;

  return errors;
};

// ===============================================
// 🌐 Error Messages
// ===============================================

export const AUTH_ERRORS = {
  loginFailed: "פרטי ההתחברות שגויים",
  registerError: "אירעה שגיאה בהרשמה",
  googleFailed: "ההתחברות עם Google נכשלה",
} as const;

// ===============================================
// 🔧 Utilities
// ===============================================

/**
 * בדיקה אם יש שגיאות בטופס
 * Check if form has errors
 */
export const hasErrors = (errors: FormErrors): boolean => {
  return Object.values(errors).some((error) => error !== undefined);
};

/**
 * נרמול אימייל
 * Normalize email
 */
export const normalizeEmail = (email: string): string => {
  return email?.trim().toLowerCase() || "";
};
