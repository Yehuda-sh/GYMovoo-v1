/**
 * @file src/utils/rtlHelpers.example.ts
 * @brief דוגמאות שימוש בכלי RTL המשופרים | Examples using improved RTL helpers
 * @created 2025-07-30
 */

import rtlHelpers from "./rtlHelpers";

// ===== דוגמאות לשימוש בפונקציות החדשות =====

/**
 * דוגמה לשימוש ברכיב בחירה עם RTL
 */
export const ExampleSelectionComponent = () => {
  const styles = rtlHelpers.getSelectionComponentStyle(true);

  // השימוש:
  // <View style={styles.container}>
  //   <View style={styles.content}>
  //     <Text style={styles.text}>הטקסט בעברית</Text>
  //   </View>
  // </View>

  return styles;
};

/**
 * דוגמה לשימוש בהתאמת טקסט למגדר
 */
export const ExampleGenderAdaptation = () => {
  const userGender: "male" | "female" | "other" = "female";

  // התאמה בסיסית
  const basicText = rtlHelpers.adaptBasicTextToGender(
    "אתה מתחיל בעולם הכושר",
    userGender
  );
  console.log(basicText); // "את מתחילה בעולם הכושר"

  // יצירת טקסט ניטרלי
  const neutralText = rtlHelpers.makeTextGenderNeutral("אתה צעיר ומלא אנרגיה");
  console.log(neutralText); // "את עם אנרגיה צעירה"

  // טקסט דינמי מתקדם
  const dynamicText = rtlHelpers.getDynamicGenderText(
    "מתאמן מתחיל",
    userGender,
    {
      male: "מתאמן מתחיל",
      female: "מתאמנת מתחילה",
      neutral: "מתאמן/ת מתחיל/ה",
    }
  );
  console.log(dynamicText); // "מתאמנת מתחילה"
};

/**
 * דוגמה לשימוש בסגנונות מתקדמים
 */
export const ExampleAdvancedStyles = () => {
  // סגנון לרכיב בחירה
  const selectionStyles = rtlHelpers.createAdvancedRTLStyle({
    isSelectionComponent: true,
    marginStart: 10,
    paddingStart: 16,
  });

  // סגנון לכפתור צף
  const floatingButtonStyles = rtlHelpers.createAdvancedRTLStyle({
    isFloatingButton: true,
  });

  // סגנון טקסט מלא
  const textStyle = rtlHelpers.getFullRTLTextStyle({
    textAlign: "right",
    writingDirection: true,
    width: "100%",
  });

  return {
    selectionStyles,
    floatingButtonStyles,
    textStyle,
  };
};

/**
 * דוגמה לשימוש באינדיקטור בחירה
 */
export const ExampleSelectionIndicator = () => {
  const indicatorStyle = rtlHelpers.getSelectionIndicatorStyle(true);

  // השימוש:
  // <MaterialCommunityIcons
  //   name="check-circle"
  //   size={24}
  //   color="#4CAF50"
  //   style={indicatorStyle}
  // />

  return indicatorStyle;
};

/**
 * דוגמה לשימוש בכפתור צף עם אנימציה
 */
export const ExampleAnimatedFloatingButton = (animatedValues: any) => {
  const buttonStyle = rtlHelpers.getAnimatedFloatingButtonStyle(animatedValues);

  // השימוש:
  // <Animated.View style={buttonStyle}>
  //   <TouchableOpacity>
  //     <MaterialCommunityIcons name="arrow-left" size={24} />
  //   </TouchableOpacity>
  // </Animated.View>

  return buttonStyle;
};

/**
 * דוגמה לבדיקת טקסט עברי
 */
export const ExampleHebrewDetection = () => {
  console.log(rtlHelpers.containsHebrew("שלום עולם")); // true
  console.log(rtlHelpers.containsHebrew("Hello World")); // false
  console.log(rtlHelpers.containsHebrew("שלום World")); // true
};

/**
 * דוגמה לטיפול בטקסט מעורב
 */
export const ExampleMixedText = () => {
  const mixedText = rtlHelpers.wrapMixedText("אימון HIIT מתקדם", true);
  console.log(mixedText); // עם סימני כיווניות RTL
};
