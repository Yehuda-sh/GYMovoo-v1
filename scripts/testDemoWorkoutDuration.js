/**
 * @file testDemoWorkoutDuration.js
 * @brief בדיקת שירות זמני אימון מציאותיים
 * @description דוגמאות לשימוש בשירות החדש
 */

// דוגמת משתמש לבדיקה
const mockUser = {
  id: "demo-user-001",
  questionnaire: {
    experience: "intermediate",
  },
  smartQuestionnaireData: {
    gender: "female",
  },
  activityHistory: {
    workouts: Array.from({ length: 8 }, (_, i) => ({ id: `w${i}` })),
  },
};

// דוגמאות שונות לבדיקה
const testScenarios = [
  {
    name: "אימון מושלם",
    plannedDuration: 60 * 60, // 60 דקות
    plannedSets: 12,
    completedSets: 12,
  },
  {
    name: "אימון חלקי - נגמר הזמן",
    plannedDuration: 60 * 60,
    plannedSets: 15,
    completedSets: 10,
  },
  {
    name: "אימון מהיר בהפסקה",
    plannedDuration: 45 * 60, // 45 דקות
    plannedSets: 8,
    completedSets: 6,
  },
  {
    name: "אימון מורחב - הוספתי תרגילים",
    plannedDuration: 50 * 60,
    plannedSets: 12,
    completedSets: 16,
  },
  {
    name: "אימון קצר - לא היה כוח",
    plannedDuration: 60 * 60,
    plannedSets: 12,
    completedSets: 4,
  },
];

function formatDuration(seconds) {
  const minutes = Math.round(seconds / 60);
  return `${minutes} דקות`;
}

console.log("🔴 DEMO - בדיקת שירות זמני אימון מציאותיים");
console.log("===============================================");

// Note: זה קובץ דוגמאות בלבד - לא לשימוש בפרודקשן
// השירות יופעל אוטומטית במסך ההיסטוריה כשיש __DEV__ = true

testScenarios.forEach((scenario, index) => {
  console.log(`\n${index + 1}. ${scenario.name}`);
  console.log(`   תוכנן: ${formatDuration(scenario.plannedDuration)}`);
  console.log(`   סטים: ${scenario.completedSets}/${scenario.plannedSets}`);
  console.log(
    `   יחס השלמה: ${Math.round((scenario.completedSets / scenario.plannedSets) * 100)}%`
  );

  // הערה: הלוגיקה האמיתית תרוץ במסך ההיסטוריה
  console.log(`   צפוי: זמן מציאותי מותאם לביצוע בפועל`);
});

console.log("\n📝 כיצד זה עובד:");
console.log("- השירות מתחשב בניסיון המשתמש");
console.log("- מתאים לפי מגדר (הבדלים סטטיסטיים עדינים)");
console.log("- מוסיף וריאציה מציאותית (עייפות, זמן, מוטיבציה)");
console.log("- מבטיח זמנים הגיוניים (10 דקות - 2 שעות)");

console.log("\n✅ לראות בפעולה:");
console.log("1. הפעל npm run android");
console.log("2. עבור למסך היסטוריה");
console.log("3. בדוק את הלוגים בקונסול עבור זמני אימון מציאותיים");
