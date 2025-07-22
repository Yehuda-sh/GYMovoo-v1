/**
 * @file src/screens/workout/components/ExerciseCard/index.tsx
 * @description כרטיס תרגיל מלא עם סטים, התקדמות ופעולות (במבנה משופר)
 * English: Complete exercise card with sets, progress and actions (improved structure)
 */
// cspell:ignore flatlist, קומפוננטות, קומפוננטה, dropset, restpause, דרופ, סופרסט, לקומפוננטות

// DEBUG FLAG - הסר בסוף הפרויקט
const DEBUG = true;
const log = (message: string, data?: any) => {
  if (DEBUG) {
    console.log(`🎯 [ExerciseCard] ${message}`, data || "");
  }
};

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  GestureResponderEvent,
  TextInput,
  Modal,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from "react-native-draggable-flatlist";

import { theme } from "../../../../styles/theme";
import { Exercise, Set, SetType } from "../../types/workout.types";
import SetRow from "./SetRow";
import ExerciseMenu from "./ExerciseMenu";

// --- הוספת טיפוסים חדשים ---
// הסרנו את ההגדרה המקומית של SetType ומשתמשים במה שמיובא מ-workout.types.ts

interface EnhancedSet extends Set {
  dropFromWeight?: number;
}

interface EnhancedExercise extends Exercise {
  sets: EnhancedSet[];
  notes?: string;
  techniqueNotes?: string;
}

interface PerformanceMetrics {
  volumeChange: number;
  intensityChange: number;
  expectedRPE: number;
  actualRPE?: number;
}

// --- הגדרות Props לקומפוננטות משנה ---
interface HeaderProps {
  exercise: EnhancedExercise;
  exerciseNumber: number;
  completedSets: number;
  totalSets: number;
  onToggleExpand: () => void;
  onShowMenu: (event: GestureResponderEvent) => void;
  onShowTips: () => void;
  rotateAnim: Animated.Value;
  hasPR: boolean;
  isSuperset?: boolean;
  supersetPartner?: Exercise;
  restTimeLeft?: number;
  isResting?: boolean;
}

interface ProgressBarProps {
  progressAnim: Animated.AnimatedInterpolation<string | number>;
  currentVolume: number;
  performanceMetrics?: PerformanceMetrics;
}

interface ContentProps {
  exercise: EnhancedExercise;
  onUpdateSet: (setId: string, updates: Partial<EnhancedSet>) => void;
  onDeleteSet: (setId: string) => void;
  onStartRest: (duration?: number) => void;
  onReorderSets: (reorderedSets: EnhancedSet[]) => void;
  onAddSet: () => void;
  onShowPlateCalculator: (weight: number) => void;
  onUpdateNotes?: (notes: string) => void;
  onUpdateTechniqueNotes?: (notes: string) => void;
}

// --- קומפוננטות חדשות ---

