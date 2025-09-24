// src/screens/developer/DeveloperScreen.tsx
import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { userApi } from "../../services/api/userApi";
import { useUserStore } from "../../stores/userStore";
import { theme } from "../../core/theme";
import { User } from "../../core/types/user.types";
import { RootStackParamList } from "../../navigation/types";
import BackButton from "../../components/common/BackButton";
import LoadingSpinner from "../../components/common/LoadingSpinner";

// 🎯 משתמשי דמו מוכנים מראש
const DEMO_USERS = [
  {
    name: "דני המתחיל",
    email: "danny.beginner@demo.com",
    profile: {
      gender: "male",
      age: 28,
      weight: 85,
      height: 178,
      fitness_goal: "lose_weight",
      experience_level: "beginner",
      workout_location: "home",
      availability: "3_days",
      workout_duration: "30",
      equipment_available: ["dumbbells", "yogaMat", "resistanceBands"],
    },
    stats: { totalWorkouts: 24, currentStreak: 3 },
  },
  {
    name: "מיכל הרצינית",
    email: "michal.serious@demo.com",
    profile: {
      gender: "female",
      age: 35,
      weight: 65,
      height: 165,
      fitness_goal: "build_muscle",
      experience_level: "intermediate",
      workout_location: "gym",
      availability: "4_days",
      workout_duration: "45",
      equipment_available: ["dumbbells", "barbell", "kettlebell", "pullupBar"],
    },
    stats: { totalWorkouts: 87, currentStreak: 6 },
  },
  {
    name: "יוסי הספורטאי",
    email: "yossi.athlete@demo.com",
    profile: {
      gender: "male",
      age: 42,
      weight: 78,
      height: 180,
      fitness_goal: "improve_endurance",
      experience_level: "advanced",
      workout_location: "outdoor",
      availability: "5_days",
      workout_duration: "60",
      equipment_available: ["dumbbells", "kettlebell", "pullupBar", "jumpRope"],
    },
    stats: { totalWorkouts: 156, currentStreak: 12 },
  },
];

