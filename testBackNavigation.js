/**
 * 🧪 בדיקת פונקציונליות חזרה אחורה בשאלון החכם
 * Test back navigation functionality in smart questionnaire
 */

const { NewQuestionnaireManager } = require("./src/data/newSmartQuestionnaire");

function testBackNavigation() {
  console.log("🧪 מתחיל בדיקת פונקציונליות חזרה אחורה בשאלון");

  const manager = new NewQuestionnaireManager();

  // בדיקה 1: ברגע ההתחלה - לא ניתן לחזור
  console.log("\n📋 בדיקה 1: מצב התחלתי");
  console.log("אמור להיות false:", manager.canGoBack());

  const firstQuestion = manager.getCurrentQuestion();
  console.log("שאלה ראשונה:", firstQuestion?.title);

  // בדיקה 2: ענה על השאלה הראשונה
  console.log("\n📋 בדיקה 2: עונה על השאלה הראשונה");
  const firstAnswer = {
    id: "home",
    label: "בבית",
    aiInsight: "אימונים בבית מאפשרים גמישות!",
  };

  manager.answerQuestion("training_location", firstAnswer);
  manager.nextQuestion();

  const secondQuestion = manager.getCurrentQuestion();
  console.log("שאלה שנייה:", secondQuestion?.title);
  console.log("עכשיו אמור להיות true:", manager.canGoBack());

  // בדיקה 3: חזרה אחורה
  console.log("\n📋 בדיקה 3: מבצע חזרה אחורה");
  const didGoBack = manager.previousQuestion();
  console.log("הצליח לחזור:", didGoBack);

  const backToFirst = manager.getCurrentQuestion();
  console.log("חזר לשאלה:", backToFirst?.title);
  console.log("עכשיו אמור להיות false שוב:", manager.canGoBack());

  // בדיקה 4: ענה שוב ובדוק שההיסטוריה נמחקת
  console.log("\n📋 בדיקה 4: עונה שוב ובודק מחיקת היסטוריה");
  manager.answerQuestion("training_location", firstAnswer);
  manager.nextQuestion();

  const secondQuestionAgain = manager.getCurrentQuestion();
  console.log("שאלה שנייה שוב:", secondQuestionAgain?.title);

  // ענה על השאלה השנייה
  const secondAnswer = [
    {
      id: "no_equipment",
      label: "ללא ציוד",
      aiInsight: "אימונים עם משקל גוף יכולים להיות סופר יעילים!",
    },
  ];
  manager.answerQuestion("home_equipment_availability", secondAnswer);
  manager.nextQuestion();

  const thirdQuestion = manager.getCurrentQuestion();
  console.log("שאלה שלישית:", thirdQuestion?.title);

  // בדיקה 5: חזרה מהשלישית לשנייה
  console.log("\n📋 בדיקה 5: חזרה מהשלישית לשנייה");
  const backToSecond = manager.previousQuestion();
  console.log("הצליח לחזור לשנייה:", backToSecond);

  const backToSecondQuestion = manager.getCurrentQuestion();
  console.log("חזר לשאלה:", backToSecondQuestion?.title);

  // בדיקה 6: חזרה עוד פעם לראשונה
  console.log("\n📋 בדיקה 6: חזרה עוד פעם לראשונה");
  const backToFirstAgain = manager.previousQuestion();
  console.log("הצליח לחזור לראשונה:", backToFirstAgain);

  const backToFirstQuestionAgain = manager.getCurrentQuestion();
  console.log("חזר לשאלה:", backToFirstQuestionAgain?.title);
  console.log("עכשיו אמור להיות false:", manager.canGoBack());

  // בדיקה 7: נסיון חזרה נוסף - אמור להיכשל
  console.log("\n📋 בדיקה 7: נסיון חזרה מהשאלה הראשונה (אמור להיכשל)");
  const failedBack = manager.previousQuestion();
  console.log("הצליח לחזור (אמור להיות false):", failedBack);

  console.log("\n✅ בדיקת פונקציונליות חזרה הושלמה!");
}

// הרץ את הבדיקה
testBackNavigation();
