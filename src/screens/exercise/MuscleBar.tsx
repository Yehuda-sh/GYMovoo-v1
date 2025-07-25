/**
 * @file src/screens/exercise/MuscleBar.tsx
 * @brief בר בחירת שרירים לסינון תרגילים
 * @dependencies exerciseService (Muscle type)
 * @notes רכיב זה מציג רשימה אופקית של כפתורי שרירים לסינון
 * @recurring_errors שכחה להעביר את כל ה-props הנדרשים (muscles, selected, onSelect)
 */

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Muscle } from "../../services/exerciseService";
import { theme } from "../../styles/theme";

// טיפוסי props
// Props types
type MuscleBarProps = {
  muscles: Muscle[];
  selected: number | "all";
  onSelect: (id: number | "all") => void;
};

const MuscleBar: React.FC<MuscleBarProps> = ({
  muscles,
  selected,
  onSelect,
}) => {
  // הוספת "הכל" ככפתור ראשון
  // Add "All" as first button
  const buttons = [
    { id: "all", name: "הכל", icon: "view-grid" } as any,
    ...muscles.map((m) => ({ ...m, icon: "arm-flex" })),
  ];

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        inverted // RTL: היפוך כיוון הגלילה
        showsHorizontalScrollIndicator={false}
        data={buttons}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isActive = selected === item.id;
          return (
            <TouchableOpacity
              style={[
                styles.muscleButton,
                isActive && styles.muscleButtonActive,
              ]}
              onPress={() => onSelect(item.id)}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={18}
                color={isActive ? theme.colors.white : theme.colors.accent}
              />
              <Text
                style={[
                  styles.muscleButtonText,
                  isActive && styles.muscleButtonTextActive,
                ]}
                numberOfLines={1}
              >
                {item.name === "All" ? "הכל" : item.name}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default MuscleBar;

// --- סגנונות ---
// --- styles ---
const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  listContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  muscleButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    gap: 6,
    marginHorizontal: 4,
  },
  muscleButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    ...theme.shadows.small,
  },
  muscleButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },
  muscleButtonTextActive: {
    color: theme.colors.white,
  },
});
