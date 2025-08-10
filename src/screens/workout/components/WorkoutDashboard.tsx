/**
 * @file src/screens/workout/components/WorkoutDashboard.tsx
 * @brief דשבורד אימון אינטרקטיבי עם סטטיסטיקות חיות ווריאנטים מגוונים
 * @version 3.0.0
 * @author GYMovoo Development Team
 * @created 2024-12-15
 * @modified 2025-08-05
 * @optimized true - שופר ואופטמם במסגרת ניקוי כפילויות קוד
 *
 * @description
 * רכיב דשבורד מתקדם המציג סטטיסטיקות אימון בזמן אמת עם תמיכה ב-4 ווריאנטים:
 * - default: תצוגה מלאה עם כל הסטטיסטיקות
 * - compact: תצוגה קומפקטית עם 3 סטטיסטיקות עיקריות
 * - bar: תצוגת בר דק בסגנון NextExerciseBar
 * - floating: תצוגה צפה עם גרדיאנט
 *
 * @features
 * - ✅ סטטיסטיקות חיות: נפח, סטים, קצב, שיאים אישיים
 * - ✅ טיימר אימון אינטגרלי
 * - ✅ אנימציות מתקדמות עם Animated API
 * - ✅ תמיכת RTL מלאה
 * - ✅ נגישות מקיפה עם ARIA labels
 * - ✅ 4 ווריאנטי תצוגה שונים
 * - ✅ כפתור סגירה דינמי מאוחד
 * - ✅ גרדיאנטים וצללים מתקדמים
 * - ✅ תמיכה במצב עריכה עם הצגה מותאמת
 * - ✅ רכיבים משותפים מאופטמים
 *
 * @performance
 * אופטימיזציה מתקדמת עם useRef לאנימציות, memo optimization עבור StatItem,
 * חישובי אחוז השלמה מקומיים ללא re-renders מיותרים.
 * שימוש ברכיבים משותפים להפחתת כפילויות קוד.
 *
 * @rtl
 * תמיכה מלאה בעברית עם flexDirection: row-reverse, textAlign: right,
 * ופריסת אייקונים מותאמת לכיוון קריאה מימין לשמאל
 *
 * @accessibility
 * תמיכה מלאה ב-Screen Readers עם accessibilityLabel, accessibilityRole,
 * accessibilityHint מפורטים לכל רכיב אינטרקטיבי
 *
 * @algorithm
 * חישוב אחוז השלמה: (completedSets / totalSets) * 100
 * אנימציית סקלה: 1 → 1.1 → 1 עם spring physics
 *
 * @dependencies MaterialCommunityIcons, FontAwesome5, LinearGradient, theme, shared components
 * @exports WorkoutDashboard
 *
 * @example
 * ```tsx
 * <WorkoutDashboard
 *   totalVolume={2450}
 *   completedSets={8}
 *   totalSets={12}
 *   pace={3.2}
 *   personalRecords={2}
 *   elapsedTime="25:30"
 *   variant="default"
 *   isEditMode={false}
 *   onHide={() => setShowDashboard(false)}
 * />
 * ```
 */
// cspell:ignore נפח, סטים, קצב, שיאים, ווריאנטים, גרדיאנט

import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../../styles/theme";
import { CloseButton, StatItem, type StatItemProps } from "./shared";
import type { WorkoutDashboardProps } from "./types";

// Constants (avoid magic numbers)
const BAR_TOP_OFFSET = 60;
const FLOATING_TOP_OFFSET = 100;

