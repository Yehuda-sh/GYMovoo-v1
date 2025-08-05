/**
 * @file src/components/questionnaire/SmartOptionComponent.tsx
 * @description קומפוננטת אפשרות חכמה מרכזית עם תמיכה בתמונות ואנימציות
 * Centralized smart option component with image and animation support
 *
 * ✅ קומפוננטה מפורקת ומרכזית לאפשרויות חכמות
 * ✅ שימוש חוזר במסכי שאלון שונים
 * ✅ תמיכה מלאה ב-RTL ואנימציות
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Image,
  ImageSourcePropType,
} from "react-native";
import { theme } from "../../styles/theme";
import { SmartOption } from "../../data/newSmartQuestionnaire";

// =====================================
// 🎯 ממשק הקומפוננטה
// Component Interface
// =====================================

interface SmartOptionComponentProps {
  option: SmartOption;
  isSelected: boolean;
  onSelect: () => void;
  showAIInsight?: boolean; // הצגת תובנת AI (ברירת מחדל: true)
  animationEnabled?: boolean; // אנימציה בלחיצה (ברירת מחדל: true)
}

// =====================================
// 🎨 קומפוננטת אפשרות חכמה מרכזית
// Centralized Smart Option Component
// =====================================

const SmartOptionComponent: React.FC<SmartOptionComponentProps> = ({
  option,
  isSelected,
  onSelect,
  showAIInsight = true,
  animationEnabled = true,
}) => {
  const scaleAnim = new Animated.Value(1);

  /**
   * טיפול בלחיצה עם אנימציה
   * Handle press with animation
   */
  const handlePress = () => {
    if (animationEnabled) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }

    onSelect();
  };

  return (
    <Animated.View
      style={[animationEnabled && { transform: [{ scale: scaleAnim }] }]}
    >
      <TouchableOpacity
        style={[styles.container, isSelected && styles.containerSelected]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <View style={styles.content}>
          {/* תמונת ציוד אם קיימת */}
          {option.image && typeof option.image !== "string" && (
            <View style={styles.imageContainer}>
              <Image source={option.image} style={styles.image} />
            </View>
          )}

          <View style={styles.textContainer}>
            <Text style={[styles.label, isSelected && styles.labelSelected]}>
              {option.label}
            </Text>
            {option.description && (
              <Text
                style={[
                  styles.description,
                  isSelected && styles.descriptionSelected,
                ]}
              >
                {option.description}
              </Text>
            )}
            {showAIInsight && option.aiInsight && isSelected && (
              <View style={styles.aiInsightContainer}>
                <Text style={styles.aiInsightIcon}>🤖</Text>
                <Text style={styles.aiInsightText}>{option.aiInsight}</Text>
              </View>
            )}
          </View>
        </View>
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <Text style={styles.selectedIndicatorText}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

// =====================================
// 🎨 עיצוב אופטימלי עם RTL
// Optimized Styling with RTL
// =====================================

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    paddingRight: theme.spacing.lg + 30, // מקום לסמן הבחירה מימין
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    ...theme.shadows.medium,
  },
  containerSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.surfaceVariant,
  },
  content: {
    flex: 1,
    flexDirection: "row-reverse", // תמונה משמאל, טקסט מימין ב-RTL
    alignItems: "center",
  },
  imageContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surfaceVariant,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: theme.spacing.md, // תמיד marginLeft בעברית
    overflow: "hidden",
  },
  image: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  textContainer: {
    flex: 1,
    alignItems: "flex-end", // מיישר טקסט לימין ב-RTL
  },
  label: {
    ...theme.typography.bodyLarge,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: "right", // תמיד ימין בעברית
    writingDirection: "rtl",
    width: "100%", // תופס את כל הרוחב
  },
  labelSelected: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    textAlign: "right", // תמיד ימין בעברית
    writingDirection: "rtl",
    width: "100%", // תופס את כל הרוחב
  },
  descriptionSelected: {
    color: theme.colors.textSecondary,
  },
  selectedIndicator: {
    position: "absolute",
    top: theme.spacing.md,
    right: theme.spacing.md, // משמאל לימין בעברית - V מימין
    width: 24,
    height: 24,
    borderRadius: theme.radius.round,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedIndicatorText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  // סטיילים לתובנת AI
  aiInsightContainer: {
    flexDirection: "row-reverse", // תמיד row-reverse בעברית
    alignItems: "flex-start",
    backgroundColor: theme.colors.info + "20", // שקיפות 20%
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginTop: theme.spacing.md,
    borderRightWidth: 3, // תמיד בצד ימין בעברית
    borderRightColor: theme.colors.info,
  },
  aiInsightIcon: {
    fontSize: 16,
    marginLeft: theme.spacing.sm, // תמיד marginLeft בעברית
  },
  aiInsightText: {
    flex: 1,
    ...theme.typography.bodySmall,
    color: theme.colors.info,
    fontStyle: "italic",
    textAlign: "right", // תמיד ימין בעברית
    writingDirection: "rtl",
  },
});

export default SmartOptionComponent;
