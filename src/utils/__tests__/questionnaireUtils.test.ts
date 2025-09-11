import {
  extractSmartAnswers,
  getPersonalDataFromUser,
} from "../questionnaireUtils";
import type { User } from "../../types";

describe("questionnaireUtils", () => {
  describe("extractSmartAnswers", () => {
    test("returns null for invalid data", () => {
      expect(extractSmartAnswers(null)).toBeNull();
      expect(extractSmartAnswers({})).toBeNull();
    });

    test("extracts answers from both camelCase and lowercase", () => {
      const user1 = { questionnaireData: { answers: { gender: "male" } } };
      const user2 = {
        questionnaireData: { answers: { gender: "female" } },
      };

      expect(extractSmartAnswers(user1)?.gender).toBe("male");
      expect(extractSmartAnswers(user2)?.gender).toBe("female");
    });
  });

  describe("getPersonalDataFromUser", () => {
    test("maps user data to ranges", () => {
      const user: Partial<User> = {
        questionnaireData: {
          answers: {
            gender: "male",
            age: 30,
            weight: 82,
            height: 178,
            fitnessLevel: "intermediate",
          },
        },
      };

      const result = getPersonalDataFromUser(user as User);
      expect(result).toEqual({
        gender: "male",
        age: "25_34",
        weight: "80_89",
        height: "170_179",
        fitnessLevel: "intermediate",
      });
    });

    test("returns undefined for invalid data", () => {
      expect(
        getPersonalDataFromUser({ questionnaireData: {} } as any)
      ).toBeUndefined();
      expect(
        getPersonalDataFromUser({
          questionnaireData: {
            answers: {
              gender: "invalid" as any,
              age: 30,
              weight: 82,
              height: 178,
              fitnessLevel: "intermediate",
            },
          },
        } as any)
      ).toBeUndefined();
    });
  });
});
