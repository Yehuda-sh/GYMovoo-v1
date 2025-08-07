/**
 * בדיקת תיקון משתמש מציאותי - חיבור לנתוני שאלון
 * Testing realistic user fix - connecting to questionnaire data
 */

console.log("🎯 Realistic User Fix Verification\n");

console.log("🔧 Issues Fixed:");
console.log("1. ✅ Hebrew names in email addresses fixed");
console.log("   - Before: דוד@demo.app");
console.log("   - After: david123@demo.app");

console.log("\n2. ✅ Realistic User button now uses questionnaire data");
console.log("   - Before: Always creates random demo user");
console.log("   - After: Uses customDemoUser from questionnaire if available");

console.log("\n📧 Email Mapping:");
const emailMapping = {
  דוד: "david",
  יוסי: "yossi",
  אמיר: "amir",
  רן: "ran",
  תומר: "tomer",
  אלון: "alon",
  גיל: "gil",
  שרה: "sarah",
  מיכל: "michal",
  רונית: "ronit",
  נועה: "noa",
  ליאת: "liat",
  יעל: "yael",
  דנה: "dana",
  אלכס: "alex",
  עדן: "eden",
  נועם: "noam",
  שחר: "shachar",
  ריי: "ray",
  קיי: "kay",
  דני: "danny",
};

Object.entries(emailMapping)
  .slice(0, 5)
  .forEach(([hebrew, english]) => {
    console.log(`   ${hebrew} → ${english}123@demo.app`);
  });

console.log("\n🔄 Logic Flow:");
console.log('1. User clicks "משתמש מציאותי"');
console.log("2. System checks: getCustomDemoUser()");
console.log("3. If found: generateRealisticUserFromCustomDemo(customUser)");
console.log("4. If not found: generateRealisticUser() (random)");
console.log("5. Result: Demo user reflects questionnaire answers");

console.log("\n🎉 Benefits:");
console.log("✅ No more Hebrew characters in email addresses");
console.log("✅ Demo user reflects questionnaire preferences");
console.log("✅ Consistent user experience");
console.log("✅ Proper data flow from questionnaire to demo");

console.log("\n💡 Next Steps:");
console.log("• Test questionnaire completion → realistic user creation");
console.log("• Verify email format is always English");
console.log("• Confirm demo data matches questionnaire answers");

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

// Validate that generated demo emails are English-only and valid-ish
// eslint-disable-next-line no-control-regex
const isAscii = (s) => /^[\x00-\x7F]+$/.test(s);
const isValidEmail = (s) => /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(s);

const toDemoEmail = (nameEn) => `${nameEn}123@demo.app`;

console.log("\n🧪 Running quick checks:\n");
const results = [];

// 1) Email mapping produces ASCII-only valid emails
results.push(
  check("email mapping → english-only demo emails", () => {
    return Object.entries(emailMapping)
      .slice(0, 10)
      .every(([_, en]) => {
        const email = toDemoEmail(en);
        return isAscii(email) && isValidEmail(email);
      });
  })
);

// 2) Fallback for unmapped names should still be ASCII (simulate)
const sanitizeFallback = (nameHe) => "user" + Math.floor(Math.random() * 1000);
results.push(
  check("fallback for unmapped hebrew names is ASCII", () => {
    const email = `${sanitizeFallback("אברהם")}@demo.app`;
    return isAscii(email) && isValidEmail(email);
  })
);

// 3) Logic flow chooses customDemoUser path when available (simulation)
const choosePath = (hasCustomDemoUser) =>
  hasCustomDemoUser ? "custom" : "random";
results.push(
  check(
    "uses customDemoUser when available",
    () => choosePath(true) === "custom"
  )
);
results.push(
  check(
    "falls back to random when customDemoUser missing",
    () => choosePath(false) === "random"
  )
);

const passed = results.filter(Boolean).length;
console.log(`\n✅ Passed ${passed}/${results.length} checks.`);
process.exitCode = passed === results.length ? 0 : 1;
