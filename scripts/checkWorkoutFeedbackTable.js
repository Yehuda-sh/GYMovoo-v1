/**
 * בדיקת טבלת workout_feedback ב-Supabase
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

async function checkWorkoutFeedbackTable() {
  console.log("🔍 Checking workout_feedback table...");

  try {
    // בדיקה שהטבלה קיימת על ידי ניסיון לקריאה
    const { data, error } = await supabase
      .from("workout_feedback")
      .select("*")
      .limit(1);

    if (error) {
      console.log("⚠️ Table check result:", error.message);
      if (error.message.includes("does not exist")) {
        console.log(
          "❌ Table workout_feedback does not exist - need to create it manually in Supabase dashboard"
        );
        console.log("📋 SQL to run in Supabase SQL editor:");
        console.log(`
CREATE TABLE workout_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_id TEXT NOT NULL UNIQUE,
  feedback_data JSONB NOT NULL,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_workout_feedback_workout_id ON workout_feedback(workout_id);
CREATE INDEX idx_workout_feedback_saved_at ON workout_feedback(saved_at);
        `);
      }
    } else {
      console.log("✅ Table workout_feedback exists and is accessible");
      console.log("📊 Current data count:", data.length);
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

checkWorkoutFeedbackTable();
