/**
 * @file src/components/analytics/WorkoutAnalytics.tsx
 * @brief Advanced workout analytics component with performance metrics and data visualization
 */

import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../core/theme";
import { useUserStore } from "../../stores/userStore";
import { isRTL } from "../../utils/rtlHelpers";

interface AnalyticsData {
  totalWorkouts: number;
  totalHours: number;
  averageDuration: number;
  currentStreak: number;
  longestStreak: number;
  personalRecords: number;
  favoriteExercise: string;
  consistencyScore: number;
  weeklyAverage: number;
  monthlyWorkouts: number;
  strengthProgress: number;
  cardioProgress: number;
}

interface WeeklyData {
  week: string;
  workouts: number;
  duration: number;
  volume: number;
}

interface ProgressMetric {
  label: string;
  value: number;
  unit: string;
  change: number;
  trend: "up" | "down" | "stable";
  icon: string;
  color: string;
}

const WorkoutAnalytics: React.FC = () => {
  const { user } = useUserStore();
  const [selectedPeriod, setSelectedPeriod] = useState<
    "week" | "month" | "year"
  >("month");
  const [activeTab, setActiveTab] = useState<
    "overview" | "progress" | "insights"
  >("overview");

  // Mock data - in real app, this would come from user's workout history
  const mockWeeklyData: WeeklyData[] = [
    { week: "שבוע 1", workouts: 3, duration: 180, volume: 2400 },
    { week: "שבוע 2", workouts: 4, duration: 220, volume: 2800 },
    { week: "שבוע 3", workouts: 3, duration: 195, volume: 2600 },
    { week: "שבוע 4", workouts: 5, duration: 285, volume: 3200 },
    { week: "שבוע זה", workouts: 2, duration: 120, volume: 1600 },
  ];

  const analyticsData: AnalyticsData = useMemo(() => {
    // In real app, calculate from actual user data
    const totalWorkouts = user?.trainingStats?.totalWorkouts || 0;
    const currentStreak = user?.trainingStats?.currentStreak || 0;

    return {
      totalWorkouts,
      totalHours: Math.round(((totalWorkouts * 45) / 60) * 10) / 10, // Assuming 45min average
      averageDuration: 45,
      currentStreak,
      longestStreak: Math.max(currentStreak + 3, 12),
      personalRecords: Math.floor(totalWorkouts / 5), // 1 PR per 5 workouts
      favoriteExercise: "סקוואט",
      consistencyScore: Math.min(95, 60 + currentStreak * 2),
      weeklyAverage: 3.2,
      monthlyWorkouts: totalWorkouts,
      strengthProgress: 15,
      cardioProgress: 22,
    };
  }, [user]);

  const progressMetrics: ProgressMetric[] = [
    {
      label: "נפח אימון",
      value: 2800,
      unit: 'ק"ג',
      change: 12,
      trend: "up",
      icon: "weight-lifter",
      color: theme.colors.primary,
    },
    {
      label: "זמן אימון",
      value: 285,
      unit: "דקות",
      change: 8,
      trend: "up",
      icon: "clock-outline",
      color: theme.colors.success,
    },
    {
      label: "קלוריות נשרפו",
      value: 1240,
      unit: 'קק"ל',
      change: -3,
      trend: "down",
      icon: "fire",
      color: theme.colors.warning,
    },
    {
      label: "שיאים אישיים",
      value: analyticsData.personalRecords,
      unit: "שיאים",
      change: 2,
      trend: "up",
      icon: "trophy",
      color: theme.colors.error,
    },
  ];

  const renderPeriodSelector = () => (
    <View style={styles.periodSelector}>
      {[
        { key: "week", label: "שבוע" },
        { key: "month", label: "חודש" },
        { key: "year", label: "שנה" },
      ].map((period) => (
        <TouchableOpacity
          key={period.key}
          style={[
            styles.periodButton,
            selectedPeriod === period.key && styles.periodButtonActive,
          ]}
          onPress={() =>
            setSelectedPeriod(period.key as "week" | "month" | "year")
          }
        >
          <Text
            style={[
              styles.periodButtonText,
              selectedPeriod === period.key && styles.periodButtonTextActive,
            ]}
          >
            {period.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderOverviewStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <MaterialCommunityIcons
            name="dumbbell"
            size={24}
            color={theme.colors.primary}
          />
          <Text style={styles.statNumber}>{analyticsData.totalWorkouts}</Text>
          <Text style={styles.statLabel}>סה"כ אימונים</Text>
        </View>

        <View style={styles.statCard}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={24}
            color={theme.colors.success}
          />
          <Text style={styles.statNumber}>{analyticsData.totalHours}</Text>
          <Text style={styles.statLabel}>שעות אימון</Text>
        </View>

        <View style={styles.statCard}>
          <MaterialCommunityIcons
            name="fire"
            size={24}
            color={theme.colors.warning}
          />
          <Text style={styles.statNumber}>{analyticsData.currentStreak}</Text>
          <Text style={styles.statLabel}>רצף נוכחי</Text>
        </View>

        <View style={styles.statCard}>
          <MaterialCommunityIcons
            name="chart-line"
            size={24}
            color={theme.colors.error}
          />
          <Text style={styles.statNumber}>
            {analyticsData.consistencyScore}%
          </Text>
          <Text style={styles.statLabel}>עקביות</Text>
        </View>
      </View>

      {/* Weekly Progress Chart Mock */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>התקדמות שבועית</Text>
        <View style={styles.chartPlaceholder}>
          <View style={styles.chartBars}>
            {mockWeeklyData.map((week, index) => (
              <View key={index} style={styles.chartBar}>
                <View
                  style={[
                    styles.chartBarFill,
                    { height: `${(week.workouts / 5) * 100}%` },
                  ]}
                />
                <Text style={styles.chartBarLabel}>{week.workouts}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.chartDescription}>אימונים לשבוע</Text>
        </View>
      </View>
    </View>
  );

  const renderProgressMetrics = () => (
    <View style={styles.metricsContainer}>
      {progressMetrics.map((metric, index) => (
        <View key={index} style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <View style={styles.metricIconContainer}>
              <MaterialCommunityIcons
                name={
                  metric.icon as keyof typeof MaterialCommunityIcons.glyphMap
                }
                size={20}
                color={metric.color}
              />
            </View>
            <View style={styles.metricInfo}>
              <Text style={styles.metricLabel}>{metric.label}</Text>
              <View style={styles.metricValueRow}>
                <Text style={styles.metricValue}>
                  {metric.value.toLocaleString()} {metric.unit}
                </Text>
                <View
                  style={[
                    styles.metricChange,
                    {
                      backgroundColor:
                        metric.trend === "up"
                          ? theme.colors.success + "20"
                          : theme.colors.error + "20",
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={
                      metric.trend === "up" ? "trending-up" : "trending-down"
                    }
                    size={12}
                    color={
                      metric.trend === "up"
                        ? theme.colors.success
                        : theme.colors.error
                    }
                  />
                  <Text
                    style={[
                      styles.metricChangeText,
                      {
                        color:
                          metric.trend === "up"
                            ? theme.colors.success
                            : theme.colors.error,
                      },
                    ]}
                  >
                    {Math.abs(metric.change)}%
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const renderInsights = () => (
    <View style={styles.insightsContainer}>
      <View style={styles.insightCard}>
        <MaterialCommunityIcons
          name="lightbulb-outline"
          size={24}
          color={theme.colors.primary}
        />
        <View style={styles.insightContent}>
          <Text style={styles.insightTitle}>תובנת השבוע</Text>
          <Text style={styles.insightText}>
            השבוע השגת רצף של {analyticsData.currentStreak} ימי אימון! זה שיפור
            של 20% מהשבוע הקודם. המשך כך! 💪
          </Text>
        </View>
      </View>

      <View style={styles.insightCard}>
        <MaterialCommunityIcons
          name="target"
          size={24}
          color={theme.colors.success}
        />
        <View style={styles.insightContent}>
          <Text style={styles.insightTitle}>המלצה מותאמת</Text>
          <Text style={styles.insightText}>
            בהתבסס על הביצועים שלך, מומלץ להוסיף יום אימון נוסף לשבוע כדי להגיע
            ליעד החודשי שלך.
          </Text>
        </View>
      </View>

      <View style={styles.insightCard}>
        <MaterialCommunityIcons
          name="trophy-outline"
          size={24}
          color={theme.colors.warning}
        />
        <View style={styles.insightContent}>
          <Text style={styles.insightTitle}>הישג חדש בדרך</Text>
          <Text style={styles.insightText}>
            עוד 3 אימונים ותשבור את השיא האישי שלך ברצף האימונים! הרצף הנוכחי:{" "}
            {analyticsData.currentStreak} ימים.
          </Text>
        </View>
      </View>

      {/* Personal Records */}
      <View style={styles.recordsContainer}>
        <Text style={styles.recordsTitle}>שיאים אישיים אחרונים</Text>
        <View style={styles.recordsList}>
          <View style={styles.recordItem}>
            <Text style={styles.recordExercise}>סקוואט</Text>
            <Text style={styles.recordValue}>85 ק"ג × 5</Text>
            <Text style={styles.recordDate}>לפני 3 ימים</Text>
          </View>
          <View style={styles.recordItem}>
            <Text style={styles.recordExercise}>ריצה</Text>
            <Text style={styles.recordValue}>5 ק"מ ב-23:45</Text>
            <Text style={styles.recordDate}>לפני שבוע</Text>
          </View>
          <View style={styles.recordItem}>
            <Text style={styles.recordExercise}>דחיפות</Text>
            <Text style={styles.recordValue}>25 × 3 סטים</Text>
            <Text style={styles.recordDate}>לפני 10 ימים</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderTabSelector = () => (
    <View style={styles.tabSelector}>
      {[
        { key: "overview", label: "סקירה", icon: "chart-box-outline" },
        { key: "progress", label: "התקדמות", icon: "trending-up" },
        { key: "insights", label: "תובנות", icon: "lightbulb-outline" },
      ].map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.tabButton,
            activeTab === tab.key && styles.tabButtonActive,
          ]}
          onPress={() =>
            setActiveTab(tab.key as "overview" | "progress" | "insights")
          }
        >
          <MaterialCommunityIcons
            name={tab.icon as keyof typeof MaterialCommunityIcons.glyphMap}
            size={20}
            color={
              activeTab === tab.key
                ? theme.colors.primary
                : theme.colors.textSecondary
            }
          />
          <Text
            style={[
              styles.tabButtonText,
              activeTab === tab.key && styles.tabButtonTextActive,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverviewStats();
      case "progress":
        return renderProgressMetrics();
      case "insights":
        return renderInsights();
      default:
        return renderOverviewStats();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ניתוח ביצועים</Text>
        {renderPeriodSelector()}
      </View>

      {renderTabSelector()}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderContent()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.md,
  },
  periodSelector: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: "center",
    borderRadius: 6,
  },
  periodButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  periodButtonText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },
  periodButtonTextActive: {
    color: theme.colors.white,
    fontWeight: "600",
  },
  tabSelector: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  tabButton: {
    flex: 1,
    flexDirection: isRTL() ? "row-reverse" : "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  tabButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  tabButtonText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },
  tabButtonTextActive: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    padding: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    width: "48%",
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.md,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: "center",
  },
  chartContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.md,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: isRTL() ? "right" : "left",
  },
  chartPlaceholder: {
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  chartBars: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    alignItems: "flex-end",
    gap: theme.spacing.sm,
    height: 80,
  },
  chartBar: {
    width: 24,
    height: 80,
    backgroundColor: theme.colors.background,
    borderRadius: 4,
    position: "relative",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  chartBarFill: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
    minHeight: 4,
  },
  chartBarLabel: {
    fontSize: 10,
    color: theme.colors.text,
    fontWeight: "600",
    marginBottom: 4,
  },
  chartDescription: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
  metricsContainer: {
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  metricCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.md,
  },
  metricHeader: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    alignItems: "center",
  },
  metricIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: isRTL() ? 0 : theme.spacing.sm,
    marginLeft: isRTL() ? theme.spacing.sm : 0,
  },
  metricInfo: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 4,
    textAlign: isRTL() ? "right" : "left",
  },
  metricValueRow: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  metricValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  metricChange: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 2,
  },
  metricChangeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  insightsContainer: {
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  insightCard: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.md,
    alignItems: "flex-start",
  },
  insightContent: {
    flex: 1,
    marginLeft: isRTL() ? 0 : theme.spacing.sm,
    marginRight: isRTL() ? theme.spacing.sm : 0,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: isRTL() ? "right" : "left",
  },
  insightText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    textAlign: isRTL() ? "right" : "left",
  },
  recordsContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.md,
  },
  recordsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: isRTL() ? "right" : "left",
  },
  recordsList: {
    gap: theme.spacing.sm,
  },
  recordItem: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    padding: theme.spacing.sm,
  },
  recordExercise: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: isRTL() ? "right" : "left",
  },
  recordValue: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: "500",
    marginHorizontal: theme.spacing.sm,
  },
  recordDate: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: isRTL() ? "right" : "left",
  },
});

export default WorkoutAnalytics;
