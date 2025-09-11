/**
 * @file mockAuthService.ts
 * @description שירות מדמה לפעולות אימות והתחברות (לשימוש בפיתוח בלבד)
 */

import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
  AuthError,
} from "../types";

// מאגר נתונים מדמה של משתמשים
const MOCK_USERS = [
  {
    id: "1",
    email: "user@example.com",
    password: "Password123!",
    name: "משתמש לדוגמה",
    profileImage: null,
    createdAt: new Date().toISOString(),
    preferences: {
      theme: "auto",
      notifications: true,
    },
  },
];

// טוקן אקראי לאימות
const generateToken = () => {
  return `mock_token_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * פונקציה מדמה להתחברות רגילה
 */
export const mockLogin = async (
  credentials: LoginCredentials
): Promise<User> => {
  // סימולציית עיכוב רשת
  await new Promise((resolve) => setTimeout(resolve, 800));

  // חיפוש המשתמש במאגר מדמה
  const user = MOCK_USERS.find((u) => u.email === credentials.email);

  if (!user) {
    const error: AuthError = {
      code: "auth/user-not-found",
      message: "אימייל או סיסמה שגויים",
    };
    throw error;
  }

  if (user.password !== credentials.password) {
    const error: AuthError = {
      code: "auth/wrong-password",
      message: "אימייל או סיסמה שגויים",
    };
    throw error;
  }

  // מחזיר מידע על המשתמש (ללא הסיסמה)
  const { password, ...userWithoutPassword } = user;

  return userWithoutPassword as User;
};

/**
 * פונקציה מדמה להרשמה
 */
export const mockRegister = async (
  userData: RegisterCredentials
): Promise<User> => {
  // סימולציית עיכוב רשת
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // בדיקה האם המשתמש כבר קיים
  const userExists = MOCK_USERS.some((user) => user.email === userData.email);

  if (userExists) {
    const error: AuthError = {
      code: "auth/email-already-in-use",
      message: "המייל כבר רשום במערכת",
    };
    throw error;
  }

  // יצירת משתמש חדש
  const newUser = {
    id: `user_${Math.random().toString(36).substring(2, 9)}`,
    email: userData.email,
    password: userData.password,
    name: userData.name,
    profileImage: null,
    createdAt: new Date().toISOString(),
    preferences: {
      theme: "auto",
      notifications: true,
    },
  };

  // הוספת המשתמש למאגר מדמה
  MOCK_USERS.push(newUser);

  // החזרת המשתמש ללא הסיסמה
  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword as User;
};

/**
 * פונקציה מדמה להתחברות עם Google
 */
export const mockGoogleLogin = async (googleToken: string): Promise<User> => {
  // סימולציית עיכוב רשת
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // אימות טוקן פשוט - כאן אנחנו רק בודקים שהוא קיים
  if (!googleToken || typeof googleToken !== "string") {
    const error: AuthError = {
      code: "auth/invalid-credential",
      message: "התחברות עם Google נכשלה: טוקן לא תקין",
    };
    throw error;
  }

  // בסביבת דמה תמיד נחזיר הצלחה עם משתמש קבוע
  return {
    id: "g-123456",
    email: "google-user@example.com",
    name: "משתמש גוגל",
    profileImage: "https://example.com/placeholder-profile.jpg",
    createdAt: new Date().toISOString(),
    preferences: {
      theme: "auto",
      notifications: true,
    },
  };
};

/**
 * פונקציה מדמה ליציאה מהמערכת
 */
export const mockLogout = async (): Promise<void> => {
  // סימולציית עיכוב רשת
  await new Promise((resolve) => setTimeout(resolve, 500));

  // אין צורך בלוגיקה נוספת במצב פיתוח
  return;
};

/**
 * פונקציה מדמה לאיפוס סיסמה
 */
export const mockResetPassword = async (email: string): Promise<boolean> => {
  // סימולציית עיכוב רשת
  await new Promise((resolve) => setTimeout(resolve, 800));

  // בדיקה האם המשתמש קיים
  const userExists = MOCK_USERS.some((user) => user.email === email);

  if (!userExists) {
    const error: AuthError = {
      code: "auth/user-not-found",
      message: "לא נמצא משתמש עם המייל הזה",
    };
    throw error;
  }

  // במצב פיתוח נחזיר תמיד הצלחה
  return true;
};
