/**
 * @file src/screens/notifications/NotificationsScreen.tsx
 * @brief מסך התראות - ניהול התראות וקבלת עדכונים
 * @dependencies React Native, MaterialCommunityIcons
 * @notes מסך לעתיד - כרגע placeholder
 */

import React from "react";
import { View, Text, StyleSheet, ScrollView, Switch } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import BackButton from "../../components/common/BackButton";

export default function NotificationsScreen() {
  const [workoutReminders, setWorkoutReminders] = React.useState(true);
  const [weeklyReports, setWeeklyReports] = React.useState(false);
  const [achievements, setAchievements] = React.useState(true);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <BackButton />

        {/* Header */}
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="bell"
            size={80}
            color={theme.colors.primary}
          />
          <Text style={styles.title}>התראות</Text>
          <Text style={styles.subtitle}>
            נהל את ההתראות שלך כדי להישאר מעודכן
          </Text>
        </View>

        {/* הגדרות התראות */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>הגדרות התראות</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MaterialCommunityIcons
                name="dumbbell"
                size={24}
                color={theme.colors.primary}
              />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingText}>תזכורות אימון</Text>
                <Text style={styles.settingDescription}>
                  קבל תזכורת כשהגיע הזמן להתאמן
                </Text>
              </View>
            </View>
            <Switch
              value={workoutReminders}
              onValueChange={setWorkoutReminders}
              trackColor={{
                false: theme.colors.textSecondary + "30",
                true: theme.colors.primary + "50",
              }}
              thumbColor={
                workoutReminders ? theme.colors.primary : theme.colors.text
              }
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MaterialCommunityIcons
                name="chart-line"
                size={24}
                color={theme.colors.primary}
              />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingText}>דוחות שבועיים</Text>
                <Text style={styles.settingDescription}>
                  סיכום שבועי של ההתקדמות שלך
                </Text>
              </View>
            </View>
            <Switch
              value={weeklyReports}
              onValueChange={setWeeklyReports}
              trackColor={{
                false: theme.colors.textSecondary + "30",
                true: theme.colors.primary + "50",
              }}
              thumbColor={
                weeklyReports ? theme.colors.primary : theme.colors.text
              }
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MaterialCommunityIcons
                name="trophy"
                size={24}
                color={theme.colors.primary}
              />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingText}>הישגים</Text>
                <Text style={styles.settingDescription}>
                  התראות על הישגים חדשים ויעדים שהושגו
                </Text>
              </View>
            </View>
            <Switch
              value={achievements}
              onValueChange={setAchievements}
              trackColor={{
                false: theme.colors.textSecondary + "30",
                true: theme.colors.primary + "50",
              }}
              thumbColor={
                achievements ? theme.colors.primary : theme.colors.text
              }
            />
          </View>
        </View>

        {/* הודעה זמנית */}
        <View style={styles.comingSoonSection}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={48}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.comingSoonTitle}>בקרוב</Text>
          <Text style={styles.comingSoonText}>
            מערכת ההתראות תהיה זמינה בגרסה הבאה
          </Text>
        </View>
      </ScrollView>
    </View>
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
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: theme.spacing.sm,
    lineHeight: 24,
  },
  settingsSection: {
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  settingItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  settingLeft: {
    flexDirection: "row-reverse",
    alignItems: "center",
    flex: 1,
  },
  settingTextContainer: {
    marginRight: theme.spacing.md,
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "right",
  },
  settingDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 2,
    textAlign: "right",
  },
  comingSoonSection: {
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    marginTop: theme.spacing.lg,
  },
  comingSoonTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  comingSoonText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: theme.spacing.sm,
    lineHeight: 24,
  },
});
