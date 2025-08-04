/**
 * @file src/utils/genderAdaptation.ts
 * @brief כלי עזר מרכזיים להתאמת תכנים למגדר המשתמש
 * @description פונקציות משותפות להתאמת שמות תרגילים והודעות למגדר
 * @updated 2025-01-31 יצירת קובץ מרכזי להקטנת כפילויות קוד
 */

export type UserGender = "male" | "female" | "other";

/**
 * התאמת שמות תרגילים למגדר המשתמש
 * Adapt exercise names to user gender
 */
export function adaptExerciseNameToGender(
  exerciseName: string,
  gender?: UserGender
): string {
  if (!gender) return exerciseName;

  // התאמות לנשים
  if (gender === "female") {
    const femaleAdaptations: { [key: string]: string } = {
      "Push-ups": "שכיבות סמיכה מותאמות",
      Squats: "כפיפות ברכיים נשיות",
      Planks: "פלאנק מחזק",
      Lunges: "צעדי נשים",
      Burpees: "בורפי מותאם",
      "Pull-ups": "מתח נשי מותאם",
      Deadlift: "הרמת משקל נשית",
    };
    return femaleAdaptations[exerciseName] || exerciseName;
  }

  // התאמות לגברים
  if (gender === "male") {
    const maleAdaptations: { [key: string]: string } = {
      "Push-ups": "שכיבות סמיכה חזקות",
      "Pull-ups": "מתח לגברים",
      Deadlift: "הרמת משקל כבד",
      "Bench Press": "פרס חזה מתקדם",
      Squats: "כפיפות ברכיים גבריות",
      Burpees: "בורפי חזק",
    };
    return maleAdaptations[exerciseName] || exerciseName;
  }

  return exerciseName; // ללא התאמה למגדר אחר
}

/**
 * יצירת הודעות פידבק מותאמות למגדר
 * Generate gender-adapted feedback messages
 */
export function generateGenderAdaptedFeedbackNotes(
  gender?: UserGender,
  difficulty: number = 3
): string[] {
  if (!gender) {
    return [
      "אימון מעולה!",
      "הרגשתי בטוב היום",
      "התקדמתי יפה",
      "אימון מאתגר ומספק",
      "גאה בעצמי",
    ];
  }

  if (gender === "male") {
    return difficulty >= 4
      ? [
          "אימון חזק! המשך כך!",
          "הרגשתי כמו אריה היום",
          "המשקלים היו כבדים אבל התמדתי",
          "כוח וסיבולת בשיא",
          "אימון גברי מעולה",
          "דחפתי את הגבולות היום - הרגשתי את הכוח שלי",
        ]
      : [
          "אימון נעים, הרגשתי חזק ובשליטה",
          "זרימה טובה היום, הכל הלך חלק",
          "אימון בסיסי אבל יעיל",
          "התחלה טובה לשיפור הביצועים",
        ];
  }

  if (gender === "female") {
    return difficulty >= 4
      ? [
          "אימון נפלא! הרגשתי חזקה",
          "התמדתי למרות הקושי",
          "הרגשתי כמו לוחמת",
          "גאה בעצמי על ההישג",
          "אימון מעצים ומחזק",
          "אימון קשה אבל הרגשתי כמו גיבורה!",
        ]
      : [
          "אימון נעים והרגשתי בטובה",
          "זרימה יפה, נהנתי מכל רגע",
          "אימון מתון שעזר לי להרגיש טוב",
          "התחלה מצויינת למסע הכושר שלי",
        ];
  }

  return [
    "אימון מעולה!",
    "הרגשתי בטוב היום",
    "התקדמתי יפה",
    "אימון מאתגר ומספק",
    "גאה בעצמי",
  ];
}

/**
 * יצירת הודעת פידבק יחידה מותאמת למגדר
 * Generate single gender-adapted feedback message
 */
export function generateSingleGenderAdaptedNote(
  gender?: UserGender,
  difficulty: number = 3
): string {
  const notes = generateGenderAdaptedFeedbackNotes(gender, difficulty);
  return notes[Math.floor(Math.random() * notes.length)];
}

/**
 * יצירת הודעת ברכה מותאמת למגדר
 * Generate gender-adapted congratulation message
 */
export function generateGenderAdaptedCongratulation(
  gender?: UserGender,
  personalRecordsCount: number = 0
): string {
  if (personalRecordsCount === 0) {
    if (gender === "male") {
      return "המשך כך, אתה בדרך הנכונה לגדולה!";
    } else if (gender === "female") {
      return "את מדהימה! המשיכי כך!";
    }
    return "אתה מדהים! המשך כך!";
  }

  const recordText =
    personalRecordsCount === 1
      ? "שיא אישי"
      : `${personalRecordsCount} שיאים אישיים`;

  if (gender === "male") {
    return `מזל טוב גבר! שברת היום ${recordText}! אתה אלוף!`;
  } else if (gender === "female") {
    return `מזל טוב גיבורה! שברת היום ${recordText}! את מדהימה!`;
  }

  return `מזל טוב! שברת היום ${recordText}! אתה מדהים!`;
}

/**
 * התאמת טקסט בסיסי למגדר | Basic gender text adaptation
 * הועבר מ-rtlHelpers.ts לטובת איחוד הלוגיקה
 */
export const adaptBasicTextToGender = (
  text: string,
  gender: "male" | "female" | "other"
): string => {
  if (gender === "other") return text;

  // המרות בסיסיות שלמדנו
  const genderMappings = {
    male: {
      "צעירה ומלאה אנרגיה": "צעיר ומלא אנרגיה",
      "מנוסה ופעילה": "מנוסה ופעיל",
      מתחילה: "מתחיל",
      מתקדמת: "מתקדם",
    },
    female: {
      "צעיר ומלא אנרגיה": "צעירה ומלאה אנרגיה",
      "מנוסה ופעיל": "מנוסה ופעילה",
      מתחיל: "מתחילה",
      מתקדם: "מתקדמת",
    },
  };

  const mappings = genderMappings[gender];
  let adaptedText = text;

  Object.entries(mappings).forEach(([from, to]) => {
    adaptedText = adaptedText.replace(new RegExp(from, "g"), to);
  });

  return adaptedText;
};

/**
 * יצירת טקסט ניטרלי מגדרית | Create gender-neutral text
 * הועבר מ-rtlHelpers.ts לטובת איחוד הלוגיקה
 */
export const makeTextGenderNeutral = (text: string): string => {
  const neutralMappings = {
    "צעיר ומלא אנרגיה": "עם אנרגיה צעירה",
    "צעירה ומלאה אנרגיה": "עם אנרגיה צעירה",
    "מנוסה ופעיל": "עם ניסיון ופעילות",
    "מנוסה ופעילה": "עם ניסיון ופעילות",
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
 * טיפול בטקסטים דינמיים בהתאם למגדר | Handle dynamic gender-based texts
 * הועבר מ-rtlHelpers.ts לטובת איחוד הלוגיקה
 */
export const getDynamicGenderText = (
  baseText: string,
  gender: "male" | "female" | "other",
  variations: {
    male?: string;
    female?: string;
    neutral?: string;
  } = {}
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
