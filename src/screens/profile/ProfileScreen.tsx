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
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../styles/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useUserStore } from "../../stores/userStore";
import DefaultAvatar from "../../components/common/DefaultAvatar";

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const user = useUserStore((s) => s.user);
  const answers = user?.questionnaire || {};

  // אנימציות // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
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
    { title: "מה מטרת האימון שלך?", key: 1, icon: "target" },
    { title: "מה רמת הניסיון שלך?", key: 2, icon: "arm-flex" },
    { title: "כמה פעמים בשבוע תרצה להתאמן?", key: 3, icon: "calendar-week" },
  ];

  // מידע נוסף על המשתמש // Additional user info
  const memberSince = new Date().toLocaleDateString("he-IL");

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.backgroundAlt]}
      style={styles.gradient}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Ionicons
                name="chevron-forward"
                size={28}
                color={theme.colors.text}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>הפרופיל שלי</Text>
            <View style={{ width: 28 }} />
          </View>

          {/* פרטי משתמש // User details */}
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              {user?.avatar ? (
                <Image
                  source={{ uri: user.avatar }}
                  style={styles.avatar}
                  resizeMode="cover"
                />
              ) : (
                <DefaultAvatar name={user?.name ?? "משתמש"} size={100} />
              )}
              <TouchableOpacity
                style={styles.editAvatarButton}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name="camera"
                  size={20}
                  color={theme.colors.text}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.username}>{user?.name || "לא הוזן"}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <View style={styles.memberBadge}>
              <MaterialCommunityIcons
                name="calendar-account"
                size={16}
                color={theme.colors.primary}
              />
              <Text style={styles.memberSince}>חבר מאז {memberSince}</Text>
            </View>
          </View>

          {/* תשובות השאלון // Questionnaire answers */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>התשובות שלך לשאלון</Text>
            <View style={styles.answersList}>
              {questions.map((q) => (
                <View style={styles.answerCard} key={q.key}>
                  <View style={styles.answerCardContent}>
                    <MaterialCommunityIcons
                      name={q.icon as any}
                      size={24}
                      color={theme.colors.primary}
                    />
                    <View style={styles.answerTextContainer}>
                      <Text style={styles.cardQuestion}>{q.title}</Text>
                      <Text style={styles.cardAnswer}>
                        {answers[q.key] || "לא נבחר"}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* סטטיסטיקות אימונים // Workout statistics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>הסטטיסטיקות שלך</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <LinearGradient
                  colors={[
                    theme.colors.primary + "20",
                    theme.colors.primary + "10",
                  ]}
                  style={styles.statGradient}
                >
                  <MaterialCommunityIcons
                    name="dumbbell"
                    size={28}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.statValue}>0</Text>
                  <Text style={styles.statLabel}>אימונים</Text>
                </LinearGradient>
              </View>
              <View style={styles.statCard}>
                <LinearGradient
                  colors={[
                    theme.colors.accent + "20",
                    theme.colors.accent + "10",
                  ]}
                  style={styles.statGradient}
                >
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={28}
                    color={theme.colors.accent}
                  />
                  <Text style={styles.statValue}>0</Text>
                  <Text style={styles.statLabel}>שעות</Text>
                </LinearGradient>
              </View>
              <View style={styles.statCard}>
                <LinearGradient
                  colors={[
                    theme.colors.warning + "20",
                    theme.colors.warning + "10",
                  ]}
                  style={styles.statGradient}
                >
                  <MaterialCommunityIcons
                    name="trophy"
                    size={28}
                    color={theme.colors.warning}
                  />
                  <Text style={styles.statValue}>0</Text>
                  <Text style={styles.statLabel}>יעדים</Text>
                </LinearGradient>
              </View>
            </View>
          </View>

          {/* כפתור מילוי שאלון מחדש // Redo questionnaire button */}
          <TouchableOpacity
            style={styles.redoBtn}
            onPress={handleRedoQuestionnaire}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[
                theme.colors.primaryGradientStart,
                theme.colors.primaryGradientEnd,
              ]}
              style={styles.redoBtnGradient}
            >
              <Text style={styles.redoBtnText}>מלא שוב שאלון</Text>
              <MaterialCommunityIcons name="refresh" size={22} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          {/* העדפות ואפשרויות // Preferences and options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>הגדרות</Text>
            <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
              <View style={styles.settingContent}>
                <MaterialCommunityIcons
                  name="bell-outline"
                  size={24}
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

            <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
              <View style={styles.settingContent}>
                <MaterialCommunityIcons
                  name="translate"
                  size={24}
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

            <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
              <View style={styles.settingContent}>
                <MaterialCommunityIcons
                  name="shield-check-outline"
                  size={24}
                  color={theme.colors.text}
                />
                <Text style={styles.settingText}>פרטיות</Text>
              </View>
              <Ionicons
                name="chevron-back"
                size={20}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* כפתור התנתקות // Logout button */}
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Text style={styles.logoutText}>התנתק</Text>
            <MaterialCommunityIcons
              name="logout"
              size={20}
              color={theme.colors.error}
            />
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingBottom: theme.spacing.xl,
  },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: theme.spacing.md,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
  },
  profileCard: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.card,
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.card,
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...theme.shadows.small,
  },
  username: {
    color: theme.colors.text,
    fontSize: 26,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  userEmail: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  memberBadge: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
    backgroundColor: theme.colors.primaryGradientStart + "15",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  memberSince: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "600",
    marginBottom: theme.spacing.md,
    textAlign: "right",
  },
  answersList: {
    gap: 12,
  },
  answerCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...theme.shadows.medium,
  },
  answerCardContent: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
  },
  answerTextContainer: {
    flex: 1,
  },
  cardQuestion: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    marginBottom: 4,
    textAlign: "right",
  },
  cardAnswer: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "right",
  },
  statsGrid: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    ...theme.shadows.medium,
  },
  statGradient: {
    padding: theme.spacing.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    borderRadius: 16,
  },
  statValue: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
  },
  statLabel: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
    textAlign: "center",
  },
  redoBtn: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    borderRadius: 16,
    overflow: "hidden",
    ...theme.shadows.medium,
  },
  redoBtnGradient: {
    flexDirection: "row-reverse",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 8,
  },
  redoBtnText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: "600",
  },
  settingItem: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: theme.spacing.lg,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...theme.shadows.small,
  },
  settingContent: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
  },
  settingText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "500",
    textAlign: "right",
  },
  logoutBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: theme.colors.card,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: theme.colors.error + "30",
    marginTop: theme.spacing.md,
  },
  logoutText: {
    color: theme.colors.error,
    fontSize: 16,
    fontWeight: "600",
  },
});
