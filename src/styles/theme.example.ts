/**
 * @file src/styles/theme.example.ts
 * @brief דוגמאות שימוש בערכת הנושא המשודרגת | Examples using improved theme system
 * @created 2025-07-30
 */

import { theme } from "./theme";

// ===== דוגמאות לשימוש בפונקציות החדשות =====

/**
 * דוגמה לשימוש בהתאמת מגדר בעיצוב
 */
export const ExampleGenderAdaptiveDesign = () => {
  const userGender: "male" | "female" | "other" = "female";

  console.log("=== עיצוב מותאם למגדר ===");

  // צבע לפי מגדר
  const genderColor = theme.genderHelpers.getGenderColor(userGender);
  console.log(`🎨 Gender color for ${userGender}:`, genderColor);

  // גרדיאנט לפי מגדר
  const genderGradient = theme.genderHelpers.getGenderGradient(userGender);
  console.log(`🌈 Gender gradient for ${userGender}:`, genderGradient);

  // סגנון כפתור מגדר
  const buttonStyle = theme.genderHelpers.getGenderButtonStyle(
    userGender,
    true
  );
  console.log(`🔘 Gender button style:`, buttonStyle);

  return {
    // דוגמת שימוש ברכיב
    // <TouchableOpacity style={buttonStyle}>
    //   <Text style={{ color: theme.colors.white }}>בחירת מגדר</Text>
    // </TouchableOpacity>

    genderColor,
    genderGradient,
    buttonStyle,
  };
};

/**
 * דוגמה לשימוש ב-RTL מתקדם
 */
export const ExampleAdvancedRTL = () => {
  console.log("=== RTL מתקדם ===");

  // סגנונות טקסט RTL שונים
  const titleStyle = theme.rtlHelpers.getFullRTLTextStyle("title");
  const bodyStyle = theme.rtlHelpers.getFullRTLTextStyle("body");
  const captionStyle = theme.rtlHelpers.getFullRTLTextStyle("caption");

  console.log("📝 RTL Text Styles:", { titleStyle, bodyStyle, captionStyle });

  // סגנון קונטיינר RTL
  const containerStyle = theme.rtlHelpers.getRTLContainerStyle({
    alignItems: "flex-end",
    paddingDirection: "right",
    paddingValue: 16,
  });

  console.log("📦 RTL Container Style:", containerStyle);

  // סגנון input RTL
  const inputStyle = theme.rtlHelpers.getRTLInputStyle();
  console.log("⌨️ RTL Input Style:", inputStyle);

  // אינדיקטור בחירה
  const indicatorStyle = theme.rtlHelpers.getSelectionIndicatorStyle(true);
  console.log("✅ Selection Indicator Style:", indicatorStyle);

  return {
    // דוגמת שימוש ברכיבים
    // <View style={containerStyle}>
    //   <Text style={titleStyle}>כותרת בעברית</Text>
    //   <Text style={bodyStyle}>טקסט גוף בעברית</Text>
    //   <TextInput style={inputStyle} placeholder="הכנס טקסט..." />
    // </View>

    titleStyle,
    bodyStyle,
    containerStyle,
    inputStyle,
    indicatorStyle,
  };
};

/**
 * דוגמה לשימוש ברכיבי השאלון החכם
 */
export const ExampleSmartQuestionnaireComponents = () => {
  console.log("=== רכיבי שאלון חכם ===");

  // סגנון אפשרות רגילה ונבחרת
  const normalOptionStyle = theme.questionnaireHelpers.getOptionStyle(false);
  const selectedOptionStyle = theme.questionnaireHelpers.getOptionStyle(true);

  console.log("🔘 Option Styles:", { normalOptionStyle, selectedOptionStyle });

  // סגנון התקדמות
  const progressStyle = theme.questionnaireHelpers.getProgressStyle(60); // 60%
  console.log("📊 Progress Style:", progressStyle);

  // כפתור צף
  const floatingButtonStyle =
    theme.questionnaireHelpers.getFloatingButtonStyle(true);
  console.log("🔵 Floating Button Style:", floatingButtonStyle);

  return {
    // דוגמת שימוש ברכיבים
    // <TouchableOpacity style={selectedOptionStyle}>
    //   <Text style={theme.components.questionnaireText}>אפשרות נבחרת</Text>
    // </TouchableOpacity>
    //
    // <View style={progressStyle.container}>
    //   <View style={progressStyle.fill} />
    // </View>
    //
    // <TouchableOpacity style={floatingButtonStyle}>
    //   <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
    // </TouchableOpacity>

    normalOptionStyle,
    selectedOptionStyle,
    progressStyle,
    floatingButtonStyle,
  };
};

/**
 * דוגמה למערכת צבעים מורחבת
 */
