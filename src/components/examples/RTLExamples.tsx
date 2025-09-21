/**
 * @file src/components/examples/RTLExamples.tsx
 * @description דוגמאות מעשיות לשימוש במדריך העברית והאימוג'ים
 */

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import {
  isRTL,
  getFlexDirection,
  getTextAlign,
  getRTLIconName,
  getButtonStyles,
  getTitleStyles,
  wrapTextWithEmoji,
  formatTitleWithEmoji,
  createActionText,
  getActionEmoji,
  formatHebrewNumber,
} from "../../utils/rtlHelpers";

// Types
interface TitleProps {
  title: string;
  emoji: string;
  level?: "h1" | "h2" | "h3";
}

interface ButtonProps {
  title: string;
  action: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  useEmoji?: boolean;
}

interface Workout {
  name: string;
  emoji?: string;
  duration: number;
  exercises: number;
  calories: number;
}

interface Exercise {
  name: string;
  emoji?: string;
  sets: number;
  reps: number;
}

// דוגמת רכיב כותרת עם אימוג'י
export const ExampleTitle = ({ title, emoji, level = "h1" }: TitleProps) => {
  const titleStyles = getTitleStyles(level);
  const titleText = formatTitleWithEmoji(title, emoji);

  return <Text style={[styles.title, titleStyles]}>{titleText}</Text>;
};

// דוגמת כפתור עם אימוג'י/אייקון
export const ExampleButton = ({
  title,
  action,
  onPress,
  variant = "primary",
  useEmoji = true,
}: ButtonProps) => {
  const buttonStyles = getButtonStyles();
  const displayText = useEmoji ? createActionText(title, action) : title;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        buttonStyles.container as ViewStyle,
        variant === "primary" ? styles.primaryButton : styles.secondaryButton,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.buttonText,
          buttonStyles.text as TextStyle,
          variant === "primary"
            ? styles.primaryButtonText
            : styles.secondaryButtonText,
        ]}
      >
        {displayText}
      </Text>
    </TouchableOpacity>
  );
};

// דוגמת כרטיס אימון
export const ExampleWorkoutCard = ({ workout }: { workout: Workout }) => {
  const cardStyles = getCardStyles();

  return (
    <View style={[styles.workoutCard, cardStyles.container]}>
      <View style={[styles.cardHeader, cardStyles.header as ViewStyle]}>
        <ExampleTitle
          title={workout.name}
          emoji={workout.emoji || getActionEmoji("workout")}
          level="h3"
        />
        <Text style={[styles.duration, cardStyles.title as TextStyle]}>
          {formatHebrewNumber(workout.duration)} דקות ⏱️
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {formatHebrewNumber(workout.exercises)} תרגילים 🏋️
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {formatHebrewNumber(workout.calories)} קלוריות 🔥
          </Text>
        </View>
      </View>

      <ExampleButton
        title="התחל אימון"
        action="start"
        onPress={() => console.log("Starting workout")}
        variant="primary"
      />
    </View>
  );
};

// דוגמת רשימת תרגילים
export const ExampleExerciseList = ({
  exercises,
}: {
  exercises: Exercise[];
}) => {
  const listStyles = getListStyles();

  return (
    <View style={styles.exerciseList}>
      <ExampleTitle
        title="תרגילים"
        emoji={getActionEmoji("exercise")}
        level="h2"
      />

      {exercises.map((exercise: Exercise, index: number) => (
        <TouchableOpacity
          key={index}
          style={[styles.exerciseItem, listStyles.item as ViewStyle]}
        >
          <View style={styles.exerciseInfo}>
            <Text style={[styles.exerciseName, listStyles.text as TextStyle]}>
              {wrapTextWithEmoji(exercise.name, exercise.emoji || "🏋️")}
            </Text>
            <Text
              style={[styles.exerciseDetails, listStyles.text as TextStyle]}
            >
              {formatHebrewNumber(exercise.sets)} סטים •{" "}
              {formatHebrewNumber(exercise.reps)} חזרות
            </Text>
          </View>
          <Text style={styles.chevron}>
            {getRTLIconName("chevron-right") === "chevron-right" ? "›" : "‹"}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// דוגמת מסך מלא
export const ExampleScreen = () => {
  const workouts = [
    {
      name: "אימון חזה וגב",
      emoji: "💪",
      duration: 45,
      exercises: 8,
      calories: 320,
    },
    {
      name: "אימון רגליים",
      emoji: "🦵",
      duration: 50,
      exercises: 10,
      calories: 380,
    },
  ];

  const exercises = [
    { name: "סקוואט", emoji: "🏋️", sets: 3, reps: 12 },
    { name: "דפיקות חזה", emoji: "💪", sets: 3, reps: 10 },
    { name: "משיכות", emoji: "🔙", sets: 3, reps: 8 },
  ];

  return (
    <View style={styles.screen}>
      {/* כותרת ראשית */}
      <ExampleTitle
        title="האימונים שלי"
        emoji={getActionEmoji("workout")}
        level="h1"
      />

      {/* כותרת משנה */}
      <ExampleTitle title="השבוע הזה" emoji="" level="h2" />

      {/* רשימת אימונים */}
      {workouts.map((workout, index) => (
        <ExampleWorkoutCard key={index} workout={workout} />
      ))}

      {/* כפתור הוספה */}
      <ExampleButton
        title="הוסף אימון חדש"
        action="add"
        onPress={() => console.log("Add new workout")}
        variant="secondary"
      />

      {/* רשימת תרגילים */}
      <ExampleExerciseList exercises={exercises} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },

  // כותרות
  title: {
    color: "#333",
    fontFamily: "System",
  },

  // כפתורים
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 8,
  },
  primaryButton: {
    backgroundColor: "#007AFF",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  primaryButtonText: {
    color: "#fff",
  },
  secondaryButtonText: {
    color: "#007AFF",
  },

  // כרטיס אימון
  workoutCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 12,
  },
  duration: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: getFlexDirection(),
    justifyContent: "space-around",
    marginBottom: 16,
    paddingVertical: 8,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 14,
    color: "#333",
    textAlign: getTextAlign(),
  },

  // רשימת תרגילים
  exerciseList: {
    marginTop: 24,
  },
  exerciseItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginVertical: 4,
    flexDirection: getFlexDirection(),
    alignItems: "center",
    justifyContent: "space-between",
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  exerciseDetails: {
    fontSize: 14,
    color: "#666",
  },
  chevron: {
    fontSize: 18,
    color: "#999",
    marginStart: isRTL() ? 0 : 8,
    marginEnd: isRTL() ? 8 : 0,
  },
});

// פונקציות עזר נוספות שנדרשות
const getCardStyles = () => {
  const rtl = isRTL();
  return {
    container: {},
    header: {
      alignItems: rtl ? "flex-end" : "flex-start",
    },
    title: {
      textAlign: rtl ? "right" : "left",
    },
  };
};

const getListStyles = () => {
  const rtl = isRTL();
  return {
    item: {
      flexDirection: rtl ? "row-reverse" : "row",
    },
    text: {
      textAlign: rtl ? "right" : "left",
    },
  };
};

export default ExampleScreen;
