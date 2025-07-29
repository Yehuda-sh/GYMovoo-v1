/**
 * @file src/data/scientificQuestionnaireData.ts
 * @brief שאלון כושר מתקדם מבוסס מדע עם שפה רגישה ומכבדת
 * @dependencies React Navigation, AsyncStorage, theme.ts
 * @notes שאלון מקצועי למאמן AI איכותי עם התחשבות ברגשות המשתמשים
 * @recurring_errors להקפיד על שפה רגישה ולא לפגוע ברגשות המשתמשים
 */

export interface SensitiveQuestionData {
  id: string;
  type:
    | "multiple_choice"
    | "range_select"
    | "scale"
    | "number_input"
    | "multi_select"
    | "slider"
    | "guided_test";
  question: string;
  explanation: string; // למה אנחנו שואלים - חשוב מאוד!
  sensitivity: "low" | "medium" | "high"; // רמת רגישות השאלה
  optional?: boolean; // האם ניתן לדלג
  category: string; // קטגוריה לארגון
  options?: Array<{
    value: string | number;
    label: string;
    description?: string;
  }>;
  validation?: {
    min?: number;
    max?: number;
    required?: boolean;
  };
  privateNote?: string; // הערה פרטית לפיתחים
  scientificBasis?: string; // הבסיס המדעי לשאלה
}

