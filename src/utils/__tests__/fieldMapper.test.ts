import { fieldMapper } from "../fieldMapper";

describe("fieldMapper", () => {
  test("fromDB maps lowercase to camelCase", () => {
    const raw = {
      id: "1",
      smartquestionnairedata: { answers: { age: "26_35" } },
      activityhistory: [1, 2, 3],
    };
    const mapped = fieldMapper.fromDB(raw);

    expect(mapped.smartQuestionnaireData).toBeDefined();
    expect((mapped.smartQuestionnaireData as any)?.answers.age).toBe("26_35");
    expect(mapped.activityHistory).toEqual([1, 2, 3]);
  });

  test("toDB maps camelCase to lowercase", () => {
    const updates = {
      smartQuestionnaireData: { answers: { goal: "build_muscle" } },
      activityHistory: ["a"],
    } as any;
    const dbObj = fieldMapper.toDB(updates);

    expect(dbObj.smartquestionnairedata).toBeDefined();
    expect(dbObj.activityhistory).toEqual(["a"]);
  });

  test("getSmartAnswers extracts from both formats", () => {
    const camelCase = {
      smartQuestionnaireData: { answers: { gender: "male" } },
    };
    const lowercase = {
      smartquestionnairedata: { answers: { gender: "female" } },
    };

    expect(fieldMapper.getSmartAnswers(camelCase)?.gender).toBe("male");
    expect(fieldMapper.getSmartAnswers(lowercase)?.gender).toBe("female");
    expect(fieldMapper.getSmartAnswers(null)).toBeNull();
    expect(fieldMapper.getSmartAnswers({})).toBeNull();
  });
});
