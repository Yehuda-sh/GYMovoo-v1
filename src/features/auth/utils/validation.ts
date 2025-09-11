/**
 * @file validation.ts
 * @description פונקציות עזר לאימות קלט במסכי התחברות והרשמה
 */

/**
 * בדיקת תקינות כתובת אימייל
 */
export const validateEmail = (email: string): string | null => {
  if (!email || email.trim() === "") {
    return "נא להזין כתובת אימייל";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "כתובת אימייל לא תקינה";
  }

  return null;
};

/**
 * בדיקת תקינות סיסמה
 */
export const validatePassword = (password: string): string | null => {
  if (!password) {
    return "נא להזין סיסמה";
  }

  if (password.length < 8) {
    return "הסיסמה חייבת להכיל לפחות 8 תווים";
  }

  // בדיקה שיש לפחות ספרה אחת
  if (!/\d/.test(password)) {
    return "הסיסמה חייבת להכיל לפחות ספרה אחת";
  }

  // בדיקה שיש לפחות אות גדולה אחת (לא רלוונטי בעברית, אבל שימושי לאנגלית)
  if (!/[A-Z]/.test(password)) {
    return "הסיסמה חייבת להכיל לפחות אות גדולה אחת";
  }

  // בדיקה שיש לפחות תו מיוחד
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return "הסיסמה חייבת להכיל לפחות תו מיוחד אחד";
  }

  return null;
};

/**
 * בדיקת התאמת סיסמאות
 */
export const validatePasswordMatch = (
  password: string,
  confirmPassword: string
): string | null => {
  if (!confirmPassword) {
    return "נא לאשר את הסיסמה";
  }

  if (password !== confirmPassword) {
    return "הסיסמאות אינן תואמות";
  }

  return null;
};

/**
 * בדיקת שם מלא
 */
export const validateName = (name: string): string | null => {
  if (!name || name.trim() === "") {
    return "נא להזין שם מלא";
  }

  if (name.trim().length < 2) {
    return "השם חייב להכיל לפחות 2 תווים";
  }

  return null;
};

/**
 * בדיקת תנאי שימוש
 */
export const validateTermsAgreement = (agreed: boolean): string | null => {
  if (!agreed) {
    return "יש לאשר את תנאי השימוש כדי להמשיך";
  }

  return null;
};
