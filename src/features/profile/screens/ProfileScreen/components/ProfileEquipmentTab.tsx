/**
 * @file src/features/profile/screens/ProfileScreen/components/ProfileEquipmentTab.tsx
 * @description כרטיסיית הציוד שלי - גרסה משופרת
 */

import React, { useMemo } from "react";
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

interface EquipmentItem {
  key: string;
  name: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

// מפת אייקונים מיועלת
const EQUIPMENT_ICONS: Record<
  string,
  keyof typeof MaterialCommunityIcons.glyphMap
> = {
  dumbbells: "dumbbell",
  barbell: "weight-lifter",
  kettlebell: "kettlebell",
  resistance_bands: "weight",
  pullup_bar: "human-handsup",
  yoga_mat: "yoga",
  foam_roller: "roller-skate",
  jump_rope: "jump-rope",
  medicine_ball: "basketball",
  stability_ball: "circle",
  free_weights: "weight-lifter",
  machines: "cog",
  cardio: "run",
  bodyweight: "human",
} as const;

// פונקציה פשוטה לחילוץ ציוד - גרסה מועלת
const extractUserEquipment = (user: User | null): string[] => {
  const equipment = user?.questionnaireData?.answers?.equipment_available;

  if (!Array.isArray(equipment)) return [];

  // הפיכה למערך פשוטה יותר
  return equipment
    .map((item: string | { id?: string }) =>
      typeof item === "string" ? item : item?.id || ""
    )
    .filter(Boolean);
};

export const ProfileEquipmentTab: React.FC<Props> = ({
  user,
  onEditEquipment,
}) => {
  // מחשוב הציוד עם memoization
  const equipmentItems: EquipmentItem[] = useMemo(() => {
    const userEquipment = extractUserEquipment(user);

    return userEquipment.map((equipmentKey) => ({
      key: equipmentKey,
      name: translateEquipment(equipmentKey),
      icon: EQUIPMENT_ICONS[equipmentKey] || "help-circle",
    }));
  }, [user]);

  const hasEquipment = equipmentItems.length > 0;

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
      {!hasEquipment ? (
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
          {equipmentItems.map((equipment) => (
            <View key={equipment.key} style={styles.equipmentItem}>
              <MaterialCommunityIcons
                name={equipment.icon}
                size={24}
                color={theme.colors.primary}
              />
              <Text style={styles.equipmentText}>
                {wrapBidi(equipment.name)}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Summary */}
      {hasEquipment && (
        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            סך הכל: {equipmentItems.length} פריטי ציוד
          </Text>
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
    backgroundColor: `${theme.colors.primary}15`,
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
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
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
    paddingHorizontal: theme.spacing.md,
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
    flex: 1,
    maxWidth: "48%", // שני עמודות במקסימום
  },
  equipmentText: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: "500",
    flex: 1,
    textAlign: isRTL() ? "right" : "left",
  },
  summary: {
    marginTop: theme.spacing.md,
    alignItems: "center",
  },
  summaryText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },
});
