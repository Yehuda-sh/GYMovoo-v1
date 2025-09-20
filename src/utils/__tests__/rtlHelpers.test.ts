// Mock AsyncStorage before importing helpers
jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(async () => null),
    setItem: jest.fn(async () => {}),
    removeItem: jest.fn(async () => {}),
  },
}));

import {
  isRTL,
  wrapBidi,
  normalizeNumber,
  formatRelativeTimeIntl,
  formatCompactUnit,
  formatDurationSeconds,
  mirrorStyle,
  abbreviateHebrew,
  subscribeRTL,
  toggleRTL,
  formatHebrewNumber,
  enforceHebrew,
} from "../rtlHelpers";

// Basic mock for logger (if side-effects happen internally)
jest.mock("../logger", () => ({
  logger: {
    error: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  },
}));

describe("rtlHelpers additions", () => {
  test("wrapBidi adds embedding when mixing scripts", () => {
    const txt = "Workout 30 דקות";
    const wrapped = wrapBidi(txt);
    // Should contain directional embedding mark and pop
    expect(wrapped).toMatch(/\u202B|\u202A/); // RLE or LRE
    expect(wrapped).toMatch(/\u202C$/); // PDF at end
  });

  test("normalizeNumber removes leading zeros", () => {
    expect(normalizeNumber("00045")).toBe("45");
  });

  test("formatRelativeTimeIntl returns Hebrew phrase", () => {
    const inFiveMinutes = Date.now() + 5 * 60 * 1000;
    const res = formatRelativeTimeIntl(inFiveMinutes);
    // Possible output: "בעוד 5 דקות"
    expect(res).toMatch(/\d/);
  });

  test("formatCompactUnit handles kg", () => {
    const res = formatCompactUnit(70, "kg");
    expect(res).toMatch(/70/);
    expect(res).toMatch(/ק"ג/);
  });

  test("formatDurationSeconds short style", () => {
    expect(formatDurationSeconds(90)).toBe("1ד׳ 30ש׳׳");
  });

  test("formatDurationSeconds clock style", () => {
    expect(formatDurationSeconds(75, { style: "clock" })).toBe("1:15");
  });

  test("mirrorStyle mirrors left/right", () => {
    const base = { marginLeft: 10, paddingRight: 4 };
    const mirrored = mirrorStyle(base);
    if (isRTL()) {
      expect(mirrored).toHaveProperty("marginRight", 10);
      expect(mirrored).not.toHaveProperty("marginLeft");
    } else {
      expect(mirrored).toEqual(base);
    }
  });

  test("abbreviateHebrew returns mapping", () => {
    expect(abbreviateHebrew("דקות")).toBe("ד׳");
  });

  test("subscribeRTL receives toggle events", async () => {
    const calls: boolean[] = [];
    const unsubscribe = subscribeRTL((v) => calls.push(v));
    await toggleRTL();
    await toggleRTL();
    unsubscribe();
    expect(calls.length).toBeGreaterThanOrEqual(1);
  });

  test("enforceHebrew wraps RLM for Hebrew", () => {
    const txt = "שלום";
    const enforced = enforceHebrew(txt);
    expect(enforced.startsWith("\u200F")).toBe(true);
    expect(enforced.endsWith("\u200F")).toBe(true);
  });

  test("formatHebrewNumber uses locale grouping", () => {
    const n = formatHebrewNumber(12345);
    // In he-IL usually uses comma separator or narrow space
    expect(n).toMatch(/12[ ,\u202F]?345/);
  });
});
