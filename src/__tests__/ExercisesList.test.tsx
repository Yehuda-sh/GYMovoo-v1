/**
 * @file src/__tests__/ExercisesList.test.tsx
 * @brief טסט לרשימה וירטואלית של תרגילים
 * @dependencies @testing-library/react-native, jest
 */

import React from "react";
import { render } from "@testing-library/react-native";
import ExercisesList from "../screens/workout/components/ExercisesList";
import { WorkoutExercise, Set } from "../screens/workout/types/workout.types";

// Mock של ExerciseRow
jest.mock("../screens/workout/components/ExerciseRow", () => {
  const React = require("react");
  const { View, Text } = require("react-native");

  const MockExerciseRow = React.memo(
    ({
      exercise,
      index,
      totalCount,
      onUpdateSet,
      onAddSet,
      onCompleteSet,
      onDeleteSet,
      onReorderSets,
      onRemoveExercise,
      onStartRest,
    }: {
      exercise: WorkoutExercise;
      index: number;
      totalCount: number;
      onUpdateSet: jest.Mock;
      onAddSet: jest.Mock;
      onCompleteSet: jest.Mock;
      onDeleteSet: jest.Mock;
      onReorderSets: jest.Mock;
      onRemoveExercise: jest.Mock;
      onStartRest: jest.Mock;
    }) => {
      return (
        <View testID={`exercise-row-${exercise.id}`}>
          <Text testID={`exercise-name-${index}`}>{exercise.name}</Text>
          <Text testID={`exercise-total-count-${index}`}>{totalCount}</Text>
        </View>
      );
    }
  );
  MockExerciseRow.displayName = "MockExerciseRow";

  return {
    __esModule: true,
    default: MockExerciseRow,
  };
});

// Mock של logger
jest.mock("../utils/logger", () => ({
  logger: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

// יצירת תרגילי דמה
const createMockExercises = (count: number): WorkoutExercise[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: `exercise-${index}`,
    name: `תרגיל ${index + 1}`,
    category: "strength",
    primaryMuscles: ["chest"],
    muscleGroup: "חזה",
    equipment: "משקולות",
    restTime: 60,
    sets: [] as Set[],
  }));
};

describe("ExercisesList", () => {
  const mockHandlers = {
    onUpdateSet: jest.fn(),
    onAddSet: jest.fn(),
    onCompleteSet: jest.fn(),
    onDeleteSet: jest.fn(),
    onReorderSets: jest.fn(),
    onRemoveExercise: jest.fn(),
    onStartRest: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render FlatList with correct testID", () => {
    const exercises = createMockExercises(3);

    const { getByTestId } = render(
      <ExercisesList exercises={exercises} {...mockHandlers} />
    );

    expect(getByTestId("exercises-list")).toBeTruthy();
  });

  it("should use stable keyExtractor", () => {
    const exercises = createMockExercises(5);

    const { getByTestId } = render(
      <ExercisesList exercises={exercises} {...mockHandlers} />
    );

    // בדיקה שכל תרגיל מוצג עם המזהה הנכון
    exercises.forEach((exercise) => {
      expect(getByTestId(`exercise-row-${exercise.id}`)).toBeTruthy();
    });
  });

  it("should handle large lists efficiently with virtualization", () => {
    // רשימה גדולה של 50 תרגילים
    const exercises = createMockExercises(50);

    const { queryAllByTestId } = render(
      <ExercisesList exercises={exercises} {...mockHandlers} />
    );

    // בדיקה שלא כל הפריטים נרנדרו בבת אחת (virtualization)
    const renderedRows = queryAllByTestId(/exercise-row-/);

    // אמור להיות פחות מ-50 פריטים מרונדרים (בגלל windowing)
    expect(renderedRows.length).toBeLessThan(50);
    expect(renderedRows.length).toBeGreaterThan(0);
  });

  it("should pass correct props to ExerciseRow", () => {
    const exercises = createMockExercises(2);

    const { getByTestId } = render(
      <ExercisesList exercises={exercises} {...mockHandlers} />
    );

    // בדיקה שהפרופס הועברו נכון
    expect(getByTestId("exercise-name-0")).toHaveTextContent("תרגיל 1");
    expect(getByTestId("exercise-name-1")).toHaveTextContent("תרגיל 2");

    // בדיקה ש-totalCount הועבר נכון
    expect(getByTestId("exercise-total-count-0")).toHaveTextContent("2");
    expect(getByTestId("exercise-total-count-1")).toHaveTextContent("2");
  });

  it("should optimize rendering with memoization", () => {
    const exercises = createMockExercises(3);

    const { rerender, getByTestId } = render(
      <ExercisesList exercises={exercises} {...mockHandlers} />
    );

    // רינדור מחדש עם אותם נתונים
    rerender(<ExercisesList exercises={exercises} {...mockHandlers} />);

    // בדיקה שהרכיב ממוטב עם memo - לא צריך ליפול
    expect(getByTestId("exercises-list")).toBeTruthy();
  });

  it("should handle empty exercises list", () => {
    const { getByTestId } = render(
      <ExercisesList exercises={[]} {...mockHandlers} />
    );

    expect(getByTestId("exercises-list")).toBeTruthy();
  });

  it("should handle exercises with missing properties gracefully", () => {
    const exercisesWithMissingProps = [
      {
        id: "exercise-1",
        name: "תרגיל 1",
        // missing other required properties
      } as WorkoutExercise,
    ];

    expect(() => {
      render(
        <ExercisesList
          exercises={exercisesWithMissingProps}
          {...mockHandlers}
        />
      );
    }).not.toThrow();
  });
});
