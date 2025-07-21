/**
 * @file src/screens/workout/components/ExerciseCard/index.tsx
 * @description כרטיס תרגיל מלא עם סטים, התקדמות ופעולות (במבנה משופר)
 */
// cspell:ignore flatlist, קומפוננטות, קומפוננטה

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  GestureResponderEvent,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from "react-native-draggable-flatlist";

import { theme } from "../../../../styles/theme";
import { Exercise, Set } from "../../types/workout.types";
import SetRow from "./SetRow";
import ExerciseMenu from "./ExerciseMenu";

// --- הגדרות Props לקומפוננטות משנה ---
interface HeaderProps {
  exercise: Exercise;
  exerciseNumber: number;
  completedSets: number;
  totalSets: number;
  onToggleExpand: () => void;
  onShowMenu: (event: GestureResponderEvent) => void;
  onShowTips: () => void;
  rotateAnim: Animated.Value;
  hasPR: boolean;
}

interface ProgressBarProps {
  progressAnim: Animated.AnimatedInterpolation<string | number>;
  currentVolume: number;
}

interface ContentProps {
  exercise: Exercise;
  onUpdateSet: (setId: string, updates: Partial<Set>) => void;
  onDeleteSet: (setId: string) => void;
  onStartRest: (duration?: number) => void;
  onReorderSets: (reorderedSets: Set[]) => void;
  onAddSet: () => void;
  onShowPlateCalculator: (weight: number) => void;
}

// --- קומפוננטות משנה שהוצאו החוצה ---

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
  }) => (
    <TouchableOpacity
      style={[styles.header, hasPR && styles.prHeader]}
      onPress={onToggleExpand}
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
            <TouchableOpacity onPress={onShowTips} style={styles.infoButton}>
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
        </View>
      </View>
      <View style={styles.headerRight}>
        <View style={styles.statsContainer}>
          <Text style={styles.statText}>
            {completedSets}/{totalSets}
          </Text>
          <Text style={styles.statLabel}>סטים</Text>
        </View>
        <TouchableOpacity onPress={onShowMenu} style={styles.menuButton}>
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
  ({ progressAnim, currentVolume }) => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <Animated.View style={[styles.progressFill, { width: progressAnim }]} />
      </View>
      {currentVolume > 0 && (
        <Text style={styles.volumeText}>
          {currentVolume.toLocaleString()} ק"ג נפח
        </Text>
      )}
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
  }) => (
    <View style={styles.content}>
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
        }: RenderItemParams<Set>) => (
          <ScaleDecorator>
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
          </ScaleDecorator>
        )}
      />
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={onAddSet} style={styles.actionButton}>
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
  exercise: Exercise;
  exerciseNumber: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdateSet: (setId: string, updates: Partial<Set>) => void;
  onAddSet: () => void;
  onDeleteSet: (setId: string) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onReorderSets: (reorderedSets: Set[]) => void;
  onStartRest: (duration?: number) => void;
  onShowPlateCalculator: (weight: number) => void;
  onShowTips: () => void;
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
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const expandAnim = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;
  const rotateAnim = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;

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
    }), // Increased max height
    opacity: expandAnim,
  };

  return (
    <View style={[styles.container, hasPR && styles.prContainer]}>
      {hasPR && (
        <View style={styles.prBadge}>
          <MaterialCommunityIcons
            name="trophy-award"
            size={14}
            color={theme.colors.white}
          />
          <Text style={styles.prBadgeText}>שיא אישי!</Text>
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
      />
      <ExerciseProgressBar
        progressAnim={progressAnim.interpolate({
          inputRange: [0, 100],
          outputRange: ["0%", "100%"],
        })}
        currentVolume={currentVolume}
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
          />
        </Animated.View>
      )}

      <ExerciseMenu
        visible={showMenu}
        onClose={() => setShowMenu(false)}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        onMoveUp={() => console.log("Move Up")}
        onMoveDown={() => console.log("Move Down")}
        canMoveUp={exerciseNumber > 1}
        canMoveDown={true}
      />
    </View>
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
  prBadge: {
    position: "absolute",
    top: 0,
    right: 16, // RTL
    backgroundColor: theme.colors.warning,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    flexDirection: "row-reverse", // RTL
    alignItems: "center",
    gap: 4,
    zIndex: 10,
  },
  prBadgeText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row-reverse", // RTL
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  prHeader: {
    paddingTop: 28,
  },
  headerLeft: {
    flexDirection: "row-reverse", // RTL
    alignItems: "center",
    flex: 1,
    marginLeft: 8, // RTL
  },
  exerciseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12, // RTL
  },
  exerciseNumberText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  exerciseDetails: {
    flex: 1,
    alignItems: "flex-end", // RTL
  },
  titleContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
  },
  infoButton: {
    padding: 2,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "right", // RTL
  },
  muscleText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
    textAlign: "right", // RTL
  },
  headerRight: {
    flexDirection: "row-reverse", // RTL
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
  volumeText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
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
    flexDirection: "row-reverse", // RTL
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
    width: 80, // רוחב עבור שני כפתורי הפעולה
  },
  actionsContainer: {
    flexDirection: "row-reverse", // RTL
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row-reverse", // RTL
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
});
