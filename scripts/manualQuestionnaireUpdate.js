// Quick fix script to manually trigger questionnaire completion for u_init_1
console.log("🔧 Starting manual questionnaire update for u_init_1...");

// הוסף שורות אלה בקונסול של הדפדפן:
console.log(`
💻 הדבק את זה בקונסול הדפדפן (F12):

// עדכון ידני של השאלון למשתמש u_init_1
const smartQuestionnaireData = {
  answers: {
    gender: "male",
    age: "under_18", 
    weight: "50_60",
    height: "150_160",
    fitnessLevel: "advanced",
    goals: ["general_fitness"],
    equipment: ["free_weights", "cable_machine", "squat_rack"],
    availability: ["5_days"],
    sessionDuration: "60_plus_min",
    workoutLocation: "gym",
    nutrition: ["keto"]
  },
  metadata: {
    completedAt: new Date().toISOString(),
    version: "2.1",
    questionsAnswered: 10,
    totalQuestions: 10
  }
};

// עדכון ב-userStore
const userStore = require('../src/stores/userStore').useUserStore.getState();
userStore.setSmartQuestionnaireData(smartQuestionnaireData);
console.log("✅ שאלון עודכן בuserStore");
`);
