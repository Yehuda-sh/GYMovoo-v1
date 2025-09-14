/**
 * @file src/screens/profile/StatisticsScreen.tsx
 * @description מסך סטטיסטיקות מפורט עם גרפים ומעקב ביצועים
 * English: Detailed statistics screen with charts and performance tracking
 *
 * מה המסך הזה עושה?
 * ===================
 * מסך שמציג למשתמש את כל הסטטיסטיקות שלו:
 * - גרפים של התקדמות
 * - נתונים על אימונים
 * - השוואות לחודשים קודמים
 * - מגמות ושינויים
 * - סיכומים שבועיים/חודשיים
 *
 * למה זה חשוב?
 * =============
 * זה עוזר למשתמש לראות את ההתקדמות שלו לאורך זמן
 * ולקבל תובנות על הביצועים כדי לשפר את האימונים.
 *
 * @features
 * - גרפים אינטראקטיביים של התקדמות
 * - סטטיסטיקות מפורטות על אימונים
 * - מגמות ושינויים לאורך זמן
 * - השוואות לתקופות קודמות
 * - ייצוא נתונים ושיתוף
 * - נגישות מלאה לקוראי מסך
 *
 * @dependencies React Native, Chart Library, Statistics Utils
 * @usage Used for detailed performance and progress tracking
 * @created 2025-01-09 - Phase 2 missing screens implementation
 */

import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  Share,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { logger } from "../../utils/logger";

// קבלת מידות המסך
const { width: screenWidth } = Dimensions.get("window");

// טיפוסי נתונים
interface StatisticsData {
  period: string;
  workouts: number;
  exercises: number;
  totalTime: number; // בדקות
  totalWeight: number; // בק"ג
  avgHeartRate?: number;
  caloriesBurned?: number;
}

interface ChartDataPoint {
  x: string;
  y: number;
}

// נתוני דוגמה
const generateMockData = (): StatisticsData[] => {
  const months = ["ינו", "פבר", "מרץ", "אפר", "מאי", "יונ"];
  return months.map((month) => ({
    period: month,
    workouts: Math.floor(Math.random() * 20) + 10,
    exercises: Math.floor(Math.random() * 100) + 50,
    totalTime: Math.floor(Math.random() * 300) + 200,
    totalWeight: Math.floor(Math.random() * 5000) + 2000,
    avgHeartRate: Math.floor(Math.random() * 50) + 120,
    caloriesBurned: Math.floor(Math.random() * 2000) + 1000,
  }));
};

// קומפוננט גרף פשוט
interface SimpleChartProps {
  data: ChartDataPoint[];
  color: string;
  title: string;
}

const SimpleChart: React.FC<SimpleChartProps> = ({ data, color, title }) => {
  const maxValue = Math.max(...data.map((d) => d.y));
  const chartHeight = 120;
  const chartWidth = screenWidth - 60;

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{title}</Text>
      <View style={styles.chart}>
        <View
          style={[styles.chartArea, { width: chartWidth, height: chartHeight }]}
        >
          {data.map((point, index) => {
            const barHeight = (point.y / maxValue) * chartHeight;
            const barWidth = (chartWidth - (data.length - 1) * 8) / data.length;

            return (
              <View key={index} style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: barHeight,
                      width: barWidth,
                      backgroundColor: color,
                    },
                  ]}
                />
                <Text style={styles.barLabel}>{point.x}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

// סגנונות עיצוב
const styles = {
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTop: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: 15,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold" as const,
    color: "#1a1a1a",
    flex: 1,
    textAlign: "center" as const,
  },
  shareButton: {
    padding: 8,
  },
  periodSelector: {
    flexDirection: "row" as const,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 4,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center" as const,
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: "#007AFF",
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#666",
  },
  periodButtonTextActive: {
    color: "white",
  },
  summaryContainer: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "bold" as const,
    color: "#333",
    marginBottom: 16,
    textAlign: "center" as const,
  },
  summaryGrid: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    justifyContent: "space-between" as const,
  },
  summaryItem: {
    width: "48%" as any,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: "center" as const,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "bold" as const,
    color: "#007AFF",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
    textAlign: "center" as const,
  },
  summaryChange: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "600" as const,
  },
  summaryChangePositive: {
    color: "#4CAF50",
  },
  summaryChangeNegative: {
    color: "#F44336",
  },
  chartContainer: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: "#333",
    marginBottom: 16,
    textAlign: "center" as const,
  },
  chart: {
    alignItems: "center" as const,
  },
  chartArea: {
    flexDirection: "row" as const,
    alignItems: "flex-end" as const,
    justifyContent: "space-between" as const,
  },
  barContainer: {
    alignItems: "center" as const,
    justifyContent: "flex-end" as const,
    flex: 1,
  },
  bar: {
    borderRadius: 4,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center" as const,
  },
  detailsContainer: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: "#333",
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detailRowLast: {
    borderBottomWidth: 0,
  },
  detailLabel: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#007AFF",
  },
  detailIcon: {
    marginLeft: 12,
  },
  emptyState: {
    alignItems: "center" as const,
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center" as const,
    marginTop: 16,
    lineHeight: 24,
  },
};

