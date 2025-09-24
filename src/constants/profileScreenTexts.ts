/**
 * @file src/constants/profileScreenTexts.ts
 * @brief קבועי טקסט למסך הפרופיל - פושט ומיועל
 * @brief Profile screen text constants - simplified and optimized
 * @notes טקסטים בסיסיים למסך פרופיל והישגים בלבד - הוסרו הישגים מיותרים
 * @notes Basic texts for profile screen and achievements only - removed unused achievements
 */

export const PROFILE_SCREEN_TEXTS = {
  // כותרות ראשיות / Main headers
  HEADERS: {
    PROFILE_TITLE: "הפרופיל שלי",
    MY_STATS: "הסטטיסטיקות שלי",
  },

  // פעולות וכפתורים / Actions and buttons
  ACTIONS: {
    COMPLETE_QUESTIONNAIRE: "השלם את השאלון",
    LOGOUT: "התנתק",
  },

  // סטטיסטיקות / Statistics
  STATS: {
    TOTAL_WORKOUTS: "סך אימונים",
    STREAK_DAYS: "רצף ימים",
  },

  // הישגים / Achievements - מערכת דינמית חכמה
  ACHIEVEMENTS: {
    // הישגים בסיסיים / Basic achievements
    ENTHUSIASTIC_BEGINNER: {
      title: "ברוך הבא ל‑GYMovoo",
      description: "השלמת את ההרשמה והשאלון",
    },
    FIRST_WORKOUT: {
      title: "אימון ראשון",
      description: "השלמת האימון הראשון",
    },
  },

  // פונקציות דינמיות להישגים חוזרים / Dynamic achievement generators
  DYNAMIC_ACHIEVEMENTS: {
    streakAchievement: (days: number) => ({
      title:
        days === 7
          ? "רצף שבועי"
          : days === 14
            ? "רצף דו-שבועי"
            : days === 30
              ? "רצף חודשי"
              : days === 50
                ? "מאסטר רצף"
                : days === 100
                  ? "בלתי ניתן לעצירה"
                  : `רצף ${days} ימים`,
      description: `${days} ימים של אימונים ברצף`,
    }),

    workoutCountAchievement: (count: number) => ({
      title:
        count === 10
          ? "10 אימונים"
          : count === 25
            ? "25 אימונים"
            : count === 50
              ? "50 אימונים"
              : count === 100
                ? "100 אימונים"
                : count === 200
                  ? "וטרן אימונים"
                  : count === 500
                    ? "מאמן אגדי"
                    : `${count} אימונים`,
      description: `השלמת ${count} אימונים`,
    }),

    timeAchievement: (hours: number) => ({
      title:
        hours === 1
          ? "שעה של כושר"
          : hours === 10
            ? "10 שעות אימון"
            : hours === 25
              ? "מרתון כושר"
              : hours === 37.5
                ? "רבע מאה"
                : hours === 50
                  ? "שד מהירות"
                  : `${hours} שעות כושר`,
      description: `צברת ${hours} שעות של אימונים`,
    }),

    ratingAchievement: (
      rating: number,
      type: "average" | "count" = "average"
    ) => ({
      title:
        rating === 4.0 && type === "average"
          ? "מאמן עקבי"
          : rating === 4.5 && type === "average"
            ? "מדרג מעולה"
            : rating === 5.0 && type === "average"
              ? "מושלם!"
              : rating === 25 && type === "count"
                ? "מאסטר דירוג"
                : rating === 50 && type === "count"
                  ? "פרפקציוניסט"
                  : `דירוג ${rating}`,
      description:
        type === "average"
          ? `דירוג ממוצע של ${rating} כוכבים`
          : `${rating} דירוגים של 5 כוכבים`,
    }),

    usageTimeAchievement: (
      period: "week" | "month" | "quarter" | "half" | "year"
    ) => ({
      title:
        period === "week"
          ? "שבוע עם GYMovoo"
          : period === "month"
            ? "חודש עם GYMovoo"
            : period === "quarter"
              ? "ותיק GYMovoo"
              : period === "half"
                ? "חבר נאמן"
                : period === "year"
                  ? "שנה עם GYMovoo"
                  : `${period} עם GYMovoo`,
      description:
        period === "week"
          ? "שבוע שלם עם האפליקציה"
          : period === "month"
            ? "חודש שלם עם האפליקציה"
            : period === "quarter"
              ? "3 חודשים עם האפליקציה"
              : period === "half"
                ? "6 חודשים שימוש באפליקציה"
                : period === "year"
                  ? "שנה שימוש באפליקציה"
                  : `${period} עם האפליקציה`,
    }),

    specialAchievement: (type: "weekend" | "morning" | "night") => ({
      title:
        type === "weekend"
          ? "לוחם סוף השבוع"
          : type === "morning"
            ? "חובב בוקר"
            : type === "night"
              ? "ינשוף לילה"
              : `מיוחד ${type}`,
      description:
        type === "weekend"
          ? "10 אימונים בסופי שבוע"
          : type === "morning"
            ? "10 אימונים בשעות הבוקר"
            : type === "night"
              ? "10 אימונים בשעות הערב"
              : `אימון מיוחד ${type}`,
    }),
  },
};
