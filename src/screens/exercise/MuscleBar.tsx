/**
 * @file src/screens/exercise/MuscleBar.tsx
 * @brief בר בחירת שרירים לסינון תרגילים
 * @dependencies local Muscle type definition
 * @notes רכיב זה מציג רשימה אופקית של כפתורי שרירים לסינון
 * @recurring_errors שכחה להעביר את כל ה-props הנדרשים (muscles, selected, onSelect)
 */

import React, { useMemo, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { theme } from "../../styles/theme";

// טיפוס מקומי עבור שריר
interface Muscle {
  id: number;
  name: string;
  is_front: boolean;
}

// טיפוס שם חוקי של אייקון
type MaterialCommunityIconName = ComponentProps<
  typeof MaterialCommunityIcons
>["name"];

type MuscleButton = {
  id: number | "all";
  name: string;
  icon: MaterialCommunityIconName;
};

type MuscleBarProps = {
  muscles: Muscle[];
  selected: number | "all";
  onSelect: (id: number | "all") => void;
  showAllOption?: boolean;
  scrollToSelected?: boolean;
  style?: object;
  testID?: string;
};

const MuscleBar: React.FC<MuscleBarProps> = ({
  muscles,
  selected,
  onSelect,
  showAllOption = true,
  scrollToSelected = true,
  style,
  testID = "muscle-bar",
}) => {
  const listRef = useRef<FlatList<MuscleButton>>(null);

  const buttons: MuscleButton[] = useMemo(
    () => [
      ...(showAllOption
        ? [
            {
              id: "all" as const,
              name: "הכל",
              icon: "view-grid" as MaterialCommunityIconName,
            },
          ]
        : []),
      ...muscles.map((m) => ({
        id: m.id,
        name: m.name,
        icon: "arm-flex" as MaterialCommunityIconName,
      })),
    ],
    [muscles, showAllOption]
  );

  // גלילה אוטומטית לבחירה
  useEffect(() => {
    if (!scrollToSelected || !listRef.current) return;
    const index = buttons.findIndex((b) => b.id === selected);
    if (index > -1) {
      try {
        listRef.current.scrollToIndex({ index, animated: true });
      } catch (e) {
        // Silent fail acceptable (list not laid out yet)
        if (__DEV__) console.warn("MuscleBar scrollToIndex fail", e);
      }
    }
  }, [selected, buttons, scrollToSelected]);

  const renderItem = useCallback(
    ({ item }: { item: MuscleButton }) => {
      const isActive = selected === item.id;
      return (
        <TouchableOpacity
          style={[styles.muscleButton, isActive && styles.muscleButtonActive]}
          onPress={() => onSelect(item.id)}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityState={{ selected: isActive }}
          accessibilityLabel={`שריר ${item.name}${isActive ? " נבחר" : ""}`}
          testID={`muscle-btn-${item.id}`}
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
            {item.name}
          </Text>
        </TouchableOpacity>
      );
    },
    [onSelect, selected]
  );

  const keyExtractor = useCallback(
    (item: MuscleButton) => item.id.toString(),
    []
  );

  return (
    <View style={[styles.container, style]} testID={testID}>
      {buttons.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>אין שרירים להצגה</Text>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          horizontal
          inverted
          showsHorizontalScrollIndicator={false}
          data={buttons}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          renderItem={renderItem}
          initialNumToRender={8}
          windowSize={4}
          getItemLayout={(_, index) => ({
            length: 70,
            offset: 70 * index,
            index,
          })}
        />
      )}
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
  emptyState: {
    paddingVertical: 12,
    alignItems: "center",
  },
  emptyStateText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
});
