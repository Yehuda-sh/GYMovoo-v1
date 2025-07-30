/**
 * @file src/components/common/DefaultAvatar.tsx
 * @brief קומפוננטת אווטאר גנרית - מציגה ראשי תיבות או אייקון ברירת מחדל
 * @dependencies MaterialIcons, theme
 * @notes תומך בגדלים דינמיים, טיפול בשמות בעברית ואנגלית
 * @recurring_errors שימוש בצבעים לא מה-theme, חוסר טיפול בשמות ריקים
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";

interface DefaultAvatarProps {
  name?: string;
  size?: number;
  backgroundColor?: string; // אפשרות להתאמה אישית של צבע רקע
}

/**
 * מחלץ ראשי תיבות משם
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

function DefaultAvatar({
  name,
  size = 74,
  backgroundColor,
}: DefaultAvatarProps) {
  const initials = name ? getInitials(name) : "";

  // חישוב גדלים פרופורציונליים
  const fontSize = size * 0.4;
  const iconSize = size * 0.6;
  const borderRadius = size / 2;

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
          backgroundColor: backgroundColor || theme.colors.backgroundAlt,
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
    borderWidth: 2,
    borderColor: theme.colors.accent,
    overflow: "hidden",
    // הוספת צל עדין
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  initials: {
    color: theme.colors.text,
    fontWeight: "700",
    textAlign: "center", // מרכוז הטקסט
  },
});

// עטיפה ב-React.memo לשיפור ביצועים עם פונקציית השוואה מותאמת
export default React.memo(DefaultAvatar, (prevProps, nextProps) => {
  return (
    prevProps.name === nextProps.name &&
    prevProps.size === nextProps.size &&
    prevProps.backgroundColor === nextProps.backgroundColor
  );
});
