// src/services/authService.ts

export const fakeGoogleSignIn = async () => {
  // משתמש "קיים" שכבר ענה על שאלון (דמו)
  return {
    email: "googleuser@gmail.com",
    name: "Google User",
    age: 18,
    questionnaire: { 0: "16 ומעלה", 1: "חיטוב", 2: "מתחיל", 3: "2" },
  };
};

export const fakeGoogleRegister = async () => {
  // משתמש חדש, ללא תשובות בשאלון (בן 18)
  return {
    email: "newgoogle@gmail.com",
    name: "Google User חדש",
    age: 18,
    questionnaire: {},
  };
};
