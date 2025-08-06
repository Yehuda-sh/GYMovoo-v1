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
      title: "מתחיל נלהב",
      description: "השלמת את האימון הראשון שלך",
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
    AGE_18_25: "18-25",
    AGE_26_35: "26-35",
    AGE_36_45: "36-45",
    AGE_46_55: "46-55",
    AGE_55_PLUS: "55+",

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
    DURATION_20_30: "20-30 דקות",
    DURATION_30_45: "30-45 דקות",
    DURATION_45_60: "45-60 דקות",
    DURATION_60_90: "60-90 דקות",
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
export const formatQuestionnaireValue = (key: string, value: any): string => {
  if (!value) return PROFILE_SCREEN_TEXTS.MISC.NO_DATA;

  const { VALUES } = PROFILE_SCREEN_TEXTS;

  // Age ranges / טווחי גיל
  if (key === "age_range" || key === "age") {
    const ageMap: { [key: string]: string } = {
      "18-25": VALUES.AGE_18_25,
      "26-35": VALUES.AGE_26_35,
      "36-45": VALUES.AGE_36_45,
      "46-55": VALUES.AGE_46_55,
      "55-plus": VALUES.AGE_55_PLUS,
    };
    return ageMap[value] || value;
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

  // Fitness levels / רמות כושר
  if (key === "fitness_level" || key === "experience_level") {
    const levelMap: { [key: string]: string } = {
      beginner: VALUES.BEGINNER,
      intermediate: VALUES.INTERMEDIATE,
      advanced: VALUES.ADVANCED,
      expert: VALUES.EXPERT,
      competitive: VALUES.COMPETITIVE,
    };
    return levelMap[value] || value;
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
  if (key === "workout_location") {
    const locationMap: { [key: string]: string } = {
      home: VALUES.HOME,
      gym: VALUES.GYM,
      outdoor: VALUES.OUTDOOR,
      mixed: VALUES.MIXED,
    };
    return locationMap[value] || value;
  }

  // Session durations / משכי מפגש
  if (key === "session_duration") {
    const durationMap: { [key: string]: string } = {
      "20-30-min": VALUES.DURATION_20_30,
      "30-45-min": VALUES.DURATION_30_45,
      "45-60-min": VALUES.DURATION_45_60,
      "60-90-min": VALUES.DURATION_60_90,
      "90-plus-min": VALUES.DURATION_90_PLUS,
    };
    return durationMap[value] || value;
  }

  // Workout frequencies / תדירויות אימון
  if (key === "available_days" || key === "workout_frequency") {
    const frequencyMap: { [key: string]: string } = {
      "2-times": VALUES.FREQUENCY_2_TIMES,
      "3-times": VALUES.FREQUENCY_3_TIMES,
      "4-times": VALUES.FREQUENCY_4_TIMES,
      "5-times": VALUES.FREQUENCY_5_TIMES,
      "6-plus-times": VALUES.FREQUENCY_6_PLUS,
    };
    return frequencyMap[value] || value;
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
      dumbbells: "משקולות",
      barbell: "מוט ברזל",
      resistance_bands: "גומיות התנגדות",
      kettlebell: "קטלבל",
      pullup_bar: "מוט מתח",
      exercise_ball: "כדור פילאטיס",
      mat: "מזרן יוגה",
      bench: "ספסל",
      squat_rack: "מתקן סקוואט",
      cable_machine: "מכונת כבלים",
      treadmill: "הליכון",
      elliptical: "אליפטיקל",
      bodyweight: "משקל גוף",
    };

    return value.map((item: string) => equipmentMap[item] || item).join(", ");
  }

  // Default return for unmatched keys / החזרה ברירת מחדל עבור מפתחות לא מזוהים
  return Array.isArray(value) ? value.join(", ") : String(value);
};
