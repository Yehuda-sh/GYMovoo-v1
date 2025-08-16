import { fieldMapper } from "../fieldMapper";

describe("fieldMapper", () => {
  test("fromDB maps lowercase known keys to camelCase without losing originals", () => {
    const raw = {
      id: "1",
      smartquestionnairedata: { answers: { age: "26_35" } },
      activityhistory: [1, 2, 3],
    };
    const mapped = fieldMapper.fromDB(raw);
    expect(mapped.smartQuestionnaireData).toBeDefined();
    expect(mapped.smartQuestionnaireData?.answers.age).toBe("26_35");
    // original keys still present
    expect((mapped as any).smartquestionnairedata).toBeDefined();
  });

  test("toDB maps camelCase keys to lowercase and preserves existing lowercase", () => {
    const updates = {
      smartQuestionnaireData: { answers: { goal: "build_muscle" } },
      activityHistory: ["a"],
      customFieldX: 5,
    } as any;
    const dbObj = fieldMapper.toDB(updates);
    expect(dbObj.smartquestionnairedata).toBeDefined();
    expect(dbObj.activityhistory).toBeDefined();
    // unknown key becomes lowercase
    expect(dbObj.customfieldx).toBe(5);
  });

  test("getSmartAnswers returns answers from either camelCase or lowercase", () => {
    const u1 = { smartQuestionnaireData: { answers: { gender: "male" } } };
    const u2 = { smartquestionnairedata: { answers: { gender: "female" } } };
    expect(fieldMapper.getSmartAnswers(u1)?.gender).toBe("male");
    expect(fieldMapper.getSmartAnswers(u2)?.gender).toBe("female");
  });

  test("getSmartAnswers returns null for invalid structure", () => {
    expect(fieldMapper.getSmartAnswers(null)).toBeNull();
    expect(fieldMapper.getSmartAnswers({})).toBeNull();
    expect(
      fieldMapper.getSmartAnswers({ smartQuestionnaireData: {} })
    ).toBeNull();
  });
});
