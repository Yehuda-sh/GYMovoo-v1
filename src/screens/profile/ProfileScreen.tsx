/**
 * @file src/screens/profile/ProfileScreen.tsx
 * @description User Profile - הצגת אווטאר, תשובות מהשאלון, כפתור התנתקות, התחלת שאלון חדש
 */

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { theme } from "../../styles/theme";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useUserStore } from "../../stores/userStore";
import DefaultAvatar from "../../components/common/DefaultAvatar";

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const user = useUserStore((s) => s.user);
  const answers = user?.questionnaire || {};

  const handleLogout = () => {
    useUserStore.getState().logout();
    navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
  };

  const handleRedoQuestionnaire = () => {
    useUserStore.getState().resetQuestionnaire();
    navigation.navigate("Questionnaire");
  };

  const questions = [
    { title: "מה מטרת האימון שלך?", key: 1 },
    { title: "מה רמת הניסיון שלך?", key: 2 },
    { title: "כמה פעמים בשבוע תרצה להתאמן?", key: 3 },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.avatarBox}>
        {user?.avatar ? (
          <Image
            source={{ uri: user.avatar }}
            style={styles.avatar}
            resizeMode="cover"
          />
        ) : (
          <DefaultAvatar name={user?.name ?? "משתמש"} size={82} />
        )}
        <Text style={styles.username}>{user?.name || "לא הוזן"}</Text>
      </View>

      <Text style={styles.sectionTitle}>התשובות לשאלון:</Text>
      <View style={styles.answersList}>
        {questions.map((q) => (
          <View style={styles.answerCard} key={q.key}>
            <Text style={styles.cardQuestion}>{q.title}</Text>
            <Text style={styles.cardAnswer}>{answers[q.key] || "לא נבחר"}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.redoBtn}
        onPress={handleRedoQuestionnaire}
      >
        <Ionicons name="repeat" size={20} color="#fff" />
        <Text style={styles.redoBtnText}>מלא שוב שאלון</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons
          name="log-out-outline"
          size={18}
          color={theme.colors.accent}
        />
        <Text style={styles.logoutText}>התנתק</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    alignItems: "center",
  },
  avatarBox: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 94,
    height: 94,
    borderRadius: 47,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    marginBottom: 12,
    backgroundColor: "#fff1",
  },
  username: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "bold",
  },
  sectionTitle: {
    color: theme.colors.accent,
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 8,
    alignSelf: "flex-start",
    writingDirection: "rtl",
  },
  answersList: {
    width: "100%",
    marginBottom: 30,
  },
  answerCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.divider,
  },
  cardQuestion: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    marginBottom: 6,
    writingDirection: "rtl",
  },
  cardAnswer: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: "700",
    writingDirection: "rtl",
  },
  redoBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 24,
    alignSelf: "center",
    gap: 8,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    elevation: 2,
  },
  redoBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginTop: "auto",
    alignSelf: "center",
    padding: 8,
    gap: 4,
  },
  logoutText: {
    color: theme.colors.accent,
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 2,
  },
});
