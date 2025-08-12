import { demoUserService } from "../demoUserService";

describe("demoUserService equipment shape", () => {
  test("generateDemoUser returns unified questionnaire equipment ids", () => {
    const user = demoUserService.generateDemoUser();
    // מצפה ל-ids בסגנון unified: 'bodyweight_only', 'dumbbells', 'free_weights' וכו'
    expect(Array.isArray(user.equipment)).toBe(true);
    for (const id of user.equipment) {
      expect(typeof id).toBe("string");
    }
    // לכל הפחות, לא אמורים להופיע מזהים ישנים שאינם בשאלון
    expect(user.equipment).not.toContain("barbell");
  });
});
