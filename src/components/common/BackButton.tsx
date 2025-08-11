/**
 * @file src/components/common/BackButton.tsx
 * @brief ✨ כפתור חזרה אוניברסלי משופר עם אינטגרציה מלאה ל-theme
 * @dependencies React Navigation, Ionicons, theme
 * @notes כולל תמיכה במיקום מוחלט ויחסי, נגישות מלאה, fallback navigation
 * @version 2.3 - Added fallback navigation support for better UX
 */

import React, { useMemo } from "react";
import { TouchableOpacity, ViewStyle } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";

type BackButtonVariant = "default" | "minimal" | "large";

interface BackButtonProps {
  /** האם הכפתור צריך להיות במיקום מוחלט */
  absolute?: boolean;
  /** פונקציה מותאמת אישית לטיפול בלחיצה */
  onPress?: () => void;
  /** מסך חלופי לניווט אם אין היסטוריה */
  fallbackScreen?: string;
  /** פרמטרים למסך החלופי */
  fallbackParams?: Record<string, any>;
  /** גודל האייקון המותאם אישית */
  size?: number;
  /** וריאנט עיצובי של הכפתור */
  variant?: BackButtonVariant;
  /** עיצוב נוסף לכפתור */
  style?: ViewStyle;
  /** האם הכפתור מושבת */
  disabled?: boolean;
}

const BackButton: React.FC<BackButtonProps> = React.memo(
  ({
    absolute = true,
    onPress,
    fallbackScreen,
    fallbackParams,
    size,
    variant = "default",
    style,
    disabled = false,
  }) => {
    const navigation = useNavigation();

    // Memoized styles עבור ביצועים טובים יותר
    const buttonStyle = useMemo(
      () =>
        theme.components.getBackButtonStyle({
          absolute,
          variant,
          customStyle: style,
        }),
      [absolute, variant, style]
    );

    const iconSize = useMemo(
      () => theme.components.getBackButtonIconSize(variant, size),
      [variant, size]
    );

    const handlePress = () => {
      if (disabled) return;

      if (onPress) {
        onPress();
      } else {
        // בדיקה אם יש היסטוריה לחזרה לפני ביצוע goBack
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else if (fallbackScreen) {
          // ניווט למסך חלופי אם הוגדר
          (navigation as any).navigate(fallbackScreen, fallbackParams || {});
        } else {
          // אין מקום לחזור אליו ואין fallback
          console.warn(
            "⚠️ BackButton: No history to go back to and no fallback screen provided"
          );
        }
      }
    };

    return (
      <TouchableOpacity
        onPress={handlePress}
        style={[buttonStyle, disabled && { opacity: 0.5 }]}
        activeOpacity={disabled ? 1 : 0.7}
        disabled={disabled}
        accessibilityLabel="חזור"
        accessibilityRole="button"
        accessibilityHint="לחץ כדי לחזור למסך הקודם"
        accessibilityState={{ disabled }}
      >
        <Ionicons
          name="chevron-forward" // RTL: שימוש בחץ ימינה במקום שמאלה
          size={iconSize}
          color={disabled ? theme.colors.textTertiary : theme.colors.text}
        />
      </TouchableOpacity>
    );
  }
);

BackButton.displayName = "BackButton";

export default BackButton;
