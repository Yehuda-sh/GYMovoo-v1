/**
 * Gender adaptation utilities for Hebrew text
 */

export type UserGender = "male" | "female" | "other";

/**
 * Basic gender text mappings for Hebrew
 */
const GENDER_MAPPINGS = {
  male: {
    מתחילה: "מתחיל",
    מתקדמת: "מתקדם",
    "צעירה ומלאה אנרגיה": "צעיר ומלא אנרגיה",
    "מנוסה ופעילה": "מנוסה ופעיל",
  },
  female: {
    מתחיל: "מתחילה",
    מתקדם: "מתקדמת",
    "צעיר ומלא אנרגיה": "צעירה ומלאה אנרגיה",
    "מנוסה ופעיל": "מנוסה ופעילה",
  },
} as const;

/**
 * Adapt basic text to gender
 */
export const adaptBasicTextToGender = (
  text: string,
  gender: "male" | "female" | "other"
): string => {
  if (gender === "other") return text;

  const mappings = GENDER_MAPPINGS[gender];
  let adaptedText = text;

  Object.entries(mappings).forEach(([from, to]) => {
    adaptedText = adaptedText.replace(new RegExp(from, "g"), to);
  });

  return adaptedText;
};

/**
 * Create gender-neutral text
 */
export const makeTextGenderNeutral = (text: string): string => {
  const neutralMappings: Record<string, string> = {
    מתחיל: "בתחילת הדרך",
    מתחילה: "בתחילת הדרך",
    מתקדם: "ברמה מתקדמת",
    מתקדמת: "ברמה מתקדמת",
  };

  let neutralText = text;
  Object.entries(neutralMappings).forEach(([from, to]) => {
    neutralText = neutralText.replace(new RegExp(from, "g"), to);
  });

  return neutralText;
};

/**
 * Get dynamic gender-based text
 */
export const getDynamicGenderText = (
  baseText: string,
  gender: "male" | "female" | "other",
  variations: { male?: string; female?: string; neutral?: string } = {}
): string => {
  switch (gender) {
    case "male":
      return variations.male || adaptBasicTextToGender(baseText, "male");
    case "female":
      return variations.female || adaptBasicTextToGender(baseText, "female");
    case "other":
    default:
      return variations.neutral || makeTextGenderNeutral(baseText);
  }
};

/**
 * Generate simple gender-adapted congratulation
 */
export function generateGenderAdaptedCongratulation(
  gender?: UserGender,
  personalRecordsCount: number = 0
): string {
  if (personalRecordsCount === 0) {
    const general = {
      male: "אימון מעולה! המשך כך!",
      female: "אימון מעולה! המשיכי כך!",
      other: "אימון מעולה! המשך כך!",
    };
    return general[gender || "other"];
  }

  const recordText =
    personalRecordsCount === 1
      ? "שיא אישי"
      : `${personalRecordsCount} שיאים אישיים`;
  const withRecords = {
    male: `מזל טוב! שברת ${recordText}!`,
    female: `מזל טוב! שברת ${recordText}!`,
    other: `מזל טוב! שברת ${recordText}!`,
  };

  return withRecords[gender || "other"];
}
