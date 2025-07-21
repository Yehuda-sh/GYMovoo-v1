/**
 * @file src/screens/profile/ProfileScreen.tsx
 * @brief מסך פרופיל משתמש - הצגת פרטים אישיים, תשובות שאלון, סטטיסטיקות והגדרות
 * @dependencies userStore (Zustand), DefaultAvatar component
 * @notes כולל אנימציות fade-in וניהול מצב משתמש
 * @recurring_errors בעיות RTL בכיווניות אלמנטים, שימוש בחצים לא נכונים
 */

import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  ScrollView,
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

  // אנימציות // Animations
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

  // מידע נוסף על המשתמש // Additional user info
  const memberSince = new Date().toLocaleDateString("he-IL");

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* פרטי משתמש // User details */}
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

        {/* תשובות השאלון // Questionnaire answers */}
        <Text style={styles.sectionTitle}>התשובות שלך לשאלון:</Text>
        <View style={styles.answersList}>
          {questions.map((q) => (
            <View style={styles.answerCard} key={q.key}>
              <Text style={styles.cardQuestion}>{q.title}</Text>
              <Text style={styles.cardAnswer}>
                {answers[q.key] || "לא נבחר"}
              </Text>
            </View>
          ))}
        </View>

        {/* סטטיסטיקות אימונים // Workout statistics */}
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

        {/* כפתור מילוי שאלון מחדש // Redo questionnaire button */}
        <TouchableOpacity
          style={styles.redoBtn}
          onPress={handleRedoQuestionnaire}
          activeOpacity={0.8}
        >
          <Text style={styles.redoBtnText}>מלא שוב שאלון</Text>
          <Ionicons name="repeat" size={20} color="#fff" />
        </TouchableOpacity>

        {/* העדפות ואפשרויות // Preferences and options */}
        <View style={styles.settingsSection}>
          <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.colors.textSecondary}
            />
            <View style={styles.settingContent}>
              <Text style={styles.settingText}>התראות</Text>
              <Ionicons
                name="notifications-outline"
                size={22}
                color={theme.colors.text}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.colors.textSecondary}
            />
            <View style={styles.settingContent}>
              <Text style={styles.settingText}>שפה</Text>
              <Ionicons
                name="language-outline"
                size={22}
                color={theme.colors.text}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* כפתור התנתקות // Logout button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutText}>התנתק</Text>
          <Ionicons
            name="log-out-outline"
            size={18}
            color={theme.colors.accent}
          />
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    alignItems: "center",
    paddingBottom: theme.spacing.xl,
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
    backgroundColor: theme.colors.card,
  },
  username: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  userEmail: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
    textAlign: "center",
  },
  memberSince: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
    textAlign: "center",
  },
  sectionTitle: {
    color: theme.colors.accent,
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 8,
    alignSelf: "flex-end", // RTL: תיקון יישור לימין
    textAlign: "right",
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
    textAlign: "right",
  },
  cardAnswer: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "right",
  },
  statsSection: {
    width: "100%",
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: "row-reverse", // RTL: תיקון כיווניות
    justifyContent: "space-between",
    marginTop: 12,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.divider,
  },
  statValue: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
    textAlign: "center",
  },
  statLabel: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
  redoBtn: {
    flexDirection: "row-reverse", // RTL: תיקון כיווניות
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
    shadowRadius: 4,
    elevation: 3,
  },
  redoBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "right",
  },
  settingsSection: {
    width: "100%",
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: "row-reverse", // RTL: תיקון כיווניות
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.divider,
  },
  settingContent: {
    flexDirection: "row-reverse", // RTL: תיקון כיווניות
    alignItems: "center",
    gap: 12,
  },
  settingText: {
    color: theme.colors.text,
    fontSize: 16,
    textAlign: "right",
  },
  logoutBtn: {
    flexDirection: "row-reverse", // RTL: תיקון כיווניות
    alignItems: "center",
    marginTop: "auto",
    alignSelf: "center",
    padding: 8,
    gap: 6,
  },
  logoutText: {
    color: theme.colors.accent,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
  },
});
