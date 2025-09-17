/**
 * @file TermsScreen.tsx
 * @description מסך תנאי שימוש ומדיניות פרטיות לאפליקציה
 */

import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../core/theme";

// טיפוסים
interface TermsScreenParams {
  type?: "terms" | "privacy";
}

// גרסאות ותאריכי עדכון
const TERMS_VERSION = "1.0.0";
const TERMS_LAST_UPDATED = "15 בספטמבר 2025";
const PRIVACY_VERSION = "1.0.0";
const PRIVACY_LAST_UPDATED = "15 בספטמבר 2025";

// תוכן תנאי השימוש
const TERMS_CONTENT = `
## תנאי שימוש GYMovoo
**גרסה ${TERMS_VERSION} | עודכן לאחרונה: ${TERMS_LAST_UPDATED}**

ברוכים הבאים לאפליקציית GYMovoo לניהול אימונים ועקיבה אחר התקדמות.

### הסכמה לתנאים
השימוש באפליקציה מהווה הסכמה לתנאי השימוש. אם אינך מסכים, אנא הימנע משימוש באפליקציה.

### מגבלת גיל
השימוש באפליקציה מותר למשתמשים מגיל 16 ומעלה. מתחת לגיל 18 נדרש אישור הורה.

### חשבון משתמש
אתה אחראי לשמור על סודיות הסיסמה ולכל פעילות תחת החשבון שלך.

### שימוש הוגן
השתמש באפליקציה באופן חוקי בלבד.

### שינויים
אנו שומרים את הזכות לשנות את התנאים. שינויים ייכנסו לתוקף מיד עם פרסומם.

### יצירת קשר
לשאלות: support@gymovoo.com
`;

// תוכן מדיניות הפרטיות
const PRIVACY_CONTENT = `
## מדיניות פרטיות GYMovoo
**גרסה ${PRIVACY_VERSION} | עודכן לאחרונה: ${PRIVACY_LAST_UPDATED}**

מדיניות זו מסבירה כיצד אנו מטפלים במידע האישי שלך באפליקציית GYMovoo.

### איסוף מידע
אנו אוספים:
- פרטי הרשמה (שם, אימייל, סיסמה)
- נתוני אימונים ופעילות גופנית
- העדפות אישיות ויעדים

### שימוש במידע
המידע משמש לאספקת השירות, התאמה אישית ושיפור האפליקציה.

### שיתוף מידע
אנו לא נמכור את המידע שלך לצדדים שלישיים.

### אבטחה
אנו מיישמים אמצעי אבטחה להגנה על המידע שלך.

### זכויותיך
יש לך זכות לגשת, לתקן ולמחוק את המידע שלך.

### שינויים
אנו עשויים לעדכן מדיניות זו מעת לעת.

### יצירת קשר
לשאלות: privacy@gymovoo.com
`;

export const TermsScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as TermsScreenParams | undefined;

  // סוג התוכן - ברירת מחדל היא תנאי שימוש
  const contentType = params?.type || "terms";

  // קביעת כותרת וטקסט בהתאם לסוג התוכן
  const title = contentType === "terms" ? "תנאי שימוש" : "מדיניות פרטיות";
  const content = contentType === "terms" ? TERMS_CONTENT : PRIVACY_CONTENT;

  // חזרה למסך הקודם
  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // פיצול הטקסט לפסקאות ועיבוד כותרות
  const renderFormattedContent = () => {
    return content.split("\n").map((line, index) => {
      if (line.startsWith("##")) {
        // כותרת ראשית
        return (
          <Text key={index} style={styles.mainHeading}>
            {line.replace("##", "").trim()}
          </Text>
        );
      } else if (line.startsWith("###")) {
        // כותרת משנית
        return (
          <Text key={index} style={styles.subHeading}>
            {line.replace("###", "").trim()}
          </Text>
        );
      } else if (line.startsWith("-")) {
        // פריט ברשימה
        return (
          <Text key={index} style={styles.listItem}>
            {line.trim()}
          </Text>
        );
      } else if (line.trim() !== "") {
        // פסקה רגילה
        return (
          <Text key={index} style={styles.paragraph}>
            {line.trim()}
          </Text>
        );
      }
      // רווח ריק
      return <View key={index} style={styles.spacer} />;
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* כותרת עם כפתור חזרה */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title}</Text>
          <View style={styles.placeholder} />
        </View>

        {/* תוכן */}
        <ScrollView
          style={styles.contentContainer}
          contentContainerStyle={styles.contentInner}
          showsVerticalScrollIndicator={true}
        >
          {/* מידע על הגרסה ותאריך העדכון */}
          <View style={styles.versionInfo}>
            <Text style={styles.versionText}>
              גרסה {contentType === "terms" ? TERMS_VERSION : PRIVACY_VERSION}
            </Text>
            <Text style={styles.updateText}>
              עודכן:{" "}
              {contentType === "terms"
                ? TERMS_LAST_UPDATED
                : PRIVACY_LAST_UPDATED}
            </Text>
          </View>

          {renderFormattedContent()}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
  },
  placeholder: {
    width: 40, // שומר על איזון הכותרת במרכז
  },
  contentContainer: {
    flex: 1,
  },
  contentInner: {
    padding: theme.spacing.lg,
  },
  mainHeading: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: "right",
  },
  subHeading: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    textAlign: "right",
  },
  paragraph: {
    fontSize: 15,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    lineHeight: 22,
    textAlign: "right",
  },
  listItem: {
    fontSize: 15,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    marginRight: theme.spacing.md,
    lineHeight: 22,
    textAlign: "right",
  },
  spacer: {
    height: theme.spacing.xs,
  },
  versionInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    marginBottom: theme.spacing.md,
  },
  versionText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  updateText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
});