// קומפוננטת הערות
const ExerciseNotes: React.FC<{
  notes?: string;
  techniqueNotes?: string;
  onUpdateNotes: (notes: string) => void;
  onUpdateTechniqueNotes: (notes: string) => void;
}> = ({ notes, techniqueNotes, onUpdateNotes, onUpdateTechniqueNotes }) => {
  const [showModal, setShowModal] = useState(false);
  const [tempNotes, setTempNotes] = useState(notes || "");
  const [tempTechniqueNotes, setTempTechniqueNotes] = useState(
    techniqueNotes || ""
  );

  const handleSave = () => {
    log("💾 Notes modal - Save clicked", {
      notesLength: tempNotes.length,
      techniqueNotesLength: tempTechniqueNotes.length,
    });
    onUpdateNotes(tempNotes);
    onUpdateTechniqueNotes(tempTechniqueNotes);
    setShowModal(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.notesButton}
        onPress={() => {
          log("📝 Notes button clicked", {
            hasNotes: !!(notes || techniqueNotes),
          });
          setShowModal(true);
        }}
      >
        <Ionicons
          name="document-text-outline"
          size={20}
          color={
            notes || techniqueNotes
              ? theme.colors.primary
              : theme.colors.textSecondary
          }
        />
        <Text style={styles.notesButtonText}>
          {notes || techniqueNotes ? "הערות" : "הוסף הערות"}
        </Text>
      </TouchableOpacity>

      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.notesModal}>
            <Text style={styles.modalTitle}>הערות לתרגיל</Text>

            <Text style={styles.inputLabel}>הערות כלליות</Text>
            <TextInput
              style={styles.notesInput}
              value={tempNotes}
              onChangeText={setTempNotes}
              placeholder="הוסף הערות כלליות..."
              multiline
              textAlign="right"
            />

            <Text style={styles.inputLabel}>הערות טכניקה</Text>
            <TextInput
              style={styles.notesInput}
              value={tempTechniqueNotes}
              onChangeText={setTempTechniqueNotes}
              placeholder="הוסף הערות על טכניקה..."
              multiline
              textAlign="right"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  log("❌ Notes modal - Cancel clicked");
                  setShowModal(false);
                }}
              >
                <Text style={styles.modalButtonText}>ביטול</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleSave}
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    styles.modalButtonTextPrimary,
                  ]}
                >
                  שמור
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

// אינדיקטור סוג סט
const SetTypeIndicator: React.FC<{ type?: SetType }> = ({
  type = "normal",
}) => {
  if (type === "normal") return null;

  const config: Record<
    Exclude<SetType, "normal">,
    { icon: any; color: string; label: string }
  > = {
    warmup: {
      icon: "flame-outline",
      color: theme.colors.warning,
      label: "חימום",
    },
    working: {
      icon: "barbell-outline",
      color: theme.colors.primary,
      label: "עבודה",
    },
    dropset: {
      icon: "trending-down",
      color: theme.colors.error,
      label: "דרופ סט",
    },
    restpause: {
      icon: "pause-circle",
      color: theme.colors.info,
      label: "מנוחה-פאוזה",
    },
    "rest-pause": {
      icon: "pause-circle",
      color: theme.colors.info,
      label: "מנוחה-פאוזה",
    },
    failure: {
      icon: "alert-circle",
      color: theme.colors.error,
      label: "כישלון",
    },
  };

  const { icon, color, label } = config[type];

  return (
    <View style={[styles.setTypeIndicator, { backgroundColor: color + "20" }]}>
      <Ionicons name={icon} size={14} color={color} />
      <Text style={[styles.setTypeText, { color }]}>{label}</Text>
    </View>
  );
};

// מיני טיימר
const MiniTimer: React.FC<{
  timeLeft: number;
  onExtend: () => void;
}> = ({ timeLeft, onExtend }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (timeLeft <= 0) return null;

  return (
    <View style={styles.miniTimer}>
      <Ionicons name="timer-outline" size={16} color={theme.colors.primary} />
      <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
      <TouchableOpacity
        onPress={() => {
          log("⏰ Timer extend clicked", { currentTime: timeLeft });
          onExtend();
        }}
      >
        <Ionicons
          name="add-circle-outline"
          size={18}
          color={theme.colors.primary}
        />
      </TouchableOpacity>
    </View>
  );
};

// אינדיקטור ביצועים
const PerformanceIndicator: React.FC<{ metrics: PerformanceMetrics }> = ({
  metrics,
}) => (
  <View style={styles.performanceContainer}>
    <View style={styles.metricItem}>
      <Text style={styles.metricLabel}>נפח</Text>
      <Text
        style={[
          styles.metricValue,
          metrics.volumeChange > 0
            ? styles.positive
            : metrics.volumeChange < 0
            ? styles.negative
            : null,
        ]}
      >
        {metrics.volumeChange > 0 ? "+" : ""}
        {metrics.volumeChange}%
      </Text>
    </View>
    <View style={styles.metricItem}>
      <Text style={styles.metricLabel}>עצימות</Text>
      <Text
        style={[
          styles.metricValue,
          metrics.intensityChange > 0
            ? styles.positive
            : metrics.intensityChange < 0
            ? styles.negative
            : null,
        ]}
      >
        {metrics.intensityChange > 0 ? "+" : ""}
        {metrics.intensityChange}%
      </Text>
    </View>
    {metrics.actualRPE && (
      <View style={styles.metricItem}>
        <Text style={styles.metricLabel}>RPE</Text>
        <Text style={styles.metricValue}>{metrics.actualRPE}/10</Text>
      </View>
    )}
  </View>
);

