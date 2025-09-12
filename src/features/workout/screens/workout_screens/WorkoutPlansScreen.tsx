import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProp } from "@react-navigation/native";
import { theme } from "../../../../core/theme";
import { useUserStore } from "../../../../stores/userStore";
import type {
  WorkoutPlan,
  WorkoutExercise,
} from "../../../../core/types/workout.types";
import { RootStackParamList } from "../../../../navigation/types";
import BackButton from "../../../../components/common/BackButton";
import { UniversalModal } from "../../../../components/common/UniversalModal";
import EmptyState from "../../../../components/common/EmptyState";
import UniversalCard from "../../../../components/ui/UniversalCard";
import { questionnaireService } from "../../../questionnaire/services/questionnaireService";
import AppButton from "../../../../components/common/AppButton";
import { logger } from "../../../../utils/logger";

interface WorkoutPlanScreenProps {
  route?: {
    params?: {
      regenerate?: boolean;
      autoStart?: boolean;
    };
  };
}

export default function WorkoutPlansScreen({
  route: _route,
}: WorkoutPlanScreenProps): React.ReactElement {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const user = useUserStore((state) => state.user);

  const [selectedPlanType, setSelectedPlanType] = useState<"basic" | "smart">(
    "basic"
  );
  const [workoutPlans, setWorkoutPlans] = useState<{
    basic: WorkoutPlan | null;
    smart: WorkoutPlan | null;
  }>({ basic: null, smart: null });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: "", message: "" });

  const currentWorkoutPlan = workoutPlans[selectedPlanType];
  const canAccessAI =
    user?.subscription?.isActive || !user?.subscription?.hasCompletedTrial;

  const showMessage = (title: string, message: string) => {
    setModalConfig({ title, message });
    setShowModal(true);
  };

  const generatePlan = async (type: "basic" | "smart") => {
    try {
      setLoading(true);
      if (!user) {
        showMessage("שגיאה", "לא נמצא משתמש");
        return;
      }

      if (type === "smart" && !canAccessAI) {
        showMessage("גישה מוגבלת", "תכונות AI זמינות רק למנויים");
        return;
      }

      const plan =
        type === "smart"
          ? await questionnaireService.generateSmartWorkoutPlan()
          : await questionnaireService.generateBasicWorkoutPlan();

      setWorkoutPlans((prev) => ({ ...prev, [type]: plan }));
      showMessage(
        "תוכנית נוצרה!",
        `תוכנית ${type === "smart" ? "חכמה" : "בסיסית"} נוצרה בהצלחה`
      );
    } catch (err) {
      logger.error("WorkoutPlansScreen", "Error generating plan", err);
      showMessage(
        "שגיאה",
        `לא הצלחנו ליצור תוכנית ${type === "smart" ? "AI" : "בסיסית"}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStartWorkout = () => {
    if (!currentWorkoutPlan?.workouts?.[0]) {
      showMessage("שגיאה", "לא ניתן למצוא תבנית אימון");
      return;
    }

    const workout = currentWorkoutPlan.workouts[0];
    navigation.navigate("ActiveWorkout", {
      workoutData: {
        name: currentWorkoutPlan.name || "אימון יומי",
        dayName: workout.name || "יום אימון",
        startTime: new Date().toISOString(),
        exercises: (workout.exercises || []) as unknown as WorkoutExercise[],
      },
    });
  };

  const handleRefresh = async () => {
    await generatePlan(selectedPlanType);
  };

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
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
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
              onPress={() => setSelectedPlanType("basic")}
            >
              <Text style={styles.selectorButtonText}>בסיסית</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.selectorButton,
                selectedPlanType === "smart" && styles.selectorButtonActive,
                !canAccessAI && styles.selectorButtonDisabled,
              ]}
              onPress={() => canAccessAI && setSelectedPlanType("smart")}
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
            <AppButton
              title="התחל אימון"
              variant="workout"
              size="large"
              fullWidth
              onPress={handleStartWorkout}
              accessibilityLabel="התחל אימון חדש"
              accessibilityHint="לחץ כדי להתחיל אימון לפי התוכנית הנבחרת"
            />
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
          <AppButton
            title="צור תוכנית בסיסית"
            variant="secondary"
            size="medium"
            fullWidth
            onPress={() => generatePlan("basic")}
            accessibilityLabel="צור תוכנית אימון בסיסית"
            accessibilityHint="לחץ כדי ליצור תוכנית אימון בסיסית"
          />
          {canAccessAI && (
            <AppButton
              title="צור תוכנית AI"
              variant="primary"
              size="medium"
              fullWidth
              onPress={() => generatePlan("smart")}
              accessibilityLabel="צור תוכנית אימון חכמה"
              accessibilityHint="לחץ כדי ליצור תוכנית אימון מותאמת אישית באמצעות בינה מלאכותית"
            />
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
  actionsContainer: {
    gap: 12,
    marginTop: 24,
  },
};
