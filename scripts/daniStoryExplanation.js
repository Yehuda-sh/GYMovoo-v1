/**
 * סיפור המעבר הלוגי של דני כהן - 6 חודשים של התפתחות
 * מסביר איך הוא עבר מאימונים בבית לחדר כושר ובין תוכניות
 */

console.warn("📖 סיפור המעבר של דני כהן - 6 חודשים של התפתחות\n");
console.warn("=".repeat(60));

// ==========================================
// 📅 Timeline מפורט עם החלטות אמיתיות
// ==========================================

const DANI_JOURNEY = {
  // 🏠 Phase 1: התחלה בבית (ימים 180-121)
  phase1_home: {
    period: "פברואר - אפריל 2025",
    location: "אימונים בבית",
    motivation: "התחלת דרך חדשה",
    story: [
      "🎯 יום 180: דני החליט להתחיל להתאמן אחרי שנים של חוסר פעילות",
      "💰 יום 180: לא רצה להשקיע בחדר כושר עד שיראה שהוא מתמיד",
      "🏠 יום 180: קנה זוג דמבלים של 12 ק״ג והתחיל בבית",
      "📱 יום 180: הוריד את האפליקציה וענה על השאלון הראשון",
      "💎 יום 173: אחרי שבוע ראה שהוא מתמיד - עבר למנוי פרימיום",
      "",
      "🔄 שבוע 2-4: התרגל לשגרת 3 אימונים בשבוע",
      "💪 שבוע 5-8: התחיל להרגיש שהדמבלים קלים מדי",
      "📈 יום 120: אחרי חודשיים - ראה תוצאות! עלה ב-2 ק״ג משקל גוף",
    ],
    equipment_evolution: {
      start: ["dumbbells_12kg"],
      end: ["dumbbells_12kg", "resistance_bands"], // הוסיף גומיות
    },
    key_moment: "יום 120: החליט שהגיע הזמן לחדר כושר - הדמבלים כבר לא מספיקים",
  },

  // 🏋️ Phase 2: מעבר לחדר כושר (ימים 120-61)
  phase2_gym_transition: {
    period: "אפריל - יוני 2025",
    location: "חדר כושר מקומי",
    motivation: "רצה אתגרים יותר גדולים",
    story: [
      "🏋️ יום 119: נרשם לחדר כושר ליד הבית (GYM FIT)",
      "😰 יום 118: היה לחוץ - לא ידע איך להשתמש בציוד",
      "👨‍🏫 יום 117: קיבל אימון הכנה מהמדריך - למד טכניקות בסיסיות",
      "🔧 יום 116: עדכן את השאלון - הוסיף barbell, bench, lat_pulldown",
      "📋 יום 115: האפליקציה יצרה לו תוכנית חדשה מותאמת לחדר כושר",
      "",
      "💡 שבוע 1-2: התמקד בלמידת טכניקות נכונות",
      "⚖️ שבוע 3-4: התחיל להוסיף משקלים בהדרגתיות",
      "🎯 שבוע 5-8: ראה קפיצת מדרגה בכוח והחליט להוסיף יום רביעי",
      "📈 יום 90: עדכן שאלון שוב - עבר ל-4 ימים, הוסיף מטרת 'strength'",
    ],
    equipment_evolution: {
      start: ["dumbbells"],
      end: ["dumbbells", "barbell", "bench", "lat_pulldown", "cable_machine"],
    },
    key_moment: "יום 90: התאהב בהרחקות מוט - החליט להתמקד יותר בכוח",
  },

  // 💪 Phase 3: מיקוד בכוח (ימים 61-היום)
  phase3_strength_focus: {
    period: "יוני - אוגוסט 2025",
    location: "אותו חדר כושר + ציוד מתקדם",
    motivation: "חיפש PRs ואתגרי כוח",
    story: [
      "🏆 יום 60: הצליח להרים 70 ק״ג בהרחקות - הרגיש כמו גיבור!",
      "🎯 יום 59: החליט להתמקד באימוני כוח עם פחות חזרות, יותר משקל",
      "📋 יום 58: עדכן במערכת שהוא רוצה תוכנית 'strength-focused'",
      "🔧 יום 57: גילה squat rack וזה שינה לו את החיים",
      "",
      "💪 שבוע 1-4: התמחות בתרגילי הכוח הבסיסיים (Big 3)",
      "📈 שבוע 5-8: PRs כמעט כל שבוע - התמכרות לשיפור ביצועים",
      "🏅 השבוע: הגיע ל-126 ק״ג בהרחקות - גאה בדרך שעבר",
    ],
    equipment_evolution: {
      start: ["dumbbells", "barbell", "bench", "lat_pulldown"],
      end: [
        "dumbbells",
        "barbell",
        "bench",
        "squat_rack",
        "leg_press",
        "pullup_bar",
      ],
    },
    key_moment: "השבוע: מתכנן להתחיל תוכנית powerlifting מקצועית",
  },
};