export const scientificQuestionnaire: SensitiveQuestionData[] = [
  // === 🌟 קטגוריה 1: מידע בסיסי בגישה רגישה ===
  {
    id: "age_range",
    category: "basic_info",
    type: "range_select",
    question: "באיזה טווח גיל אתה נמצא?",
    explanation:
      "הגיל עוזר לנו להתאים את עוצמת האימון ולוודא שהתוכנית בטוחה ומתאימה לך. כל גיל מביא יתרונות ייחודיים לכושר! 🌟",
    sensitivity: "medium",
    options: [
      { value: "16-25", label: "16-25", description: "מלא אנרגיה" },
      { value: "26-35", label: "26-35", description: "בשיא הכוחות" },
      { value: "36-45", label: "36-45", description: "בוגר וחכם" },
      { value: "46-55", label: "46-55", description: "מנוסה ויודע מה רוצה" },
      { value: "56-65", label: "56-65", description: "בחוכמת החיים" },
      { value: "65+", label: "65 ומעלה", description: "זהב טהור" },
    ],
    validation: { required: true },
    scientificBasis:
      "גיל משפיע על קצב חילוף החומרים, זמני התאוששות ויכולת בניית שריר",
  },

  {
    id: "gender_identity",
    category: "basic_info",
    type: "multiple_choice",
    question: "איך אתה מגדיר את עצמך?",
    explanation:
      "המידע הזה עוזר לנו להתאים תוכניות אימון בהתאם להבדלים פיזיולוגיים טבעיים. כל גוף יפה וייחודי! ✨",
    sensitivity: "high",
    options: [
      { value: "male", label: "גבר" },
      { value: "female", label: "אישה" },
      { value: "prefer_not_to_say", label: "מעדיף/ה לא לענות" },
    ],
    optional: true,
    privateNote: "המידע נשמר בצורה מוצפנת ומשמש רק לתכנון אימונים",
    scientificBasis:
      "הבדלים הורמונליים ופיזיולוגיים משפיעים על בניית שריר וחילוף חומרים",
  },

  {
    id: "body_acceptance",
    category: "basic_info",
    type: "slider",
    question: "איך אתה מרגיש עם הגוף שלך היום?",
    explanation:
      'אין גוף "מושלם" - יש רק גוף שלך, והוא מדהים כמו שהוא! אנחנו כאן לעזור לך להרגיש טוב יותר עם עצמך 💚',
    sensitivity: "high",
    options: [
      { value: 1, label: "רוצה לשפר הרבה" },
      { value: 2, label: "רוצה שיפורים" },
      { value: 3, label: "בסדר, יכול להיות יותר טוב" },
      { value: 4, label: "מרוצה בסך הכל" },
      { value: 5, label: "אוהב את הגוף שלי!" },
    ],
    optional: true,
    scientificBasis: "חשיבה חיובית על הגוף משפרת מוטיבציה ועקביות באימונים",
  },

  // === 💪 קטגוריה 2: רקע כושר בגישה מעודדת ===
  {
    id: "fitness_experience",
    category: "fitness_background",
    type: "multiple_choice",
    question: "איך היית מתאר את הרקע שלך בכושר?",
    explanation:
      'כל התחלה היא מושלמת! אין "מאוחר מדי" או "מוקדם מדי" - יש רק את הזמן הנכון שלך להתחיל 🚀',
    sensitivity: "medium",
    options: [
      {
        value: "complete_beginner",
        label: "מתחיל לחלוטין",
        description: "וזה נהדר! כולנו התחלנו כאן",
      },
      {
        value: "some_experience",
        label: "יש לי קצת ניסיון",
        description: "אתה כבר בדרך!",
      },
      {
        value: "intermediate",
        label: "מתאמן בקביעות",
        description: "מעולה, בואי נתקדם יותר",
      },
      {
        value: "advanced",
        label: "מתאמן שנים",
        description: "כל הכבוד על העקביות!",
      },
      {
        value: "athlete",
        label: "ספורטאי מקצועי",
        description: "אתה השראה לאחרים!",
      },
    ],
    validation: { required: true },
    scientificBasis:
      "רמת הניסיון קובעת נפח אימון, מורכבות תרגילים וקצב התקדמות",
  },

  {
    id: "current_activity",
    category: "fitness_background",
    type: "multiple_choice",
    question: "איך נראה היום-יום הפעיל שלך?",
    explanation:
      "כל תנועה נחשבת! גם להעביר ילדים, לטפס מדרגות או לעבוד בגינה - הכל תורם לכושר שלך 🌱",
    sensitivity: "low",
    options: [
      {
        value: "sedentary",
        label: "בעיקר יושב",
        description: "בואי נוסיף קצת תנועה בהדרגה",
      },
      {
        value: "light_active",
        label: "קצת פעיל",
        description: "יסוד מעולה לבנות עליו",
      },
      {
        value: "moderately_active",
        label: "פעיל בינוני",
        description: "רמה טובה, בואי נשפר עוד",
      },
      {
        value: "very_active",
        label: "מאוד פעיל",
        description: "אתה דוגמה לחיקוי!",
      },
      {
        value: "extremely_active",
        label: "פעיל ברמה גבוהה",
        description: "אתה מכונת אנרגיה!",
      },
    ],
    validation: { required: true },
    scientificBasis:
      "רמת הפעילות הבסיסית קובעת את נקודת ההתחלה ואת קצב העלאת העומס",
  },

  // === 🎯 קטגוריה 3: מטרות עם גישה חיובית ===
  {
    id: "primary_goal",
    category: "goals",
    type: "multiple_choice",
    question: "מה הדבר הכי חשוב שאתה רוצה להשיג?",
    explanation:
      'המטרה שלך היא המנוע שלך! אין מטרה "קטנה" או "גדולה" - יש רק את המטרה שחשובה לך ✨',
    sensitivity: "medium",
    options: [
      {
        value: "feel_stronger",
        label: "להרגיש חזק יותר",
        description: "כוח פנימי וחיצוני",
      },
      {
        value: "improve_health",
        label: "לשפר את הבריאות",
        description: "ההשקעה הכי חכמה שיש",
      },
      {
        value: "lose_weight",
        label: "לרדת במשקל",
        description: "בבריאות ובהנאה",
      },
      {
        value: "build_muscle",
        label: "לבנות שריר",
        description: "לפסל את הגוף שלך",
      },
      {
        value: "increase_energy",
        label: "להגביר אנרגיה",
        description: "להתעורר עם חיוך",
      },
      {
        value: "reduce_stress",
        label: "להפחית מתח",
        description: "הגוף והנפש מחוברים",
      },
      {
        value: "improve_posture",
        label: "לשפר יציבה",
        description: "לעמוד גאה וזקוף",
      },
      {
        value: "sport_performance",
        label: "לשפר ביצועים בספורט",
        description: "להביא את המשחק לרמה הבאה",
      },
    ],
    validation: { required: true },
    scientificBasis:
      "המטרה העיקרית קובעת את סוג האימון, טווחי חזרות ועוצמת הפעילות",
  },

  {
    id: "body_focus_areas",
    category: "goals",
    type: "multi_select",
    question: "באילו אזורים בגוף תרצה להתמקד?",
    explanation:
      "כל חלק בגוף שלך ראוי לתשומת לב! בחר את מה שחשוב לך - אנחנו נדאג לשאר 🎯",
    sensitivity: "medium",
    options: [
      {
        value: "upper_body",
        label: "חלק עליון",
        description: "חזה, כתפיים, זרועות וגב",
      },
      {
        value: "core",
        label: "שרירי ליבה",
        description: "בטן, גב תחתון ויציבות",
      },
      {
        value: "lower_body",
        label: "חלק תחתון",
        description: "רגליים, ישבן ועגלים",
      },
      {
        value: "full_body",
        label: "כל הגוף",
        description: "גישה מאוזנת לכל השרירים",
      },
      {
        value: "flexibility",
        label: "גמישות",
        description: "טווחי תנועה וזרימה",
      },
      {
        value: "cardio",
        label: "כושר אירובי",
        description: "לב, ריאות וסיבולת",
      },
    ],
    validation: { required: true },
    scientificBasis:
      "התמקדות באזורים ספציפיים מאפשרת תכנון מדויק של תרגילים ונפח אימון",
  },

  // === ⏰ קטגוריה 4: זמינות בגישה גמישה ===
  {
    id: "available_days",
    category: "availability",
    type: "multiple_choice",
    question: "כמה ימים בשבוע אתה יכול להקדיש לאימון?",
    explanation:
      "איכות עדיפה על כמות! גם יום אחד בשבוע הוא ניצחון, ואנחנו נעזור לך להפיק ממנו את המקסימום 🌟",
    sensitivity: "low",
    options: [
      { value: 1, label: "יום אחד", description: "מושלם להתחלה!" },
      { value: 2, label: "יומיים", description: "בסיס מצוין לבניית הרגל" },
      { value: 3, label: "שלושה ימים", description: "הסטנדרט הזהב!" },
      { value: 4, label: "ארבעה ימים", description: "מחויבות מעולה" },
      {
        value: 5,
        label: "חמישה ימים",
        description: "אתה בדרך להיות מכור לכושר!",
      },
      { value: 6, label: "שישה ימים", description: "דדיקציה ברמה גבוהה" },
    ],
    validation: { required: true },
    scientificBasis:
      "תדירות האימון קובעת את חלוקת קבוצות השרירים וזמני ההתאוששות",
  },

  {
    id: "session_duration",
    category: "availability",
    type: "multiple_choice",
    question: "כמה זמן אתה יכול להקדיש לאימון בכל פעם?",
    explanation:
      "כל דקה שמקדישים לעצמך היא דקה חכמה! אפילו 15 דקות יכולות לעשות פלאים אם עושים את זה נכון ⏰",
    sensitivity: "low",
    options: [
      { value: 15, label: "15 דקות", description: "מהיר ויעיל!" },
      { value: 30, label: "30 דקות", description: "זמן מושלם לאימון איכותי" },
      { value: 45, label: "45 דקות", description: "מספיק זמן לאימון מקיף" },
      { value: 60, label: "שעה", description: "הסטנדרט הקלאסי" },
      { value: 75, label: "1.25 שעות", description: "זמן נדיר לאימון מפורט" },
      { value: 90, label: "1.5 שעות", description: "יוקרה של זמן!" },
    ],
    validation: { required: true },
    scientificBasis: "משך האימון קובע את מספר התרגילים, הסטים וזמני המנוחה",
  },

  // === 🏠 קטגוריה 5: ציוד ומקום בגישה מעשית ===
  {
    id: "workout_location",
    category: "equipment",
    type: "multiple_choice",
    question: "איפה אתה מעדיף להתאמן?",
    explanation:
      "כל מקום יכול להיות חדר כושר! הדבר הכי חשוב הוא שתרגיש בנוח ומוכן לתת את המקסימום 🏠💪",
    sensitivity: "low",
    options: [
      {
        value: "home_only",
        label: "רק בבית",
        description: "נוחות וגמישות מלאה",
      },
      {
        value: "gym_only",
        label: "רק בחדר כושר",
        description: "ציוד מקצועי ואווירה",
      },
      {
        value: "both",
        label: "גם בבית וגם בחדר כושר",
        description: "הגמישות המקסימלית",
      },
      {
        value: "outdoor",
        label: "בחוץ (פארק, חוף)",
        description: "טבע ואוויר צח",
      },
      {
        value: "flexible",
        label: "גמיש - כל מקום שמתאים",
        description: "מתאמן בכל מקום!",
      },
    ],
    validation: { required: true },
    scientificBasis: "מיקום האימון קובע את סוג התרגילים והציוד הזמין",
  },

  {
    id: "available_equipment",
    category: "equipment",
    type: "multi_select",
    question: "איזה ציוד יש לך גישה אליו?",
    explanation:
      "הגוף שלך הוא הכלי הכי חשוב! כל שאר הציוד הוא רק בונוס. אפילו ללא ציוד אפשר להשיג תוצאות מדהימות 🔥",
    sensitivity: "low",
    options: [
      {
        value: "bodyweight",
        label: "משקל הגוף בלבד",
        description: "הכלי הכי מגוון שיש!",
      },
      { value: "dumbbells", label: "משקולות", description: "קלאסיות ויעילות" },
      {
        value: "resistance_bands",
        label: "גומיות התנגדות",
        description: "קטנות וחזקות",
      },
      {
        value: "kettlebell",
        label: "קטלבל",
        description: "תרגיל אחד = כל הגוף",
      },
      { value: "barbell", label: "מטה", description: "מלך הכלים לכוח" },
      {
        value: "pull_up_bar",
        label: "מתקן מתחים",
        description: "החלק העליון יאהב אותך",
      },
      {
        value: "full_gym",
        label: "חדר כושר מלא",
        description: "כל האפשרויות פתוחות",
      },
    ],
    validation: { required: true },
    scientificBasis: "סוג הציוד קובע את התרגילים הזמינים ואת דרכי ההתקדמות",
  },

  // === 🏥 קטגוריה 6: בריאות ומגבלות בגישה רגישה ===
  {
    id: "health_status",
    category: "health",
    type: "multiple_choice",
    question: "איך המצב הבריאותי הכללי שלך?",
    explanation:
      'אין "מצב בריאותי מושלם" - יש רק את המצב שלך, ואנחנו נמצא את הדרך הכי טובה לעבוד איתו 💚',
    sensitivity: "high",
    options: [
      { value: "excellent", label: "מעולה", description: "מרגיש נהדר!" },
      { value: "good", label: "טוב", description: "בסדר גמור" },
      { value: "fair", label: "בסדר", description: "יכול להיות יותר טוב" },
      {
        value: "some_issues",
        label: "יש כמה דברים קטנים",
        description: "נעבוד בזהירות",
      },
      {
        value: "managing_conditions",
        label: "מתמודד עם מצבים רפואיים",
        description: "אתה גיבור!",
      },
    ],
    optional: true,
    scientificBasis:
      "מצב בריאותי כללי קובע עוצמת האימון ואמצעי הזהירות הנדרשים",
  },

  {
    id: "previous_injuries",
    category: "health",
    type: "multi_select",
    question: "האם היו לך פציעות או כאבים בעבר?",
    explanation:
      "פציעות הן חלק מהחיים - החשוב הוא ללמוד מהן ולא לחזור עליהן. אנחנו נוודא שהאימון יחזק אותך 🛡️",
    sensitivity: "high",
    options: [
      { value: "none", label: "אין פציעות", description: "נשמור על זה ככה!" },
      { value: "back", label: "גב", description: "נחזק את השרירים התומכים" },
      { value: "knee", label: "ברך", description: "נעבוד על יציבות ועוצמה" },
      { value: "shoulder", label: "כתף", description: "נשפר את הניידות והכוח" },
      { value: "neck", label: "צוואר", description: "נתמקד ביציבה" },
      { value: "wrist", label: "שורש כף יד", description: "נמצא חלופות נוחות" },
      { value: "ankle", label: "קרסול", description: "נחזק ונייצב" },
      { value: "other", label: "אחר", description: "נתייעץ ונתאים" },
    ],
    optional: true,
    scientificBasis:
      "היסטוריית פציעות חיונית למניעת פציעות חוזרות ותכנון אימון בטוח",
  },

  // === 😊 קטגוריה 7: מוטיבציה ואישיות ===
  {
    id: "motivation_type",
    category: "psychology",
    type: "multiple_choice",
    question: "מה הכי מעורר אותך להתאמן?",
    explanation:
      'כל אחד מונע על ידי דברים שונים - ואין דרך "נכונה" או "שגויה". בואי נמצא את מה שעובד בשבילך! 🔥',
    sensitivity: "low",
    options: [
      { value: "health", label: "בריאות", description: "להרגיש טוב ובריא" },
      {
        value: "appearance",
        label: "מראה",
        description: "להיראות הכי טוב שאני יכול",
      },
      { value: "strength", label: "כוח", description: "להרגיש חזק וממלא" },
      { value: "energy", label: "אנרגיה", description: "להתעורר עם חיוך" },
      {
        value: "stress_relief",
        label: "הפגת מתח",
        description: "לשחרר את הלחצים",
      },
      { value: "social", label: "חברתי", description: "להכיר אנשים ולהשתתף" },
      { value: "competition", label: "תחרות", description: "לנצח ולהתעלות" },
      { value: "routine", label: "שגרה", description: "לבנות הרגלים טובים" },
    ],
    validation: { required: true },
    scientificBasis:
      "סוג המוטיבציה משפיע על עיצוב התוכנית ואלמנטים של גימיפיקציה",
  },

  {
    id: "workout_style_preference",
    category: "psychology",
    type: "multiple_choice",
    question: "איזה סוג אימון נשמע לך הכי מעניין?",
    explanation:
      "הנאה היא המפתח להצלחה! אם תאהב את האימון, תתמיד בו - וזה מה שבאמת משנה 🎵",
    sensitivity: "low",
    options: [
      {
        value: "steady_consistent",
        label: "יציב ועקבי",
        description: "אותו דבר, אבל כל פעם קצת יותר טוב",
      },
      {
        value: "varied_fun",
        label: "מגוון ומהנה",
        description: "משהו חדש בכל פעם",
      },
      {
        value: "challenging_intense",
        label: "אתגרי ואינטנסיבי",
        description: "לדחוף את הגבולות",
      },
      {
        value: "quick_efficient",
        label: "מהיר ויעיל",
        description: "מקסימום תוצאות במינימום זמן",
      },
      {
        value: "relaxed_mindful",
        label: "רגוע ומודע",
        description: "חיבור בין גוף לנפש",
      },
    ],
    validation: { required: true },
    scientificBasis: "העדפת סגנון אימון משפיעה על עיצוב הסשן ועל הסיכוי להתמדה",
  },

  // === 📊 קטגוריה 8: בדיקות כושר בסיסיות (אופציונלי) ===
  {
    id: "fitness_test_interest",
    category: "fitness_tests",
    type: "multiple_choice",
    question: "האם תרצה לעשות כמה בדיקות כושר פשוטות?",
    explanation:
      "זה אופציונלי לחלוטין! הבדיקות עוזרות לנו להתאים את התוכנית בצורה מדויקת יותר, אבל אפשר גם בלעדיהן 📏",
    sensitivity: "medium",
    options: [
      {
        value: "yes_detailed",
        label: "כן, בואי נעשה את זה!",
        description: "אני רוצה תוכנית מדויקת למה שאני מסוגל",
      },
      {
        value: "yes_simple",
        label: "בסדר, משהו פשוט",
        description: "כמה דברים קטנים בלבד",
      },
      {
        value: "maybe_later",
        label: "אולי אחר כך",
        description: "בואי נתחיל, נוסיף בדיקות מאוחר יותר",
      },
      {
        value: "no_thanks",
        label: "לא תודה",
        description: "אתה יודע מה טוב לי",
      },
    ],
    optional: true,
    scientificBasis:
      "בדיקות כושר מאפשרות תכנון מדויק של עומסי אימון ומעקב התקדמות",
  },
];

