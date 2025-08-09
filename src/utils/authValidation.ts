/**
 * authValidation.ts
 * Shared authentication validation helpers
 */

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const validatePassword = (password: string): boolean =>
  password.length >= 6;

export interface LoginFieldErrors {
  email?: string;
  password?: string;
}

export const validateLoginForm = (
  email: string,
  password: string
): LoginFieldErrors => {
  const errors: LoginFieldErrors = {};
  const trimmedEmail = email.trim();
  if (!trimmedEmail) {
    errors.email = AUTH_STRINGS.errors.emailRequired; // will be replaced by build-time treeshaking if imported
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

// Lightweight internal fallback (avoids circular import if constants missing early)
export const AUTH_STRINGS = {
  errors: {
    emailRequired: "אנא הזן כתובת אימייל",
    emailInvalid: "כתובת אימייל לא תקינה",
    passwordRequired: "אנא הזן סיסמה",
    passwordTooShort: "הסיסמה חייבת להכיל לפחות 6 תווים",
    loginFailed: "פרטי ההתחברות שגויים. אנא בדוק את האימייל והסיסמה.",
    generalLoginError: "אירעה שגיאה בהתחברות",
    googleFailed: "ההתחברות עם Google נכשלה",
  },
};
