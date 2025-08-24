/**
 * @file src/screens/auth/TermsScreen.tsx
 * @description מסך תנאי שימוש פשוט וברור
 * English: Simple and clear terms of service screen
 * @dependencies theme, BackButton
 * @notes RTL support, haptic feedback, simple agreement flow
 * @version 2.0.0 - Simplified version without AI complexity
 * @updated 2025-08-15 Removed AI analytics and progress tracking per user request
 */

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Vibration,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageKeys } from "../../constants/StorageKeys";
import { theme } from "../../styles/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../components/common/BackButton";
import { useNavigation } from "@react-navigation/native";

// ===============================================
// 📋 Simple Terms Types - טיפוסי תנאים פשוטים
// ===============================================

/** @description סטטוס הסכמה לתנאים / Terms agreement status */
interface TermsAgreement {
  agreed: boolean;
  agreedAt?: string;
  version: string;
}

/**
 * מפעיל haptic feedback פשוט / Simple haptic feedback
 */
const triggerHaptic = () => {
  if (Platform.OS === "ios") {
    Vibration.vibrate(25);
  } else {
    Vibration.vibrate(50);
  }
};

const TermsScreen = React.memo(() => {
  const navigation = useNavigation();

  // 📝 States - מצבים בסיסיים / Basic states
  const [agreed, setAgreed] = useState<boolean>(false);

  // 📱 Handle agreement / טיפול בהסכמה
  const handleAgreement = useCallback(async () => {
    triggerHaptic();
    setAgreed(true);

    // שמירת הסכמה ב-AsyncStorage
    try {
      const agreement: TermsAgreement = {
        agreed: true,
        agreedAt: new Date().toISOString(),
        version: "v1.0",
      };
      await AsyncStorage.setItem(
        StorageKeys.TERMS_AGREEMENT,
        JSON.stringify(agreement)
      );

      // חזרה למסך הקודם עם הסימון
      setTimeout(() => {
        navigation.goBack();
      }, 1000); // המתנה של שנייה כדי שהמשתמש יראה את הסימון
    } catch (error) {
      if (__DEV__) {
        console.warn("Failed to save agreement:", error);
      }
    }
  }, [navigation]);

  // 📱 Handle back navigation / טיפול בניווט חזרה
  const handleBack = useCallback(() => {
    triggerHaptic();
    navigation.goBack();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <BackButton onPress={handleBack} />
          <View style={styles.headerContent}>
            <Text style={styles.title}>תנאי שימוש</Text>
          </View>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          accessible={true}
          accessibilityRole="scrollbar"
          accessibilityLabel="תוכן תנאי השימוש"
        >
          {/* הקדמה */}
          <View style={styles.introCard}>
            <LinearGradient
              colors={[
                theme.colors.primaryGradientStart + "20",
                theme.colors.primaryGradientEnd + "20",
              ]}
              style={styles.gradientBorder}
            >
              <View style={styles.introContent}>
                <MaterialCommunityIcons
                  name="shield-check"
                  size={48}
                  color={theme.colors.primary}
                  accessible={false}
                  importantForAccessibility="no"
                />
                <Text style={styles.introTitle}>ברוכים הבאים ל-GYMovoo</Text>
                <Text style={styles.introText}>
                  התנאים הבאים מסדירים את השימוש באפליקציה שלנו
                </Text>
              </View>
            </LinearGradient>
          </View>

          {/* תנאים עיקריים */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>תנאים כלליים</Text>

            <TouchableOpacity
              style={styles.termCard}
              onPress={triggerHaptic}
              accessible={true}
              accessibilityRole="button"
            >
              <View style={styles.termNumber}>
                <Text style={styles.termNumberText}>1</Text>
              </View>
              <View style={styles.termTextContainer}>
                <Text style={styles.termText}>
                  השימוש באפליקציה מותנה בקבלת תנאי השימוש במלואם
                </Text>
                <Text style={styles.termSubtext}>תנאי שימוש בסיסי</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.termCard}
              onPress={triggerHaptic}
              accessible={true}
              accessibilityRole="button"
            >
              <View style={styles.termNumber}>
                <Text style={styles.termNumberText}>2</Text>
              </View>
              <View style={styles.termTextContainer}>
                <Text style={styles.termText}>
                  המשתמש אחראי לשמירה על פרטי הכניסה שלו בסודיות
                </Text>
                <Text style={styles.termSubtext}>אבטחת חשבון</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.termCard}
              onPress={triggerHaptic}
              accessible={true}
              accessibilityRole="button"
            >
              <View style={styles.termNumber}>
                <Text style={styles.termNumberText}>3</Text>
              </View>
              <View style={styles.termTextContainer}>
                <Text style={styles.termText}>
                  אנו שומרים על זכות לעדכן את התנאים בהתראה מוקדמת
                </Text>
                <Text style={styles.termSubtext}>עדכונים עתידיים</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* מדיניות פרטיות */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>מדיניות פרטיות</Text>

            <TouchableOpacity
              style={styles.termCard}
              onPress={triggerHaptic}
              accessible={true}
              accessibilityRole="button"
            >
              <View style={styles.termNumber}>
                <Text style={styles.termNumberText}>4</Text>
              </View>
              <View style={styles.termTextContainer}>
                <Text style={styles.termText}>
                  אנו אוספים נתונים רק לשיפור השירות ולמטרות פונקציונליות
                </Text>
                <Text style={styles.termSubtext}>איסוף נתונים</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.termCard}
              onPress={triggerHaptic}
              accessible={true}
              accessibilityRole="button"
            >
              <View style={styles.termNumber}>
                <Text style={styles.termNumberText}>5</Text>
              </View>
              <View style={styles.termTextContainer}>
                <Text style={styles.termText}>
                  פרטיכם מוגנים ולא יועברו לצדדים שלישיים ללא הסכמתכם
                </Text>
                <Text style={styles.termSubtext}>הגנת פרטיות</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.termCard}
              onPress={triggerHaptic}
              accessible={true}
              accessibilityRole="button"
            >
              <View style={styles.termNumber}>
                <Text style={styles.termNumberText}>6</Text>
              </View>
              <View style={styles.termTextContainer}>
                <Text style={styles.termText}>
                  ניתן לבקש מחיקת נתונים אישיים בכל עת דרך הגדרות החשבון
                </Text>
                <Text style={styles.termSubtext}>זכויות המשתמש</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* יצירת קשר */}
          <View style={styles.contactCard}>
            <MaterialCommunityIcons
              name="email"
              size={24}
              color={theme.colors.accent}
              accessible={false}
              importantForAccessibility="no"
            />
            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>שאלות או הבהרות?</Text>
              <Text style={styles.contactText}>אנחנו כאן לעזור</Text>
              <TouchableOpacity
                onPress={() => {
                  triggerHaptic();
                  if (__DEV__) {
                    console.warn("Opening email app...");
                  }
                }}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="פניה לתמיכה במייל"
              >
                <Text style={styles.contactEmail}>support@gymovoo.com</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* אישור סופי */}
          <View style={styles.finalCard}>
            <LinearGradient
              colors={[
                theme.colors.primaryGradientStart,
                theme.colors.primaryGradientEnd,
              ]}
              style={styles.finalGradient}
            >
              <MaterialCommunityIcons
                name="check-circle"
                size={24}
                color="#fff"
                accessible={false}
                importantForAccessibility="no"
              />
              <Text style={styles.finalText}>
                שימוש באפליקציה מהווה אישור לכל תנאי השימוש והפרטיות
              </Text>
            </LinearGradient>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* כפתור הסכמה */}
        <View style={styles.agreementContainer}>
          <TouchableOpacity
            style={[styles.agreeButton, agreed && styles.agreeButtonActive]}
            onPress={handleAgreement}
            disabled={agreed}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={agreed ? "הסכמת לתנאים" : "לחץ להסכים לתנאים"}
            accessibilityState={{ disabled: agreed }}
          >
            <MaterialCommunityIcons
              name={agreed ? "check-circle" : "check"}
              size={20}
              color={agreed ? "#fff" : theme.colors.primary}
            />
            <Text
              style={[
                styles.agreeButtonText,
                agreed && styles.agreeButtonTextActive,
              ]}
            >
              {agreed ? "הסכמתי לתנאים" : "אני מסכים לתנאי השימוש"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.cardBorder,
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
    textAlign: "center",
    writingDirection: "rtl",
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },
  introCard: {
    marginBottom: 24,
  },
  gradientBorder: {
    borderRadius: 16,
    padding: 2,
  },
  introContent: {
    backgroundColor: theme.colors.card,
    borderRadius: 14,
    padding: 24,
    alignItems: "center",
  },
  introTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    marginTop: 12,
    marginBottom: 8,
    textAlign: "center",
    writingDirection: "rtl",
  },
  introText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    writingDirection: "rtl",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 12,
    textAlign: "right",
    writingDirection: "rtl",
  },
  termCard: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    ...theme.shadows.small,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  termNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginEnd: 16,
  },
  termNumberText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  termText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
    textAlign: "right",
    marginBottom: 4,
    writingDirection: "rtl",
  },
  termTextContainer: {
    flex: 1,
  },
  termSubtext: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: "right",
    fontStyle: "italic",
    writingDirection: "rtl",
  },
  contactCard: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    ...theme.shadows.small,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  contactContent: {
    flex: 1,
    marginEnd: 16,
    alignItems: "flex-end",
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 4,
    writingDirection: "rtl",
  },
  contactText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 4,
    writingDirection: "rtl",
  },
  contactEmail: {
    fontSize: 14,
    color: theme.colors.accent,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  finalCard: {
    marginTop: 8,
  },
  finalGradient: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderRadius: 16,
    gap: 12,
  },
  finalText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    writingDirection: "rtl",
  },
  bottomSpacer: {
    height: 40,
  },
  agreementContainer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.cardBorder,
  },
  agreeButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    gap: 8,
  },
  agreeButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  agreeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.primary,
    writingDirection: "rtl",
  },
  agreeButtonTextActive: {
    color: "#fff",
  },
});

TermsScreen.displayName = "TermsScreen";

export default TermsScreen;
