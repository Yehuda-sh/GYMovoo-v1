import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurOverlay } from "../components";
import { usePremiumAccess } from "../hooks/usePremiumAccess";
import { theme } from "../styles/theme";

/**
 * דוגמה למסך עם תוכן פרימיום
 * מדגים שימוש ב-BlurOverlay לחסימת תוכן למשתמשים ללא מנוי
 */
export const PremiumContentExample: React.FC = () => {
  const { shouldShowBlur, getBlurMessage, getSubscriptionStatus } =
    usePremiumAccess();

  const blurMessage = getBlurMessage();
  const subscriptionStatus = getSubscriptionStatus();

  const handleUpgradePress = () => {
    // כאן יהיה ניווט למסך שדרוג המנוי
    console.warn("Navigate to subscription upgrade screen");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>תוכן פרימיום</Text>
        <Text style={styles.subscriptionStatus}>
          {subscriptionStatus.message}
        </Text>
      </View>

      {/* תוכן בסיסי - תמיד נגיש */}
      <View style={styles.basicSection}>
        <Text style={styles.sectionTitle}>תוכן בסיסי</Text>
        <Text style={styles.content}>
          זה תוכן בסיסי שזמין לכל המשתמשים. כולל טיפים כלליים ומידע בסיסי על
          אימונים.
        </Text>
      </View>

      {/* תוכן פרימיום - עם Blur overlay אם צריך */}
      <BlurOverlay
        isVisible={shouldShowBlur("premium")}
        title={blurMessage.title}
        description={blurMessage.description}
        actionText={blurMessage.actionText}
        onActionPress={handleUpgradePress}
      >
        <View style={styles.premiumSection}>
          <Text style={styles.sectionTitle}>תוכן פרימיום 🔥</Text>
          <ScrollView style={styles.premiumContent}>
            <Text style={styles.content}>תוכן פרימיום מתקדם שכולל:</Text>
            <View style={styles.featureList}>
              <Text style={styles.feature}>• תוכניות אימון מותאמות אישית</Text>
              <Text style={styles.feature}>• מעקב מתקדם אחר התקדמות</Text>
              <Text style={styles.feature}>• המלצות תזונה מותאמות</Text>
              <Text style={styles.feature}>• גישה לכל הציוד והתרגילים</Text>
              <Text style={styles.feature}>• ניתוח מפורט של הביצועים</Text>
            </View>

            <TouchableOpacity style={styles.premiumButton}>
              <Text style={styles.premiumButtonText}>
                צפה בתוכנית האימון המלאה
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </BlurOverlay>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: 20,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
    writingDirection: "rtl",
    marginBottom: 8,
  },
  subscriptionStatus: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    writingDirection: "rtl",
  },
  basicSection: {
    padding: 20,
    backgroundColor: theme.colors.surface,
    margin: 16,
    borderRadius: 12,
  },
  premiumSection: {
    padding: 20,
    backgroundColor: theme.colors.primary + "10",
    margin: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.primary + "30",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 12,
    writingDirection: "rtl",
  },
  content: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 24,
    writingDirection: "rtl",
    textAlign: "right",
  },
  premiumContent: {
    maxHeight: 300,
  },
  featureList: {
    marginTop: 16,
    marginBottom: 20,
  },
  feature: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 8,
    writingDirection: "rtl",
    textAlign: "right",
  },
  premiumButton: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  premiumButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    writingDirection: "rtl",
  },
});
