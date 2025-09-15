import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProp } from "@react-navigation/native";
import { theme } from "../../../../core/theme";
import { useUserStore } from "../../../../stores/userStore";
import type { WorkoutExercise } from "../../../../core/types/workout.types";
import { RootStackParamList } from "../../../../navigation/types";
import BackButton from "../../../../components/common/BackButton";
import ConfirmationModal from "../../../../components/common/ConfirmationModal";
import EmptyState from "../../../../components/common/EmptyState";
import UniversalCard from "../../../../components/ui/UniversalCard";
import { questionnaireService } from "../../../questionnaire/services/questionnaireService";
import AppButton from "../../../../components/common/AppButton";
import { logger } from "../../../../utils/logger";

export default function WorkoutPlansScreen(): React.ReactElement {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const user = useUserStore((state) => state.user);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [workoutPlan, setWorkoutPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: "", message: "" });

  const currentWorkoutPlan = workoutPlan;

  const showMessage = (title: string, message: string) => {
    setModalConfig({ title, message });
    setShowModal(true);
  };

  const generatePlan = async () => {
    try {
      setLoading(true);
      if (!user) {
        showMessage("שגיאה", "לא נמצא משתמש");
        return;
      }

      const plans = await questionnaireService.generateSmartWorkoutPlan();

      // Take the first plan from the array
      const plan = plans.length > 0 ? plans[0] : null;

      if (!plan) {
        showMessage("שגיאה", "לא הצלחנו ליצור תוכנית אימון");
        return;
      }

      setWorkoutPlan(plan);
      showMessage("תוכנית נוצרה!", "תוכנית אימון נוצרה בהצלחה");
    } catch (err) {
      logger.error("WorkoutPlansScreen", "Error generating plan", err);
      showMessage("שגיאה", "לא הצלחנו ליצור תוכנית אימון");
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
    await generatePlan();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>יוצר תוכנית אימון...</Text>
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
          <Text style={styles.subtitle}>צור תוכנית אימון מותאמת אישית</Text>
        </View>

        {currentWorkoutPlan ? (
          <UniversalCard title={currentWorkoutPlan.name}>
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
            title="צור תוכנית אימון"
            variant="primary"
            size="medium"
            fullWidth
            onPress={() => generatePlan()}
            accessibilityLabel="צור תוכנית אימון"
            accessibilityHint="לחץ כדי ליצור תוכנית אימון מותאמת אישית"
          />
        </View>
      </ScrollView>

      <ConfirmationModal
        visible={showModal}
        title={modalConfig.title}
        message={modalConfig.message}
        onClose={() => setShowModal(false)}
        onConfirm={() => setShowModal(false)}
        singleButton={true}
        variant="default"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: "center",
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
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  planDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  planStats: {
    flexDirection: "row",
    flexWrap: "wrap",
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
});