export const WorkoutDashboard: React.FC<WorkoutDashboardProps> = ({
  totalVolume,
  completedSets,
  totalSets,
  pace,
  personalRecords,
  elapsedTime,
  variant = "default",
  onHide,
  isEditMode = false,
}) => {
  // חישוב אחוז השלמה - מאופטם עם useMemo
  // Calculate completion percentage - optimized with useMemo
  const completionPercentage = useMemo(
    () => (totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0),
    [completedSets, totalSets]
  );

  const barProgressFillDynamic = useMemo(
    () => ({ width: `${completionPercentage}%` as const }),
    [completionPercentage]
  );

  // אופטימיזציה של נתוני הסטטיסטיקות עם useMemo
  // Optimize stats data with useMemo
  const stats: StatItemProps[] = useMemo(
    () => [
      {
        label: "נפח",
        value: `${Math.round(totalVolume)} ק"ג`,
        icon: "weight-hanging",
        iconFamily: "font5",
        color: theme.colors.primary,
      },
      {
        label: isEditMode ? "עריכה" : "סטים",
        value: isEditMode ? "✏️" : `${completedSets}/${totalSets}`,
        icon: isEditMode ? "pencil" : "format-list-checks",
        iconFamily: "material",
        color: isEditMode ? theme.colors.warning : theme.colors.success,
        animate: !isEditMode,
      },
      {
        label: "קצב",
        value: pace.toFixed(1),
        icon: "speedometer",
        iconFamily: "material",
        color: theme.colors.warning,
      },
      {
        label: "שיאים",
        value: personalRecords,
        icon: "trophy",
        iconFamily: "material",
        color: theme.colors.secondary,
        animate: personalRecords > 0 && !isEditMode,
      },
    ],
    [totalVolume, completedSets, totalSets, pace, personalRecords, isEditMode]
  );

  // הוספת זמן אימון לתחילת המערך אם קיים
  // Add elapsed time to beginning of array if exists
  const statsWithTime = useMemo(() => {
    if (elapsedTime) {
      return [
        {
          label: "זמן",
          value: elapsedTime,
          icon: "clock-outline",
          iconFamily: "material" as const,
          color: theme.colors.text,
        },
        ...stats,
      ];
    }
    return stats;
  }, [elapsedTime, stats]);

  // סגנון בר דק (כמו NextExerciseBar)
  // Thin bar style (like NextExerciseBar)
  if (variant === "bar") {
    return (
      <View style={styles.defaultContainer} testID="WorkoutDashboard-bar">
        <TouchableOpacity
          style={styles.barContainer}
          onPress={onHide}
          disabled={!onHide}
          activeOpacity={onHide ? 0.8 : 1}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="דשבורד אימון - תצוגת בר"
          accessibilityHint={
            onHide ? "הקש כדי להסתיר את הדשבורד" : "תצוגת סטטיסטיקות אימון"
          }
        >
          <LinearGradient
            colors={[theme.colors.card, theme.colors.background]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.barGradient}
          >
            <View style={styles.barContent}>
              {elapsedTime && (
                <View style={styles.barTimer}>
                  <MaterialCommunityIcons
                    name="timer"
                    size={16}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.barTimerText}>{elapsedTime}</Text>
                </View>
              )}

              <View style={styles.barStats}>
                <Text style={styles.barStatText}>
                  {completedSets}/{totalSets} סטים
                </Text>
                <Text style={styles.barSeparator}>•</Text>
                <Text style={styles.barStatText}>
                  {Math.round(totalVolume)} ק&quot;ג
                </Text>
                {personalRecords > 0 && (
                  <>
                    <Text style={styles.barSeparator}>•</Text>
                    <MaterialCommunityIcons
                      name="trophy"
                      size={14}
                      color={theme.colors.warning}
                    />
                    <Text
                      style={[
                        styles.barStatText,
                        { color: theme.colors.warning },
                      ]}
                    >
                      {personalRecords}
                    </Text>
                  </>
                )}
              </View>

              <View
                style={styles.barProgress}
                accessibilityRole="progressbar"
                accessibilityLabel="התקדמות סטים"
                accessibilityValue={{
                  min: 0,
                  max: 100,
                  now: completionPercentage,
                  text: `${completionPercentage}%`,
                }}
              >
                <View
                  style={[styles.barProgressFill, barProgressFillDynamic]}
                />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* כפתור סגירה מאוחד לכל הווריאנטים */}
        {onHide && (
          <CloseButton
            onPress={onHide}
            size="small"
            position="center"
            marginTop={theme.spacing.xs}
            accessibilityLabel="סגור דשבורד"
          />
        )}
      </View>
    );
  }

  // סגנון קומפקטי
  // Compact style
  if (variant === "compact") {
    return (
      <View style={styles.defaultContainer} testID="WorkoutDashboard-compact">
        <TouchableOpacity
          style={styles.compactContainer}
          onPress={onHide}
          disabled={!onHide}
          activeOpacity={onHide ? 0.8 : 1}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="דשבורד אימון - תצוגה קומפקטית"
          accessibilityHint={
            onHide
              ? "הקש כדי להסתיר את הדשבורד"
              : "תצוגת סטטיסטיקות אימון קומפקטית"
          }
        >
          {statsWithTime.slice(0, 3).map((stat, index) => (
            <React.Fragment key={stat.label}>
              {index > 0 && <View style={styles.compactDivider} />}
              <View style={styles.compactStat}>
                {stat.iconFamily === "material" ? (
                  <MaterialCommunityIcons
                    name={
                      stat.icon as React.ComponentProps<
                        typeof MaterialCommunityIcons
                      >["name"]
                    }
                    size={16}
                    color={stat.color}
                  />
                ) : (
                  <FontAwesome5
                    name={
                      stat.icon as React.ComponentProps<
                        typeof FontAwesome5
                      >["name"]
                    }
                    size={14}
                    color={stat.color}
                  />
                )}
                <Text style={styles.compactValue}>{stat.value}</Text>
              </View>
            </React.Fragment>
          ))}
        </TouchableOpacity>

        {/* כפתור סגירה מאוחד */}
        {onHide && (
          <CloseButton
            onPress={onHide}
            size="medium"
            position="center"
            accessibilityLabel="סגור דשבורד"
          />
        )}
      </View>
    );
  }

  // סגנון צף
  // Floating style
  if (variant === "floating") {
    return (
      <View style={styles.defaultContainer} testID="WorkoutDashboard-floating">
        <TouchableOpacity
          style={styles.floatingContainer}
          onPress={onHide}
          disabled={!onHide}
          activeOpacity={onHide ? 0.8 : 1}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="דשבורד אימון - תצוגה צפה"
          accessibilityHint={
            onHide ? "הקש כדי להסתיר את הדשבורד" : "תצוגת סטטיסטיקות אימון צפה"
          }
        >
          <LinearGradient
            colors={[
              theme.colors.primary + "20",
              theme.colors.primaryGradientEnd + "10",
            ]}
            style={styles.floatingGradient}
          >
            <View style={styles.floatingContent}>
              {statsWithTime.map((stat) => (
                <View key={stat.label} style={styles.floatingStat}>
                  {stat.iconFamily === "material" ? (
                    <MaterialCommunityIcons
                      name={
                        stat.icon as React.ComponentProps<
                          typeof MaterialCommunityIcons
                        >["name"]
                      }
                      size={20}
                      color={stat.color}
                    />
                  ) : (
                    <FontAwesome5
                      name={
                        stat.icon as React.ComponentProps<
                          typeof FontAwesome5
                        >["name"]
                      }
                      size={16}
                      color={stat.color}
                    />
                  )}
                  <View>
                    <Text style={styles.floatingValue}>{stat.value}</Text>
                    <Text style={styles.floatingLabel}>{stat.label}</Text>
                  </View>
                </View>
              ))}
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* כפתור סגירה מאוחד */}
        {onHide && (
          <CloseButton
            onPress={onHide}
            size="medium"
            position="center"
            marginTop={theme.spacing.sm}
            accessibilityLabel="סגור דשבורד"
          />
        )}
      </View>
    );
  }

  // ברירת מחדל - סגנון מקורי משופר
  // Default - improved original style
  return (
    <View style={styles.defaultContainer} testID="WorkoutDashboard-default">
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          if (onHide) {
            onHide();
          }
        }}
        disabled={!onHide}
        activeOpacity={onHide ? 0.8 : 1}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="דשבורד אימון מלא"
        accessibilityHint={
          onHide ? "הקש כדי להסתיר את הדשבורד" : "תצוגת סטטיסטיקות אימון מפורטת"
        }
      >
        {statsWithTime.map((stat) => (
          <StatItem key={stat.label} {...stat} />
        ))}
      </TouchableOpacity>

      {/* כפתור סגירה מאוחד */}
      {onHide && (
        <CloseButton
          onPress={onHide}
          size="large"
          position="center"
          accessibilityLabel="סגור דשבורד"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // קונטיינר ברירת מחדל
  // Default container
  defaultContainer: {
    position: "relative",
  },

  // סגנון מקורי - משופר
  // Original style - improved
  container: {
    flexDirection: "row-reverse",
    justifyContent: "space-around",
    backgroundColor: theme.colors.card,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.xl,
    marginHorizontal: theme.spacing.md,
    ...theme.shadows.medium,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },

  // סגנון בר
  // Bar style
  barContainer: {
    position: "absolute",
    top: BAR_TOP_OFFSET,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  barGradient: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  barContent: {
    gap: theme.spacing.xs,
  },
  barTimer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  barTimerText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  barStats: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
  },
  barStatText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  barSeparator: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  barProgress: {
    height: 3,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    marginTop: theme.spacing.xs,
    overflow: "hidden",
  },
  barProgressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },

  // סגנון קומפקטי
  // Compact style
  compactContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginHorizontal: theme.spacing.md,
    ...theme.shadows.small,
  },
  compactStat: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
  },
  compactValue: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  compactDivider: {
    width: 1,
    height: 16,
    backgroundColor: theme.colors.border,
  },

  // סגנון צף
  // Floating style
  floatingContainer: {
    position: "absolute",
    top: FLOATING_TOP_OFFSET,
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    zIndex: 10,
  },
  floatingGradient: {
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.large,
  },
  floatingContent: {
    flexDirection: "row-reverse",
    justifyContent: "space-around",
  },
  floatingStat: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  floatingValue: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  floatingLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
});
