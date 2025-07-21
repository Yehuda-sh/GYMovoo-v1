import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

interface SimpleExercisePickerProps {
  visible: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: any) => void;
}

export const SimpleExercisePicker: React.FC<SimpleExercisePickerProps> = ({
  visible,
  onClose,
  onSelectExercise,
}) => {
  const mockExercises = [
    { id: "1", name: "Bench Press", primaryMuscles: ["Chest"] },
    { id: "2", name: "Squat", primaryMuscles: ["Legs"] },
    { id: "3", name: "Deadlift", primaryMuscles: ["Back"] },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.title}>Choose Exercise</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.exerciseList}>
            {mockExercises.map((exercise) => (
              <TouchableOpacity
                key={exercise.id}
                style={styles.exerciseItem}
                onPress={() => {
                  onSelectExercise(exercise);
                  onClose();
                }}
              >
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseMuscle}>
                  {exercise.primaryMuscles[0]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    minHeight: height * 0.8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  exerciseList: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  exerciseItem: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  exerciseMuscle: {
    fontSize: 14,
    color: "#666",
  },
});