// --- קומפוננטות משנה מעודכנות ---

const ExerciseCardHeader = React.memo<HeaderProps>(
  ({
    exercise,
    exerciseNumber,
    completedSets,
    totalSets,
    onToggleExpand,
    onShowMenu,
    onShowTips,
    rotateAnim,
    hasPR,
    isSuperset,
    supersetPartner,
    restTimeLeft = 0,
    isResting = false,
  }) => (
    <TouchableOpacity
      style={[styles.header, hasPR && styles.prHeader]}
      onPress={() => {
        log("🔽 Exercise header clicked - toggle expand", {
          exerciseName: exercise.name,
          exerciseNumber,
          // הערה: isExpanded לא זמין כאן, נעביר לפונקציה החיצונית
        });
        onToggleExpand();
      }}
      activeOpacity={0.8}
    >
      <View style={styles.headerLeft}>
        <View
          style={[
            styles.exerciseNumber,
            hasPR && { backgroundColor: theme.colors.warning },
          ]}
        >
          <Text style={styles.exerciseNumberText}>{exerciseNumber}</Text>
        </View>
        <View style={styles.exerciseDetails}>
          <View style={styles.titleContainer}>
            <Text style={styles.exerciseName} numberOfLines={1}>
              {exercise.name}
            </Text>
            {isSuperset && (
              <View style={styles.supersetBadge}>
                <MaterialCommunityIcons
                  name="link-variant"
                  size={16}
                  color={theme.colors.primary}
                />
              </View>
            )}
            <TouchableOpacity
              onPress={() => {
                log("🔍 Exercise tips button clicked", {
                  exerciseName: exercise.name,
                });
                onShowTips();
              }}
              style={styles.infoButton}
            >
              <Ionicons
                name="information-circle-outline"
                size={22}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
          {exercise.primaryMuscles && (
            <Text style={styles.muscleText} numberOfLines={1}>
              {exercise.primaryMuscles.join(", ")}
            </Text>
          )}
          {isSuperset && supersetPartner && (
            <Text style={styles.supersetText}>
              סופרסט עם: {supersetPartner.name}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.headerRight}>
        {isResting && restTimeLeft > 0 && (
          <MiniTimer
            timeLeft={restTimeLeft}
            onExtend={() => {
              log("⏰ Timer extend clicked", { currentTime: restTimeLeft });
            }}
          />
        )}
        <View style={styles.statsContainer}>
          <Text style={styles.statText}>
            {completedSets}/{totalSets}
          </Text>
          <Text style={styles.statLabel}>סטים</Text>
        </View>
        <TouchableOpacity
          onPress={(e) => {
            log("⋮ Menu button clicked", { exerciseName: exercise.name });
            onShowMenu(e);
          }}
          style={styles.menuButton}
        >
          <Ionicons
            name="ellipsis-vertical"
            size={20}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
        <Animated.View
          style={{
            transform: [
              {
                rotate: rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "180deg"],
                }),
              },
            ],
          }}
        >
          <Ionicons
            name="chevron-down"
            size={24}
            color={theme.colors.textSecondary}
          />
        </Animated.View>
      </View>
    </TouchableOpacity>
  )
);

const ExerciseProgressBar = React.memo<ProgressBarProps>(
  ({ progressAnim, currentVolume, performanceMetrics }) => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <Animated.View style={[styles.progressFill, { width: progressAnim }]} />
      </View>
      <View style={styles.progressInfo}>
        {currentVolume > 0 && (
          <Text style={styles.volumeText}>
            {currentVolume.toLocaleString()} ק"ג נפח
          </Text>
        )}
        {performanceMetrics && (
          <PerformanceIndicator metrics={performanceMetrics} />
        )}
      </View>
    </View>
  )
);

