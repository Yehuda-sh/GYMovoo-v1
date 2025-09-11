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
import { User } from "../../types/user.types";
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
        selectedUser.questionnaireData?.answers &&
        Object.keys(selectedUser.questionnaireData.answers).length > 0
      );

      // Store in AsyncStorage
      await AsyncStorage.setItem("currentUser", JSON.stringify(selectedUser));

      // Navigate to appropriate screen
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

  // Delete user
  const deleteUser = async (userId: string) => {
    showConfirmationModal(
      "מחיקת משתמש",
      "האם אתה בטוח שברצונך למחוק את המשתמש?",
      async () => {
        try {
          setLoading(true);
          // Since there's no delete API, we'll just refresh the list
          console.log("Delete user:", userId);
          await loadUsers(); // Refresh the list
        } catch (error) {
          console.error("Error deleting user:", error);
        } finally {
          setLoading(false);
        }
      }
    );
  };

  // Create realistic user with workout history
  const createRealisticUser = async () => {
    const israeliNames = [
      "דוד כהן",
      "רחל לוי",
      "יוסי ישראל",
      "נועה שמואל",
      "אבי בן דוד",
      "מיכל גולדברג",
      "דני רוזן",
      "תמר אברהם",
      "עמית גרינברג",
      "שירה כץ",
      "רון פרידמן",
      "ליאת מלכה",
      "יונתן שפירא",
      "מור אדלר",
      "אורי ברק",
    ];

    const randomName =
      israeliNames[Math.floor(Math.random() * israeliNames.length)] ||
      "משתמש חדש";
    const [firstName, lastName] = randomName.split(" ");

    // Options that match the actual questionnaire
    const genderOptions = ["male", "female"];
    const ageOptions = ["18_25", "26_35", "36_50", "51_65"];
    const weightOptions = ["60_69", "70_79", "80_89", "90_99"];
    const heightOptions = ["161_170", "171_180", "181_190"];
    const fitnessGoals = [
      "lose_weight",
      "build_muscle",
      "general_fitness",
      "athletic_performance",
    ];
    const experienceLevels = ["beginner", "intermediate", "advanced"];
    const workoutLocations = [
      "home_bodyweight",
      "home_equipment",
      "gym",
      "mixed",
    ];
    const availabilityOptions = [
      "2_days",
      "3_days",
      "4_days",
      "5_days",
      "6_days",
    ];
    const durationOptions = [
      "15_30_min",
      "30_45_min",
      "45_60_min",
      "60_plus_min",
    ];
    const dietOptions = ["none_diet", "vegetarian", "vegan", "keto", "paleo"];

    // Equipment options based on location
    const getEquipmentForLocation = (location: string): string[] => {
      switch (location) {
        case "home_bodyweight":
          return ["yoga_mat", "water_bottles"];
        case "home_equipment":
          return ["dumbbells", "resistance_bands", "yoga_mat"];
        case "gym":
          return ["free_weights", "machines", "cardio_equipment"];
        case "mixed":
          return ["dumbbells", "yoga_mat", "free_weights"];
        default:
          return ["yoga_mat"];
      }
    };

    const selectedLocation =
      workoutLocations[Math.floor(Math.random() * workoutLocations.length)] ||
      "home_bodyweight";
    const equipment = getEquipmentForLocation(selectedLocation);

    const newUser: User = {
      id: `user_${Date.now()}`,
      email: `${(firstName || "user").toLowerCase()}.${(lastName || "test").toLowerCase()}@email.com`,
      name: randomName,
      questionnaireData: {
        answers: {
          // Personal Info
          gender:
            genderOptions[Math.floor(Math.random() * genderOptions.length)] ||
            "male",
          age:
            ageOptions[Math.floor(Math.random() * ageOptions.length)] ||
            "26_35",
          weight:
            weightOptions[Math.floor(Math.random() * weightOptions.length)] ||
            "70_79",
          height:
            heightOptions[Math.floor(Math.random() * heightOptions.length)] ||
            "171_180",

          // Fitness Goals & Experience
          fitness_goal:
            fitnessGoals[Math.floor(Math.random() * fitnessGoals.length)] ||
            "general_fitness",
          experience_level:
            experienceLevels[
              Math.floor(Math.random() * experienceLevels.length)
            ] || "beginner",

          // Workout Preferences
          workout_location: selectedLocation,
          availability:
            availabilityOptions[
              Math.floor(Math.random() * availabilityOptions.length)
            ] || "3_days",
          workout_duration:
            durationOptions[
              Math.floor(Math.random() * durationOptions.length)
            ] || "30_45_min",

          // Equipment (based on location)
          bodyweight_equipment:
            selectedLocation === "home_bodyweight"
              ? ["yoga_mat", "water_bottles"]
              : [],
          home_equipment:
            selectedLocation === "home_equipment" ? equipment : [],
          gym_equipment:
            selectedLocation === "gym" || selectedLocation === "mixed"
              ? equipment
              : [],

          // Diet & Health
          diet_preferences:
            dietOptions[Math.floor(Math.random() * dietOptions.length)] ||
            "none_diet",
          health_conditions: [],

          // Additional data for completeness
          goals: [
            fitnessGoals[Math.floor(Math.random() * fitnessGoals.length)] ||
              "general_fitness",
          ],
          equipment: equipment,
          fitnessLevel:
            experienceLevels[
              Math.floor(Math.random() * experienceLevels.length)
            ] || "beginner",
        },
        metadata: {
          completedAt: new Date().toISOString(),
          version: "1.0",
        },
      },
    };

    try {
      setLoading(true);
      const createdUser = await userApi.create(newUser);
      console.log("Created realistic user:", createdUser);
      await loadUsers(); // Refresh the list
    } catch (error) {
      console.error("Error creating realistic user:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderUserItem = (userData: User) => (
    <View key={userData.id} style={styles.userItem}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{userData.name}</Text>
        <Text style={styles.userEmail}>{userData.email}</Text>
        <Text style={styles.userDetails}>
          {userData.questionnaireData?.answers ? " יש שאלון" : " אין שאלון"}
        </Text>
      </View>
      <View style={styles.userActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.loginButton]}
          onPress={() => loginAsUser(userData)}
          disabled={loading}
        >
          <Ionicons name="log-in" size={20} color={theme.colors.white} />
          <Text style={styles.actionButtonText}>כניסה</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => deleteUser(userData.id || "")}
          disabled={loading}
        >
          <Ionicons name="trash" size={20} color={theme.colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );

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

          {/* Create Realistic User Button */}
          <TouchableOpacity
            style={[styles.createUserButton]}
            onPress={createRealisticUser}
            disabled={loading}
          >
            <Ionicons name="person-add" size={20} color={theme.colors.white} />
            <Text style={styles.createUserButtonText}>
              צור משתמש עם היסטוריה
            </Text>
          </TouchableOpacity>

          {user && (
            <View style={styles.currentUserInfo}>
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
            users.map(renderUserItem)
          )}
        </View>
      </ScrollView>

      {loading && users.length > 0 && (
        <View style={styles.loadingOverlay}>
          <LoadingSpinner />
        </View>
      )}

      <ConfirmationModal
        visible={showModal}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={() => {
          modalConfig.onConfirm();
          setShowModal(false);
        }}
        onCancel={() => setShowModal(false)}
        onClose={() => setShowModal(false)}
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
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginLeft: theme.spacing.md,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
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
    fontWeight: "bold",
    color: theme.colors.text,
  },
  userCount: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
  },
  createUserButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: 12,
    marginBottom: theme.spacing.lg,
  },
  createUserButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: theme.spacing.sm,
  },
  currentUserInfo: {
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
    marginBottom: theme.spacing.xs,
  },
  userActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: 8,
    gap: theme.spacing.xs,
  },
  loginButton: {
    backgroundColor: theme.colors.success,
  },
  deleteButton: {
    backgroundColor: theme.colors.error,
    paddingHorizontal: theme.spacing.sm,
  },
  actionButtonText: {
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
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
});
