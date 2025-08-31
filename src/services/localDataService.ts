/**
 * @file src/services/localDataService.ts
 * @description Local data service for development and testing (DEV ONLY)
 * English: Local data service for development and testing purposes only
 * @warning This service is for DEVELOPMENT ONLY. Use server APIs in production.
 * @status ACTIVE - Development utility service
 * @dependencies In-memory storage, TypeScript types from types/index
 * @usedBy Development environment, unit tests, debugging
 * @performance In-memory storage - fast but not persistent across app restarts
 * @security DEV-only checks prevent accidental production usage
 * @updated 2025-09-01 Enhanced documentation, added missing CRUD operations, improved type safety
 */

// שירות נתונים מקומי - בסיסי (DEV ONLY)
// src/services/localDataService.ts
// הערה: שירות זה מיועד לפיתוח ובדיקות בלבד. בפרודקשן יש להשתמש בשרת בלבד.

import { User, Workout, Questionnaire } from "../types/index";

// מאגר נתונים בזיכרון בלבד
const users: User[] = [];
const workouts: Workout[] = [];
const questionnaires: Questionnaire[] = [];

/**
 * Local data service for development and testing
 * שירות נתונים מקומי לפיתוח ובדיקות
 *
 * @warning DEVELOPMENT ONLY - Throws errors in production
 * @example
 * ```typescript
 * // In development only
 * const user = localDataService.addUser({ id: '1', name: 'Test' });
 * const users = localDataService.getUsers();
 * ```
 */
