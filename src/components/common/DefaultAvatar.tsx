/**
 * @file src/components/common/DefaultAvatar.tsx
 * @brief קומפוננטת אווטאר גנרית - מציגה ראשי תיבות או אייקון ברירת מחדל
 * @dependencies MaterialIcons, theme
 * @notes תומך בגדלים דינמיים, טיפול בשמות בעברית ואנגלית, צבעים אדפטיביים
 * @recurring_errors שימוש בצבעים לא מה-theme, חוסר טיפול בשמות ריקים - FIXED
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";

interface DefaultAvatarProps {
  name?: string;
  size?: number;
  backgroundColor?: string;
  borderColor?: string;
  showBorder?: boolean; // אפשרות להסתיר מסגרת
}

/**
 * מחלץ ראשי תיבות משם - משופר עם תמיכה בעברית ואנגלית
 * @param name - השם המלא
 * @returns ראשי תיבות (עד 2 אותיות)
 */
const getInitials = (name: string): string => {
  // טיפול ברווחים מיותרים וסינון חלקים ריקים
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "";

  // אם יש רק מילה אחת, החזר את האות הראשונה
  if (parts.length === 1) {
    return parts[0][0].toUpperCase();
  }

  // אם יש מספר מילים, קח את האות הראשונה והאחרונה
  const firstInitial = parts[0][0];
  const lastInitial = parts[parts.length - 1][0];

  return (firstInitial + lastInitial).toUpperCase();
};

/**
 * יוצר צבע רקע דינמי על בסיס השם
 * @param name - השם לחישוב הצבע
 * @returns צבע hex
 */
const getNameBasedColor = (name: string): string => {
  if (!name) return theme.colors.backgroundAlt;

  // יצירת hash פשוט מהשם
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  // המרה לצבע עם גוונים רכים
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 45%, 75%)`; // גוונים רכים ונעימים
};

function DefaultAvatar({
  name,
  size = 74,
  backgroundColor,
  borderColor,
  showBorder = true,
}: DefaultAvatarProps) {
  const initials = name ? getInitials(name) : "";

  // צבע רקע דינמי על בסיס השם אם לא סופק צבע
  const dynamicBackgroundColor =
    backgroundColor || getNameBasedColor(name || "");

  // חישוב גדלים פרופורציונליים
  const fontSize = size * 0.4;
  const iconSize = size * 0.6;
  const borderRadius = size / 2;
  const borderWidth = showBorder ? 2 : 0;

  // יצירת תווית נגישות מותאמת
  const accessibilityLabel = name
    ? `תמונת פרופיל של ${name}`
    : "תמונת פרופיל ברירת מחדל";

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius,
          borderWidth,
          borderColor: borderColor || theme.colors.accent,
          backgroundColor: dynamicBackgroundColor,
        },
      ]}
      accessible={true}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={
        name ? "אווטאר עם ראשי תיבות של השם" : "אייקון אווטאר כללי"
      }
    >
      {name && initials ? (
        <Text
          style={[styles.initials, { fontSize }]}
          allowFontScaling={false} // מניעת שינוי גודל אוטומטי
          accessible={false} // האב כבר נגיש
        >
          {initials}
        </Text>
      ) : (
        <MaterialIcons
          name="person"
          size={iconSize}
          color={theme.colors.text}
          accessible={false} // האב כבר נגיש
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    // צל עדין יותר וקונסיסטנטי עם theme
    ...theme.shadows.small,
  },
  initials: {
    color: theme.colors.text,
    fontWeight: "700",
    textAlign: "center",
  },
});

// עטיפה ב-React.memo לשיפור ביצועים עם פונקציית השוואה מותאמת משופרת
export default React.memo(DefaultAvatar, (prevProps, nextProps) => {
  return (
    prevProps.name === nextProps.name &&
    prevProps.size === nextProps.size &&
    prevProps.backgroundColor === nextProps.backgroundColor &&
    prevProps.borderColor === nextProps.borderColor &&
    prevProps.showBorder === nextProps.showBorder
  );
});
