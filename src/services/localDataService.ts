// שירות נתונים מקומי - בסיסי (DEV ONLY)
// src/services/localDataService.ts
// הערה: שירות זה מיועד לפיתוח ובדיקות בלבד. בפרודקשן יש להשתמש בשרת בלבד.

import { User, Workout, Questionnaire } from "../types/index";

// מאגר נתונים בזיכרון בלבד
const users: User[] = [];
const workouts: Workout[] = [];
const questionnaires: Questionnaire[] = [];

export const localDataService = {
  // משתמשים
  getUsers: () => users,
  addUser: (user: User) => {
    if (!__DEV__) {
      throw new Error("localDataService.addUser is DEV-only. Use server APIs.");
    }
    users.push(user);
    return user;
  },
  updateUser: (id: string, data: Partial<User>) => {
    if (!__DEV__) {
      throw new Error(
        "localDataService.updateUser is DEV-only. Use server APIs."
      );
    }
    const user = users.find((u) => u.id === id);
    if (user) Object.assign(user, data);
    return user;
  },
  // אימונים
  getWorkouts: () => workouts,
  addWorkout: (workout: Workout) => {
    if (!__DEV__) {
      throw new Error(
        "localDataService.addWorkout is DEV-only. Use server APIs."
      );
    }
    workouts.push(workout);
    return workout;
  },
  // שאלונים
  getQuestionnaires: () => questionnaires,
  addQuestionnaire: (q: Questionnaire) => {
    if (!__DEV__) {
      throw new Error(
        "localDataService.addQuestionnaire is DEV-only. Use server APIs."
      );
    }
    questionnaires.push(q);
    return q;
  },
};
