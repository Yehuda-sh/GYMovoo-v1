import {
  extractSmartAnswers,
  getPersonalDataFromUser,
} from "../questionnaireUtils";

describe("questionnaireUtils", () => {
  test("extractSmartAnswers returns null for invalid user", () => {
    expect(extractSmartAnswers(null as any)).toBeNull();
    expect(extractSmartAnswers({} as any)).toBeNull();
  });

  test("extractSmartAnswers handles camelCase and lowercase", () => {
    const u1 = { smartQuestionnaireData: { answers: { gender: "male" } } };
    const u2 = { smartquestionnairedata: { answers: { gender: "female" } } };
    expect(extractSmartAnswers(u1)?.gender).toBe("male");
    expect(extractSmartAnswers(u2)?.gender).toBe("female");
  });

  test("getPersonalDataFromUser maps core fields to range strings", () => {
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
    const pd = getPersonalDataFromUser(user);
    expect(pd).toEqual({
      gender: "male",
      age: "25_34", // 30 falls in 25-34 range
      weight: "80_89", // 82 falls in 80-89 range
      height: "170_179", // 178 falls in 170-179 range
      fitnessLevel: "intermediate",
    });
  });

  test("getPersonalDataFromUser returns undefined when no answers", () => {
    const user: any = { smartquestionnairedata: {} };
    expect(getPersonalDataFromUser(user)).toBeUndefined();
  });

  test("getPersonalDataFromUser validates gender", () => {
    const user: any = {
      smartquestionnairedata: {
        answers: {
          gender: "invalid",
          age: 30,
          weight: 82,
          height: 178,
          fitnessLevel: "intermediate",
        },
      },
    };
    expect(getPersonalDataFromUser(user)).toBeUndefined();
  });

  test("getPersonalDataFromUser validates fitness level", () => {
    const user: any = {
      smartquestionnairedata: {
        answers: {
          gender: "male",
          age: 30,
          weight: 82,
          height: 178,
          fitnessLevel: "invalid",
        },
      },
    };
    expect(getPersonalDataFromUser(user)).toBeUndefined();
  });

  test("getPersonalDataFromUser handles edge case ages", () => {
    const youngUser: any = {
      smartquestionnairedata: {
        answers: {
          gender: "female",
          age: 15,
          weight: 60,
          height: 165,
          fitnessLevel: "beginner",
        },
      },
    };
    const pd = getPersonalDataFromUser(youngUser);
    expect(pd?.age).toBe("18_24"); // Should handle edge cases gracefully

    const oldUser: any = {
      smartquestionnairedata: {
        answers: {
          gender: "male",
          age: 80,
          weight: 85,
          height: 175,
          fitnessLevel: "advanced",
        },
      },
    };
    const pd2 = getPersonalDataFromUser(oldUser);
    expect(pd2?.age).toBe("65_plus");
  });
});
