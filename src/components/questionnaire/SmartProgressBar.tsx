/**
 * @file src/components/questionnaire/SmartProgressBar.tsx
 * @description קומפוננטת בר התקדמות חכמה עם אנימציות
 * Smart progress bar component with animations
 *
 * 🔄 סטטוס: קומפוננט מורשת - לא בשימוש במערכת האחודה החדשה
 * Status: Legacy component - not used in the new unified system
 *
 * ✅ קומפוננטה מפורקת ומרכזית לבר התקדמות
 * ✅ שימוש חוזר במסכי שאלון שונים
 * ✅ תמיכה מלאה ב-RTL ואנימציות חלקות
 * ✅ אופטימזציה לביצועים עם React.memo ו-useRef
 */

import React, { useEffect, useRef, useMemo } from "react";
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
  /** נתוני התקדמות */
  progress: ProgressData;
  /** הצגת אחוזים (ברירת מחדל: true) */
  showPercentage?: boolean;
  /** זמן אנימציה במילישניות (ברירת מחדל: 500ms) */
  animationDuration?: number;
  /** טקסט מותאם אישית */
  customLabel?: string;
  /** האם להציג אנימציה */
  animated?: boolean;
}

// =====================================
// 🎨 קומפוננטת בר התקדמות חכמה
// Smart Progress Bar Component
// =====================================

const SmartProgressBar: React.FC<SmartProgressBarProps> = React.memo(
  ({
    progress,
    showPercentage = true,
    animationDuration = 500,
    customLabel,
    animated = true,
  }) => {
    // useRef למניעת זיכרון leaks
    const progressAnim = useRef(new Animated.Value(0)).current;

    // Memoized label עבור ביצועים טובים יותר
    const labelText = useMemo(
      () => customLabel || `שאלה ${progress.current} מתוך ${progress.total}`,
      [customLabel, progress.current, progress.total]
    );

    // Memoized percentage עם validation
    const displayPercentage = useMemo(() => {
      const percentage = Math.min(Math.max(progress.percentage, 0), 100);
      return Math.round(percentage);
    }, [progress.percentage]);

    useEffect(() => {
      if (animated) {
        Animated.timing(progressAnim, {
          toValue: progress.percentage,
          duration: animationDuration,
          useNativeDriver: false,
        }).start();
      } else {
        // אם לא רוצים אנימציה, עדכן מיד
        progressAnim.setValue(progress.percentage);
      }
    }, [progress.percentage, animationDuration, animated, progressAnim]);

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.progressText}>{labelText}</Text>
          {showPercentage && (
            <Text style={styles.progressPercentage}>{displayPercentage}%</Text>
          )}
        </View>
        <View style={styles.barBackground}>
          <Animated.View
            style={[
              styles.barFill,
              {
                width: animated
                  ? progressAnim.interpolate({
                      inputRange: [0, 100],
                      outputRange: ["0%", "100%"],
                      extrapolate: "clamp", // מונע ערכים מחוץ לטווח
                    })
                  : `${displayPercentage}%`,
              },
            ]}
          />
        </View>
      </View>
    );
  }
);

SmartProgressBar.displayName = "SmartProgressBar";

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
    flex: 1,
  },
  progressPercentage: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: "bold",
    textAlign: "left", // אחוזים משמאל
    marginLeft: theme.spacing.sm,
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
