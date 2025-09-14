/**
 * @file src/constants/profileScreenTexts.ts
 * @brief קבועי טקסט למסך הפרופיל - פושט ומיועל
 * @brief Profile screen text constants - simplified and optimized
 * @notes טקסטים בסיסיים למסך פרופיל והישגים בלבד - הוסרו הישגים מיותרים
 * @notes Basic texts for profile screen and achievements only - removed unused achievements
 * @version 3.0.0 - Removed unused achievements: QUESTIONNAIRE_COMPLETE, EARLY_BIRD, DEDICATED_TRAINER, CENTURY_CLUB
 * @updated 2025-09-13 הסרת הישגים מיותרים והמשך פישוט
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

  // הישגים / Achievements
  ACHIEVEMENTS: {
    // הישגים בסיסיים / Basic achievements
    ENTHUSIASTIC_BEGINNER: {
      title: "ברוך הבא ל‑GYMovoo",
      description: "השלמת את ההרשמה והשאלון",
    },

    // הישגי רצף / Streak achievements
    WEEKLY_STREAK: {
      title: "רצף שבועי",
      description: "7 ימים של אימונים ברצף",
    },
    BIWEEKLY_STREAK: {
      title: "רצף דו-שבועי",
      description: "14 ימים של אימונים ברצף",
    },
    MONTHLY_STREAK: {
      title: "רצף חודשי",
      description: "30 ימים של אימונים ברצף",
    },

    // הישגי כמות אימונים / Workout count achievements
    TEN_WORKOUTS: {
      title: "10 אימונים",
      description: "השלמת 10 אימונים",
    },
    TWENTY_FIVE_WORKOUTS: {
      title: "25 אימונים",
      description: "השלמת 25 אימונים",
    },
    FIFTY_WORKOUTS: {
      title: "50 אימונים",
      description: "השלמת 50 אימונים",
    },
    HUNDRED_WORKOUTS: {
      title: "100 אימונים",
      description: "השלמת 100 אימונים",
    },

    // הישגי זמן אימון / Workout time achievements
    ONE_HOUR_FITNESS: {
      title: "שעה של כושר",
      description: "צברת שעה של אימונים",
    },
    TEN_HOURS_TRAINING: {
      title: "10 שעות אימון",
      description: "צברת 10 שעות של אימונים",
    },
    FITNESS_MARATHON: {
      title: "מרתון כושר",
      description: "צברת 25 שעות של אימונים",
    },

    // הישגי זמן שימוש / Usage time achievements
    WEEK_WITH_GYMOVOO: {
      title: "שבוע עם GYMovoo",
      description: "שבוע שלם עם האפליקציה",
    },
    MONTH_WITH_GYMOVOO: {
      title: "חודש עם GYMovoo",
      description: "חודש שלם עם האפליקציה",
    },
    VETERAN_GYMOVOO: {
      title: "ותיק GYMovoo",
      description: "3 חודשים עם האפליקציה",
    },

    // הישגי דירוג / Rating achievements
    EXCELLENT_RATER: {
      title: "מדרג מעולה",
      description: "דירוג ממוצע מעל 4.5",
    },
    PERFECT: {
      title: "מושלם!",
      description: "דירוג ממוצע של 5 כוכבים",
    },

    // הישגי זמן ויום / Time and day achievements
    WEEKEND_WARRIOR: {
      title: "לוחם סוף השבוע",
      description: "10 אימונים בסופי שבוע",
    },
    MORNING_PERSON: {
      title: "חובב בוקר",
      description: "10 אימונים בשעות הבוקר",
    },
    NIGHT_OWL: {
      title: "ינשוף לילה",
      description: "10 אימונים בשעות הערב",
    },

    // הישגים חדשים / New achievements
    FIRST_WORKOUT: {
      title: "אימון ראשון",
      description: "השלמת האימון הראשון",
    },
    STREAK_MASTER: {
      title: "מאסטר רצף",
      description: "50 ימי אימון ברציפות",
    },
    UNSTOPPABLE: {
      title: "בלתי ניתן לעצירה",
      description: "100 ימי אימון ברציפות",
    },
    WORKOUT_VETERAN: {
      title: "וטרן אימונים",
      description: "השלמת 200 אימונים",
    },
    LEGENDARY_TRAINER: {
      title: "מאמן אגדי",
      description: "השלמת 500 אימונים",
    },
    QUARTER_CENTURY: {
      title: "רבע מאה",
      description: "37.5 שעות של אימונים",
    },
    LOYAL_MEMBER: {
      title: "חבר נאמן",
      description: "6 חודשים שימוש באפליקציה",
    },
    YEAR_WITH_GYMOVOO: {
      title: "שנה עם GYMovoo",
      description: "שנה שימוש באפליקציה",
    },
    CONSISTENT_TRAINER: {
      title: "מאמן עקבי",
      description: "דירוג ממוצע של 4.0 כוכבים",
    },
    MASTER_RATER: {
      title: "מאסטר דירוג",
      description: "25 דירוגים של 5 כוכבים",
    },
    SPEED_DEMON: {
      title: "שד מהירות",
      description: "50 שעות של אימונים",
    },
    PERFECTIONIST: {
      title: "פרפקציוניסט",
      description: "50 דירוגים של 5 כוכבים",
    },
  },
};
