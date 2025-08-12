/**
 * @file src/screens/auth/TermsScreen.tsx
 * @description מסך תנאי שימוש - מציג את התנאים והמדיניות של האפליקציה
 * English: Terms of service screen - displays app terms and policies
 * @dependencies theme, BackButton, RootStackParamList
 * @notes עיצוב מותאם למסכי Workout עם כרטיסים ומראה מודרני, תמיכה מלאה ב-RTL, אנימציות כניסה
 * @recurring_errors וודא RTL מלא בכל האלמנטים, השתמש ב-theme בלבד
 * @updated 2025-07-30 שיפור RTL, הוספת אנימציות, שיפור חווית משתמש
 */

import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../styles/theme";
import BackButton from "../../components/common/BackButton";

export default function TermsScreen() {
  // אנימציות // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // אנימציית כניסה חלקה // Smooth entry animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton absolute={false} />

        <Text style={styles.title}>תנאי שימוש</Text>

        <View style={styles.headerSpacer} />
      </View>

      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        {/* כרטיס הקדמה // Introduction card */}
        <View style={styles.introCard}>
          <LinearGradient
            colors={[
              theme.colors.primaryGradientStart,
              theme.colors.primaryGradientEnd,
            ]}
            style={styles.gradientBorder}
          >
            <View style={styles.introContent}>
              <MaterialCommunityIcons
                name="shield-check"
                size={32}
                color={theme.colors.primary}
                accessible={false}
                importantForAccessibility="no"
              />
              <Text style={styles.introTitle}>ברוכים הבאים ל-GYMovoo!</Text>
              <Text style={styles.introText}>
                השימוש באפליקציה מהווה הסכמה לכל התנאים שלהלן
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* תנאי השימוש // Terms sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>תנאים כלליים</Text>

          <View style={styles.termCard}>
            <View style={styles.termNumber}>
              <Text style={styles.termNumberText}>1</Text>
            </View>
            <View style={styles.termTextContainer}>
              <Text style={styles.termText}>
                המידע באפליקציה אינו מהווה ייעוץ רפואי אישי
              </Text>
              <Text style={styles.termSubtext}>חשוב להיוועץ ברופא המשפחה</Text>
            </View>
          </View>

          <View style={styles.termCard}>
            <View style={styles.termNumber}>
              <Text style={styles.termNumberText}>2</Text>
            </View>
            <View style={styles.termTextContainer}>
              <Text style={styles.termText}>
                יש להיוועץ ברופא לפני תחילת כל תוכנית אימון
              </Text>
              <Text style={styles.termSubtext}>
                במיוחד אם יש בעיות בריאות קיימות
              </Text>
            </View>
          </View>

          <View style={styles.termCard}>
            <View style={styles.termNumber}>
              <Text style={styles.termNumberText}>3</Text>
            </View>
            <View style={styles.termTextContainer}>
              <Text style={styles.termText}>אין לשתף את החשבון עם אחרים</Text>
              <Text style={styles.termSubtext}>
                כל חשבון מותאם אישית למשתמש
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>מדיניות ופרטיות</Text>

          <View style={styles.termCard}>
            <View
              style={[
                styles.termNumber,
                { backgroundColor: theme.colors.warning },
              ]}
            >
              <Text style={styles.termNumberText}>4</Text>
            </View>
            <View style={styles.termTextContainer}>
              <Text style={styles.termText}>
                כל שימוש לרעה בתוכן – חשוף לחסימה מיידית
              </Text>
              <Text style={styles.termSubtext}>כולל הפצת תוכן לא מורשה</Text>
            </View>
          </View>

          <View style={styles.termCard}>
            <View style={styles.termNumber}>
              <Text style={styles.termNumberText}>5</Text>
            </View>
            <View style={styles.termTextContainer}>
              <Text style={styles.termText}>
                פרטיותך חשובה לנו: מידע אישי לא יועבר לגורמים חיצוניים ללא הסכמה
              </Text>
              <Text style={styles.termSubtext}>נתונים מוצפנים ומאובטחים</Text>
            </View>
          </View>

          <View style={styles.termCard}>
            <View
              style={[
                styles.termNumber,
                { backgroundColor: theme.colors.error },
              ]}
            >
              <Text style={styles.termNumberText}>6</Text>
            </View>
            <View style={styles.termTextContainer}>
              <Text style={styles.termText}>
                הפרה של תנאי השימוש תוביל להגבלות או חסימת גישה
              </Text>
              <Text style={styles.termSubtext}>
                החלטה סופית בידי הנהלת האפליקציה
              </Text>
            </View>
          </View>
        </View>

        {/* יצירת קשר // Contact */}
        <View style={styles.contactCard}>
          <MaterialCommunityIcons
            name="email-outline"
            size={24}
            color={theme.colors.primary}
            accessible={false}
            importantForAccessibility="no"
          />
          <View style={styles.contactContent}>
            <Text style={styles.contactTitle}>יש לך שאלות?</Text>
            <Text style={styles.contactText}>ניתן לפנות אלינו במייל:</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                // אפשרות לפתיחת אפליקציית מייל
                console.warn("Opening email app...");
              }}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="פניה לתמיכה במייל"
              accessibilityHint="לחץ לפתיחת אפליקציית המייל לשליחת הודעה לתמיכה"
            >
              <Text style={styles.contactEmail}>support@gymovoo.com</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* אישור סופי // Final confirmation */}
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
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  headerSpacer: {
    width: 40,
  },
  title: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  scrollContent: {
    padding: 16,
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
  },
  introText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
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
    marginEnd: 12, // שינוי RTL: marginEnd במקום marginLeft
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
  },
  termTextContainer: {
    flex: 1,
  },
  termSubtext: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: "right",
    fontStyle: "italic",
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
    marginEnd: 16, // שינוי RTL: marginEnd במקום marginLeft
    alignItems: "flex-end",
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 4,
  },
  contactText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 4,
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
  },
  bottomSpacer: {
    height: 40,
  },
});
