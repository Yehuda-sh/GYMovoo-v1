/*
  Import users from storage/db/users.json into Supabase public.users
  שימוש (Windows PowerShell):
    $env:SUPABASE_URL="https://<project>.supabase.co"
    $env:SUPABASE_SERVICE_ROLE_KEY="<SERVICE_ROLE_KEY>"
    node scripts/importUsersToSupabase.js

  הערה: Service Role נדרש לכתיבה חופשית. אל תריץ מלקוח.
*/
const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

async function main() {
  const SUPABASE_URL = (
    process.env.SUPABASE_URL ||
    process.env.EXPO_PUBLIC_SUPABASE_URL ||
    ""
  ).trim();
  const SERVICE_ROLE = (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    ""
  ).trim();
  if (!SUPABASE_URL || !SERVICE_ROLE) {
    console.error("❌ חסר SUPABASE_URL או SUPABASE_SERVICE_ROLE_KEY בסביבה.");
    process.exit(1);
  }
  const jsonPath = path.resolve(__dirname, "../storage/db/users.json");
  if (!fs.existsSync(jsonPath)) {
    console.error("❌ לא נמצא users.json ב-storage/db.");
    process.exit(1);
  }
  const raw = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  const users = Array.isArray(raw?.users) ? raw.users : [];
  if (!users.length) {
    console.warn("⚠️ אין משתמשים לייבוא.");
    return;
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
    auth: { persistSession: false },
  });

  let ok = 0;
  for (const u of users) {
    try {
      if (!u.id) {
        console.warn("⏭️ דילוג – אין id למשתמש:", u?.email);
        continue;
      }
      // upsert לפי PK id - עם שמות עמודות נכונים (אותיות קטנות)
      const userData = {
        id: String(u.id),
        name: u.name ?? null,
        email: u.email ?? null,
        avatar: u.avatar ?? null,
        provider: u.provider ?? null,
        registration: u.registration ?? null,
        smartquestionnairedata: u.smartQuestionnaireData ?? null,
        questionnaire: u.questionnaire ?? null,
        questionnairedata: u.questionnaireData ?? null,
        scientificprofile: u.scientificProfile ?? null,
        airecommendations: u.aiRecommendations ?? null,
        activityhistory: u.activityHistory ?? null,
        currentstats: u.currentStats ?? null,
        preferences: u.preferences ?? null,
        trainingstats: u.trainingStats ?? null,
        subscription: u.subscription ?? null,
        workoutplans: u.workoutPlans ?? null,
        genderprofile: u.genderProfile ?? null,
      };

      const { error } = await supabase
        .from("users")
        .upsert([userData], { onConflict: "id" });
      if (error) throw error;
      console.log("✅ upsert:", u.id, u.email);
      ok++;
    } catch (e) {
      console.error("❌ כשל ב-upsert:", u?.id, e?.message || e);
    }
  }
  console.log(`\nסיום: ${ok}/${users.length} עודכנו/נוצרו.`);
}

main().catch((e) => {
  console.error("❌ שגיאה כללית:", e);
  process.exit(1);
});