const ExerciseCardContent = React.memo<ContentProps>(
  ({
    exercise,
    onUpdateSet,
    onDeleteSet,
    onStartRest,
    onReorderSets,
    onAddSet,
    onShowPlateCalculator,
    onUpdateNotes = () => {},
    onUpdateTechniqueNotes = () => {},
  }) => (
    <View style={styles.content}>
      {(exercise.notes || exercise.techniqueNotes || true) && (
        <ExerciseNotes
          notes={exercise.notes}
          techniqueNotes={exercise.techniqueNotes}
          onUpdateNotes={onUpdateNotes}
          onUpdateTechniqueNotes={onUpdateTechniqueNotes}
        />
      )}

      <View style={styles.columnHeaders}>
        <Text style={styles.columnHeader}>סט</Text>
        <Text style={styles.columnHeader}>קודם</Text>
        <Text style={styles.columnHeader}>משקל</Text>
        <Text style={styles.columnHeader}>חזרות</Text>
        <View style={styles.columnHeaderEmpty} />
      </View>

      <DraggableFlatList
        data={exercise.sets}
        keyExtractor={(item) => item.id}
        onDragEnd={({ data }) => onReorderSets(data)}
        renderItem={({
          item,
          drag,
          isActive,
          getIndex,
        }: RenderItemParams<EnhancedSet>) => (
          <ScaleDecorator>
            <View>
              <SetRow
                set={item}
                setNumber={(getIndex?.() ?? 0) + 1}
                onUpdate={(updates) => onUpdateSet(item.id, updates)}
                onDelete={() => onDeleteSet(item.id)}
                onComplete={() => {
                  const newCompletedState = !item.completed;
                  onUpdateSet(item.id, { completed: newCompletedState });
                  if (newCompletedState) {
                    onStartRest(exercise.restTimeBetweenSets);
                  }
                }}
                onLongPress={drag}
                isActive={isActive}
                exercise={exercise}
              />
            </View>
          </ScaleDecorator>
        )}
      />

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          onPress={() => {
            log("➕ Add set button clicked", {
              exerciseName: exercise.name,
              currentSetsCount: exercise.sets.length,
            });
            onAddSet();
          }}
          style={styles.actionButton}
        >
          <Ionicons
            name="add-circle-outline"
            size={22}
            color={theme.colors.primary}
          />
          <Text style={styles.actionButtonText}>הוסף סט</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            const lastSet = exercise.sets[exercise.sets.length - 1];
            const weight = lastSet?.weight || lastSet?.targetWeight || 60;
            log("🧮 Calculator button clicked", {
              exerciseName: exercise.name,
              weight,
            });
            onShowPlateCalculator(weight);
          }}
          style={styles.actionButton}
        >
          <MaterialCommunityIcons
            name="calculator-variant-outline"
            size={22}
            color={theme.colors.primary}
          />
          <Text style={styles.actionButtonText}>מחשבון</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
);