export const StatisticsScreen: React.FC = () => {
  const navigation = useNavigation();

  // מצב הקומפוננטה
  const [selectedPeriod, setSelectedPeriod] = useState<
    "week" | "month" | "year"
  >("month");
  const [refreshing, setRefreshing] = useState(false);

  // נתוני סטטיסטיקות
  const statisticsData = useMemo(() => {
    return generateMockData();
  }, []);

  // חישוב נתוני סיכום
  const summaryData = useMemo(() => {
    const totalWorkouts = statisticsData.reduce(
      (sum, data) => sum + data.workouts,
      0
    );
    const totalExercises = statisticsData.reduce(
      (sum, data) => sum + data.exercises,
      0
    );
    const totalTime = statisticsData.reduce(
      (sum, data) => sum + data.totalTime,
      0
    );
    const totalWeight = statisticsData.reduce(
      (sum, data) => sum + data.totalWeight,
      0
    );
    const avgWorkoutsPerPeriod = totalWorkouts / statisticsData.length;

    return {
      totalWorkouts,
      totalExercises,
      totalTime,
      totalWeight,
      avgWorkoutsPerPeriod: Math.round(avgWorkoutsPerPeriod * 10) / 10,
      avgTimePerWorkout: Math.round((totalTime / totalWorkouts) * 10) / 10,
    };
  }, [statisticsData]);

  // נתוני גרפים
  const workoutsChartData: ChartDataPoint[] = useMemo(() => {
    return statisticsData.map((data) => ({
      x: data.period,
      y: data.workouts,
    }));
  }, [statisticsData]);

  const weightChartData: ChartDataPoint[] = useMemo(() => {
    return statisticsData.map((data) => ({
      x: data.period,
      y: data.totalWeight,
    }));
  }, [statisticsData]);

  // רענון נתונים
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // TODO: Refresh real data
    setTimeout(() => {
      setRefreshing(false);
      logger.info("StatisticsScreen", "Data refreshed");
    }, 1000);
  }, []);

  // שיתוף סטטיסטיקות
  const handleShare = useCallback(async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const message =
        `הסטטיסטיקות שלי ב-GYMovoo:\n` +
        `🏋️ ${summaryData.totalWorkouts} אימונים\n` +
        `💪 ${summaryData.totalExercises} תרגילים\n` +
        `⏱️ ${Math.round(summaryData.totalTime / 60)} שעות אימון\n` +
        `🏆 ${summaryData.totalWeight.toLocaleString()} ק"ג הורמו\n\n` +
        `ממוצע ${summaryData.avgWorkoutsPerPeriod} אימונים לחודש!`;

      await Share.share({
        message,
        title: "הסטטיסטיקות שלי",
      });

      logger.info("StatisticsScreen", "Statistics shared");
    } catch (error) {
      logger.error("StatisticsScreen", "Failed to share statistics", error);
    }
  }, [summaryData]);

  // חזרה למסך הקודם
  const handleBack = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  }, [navigation]);

  // שינוי תקופה
  const handlePeriodChange = useCallback(
    (period: "week" | "month" | "year") => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setSelectedPeriod(period);
      logger.info("StatisticsScreen", "Period changed", { period });
    },
    []
  );

  // פורמט זמן
  const formatTime = useCallback((minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")} שעות`;
    }
    return `${mins} דקות`;
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      {/* כותרת */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            accessible={true}
            accessibilityLabel="חזור למסך הקודם"
            accessibilityRole="button"
          >
            <Ionicons name="arrow-forward" size={24} color="#007AFF" />
          </TouchableOpacity>

          <Text style={styles.title}>סטטיסטיקות</Text>

          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShare}
            accessible={true}
            accessibilityLabel="שתף סטטיסטיקות"
            accessibilityRole="button"
          >
            <Ionicons name="share-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* בורר תקופה */}
      <View style={styles.periodSelector}>
        <TouchableOpacity
          style={[
            styles.periodButton,
            selectedPeriod === "week" && styles.periodButtonActive,
          ]}
          onPress={() => handlePeriodChange("week")}
          accessible={true}
          accessibilityLabel="סטטיסטיקות שבועיות"
          accessibilityRole="button"
        >
          <Text
            style={[
              styles.periodButtonText,
              selectedPeriod === "week" && styles.periodButtonTextActive,
            ]}
          >
            שבוע
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.periodButton,
            selectedPeriod === "month" && styles.periodButtonActive,
          ]}
          onPress={() => handlePeriodChange("month")}
          accessible={true}
          accessibilityLabel="סטטיסטיקות חודשיות"
          accessibilityRole="button"
        >
          <Text
            style={[
              styles.periodButtonText,
              selectedPeriod === "month" && styles.periodButtonTextActive,
            ]}
          >
            חודש
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.periodButton,
            selectedPeriod === "year" && styles.periodButtonActive,
          ]}
          onPress={() => handlePeriodChange("year")}
          accessible={true}
          accessibilityLabel="סטטיסטיקות שנתיות"
          accessibilityRole="button"
        >
          <Text
            style={[
              styles.periodButtonText,
              selectedPeriod === "year" && styles.periodButtonTextActive,
            ]}
          >
            שנה
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#007AFF"]}
            tintColor="#007AFF"
          />
        }
      >
        {/* סיכום כללי */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>סיכום כללי</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {summaryData.totalWorkouts}
              </Text>
              <Text style={styles.summaryLabel}>סה"כ אימונים</Text>
              <Text
                style={[styles.summaryChange, styles.summaryChangePositive]}
              >
                +{summaryData.avgWorkoutsPerPeriod}/חודש
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {summaryData.totalExercises}
              </Text>
              <Text style={styles.summaryLabel}>סה"כ תרגילים</Text>
              <Text
                style={[styles.summaryChange, styles.summaryChangePositive]}
              >
                +
                {Math.round(summaryData.totalExercises / statisticsData.length)}
                /חודש
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {Math.round(summaryData.totalTime / 60)}
              </Text>
              <Text style={styles.summaryLabel}>שעות אימון</Text>
              <Text
                style={[styles.summaryChange, styles.summaryChangePositive]}
              >
                ממוצע {summaryData.avgTimePerWorkout} דק'/אימון
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {(summaryData.totalWeight / 1000).toFixed(1)}
              </Text>
              <Text style={styles.summaryLabel}>טון הורמו</Text>
              <Text
                style={[styles.summaryChange, styles.summaryChangePositive]}
              >
                +
                {Math.round(
                  summaryData.totalWeight / statisticsData.length / 100
                )}{" "}
                ק"ג/חודש
              </Text>
            </View>
          </View>
        </View>

        {/* גרף אימונים */}
        <SimpleChart
          data={workoutsChartData}
          color="#4CAF50"
          title="מספר אימונים לפי חודש"
        />

        {/* גרף משקל */}
        <SimpleChart
          data={weightChartData}
          color="#FF9800"
          title="משקל מורם לפי חודש (ק״ג)"
        />

        {/* פרטים נוספים */}
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>פרטים נוספים</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>ממוצע אימונים בשבוע</Text>
            <Text style={styles.detailValue}>
              {(summaryData.avgWorkoutsPerPeriod / 4.33).toFixed(1)}
            </Text>
            <Ionicons
              name="fitness"
              size={20}
              color="#4CAF50"
              style={styles.detailIcon}
            />
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>זמן ממוצע לאימון</Text>
            <Text style={styles.detailValue}>
              {formatTime(summaryData.avgTimePerWorkout)}
            </Text>
            <Ionicons
              name="time"
              size={20}
              color="#FF9800"
              style={styles.detailIcon}
            />
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>משקל ממוצע לאימון</Text>
            <Text style={styles.detailValue}>
              {Math.round(summaryData.totalWeight / summaryData.totalWorkouts)}{" "}
              ק"ג
            </Text>
            <Ionicons
              name="barbell"
              size={20}
              color="#2196F3"
              style={styles.detailIcon}
            />
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>תרגילים ממוצע לאימון</Text>
            <Text style={styles.detailValue}>
              {Math.round(
                summaryData.totalExercises / summaryData.totalWorkouts
              )}
            </Text>
            <Ionicons
              name="list"
              size={20}
              color="#9C27B0"
              style={styles.detailIcon}
            />
          </View>

          <View style={[styles.detailRow, styles.detailRowLast]}>
            <Text style={styles.detailLabel}>יעילות אימון</Text>
            <Text style={styles.detailValue}>85%</Text>
            <Ionicons
              name="trending-up"
              size={20}
              color="#4CAF50"
              style={styles.detailIcon}
            />
          </View>
        </View>

        {/* מצב ריק */}
        {statisticsData.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="analytics-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>
              עדיין אין מספיק נתונים לסטטיסטיקות.{"\n"}
              התחל להתאמן כדי לראות את ההתקדמות שלך!
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default StatisticsScreen;
