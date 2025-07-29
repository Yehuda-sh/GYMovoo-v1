/**
 * @file src/services/authService.ts
 * @brief שירותי אימות דמה עבור האפליקציה
 *        Mock authentication services for the app
 * @dependencies none
 * @notes כולל יצירת משתמשים רנדומליים לבדיקות
 */

// הפונקציה הישנה scientificUserGenerator נמחקה - משתמשים עכשיו ב-realisticDemoService בלבד

// רשימות לגנרטור הרנדומלי
// Lists for random generator
const firstNamesEnglish = [
  "yossi",
  "michal",
  "danny",
  "shira",
  "omer",
  "noa",
  "itay",
  "ronit",
  "guy",
  "liat",
  "alon",
  "maya",
  "ido",
  "tal",
  "roy",
  "inbal",
  "uri",
  "dana",
  "nir",
  "shani",
  "tomer",
  "yael",
  "asaf",
  "hila",
];

const lastNamesEnglish = [
  "cohen",
  "levi",
  "mizrachi",
  "peretz",
  "biton",
  "avraham",
  "friedman",
  "dahan",
  "amar",
  "bendavid",
  "haim",
  "malka",
  "azoulay",
  "shimon",
  "gabay",
  "nissim",
];

const domains = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "walla.co.il",
];

/**
 * יוצר משתמש רנדומלי עם נתונים אקראיים
 * Creates a random user with random data
 */
