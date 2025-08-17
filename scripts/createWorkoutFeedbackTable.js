/**
 * יצירת טבלת workout_feedback ב-Supabase
 */
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  "https://nyfvsmateipdmpshllsd.supabase.co";
const supabaseKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error("❌ Missing Supabase key");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createWorkoutFeedbackTable() {
  console.log("🔄 Creating workout_feedback table...");

  try {
    // יצירת טבלה
    const { error: createError } = await supabase.rpc("execute_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS workout_feedback (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          workout_id TEXT NOT NULL UNIQUE,
          feedback_data JSONB NOT NULL,
          saved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          created_at TIMESTAMPTZ DEFAULT now(),
          updated_at TIMESTAMPTZ DEFAULT now()
        );

        CREATE INDEX IF NOT EXISTS idx_workout_feedback_workout_id ON workout_feedback(workout_id);
        CREATE INDEX IF NOT EXISTS idx_workout_feedback_saved_at ON workout_feedback(saved_at);
      `,
    });

    if (createError) {
      console.error("❌ Error creating table:", createError);
      return;
    }

    console.log("✅ Table workout_feedback created successfully");

    // בדיקה שהטבלה קיימת
    const { data: tables, error: checkError } = await supabase
      .from("workout_feedback")
      .select("*")
      .limit(1);

    if (
      checkError &&
      !checkError.message.includes('relation "workout_feedback" does not exist')
    ) {
      console.log("✅ Table is accessible");
    } else if (checkError) {
      console.log("⚠️ Table check result:", checkError.message);
    } else {
      console.log("✅ Table is ready and accessible");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

createWorkoutFeedbackTable();
