/**
 * @file src/utils/authValidation.ts
 * @description פונקציות אימות אוטנטיקציה פשוטות ומחרוזות שגיאות מרכזיות
 * @updated 2025-09-03 - פישוט והסרת קוד מיותר
 * English: Simple authentication validation helpers and centralized error strings
 */

// ===============================================
// 🏷️ Basic Types & Interfaces
// ממשקים וטיפוסים בסיסיים
// ===============================================

export interface LoginFieldErrors {
  email?: string;
  password?: string;
  general?: string;
}

export interface RegisterFieldErrors extends LoginFieldErrors {
  fullName?: string;
  confirmPassword?: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// ===============================================
// ✅ Basic Validation Functions
// פונקציות אימות בסיסיות
// ===============================================

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * אימות אימייל פשוט
 * Simple email validation
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email?.trim()) {
    return {
      isValid: false,
      errors: ["אנא הזן כתובת אימייל"],
    };
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail.length > 254) {
    return {
      isValid: false,
      errors: ["כתובת אימייל ארוכה מדי"],
    };
  }

  if (!EMAIL_REGEX.test(normalizedEmail)) {
    return {
      isValid: false,
      errors: ["פורמט אימייל לא תקין"],
    };
  }

  return {
    isValid: true,
    errors: [],
  };
};

/**
 * אימות סיסמה פשוט
 * Simple password validation
 */
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return {
      isValid: false,
      errors: ["אנא הזן סיסמה"],
    };
  }

  if (password.length < 6) {
    return {
      isValid: false,
      errors: ["הסיסמה חייבת להכיל לפחות 6 תווים"],
    };
  }

  return {
    isValid: true,
    errors: [],
  };
};

/**
 * אימות שם מלא פשוט
 * Simple full name validation
 */
export const validateFullName = (name: string): ValidationResult => {
  if (!name?.trim()) {
    return {
      isValid: false,
      errors: ["אנא הזן שם מלא"],
    };
  }

  const trimmed = name.trim();

  if (trimmed.length < 2) {
    return {
      isValid: false,
      errors: ["שם מלא חייב להכיל לפחות 2 תווים"],
    };
  }

  if (trimmed.length > 100) {
    return {
      isValid: false,
      errors: ["שם מלא ארוך מדי"],
    };
  }

  // Character validation (Hebrew, English, spaces, dots, hyphens)
  if (!/^[\u0590-\u05FF\s\w.-]+$/.test(trimmed)) {
    return {
      isValid: false,
      errors: ["שם מלא מכיל תווים לא תקינים"],
    };
  }

  return {
    isValid: true,
    errors: [],
  };
};

/**
 * אימות אישור סיסמה פשוט
 * Simple password confirmation validation
 */
export const validatePasswordConfirmation = (
  password: string,
  confirm: string
): ValidationResult => {
  if (!confirm) {
    return {
      isValid: false,
      errors: ["אנא אשר את הסיסמה"],
    };
  }

  const passwordResult = validatePassword(password);
  if (!passwordResult.isValid) {
    return passwordResult;
  }

  if (password !== confirm) {
    return {
      isValid: false,
      errors: ["הסיסמאות אינן תואמות"],
    };
  }

  return {
    isValid: true,
    errors: [],
  };
};

// ===============================================
// 🏷️ Enhanced Form Validation Interface
// ממשק אימות טפסים משופר
// ===============================================

export interface FormValidationResult {
  isValid: boolean;
  errors: LoginFieldErrors | RegisterFieldErrors;
}

// ===============================================
// 🏷️ Form Validation Functions
// פונקציות אימות טפסים
// ===============================================

/**
 * אימות טופס התחברות
 * Login form validation
 */
export const validateLoginForm = (
  email: string,
  password: string
): FormValidationResult => {
  const errors: LoginFieldErrors = {};

  const emailResult = validateEmail(email);
  if (!emailResult.isValid) {
    errors.email = emailResult.errors[0];
  }

  const passwordResult = validatePassword(password);
  if (!passwordResult.isValid) {
    errors.password = passwordResult.errors[0];
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
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
): FormValidationResult => {
  const errors: RegisterFieldErrors = {};

  const nameResult = validateFullName(fullName);
  if (!nameResult.isValid) {
    errors.fullName = nameResult.errors[0];
  }

  const emailResult = validateEmail(email);
  if (!emailResult.isValid) {
    errors.email = emailResult.errors[0];
  }

  const passwordResult = validatePassword(password);
  if (!passwordResult.isValid) {
    errors.password = passwordResult.errors[0];
  }

  const confirmResult = validatePasswordConfirmation(password, confirmPassword);
  if (!confirmResult.isValid) {
    errors.confirmPassword = confirmResult.errors[0];
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// ===============================================
// 🌐 Error Strings
// מחרוזות שגיאה מרכזיות
// ===============================================

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

  success: {
    loginSuccess: "התחברות בוצעה בהצלחה",
    registerSuccess: "הרשמה בוצעה בהצלחה",
  },
} as const;

// ===============================================
// 🔧 Utility Functions
// פונקציות עזר
// ===============================================

/**
 * נרמול אימייל
 * Email normalization
 */
export const normalizeEmail = (email: string): string => {
  return email?.trim().toLowerCase() || "";
};

/**
 * בדיקת שגיאות טופס
 * Check form errors
 */
export const hasFormErrors = (
  errors: Record<string, string | undefined>
): boolean => {
  return Object.values(errors).some((error) => error !== undefined);
};
