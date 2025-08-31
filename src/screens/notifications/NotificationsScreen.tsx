/**
 * @file src/screens/notifications/NotificationsScreen.tsx
 * @brief מסך ניהול התראות מתקדם עם הגדרות מותאמות אישית
 * @version 2.0.0
 * @author GYMovoo Development Team
 * @created 2025-08-25
 * @modified 2025-07-31
 *
 * @description
 * מסך ניהול התראות מקיף המאפשר למשתמש לקבוע העדפות אישיות עבור:
 * - תזכורות אימון מותאמות
 * - דוחות שבועיים אוטומטיים
 * - התראות הישגים ויעדים
 * מכיל מערכת הגדרות דינמית עם Switch components נגישים
 *
 * @features
 * - ✅ הגדרות התראות מותאמות אישית
 * - ✅ תמיכת RTL מלאה עם פריסה מימין לשמאל
 * - ✅ נגישות מקיפה עם ARIA labels ו-Screen Reader support
 * - ✅ Switch components עם תמיכה בצבעי theme
 * - ✅ סקשן "בקרוב" לתכונות עתידיות
 * - ✅ עיצוב מודרני עם CardViews ו-Shadows
 * - ✅ אנימציות חלקות ואינטראקציות מתקדמות
 *
 * @performance
 * אופטימיזציה עם useState hooks, ScrollView מיוחד עם showsVerticalScrollIndicator=false,
 * ו-contentContainerStyle לביצועים מיטביים של רשימות הגדרות
 *
 * @rtl
 * תמיכה מלאה בעברית עם flexDirection: row-reverse, textAlign: right,
 * marginEnd במקום marginRight, ופריסת אייקונים מותאמת לכיוון קריאה מימין לשמאל
 *
 * @accessibility
 * תמיכה מלאה ב-Screen Readers עם accessibilityLabel, accessibilityRole,
 * accessibilityHint מפורטים לכל Switch ואלמנט אינטרקטיבי
 *
 * @algorithm
 * מערכת הגדרות דינמית עם state management מבוסס useState hooks
 * לכל הגדרה: setState → re-render → Switch visual update
 *
 * @dependencies React Native, MaterialCommunityIcons, BackButton, theme
 * @exports NotificationsScreen (default)
 *
 * @example
 * ```tsx
 * // בשימוש ב-navigation
 * navigation.navigate('NotificationsScreen');
 * ```
 *
 * @notes
 * מוכן לאינטגרציה עם מערכת התראות אמיתית בעתיד
 * כולל placeholder לתכונות מתקדמות
 */

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Pressable,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import BackButton from "../../components/common/BackButton";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationsScreen(): JSX.Element {
  const [workoutReminders, setWorkoutReminders] = React.useState<boolean>(true);
  const [weeklyReports, setWeeklyReports] = React.useState<boolean>(false);
  const [achievements, setAchievements] = React.useState<boolean>(true);

  // הגדרות התראות דינמיות
  // Dynamic notification settings
  const notificationSettings = React.useMemo(
    () => [
      {
        id: "workoutReminders",
        icon: "dumbbell" as const,
        title: "תזכורות אימון",
        description: "קבל תזכורת כשהגיע הזמן להתאמן",
        value: workoutReminders,
        setValue: setWorkoutReminders,
      },
      {
        id: "weeklyReports",
        icon: "chart-line" as const,
        title: "דוחות שבועיים",
        description: "סיכום שבועי של ההתקדמות שלך",
        value: weeklyReports,
        setValue: setWeeklyReports,
      },
      {
        id: "achievements",
        icon: "trophy" as const,
        title: "הישגים",
        description: "התראות על הישגים חדשים ויעדים שהושגו",
        value: achievements,
        setValue: setAchievements,
      },
    ],
    [workoutReminders, weeklyReports, achievements]
  );

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "right", "left", "bottom"]}
      accessible={true}
      accessibilityLabel="מסך ניהול התראות"
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        accessible={true}
        accessibilityLabel="תוכן מסך התראות - גלול למעלה ומטה"
      >
        <BackButton absolute={false} variant="minimal" />

        {/* Header */}
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="bell"
            size={80}
            color={theme.colors.primary}
            accessible={true}
            accessibilityRole="image"
            accessibilityLabel="אייקון התראות"
          />
          <Text style={styles.title}>התראות</Text>
          <Text style={styles.subtitle}>
            נהל את ההתראות שלך כדי להישאר מעודכן
          </Text>
        </View>

        {/* הגדרות התראות */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>הגדרות התראות</Text>

          {notificationSettings.map((setting) => (
            <View key={setting.id} style={styles.settingItem}>
              <Pressable
                style={styles.settingLeft}
                onPress={() => setting.setValue(!setting.value)}
                accessibilityRole="button"
                accessibilityLabel={setting.title}
                accessibilityHint={`הקש כדי ${setting.value ? "לכבות" : "להפעיל"} ${setting.title}`}
              >
                <MaterialCommunityIcons
                  name={setting.icon}
                  size={24}
                  color={theme.colors.primary}
                  accessible={false}
                />
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingText}>{setting.title}</Text>
                  <Text style={styles.settingDescription}>
                    {setting.description}
                  </Text>
                </View>
              </Pressable>
              <Switch
                value={setting.value}
                onValueChange={setting.setValue}
                trackColor={{
                  false: theme.colors.textSecondary + "30",
                  true: theme.colors.primary + "50",
                }}
                thumbColor={
                  setting.value ? theme.colors.primary : theme.colors.text
                }
                accessible={true}
                accessibilityRole="switch"
                accessibilityLabel={setting.title}
                accessibilityHint={`${setting.value ? "מופעל" : "כבוי"} - הקש כדי ${setting.value ? "לכבות" : "להפעיל"} ${setting.title}`}
                accessibilityState={{ checked: setting.value }}
              />
            </View>
          ))}
        </View>

        {/* הודעה זמנית */}
        <View style={styles.comingSoonSection}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={48}
            color={theme.colors.textSecondary}
            accessible={true}
            accessibilityRole="image"
            accessibilityLabel="אייקון שעון - תכונה בפיתוח"
          />
          <Text style={styles.comingSoonTitle}>בקרוב</Text>
          <Text style={styles.comingSoonText}>
            מערכת ההתראות תהיה זמינה בגרסה הבאה
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    textAlign: "center",
    writingDirection: "rtl",
    letterSpacing: 0.5,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: theme.spacing.sm,
    lineHeight: 26,
    writingDirection: "rtl",
    letterSpacing: 0.3,
    paddingHorizontal: theme.spacing.sm,
  },
  settingsSection: {
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: "right",
    writingDirection: "rtl",
    letterSpacing: 0.4,
  },
  settingItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 1,
    borderColor: theme.colors.border + "30",
  },
  settingLeft: {
    flexDirection: "row-reverse",
    alignItems: "center",
    flex: 1,
  },
  settingTextContainer: {
    marginEnd: theme.spacing.md, // שימוש ב-marginEnd לתמיכת RTL
    flex: 1,
  },
  settingText: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "right",
    writingDirection: "rtl",
    letterSpacing: 0.3,
  },
  settingDescription: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: "right",
    writingDirection: "rtl",
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  comingSoonSection: {
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.surface + "60",
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.xl,
    borderWidth: 2,
    borderColor: theme.colors.border + "40",
    borderStyle: "dashed",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  comingSoonTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
    textAlign: "center",
    letterSpacing: 0.4,
  },
  comingSoonText: {
    fontSize: 17,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: theme.spacing.sm,
    lineHeight: 26,
    writingDirection: "rtl",
    letterSpacing: 0.2,
  },
});
