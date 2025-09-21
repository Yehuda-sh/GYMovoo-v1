import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
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
      setUsers(allUsers || []);
    } catch (error) {
      console.error("Error loading users:", error);
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

  const loginAsUser = async (selectedUser: User) => {
    try {
      setLoading(true);
      setUser(selectedUser);

      const hasQuestionnaire = !!(
        selectedUser.questionnaireData?.answers &&
        Object.keys(selectedUser.questionnaireData.answers).length > 0
      );

      await AsyncStorage.setItem("currentUser", JSON.stringify(selectedUser));

      if (hasQuestionnaire) {
        navigation.navigate("MainApp");
      } else {
        navigation.navigate("Welcome");
      }
    } catch (error) {
      console.error("Error setting user:", error);
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
          gender: "male",
          age: "26_35",
          fitness_goal: "general_fitness",
          experience_level: "beginner",
          workout_location: "home_bodyweight",
          availability: "3_days",
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
      console.log("Created test user:", createdUser);
      await loadUsers();
    } catch (error) {
      console.error("Error creating test user:", error);
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
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>ניהול משתמשים</Text>
            <Text style={styles.userCount}>({users.length} משתמשים)</Text>
          </View>

          <TouchableOpacity
            style={styles.createButton}
            onPress={createTestUser}
            disabled={loading}
          >
            <Ionicons name="person-add" size={20} color={theme.colors.white} />
            <Text style={styles.buttonText}>צור משתמש בדיקה</Text>
          </TouchableOpacity>

          {user && (
            <View style={styles.currentUser}>
              <Text style={styles.currentUserTitle}>משתמש נוכחי:</Text>
              <Text style={styles.currentUserName}>{user.name}</Text>
              <Text style={styles.currentUserEmail}>{user.email}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>רשימת משתמשים</Text>
          {users.length === 0 ? (
            <Text style={styles.emptyText}>אין משתמשים במערכת</Text>
          ) : (
            users.map((userData) => (
              <View key={userData.id} style={styles.userItem}>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{userData.name}</Text>
                  <Text style={styles.userEmail}>{userData.email}</Text>
                  <Text style={styles.userDetails}>
                    {userData.questionnaireData?.answers
                      ? "יש שאלון"
                      : "אין שאלון"}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={() => loginAsUser(userData)}
                  disabled={loading}
                >
                  <Ionicons
                    name="log-in"
                    size={20}
                    color={theme.colors.white}
                  />
                  <Text style={styles.buttonText}>כניסה</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {loading && users.length > 0 && (
        <View style={styles.loadingOverlay}>
          <LoadingSpinner />
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
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginStart: theme.spacing.md,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
  },
  userCount: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginStart: theme.spacing.sm,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: 12,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  currentUser: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: 12,
    marginBottom: theme.spacing.lg,
  },
  currentUserTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  currentUserName: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  currentUserEmail: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  userItem: {
    flexDirection: "row",
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: 12,
    marginBottom: theme.spacing.md,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  userEmail: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  userDetails: {
    fontSize: 12,
    color: theme.colors.textTertiary,
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.success,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: 8,
    gap: theme.spacing.xs,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: "500",
  },
  emptyText: {
    textAlign: "center",
    color: theme.colors.textTertiary,
    fontSize: 16,
    marginTop: theme.spacing.xl,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    start: 0,
    end: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
});
