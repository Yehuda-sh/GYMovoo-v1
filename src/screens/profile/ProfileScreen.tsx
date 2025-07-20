/**
 * @file src/screens/profile/ProfileScreen.tsx
 * @description User Profile - הצגת תמונת פרופיל, תשובות מהשאלון, סטטיסטיקות, הגדרות
 */

import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import { theme } from "../../styles/theme";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useUserStore } from "../../stores/userStore";
import DefaultAvatar from "../../components/common/DefaultAvatar";

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const user = useUserStore((s) => s.user);
  const answers = user?.questionnaire || {};

  // אנימציות
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

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

  // מידע נוסף על המשתמש
  const memberSince = new Date().toLocaleDateString("he-IL");

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
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
        <Text style={styles.userEmail}>{user?.email}</Text>
        <Text style={styles.memberSince}>חבר מאז: {memberSince}</Text>
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

      {/* סטטיסטיקות אימונים */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>הסטטיסטיקות שלך</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="fitness" size={24} color={theme.colors.primary} />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>אימונים</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="time" size={24} color={theme.colors.accent} />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>שעות</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trophy" size={24} color={theme.colors.warning} />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>יעדים</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.redoBtn}
        onPress={handleRedoQuestionnaire}
      >
        <Ionicons name="repeat" size={20} color="#fff" />
        <Text style={styles.redoBtnText}>מלא שוב שאלון</Text>
      </TouchableOpacity>

      {/* העדפות ואפשרויות */}
      <View style={styles.settingsSection}>
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons
              name="notifications-outline"
              size={22}
              color={theme.colors.text}
            />
            <Text style={styles.settingText}>התראות</Text>
          </View>
          <Ionicons
            name="chevron-back"
            size={20}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons
              name="language-outline"
              size={22}
              color={theme.colors.text}
            />
            <Text style={styles.settingText}>שפה</Text>
          </View>
          <Ionicons
            name="chevron-back"
            size={20}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons
          name="log-out-outline"
          size={18}
          color={theme.colors.accent}
        />
        <Text style={styles.logoutText}>התנתק</Text>
      </TouchableOpacity>
    </Animated.View>
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
  userEmail: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
  memberSince: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
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
  statsSection: {
    width: "100%",
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: "center",
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: theme.colors.divider,
  },
  statValue: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
  },
  statLabel: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
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
  settingsSection: {
    width: "100%",
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.divider,
  },
  settingLeft: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
  },
  settingText: {
    color: theme.colors.text,
    fontSize: 16,
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