// --- קומפוננטה ראשית ---
interface ExerciseCardProps {
  exercise: EnhancedExercise;
  exerciseNumber: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdateSet: (setId: string, updates: Partial<EnhancedSet>) => void;
  onAddSet: () => void;
  onDeleteSet: (setId: string) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onReorderSets: (reorderedSets: EnhancedSet[]) => void;
  onStartRest: (duration?: number) => void;
  onShowPlateCalculator: (weight: number) => void;
  onShowTips: () => void;
  onUpdateNotes?: (exerciseId: string, notes: string) => void;
  onUpdateTechniqueNotes?: (exerciseId: string, notes: string) => void;
  // Props חדשים
  isSuperset?: boolean;
  supersetPartner?: Exercise;
  onLinkSuperset?: () => void;
  performanceMetrics?: PerformanceMetrics;
  restTimeLeft?: number;
  isResting?: boolean;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  exerciseNumber,
  isExpanded,
  onToggleExpand,
  onUpdateSet,
  onAddSet,
  onDeleteSet,
  onDelete,
  onDuplicate,
  onReorderSets,
  onStartRest,
  onShowPlateCalculator,
  onShowTips,
  onUpdateNotes,
  onUpdateTechniqueNotes,
  isSuperset = false,
  supersetPartner,
  onLinkSuperset,
  performanceMetrics,
  restTimeLeft = 0,
  isResting = false,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const expandAnim = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;
  const rotateAnim = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;
  const deleteAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const { completedSets, totalSets, currentVolume, hasPR, progressPercentage } =
    useMemo(() => {
      const completed = exercise.sets.filter((set) => set.completed).length;
      const total = exercise.sets.length;
      const volume = exercise.sets.reduce((acc, set) => {
        if (set.completed && set.weight && set.reps)
          return acc + set.weight * set.reps;
        return acc;
      }, 0);
      const pr = exercise.sets.some((set) => set.isPR);
      const progress = total > 0 ? (completed / total) * 100 : 0;
      return {
        completedSets: completed,
        totalSets: total,
        currentVolume: volume,
        hasPR: pr,
        progressPercentage: progress,
      };
    }, [exercise.sets]);

  const progressAnim = useRef(new Animated.Value(progressPercentage)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progressPercentage,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progressPercentage]);

  useEffect(() => {
    const toValue = isExpanded ? 1 : 0;
    Animated.parallel([
      Animated.timing(expandAnim, {
        toValue,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(rotateAnim, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isExpanded]);

  const animatedContentStyle = {
    maxHeight: expandAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1500],
    }),
    opacity: expandAnim,
  };

  // אנימציית מחיקה
  const animateDelete = (callback: () => void) => {
    log("🗑️ Delete animation started", { exerciseName: exercise.name });
    Animated.parallel([
      Animated.timing(deleteAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      log("✅ Delete animation completed", { exerciseName: exercise.name });
      callback();
    });
  };

  const handleDelete = () => {
    log("🗑️ Delete confirmed", {
      exerciseName: exercise.name,
      exerciseId: exercise.id,
    });
    animateDelete(() => {
      onDelete();
    });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        hasPR && styles.prContainer,
        isSuperset && styles.supersetContainer,
        {
          opacity: deleteAnim,
          transform: [{ translateX: slideAnim }],
        },
      ]}
    >
      {hasPR && (
        <View style={styles.prBadge}>
          <MaterialCommunityIcons
            name="trophy-award"
            size={14}
            color={theme.colors.white || "#FFFFFF"}
          />
          <Text style={styles.prBadgeText}>שיא אישי!</Text>
        </View>
      )}

      {isSuperset && (
        <View style={styles.supersetIndicator}>
          <MaterialCommunityIcons
            name="link-variant"
            size={20}
            color={theme.colors.primary}
          />
        </View>
      )}

      <ExerciseCardHeader
        exercise={exercise}
        exerciseNumber={exerciseNumber}
        completedSets={completedSets}
        totalSets={totalSets}
        onToggleExpand={onToggleExpand}
        onShowMenu={(e: GestureResponderEvent) => {
          e.stopPropagation();
          setShowMenu(true);
        }}
        onShowTips={onShowTips}
        rotateAnim={rotateAnim}
        hasPR={hasPR}
        isSuperset={isSuperset}
        supersetPartner={supersetPartner}
        restTimeLeft={restTimeLeft}
        isResting={isResting}
      />

      <ExerciseProgressBar
        progressAnim={progressAnim.interpolate({
          inputRange: [0, 100],
          outputRange: ["0%", "100%"],
        })}
        currentVolume={currentVolume}
        performanceMetrics={performanceMetrics}
      />

      {isExpanded && (
        <Animated.View style={[styles.contentWrapper, animatedContentStyle]}>
          <ExerciseCardContent
            exercise={exercise}
            onUpdateSet={onUpdateSet}
            onDeleteSet={onDeleteSet}
            onStartRest={onStartRest}
            onReorderSets={onReorderSets}
            onAddSet={onAddSet}
            onShowPlateCalculator={onShowPlateCalculator}
            onUpdateNotes={(notes) => onUpdateNotes?.(exercise.id, notes)}
            onUpdateTechniqueNotes={(notes) =>
              onUpdateTechniqueNotes?.(exercise.id, notes)
            }
          />
        </Animated.View>
      )}

      <ExerciseMenu
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        onDelete={handleDelete}
        onDuplicate={onDuplicate}
        onReplace={onLinkSuperset}
        onMoveUp={() => console.log("Move Up")}
        onMoveDown={() => console.log("Move Down")}
        canMoveUp={exerciseNumber > 1}
        canMoveDown={true}
      />
    </Animated.View>
  );
};