export const localDataService = {
  // =======================================
  // 👤 User Management
  // ניהול משתמשים
  // =======================================

  /**
   * Get all users
   * קבלת כל המשתמשים
   * @returns {User[]} Array of all users
   */
  getUsers: (): User[] => users,

  /**
   * Get user by ID
   * קבלת משתמש לפי מזהה
   * @param id - User ID
   * @returns {User | undefined} User object or undefined if not found
   */
  getUserById: (id: string): User | undefined => {
    return users.find((u) => u.id === id);
  },

  /**
   * Add new user (DEV ONLY)
   * הוספת משתמש חדש (פיתוח בלבד)
   * @param user - User object to add
   * @returns {User} Added user object
   * @throws {Error} If called in production
   */
  addUser: (user: User): User => {
    if (!__DEV__) {
      throw new Error("localDataService.addUser is DEV-only. Use server APIs.");
    }
    users.push(user);
    return user;
  },

  /**
   * Update existing user (DEV ONLY)
   * עדכון משתמש קיים (פיתוח בלבד)
   * @param id - User ID to update
   * @param data - Partial user data to update
   * @returns {User | undefined} Updated user or undefined if not found
   * @throws {Error} If called in production
   */
  updateUser: (id: string, data: Partial<User>): User | undefined => {
    if (!__DEV__) {
      throw new Error(
        "localDataService.updateUser is DEV-only. Use server APIs."
      );
    }
    const user = users.find((u) => u.id === id);
    if (user) Object.assign(user, data);
    return user;
  },

  /**
   * Delete user by ID (DEV ONLY)
   * מחיקת משתמש לפי מזהה (פיתוח בלבד)
   * @param id - User ID to delete
   * @returns {boolean} True if user was deleted, false if not found
   * @throws {Error} If called in production
   */
  deleteUser: (id: string): boolean => {
    if (!__DEV__) {
      throw new Error(
        "localDataService.deleteUser is DEV-only. Use server APIs."
      );
    }
    const index = users.findIndex((u) => u.id === id);
    if (index !== -1) {
      users.splice(index, 1);
      return true;
    }
    return false;
  },

  /**
   * Clear all users (DEV ONLY)
   * ניקוי כל המשתמשים (פיתוח בלבד)
   * @throws {Error} If called in production
   */
  clearUsers: (): void => {
    if (!__DEV__) {
      throw new Error(
        "localDataService.clearUsers is DEV-only. Use server APIs."
      );
    }
    users.length = 0;
  },

  // =======================================
  // 💪 Workout Management
  // ניהול אימונים
  // =======================================

  /**
   * Get all workouts
   * קבלת כל האימונים
   * @returns {Workout[]} Array of all workouts
   */
  getWorkouts: (): Workout[] => workouts,

  /**
   * Get workout by ID
   * קבלת אימון לפי מזהה
   * @param id - Workout ID
   * @returns {Workout | undefined} Workout object or undefined if not found
   */
  getWorkoutById: (id: string): Workout | undefined => {
    return workouts.find((w) => w.id === id);
  },

  /**
   * Add new workout (DEV ONLY)
   * הוספת אימון חדש (פיתוח בלבד)
   * @param workout - Workout object to add
   * @returns {Workout} Added workout object
   * @throws {Error} If called in production
   */
  addWorkout: (workout: Workout): Workout => {
    if (!__DEV__) {
      throw new Error(
        "localDataService.addWorkout is DEV-only. Use server APIs."
      );
    }
    workouts.push(workout);
    return workout;
  },

  /**
   * Delete workout by ID (DEV ONLY)
   * מחיקת אימון לפי מזהה (פיתוח בלבד)
   * @param id - Workout ID to delete
   * @returns {boolean} True if workout was deleted, false if not found
   * @throws {Error} If called in production
   */
  deleteWorkout: (id: string): boolean => {
    if (!__DEV__) {
      throw new Error(
        "localDataService.deleteWorkout is DEV-only. Use server APIs."
      );
    }
    const index = workouts.findIndex((w) => w.id === id);
    if (index !== -1) {
      workouts.splice(index, 1);
      return true;
    }
    return false;
  },

  /**
   * Clear all workouts (DEV ONLY)
   * ניקוי כל האימונים (פיתוח בלבד)
   * @throws {Error} If called in production
   */
  clearWorkouts: (): void => {
    if (!__DEV__) {
      throw new Error(
        "localDataService.clearWorkouts is DEV-only. Use server APIs."
      );
    }
    workouts.length = 0;
  },

  // =======================================
  // 📝 Questionnaire Management
  // ניהול שאלונים
  // =======================================

  /**
   * Get all questionnaires
   * קבלת כל השאלונים
   * @returns {Questionnaire[]} Array of all questionnaires
   */
  getQuestionnaires: (): Questionnaire[] => questionnaires,

  /**
   * Get questionnaire by ID
   * קבלת שאלון לפי מזהה
   * @param id - Questionnaire ID
   * @returns {Questionnaire | undefined} Questionnaire object or undefined if not found
   */
  getQuestionnaireById: (id: string): Questionnaire | undefined => {
    return questionnaires.find((q) => q.id === id);
  },

  /**
   * Add new questionnaire (DEV ONLY)
   * הוספת שאלון חדש (פיתוח בלבד)
   * @param questionnaire - Questionnaire object to add
   * @returns {Questionnaire} Added questionnaire object
   * @throws {Error} If called in production
   */
  addQuestionnaire: (questionnaire: Questionnaire): Questionnaire => {
    if (!__DEV__) {
      throw new Error(
        "localDataService.addQuestionnaire is DEV-only. Use server APIs."
      );
    }
    questionnaires.push(questionnaire);
    return questionnaire;
  },

  /**
   * Delete questionnaire by ID (DEV ONLY)
   * מחיקת שאלון לפי מזהה (פיתוח בלבד)
   * @param id - Questionnaire ID to delete
   * @returns {boolean} True if questionnaire was deleted, false if not found
   * @throws {Error} If called in production
   */
  deleteQuestionnaire: (id: string): boolean => {
    if (!__DEV__) {
      throw new Error(
        "localDataService.deleteQuestionnaire is DEV-only. Use server APIs."
      );
    }
    const index = questionnaires.findIndex((q) => q.id === id);
    if (index !== -1) {
      questionnaires.splice(index, 1);
      return true;
    }
    return false;
  },

  /**
   * Clear all questionnaires (DEV ONLY)
   * ניקוי כל השאלונים (פיתוח בלבד)
   * @throws {Error} If called in production
   */
  clearQuestionnaires: (): void => {
    if (!__DEV__) {
      throw new Error(
        "localDataService.clearQuestionnaires is DEV-only. Use server APIs."
      );
    }
    questionnaires.length = 0;
  },

  // =======================================
  // 🧹 Utility Functions
  // פונקציות עזר
  // =======================================

  /**
   * Clear all data (DEV ONLY)
   * ניקוי כל הנתונים (פיתוח בלבד)
   * @throws {Error} If called in production
   */
  clearAllData: (): void => {
    if (!__DEV__) {
      throw new Error(
        "localDataService.clearAllData is DEV-only. Use server APIs."
      );
    }
    users.length = 0;
    workouts.length = 0;
    questionnaires.length = 0;
  },

  /**
   * Get data statistics
   * קבלת סטטיסטיקות נתונים
   * @returns {Object} Statistics object with counts
   */
  getStats: () => ({
    users: users.length,
    workouts: workouts.length,
    questionnaires: questionnaires.length,
    total: users.length + workouts.length + questionnaires.length,
  }),
};
