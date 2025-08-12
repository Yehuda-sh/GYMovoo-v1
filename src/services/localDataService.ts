// שירות נתונים מקומי - בסיסי
// src/services/localDataService.ts

import { User, Workout, Questionnaire } from "../types/index";

// מאגר נתונים בזיכרון בלבד
const users: User[] = [];
const workouts: Workout[] = [];
const questionnaires: Questionnaire[] = [];

export const localDataService = {
  // משתמשים
  getUsers: () => users,
  addUser: (user: User) => {
    users.push(user);
    return user;
  },
  updateUser: (id: string, data: Partial<User>) => {
    const user = users.find((u) => u.id === id);
    if (user) Object.assign(user, data);
    return user;
  },
  // אימונים
  getWorkouts: () => workouts,
  addWorkout: (workout: Workout) => {
    workouts.push(workout);
    return workout;
  },
  // שאלונים
  getQuestionnaires: () => questionnaires,
  addQuestionnaire: (q: Questionnaire) => {
    questionnaires.push(q);
    return q;
  },
};
