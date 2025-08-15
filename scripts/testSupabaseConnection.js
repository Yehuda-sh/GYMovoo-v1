/*
  Supabase Connection Test Script
  בדיקת חיבור מקיפה ל-Supabase
  
  שימוש:
    $env:EXPO_PUBLIC_SUPABASE_URL="https://nyfvsmateipdmpshllsd.supabase.co"
    $env:EXPO_PUBLIC_SUPABASE_ANON_KEY="<ANON_KEY>"
    npm run test:supabase
*/

// טעינת dotenv לקריאת קובץ .env
require("dotenv").config();

const axios = require("axios");

const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

async function testConnection() {
  console.log("🔍 בודק חיבור ל-Supabase...\n");

  // בדיקת משתני סביבה
  console.log("📋 משתני סביבה:");
  console.log(
    `   URL: ${SUPABASE_URL ? "✅ מוגדר" : "❌ חסר"} - ${SUPABASE_URL || "לא מוגדר"}`
  );
  console.log(`   Key: ${SUPABASE_ANON_KEY ? "✅ מוגדר" : "❌ חסר"}\n`);

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error(
      "❌ חסרים משתני סביבה. הגדר EXPO_PUBLIC_SUPABASE_URL ו-EXPO_PUBLIC_SUPABASE_ANON_KEY"
    );
    process.exit(1);
  }

  const api = axios.create({
    baseURL: `${SUPABASE_URL}/rest/v1`,
    timeout: 10000,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Prefer: "return=representation",
    },
  });

  try {
    // בדיקת טבלת users
    console.log("📡 בודק טבלת users...");
    const { data: users } = await api.get("/users?select=*&limit=5");
    console.log(`   ✅ נמצאו ${users.length} משתמשים (מוצגים עד 5)\n`);

    if (users.length > 0) {
      console.log("👤 דוגמת משתמש ראשון:");
      const firstUser = users[0];
      console.log(`   ID: ${firstUser.id}`);
      console.log(`   Name: ${firstUser.name}`);
      console.log(`   Email: ${firstUser.email}`);
      console.log(
        `   Has smartQuestionnaireData: ${!!firstUser.smartquestionnairedata}`
      );
      console.log(`   Has preferences: ${!!firstUser.preferences}\n`);
    }

    // בדיקת יצירת משתמש חדש (אופציונלי)
    console.log("📝 בודק יצירת משתמש בדיקה...");
    const testUser = {
      id: `test_${Date.now()}`,
      name: "Test User",
      email: `test${Date.now()}@example.com`,
      preferences: { language: "he", theme: "light" },
    };

    const { data: created } = await api.post("/users", testUser);
    const createdUser = Array.isArray(created) ? created[0] : created;
    console.log(`   ✅ משתמש נוצר: ${createdUser?.id}\n`);

    // בדיקת עדכון
    console.log("📝 בודק עדכון משתמש...");
    const { data: updated } = await api.patch(`/users?id=eq.${testUser.id}`, {
      name: "Updated Test User",
    });
    const updatedUser = Array.isArray(updated) ? updated[0] : updated;
    console.log(`   ✅ משתמש עודכן: ${updatedUser?.name}\n`);

    // בדיקת קריאה לפי ID
    console.log("📖 בודק קריאה לפי ID...");
    const { data: byId } = await api.get(
      `/users?id=eq.${testUser.id}&select=*`
    );
    const foundUser = Array.isArray(byId) ? byId[0] : byId;
    console.log(`   ✅ משתמש נמצא: ${foundUser?.name}\n`);

    // מחיקת משתמש הבדיקה
    console.log("🗑️ מוחק משתמש בדיקה...");
    await api.delete(`/users?id=eq.${testUser.id}`);
    console.log("   ✅ משתמש נמחק\n");

    console.log("✅ כל הבדיקות עברו בהצלחה! Supabase מחובר ועובד.");
  } catch (error) {
    console.error("❌ שגיאה בחיבור:");
    console.error(`   Status: ${error.response?.status}`);
    console.error(`   Message: ${error.message}`);
    if (error.response?.data) {
      console.error("   Data:", JSON.stringify(error.response.data, null, 2));
    }

    // הצעות לפתרון
    console.log("\n💡 הצעות לפתרון:");
    if (error.response?.status === 401) {
      console.log("   - בדוק שהמפתח SUPABASE_ANON_KEY נכון");
    }
    if (error.response?.status === 404) {
      console.log("   - בדוק שטבלת public.users קיימת ב-Supabase");
    }
    if (error.response?.status === 403) {
      console.log("   - בדוק RLS Policies עבור טבלת users");
    }

    process.exit(1);
  }
}

testConnection();
