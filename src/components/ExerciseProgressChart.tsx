/**
 * @file src/components/ExerciseProgressChart.tsx
 * @description קומפוננטה להצגת גרף התקדמות תרגיל
 * @author GYMovoo Development Team
 * @created 2025-08-02
 *
 * @features
 * - גרף משקל לאורך זמן
 * - גרף חזרות לאורך זמן
 * - גרף נפח (משקל × חזרות) לאורך זמן
 * - הצגת מגמת התקדמות
 * - שיאים אישיים
 */

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../styles/theme";
import { ExerciseProgressData } from "../services/unifiedHistoryService";

interface ExerciseProgressChartProps {
  progressData: ExerciseProgressData;
  onClose: () => void;
}

const { width: screenWidth } = Dimensions.get("window");
const chartWidth = screenWidth - 40;
const chartHeight = 200;

export const ExerciseProgressChart: React.FC<ExerciseProgressChartProps> = ({
  progressData,
  onClose,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<
    "weight" | "reps" | "volume"
  >("weight");

  // הכנת נתונים לגרף
  const getChartData = () => {
    return progressData.history.map((entry, index) => {
      const value =
        selectedMetric === "weight"
          ? entry.bestSet.weight
          : selectedMetric === "reps"
            ? entry.bestSet.reps
            : entry.bestSet.volume;

      return {
        x: index,
        y: value,
        date: entry.date,
        label: new Date(entry.date).toLocaleDateString("he-IL", {
          month: "short",
          day: "numeric",
        }),
      };
    });
  };

  const chartData = getChartData();

  // חישוב סקלה
  const maxValue = Math.max(...chartData.map((d) => d.y));
  const minValue = Math.min(...chartData.map((d) => d.y));
  const range = maxValue - minValue || 1;
  const padding = range * 0.1;

  // פונקציות עזר לגרף
  const getPointX = (index: number) =>
    (index / (chartData.length - 1)) * (chartWidth - 40) + 20;
  const getPointY = (value: number) =>
    chartHeight -
    20 -
    ((value - minValue + padding) / (range + 2 * padding)) * (chartHeight - 40);

  // יצירת נתיב SVG לקו הגרף
  const createPath = () => {
    if (chartData.length === 0) return "";

    let path = `M ${getPointX(0)} ${getPointY(chartData[0].y)}`;
    for (let i = 1; i < chartData.length; i++) {
      path += ` L ${getPointX(i)} ${getPointY(chartData[i].y)}`;
    }
    return path;
  };

  const getTrendIcon = () => {
    switch (progressData.trend) {
      case "improving":
        return { name: "trending-up", color: theme.colors.success };
      case "declining":
        return { name: "trending-down", color: theme.colors.error };
      case "stable":
        return { name: "trending-neutral", color: theme.colors.warning };
      default:
        return { name: "help-circle-outline", color: theme.colors.text };
    }
  };

  const getMetricLabel = () => {
    switch (selectedMetric) {
      case "weight":
        return 'משקל (ק"ג)';
      case "reps":
        return "חזרות";
      case "volume":
        return 'נפח (ק"ג)';
    }
  };

  const getTrendDescription = () => {
    switch (progressData.trend) {
      case "improving":
        return "מתקדם";
      case "declining":
        return "יורד";
      case "stable":
        return "יציב";
      case "new":
        return "חדש";
    }
  };

  const trendIcon = getTrendIcon();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <MaterialCommunityIcons
            name="close"
            size={24}
            color={theme.colors.text}
          />
        </TouchableOpacity>
        <Text style={styles.title}>{progressData.exerciseName}</Text>
        <View style={styles.trendContainer}>
          <MaterialCommunityIcons
            name={trendIcon.name as any}
            size={20}
            color={trendIcon.color}
          />
          <Text style={[styles.trendText, { color: trendIcon.color }]}>
            {getTrendDescription()}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Metric Selection */}
        <View style={styles.metricSelector}>
          {(["weight", "reps", "volume"] as const).map((metric) => (
            <TouchableOpacity
              key={metric}
              style={[
                styles.metricButton,
                selectedMetric === metric && styles.selectedMetricButton,
              ]}
              onPress={() => setSelectedMetric(metric)}
            >
              <Text
                style={[
                  styles.metricButtonText,
                  selectedMetric === metric && styles.selectedMetricButtonText,
                ]}
              >
                {metric === "weight"
                  ? "משקל"
                  : metric === "reps"
                    ? "חזרות"
                    : "נפח"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Chart Area - Simple implementation */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>{getMetricLabel()} לאורך זמן</Text>

          {chartData.length > 0 ? (
            <View style={styles.chartArea}>
              {/* Y-axis labels */}
              <View style={styles.yAxisLabels}>
                <Text style={styles.axisLabel}>
                  {Math.round(maxValue + padding)}
                </Text>
                <Text style={styles.axisLabel}>
                  {Math.round((maxValue + minValue) / 2)}
                </Text>
                <Text style={styles.axisLabel}>
                  {Math.round(minValue - padding)}
                </Text>
              </View>

              {/* Chart points */}
              <View style={styles.chartPoints}>
                {chartData.map((point, index) => (
                  <View
                    key={index}
                    style={[
                      styles.chartPoint,
                      {
                        left: getPointX(index) - 4,
                        top: getPointY(point.y) - 4,
                      },
                    ]}
                  />
                ))}
              </View>

              {/* X-axis labels */}
              <View style={styles.xAxisLabels}>
                {chartData.map((point, index) => (
                  <Text key={index} style={styles.xAxisLabel}>
                    {point.label}
                  </Text>
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.noDataContainer}>
              <MaterialCommunityIcons
                name="chart-line"
                size={48}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.noDataText}>אין נתוני היסטוריה</Text>
            </View>
          )}
        </View>

        {/* Statistics */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>סטטיסטיקות</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>שיא משקל</Text>
              <Text style={styles.statValue}>
                {progressData.personalRecords.maxWeight} ק"ג
              </Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statLabel}>שיא חזרות</Text>
              <Text style={styles.statValue}>
                {progressData.personalRecords.maxReps}
              </Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statLabel}>שיא נפח</Text>
              <Text style={styles.statValue}>
                {progressData.personalRecords.maxVolume} ק"ג
              </Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statLabel}>אימונים</Text>
              <Text style={styles.statValue}>
                {progressData.history.length}
              </Text>
            </View>
          </View>

          {/* Average Progression */}
          <View style={styles.progressionContainer}>
            <Text style={styles.progressionTitle}>התקדמות ממוצעת לשבוע</Text>
            <Text style={styles.progressionText}>
              משקל:{" "}
              {progressData.averageProgression.weightPerWeek > 0 ? "+" : ""}
              {progressData.averageProgression.weightPerWeek} ק"ג
            </Text>
            <Text style={styles.progressionText}>
              חזרות:{" "}
              {progressData.averageProgression.repsPerWeek > 0 ? "+" : ""}
              {progressData.averageProgression.repsPerWeek}
            </Text>
            <Text style={styles.progressionText}>
              נפח:{" "}
              {progressData.averageProgression.volumePerWeek > 0 ? "+" : ""}
              {progressData.averageProgression.volumePerWeek} ק"ג
            </Text>
          </View>
        </View>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    flex: 1,
    textAlign: "center",
  },
  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  trendText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  metricSelector: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    padding: 4,
    marginBottom: 20,
  },
  metricButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
  },
  selectedMetricButton: {
    backgroundColor: theme.colors.primary,
  },
  metricButtonText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  selectedMetricButtonText: {
    color: theme.colors.white,
    fontWeight: "600",
  },
  chartContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 16,
  },
  chartArea: {
    height: chartHeight,
    position: "relative",
  },
  yAxisLabels: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  axisLabel: {
    fontSize: 10,
    color: theme.colors.textSecondary,
  },
  chartPoints: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  chartPoint: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  xAxisLabels: {
    position: "absolute",
    bottom: 0,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  xAxisLabel: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  noDataContainer: {
    height: chartHeight,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: 8,
  },
  statsContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
    backgroundColor: theme.colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  progressionContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
  },
  progressionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 8,
  },
  progressionText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
});
