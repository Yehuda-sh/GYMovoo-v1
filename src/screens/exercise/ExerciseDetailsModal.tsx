// src/screens/exercise/ExerciseDetailsModal.tsx
import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Exercise } from "../../services/exerciseService";
import { theme } from "../../styles/theme";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  exercise: Exercise;
  onClose: () => void;
};

export default function ExerciseDetailsModal({ exercise, onClose }: Props) {
  return (
    <Modal visible animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={28} color={theme.colors.text} />
          </TouchableOpacity>
          <ScrollView>
            <Image
              source={
                exercise.image
                  ? { uri: exercise.image }
                  : require("../../../assets/exercise-default.png")
              }
              style={styles.img}
            />
            <Text style={styles.title}>{exercise.name}</Text>
            <Text style={styles.sectionTitle}>Main muscles</Text>
            <Text style={styles.sectionText}>
              {exercise.muscles.length
                ? exercise.muscles.map((m) => m.name).join(", ")
                : "N/A"}
            </Text>
            {!!exercise.muscles_secondary.length && (
              <>
                <Text style={[styles.sectionTitle, { fontWeight: "500" }]}>
                  Secondary muscles:
                </Text>
                <Text style={styles.sectionText}>
                  {exercise.muscles_secondary.map((m) => m.name).join(", ")}
                </Text>
              </>
            )}
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.sectionText}>
              {exercise.description.replace(/<[^>]+>/g, "")}
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#0008",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "92%",
    maxHeight: "85%",
    backgroundColor: theme.colors.backgroundAlt,
    borderRadius: 18,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.21,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  closeBtn: {
    alignSelf: "flex-end",
    marginBottom: 8,
  },
  img: {
    width: "100%",
    height: 180,
    borderRadius: 16,
    marginBottom: 15,
    backgroundColor: "#fff1",
  },
  title: {
    fontSize: 21,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  sectionTitle: {
    color: theme.colors.accent,
    fontSize: 16,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 3,
  },
  sectionText: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    marginBottom: 8,
    textAlign: "left",
    writingDirection: "ltr",
  },
});
