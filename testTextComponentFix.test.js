/**
 * @file testTextComponentFix.test.js
 * @brief בדיקה אוטומטית: ודא שאין יותר שימוש ב-{" "} מחוץ ל-<Text> ב-SmartQuestionnaireScreen
 *
 * להרצה: npx jest testTextComponentFix.test.js
 */

const fs = require("fs");
const path = require("path");

describe("SmartQuestionnaireScreen Text Component Fix", () => {
  it("should not contain space character outside <Text> component", () => {
    const filePath = path.resolve(
      __dirname,
      "src/screens/questionnaire/SmartQuestionnaireScreen.tsx"
    );
    if (!fs.existsSync(filePath)) {
      throw new Error("SmartQuestionnaireScreen.tsx not found");
    }
    const content = fs.readFileSync(filePath, "utf8");
    // בדוק שאין את המחרוזת </View>{" "}
    expect(content.includes('</View>{" "}')).toBe(false);
  });
});
