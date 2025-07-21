/**
 * @file authService.ts
 * @brief שירותי אימות דמה עבור האפליקציה
 *        Mock authentication services for the app
 * @dependencies none
 */

// src/services/authService.ts

export const fakeGoogleSignIn = async () => {
  // משתמש "קיים" שכבר ענה על שאלון (דמו)
  // Existing user who already completed the questionnaire (demo)
  return {
    email: "googleuser@gmail.com",
    name: "Google User",
    provider: "google",
    questionnaire: { 0: "16 ומעלה", 1: "חיטוב", 2: "מתחיל", 3: "2" },
  };
};

export const fakeGoogleRegister = async () => {
  // משתמש חדש, ללא תשובות בשאלון
  // New user without questionnaire answers
  return {
    email: "newgoogle@gmail.com",
    name: "Google User חדש",
    provider: "google",
    questionnaire: {},
  };
};
