/**
 * @file src/components/questionnaire/SmartProgressBar.tsx
 * @description קומפוננטת בר התקדמות חכמה עם אנימציות
 * Smart progress bar component with animations
 *
 * ✅ קומפוננטה מפורקת ומרכזית לבר התקדמות
 * ✅ שימוש חוזר במסכי שאלון שונים
 * ✅ תמיכה מלאה ב-RTL ואנימציות חלקות
 */

import React, { useEffect } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

// =====================================
// 🎯 ממשק הקומפוננטה
// Component Interface
// =====================================

interface ProgressData {
  current: number;
  total: number;
  percentage: number;
}

interface SmartProgressBarProps {
  progress: ProgressData;
  showPercentage?: boolean; // הצגת אחוזים (ברירת מחדל: true)
  animationDuration?: number; // זמן אנימציה (ברירת מחדל: 500ms)
  customLabel?: string; // טקסט מותאם אישית
}

// =====================================
// 🎨 קומפוננטת בר התקדמות חכמה
// Smart Progress Bar Component
// =====================================

const SmartProgressBar: React.FC<SmartProgressBarProps> = ({
  progress,
  showPercentage = true,
  animationDuration = 500,
  customLabel,
}) => {
  const progressAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress.percentage,
      duration: animationDuration,
      useNativeDriver: false,
    }).start();
  }, [progress.percentage, animationDuration, progressAnim]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.progressText}>
          {customLabel || `שאלה ${progress.current} מתוך ${progress.total}`}
        </Text>
        {showPercentage && (
          <Text style={styles.progressPercentage}>{progress.percentage}%</Text>
        )}
      </View>
      <View style={styles.barBackground}>
        <Animated.View
          style={[
            styles.barFill,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
};

// =====================================
// 🎨 עיצוב אופטימלי עם RTL
// Optimized Styling with RTL
// =====================================

const styles = StyleSheet.create({
  container: {
    margin: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  progressText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: "right", // תמיד ימין בעברית
    writingDirection: "rtl",
  },
  progressPercentage: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: "bold",
    textAlign: "left", // אחוזים משמאל
  },
  barBackground: {
    height: 8,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.radius.xs,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.xs,
  },
});

export default SmartProgressBar;
