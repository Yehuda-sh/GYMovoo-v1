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
  // Remove HTML tags from description
  const cleanDescription = exercise.description
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .trim();

  return (
    <Modal visible animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={28} color={theme.colors.text} />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Exercise Image */}
            {exercise.image ? (
              <Image
                source={{ uri: exercise.image }}
                style={styles.img}
                resizeMode="contain"
              />
            ) : (
              <View style={[styles.img, styles.placeholderImg]}>
                <Text style={styles.placeholderText}>No Image Available</Text>
              </View>
            )}

            {/* Exercise Name */}
            <Text style={styles.title}>{exercise.name}</Text>

            {/* Primary Muscles */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Primary Muscles</Text>
              <Text style={styles.sectionText}>
                {exercise.muscles.length > 0
                  ? exercise.muscles.map((m) => m.name).join(", ")
                  : "N/A"}
              </Text>
            </View>

            {/* Secondary Muscles */}
            {exercise.muscles_secondary.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Secondary Muscles</Text>
                <Text style={styles.sectionText}>
                  {exercise.muscles_secondary.map((m) => m.name).join(", ")}
                </Text>
              </View>
            )}

            {/* Description */}
            {cleanDescription && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.sectionText}>{cleanDescription}</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: theme.colors.card,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  closeBtn: {
    alignSelf: "flex-end",
    padding: 4,
    marginBottom: 8,
  },
  img: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: theme.colors.backgroundAlt,
  },
  placeholderImg: {
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    opacity: 0.5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 16,
    textAlign: "center",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: theme.colors.accent,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  sectionText: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
});
