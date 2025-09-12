import { fieldMapper } from "../fieldMapper";

describe("fieldMapper", () => {
  test("fromDB maps database fields to camelCase", () => {
    const dbData = {
      id: "1",
      name: "Test User",
      questionnaire_data: JSON.stringify({ answers: { age: "26_35" } }),
      has_questionnaire: true,
      activity_history: JSON.stringify([1, 2, 3]),
    };
    const mapped = fieldMapper.fromDB(dbData);

    expect(mapped.id).toBe("1");
    expect(mapped.name).toBe("Test User");
    expect(mapped.questionnaireData).toEqual({ answers: { age: "26_35" } });
    expect(mapped.hasQuestionnaire).toBe(true);
    expect(mapped.activityHistory).toEqual([1, 2, 3]);
    expect(mapped.questionnaire_data).toBeUndefined();
    expect(mapped.has_questionnaire).toBeUndefined();
    expect(mapped.activity_history).toBeUndefined();
  });

  test("toDB maps camelCase to database fields", () => {
    const userData = {
      id: "1",
      name: "Test User",
      questionnaireData: { answers: { goal: "build_muscle" } },
      hasQuestionnaire: true,
      activityHistory: ["workout1", "workout2"],
    };
    const dbObj = fieldMapper.toDB(userData);

    expect(dbObj.id).toBe("1");
    expect(dbObj.name).toBe("Test User");
    expect(dbObj.questionnaire_data).toBe(
      '{"answers":{"goal":"build_muscle"}}'
    );
    expect(dbObj.has_questionnaire).toBe(true);
    expect(dbObj.activity_history).toBe('["workout1","workout2"]');
    expect(dbObj.questionnaireData).toBeUndefined();
    expect(dbObj.hasQuestionnaire).toBeUndefined();
    expect(dbObj.activityHistory).toBeUndefined();
  });

  test("toDB auto-sets hasQuestionnaire when questionnaireData exists", () => {
    const userData = {
      questionnaireData: { answers: { goal: "build_muscle" } },
      // hasQuestionnaire לא מוגדר במפורש
    };
    const dbObj = fieldMapper.toDB(userData);

    expect(dbObj.has_questionnaire).toBe(true);
    expect(dbObj.questionnaire_data).toBe(
      '{"answers":{"goal":"build_muscle"}}'
    );
  });

  test("getSmartAnswers extracts questionnaire answers", () => {
    const userWithQuestionnaire = {
      questionnaireData: { answers: { gender: "male", age: "26_35" } },
    };
    const userWithoutQuestionnaire = {
      name: "Test User",
    };

    expect(fieldMapper.getSmartAnswers(userWithQuestionnaire)).toEqual({
      gender: "male",
      age: "26_35",
    });
    expect(fieldMapper.getSmartAnswers(userWithoutQuestionnaire)).toBeNull();
    expect(fieldMapper.getSmartAnswers(null)).toBeNull();
    expect(fieldMapper.getSmartAnswers({})).toBeNull();
  });
});
