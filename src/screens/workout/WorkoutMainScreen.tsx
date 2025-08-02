/**
 * @file src/screens/workout/WorkoutMainScreen.tsx
 * @brief מסך ראשי לאימון - נקודת הכניסה מהניווט הראשי
 * @version 1.0.0
 * @author GYMovoo Development Team
 * @created 2025-08-02
 *
 * @description
 * מסך ראשי לאימון שמציג:
 * - אפשרות להתחיל אימון מהיר או מתוכנן
 * - קישור לתוכניות אימון
 * - הצגת משתמש דמו אם צריך
 *
 * המסך הזה פותר את הבעיה של כניסה ישירה מהניווט הראשי
 * ללא נתוני אימון ספציפיים.
 */

import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";

// Services
import { realisticDemoService } from "../../services/realisticDemoService";
import { nextWorkoutLogicService } from "../../services/nextWorkoutLogicService";

// Types
import { Exercise } from "./types/workout.types";

interface DemoUser {
  id: string;
  gender: string;
  workouts?: any[];
}

const WorkoutMainScreen: React.FC = () => {
  const navigation = useNavigation();
  const [demoUser, setDemoUser] = useState<DemoUser | null>(null);
  const [loading, setLoading] = useState(true);

  // טעינת נתוני משתמש דמו
  const loadUserData = async () => {
    try {
      setLoading(true);

      // בדיקה האם יש משתמש דמו
      let user = await realisticDemoService.getDemoUser();
      if (!user) {
        console.log("🏋️ No demo user found, creating one...");
        await realisticDemoService.createRealisticDemoUser("male");
        user = await realisticDemoService.getDemoUser();
      }

      setDemoUser(user);
    } catch (error) {
      console.error("❌ Error loading user data:", error);
      Alert.alert("שגיאה", "לא ניתן לטעון את נתוני המשתמש");
    } finally {
      setLoading(false);
    }
  };

  // טעינה מחדש כשחוזרים למסך
  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
    }, [])
  );

  // מעבר לתוכניות אימון
  const goToWorkoutPlans = () => {
    (navigation as any).navigate("WorkoutPlans");
  };

  // התחלת אימון מהיר מבוסס על היום הנוכחי
  const startQuickWorkout = async () => {
    try {
      // ננסה לקבל המלצה לאימון הבא
      const defaultWeeklyPlan = ["דחיפה", "משיכה", "רגליים"];
      const recommendation =
        await nextWorkoutLogicService.getNextWorkoutRecommendation(
          defaultWeeklyPlan
        );

      if (recommendation) {
        // מעבר לתוכניות עם בקשה להתחיל את האימון המוצע
        (navigation as any).navigate("WorkoutPlans", {
          autoStart: true,
          requestedWorkoutName: recommendation.workoutName,
        });
      } else {
        // אם אין המלצה, פשוט נעבור לתוכניות
        goToWorkoutPlans();
      }
    } catch (error) {
      console.error("❌ Error getting workout recommendation:", error);
      // במקרה של שגיאה, נעבור לתוכניות
      goToWorkoutPlans();
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <MaterialCommunityIcons
          name="dumbbell"
          size={40}
          color={theme.colors.primary}
        />
        <Text style={styles.loadingText}>טוען נתוני אימון...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>אימון</Text>

      {/* הודעת ברוכים הבאים */}
      <View style={styles.welcomeCard}>
        <MaterialCommunityIcons
          name="hand-wave"
          size={24}
          color={theme.colors.primary}
        />
        <Text style={styles.welcomeText}>
          {demoUser ? "מוכן לאימון?" : "ברוך הבא!"}
        </Text>
        <Text style={styles.welcomeSubtext}>
          בחר איך תרצה להתחיל את האימון שלך
        </Text>
      </View>

      {/* אימון מהיר */}
      <TouchableOpacity
        style={styles.quickWorkoutCard}
        onPress={startQuickWorkout}
      >
        <View style={styles.cardContent}>
          <MaterialCommunityIcons
            name="lightning-bolt"
            size={32}
            color={theme.colors.warning}
          />
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>אימון מהיר</Text>
            <Text style={styles.cardSubtitle}>
              התחל אימון מיד בהתאם למחזור שלך
            </Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-left"
            size={24}
            color={theme.colors.textSecondary}
          />
        </View>
      </TouchableOpacity>

      {/* תוכניות אימון */}
      <TouchableOpacity style={styles.plansCard} onPress={goToWorkoutPlans}>
        <View style={styles.cardContent}>
          <MaterialCommunityIcons
            name="clipboard-list"
            size={32}
            color={theme.colors.primary}
          />
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>תוכניות אימון</Text>
            <Text style={styles.cardSubtitle}>
              עיין בתוכניות מלאות ובחר אימון ספציפי
            </Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-left"
            size={24}
            color={theme.colors.textSecondary}
          />
        </View>
      </TouchableOpacity>

      {/* סטטיסטיקות מהירות */}
      {demoUser && (
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>סטטיסטיקות מהירות</Text>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <MaterialCommunityIcons
                name="calendar-check"
                size={20}
                color={theme.colors.success}
              />
              <Text style={styles.statNumber}>
                {demoUser.workouts?.length || 0}
              </Text>
              <Text style={styles.statLabel}>אימונים</Text>
            </View>

            <View style={styles.statCard}>
              <MaterialCommunityIcons
                name="trending-up"
                size={20}
                color={theme.colors.primary}
              />
              <Text style={styles.statNumber}>92%</Text>
              <Text style={styles.statLabel}>התקדמות</Text>
            </View>

            <View style={styles.statCard}>
              <MaterialCommunityIcons
                name="fire"
                size={20}
                color={theme.colors.warning}
              />
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>סטריק</Text>
            </View>
          </View>
        </View>
      )}

      {/* מידע נוסף */}
      <View style={styles.infoCard}>
        <MaterialCommunityIcons
          name="information"
          size={20}
          color={theme.colors.primary}
        />
        <Text style={styles.infoText}>
          לחץ על "אימון מהיר" להתחלה מיידית, או בחר "תוכניות אימון" לתכנון
          מפורט.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 30,
    textAlign: "center",
  },
  welcomeCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.colors.text,
    marginTop: 10,
    marginBottom: 5,
  },
  welcomeSubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  quickWorkoutCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.warning,
  },
  plansCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  cardInfo: {
    flex: 1,
    marginLeft: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  statsContainer: {
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "flex-start",
    opacity: 0.8,
  },
  infoText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginLeft: 10,
    flex: 1,
    lineHeight: 18,
  },
});

export default WorkoutMainScreen;
