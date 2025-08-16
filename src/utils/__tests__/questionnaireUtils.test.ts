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

  test("getPersonalDataFromUser maps core fields to strings", () => {
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
      age: "30",
      weight: "82",
      height: "178",
      fitnessLevel: "intermediate",
    });
  });

  test("getPersonalDataFromUser returns undefined when no answers", () => {
    const user: any = { smartquestionnairedata: {} };
    expect(getPersonalDataFromUser(user)).toBeUndefined();
  });
});