// --- סגנונות ---
const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    ...theme.shadows.small,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  prContainer: {
    borderColor: theme.colors.warning,
    borderWidth: 1.5,
  },
  supersetContainer: {
    borderColor: theme.colors.primary,
    borderWidth: 1.5,
  },
  prBadge: {
    position: "absolute",
    top: 0,
    right: 16,
    backgroundColor: theme.colors.warning,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
    zIndex: 10,
  },
  prBadgeText: {
    color: theme.colors.white || "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  supersetIndicator: {
    position: "absolute",
    top: 8,
    left: 16,
    zIndex: 10,
  },
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  prHeader: {
    paddingTop: 28,
  },
  headerLeft: {
    flexDirection: "row-reverse",
    alignItems: "center",
    flex: 1,
    marginLeft: 8,
  },
  exerciseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  exerciseNumberText: {
    color: theme.colors.white || "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  exerciseDetails: {
    flex: 1,
    alignItems: "flex-end",
  },
  titleContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
  },
  supersetBadge: {
    backgroundColor: theme.colors.primary + "20",
    padding: 4,
    borderRadius: 8,
  },
  infoButton: {
    padding: 2,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "right",
  },
  muscleText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
    textAlign: "right",
  },
  supersetText: {
    fontSize: 12,
    color: theme.colors.primary,
    marginTop: 2,
    textAlign: "right",
    fontStyle: "italic",
  },
  headerRight: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
  },
  statsContainer: {
    alignItems: "center",
  },
  statText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  menuButton: {
    padding: 4,
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: theme.colors.divider,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
  },
  progressInfo: {
    marginTop: 4,
  },
  volumeText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  contentWrapper: {
    overflow: "hidden",
  },
  content: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
  },
  columnHeaders: {
    flexDirection: "row-reverse",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: `${theme.colors.primary}10`,
  },
  columnHeader: {
    flex: 1,
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: "center",
    fontWeight: "500",
  },
  columnHeaderEmpty: {
    width: 80,
  },
  actionsContainer: {
    flexDirection: "row-reverse",
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 6,
  },
  actionButtonText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  // סגנונות חדשים
  miniTimer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: theme.colors.primary + "20",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  timerText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  notesButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  notesButtonText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  notesModal: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 20,
    width: "90%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 8,
    textAlign: "right",
  },
  notesInput: {
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: theme.colors.text,
    minHeight: 80,
    marginBottom: 16,
    textAlignVertical: "top",
  },
  modalActions: {
    flexDirection: "row-reverse",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  modalButtonPrimary: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  modalButtonTextPrimary: {
    color: theme.colors.white || "#FFFFFF",
  },
  setTypeIndicator: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 4,
    gap: 4,
    alignSelf: "flex-start",
  },
  setTypeText: {
    fontSize: 12,
    fontWeight: "500",
  },
  performanceContainer: {
    flexDirection: "row-reverse",
    justifyContent: "center",
    gap: 20,
    marginTop: 4,
  },
  metricItem: {
    alignItems: "center",
  },
  metricLabel: {
    fontSize: 10,
    color: theme.colors.textSecondary,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  positive: {
    color: theme.colors.success || "#34C759",
  },
  negative: {
    color: theme.colors.error || "#FF3B30",
  },
});
