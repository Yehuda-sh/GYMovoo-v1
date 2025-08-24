const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

async function detailedSchemaCheck() {
  console.log("🔬 בדיקה מפורטת של מבנה בסיס הנתונים\n");

  const tablesToCheck = [
    "users",
    "workout_plans",
    "workout_history",
    "achievements",
    "gamification_state",
    "personal_records",
    "exercise_logs",
    "subscriptions",
  ];

  for (const tableName of tablesToCheck) {
    console.log(`\n📋 בודק טבלה: ${tableName}`);
    console.log("=".repeat(50));

    try {
      // ניסיון לקבל דוגמה של שורה אחת
      const { data: sampleData, error: sampleError } = await supabase
        .from(tableName)
        .select("*")
        .limit(1);

      if (sampleError) {
        console.log(`❌ ${tableName}: ${sampleError.message}`);
        continue;
      }

      console.log(`✅ ${tableName}: נגיש`);

      if (sampleData && sampleData.length > 0) {
        console.log(`📊 דוגמה של שדות בטבלה:`);
        const sample = sampleData[0];
        Object.keys(sample).forEach((key) => {
          const value = sample[key];
          const type = typeof value;
          const isNull = value === null;
          console.log(`  - ${key}: ${type}${isNull ? " (null)" : ""}`);
        });
      } else {
        console.log("📭 הטבלה ריקה");
      }

      // ספירת רשומות
      const { count, error: countError } = await supabase
        .from(tableName)
        .select("*", { count: "exact", head: true });

      if (!countError) {
        console.log(`📈 סה"כ רשומות: ${count}`);
      }
    } catch (error) {
      console.log(`❌ שגיאה ב-${tableName}:`, error.message);
    }
  }

  // בדיקה מיוחדת למשתמשים עם פרטים
  console.log("\n👥 רשימת משתמשים מפורטת:");
  console.log("=".repeat(50));

  const { data: detailedUsers, error: detailedError } = await supabase.from(
    "users"
  ).select(`
      id,
      email,
      name,
      subscription,
      created_at,
      trial_end_date,
      questionnaire
    `);

  if (detailedError) {
    console.log("❌ שגיאה בקבלת פרטי משתמשים:", detailedError.message);
  } else {
    detailedUsers?.forEach((user, index) => {
      console.log(`\n${index + 1}. משתמש ${user.id}`);
      console.log(`   📧 Email: ${user.email || "לא קיים"}`);
      console.log(`   👤 Name: ${user.name || "לא קיים"}`);
      console.log(`   💰 Subscription: ${JSON.stringify(user.subscription)}`);
      console.log(`   📅 Created: ${user.created_at}`);
      console.log(`   ⏰ Trial End: ${user.trial_end_date || "לא קיים"}`);
      console.log(
        `   📋 Has Questionnaire: ${user.questionnaire ? "כן" : "לא"}`
      );
    });
  }
}

detailedSchemaCheck()
  .then(() => {
    console.log("\n✅ בדיקה מפורטת הושלמה!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ שגיאה:", error);
    process.exit(1);
  });