export const ExampleExtendedColorSystem = () => {
  console.log("=== מערכת צבעים מורחבת ===");

  const questionnaireColors = {
    card: theme.colors.questionnaireCard,
    border: theme.colors.questionnaireBorder,
    selected: theme.colors.selectedOption,
    selectedBg: theme.colors.selectedOptionBg,
    progress: theme.colors.progressFill,
    progressBg: theme.colors.progressBg,
  };

  console.log("🎨 Questionnaire Colors:", questionnaireColors);

  const genderColors = {
    male: theme.colors.genderMale,
    female: theme.colors.genderFemale,
    neutral: theme.colors.genderNeutral,
  };

  console.log("👥 Gender Colors:", genderColors);

  const gradients = {
    questionnaire: [
      theme.colors.questionnaireGradientStart,
      theme.colors.questionnaireGradientEnd,
    ],
    genderMale: theme.colors.genderGradientMale,
    genderFemale: theme.colors.genderGradientFemale,
    genderNeutral: theme.colors.genderGradientNeutral,
  };

  console.log("🌈 Gradients:", gradients);

  return {
    questionnaireColors,
    genderColors,
    gradients,
  };
};

/**
 * דוגמה לאינטגרציה מלאה של מערכת העיצוב
 */
export const ExampleFullDesignSystemIntegration = () => {
  console.log("=== אינטגרציה מלאה של מערכת העיצוב ===");

  // סימולציה של נתוני שאלון
  const questionnaireState = {
    currentQuestion: 3,
    totalQuestions: 7,
    userGender: "female" as const,
    selectedOptions: ["אפשרות 1", "אפשרות 3"],
  };

  console.log("📋 Questionnaire State:", questionnaireState);

  // חישוב התקדמות
  const progress =
    (questionnaireState.currentQuestion / questionnaireState.totalQuestions) *
    100;

  // קבלת כל הסגנונות הנדרשים
  const styles = {
    // כרטיס שאלון
    questionCard: theme.components.questionnaireCard,

    // אפשרויות
    option: theme.questionnaireHelpers.getOptionStyle(false),
    selectedOption: theme.questionnaireHelpers.getOptionStyle(true),

    // טקסטים RTL
    questionTitle: theme.rtlHelpers.getFullRTLTextStyle("title"),
    optionText: theme.rtlHelpers.getFullRTLTextStyle("body"),

    // התקדמות
    progress: theme.questionnaireHelpers.getProgressStyle(progress),

    // כפתור מגדר
    genderButton: theme.genderHelpers.getGenderButtonStyle(
      questionnaireState.userGender,
      true
    ),

    // כפתור צף
    floatingButton: theme.questionnaireHelpers.getFloatingButtonStyle(true),

    // אינדיקטור בחירה
    selectionIndicator: theme.rtlHelpers.getSelectionIndicatorStyle(true),
  };

  console.log("🎨 Complete Styles Object:", styles);

  return {
    // זה יהיה הסגנון המלא לכל השאלון
    // <LinearGradient
    //   colors={[theme.colors.questionnaireGradientStart, theme.colors.questionnaireGradientEnd]}
    //   style={theme.components.questionnaireCard}
    // >
    //   <View style={styles.progress.container}>
    //     <View style={styles.progress.fill} />
    //   </View>
    //
    //   <Text style={styles.questionTitle}>שאלת השאלון</Text>
    //
    //   <TouchableOpacity style={styles.selectedOption}>
    //     <Text style={styles.optionText}>אפשרות נבחרת</Text>
    //     <MaterialCommunityIcons
    //       name="check-circle"
    //       size={24}
    //       color={theme.colors.selectedOption}
    //       style={styles.selectionIndicator}
    //     />
    //   </TouchableOpacity>
    //
    //   <TouchableOpacity style={styles.floatingButton}>
    //     <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
    //   </TouchableOpacity>
    // </LinearGradient>

    styles,
    questionnaireState,
    progress,
  };
};

/**
 * דוגמה לשימוש דינמי במערכת העיצוב
 */
export const ExampleDynamicThemeUsage = () => {
  console.log("=== שימוש דינמי במערכת העיצוב ===");

  // פונקציה לקבלת עיצוב לפי מצב
  const getComponentStyle = (
    componentType: "option" | "button" | "text",
    state: {
      isSelected?: boolean;
      gender?: "male" | "female" | "other";
      variant?: "title" | "body" | "caption";
    } = {}
  ) => {
    switch (componentType) {
      case "option":
        return theme.questionnaireHelpers.getOptionStyle(state.isSelected);

      case "button":
        return state.gender
          ? theme.genderHelpers.getGenderButtonStyle(
              state.gender,
              state.isSelected
            )
          : theme.components.primaryButton;

      case "text":
        return theme.rtlHelpers.getFullRTLTextStyle(state.variant || "body");

      default:
        return {};
    }
  };

  // דוגמאות שימוש
  const dynamicStyles = {
    selectedOption: getComponentStyle("option", { isSelected: true }),
    maleButton: getComponentStyle("button", {
      gender: "male",
      isSelected: true,
    }),
    titleText: getComponentStyle("text", { variant: "title" }),
  };

  console.log("🔄 Dynamic Styles:", dynamicStyles);

  return {
    getComponentStyle,
    dynamicStyles,
  };
};
