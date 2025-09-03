import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../styles/theme";
import { useUserStore } from "../../stores/userStore";
import type { WorkoutPlan } from "../../types/index";
import type { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";
import BackButton from "../../components/common/BackButton";
import { UniversalModal } from "../../components/common/UniversalModal";
import EmptyState from "../../components/common/EmptyState";
import UniversalCard from "../../components/ui/UniversalCard";
import { questionnaireService } from "../../services/questionnaireService";

interface WorkoutPlanScreenProps {
  route?: {
    params?: {
      regenerate?: boolean;
      autoStart?: boolean;
    };
  };
}

export default function WorkoutPlansScreen({
  route,
}: WorkoutPlanScreenProps): React.ReactElement {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const user = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);

  const [refreshing, setRefreshing] = useState(false);
  const [selectedPlanType, setSelectedPlanType] = useState<"basic" | "smart">(
    "basic"
  );
  const [basicPlan, setBasicPlan] = useState<WorkoutPlan | null>(null);
  const [smartPlan, setSmartPlan] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: "", message: "" });

  const showError = (title: string, message: string) => {
    setModalConfig({ title, message });
    setShowModal(true);
  };

  const showSuccess = (title: string, message: string) => {
    setModalConfig({ title, message });
    setShowModal(true);
  };

  const currentWorkoutPlan =
    selectedPlanType === "smart" ? smartPlan : basicPlan;
  const canAccessAI =
    user?.subscription?.isActive || !user?.subscription?.hasCompletedTrial;

  const generateBasicPlan = useCallback(async () => {
    try {
      setLoading(true);
      if (!user) {
        showError("שגיאה", "לא נמצא משתמש");
        return;
      }
      const plan = await questionnaireService.generateBasicWorkoutPlan();
      setBasicPlan(plan);
      showSuccess("תוכנית נוצרה!", "תוכנית בסיסית נוצרה בהצלחה");
    } catch (error) {
      showError("שגיאה", "לא הצלחנו ליצור תוכנית בסיסית");
    } finally {
      setLoading(false);
    }
  }, [user]);

  const generateAIPlan = useCallback(async () => {
    try {
      setLoading(true);
      if (!user) {
        showError("שגיאה", "לא נמצא משתמש");
        return;
      }
      if (!canAccessAI) {
        showError("גישה מוגבלת", "תכונות AI זמינות רק למנויים");
        return;
      }
      const plan = await questionnaireService.generateSmartWorkoutPlan();
      setSmartPlan(plan);
      showSuccess("תוכנית AI נוצרה!", "תוכנית חכמה נוצרה במיוחד עבורך");
    } catch (error) {
      showError("שגיאה", "לא הצלחנו ליצור תוכנית AI");
    } finally {
      setLoading(false);
    }
  }, [user, canAccessAI]);

  const handleSelectPlanType = useCallback((type: "basic" | "smart") => {
    setSelectedPlanType(type);
  }, []);

  const handleStartWorkout = useCallback(() => {
    if (!currentWorkoutPlan) {
      showError("אין תוכנית", "יש ליצור תוכנית אימון תחילה");
      return;
    }
    const workout = currentWorkoutPlan.workouts?.[0];
    if (!workout) {
      showError("שגיאה", "לא ניתן למצוא תבנית אימון");
      return;
    }
    showSuccess("אימון מתחיל!", "מעבר למסך האימון");
    navigation.navigate("ActiveWorkout", {
      workoutData: {
        name: currentWorkoutPlan.name || "אימון יומי",
        dayName: workout.name || "יום אימון",
        startTime: new Date().toISOString(),
        exercises: (workout.exercises as any) || [],
      },
    });
  }, [currentWorkoutPlan, navigation]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      if (selectedPlanType === "smart" && canAccessAI) {
        await generateAIPlan();
      } else {
        await generateBasicPlan();
      }
    } finally {
      setRefreshing(false);
    }
  }, [selectedPlanType, canAccessAI, generateAIPlan, generateBasicPlan]);

  useEffect(() => {
    if (!basicPlan) {
      generateBasicPlan();
    }
  }, [basicPlan, generateBasicPlan]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            {selectedPlanType === "smart"
              ? "יוצר תוכנית AI..."
              : "יוצר תוכנית בסיסית..."}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>תוכניות אימון</Text>
          <Text style={styles.subtitle}>בחר תוכנית ותתחיל להתאמן עוד היום</Text>
        </View>

        <View style={styles.selectorContainer}>
          <Text style={styles.selectorTitle}>סוג תוכנית:</Text>
          <View style={styles.selectorButtons}>
            <TouchableOpacity
              style={[
                styles.selectorButton,
                selectedPlanType === "basic" && styles.selectorButtonActive,
              ]}
              onPress={() => handleSelectPlanType("basic")}
            >
              <Text style={styles.selectorButtonText}>בסיסית</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.selectorButton,
                selectedPlanType === "smart" && styles.selectorButtonActive,
                !canAccessAI && styles.selectorButtonDisabled,
              ]}
              onPress={() => canAccessAI && handleSelectPlanType("smart")}
              disabled={!canAccessAI}
            >
              <Text style={styles.selectorButtonText}>חכמה (AI)</Text>
            </TouchableOpacity>
          </View>
        </View>

        {currentWorkoutPlan ? (
          <UniversalCard title={currentWorkoutPlan.name} variant="workout">
            <Text style={styles.planDescription}>
              {currentWorkoutPlan.description}
            </Text>
            <View style={styles.planStats}>
              <Text style={styles.planStat}>
                🏋️ {currentWorkoutPlan.workouts?.length || 0} אימונים
              </Text>
              <Text style={styles.planStat}>
                ⏱️ {currentWorkoutPlan.duration} דקות
              </Text>
              <Text style={styles.planStat}>
                📅 {currentWorkoutPlan.frequency} פעמים בשבוע
              </Text>
            </View>
            <TouchableOpacity
              style={styles.startButton}
              onPress={handleStartWorkout}
            >
              <Text style={styles.startButtonText}>התחל אימון</Text>
            </TouchableOpacity>
          </UniversalCard>
        ) : (
          <EmptyState
            icon="clipboard-outline"
            title="אין תוכנית אימון"
            description="יצור תוכנית חדשה כדי להתחיל להתאמן"
            variant="compact"
          />
        )}

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={generateBasicPlan}
          >
            <Text style={styles.actionButtonText}>צור תוכנית בסיסית</Text>
          </TouchableOpacity>
          {canAccessAI && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={generateAIPlan}
            >
              <Text style={styles.actionButtonText}>צור תוכנית AI</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <UniversalModal
        visible={showModal}
        type="info"
        title={modalConfig.title}
        message={modalConfig.message}
        onClose={() => setShowModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: "center" as const,
    marginTop: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: "center" as const,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold" as const,
    color: theme.colors.text,
    textAlign: "center" as const,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center" as const,
  },
  selectorContainer: {
    marginBottom: 24,
  },
  selectorTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: theme.colors.text,
    marginBottom: 12,
  },
  selectorButtons: {
    flexDirection: "row" as const,
    gap: 12,
  },
  selectorButton: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    alignItems: "center" as const,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectorButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  selectorButtonDisabled: {
    backgroundColor: theme.colors.surface,
    opacity: 0.6,
  },
  selectorButtonText: {
    fontSize: 16,
    fontWeight: "500" as const,
    color: theme.colors.text,
  },
  planDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  planStats: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 12,
    marginBottom: 16,
  },
  planStat: {
    fontSize: 14,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  startButton: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center" as const,
    marginTop: 8,
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600" as const,
  },
  actionsContainer: {
    flexDirection: "row" as const,
    gap: 12,
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: "center" as const,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  actionButtonText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "500" as const,
  },
};