export default function DeveloperScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user, setUser } = useUserStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const allUsers = await userApi.list();
      setUsers(Array.isArray(allUsers) ? allUsers : []);
    } catch (error) {
      console.error("Error loading users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  }, [loadUsers]);

  const createDemoUser = async (demo: (typeof DEMO_USERS)[0]) => {
    const demoUser: User = {
      id: `demo_${demo.email.split("@")[0]}_${Date.now()}`,
      email: demo.email,
      name: demo.name,
      questionnaireData: {
        answers: demo.profile,
        metadata: {
          completedAt: new Date(
            Date.now() - 60 * 24 * 60 * 60 * 1000
          ).toISOString(),
          version: "2.0",
        },
      },
      trainingStats: demo.stats,
    };

    try {
      setLoading(true);
      const createdUser = await userApi.create(demoUser);
      await loadUsers();

      Alert.alert(
        "משתמש דמו נוצר! 🎉",
        `${createdUser?.name}\n📧 ${createdUser?.email}\n🏋️ ${demo.stats.totalWorkouts} אימונים`,
        [
          {
            text: "השתמש במשתמש זה",
            onPress: () => selectUser(createdUser),
          },
          { text: "סגור", style: "cancel" },
        ]
      );
    } catch (error) {
      console.error("Error creating demo user:", error);
      Alert.alert("שגיאה", "לא ניתן ליצור משתמש דמו");
    } finally {
      setLoading(false);
    }
  };

  const createTestUser = async () => {
    const testUser: User = {
      id: `user_${Date.now()}`,
      email: `test.user.${Date.now()}@example.com`,
      name: `משתמש בדיקה ${new Date().toLocaleTimeString("he-IL")}`,
      questionnaireData: {
        answers: {
          age: 25,
          gender: "male",
          weight: 70,
          height: 175,
          fitness_goal: "general_fitness",
          experience_level: "beginner",
          workout_location: "home",
          availability: "3_days",
          workout_duration: "30",
          equipment_available: ["dumbbells"],
        },
        metadata: {
          completedAt: new Date().toISOString(),
          version: "1.0",
        },
      },
    };

    try {
      setLoading(true);
      const createdUser = await userApi.create(testUser);
      await loadUsers();

      Alert.alert("הצלחה", `משתמש בדיקה נוצר: ${createdUser?.name}`, [
        {
          text: "השתמש במשתמש זה",
          onPress: () => selectUser(createdUser),
        },
        { text: "סגור", style: "cancel" },
      ]);
    } catch (error) {
      console.error("Error creating test user:", error);
      Alert.alert("שגיאה", "לא ניתן ליצור משתמש בדיקה");
    } finally {
      setLoading(false);
    }
  };

  const selectUser = async (selectedUser: User) => {
    try {
      setLoading(true);
      setUser(selectedUser);
      await AsyncStorage.setItem("currentUser", JSON.stringify(selectedUser));

      const q = selectedUser.questionnaireData?.answers;
      const hasQuestionnaire = !!(q && Object.keys(q).length > 0);

      Alert.alert("הצלחה", `נכנסת בתור ${selectedUser.name}`);

      if (hasQuestionnaire) {
        navigation.reset({
          index: 0,
          routes: [{ name: "MainApp" }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "Welcome" }],
        });
      }
    } catch (error) {
      console.error("Error setting user:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      setLoading(true);
      // בינתיים נסיר רק מהרשימה המקומית
      setUsers(users.filter((u) => u.id !== userId));
      Alert.alert("הצלחה", "המשתמש נמחק");
    } catch (error) {
      console.error("Error deleting user:", error);
      Alert.alert("שגיאה", "לא ניתן למחוק את המשתמש");
    } finally {
      setLoading(false);
    }
  };

  if (loading && users.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <BackButton />
          <Text style={styles.title}>מסך מפתח</Text>
        </View>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.title}>מסך מפתח</Text>
      </View>
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {user && (
          <View style={styles.currentUserCard}>
            <Text style={styles.sectionTitle}>משתמש פעיל</Text>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>יצירת משתמשים</Text>

          <View style={styles.buttonGrid}>
            <TouchableOpacity
              style={styles.button}
              onPress={createTestUser}
              disabled={loading}
            >
              <Text style={styles.buttonText}>🧪 משתמש בדיקה</Text>
            </TouchableOpacity>

            {DEMO_USERS.map((demo, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.button, styles.demoButton]}
                onPress={() => createDemoUser(demo)}
                disabled={loading}
              >
                <Text style={[styles.buttonText, { color: theme.colors.text }]}>
                  {demo.profile.gender === "female" ? "👩" : "👨"} {demo.name}
                </Text>
                <Text style={styles.buttonSubtext}>
                  {demo.stats.totalWorkouts} אימונים •{" "}
                  {demo.profile.experience_level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            משתמשים במערכת ({users.length})
          </Text>

          {users.length === 0 ? (
            <Text style={styles.emptyText}>אין משתמשים במערכת</Text>
          ) : (
            users.map((userData) => (
              <View key={userData.id} style={styles.userCard}>
                <TouchableOpacity
                  style={styles.userCardMain}
                  onPress={() => selectUser(userData)}
                >
                  <Text style={styles.userName}>{userData.name}</Text>
                  <Text style={styles.userEmail}>{userData.email}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() =>
                    Alert.alert(
                      "מחיקת משתמש",
                      `האם אתה בטוח שברצונך למחוק את ${userData.name}?`,
                      [
                        { text: "ביטול", style: "cancel" },
                        {
                          text: "מחק",
                          style: "destructive",
                          onPress: () => deleteUser(userData.id || ""),
                        },
                      ]
                    )
                  }
                >
                  <Ionicons name="trash" size={20} color={theme.colors.error} />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContent}>
            <Text style={styles.loadingText}>טוען...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    marginLeft: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  currentUserCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: theme.colors.primary + "30",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 12,
  },
  buttonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    minWidth: 150,
  },
  demoButton: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.white,
  },
  buttonSubtext: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  userCard: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    marginBottom: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  userCardMain: {
    flex: 1,
    padding: 16,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  userEmail: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  deleteButton: {
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    borderLeftWidth: 1,
    borderLeftColor: theme.colors.border,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    padding: 32,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContent: {
    backgroundColor: theme.colors.surface,
    padding: 24,
    borderRadius: 12,
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.text,
  },
});
