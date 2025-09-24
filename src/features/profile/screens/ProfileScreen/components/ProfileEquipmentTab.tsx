/**
 * @file src/features/profile/screens/ProfileScreen/components/ProfileEquipmentTab.tsx
 * @description כרטיסיית הציוד שלי - תצוגת הציוד הזמין
 *
 * השאלות שהובילו ליצירת הקומפוננט הזה:
 * - "למה הפונקציה הזאת כל כך מורכבת?" - הציוד היה מוטמע במסך
 * - "אפשר לעשות את זה בשורה אחת?" - פישוט תצוגת הציוד
 */

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../../../core/theme";
import { isRTL, wrapBidi } from "../../../../../utils/rtlHelpers";
import { translateEquipment } from "../../../../../constants/equipmentTranslations";
import type { User } from "../../../../../core/types";

interface Props {
  user: User | null;
  onEditEquipment: () => void;
}

// פונקציה פשוטה לחילוץ ציוד המשתמש
const extractUserEquipment = (user: User | null): string[] => {
  if (!user?.questionnaireData?.answers) return [];

  // גישה לציוד באמצעות מפתח ישיר במבנה QuestionnaireAnswers
  const equipment = user.questionnaireData.answers.equipment_available;

  if (!equipment || !Array.isArray(equipment)) return [];

  return equipment.map((item: string | { id: string }) =>
    typeof item === "string" ? item : item.id
  );
};

// פונקציה פשוטה לקבלת אייקון הציוד
const getEquipmentIcon = (equipmentKey: string): string => {
  const iconMap: { [key: string]: string } = {
    dumbbells: "dumbbell",
    barbell: "weight-lifter",
    kettlebell: "kettlebell",
    resistance_bands: "weight",
    pullup_bar: "pull-up",
    yoga_mat: "yoga",
    foam_roller: "roller-skate",
    jump_rope: "jump-rope",
    medicine_ball: "basketball",
    stability_ball: "circle",
    free_weights: "weight-lifter",
    machines: "cog",
    cardio: "run",
    bodyweight: "human",
  };

  return iconMap[equipmentKey] || "help-circle";
};

export const ProfileEquipmentTab: React.FC<Props> = ({
  user,
  onEditEquipment,
}) => {
  const allEquipment = extractUserEquipment(user);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>הציוד שלי</Text>
        <TouchableOpacity style={styles.editButton} onPress={onEditEquipment}>
          <Text style={styles.editButtonText}>ערוך</Text>
        </TouchableOpacity>
      </View>

      {/* Equipment List */}
      {allEquipment.length === 0 ? (
        <View style={styles.noEquipmentContainer}>
          <MaterialCommunityIcons
            name="dumbbell"
            size={40}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.noEquipmentText}>לא נבחר ציוד</Text>
          <Text style={styles.noEquipmentSubtext}>
            עבור לשאלון כדי לבחור את הציוד הזמין לך
          </Text>
        </View>
      ) : (
        <View style={styles.equipmentGrid}>
          {allEquipment.map((equipment, index) => (
            <View key={index} style={styles.equipmentItem}>
              <MaterialCommunityIcons
                name={
                  getEquipmentIcon(
                    equipment
                  ) as keyof typeof MaterialCommunityIcons.glyphMap
                }
                size={24}
                color={theme.colors.primary}
              />
              <Text style={styles.equipmentText}>
                {wrapBidi(translateEquipment(equipment))}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: isRTL() ? "right" : "left",
  },
  editButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.primary + "15",
    borderRadius: theme.radius.md,
  },
  editButtonText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  noEquipmentContainer: {
    alignItems: "center",
    paddingVertical: theme.spacing.xl,
  },
  noEquipmentText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    fontWeight: "600",
    textAlign: "center",
  },
  noEquipmentSubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: "center",
    lineHeight: 20,
  },
  equipmentGrid: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  equipmentItem: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    gap: theme.spacing.sm,
    minWidth: 120,
  },
  equipmentText: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: "500",
    flex: 1,
    textAlign: isRTL() ? "right" : "left",
  },
});
