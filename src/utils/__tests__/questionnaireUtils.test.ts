import {
  extractSmartAnswers,
  getPersonalDataFromUser,
} from "../questionnaireUtils";

describe("questionnaireUtils", () => {
  describe("extractSmartAnswers", () => {
    test("returns null for invalid data", () => {
      expect(extractSmartAnswers(null)).toBeNull();
      expect(extractSmartAnswers({})).toBeNull();
    });

    test("extracts answers from both camelCase and lowercase", () => {
      const user1 = { smartQuestionnaireData: { answers: { gender: "male" } } };
      const user2 = {
        smartquestionnairedata: { answers: { gender: "female" } },
      };

      expect(extractSmartAnswers(user1)?.gender).toBe("male");
      expect(extractSmartAnswers(user2)?.gender).toBe("female");
    });
  });

  describe("getPersonalDataFromUser", () => {
    test("maps user data to ranges", () => {
      const user: any = {
        smartquestionnairedata: {
          answers: {
            gender: "male",
            age: 30,
            weight: 82,
            height: 178,
            fitnessLevel: "intermediate",
          },
        },
      };

      const result = getPersonalDataFromUser(user);
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
        getPersonalDataFromUser({ smartquestionnairedata: {} } as any)
      ).toBeUndefined();
      expect(
        getPersonalDataFromUser({
          smartquestionnairedata: {
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
