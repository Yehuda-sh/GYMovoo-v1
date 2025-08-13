/**
 * @file src/constants/profileScreenTexts.ts
 * @brief קבועי טקסט למסך הפרופיל - ריכוז כל המחרוזות והתרגומים
 * @brief Profile screen text constants - centralizing all strings and translations
 * @notes תמיכה מלאה RTL, תרגומים מדויקים, נגישות משופרת
 * @notes Full RTL support, accurate translations, enhanced accessibility
 */

export const PROFILE_SCREEN_TEXTS = {
  // כותרות ראשיות / Main headers
  HEADERS: {
    PROFILE_TITLE: "הפרופיל שלי",
    MY_INFO: "המידע שלי",
    MY_STATS: "הסטטיסטיקות שלי",
    MY_EQUIPMENT: "הציוד שלי",
    ACHIEVEMENTS: "הישגים נוספים",
    GOALS_TO_UNLOCK: "יעדים לפתיחה",
    SETTINGS: "הגדרות",
    PROFILE_PICTURE: "תמונת פרופיל",
    QUESTIONNAIRE_DATA: "נתוני השאלון",
  },

  // פעולות וכפתורים / Actions and buttons
  ACTIONS: {
    EDIT: "ערוך",
    EDIT_QUESTIONNAIRE: "ערוך שאלון",
    COMPLETE_QUESTIONNAIRE: "השלם את השאלון",
    SHOW_ALL: "הצג הכל",
    ADD_EQUIPMENT: "הוסף ציוד",
    LOGOUT: "התנתק",
    SAVE: "שמור",
    CANCEL: "ביטול",
    SAVING: "שומר...",
    GOT_IT: "הבנתי",
    EXCELLENT: "מעולה! 🎯",
    TRY_AGAIN: "נסה שוב",
    FROM_GALLERY: "מהגלריה",
    TAKE_PHOTO: "צלם תמונה",
    CLOSE: "סגור",
    CHANGE_PHOTO: "החלף תמונה",
    REMOVE_PHOTO: "הסר תמונה",
  },

  // סטטיסטיקות / Statistics
  STATS: {
    TOTAL_WORKOUTS: "סך אימונים",
    STREAK_DAYS: "רצף ימים",
    AVERAGE_RATING: "דירוג ממוצע",
    TOTAL_TIME: "זמן כולל",
    WEEKLY_AVERAGE: "ממוצע שבועי",
    BEST_RATING: "הדירוג הטוב",
    WORKOUT_GOALS: "יעדי אימון",
    COMPLETION_RATE: "אחוז השלמה",
    PERSONAL_RECORDS: "שיאים אישיים",
  },

  // הישגים / Achievements
  ACHIEVEMENTS: {
    // הישגים בסיסיים / Basic achievements
    ENTHUSIASTIC_BEGINNER: {
      title: "ברוך הבא ל‑GYMovoo",
      description: "השלמת את ההרשמה והשאלון",
    },
    QUESTIONNAIRE_COMPLETE: {
      title: "השלמת שאלון",
      description: "מילאת את השאלון המדעי בהצלחה",
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
  },

  // נתוני שאלון / Questionnaire data
  QUESTIONNAIRE: {
    AGE: "גיל",
    GENDER: "מגדר",
    FITNESS_LEVEL: "רמת כושר",
    PRIMARY_GOAL: "מטרה ראשית",
    WORKOUT_LOCATION: "מיקום אימון",
    AVAILABLE_EQUIPMENT: "ציוד זמין",
    SESSION_DURATION: "משך מפגש",
    WORKOUT_FREQUENCY: "תדירות אימון",
    HEALTH_STATUS: "מצב בריאותי",
    EXPERIENCE_LEVEL: "רמת ניסיון",
    WEEKLY_AVAILABILITY: "זמינות שבועית",
  },

  // תרגומי ערכי שאלון / Questionnaire value translations
  VALUES: {
    // Age ranges / טווחי גיל
    AGE_UNDER_18: "מתחת ל-18",
    AGE_18_25: "18-25",
    AGE_26_35: "26-35",
    AGE_36_45: "36-45", // תאימות לאחור
    AGE_46_55: "46-55", // תאימות לאחור
    AGE_36_50: "36-50",
    AGE_51_65: "51-65",
    AGE_55_PLUS: "55+", // תאימות לאחור
    AGE_OVER_65: "מעל 65",

    // Gender / מגדר
    MALE: "זכר",
    FEMALE: "נקבה",
    OTHER: "אחר",
    PREFER_NOT_TO_SAY: "מעדיף/ה לא לומר",

    // Fitness levels / רמות כושר
    BEGINNER: "מתחיל",
    INTERMEDIATE: "בינוני",
    ADVANCED: "מתקדם",
    EXPERT: "מומחה",
    COMPETITIVE: "תחרותי",

    // Primary goals / מטרות עיקריות
    WEIGHT_LOSS: "ירידה במשקל",
    MUSCLE_GAIN: "הגדלת מסת שריר",
    STRENGTH_IMPROVEMENT: "שיפור כוח",
    ENDURANCE_IMPROVEMENT: "שיפור סיבולת",
    GENERAL_HEALTH: "בריאות כללית",
    FITNESS_MAINTENANCE: "שמירה על כושר",

    // Workout locations / מיקומי אימון
    HOME: "בבית",
    GYM: "חדר כושר",
    OUTDOOR: "בחוץ",
    MIXED: "משולב",

    // Session durations / משכי מפגש
    DURATION_15_30: "15-30 דקות",
    DURATION_20_30: "20-30 דקות",
    DURATION_30_45: "30-45 דקות",
    DURATION_45_60: "45-60 דקות",
    DURATION_60_90: "60-90 דקות",
    DURATION_60_PLUS: "יותר מ-60 דקות",
    DURATION_90_PLUS: "90+ דקות",

    // Workout frequencies / תדירויות אימון
    FREQUENCY_2_TIMES: "פעמיים בשבוע",
    FREQUENCY_3_TIMES: "3 פעמים בשבוע",
    FREQUENCY_4_TIMES: "4 פעמים בשבוע",
    FREQUENCY_5_TIMES: "5 פעמים בשבוע",
    FREQUENCY_6_PLUS: "6+ פעמים בשבוע",

    // Health statuses / מצבים בריאותיים
    EXCELLENT_HEALTH: "בריאות מצוינת",
    GOOD_HEALTH: "בריאות טובה",
    FAIR_HEALTH: "בריאות סבירה",
    HEALTH_CONCERNS: "חששות בריאותיים",
    MEDICAL_LIMITATIONS: "מגבלות רפואיות",
  },

  // הודעות מערכת / System messages
  MESSAGES: {
    LOGOUT_CONFIRM: "האם אתה בטוח שברצונך להתנתק?",
    LOGOUT_SUCCESS: "התנתקת בהצלחה",
    SAVE_SUCCESS: "נשמר בהצלחה",
    SAVE_ERROR: "שגיאה בשמירה",
    PHOTO_PERMISSIONS: "נדרשות הרשאות מצלמה וגלריה",
    LOADING: "טוען...",
    NO_WORKOUTS: "עדיין לא ביצעת אימונים",
    NO_EQUIPMENT: "לא נבחר ציוד",
    QUESTIONNAIRE_INCOMPLETE: "השאלון לא הושלם",
  },

  // תוויות נגישות / Accessibility labels
  A11Y: {
    PROFILE_PICTURE: "תמונת פרופיל",
    EDIT_PROFILE: "ערוך פרופיל",
    ACHIEVEMENT_UNLOCKED: "הישג נפתח",
    ACHIEVEMENT_LOCKED: "הישג נעול",
    STAT_CARD: "כרטיס סטטיסטיקה",
    EQUIPMENT_ITEM: "פריט ציוד",
    NAVIGATION_BACK: "חזור למסך הקודם",
    MODAL_CLOSE: "סגור חלונית",
    LOGOUT_BUTTON: "כפתור התנתקות",
  },

  // טקסטים נוספים / Additional texts
  MISC: {
    NO_DATA: "אין נתונים",
    COMING_SOON: "בקרוב",
    PREMIUM_FEATURE: "תכונה פרימיום",
    UNLOCK_WITH: "פתח עם",
    MORE_WORKOUTS: "אימונים נוספים",
    BETTER_RATING: "דירוג טוב יותר",
    LONGER_STREAK: "רצף ארוך יותר",
  },
};

/**
 * Format questionnaire value with Hebrew translations
 * עיצוב ערך שאלון עם תרגומים לעברית
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatQuestionnaireValue = (key: string, value: any): string => {
  if (!value) return PROFILE_SCREEN_TEXTS.MISC.NO_DATA;

  const { VALUES } = PROFILE_SCREEN_TEXTS;

  // Age ranges / טווחי גיל
  if (key === "age_range" || key === "age") {
    const str = String(value);
    const unifiedAgeMap: { [key: string]: string } = {
      under_18: VALUES.AGE_UNDER_18,
      "18_25": VALUES.AGE_18_25,
      "26_35": VALUES.AGE_26_35,
      "36_50": VALUES.AGE_36_50,
      "51_65": VALUES.AGE_51_65,
      over_65: VALUES.AGE_OVER_65,
    };
    if (unifiedAgeMap[str]) return unifiedAgeMap[str];
    const normalized = str.replace(/_/g, "-");
    const legacyAgeMap: { [key: string]: string } = {
      "18-25": VALUES.AGE_18_25,
      "26-35": VALUES.AGE_26_35,
      "36-45": VALUES.AGE_36_45,
      "46-55": VALUES.AGE_46_55,
      "55+": VALUES.AGE_55_PLUS,
      "36-50": VALUES.AGE_36_50,
      "51-65": VALUES.AGE_51_65,
    };
    return legacyAgeMap[normalized] || normalized;
  }

  // Gender / מגדר
  if (key === "gender") {
    const genderMap: { [key: string]: string } = {
      male: VALUES.MALE,
      female: VALUES.FEMALE,
      other: VALUES.OTHER,
      prefer_not_to_say: VALUES.PREFER_NOT_TO_SAY,
    };
    return genderMap[value] || value;
  }

  // Weight / משקל
  if (key === "weight") {
    if (typeof value === "number") return `${value} ק"ג`;
    const str = String(value);
    const weightMap: { [key: string]: string } = {
      under_50: 'מתחת ל-50 ק"ג',
      "50_60": '50-60 ק"ג',
      "61_70": '61-70 ק"ג',
      "71_80": '71-80 ק"ג',
      "81_90": '81-90 ק"ג',
      "91_100": '91-100 ק"ג',
      over_100: 'מעל 100 ק"ג',
      prefer_not_to_say_weight: VALUES.PREFER_NOT_TO_SAY,
    };
    if (weightMap[str]) return weightMap[str];
    if (str.includes("_")) return `${str.replace(/_/g, "-")} ק"ג`;
    return `${str} ק"ג`;
  }

  // Height / גובה
  if (key === "height") {
    if (typeof value === "number") return `${value} ס"מ`;
    const str = String(value);
    const heightMap: { [key: string]: string } = {
      under_150: 'מתחת ל-150 ס"מ',
      "150_160": '150-160 ס"מ',
      "161_170": '161-170 ס"מ',
      "171_180": '171-180 ס"מ',
      "181_190": '181-190 ס"מ',
      over_190: 'מעל 190 ס"מ',
      prefer_not_to_say_height: VALUES.PREFER_NOT_TO_SAY,
    };
    if (heightMap[str]) return heightMap[str];
    if (str.includes("_")) return `${str.replace(/_/g, "-")} ס"מ`;
    return `${str} ס"מ`;
  }

  // Fitness levels / רמות כושר
  if (
    key === "fitness_level" ||
    key === "experience_level" ||
    key === "experience"
  ) {
    const levelMap: { [key: string]: string } = {
      beginner: VALUES.BEGINNER,
      intermediate: VALUES.INTERMEDIATE,
      advanced: VALUES.ADVANCED,
      expert: VALUES.EXPERT,
      competitive: VALUES.COMPETITIVE,
    };
    return levelMap[value] || String(value);
  }

  // Goals (single) / מטרה
  if (key === "goal") {
    const goalMap: { [key: string]: string } = {
      // Unified IDs
      build_muscle: VALUES.MUSCLE_GAIN,
      lose_weight: VALUES.WEIGHT_LOSS,
      general_fitness: "כושר כללי",
      athletic_performance: "ביצועים ספורטיביים",
      // Legacy/alternate IDs
      muscle_gain: VALUES.MUSCLE_GAIN,
      strength_improvement: VALUES.STRENGTH_IMPROVEMENT,
      endurance_improvement: VALUES.ENDURANCE_IMPROVEMENT,
      general_health: VALUES.GENERAL_HEALTH,
      fitness_maintenance: VALUES.FITNESS_MAINTENANCE,
    };
    return goalMap[value] || String(value);
  }

  // Goals (multiple) / מטרות
  if (key === "goals" && Array.isArray(value)) {
    const mapOne = (v: string) =>
      (
        ({
          build_muscle: VALUES.MUSCLE_GAIN,
          lose_weight: VALUES.WEIGHT_LOSS,
          general_fitness: "כושר כללי",
          athletic_performance: "ביצועים ספורטיביים",
          muscle_gain: VALUES.MUSCLE_GAIN,
          strength_improvement: VALUES.STRENGTH_IMPROVEMENT,
          endurance_improvement: VALUES.ENDURANCE_IMPROVEMENT,
          general_health: VALUES.GENERAL_HEALTH,
          fitness_maintenance: VALUES.FITNESS_MAINTENANCE,
        }) as const
      )[v] || v;
    return value.map((v: string) => mapOne(v)).join(", ");
  }

  // Primary goals / מטרות עיקריות
  if (key === "primary_goal") {
    const goalMap: { [key: string]: string } = {
      weight_loss: VALUES.WEIGHT_LOSS,
      muscle_gain: VALUES.MUSCLE_GAIN,
      strength_improvement: VALUES.STRENGTH_IMPROVEMENT,
      endurance_improvement: VALUES.ENDURANCE_IMPROVEMENT,
      general_health: VALUES.GENERAL_HEALTH,
      fitness_maintenance: VALUES.FITNESS_MAINTENANCE,
    };
    return goalMap[value] || value;
  }

  // Workout locations / מיקומי אימון
  if (key === "workout_location" || key === "location") {
    const locationMap: { [key: string]: string } = {
      home_bodyweight: VALUES.HOME,
      home_equipment: VALUES.HOME,
      home: VALUES.HOME,
      gym: VALUES.GYM,
      outdoor: VALUES.OUTDOOR,
      mixed: VALUES.MIXED,
    };
    return locationMap[value] || value;
  }

  // Session durations / משכי מפגש
  if (
    key === "session_duration" ||
    key === "duration" ||
    key === "sessionDuration"
  ) {
    const str = String(value);
    const unifiedDurationMap: { [key: string]: string } = {
      "15_30_min": VALUES.DURATION_15_30,
      "30_45_min": VALUES.DURATION_30_45,
      "45_60_min": VALUES.DURATION_45_60,
      "60_plus_min": VALUES.DURATION_60_PLUS,
      "20_30_min": VALUES.DURATION_20_30, // תאימות אחורה
      "90_plus_min": VALUES.DURATION_90_PLUS,
    };
    if (unifiedDurationMap[str]) return unifiedDurationMap[str];
    const norm = str.replace(/_/g, "-");
    const legacyMap: { [key: string]: string } = {
      "15-30-min": VALUES.DURATION_15_30,
      "30-45-min": VALUES.DURATION_30_45,
      "45-60-min": VALUES.DURATION_45_60,
      "60-plus-min": VALUES.DURATION_60_PLUS,
      "20-30-min": VALUES.DURATION_20_30,
      "90-plus-min": VALUES.DURATION_90_PLUS,
    };
    return legacyMap[norm] || norm;
  }

  // Workout frequencies / תדירויות אימון
  if (
    key === "available_days" ||
    key === "workout_frequency" ||
    key === "availability"
  ) {
    const frequencyMap: { [key: string]: string } = {
      "2-times": VALUES.FREQUENCY_2_TIMES,
      "3-times": VALUES.FREQUENCY_3_TIMES,
      "4-times": VALUES.FREQUENCY_4_TIMES,
      "5-times": VALUES.FREQUENCY_5_TIMES,
      "6-plus-times": VALUES.FREQUENCY_6_PLUS,
      "2_days": VALUES.FREQUENCY_2_TIMES,
      "3_days": VALUES.FREQUENCY_3_TIMES,
      "4_days": VALUES.FREQUENCY_4_TIMES,
      "5_days": VALUES.FREQUENCY_5_TIMES,
    };
    return frequencyMap[value] || value;
  }

  // Frequency numeric -> add days suffix / תדירות מספרית -> הוסף "ימים"
  if (key === "frequency") {
    const n = Number(value);
    if (!Number.isNaN(n) && n > 0) return `${n} ימים`;
    return String(value);
  }

  // Diet preferences / תזונה
  if (key === "diet" || key === "diet_type") {
    const dietMap: { [key: string]: string } = {
      none_diet: "אין הגבלות",
      vegetarian: "צמחוני",
      vegan: "טבעוני",
      keto: "קטוגנית",
      paleo: "פליאו",
    };
    return dietMap[String(value)] || String(value);
  }

  // Health statuses / מצבים בריאותיים
  if (key === "health_status") {
    const healthMap: { [key: string]: string } = {
      excellent: VALUES.EXCELLENT_HEALTH,
      good: VALUES.GOOD_HEALTH,
      fair: VALUES.FAIR_HEALTH,
      concerns: VALUES.HEALTH_CONCERNS,
      limitations: VALUES.MEDICAL_LIMITATIONS,
    };
    return healthMap[value] || value;
  }

  // Available equipment / ציוד זמין
  if (key === "available_equipment" && Array.isArray(value)) {
    if (value.length === 0) return PROFILE_SCREEN_TEXTS.MESSAGES.NO_EQUIPMENT;

    const equipmentMap: { [key: string]: string } = {
      // Home equipment
      dumbbells: "משקולות יד",
      resistance_bands: "רצועות התנגדות",
      kettlebell: "קטלבל",
      yoga_mat: "מזרון יוגה",
      pullup_bar: "מתקן מתח",
      foam_roller: "גליל קצף",
      exercise_ball: "כדור פיטנס",
      trx: "TRX",

      // Gym equipment
      free_weights: "משקולות חופשיות",
      cable_machine: "מכונת כבלים",
      squat_rack: "מתקן סקוואט",
      bench_press: "ספסל דחיקה",
      leg_press: "מכונת רגליים",
      lat_pulldown: "מכונת גב",
      smith_machine: "מכונת סמית׳",
      rowing_machine: "מכונת חתירה",
      treadmill: "הליכון",
      bike: "אופני כושר",

      // Legacy/common
      barbell: "מוט ברזל",
      bench: "ספסל",
      mat: "מזרן יוגה",
      bodyweight: "משקל גוף",
      elliptical: "אליפטיקל",
    };

    return value.map((item: string) => equipmentMap[item] || item).join(", ");
  }

  // Default return for unmatched keys / החזרה ברירת מחדל עבור מפתחות לא מזוהים
  return Array.isArray(value) ? value.join(", ") : String(value);
};
