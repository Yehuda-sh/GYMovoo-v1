/**
 * @file src/utils/authValidation.ts
 * @description אימותי אוטנטיקציה משותפים ומחרוזות שגיאות מרכזיות
 * Shared authentication validation helpers and centralized error strings
 * Updated: 2025-08-17 - מרכוז הודעות שגיאה ושיפור ולידציה
 */

// רגקס מחמיר יותר לאימייל (מונע דומיינים לא תקינים)
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * אימות כתובת אימייל עם נרמול בסיסי
 */
export const validateEmail = (email: string): boolean => {
  if (!email?.trim()) return false;
  const normalizedEmail = email.trim().toLowerCase();
  return EMAIL_REGEX.test(normalizedEmail) && normalizedEmail.length <= 254;
};

/**
 * אימות סיסמה - לפחות 6 תווים (ניתן להרחבה)
 */
export const validatePassword = (password: string): boolean => {
  return password?.length >= 6;
};

/**
 * אימות שם מלא - לפחות 2 תווים אלפא
 */
export const validateFullName = (name: string): boolean => {
  const trimmed = name?.trim();
  return !!(
    trimmed &&
    trimmed.length >= 2 &&
    /^[\u0590-\u05FF\s\w.-]+$/.test(trimmed)
  );
};

/**
 * בדיקת התאמת סיסמאות
 */
export const validatePasswordConfirmation = (
  password: string,
  confirm: string
): boolean => {
  return password === confirm && validatePassword(password);
};

// טיפוסים לשגיאות טופסים
export interface LoginFieldErrors {
  email?: string;
  password?: string;
}

export interface RegisterFieldErrors extends LoginFieldErrors {
  fullName?: string;
  confirmPassword?: string;
}

/**
 * אימות טופס התחברות מלא
 */
export const validateLoginForm = (
  email: string,
  password: string
): LoginFieldErrors => {
  const errors: LoginFieldErrors = {};
  const trimmedEmail = email?.trim() || "";

  if (!trimmedEmail) {
    errors.email = AUTH_STRINGS.errors.emailRequired;
  } else if (!validateEmail(trimmedEmail)) {
    errors.email = AUTH_STRINGS.errors.emailInvalid;
  }

  if (!password) {
    errors.password = AUTH_STRINGS.errors.passwordRequired;
  } else if (!validatePassword(password)) {
    errors.password = AUTH_STRINGS.errors.passwordTooShort;
  }

  return errors;
};

/**
 * אימות טופס הרשמה מלא
 */
export const validateRegisterForm = (
  fullName: string,
  email: string,
  password: string,
  confirmPassword: string
): RegisterFieldErrors => {
  const errors: RegisterFieldErrors = {};

  // אימות שם מלא
  if (!fullName?.trim()) {
    errors.fullName = AUTH_STRINGS.errors.fullNameRequired;
  } else if (!validateFullName(fullName)) {
    errors.fullName = AUTH_STRINGS.errors.fullNameInvalid;
  }

  // אימות אימייל וסיסמה (שימוש חוזר בלוגיקת login)
  const loginErrors = validateLoginForm(email, password);
  Object.assign(errors, loginErrors);

  // אימות אישור סיסמה
  if (!confirmPassword) {
    errors.confirmPassword = AUTH_STRINGS.errors.confirmPasswordRequired;
  } else if (!validatePasswordConfirmation(password, confirmPassword)) {
    errors.confirmPassword = AUTH_STRINGS.errors.confirmPasswordMismatch;
  }

  return errors;
};

/**
 * חישוב חוזק סיסמה (0-5)
 */
export const calculatePasswordStrength = (
  password: string
): {
  score: number;
  level: "weak" | "medium" | "strong";
  feedback: string;
} => {
  if (!password) return { score: 0, level: "weak", feedback: "נדרשת סיסמה" };

  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score, level: "weak", feedback: "סיסמה חלשה" };
  if (score <= 3) return { score, level: "medium", feedback: "סיסמה בינונית" };
  return { score, level: "strong", feedback: "סיסמה חזקה" };
};

/**
 * נרמול אימייל (lowercase, trim)
 */
export const normalizeEmail = (email: string): string => {
  return email?.trim().toLowerCase() || "";
};

/**
 * בדיקה האם יש שגיאות בטופס
 */
export const hasFormErrors = (
  errors: Record<string, string | undefined>
): boolean => {
  return Object.values(errors).some((error) => error !== undefined);
};

// הודעות שגיאה מרכזיות (משותפות לכל המסכים)
export const AUTH_STRINGS = {
  errors: {
    // שגיאות כלליות
    emailRequired: "אנא הזן כתובת אימייל",
    emailInvalid: "כתובת אימייל לא תקינה",
    passwordRequired: "אנא הזן סיסמה",
    passwordTooShort: "הסיסמה חייבת להכיל לפחות 6 תווים",

    // שגיאות הרשמה
    fullNameRequired: "אנא הזן שם מלא",
    fullNameInvalid: "שם מלא חייב להכיל לפחות 2 תווים תקינים",
    confirmPasswordRequired: "אנא אשר את הסיסמה",
    confirmPasswordMismatch: "הסיסמאות אינן תואמות",

    // שגיאות מערכת
    loginFailed: "פרטי ההתחברות שגויים. אנא בדוק את האימייל והסיסמה.",
    generalLoginError: "אירעה שגיאה בהתחברות",
    generalRegisterError: "אירעה שגיאה בהרשמה. אנא נסה שוב",
    googleFailed: "ההתחברות עם Google נכשלה",

    // אימותים נוספים
    ageVerificationRequired: "ההרשמה מותרת רק מגיל 16 ומעלה",
    termsAcceptanceRequired: "יש לאשר את תנאי השימוש",
  },
} as const;