const generateRandomUser = () => {
  const firstName =
    firstNamesEnglish[Math.floor(Math.random() * firstNamesEnglish.length)];
  const lastName =
    lastNamesEnglish[Math.floor(Math.random() * lastNamesEnglish.length)];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const randomNum = Math.floor(Math.random() * 9999);

  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNum}@${domain}`;
  const fullName = `${firstName} ${lastName}`;
  const userId = `google_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  // יצירת צבע רנדומלי לאווטאר
  // Generate random color for avatar
  const colors = ["4285F4", "DB4437", "F4B400", "0F9D58", "AB47BC", "FF7043"];
  const bgColor = colors[Math.floor(Math.random() * colors.length)];

  return {
    id: userId,
    email: email,
    name: fullName,
    provider: "google",
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
      fullName
    )}&background=${bgColor}&color=fff&size=200&font-size=0.45`,
    // אפשר להוסיף עוד נתונים רנדומליים
    metadata: {
      createdAt: new Date().toISOString(),
      isRandom: true,
      sessionId: `session_${Date.now()}`,
    },
  };
};

/**
 * מדמה התחברות עם Google - יוצר משתמש רנדומלי חדש בכל פעם
 * Simulates Google Sign In - creates new random user each time
 */
export const fakeGoogleSignIn = async () => {
  // תמיד מחזיר משתמש רנדומלי חדש ללא שאלון
  // Always returns new random user without questionnaire
  console.log("🎲 Generating new random user for Google Sign In");

  // דימוי השהייה של שרת
  // Simulate server delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const randomUser = generateRandomUser();
  console.log("🎲 New random user created:", randomUser.email);

  // משתמש חדש תמיד ללא שאלון
  // New user always without questionnaire
  return {
    ...randomUser,
    questionnaire: undefined,
  };
};

/**
 * מדמה הרשמה עם Google - יוצר משתמש רנדומלי חדש
 * Simulates Google Registration - creates new random user
 */
export const fakeGoogleRegister = async () => {
  console.log("🎲 Generating new random user for Google Registration");

  // דימוי השהייה של שרת
  // Simulate server delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const randomUser = generateRandomUser();
  console.log("🎲 New random user registered:", randomUser.email);

  return {
    ...randomUser,
    questionnaire: undefined,
  };
};

// ייצוא פונקציית הגנרטור לשימוש חיצוני אם נדרש
// Export generator function for external use if needed
export { generateRandomUser };

/**
 * יוצר שאלון רנדומלי עם תשובות הגיוניות
 * Creates random questionnaire with logical answers
 */
const generateRandomQuestionnaire = () => {
  // ציבור גיל רנדומלי בין 18-65
  const age = 18 + Math.floor(Math.random() * 47);

  // מגדר רנדומלי
  const genders = ["male", "female"];
  const gender = genders[Math.floor(Math.random() * genders.length)];

  // גובה ומשקל הגיוניים לפי מגדר
  const height =
    gender === "male"
      ? 165 + Math.floor(Math.random() * 25) // 165-190
      : 155 + Math.floor(Math.random() * 25); // 155-180

  const weight =
    gender === "male"
      ? 60 + Math.floor(Math.random() * 40) // 60-100
      : 50 + Math.floor(Math.random() * 30); // 50-80

  // מטרות כושר אקראיות
  const goals = [
    "weight_loss",
    "muscle_gain",
    "general_fitness",
    "strength",
    "endurance",
  ];
  const goal = goals[Math.floor(Math.random() * goals.length)];

  // רמת ניסיון
  const experiences = ["beginner", "intermediate", "advanced"];
  const experience =
    experiences[Math.floor(Math.random() * experiences.length)];

  // תדירות אימון
  const frequencies = ["2_times", "3_times", "4_times", "5_times", "6_times"];
  const frequency = frequencies[Math.floor(Math.random() * frequencies.length)];

  // משך אימון
  const durations = ["30_min", "45_min", "60_min", "90_min"];
  const duration = durations[Math.floor(Math.random() * durations.length)];

  // מיקום אימון
  const locations = ["home", "gym", "both"];
  const location = locations[Math.floor(Math.random() * locations.length)];

  // ציוד בית (רק אם location כולל בית)
  const homeEquipment =
    location === "home" || location === "both"
      ? ["dumbbells", "yoga_mat", "resistance_bands"]
      : [];

  // ציוד חדר כושר (רק אם location כולל חדר כושר)
  const gymEquipment =
    location === "gym" || location === "both"
      ? ["barbell", "dumbbells", "cable_machine", "bench"]
      : [];

  // דיאטה
  const diets = ["none", "keto", "vegetarian", "vegan", "paleo"];
  const dietType = diets[Math.floor(Math.random() * diets.length)];

  // שעות שינה
  const sleepHours = 6 + Math.floor(Math.random() * 4); // 6-9 שעות

  // רמת לחץ
  const stressLevels = ["low", "medium", "high"];
  const stressLevel =
    stressLevels[Math.floor(Math.random() * stressLevels.length)];

  // העדפת אימון
  const workoutPrefs = ["strength", "cardio", "mixed", "functional"];
  const workoutPreference =
    workoutPrefs[Math.floor(Math.random() * workoutPrefs.length)];

  return {
    // שדות שלב 1 - אימונים (חובה)
    age: age.toString(),
    goal: goal,
    experience: experience,
    location: location,
    frequency: frequency,
    duration: duration,

    // שדות דינמיים לפי location
    ...(location === "home" || location === "both"
      ? { home_equipment: homeEquipment }
      : {}),
    ...(location === "gym" || location === "both"
      ? { gym_access: "full_gym" }
      : {}),

    // שדות שלב 2 - פרופיל (אופציונלי)
    gender: gender,
    height: height,
    weight: weight,
    diet_type: dietType,
    sleep_hours: sleepHours.toString(),
    stress_level: stressLevel,
    water_intake: "2-3 ליטר",

    // שדות נוספים לתאימות לאחור (מפתחות מספריים)
    1: age.toString(),
    2: gender,
    3: height.toString(),
    4: weight.toString(),
    5: goal,
    6: experience,
    7: frequency,
    8: duration,
    9: location,
    10: homeEquipment,
    11: gymEquipment,
    12: dietType,
    13: sleepHours.toString(),
    14: stressLevel,
    15: workoutPreference,
  };
};

// הפונקציה הישנה נמחקה - משתמשים עכשיו ב-realisticDemoService בלבד
