import { demoWorkoutService } from "../demoWorkoutService";

// ניגש בפנים לפונקציות דרך any כדי לבדוק פרטי מימוש פרטיים בצורה ממוקדת
const svc: any = demoWorkoutService;

describe("demoWorkoutService equipment mapping", () => {
  test("maps unified 'bodyweight_only' to ['none']", () => {
    const res = svc.mapUnifiedEquipmentToInternal(["bodyweight_only"]);
    expect(res).toContain("none");
    expect(res).not.toContain("barbell");
    expect(res).not.toContain("dumbbells");
  });

  test("maps unified 'dumbbells' to ['dumbbells']", () => {
    const res = svc.mapUnifiedEquipmentToInternal(["dumbbells"]);
    expect(res).toContain("dumbbells");
  });

  test("maps unified 'free_weights' to include barbell and dumbbells", () => {
    const res = svc.mapUnifiedEquipmentToInternal(["free_weights"]);
    expect(res).toContain("barbell");
    expect(res).toContain("dumbbells");
  });

  test("unknown ids fallback to ['none']", () => {
    const res = svc.mapUnifiedEquipmentToInternal(["unknown_id"]);
    expect(res).toContain("none");
  });

  test("empty/null inputs fallback to ['none']", () => {
    expect(svc.mapUnifiedEquipmentToInternal([])).toEqual(["none"]);
    expect(svc.mapUnifiedEquipmentToInternal(undefined)).toEqual(["none"]);
  });
});
