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
import { theme } from "../../styles/theme";
import { User } from "../../types";
import { RootStackParamList } from "../../navigation/types";
import BackButton from "../../components/common/BackButton";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function DeveloperScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user, setUser } = useUserStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // Show confirmation modal
  const showConfirmationModal = useCallback(
    (title: string, message: string, onConfirm: () => void) => {
      setModalConfig({ title, message, onConfirm });
      setShowModal(true);
    },
    []
  );

  // Load users list
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

  // Refresh data
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  }, [loadUsers]);

  // Login as selected user
  const loginAsUser = async (selectedUser: User) => {
    try {
      setLoading(true);
      setUser(selectedUser);

      // Check if user has questionnaire
      const hasQuestionnaire = !!(
        selectedUser.smartquestionnairedata?.answers &&
        Object.keys(selectedUser.smartquestionnairedata.answers).length > 5
      );

      if (hasQuestionnaire) {
        showConfirmationModal("הצלחה", `התחברת כ-${selectedUser.name}`, () =>
          navigation.navigate("MainApp")
        );
      } else {
        showConfirmationModal(
          "התחברות בהצלחה",
          `התחברת כ-${selectedUser.name}. מעבר לשאלון.`,
          () => navigation.navigate("Questionnaire", {})
        );
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create demo user
  const createDemoUser = async () => {
    try {
      setLoading(true);
      const testUser = {
        name: `Demo User ${Date.now()}`,
        email: `demo${Date.now()}@test.com`,
        smartquestionnairedata: {
          answers: {
            gender: "male" as const,
            age: 30,
            fitnessLevel: "beginner" as const,
            goals: ["build_muscle"],
            equipment: ["dumbbells"],
            availability: ["3_days"],
          },
          metadata: {
            completedAt: new Date().toISOString(),
            version: "1.0",
          },
        },
      };

      await userApi.create(testUser);
      showConfirmationModal("הצלחה", "משתמש דמו נוצר בהצלחה", () => {});
      await loadUsers();
    } catch (error) {
      console.error("Error creating demo user:", error);
      showConfirmationModal("שגיאה", "לא ניתן ליצור משתמש דמו", () => {});
    } finally {
      setLoading(false);
    }
  };

  // Create user without questionnaire
  const createUserWithoutQuestionnaire = async () => {
    try {
      setLoading(true);
      const testUser = {
        name: `User No Quest ${Date.now()}`,
        email: `noquest${Date.now()}@test.com`,
      };

      await userApi.create(testUser);
      showConfirmationModal("הצלחה", "משתמש ללא שאלון נוצר בהצלחה", () => {});
      await loadUsers();
    } catch (error) {
      console.error("Error creating user:", error);
      showConfirmationModal("שגיאה", "לא ניתן ליצור משתמש", () => {});
    } finally {
      setLoading(false);
    }
  };

  // Reset all data
  const resetAllData = async () => {
    showConfirmationModal(
      "איפוס נתונים",
      "האם למחוק את כל הנתונים?",
      async () => {
        try {
          setLoading(true);
          setUser(null);
          const allKeys = await AsyncStorage.getAllKeys();
          await AsyncStorage.multiRemove(allKeys);
          showConfirmationModal("הצלחה", "כל הנתונים נמחקו", () => {});
        } catch (error) {
          console.error("Reset error:", error);
          showConfirmationModal("שגיאה", "לא ניתן לאפס נתונים", () => {});
        } finally {
          setLoading(false);
        }
      }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>מסך פיתוח</Text>
        <TouchableOpacity onPress={onRefresh}>
          <Ionicons name="refresh" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* System Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>מידע מערכת</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>משתמש נוכחי:</Text>
            <Text style={styles.infoValue}>{user?.name || "אין משתמש"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>כמות משתמשים:</Text>
            <Text style={styles.infoValue}>{users.length}</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>פעולות מהירות</Text>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={createDemoUser}
          >
            <Ionicons
              name="person-add"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={styles.actionText}>יצירת משתמש דמו</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={createUserWithoutQuestionnaire}
          >
            <Ionicons name="person" size={20} color={theme.colors.secondary} />
            <Text style={styles.actionText}>משתמש ללא שאלון</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={resetAllData}>
            <Ionicons name="trash" size={20} color={theme.colors.error} />
            <Text style={[styles.actionText, { color: theme.colors.error }]}>
              איפוס נתונים
            </Text>
          </TouchableOpacity>
        </View>

        {/* Users List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            רשימת משתמשים ({users.length})
          </Text>

          {users.map((userItem) => {
            const hasQuestionnaire = !!(
              userItem.smartquestionnairedata?.answers &&
              Object.keys(userItem.smartquestionnairedata.answers).length > 5
            );

            return (
              <TouchableOpacity
                key={userItem.id}
                style={styles.userItem}
                onPress={() => loginAsUser(userItem)}
              >
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{userItem.name}</Text>
                  <Text style={styles.userEmail}>{userItem.email}</Text>

                  <View style={styles.userTags}>
                    {userItem.name?.includes("Demo") && (
                      <Text style={styles.demoTag}>דמו</Text>
                    )}
                    <Text
                      style={[
                        styles.questionnaireTag,
                        {
                          backgroundColor: hasQuestionnaire
                            ? theme.colors.success + "20"
                            : theme.colors.error + "20",
                          color: hasQuestionnaire
                            ? theme.colors.success
                            : theme.colors.error,
                        },
                      ]}
                    >
                      {hasQuestionnaire ? "שאלון מלא" : "דרוש שאלון"}
                    </Text>
                  </View>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            );
          })}

          {users.length === 0 && !loading && (
            <Text style={styles.emptyText}>אין משתמשים</Text>
          )}
        </View>
      </ScrollView>

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <LoadingSpinner size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>טוען...</Text>
          </View>
        </View>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        visible={showModal}
        title={modalConfig.title}
        message={modalConfig.message}
        onClose={() => setShowModal(false)}
        onConfirm={() => {
          setShowModal(false);
          modalConfig.onConfirm();
        }}
        confirmText="אישור"
        cancelText="ביטול"
      />
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.cardBorder,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.colors.text,
  },
  content: {
    flex: 1,
  },
  section: {
    margin: 16,
    padding: 16,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 12,
    textAlign: "right",
  },
  infoRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  actionButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 4,
    backgroundColor: theme.colors.backgroundAlt,
    borderRadius: 8,
    gap: 12,
  },
  actionText: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: "500",
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  userInfo: {
    flex: 1,
    alignItems: "flex-end",
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "right",
  },
  userEmail: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "right",
  },
  userTags: {
    flexDirection: "row",
    gap: 4,
    marginTop: 4,
    justifyContent: "flex-end",
  },
  demoTag: {
    fontSize: 12,
    color: theme.colors.primary,
    backgroundColor: theme.colors.primary + "20",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  questionnaireTag: {
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  emptyText: {
    textAlign: "center",
    color: theme.colors.textSecondary,
    fontSize: 16,
    paddingVertical: 20,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    backgroundColor: theme.colors.card,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  loadingText: {
    color: theme.colors.text,
    fontSize: 16,
    marginTop: 10,
  },
});