// קטגוריות לארגון השאלון
export const questionnaireCategories = {
  basic_info: {
    title: "בואי נכיר 👋",
    description: "כמה פרטים בסיסיים עליך",
    icon: "account-circle",
  },
  fitness_background: {
    title: "הרקע שלך בכושר 💪",
    description: "מאיפה אתה מגיע ואיפה אתה עכשיו",
    icon: "history",
  },
  goals: {
    title: "המטרות שלך 🎯",
    description: "לאן אתה רוצה להגיע",
    icon: "target",
  },
  availability: {
    title: "הזמן שלך ⏰",
    description: "כמה זמן יש לך לעצמך",
    icon: "clock-outline",
  },
  equipment: {
    title: "הציוד והמקום 🏠",
    description: "איפה ועם מה אתה מתאמן",
    icon: "dumbbell",
  },
  health: {
    title: "הבריאות שלך 🏥",
    description: "בואי נוודא שהכל בטוח ומתאים",
    icon: "heart-pulse",
  },
  psychology: {
    title: "מה מניע אותך 🔥",
    description: "בואי נמצא את מה שעובד בשבילך",
    icon: "lightning-bolt",
  },
  fitness_tests: {
    title: "בדיקות כושר 📊",
    description: "אופציונלי - לתוכנית מדויקת יותר",
    icon: "clipboard-check",
  },
};

// הודעות מעודדות בין השאלות
export const encouragingMessages = [
  "אתה עושה נהדר! 🌟",
  "כל תשובה מקרבת אותנו לתוכנית המושלמת שלך 🎯",
  "אהבנו את התשובה הזאת! 💪",
  "עוד קצת ונגיע לקו הסיום! 🏃‍♂️",
  "מדהים איך אתה מכיר את עצמך! 🧠",
  "התוכנית שלך מתחילה להיות מעניינת! ✨",
];

// הודעת סיום חיובית
export const completionMessage = {
  title: "וואו! סיימנו! 🎉",
  message:
    "זה היה מדהים! עכשיו אנחנו מכירים אותך טוב מספיק כדי לבנות תוכנית שתהיה בדיוק בשבילך. מוכן להתחיل את המסע שלך? 🚀",
  buttonText: "בואי נתחיל!",
};