// ==========================================
// 🎭 הסיבות האמיתיות למעברים
// ==========================================

const TRANSITION_REASONS = {
  home_to_gym: {
    trigger: "הדמבלים של 12 ק״ג כבר לא מספיקים",
    emotional: "רצה להרגיש שהוא מתקדם באמת",
    practical: "ראה שהוא מתמיד במשך 2 חודשים",
    financial: "החליט להשקיע בעצמו",
    confidence: "חש בטוח מספיק להיכנס לחדר כושר",
  },

  basic_to_strength: {
    trigger: "הצליח להרים 70 ק״ג בהרחקות בפעם הראשונה",
    emotional: "התאהב בתחושת הכוח וההישג",
    practical: "רצה אתגרים יותר גדולים",
    social: "ראה אנשים בחדר כושר עושים PRs",
    goal_shift: "המטרה עברה מ'להיראות טוב' ל'להיות חזק'",
  },
};

// ==========================================
// 📱 איך המעברים קרו במערכת
// ==========================================

const SYSTEM_CHANGES = {
  equipment_updates: [
    {
      day: 180,
      action: "רישום ראשוני",
      equipment: ["dumbbells"],
      reason: "זה מה שיש לו בבית",
    },
    {
      day: 116,
      action: "עדכון ציוד אחרי רישום לחדר כושר",
      equipment: ["dumbbells", "barbell", "bench"],
      reason: "למד להשתמש בציוד החדש",
    },
    {
      day: 90,
      action: "הוספת ציוד מתקדם",
      equipment: [
        "dumbbells",
        "barbell",
        "bench",
        "lat_pulldown",
        "cable_machine",
      ],
      reason: "התנסה בעוד מכשירים",
    },
    {
      day: 57,
      action: "ציוד מקצועי לכוח",
      equipment: [
        "dumbbells",
        "barbell",
        "bench",
        "squat_rack",
        "leg_press",
        "pullup_bar",
      ],
      reason: "מעבר לאימוני כוח רציניים",
    },
  ],

  goal_evolution: [
    {
      day: 180,
      goals: ["muscle_gain"],
      reason: "רק רצה להיראות טוב יותר",
    },
    {
      day: 90,
      goals: ["muscle_gain", "strength"],
      reason: "גילה שהוא אוהב להיות חזק, לא רק להיראות",
    },
  ],

  schedule_changes: [
    {
      day: 180,
      days: ["sunday", "tuesday", "thursday"],
      duration: 60,
      reason: "התחלה זהירה, 3 ימים בשבוע",
    },
    {
      day: 90,
      days: ["sunday", "tuesday", "thursday", "saturday"],
      duration: 75,
      reason: "הרגיש שהוא יכול יותר, הוסיף יום רביעי",
    },
  ],
};

// ==========================================
// 💭 המחשבות של דני במעברים
// ==========================================

const DANI_THOUGHTS = {
  before_gym: [
    "אני לא יודע אם אני מוכן לחדר כושר...",
    "מה אם אני אראה חלש?",
    "אבל הדמבלים האלה כבר לא מספיקים לי",
    "בואו ננסה - הכי גרוע שיכול לקרות זה שאחזור הביתה",
  ],

  first_gym_week: [
    "וואו, יש פה כל כך הרבה ציוד!",
    "אני לא יודע איך להשתמש בחצי מהמכונות",
    "כולם פה נראים כל כך מקצועיים",
    "אבל המדריך נחמד ועזר לי להתחיל",
  ],

  strength_discovery: [
    "רגע... הרמתי 70 ק״ג! זה אמיתי?!",
    "אני מרגיש כמו סופרמן",
    "אני רוצה לראות עד כמה אני יכול להגיע",
    "זה כבר לא רק ספורט - זה אהבה",
  ],
};

// ==========================================
// 📊 הצגת הסיפור המלא
// ==========================================

