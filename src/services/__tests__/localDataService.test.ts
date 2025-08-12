// בדיקות אוטומטיות לשירות הנתונים המקומי
// src/services/__tests__/localDataService.test.ts

import { localDataService } from "../localDataService";
import { User, Workout, Questionnaire } from "../../types/index";

describe("localDataService", () => {
  it("should add and get users", () => {
    const user: User = {
      id: "u1",
      name: "Test User",
      email: "test@example.com",
    };
    localDataService.addUser(user);
    const users = localDataService.getUsers();
    expect(users).toContainEqual(user);
  });

  it("should update user", () => {
    const user: User = {
      id: "u2",
      name: "Update User",
      email: "update@example.com",
    };
    localDataService.addUser(user);
    localDataService.updateUser("u2", { name: "Updated" });
    const updated = localDataService.getUsers().find((u) => u.id === "u2");
    expect(updated?.name).toBe("Updated");
  });

  it("should add and get workouts", () => {
    const workout: Workout = { id: "w1", name: "Workout 1" };
    localDataService.addWorkout(workout);
    const workouts = localDataService.getWorkouts();
    expect(workouts).toContainEqual(workout);
  });

  it("should add and get questionnaires", () => {
    const questionnaire: Questionnaire = { id: "q1", answers: {} };
    localDataService.addQuestionnaire(questionnaire);
    const questionnaires = localDataService.getQuestionnaires();
    expect(questionnaires).toContainEqual(questionnaire);
  });
});
