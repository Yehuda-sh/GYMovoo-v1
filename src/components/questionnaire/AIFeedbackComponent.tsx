/**
 * @file src/components/questionnaire/AIFeedbackComponent.tsx
 * @description קומפוננטת משוב AI מרכזית עם אנימציות
 * Centralized AI feedback component with animations
 *
 * ✅ קומפוננטה מפורקת ומרכזית למשוב AI
 * ✅ שימוש חוזר במסכים שונים
 * ✅ תמיכה מלאה ב-RTL ועברית
 */

import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";
import { theme } from "../../styles/theme";
import { AIFeedback } from "../../data/newSmartQuestionnaire";

// =====================================
// 🎯 ממשק הקומפוננטה
// Component Interface
// =====================================

interface AIFeedbackComponentProps {
  feedback: AIFeedback;
  onClose: () => void;
  autoCloseDelay?: number; // זמן סגירה אוטומטית (ברירת מחדל: 4000ms)
  showCloseButton?: boolean; // הצגת כפתור סגירה (ברירת מחדל: true)
}

// =====================================
// 🎨 קומפוננטת משוב AI מרכזית
// Centralized AI Feedback Component
// =====================================

const AIFeedbackComponent: React.FC<AIFeedbackComponentProps> = ({
  feedback,
  onClose,
  autoCloseDelay = 4000,
  showCloseButton = true,
}) => {
  // אנימציות אופטימליות
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    // אנימציה של כניסה
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // סגירה אוטומטית
    const timer = setTimeout(onClose, autoCloseDelay);
    return () => clearTimeout(timer);
  }, [autoCloseDelay, fadeAnim, slideAnim, onClose]);

  /**
   * קביעת צבע רקע לפי סוג המשוב
   * Determine background color by feedback type
   */
  const getBackgroundColor = (): string => {
    const colors = {
      positive: theme.colors.success,
      suggestion: theme.colors.warning,
      warning: theme.colors.error,
      insight: theme.colors.info,
    };
    return colors[feedback.type] || theme.colors.success;
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.content}>
        <Text style={styles.icon}>{feedback.icon}</Text>
        <View style={styles.textContainer}>
          <Text style={styles.message}>{feedback.message}</Text>
        </View>
        {showCloseButton && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

// =====================================
// 🎨 עיצוב אופטימלי עם RTL
// Optimized Styling with RTL
// =====================================

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 100,
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    ...theme.shadows.large,
    zIndex: 1000,
  },
  content: {
    flexDirection: "row-reverse", // תמיד row-reverse בעברית
    alignItems: "flex-start",
    padding: theme.spacing.lg,
  },
  icon: {
    fontSize: 24,
    marginLeft: theme.spacing.md, // תמיד marginLeft בעברית
  },
  textContainer: {
    flex: 1,
  },
  message: {
    color: theme.colors.white,
    ...theme.typography.bodyLarge,
    lineHeight: 22,
    textAlign: "right", // תמיד ימין בעברית
    writingDirection: "rtl",
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  closeText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AIFeedbackComponent;
