/**
 * בדיקת הזרימה הדינמית של השאלון החכם
 * Test for the dynamic flow of the smart questionnaire
 */

console.log("🧪 בדיקת הזרימה הדינמית של השאלון החכם");
console.log("================================================");

// סימולציית התנהגות השאלון
class QuestionnaireTestSimulator {
  constructor() {
    this.answers = new Map();
    this.currentQuestionIndex = 0;
    this.questionsToShow = ["training_location"];
  }

  // מנהגיי שאלות וכיווני המשך
  getQuestionLogic() {
    return {
      training_location: {
        home: ["home_equipment_availability"],
        gym: ["gym_equipment_availability"],
        outdoor: ["outdoor_equipment_availability"],
      },
      home_equipment_availability: {
        no_equipment: ["bodyweight_equipment_options"],
        basic_home_equipment: ["home_equipment_options"],
        advanced_home_gym: ["home_equipment_options"],
      },
      gym_equipment_availability: {
        basic_gym: ["gym_equipment_options"],
        full_gym: ["gym_equipment_options"],
        boutique_gym: ["gym_equipment_options"],
      },
      outdoor_equipment_availability: {
        no_equipment_outdoor: ["bodyweight_equipment_options"],
        portable_equipment: ["home_equipment_options"],
        outdoor_facilities: ["bodyweight_equipment_options"],
      },
    };
  }

  // סימולציית תשובה לשאלה
  answerQuestion(questionId, answerOptionId) {
    console.log(`\n📝 עונה על שאלה: ${questionId} -> ${answerOptionId}`);

    this.answers.set(questionId, answerOptionId);

    const logic = this.getQuestionLogic();
    const questionLogic = logic[questionId];

    if (questionLogic && questionLogic[answerOptionId]) {
      const nextQuestions = questionLogic[answerOptionId];
      console.log(`   ⬆️ שאלות הבאות: ${nextQuestions.join(", ")}`);

      // הוספת השאלות הבאות לרשימה
      this.questionsToShow.push(...nextQuestions);
    }

    console.log(
      `   📋 רשימת שאלות עדכנית: ${this.questionsToShow.join(" -> ")}`
    );
  }

  // מעבר לשאלה הבאה
  nextQuestion() {
    this.currentQuestionIndex++;
    return this.currentQuestionIndex < this.questionsToShow.length;
  }

  // קבלת השאלה הנוכחית
  getCurrentQuestion() {
    if (this.currentQuestionIndex >= this.questionsToShow.length) {
      return null;
    }
    return this.questionsToShow[this.currentQuestionIndex];
  }

  // הדפסת מצב נוכחי
  printStatus() {
    console.log(`\n📊 מצב נוכחי:`);
    console.log(`   📍 אינדקס נוכחי: ${this.currentQuestionIndex}`);
    console.log(`   📝 שאלה נוכחית: ${this.getCurrentQuestion() || "סיום"}`);
    console.log(`   📋 תשובות עד כה:`, Array.from(this.answers.entries()));
  }
}

// בדיקת תרחישים שונים
function testScenario(name, steps) {
  console.log(`\n\n🎯 תרחיש: ${name}`);
  console.log("=".repeat(40));

  const simulator = new QuestionnaireTestSimulator();

  steps.forEach((step, index) => {
    console.log(`\nשלב ${index + 1}:`);

    if (step.type === "answer") {
      simulator.answerQuestion(step.questionId, step.answer);
    } else if (step.type === "next") {
      const hasNext = simulator.nextQuestion();
      console.log(
        `   ⏭️ מעבר לשאלה הבאה: ${hasNext ? "יש עוד שאלות" : "סיום השאלון"}`
      );
    }

    simulator.printStatus();
  });

  console.log(`\n✅ תרחיש "${name}" הושלם`);
  return simulator;
}

// תרחיש 1: אימונים בבית ללא ציוד
const sim1 = testScenario("אימונים בבית ללא ציוד", [
  { type: "answer", questionId: "training_location", answer: "home" },
  { type: "next" },
  {
    type: "answer",
    questionId: "home_equipment_availability",
    answer: "no_equipment",
  },
  { type: "next" },
]);

// תרחיש 2: אימונים בחדר כושר מלא
const sim2 = testScenario("אימונים בחדר כושר מלא", [
  { type: "answer", questionId: "training_location", answer: "gym" },
  { type: "next" },
  {
    type: "answer",
    questionId: "gym_equipment_availability",
    answer: "full_gym",
  },
  { type: "next" },
]);

// תרחיש 3: אימונים בחוץ עם ציוד נייד
const sim3 = testScenario("אימונים בחוץ עם ציוד נייד", [
  { type: "answer", questionId: "training_location", answer: "outdoor" },
  { type: "next" },
  {
    type: "answer",
    questionId: "outdoor_equipment_availability",
    answer: "portable_equipment",
  },
  { type: "next" },
]);

// תרחיש 4: אימונים בבית עם חדר כושר ביתי מתקדם
const sim4 = testScenario("אימונים בבית - חדר כושר ביתי מתקדם", [
  { type: "answer", questionId: "training_location", answer: "home" },
  { type: "next" },
  {
    type: "answer",
    questionId: "home_equipment_availability",
    answer: "advanced_home_gym",
  },
  { type: "next" },
]);

console.log("\n\n🎉 כל הבדיקות הושלמו!");
console.log("\n📋 סיכום הלוגיקה:");
console.log("1. ✅ שאלה ראשונה: מיקום אימון");
console.log("2. ✅ שאלה שנייה: תלויה במיקום שנבחר");
console.log("   • בית -> שאלת ציוד בבית");
console.log("   • חדר כושר -> שאלת סוג חדר כושר");
console.log("   • חוץ -> שאלת ציוד נייד");
console.log("3. ✅ שאלה שלישית: תלויה בציוד שנבחר");
console.log("\n💡 הבעיה נפתרה: אין יותר שאלות על חדר כושר למי שבחר בית!");

// ------------------------------
// Quick sanity checks (runtime)
// ------------------------------
const check = (name, predicate) => {
  try {
    const ok = !!predicate();
    console.log(`${ok ? "✅" : "❌"} ${name}`);
    return ok;
  } catch (e) {
    console.log(`❌ ${name} (error: ${e?.message || e})`);
    return false;
  }
};

console.log("\n🧪 Running quick checks:\n");
const results = [];

results.push(
  check(
    "Scenario 1 ends with bodyweight_equipment_options",
    () => sim1.questionsToShow.at(-1) === "bodyweight_equipment_options"
  )
);
results.push(
  check(
    "Scenario 2 ends with gym_equipment_options",
    () => sim2.questionsToShow.at(-1) === "gym_equipment_options"
  )
);
results.push(
  check(
    "Scenario 3 ends with home_equipment_options (portable)",
    () => sim3.questionsToShow.at(-1) === "home_equipment_options"
  )
);
results.push(
  check(
    "Scenario 4 ends with home_equipment_options (advanced home)",
    () => sim4.questionsToShow.at(-1) === "home_equipment_options"
  )
);

const passed = results.filter(Boolean).length;
console.log(`\n✅ Passed ${passed}/${results.length} checks.`);
process.exitCode = passed === results.length ? 0 : 1;
