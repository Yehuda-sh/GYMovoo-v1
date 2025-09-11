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

import { theme } from "../../../styles/theme";

// טיפוסים
interface TermsScreenParams {
  type?: "terms" | "privacy";
}

// תוכן תנאי השימוש
const TERMS_CONTENT = `
## תנאי שימוש GYMovoo

ברוכים הבאים לאפליקציית GYMovoo. האפליקציה מאפשרת לך לנהל את האימונים שלך, לעקוב אחר ההתקדמות ולשפר את הביצועים שלך.

### 1. הגדרות
- "האפליקציה" - אפליקציית GYMovoo
- "המשתמש" או "אתה" - כל אדם המשתמש באפליקציה
- "אנחנו" או "החברה" - החברה המפעילה את האפליקציה

### 2. הסכמה לתנאים
השימוש באפליקציה מהווה הסכמה לתנאי השימוש המפורטים במסמך זה. אם אינך מסכים לתנאים אלה, אנא הימנע משימוש באפליקציה.

### 3. פרטיות
אנו מכבדים את פרטיותך. כל המידע הנאסף על ידי האפליקציה כפוף למדיניות הפרטיות שלנו.

### 4. חשבון משתמש
יצירת חשבון באפליקציה מחייבת מסירת מידע מדויק ועדכני. אתה אחראי לשמור על סודיות הסיסמה שלך ולכל פעילות המתרחשת תחת החשבון שלך.

### 5. שימוש באפליקציה
אתה מתחייב להשתמש באפליקציה באופן חוקי ובהתאם לתנאי השימוש. חל איסור להשתמש באפליקציה למטרות לא חוקיות או פוגעניות.

### 6. מגבלת גיל
השימוש באפליקציה מותר למשתמשים מגיל 16 ומעלה. אם אתה מתחת לגיל 18, עליך לקבל אישור מהורה או אפוטרופוס חוקי לפני השימוש באפליקציה.

### 7. שינויים בתנאי השימוש
אנו שומרים לעצמנו את הזכות לשנות את תנאי השימוש בכל עת. שינויים אלה ייכנסו לתוקף מיד עם פרסומם באפליקציה.

### 8. סיום ההסכם
אנו שומרים לעצמנו את הזכות להשעות או לסיים את החשבון שלך אם נקבע כי הפרת את תנאי השימוש.

### 9. יצירת קשר
לשאלות או בירורים לגבי תנאי השימוש, אנא צור קשר בכתובת: support@gymovoo.com
`;

// תוכן מדיניות הפרטיות
const PRIVACY_CONTENT = `
## מדיניות פרטיות GYMovoo

מדיניות פרטיות זו מסבירה כיצד אנו אוספים, משתמשים ומגנים על המידע האישי שלך בעת השימוש באפליקציית GYMovoo.

### 1. איסוף מידע
אנו אוספים מידע שאתה מספק לנו באופן ישיר, כגון:
- פרטי הרשמה (שם, כתובת אימייל, סיסמה)
- מידע על אימונים ופעילות גופנית
- העדפות אישיות ויעדים
- פידבק ותקשורת עם צוות התמיכה

### 2. שימוש במידע
אנו משתמשים במידע שנאסף למטרות הבאות:
- אספקת השירותים והתכונות של האפליקציה
- התאמה אישית של חווית המשתמש
- שיפור האפליקציה והשירותים שלנו
- תקשורת עם המשתמשים לגבי עדכונים ושינויים

### 3. שיתוף מידע
אנו לא נמכור או נשכיר את המידע האישי שלך לצדדים שלישיים. עם זאת, אנו עשויים לשתף מידע במקרים הבאים:
- עם ספקי שירות הפועלים בשמנו
- כאשר נדרש על פי חוק
- במקרה של מיזוג או רכישה של החברה

### 4. אבטחת מידע
אנו מיישמים אמצעי אבטחה מתאימים כדי להגן על המידע האישי שלך מפני גישה, שימוש או חשיפה בלתי מורשים.

### 5. העברת נתונים
המידע שלך עשוי להיות מאוחסן ומעובד בשרתים הממוקמים מחוץ למדינת מגוריך, היכן שחוקי הגנת המידע עשויים להיות שונים.

### 6. זכויותיך
בהתאם לחוקי הגנת המידע הרלוונטיים, יש לך זכויות מסוימות בנוגע למידע האישי שלך, כולל הזכות לגשת, לתקן ולמחוק את המידע שלך.

### 7. שינויים במדיניות הפרטיות
אנו עשויים לעדכן את מדיניות הפרטיות מעת לעת. אנו נודיע לך על שינויים משמעותיים באמצעות הודעה באפליקציה.

### 8. יצירת קשר
לשאלות או בירורים לגבי מדיניות הפרטיות שלנו, אנא צור קשר בכתובת: privacy@gymovoo.com
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
});
