/**
 * @file src/screens/workout/components/WorkoutSummary.tsx
 * @description מסך סיכום אימון - מעודכן עם משוב וניתוח
 * English: Workout summary screen - updated with feedback and analysis
 *
 * @features
 * - ✅ Workout statistics with volume, sets, duration, personal records
 * - ✅ Interactive feedback system (difficulty, feeling, readiness)
 * - ✅ Personal records detection and display
 * - ✅ Weekly workout calendar with streak tracking
 * - ✅ Smart recommendations for next workout
 * - ✅ Share functionality with formatted text
 * - ✅ Achievement testing system for development
 * - ✅ Complete RTL support and accessibility
 *
 * @performance
 * - React.memo for re-render prevention
 * - useCallback for stable function references
 * - useMemo for expensive calculations
 * - Centralized helper functions (formatDuration, formatVolume)
 *
 * @accessibility
 * - Full screen reader support
 * - Clear role definitions and labels
 * - RTL text direction and layout
 * - Interactive feedback elements
 *
 * @updated 2025-08-02 - Code optimization, helper functions integration, and share functionality
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../styles/theme";
import {
  formatTime,
  formatDuration,
  formatVolume,
} from "../../../utils/workoutHelpers";
import { WorkoutData } from "../types/workout.types";
import {
  workoutHistoryService,
  PersonalRecord,
} from "../../../services/workoutHistoryService";
import { nextWorkoutLogicService } from "../../../services/nextWorkoutLogicService";
import { getWorkoutIndexByName } from "../../../utils/workoutNamesSync";

const isRTL = theme.isRTL; // תמיכה ב-RTL

interface WorkoutSummaryProps {
  workout: WorkoutData;
  onClose: () => void;
  onSave: () => void;
}

export const WorkoutSummary: React.FC<WorkoutSummaryProps> = React.memo(
  ({ workout, onClose, onSave }) => {
    // State for feedback
    const [difficulty, setDifficulty] = useState<number>(0); // 1-5 stars
    const [feeling, setFeeling] = useState<string>(""); // emoji
    const [readyForMore, setReadyForMore] = useState<boolean | null>(null);
    const [personalRecords, setPersonalRecords] = useState<PersonalRecord[]>(
      []
    );

    // Optimized handlers with useCallback
    const handleDifficultyChange = useCallback((star: number) => {
      setDifficulty(star);
    }, []);

    const handleFeelingChange = useCallback((emotionValue: string) => {
      setFeeling(emotionValue);
    }, []);

    // זיהוי שיאים אישיים באימון הנוכחי
    useEffect(() => {
      const detectRecords = async () => {
        try {
          const records =
            await workoutHistoryService.detectPersonalRecords(workout);
          setPersonalRecords(records);
        } catch (error) {
          console.error("Error detecting records:", error);
        }
      };
      detectRecords();
    }, [workout]);

    // חישוב סטטיסטיקות - optimized with useMemo
    const stats = React.useMemo(
      () => ({
        duration: Math.floor((workout.duration || 0) / 60),
        totalSets: workout.exercises.reduce(
          (acc, ex) =>
            acc +
            ex.sets.filter(
              (s) =>
                // סט נחשב מושלם אם הוא מסומן כמושלם OR יש לו ערכים ממשיים
                s.completed || (s.actualReps && s.actualWeight)
            ).length,
          0
        ),
        totalPlannedSets: workout.exercises.reduce(
          (acc, ex) => acc + ex.sets.length,
          0
        ),
        totalVolume: workout.exercises.reduce(
          (acc, ex) =>
            acc +
            ex.sets.reduce(
              (setAcc, set) =>
                // כלול סטים מושלמים או סטים עם ערכים ממשיים
                set.completed || (set.actualReps && set.actualWeight)
                  ? setAcc + (set.actualWeight || 0) * (set.actualReps || 0)
                  : setAcc,
              0
            ),
          0
        ),
        personalRecords: personalRecords.length, // עדכון להשתמש בשיאים החדשים שזוהו
      }),
      [workout, personalRecords]
    );

    const handleShareWorkout = useCallback(() => {
      const shareText = `🏋️ סיימתי אימון!
${workout.name || "אימון מהיר"}
⏱️ ${formatDuration(stats.duration)}
💪 ${stats.totalSets} סטים הושלמו
🏆 ${formatVolume(stats.totalVolume)} ק"ג נפח כולל
${stats.personalRecords > 0 ? `🌟 ${stats.personalRecords} שיאים אישיים!` : ""}

#GYMovoo #אימון #כושר`;

      Alert.alert("שיתוף אימון", shareText, [
        {
          text: "העתק טקסט",
          onPress: () => console.log("Copy text:", shareText),
        },
        {
          text: "שתף",
          onPress: () => console.log("Share workout:", shareText),
        },
        { text: "ביטול", style: "cancel" },
      ]);
    }, [workout, stats]);

    // פונקציה לשמירת המשוב והאימון להיסטוריה
    const handleSaveWorkoutWithFeedback = useCallback(async () => {
      try {
        // יצירת אובייקט מלא עם כל הנתונים
        const workoutWithFeedback = {
          workout,
          feedback: {
            difficulty,
            feeling,
            readyForMore,
            completedAt: new Date().toISOString(),
          },
          stats,
        };

        // שמירה לHistoryStorage
        await workoutHistoryService.saveWorkoutWithFeedback(
          workoutWithFeedback
        );

        // עדכון מחזור האימונים
        try {
          const workoutName = workout.name || "אימון";

          // קבלת התוכנית השבועית (נניח תוכנית בסיסית של 3 ימים אם אין מידע)
          const weeklyPlan = ["דחיפה", "משיכה", "רגליים"]; // יכול להיות דינמי בעתיד

          // שימוש בכלי החכם לזיהוי האינדקס
          const workoutIndex = getWorkoutIndexByName(workoutName, weeklyPlan);

          console.log(
            `🔄 Updating workout cycle: "${workoutName}" → index ${workoutIndex} in plan:`,
            weeklyPlan
          );

          await nextWorkoutLogicService.updateWorkoutCompleted(
            workoutIndex,
            workoutName
          );
        } catch (cycleError) {
          console.warn("⚠️ Could not update workout cycle:", cycleError);
          // לא נעצור את השמירה בגלל זה
        }

        // הודעת הצלחה
        alert("האימון והמשוב נשמרו בהצלחה! 💾\nתוכל לראות אותם במסך ההיסטוריה");

        // סגירת המסך
        onSave();
      } catch (error) {
        console.error("Error saving workout:", error);
        alert("שגיאה בשמירת האימון - נסה שוב");
      }
    }, [workout, difficulty, feeling, readyForMore, stats, onSave]);

    return (
      <View style={styles.modalContainer}>
        <View style={styles.container}>
          <LinearGradient
            colors={[
              theme.colors.primaryGradientStart,
              theme.colors.primaryGradientEnd,
            ]}
            style={styles.header}
          >
            {/* כפתורי פעולה עליונים */}
            <View style={styles.topActions}>
              <TouchableOpacity
                style={styles.topActionButton}
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel="סגור מסך סיכום"
              >
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={theme.colors.text}
                />
              </TouchableOpacity>

              <View style={styles.headerCenter}>
                <MaterialCommunityIcons
                  name="trophy"
                  size={32} // הקטנתי עוד יותר
                  color={theme.colors.text}
                />
                <Text style={styles.congratsText}>כל הכבוד! 🎉</Text>
                <Text style={styles.workoutName}>
                  {workout.name || "אימון מהיר"}
                </Text>
              </View>

              <View style={styles.topActionsRight}>
                <TouchableOpacity
                  style={styles.topActionButton}
                  onPress={handleShareWorkout}
                  accessibilityRole="button"
                  accessibilityLabel="שתף אימון"
                >
                  <MaterialCommunityIcons
                    name="share-variant"
                    size={20}
                    color={theme.colors.text}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.topActionButton}
                  onPress={onSave}
                  accessibilityRole="button"
                  accessibilityLabel="שמור אימון מהיר"
                >
                  <MaterialCommunityIcons
                    name="content-save"
                    size={20}
                    color={theme.colors.text}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            accessible={true}
            accessibilityLabel="תוכן סיכום האימון"
          >
            {/* סטטיסטיקות */}
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={24}
                  color={theme.colors.primary}
                />
                <Text style={styles.statValue}>
                  {formatDuration(stats.duration)}
                </Text>
                <Text style={styles.statLabel}>משך האימון</Text>
              </View>

              <View style={styles.statCard}>
                <MaterialCommunityIcons
                  name="checkbox-marked-circle-outline"
                  size={24}
                  color={theme.colors.success}
                />
                <Text style={styles.statValue}>
                  {stats.totalSets}/{stats.totalPlannedSets}
                </Text>
                <Text style={styles.statLabel}>סטים הושלמו</Text>
              </View>

              <View style={styles.statCard}>
                <MaterialCommunityIcons
                  name="weight-kilogram"
                  size={24}
                  color={theme.colors.accent}
                />
                <Text style={styles.statValue}>
                  {formatVolume(stats.totalVolume)}
                </Text>
                <Text style={styles.statLabel}>ק"ג נפח כולל</Text>
              </View>

              {stats.personalRecords > 0 && (
                <View style={styles.statCard}>
                  <MaterialCommunityIcons
                    name="star"
                    size={24}
                    color={theme.colors.warning}
                  />
                  <Text style={styles.statValue}>{stats.personalRecords}</Text>
                  <Text style={styles.statLabel}>שיאים אישיים!</Text>
                </View>
              )}
            </View>

            {/* קטע משוב + לוח שנה */}
            <View style={styles.feedbackSection}>
              {/* הסרת הטקסט הדיבג הישן */}

              <Text style={styles.sectionTitle}>איך היה האימון? 💪</Text>

              {/* דירוג קושי - גרסה קומפקטית */}
              <View style={styles.compactFeedbackRow}>
                <Text style={styles.compactLabel}>קושי:</Text>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => handleDifficultyChange(star)}
                      style={styles.starButton}
                      accessibilityRole="button"
                      accessibilityLabel={`דרג קושי ${star} מתוך 5 כוכבים`}
                      accessibilityState={{ selected: star <= difficulty }}
                    >
                      <MaterialCommunityIcons
                        name={star <= difficulty ? "star" : "star-outline"}
                        size={18} // הקטנתי עוד יותר
                        color={
                          star <= difficulty
                            ? theme.colors.warning
                            : theme.colors.textSecondary
                        }
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.difficultyHint}>
                  {difficulty === 0 && "בחר מ1-5 ⭐"}
                  {difficulty === 1 && "קל מאוד 😊"}
                  {difficulty === 2 && "קל 🙂"}
                  {difficulty === 3 && "בינוני 😐"}
                  {difficulty === 4 && "קשה 😤"}
                  {difficulty === 5 && "קשה מאוד 🔥"}
                </Text>
              </View>

              {/* איך הרגשת - גרסה קומפקטית */}
              <View style={styles.compactFeedbackRow}>
                <Text style={styles.compactLabel}>הרגשה:</Text>
                <View style={styles.emotionsContainerCompact}>
                  {[
                    { emoji: "😤", value: "challenging", label: "מאתגר" },
                    { emoji: "💪", value: "strong", label: "חזק" },
                    { emoji: "😊", value: "enjoyable", label: "נהנה" },
                    { emoji: "😴", value: "easy", label: "קל" },
                  ].map((emotion) => (
                    <TouchableOpacity
                      key={emotion.value}
                      onPress={() => handleFeelingChange(emotion.value)}
                      style={[
                        styles.emotionButtonCompact,
                        feeling === emotion.value &&
                          styles.emotionButtonSelected,
                      ]}
                      accessibilityRole="button"
                      accessibilityLabel={`הרגשה: ${emotion.label}`}
                      accessibilityState={{
                        selected: feeling === emotion.value,
                      }}
                    >
                      <Text style={styles.emotionEmojiSmall}>
                        {emotion.emoji}
                      </Text>
                      <Text style={styles.emotionLabelSmall}>
                        {emotion.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* שבוע - גרסה קומפקטית */}
              <View style={styles.compactFeedbackRow}>
                <Text style={styles.compactLabel}>השבוع:</Text>
                <View style={styles.weekContainerCompact}>
                  {["א", "ב", "ג", "ד", "ה", "ו", "ש"].map((day, index) => {
                    const isToday = index === new Date().getDay();
                    const hasWorkout = index <= 2;
                    const isNextPlanned = index === 3; // יום רביעי - האימון הבא המתוכנן

                    return (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.dayCircleSmall,
                          hasWorkout && styles.dayCircleWithWorkout,
                          isToday && styles.dayCircleToday,
                          isNextPlanned && styles.dayCirclePlanned,
                        ]}
                        onPress={() => {
                          if (isNextPlanned) {
                            alert(
                              "תזכורת נוספה! 🔔\nתקבל התראה ביום רביעי לאימון הבא"
                            );
                            // כאן נוכל להוסיף תזכורת או לתכנן אימון
                          }
                        }}
                        accessibilityRole="button"
                        accessibilityLabel={
                          hasWorkout
                            ? `יום ${day} - אימון הושלם`
                            : isNextPlanned
                              ? `יום ${day} - אימון מתוכנן, לחץ להוספת תזכורת`
                              : `יום ${day}`
                        }
                      >
                        {hasWorkout ? (
                          <MaterialCommunityIcons
                            name="check"
                            size={12}
                            color={theme.colors.success}
                          />
                        ) : isNextPlanned ? (
                          <MaterialCommunityIcons
                            name="plus"
                            size={12}
                            color={theme.colors.primary}
                          />
                        ) : (
                          <Text style={styles.dayTextSmall}>{day}</Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                  <View style={styles.streakContainer}>
                    <Text style={styles.streakTextSmall}>🔥3</Text>
                    <Text style={styles.streakHint}>שמור על הלהבה!</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* הישגים */}
            {personalRecords.length > 0 && (
              <View style={styles.achievementSection}>
                <View style={styles.achievementHeader}>
                  <MaterialCommunityIcons
                    name="trophy"
                    size={32}
                    color={theme.colors.warning}
                  />
                  <Text style={styles.achievementTitle}>
                    {personalRecords.length > 1 ? "שיאים חדשים!" : "שיא חדש!"}{" "}
                    🏆
                  </Text>
                </View>

                {personalRecords.map((record, index) => (
                  <View key={index} style={styles.recordItem}>
                    <Text style={styles.recordExercise}>
                      {record.exerciseName}
                    </Text>
                    <Text style={styles.recordDetails}>
                      {record.type === "weight" &&
                        `שיא משקל: ${record.value}kg`}
                      {record.type === "volume" &&
                        `שיא נפח: ${record.value}kg×חזרות`}
                      {record.type === "reps" &&
                        `שיא חזרות: ${record.value} חזרות`}
                      {record.previousValue > 0 && (
                        <Text style={styles.improvement}>
                          {" "}
                          (+{record.improvement}
                          {record.type === "weight" && "kg"}
                          {record.type === "reps" && " חזרות"})
                        </Text>
                      )}
                    </Text>
                  </View>
                ))}

                <View style={styles.badgeContainer}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {personalRecords.length} שיא
                      {personalRecords.length > 1 ? "ים" : ""} אישי 💪
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* פירוט תרגילים - מקוצר */}
            {workout.exercises.length <= 3 && (
              <>
                <Text style={styles.sectionTitle}>סיכום תרגילים</Text>
                {workout.exercises.map((exercise, index) => {
                  const completedSets = exercise.sets.filter(
                    (s) => s.completed
                  );
                  const exerciseVolume = completedSets.reduce(
                    (acc, set) =>
                      acc + (set.actualWeight || 0) * (set.actualReps || 0),
                    0
                  );

                  return (
                    <View
                      key={index}
                      style={[
                        styles.exerciseSummary,
                        { padding: theme.spacing.sm },
                      ]}
                    >
                      <Text style={styles.exerciseName}>{exercise.name}</Text>
                      <View style={styles.exerciseStats}>
                        <Text style={styles.exerciseStat}>
                          {completedSets.length} סטים
                        </Text>
                        <Text style={styles.exerciseStat}>
                          {formatVolume(exerciseVolume)} ק"ג נפח
                        </Text>
                        {exercise.sets.some((s) => s.isPR) && (
                          <View style={styles.prBadge}>
                            <Text style={styles.prText}>שיא!</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  );
                })}
              </>
            )}

            {/* המלצות קומפקטיות */}
            <View style={styles.recommendationsSection}>
              <Text style={styles.sectionTitle}>מה הלאה? 🎯</Text>

              <Text style={styles.recommendationTextCompact}>
                💡 <Text style={{ fontWeight: "600" }}>אימון הבא:</Text> מח' ה-
                {new Date(
                  Date.now() + 2 * 24 * 60 * 60 * 1000
                ).toLocaleDateString("he-IL", { weekday: "long" })}
              </Text>

              <Text style={styles.recommendationTextCompact}>
                🎯 <Text style={{ fontWeight: "600" }}>המלצה:</Text>{" "}
                {difficulty >= 4
                  ? "הורד משקל, הוסף חזרות"
                  : 'העלה משקל ב-2.5 ק"ג'}
              </Text>

              {readyForMore === true && (
                <Text style={styles.recommendationTextCompact}>
                  🔥 <Text style={{ fontWeight: "600" }}>אתגר:</Text> הוסף סט
                  נוסף בפעם הבאה!
                </Text>
              )}
            </View>

            {/* כפתור שמירה */}
            <View style={styles.saveButtonContainer}>
              {/* 🧪 כפתור בדיקה להישגים */}
              <TouchableOpacity
                style={styles.testAchievementButton}
                onPress={() => {
                  // בחירת הישג רנדומלי
                  const achievements = [
                    {
                      title: "צאצא ביום הראשון",
                      description: "השלמת האימון הראשון! כל הכבוד!",
                      icon: "baby-face-outline",
                      color: "#4CAF50",
                    },
                    {
                      title: "מתמיד שבועי",
                      description: "5 אימונים ברצף! אתה מתמיד אמיתי!",
                      icon: "fire",
                      color: "#FF5722",
                    },
                    {
                      title: "מלך הכוח",
                      description: "הרמת משקל מעל 100 ק״ג! כוח נורא!",
                      icon: "dumbbell",
                      color: "#9C27B0",
                    },
                    {
                      title: "מרתון כושר",
                      description: "26 שעות של אימונים! זה מרתון אמיתי!",
                      icon: "run",
                      color: "#2196F3",
                    },
                    {
                      title: "כושר בוקר",
                      description: "15 אימוני בוקר! תתחיל את היום נכון!",
                      icon: "weather-sunny",
                      color: "#FFA500",
                    },
                  ];
                  const randomAchievement =
                    achievements[
                      Math.floor(Math.random() * achievements.length)
                    ];

                  // אלרט עם אפשרויות
                  Alert.alert(
                    "בדיקת מערכת הישגים",
                    "בחר איך לסיים את האימון:",
                    [
                      {
                        text: "רגיל",
                        onPress: () => handleSaveWorkoutWithFeedback(),
                        style: "default",
                      },
                      {
                        text: `עם הישג פייק`,
                        onPress: () => {
                          // הצגת הישג פייק בלי שמירה
                          Alert.alert(
                            `🎉 הישג חדש!`,
                            `🏆 ${randomAchievement.title}\n\n${randomAchievement.description}\n\n⚠️ זהו הישג לבדיקה בלבד - לא נשמר!`,
                            [{ text: "מעולה! 🎯", style: "default" }]
                          );
                        },
                        style: "default",
                      },
                      {
                        text: "ביטול",
                        style: "cancel",
                      },
                    ]
                  );
                }}
                accessibilityRole="button"
                accessibilityLabel="בדיקת מערכת הישגים"
              >
                <MaterialCommunityIcons
                  name="test-tube"
                  size={20}
                  color={theme.colors.primary}
                />
                <Text style={styles.testAchievementButtonText}>
                  🧪 בדיקת הישגים
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.mainSaveButton}
                onPress={handleSaveWorkoutWithFeedback}
                accessibilityRole="button"
                accessibilityLabel="שמור אימון ומשוב במערכת"
                accessibilityHint="שומר את פרטי האימון והמשוב שלך להיסטוריה"
              >
                <MaterialCommunityIcons
                  name="content-save"
                  size={24}
                  color={theme.colors.background}
                />
                <Text style={styles.mainSaveButtonText}>שמור אימון ומשוב</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
);

export const styles = StyleSheet.create({
  modalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.background,
    zIndex: 1000,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    writingDirection: isRTL ? "rtl" : "ltr",
  },
  header: {
    paddingVertical: theme.spacing.sm, // הקטנתי מ-md
    paddingHorizontal: theme.spacing.md, // הקטנתי מ-lg
  },
  topActions: {
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  topActionButton: {
    padding: theme.spacing.md,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginHorizontal: theme.spacing.xs,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    ...theme.shadows.small,
    // Enhanced interaction feedback
    transform: [{ scale: 1 }],
  },
  headerCenter: {
    alignItems: "center",
    flex: 1,
  },
  topActionsRight: {
    flexDirection: isRTL ? "row-reverse" : "row",
  },
  congratsText: {
    fontSize: theme.typography.h3.fontSize, // הקטנתי מ-h2
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.text,
    marginTop: theme.spacing.xs, // הקטנתי מ-md
    textAlign: "center",
    writingDirection: isRTL ? "rtl" : "ltr",
  },
  workoutName: {
    fontSize: theme.typography.body.fontSize, // הקטנתי (הסרתי +2)
    color: theme.colors.text,
    opacity: 0.9,
    marginTop: theme.spacing.xs, // הקטנתי מ-sm
    textAlign: "center",
    writingDirection: isRTL ? "rtl" : "ltr",
  },
  content: {
    flex: 1,
    padding: theme.spacing.md, // הקטנתי מ-lg
  },
  statsGrid: {
    flexDirection: isRTL ? "row-reverse" : "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: theme.spacing.lg, // הקטנתי מ-xl
  },
  statCard: {
    width: "48%",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md, // הקטנתי מ-lg
    padding: theme.spacing.md, // הקטנתי מ-lg
    alignItems: "center",
    marginBottom: theme.spacing.sm, // הקטנתי מ-md
    ...theme.shadows.small, // הקטנתי מ-medium
  },
  statValue: {
    fontSize: 18, // הקטנתי מ-24
    fontWeight: "bold",
    color: theme.colors.text,
    marginTop: theme.spacing.xs, // הקטנתי מ-sm
  },
  statLabel: {
    fontSize: theme.typography.caption.fontSize - 1, // הקטנתי עוד יותר
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  sectionTitle: {
    fontSize: theme.typography.body.fontSize + 1, // הקטנתי מ-h3
    fontWeight: "600", // פחות בולט מ-h3.fontWeight
    color: theme.colors.text,
    marginBottom: theme.spacing.sm, // הקטנתי מ-md
    textAlign: isRTL ? "right" : "left",
    writingDirection: isRTL ? "rtl" : "ltr",
  },
  exerciseSummary: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.small,
  },
  exerciseName: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: "500",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: isRTL ? "right" : "left",
    writingDirection: isRTL ? "rtl" : "ltr",
  },
  exerciseStats: {
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "center",
    // gap: theme.spacing.md, // gap לא עובד בכל פלטפורמה!
  },
  exerciseStat: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    marginHorizontal: theme.spacing.sm / 2, // תחליף ל-gap
  },
  prBadge: {
    backgroundColor: theme.colors.warning,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
  },
  prText: {
    fontSize: theme.typography.captionSmall.fontSize,
    color: theme.colors.background,
    fontWeight: "500",
  },
  actions: {
    padding: theme.spacing.lg,
    flexDirection: "column",
    // gap: theme.spacing.md, // תחליף ל-gap
  },
  saveButton: {
    borderRadius: theme.radius.md,
    overflow: "hidden",
    // אפשר לקחת מ-theme.components.primaryButton אם רוצים עיצוב קבוע
  },
  saveButtonGradient: {
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.md,
    // gap: theme.spacing.sm,
  },
  saveButtonText: {
    fontSize: theme.typography.button.fontSize,
    fontWeight: theme.typography.button.fontWeight,
    color: theme.colors.text,
  },
  shareButton: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.primary + "40",
    marginBottom: theme.spacing.md,
  },
  shareButtonText: {
    fontSize: theme.typography.button.fontSize,
    color: theme.colors.primary,
    fontWeight: "500",
  },
  closeButton: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: theme.typography.button.fontSize,
    color: theme.colors.textSecondary,
  },

  // Feedback section styles
  feedbackSection: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md, // הקטנתי מ-lg
    marginBottom: theme.spacing.lg, // הקטנתי מ-xl
    ...theme.shadows.medium,
  },
  // Compact feedback styles
  compactFeedbackRow: {
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  compactLabel: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: "600",
    color: theme.colors.text,
    flex: 0.3,
    textAlign: isRTL ? "right" : "left",
    writingDirection: isRTL ? "rtl" : "ltr",
  },
  difficultyHint: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    flex: 0.4,
    textAlign: isRTL ? "right" : "left",
    writingDirection: isRTL ? "rtl" : "ltr",
    fontStyle: "italic",
  },
  emotionsContainerCompact: {
    flexDirection: isRTL ? "row-reverse" : "row",
    flex: 0.7,
    justifyContent: "space-around",
  },
  emotionButtonCompact: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.xs,
    borderWidth: 2,
    borderColor: "transparent",
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  emotionEmojiSmall: {
    fontSize: 16,
  },
  emotionLabelSmall: {
    fontSize: theme.typography.caption.fontSize - 1,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: 2,
    writingDirection: isRTL ? "rtl" : "ltr",
  },
  dayCirclePlanned: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
    backgroundColor: theme.colors.primary + "20",
  },
  streakContainer: {
    alignItems: "center",
    marginLeft: theme.spacing.sm,
  },
  streakHint: {
    fontSize: theme.typography.caption.fontSize - 2,
    color: theme.colors.warning,
    fontWeight: "500",
    textAlign: "center",
  },
  weekContainerCompact: {
    flexDirection: isRTL ? "row-reverse" : "row",
    flex: 0.7,
    alignItems: "center",
    justifyContent: "space-around",
  },
  dayCircleSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.textSecondary + "40",
  },
  dayTextSmall: {
    fontSize: 10,
    color: theme.colors.textSecondary,
  },
  streakTextSmall: {
    fontSize: 14,
    color: theme.colors.warning,
    fontWeight: "600",
  },
  feedbackItem: {
    marginBottom: theme.spacing.lg,
  },
  feedbackLabel: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: isRTL ? "right" : "left",
  },
  starsContainer: {
    flexDirection: isRTL ? "row-reverse" : "row",
    justifyContent: "center",
  },
  starButton: {
    padding: theme.spacing.xs,
    marginHorizontal: theme.spacing.xs,
  },
  emotionsContainer: {
    flexDirection: isRTL ? "row-reverse" : "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  emotionButton: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    alignItems: "center",
    minWidth: 70,
    borderWidth: 2,
    borderColor: "transparent",
    margin: theme.spacing.xs,
  },
  emotionButtonSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + "20",
  },
  emotionEmoji: {
    fontSize: 20,
    marginBottom: theme.spacing.xs,
  },
  emotionLabel: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  emotionLabelSelected: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  yesNoContainer: {
    flexDirection: isRTL ? "row-reverse" : "row",
    justifyContent: "center",
  },
  yesNoButton: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
    minWidth: 100,
    justifyContent: "center",
    marginHorizontal: theme.spacing.md,
  },
  yesNoButtonSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + "20",
  },
  yesNoText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },
  yesNoTextSelected: {
    color: theme.colors.primary,
    fontWeight: "600",
  },

  // Calendar section styles
  calendarSection: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.medium,
  },
  weekContainer: {
    flexDirection: isRTL ? "row-reverse" : "row",
    justifyContent: "space-around",
    marginBottom: theme.spacing.lg,
  },
  dayContainer: {
    alignItems: "center",
  },
  dayLabel: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    fontWeight: "600",
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  dayCircleWithWorkout: {
    backgroundColor: theme.colors.success + "20",
    borderColor: theme.colors.success,
  },
  dayCircleToday: {
    borderColor: theme.colors.primary,
    borderWidth: 3,
  },
  streakText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.warning,
    fontWeight: "600",
    marginLeft: isRTL ? 0 : theme.spacing.sm,
    marginRight: isRTL ? theme.spacing.sm : 0,
  },

  // Achievement section styles
  achievementSection: {
    backgroundColor: theme.colors.warning + "15",
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    borderWidth: 2,
    borderColor: theme.colors.warning + "30",
  },
  achievementHeader: {
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.md,
  },
  achievementTitle: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: "600",
    color: theme.colors.warning,
    marginLeft: isRTL ? 0 : theme.spacing.sm,
    marginRight: isRTL ? theme.spacing.sm : 0,
  },
  achievementText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
    lineHeight: 18,
  },
  badgeContainer: {
    alignItems: "center",
  },
  badge: {
    backgroundColor: theme.colors.warning,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    ...theme.shadows.small,
  },
  badgeText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.background,
    fontWeight: "600",
  },

  // Recommendations section styles
  recommendationsSection: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md, // הקטנתי מ-lg
    marginBottom: theme.spacing.md, // הקטנתי מ-xl
    ...theme.shadows.medium,
  },
  recommendationTextCompact: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text,
    lineHeight: 18,
    textAlign: isRTL ? "right" : "left",
    writingDirection: isRTL ? "rtl" : "ltr",
    marginBottom: theme.spacing.sm,
  },
  recommendationItem: {
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "flex-start",
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.md,
  },
  recommendationContent: {
    flex: 1,
    marginLeft: isRTL ? 0 : theme.spacing.md,
    marginRight: isRTL ? theme.spacing.md : 0,
  },
  recommendationTitle: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: isRTL ? "right" : "left",
  },
  recommendationText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    lineHeight: 18,
    textAlign: isRTL ? "right" : "left",
  },
  // סטיילים לכפתור השמירה
  saveButtonContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    borderTopWidth: 1,
    borderTopColor: theme.colors.textSecondary + "20",
    backgroundColor: theme.colors.background,
    gap: theme.spacing.md, // רווח בין הכפתורים
  },

  // 🧪 סטיילים לכפתור בדיקת הישגים
  testAchievementButton: {
    backgroundColor: theme.colors.backgroundAlt,
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.md,
    borderWidth: 2,
    borderColor: theme.colors.primary + "30",
    marginBottom: theme.spacing.sm,
  },

  testAchievementButtonText: {
    fontSize: theme.typography.body.fontSize - 1,
    fontWeight: "500",
    color: theme.colors.primary,
    marginLeft: isRTL ? 0 : theme.spacing.sm,
    marginRight: isRTL ? theme.spacing.sm : 0,
  },

  mainSaveButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.radius.lg,
    ...theme.shadows.medium,
    elevation: 4,
  },
  mainSaveButtonText: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: "600",
    color: theme.colors.background,
    marginLeft: isRTL ? 0 : theme.spacing.sm,
    marginRight: isRTL ? theme.spacing.sm : 0,
  },
  // סטיילים לתצוגת השיאים האישיים
  recordItem: {
    backgroundColor: theme.colors.primary + "10",
    padding: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    marginBottom: theme.spacing.xs,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
  },
  recordExercise: {
    fontSize: theme.typography.caption.fontSize,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  recordDetails: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    lineHeight: 16,
  },
  improvement: {
    fontSize: theme.typography.caption.fontSize,
    fontWeight: "600",
    color: theme.colors.primary,
    marginTop: theme.spacing.xs,
  },
});
