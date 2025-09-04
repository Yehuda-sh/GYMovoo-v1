import React, { useMemo, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import * as Haptics from "expo-haptics";
import { theme } from "../styles/theme";

interface BlurOverlayProps {
  isVisible: boolean;
  title?: string;
  description?: string;
  actionText?: string;
  onActionPress?: () => void;
  children?: React.ReactNode;
  // ✨ תכונות כושר מובייל חדשות
  intensity?: "light" | "medium" | "heavy";
  enableHaptic?: boolean;
  workoutContext?: boolean;
}

/**
 * רכיב ערפול לתוכן פרימיום - מותאם לכושר מובייל עם משוב מושגי
 * מציג שכבת ערפול מעל תוכן שמחייב מנוי
 * Blur overlay component for premium content - fitness mobile optimized with haptic feedback
 */
export const BlurOverlay: React.FC<BlurOverlayProps> = ({
  isVisible,
  title = "תוכן פרימיום",
  description = "התוכן הזה זמין רק למנויים",
  actionText = "שדרג למנוי פרימיום",
  onActionPress,
  children,
  // ✨ ברירות מחדל לכושר מובייל
  intensity = "medium",
  enableHaptic = true,
  workoutContext = false,
}) => {
  // ✨ Performance tracking לרכיבי כושר
  const renderStartTime = useMemo(() => Date.now(), []);

  // ✨ Haptic feedback מותאם לעוצמה
  const triggerHaptic = useCallback(() => {
    if (!enableHaptic) return;

    switch (intensity) {
      case "light":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case "heavy":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      default:
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [enableHaptic, intensity]);

  // ✨ Enhanced handleActionPress עם haptic feedback
  const handleActionPress = useCallback(() => {
    triggerHaptic();
    onActionPress?.();
  }, [triggerHaptic, onActionPress]);

  // ✨ משוב ביצועים אוטומטי - רק בדיבוג מפורט
  useEffect(() => {
    const renderTime = Date.now() - renderStartTime;
    if (__DEV__ && renderTime > 300) {
      // העלאת סף ל-300ms
      console.warn(`⚠️ BlurOverlay render time: ${renderTime.toFixed(2)}ms`);
    }
  }, [renderStartTime]);
  // ✨ Enhanced overlay styles for workout context
  const overlayStyles = useMemo(() => {
    const baseStyle = styles.overlay;
    if (workoutContext) {
      return [
        baseStyle,
        {
          backgroundColor: "rgba(0, 0, 0, 0.8)", // כהה יותר לאימונים
        },
      ];
    }
    return baseStyle;
  }, [workoutContext]);

  if (!isVisible) {
    return <>{children}</>;
  }

  return (
    <View style={styles.container}>
      {/* התוכן המטושטש */}
      <View style={styles.blurredContent}>{children}</View>

      {/* שכבת הערפול */}
      <View style={overlayStyles}>
        <View style={styles.messageContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>

          {onActionPress && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleActionPress}
              hitSlop={{
                top: 20,
                bottom: 20,
                left: 20,
                right: 20,
              }}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={actionText}
              accessibilityHint="הקש לשדרוג למנוי פרימיום - יופעל משוב מושגי"
            >
              <Text style={styles.actionText}>{actionText}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
  },
  blurredContent: {
    flex: 1,
    opacity: 0.3, // ערפול על ידי שקיפות
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  messageContainer: {
    backgroundColor: theme.colors.surface,
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    maxWidth: Dimensions.get("window").width * 0.8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 12,
    textAlign: "center",
    writingDirection: theme.isRTL ? "rtl" : "ltr",
  },
  description: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
    writingDirection: theme.isRTL ? "rtl" : "ltr",
  },
  actionButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 200,
    minHeight: 44, // ✨ אימות גודל 44px לנגישות
  },
  actionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    writingDirection: theme.isRTL ? "rtl" : "ltr",
  },
});