function displayDaniStory() {
  console.warn("🎬 הסיפור המלא של דני כהן:\n");

  Object.entries(DANI_JOURNEY).forEach(([phase, data]) => {
    console.warn(`📅 ${data.period} - ${data.location}`);
    console.warn(`💡 מוטיבציה: ${data.motivation}`);
    console.warn("---");

    data.story.forEach((line) => {
      if (line) console.warn(`   ${line}`);
      else console.warn("");
    });

    console.warn(`🔑 רגע מפתח: ${data.key_moment}`);
    console.warn("");
  });

  console.warn("🔄 סיבות למעברים:\n");

  console.warn("🏠➡️🏋️ מעבר מבית לחדר כושר:");
  Object.entries(TRANSITION_REASONS.home_to_gym).forEach(([key, reason]) => {
    console.warn(`   ${key}: ${reason}`);
  });
  console.warn("");

  console.warn("💪➡️🏆 מעבר לאימוני כוח:");
  Object.entries(TRANSITION_REASONS.basic_to_strength).forEach(
    ([key, reason]) => {
      console.warn(`   ${key}: ${reason}`);
    }
  );
  console.warn("");

  console.warn("📱 איך המערכת התעדכנה:\n");

  console.warn("🔧 עדכוני ציוד:");
  SYSTEM_CHANGES.equipment_updates.forEach((update) => {
    console.warn(`   יום ${update.day}: ${update.action}`);
    console.warn(`     ציוד: ${update.equipment.join(", ")}`);
    console.warn(`     סיבה: ${update.reason}`);
  });
  console.warn("");

  console.warn("🎯 שינוי מטרות:");
  SYSTEM_CHANGES.goal_evolution.forEach((change) => {
    console.warn(`   יום ${change.day}: ${change.goals.join(", ")}`);
    console.warn(`     סיבה: ${change.reason}`);
  });
  console.warn("");

  console.warn("📅 שינוי לוח זמנים:");
  SYSTEM_CHANGES.schedule_changes.forEach((change) => {
    console.warn(
      `   יום ${change.day}: ${change.days.length} ימים, ${change.duration} דקות`
    );
    console.warn(`     סיבה: ${change.reason}`);
  });
  console.warn("");

  console.warn("💭 המחשבות של דני במעברים:\n");

  console.warn("🤔 לפני החדר כושר:");
  DANI_THOUGHTS.before_gym.forEach((thought) =>
    console.warn(`   "${thought}"`)
  );
  console.warn("");

  console.warn("😰 השבוע הראשון בחדר כושר:");
  DANI_THOUGHTS.first_gym_week.forEach((thought) =>
    console.warn(`   "${thought}"`)
  );
  console.warn("");

  console.warn("💪 גילוי אהבת הכוח:");
  DANI_THOUGHTS.strength_discovery.forEach((thought) =>
    console.warn(`   "${thought}"`)
  );
  console.warn("");
}

// ==========================================
// 🎯 למה זה הגיוני
// ==========================================

function explainLogic() {
  console.warn("🧠 למה הסיפור הזה הגיוני?\n");
  console.warn("=".repeat(40));

  const logicalReasons = [
    "🏠 התחלה בבית - טבעי למתחילים שלא בטוחים באמינות שלהם",
    "💰 השקעה הדרגתית - לא רוצים להוציא כסף על חדר כושר אם לא מתמידים",
    "📈 צמיחה הדרגתית - כל מעבר מבוסס על הישג קודם",
    "🎯 שינוי מטרות - טבעי שאחרי התקדמות רוצים אתגרים חדשים",
    "🔧 הוספת ציוד - רק אחרי שלומדים להשתמש בציוד קיים",
    "⏰ הוספת זמן - רק אחרי שהשגרה נקבעה",
    "💪 מיקוד בכוח - קורה הרבה אחרי 'PR breakthrough moment'",
  ];

  logicalReasons.forEach((reason) => console.warn(`✅ ${reason}`));

  console.warn("\n🔄 הדפוס הנפוץ:");
  console.warn("   בית → בטחון עצמי → חדר כושר → התנסות → התמחות");
  console.warn("   זה הדפוס של 80% מהמתחילים המצליחים");
}

// הרצה
displayDaniStory();
explainLogic();

console.warn("\n" + "=".repeat(60));
console.warn("🎭 עכשיו הסיפור של דני הוא סיפור אמיתי ומלא!");
console.warn("✅ כל מעבר לוגי ומבוסס על הישגים אמיתיים");
console.warn("✅ ההתפתחות הדרגתית משקפת מסע אמיתי");
console.warn("✅ המערכת מתעדכנת בהתאם להתקדמות המשתמש");
console.warn("=".repeat(60));
