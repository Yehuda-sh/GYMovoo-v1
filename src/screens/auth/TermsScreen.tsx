// src/screens/auth/TermsScreen.tsx
import React from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";

export default function TermsScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeBtn}
        >
          <Ionicons name="close" size={28} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>תנאי שימוש</Text>
        <View style={{ width: 32 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.paragraph}>
          ברוכים הבאים ל־GYMovoo!
          {"\n"}
          השימוש באפליקציה מהווה הסכמה לכל התנאים שלהלן:
        </Text>
        <Text style={styles.bullet}>
          1. המידע באפליקציה אינו מהווה ייעוץ רפואי אישי.
        </Text>
        <Text style={styles.bullet}>
          2. יש להיוועץ ברופא לפני תחילת כל תוכנית אימון.
        </Text>
        <Text style={styles.bullet}>3. אין לשתף את החשבון עם אחרים.</Text>
        <Text style={styles.bullet}>
          4. כל שימוש לרעה בתוכן – חשוף לחסימה מיידית.
        </Text>
        <Text style={styles.bullet}>
          5. פרטיותך חשובה לנו: מידע אישי לא יועבר לגורמים חיצוניים ללא הסכמה.
        </Text>
        <Text style={styles.bullet}>
          6. הפרה של תנאי השימוש תוביל להגבלות או חסימת גישה.
        </Text>
        <Text style={styles.paragraph}>
          {"\n"}בכל שאלה – ניתן לפנות אלינו במייל: support@gymovoo.com
        </Text>
        <Text style={styles.strong}>
          שימוש באפליקציה מהווה אישור לכל תנאי השימוש והפרטיות.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: "transparent",
  },
  closeBtn: {
    padding: 4,
    marginLeft: 2,
  },
  title: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    writingDirection: "rtl",
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: 40,
  },
  paragraph: {
    color: theme.colors.text,
    fontSize: 16,
    lineHeight: 25,
    marginBottom: 14,
    writingDirection: "rtl",
    textAlign: "right",
  },
  bullet: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    lineHeight: 25,
    marginBottom: 8,
    writingDirection: "rtl",
    textAlign: "right",
  },
  strong: {
    color: theme.colors.accent,
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 22,
    textAlign: "center",
    writingDirection: "rtl",
  },
});
