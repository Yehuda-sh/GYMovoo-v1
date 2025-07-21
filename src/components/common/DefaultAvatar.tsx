import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";

type Props = {
  // הסרנו את ערך ברירת המחדל כדי שנוכל לבדוק אם השם באמת סופק
  name?: string;
  size?: number;
};

// 1. הוצאת הפונקציה מחוץ לקומפוננטה
// 2. שיפור הלוגיקה לטיפול ברווחים מיותרים
const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean); // טיפול ברווחים כפולים
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase(); // לוקח מהראשון והאחרון
};

function DefaultAvatar({ name, size = 74 }: Props) {
  const initials = name ? getInitials(name) : "";

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: theme.colors.backgroundAlt,
        },
      ]}
    >
      {/* 3. לוגיקה מתוקנת: אם יש שם וראשי תיבות, הצג אותם. אחרת, הצג אייקון */}
      {name && initials ? (
        <Text style={[styles.initials, { fontSize: size * 0.4 }]}>
          {initials}
        </Text>
      ) : (
        <MaterialIcons
          name="person"
          size={size * 0.7}
          // 4. שימוש בצבע מה-theme
          color={theme.colors.white}
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
  },
  initials: {
    // 4. שימוש בצבע מה-theme
    color: theme.colors.white,
    fontWeight: "700",
  },
});

// 5. עטיפה ב-React.memo לשיפור ביצועים
export default React.memo(DefaultAvatar);

// בקובץ ה-theme שלכם, ודאו שקיים צבע לבן:
// export const theme = {
//   colors: {
//     accent: '...',
//     backgroundAlt: '...',
//     white: '#FFFFFF',
//   },
// };
