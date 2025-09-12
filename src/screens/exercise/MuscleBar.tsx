/**
 * @file src/screens/exercise/MuscleBar.tsx
 * @brief בר בחירת שרירים לסינון תרגילים
 * @dependencies local Muscle type definition, MaterialCommunityIcons, theme
 * @notes רכיב זה מציג רשימה אופקית של כפתורי שרירים לסינון, כולל גלילה אוטומטית ואופטימיזציות ביצועים
 * @recurring_errors שכחה להעביר את כל ה-props הנדרשים (muscles, selected, onSelect), וידוא נגישות מלאה
 * @updated 2025-08-17 הוספת React.memo, החלפת console.warn בלוגים מותנים, מניעת כפילויות בסגנונות
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
import { theme } from "../../core/theme";

const DEBUG = process.env.EXPO_PUBLIC_DEBUG_MUSCLE_BAR === "1";
const dlog = (m: string, data?: unknown) => {
  if (DEBUG) console.warn(`💪 MuscleBar: ${m}`, data || "");
};

// קבועים לעיצוב (מניעת כפילויות)
const CONSTANTS = {
  PADDING_HORIZONTAL: theme.spacing.lg, // 16
  BUTTON_RADIUS: theme.radius.lg, // 16
  ITEM_LENGTH: 70,
  WINDOW_SIZE: 4,
  INITIAL_NUM_TO_RENDER: 8,
} as const;

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
        dlog("scrollToIndex failed (acceptable)", {
          selected,
          index,
          error: e,
        });
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
          initialNumToRender={CONSTANTS.INITIAL_NUM_TO_RENDER}
          windowSize={CONSTANTS.WINDOW_SIZE}
          getItemLayout={(_, index) => ({
            length: CONSTANTS.ITEM_LENGTH,
            offset: CONSTANTS.ITEM_LENGTH * index,
            index,
          })}
        />
      )}
    </View>
  );
};

export default React.memo(MuscleBar);

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
    paddingHorizontal: CONSTANTS.PADDING_HORIZONTAL,
    gap: 8,
  },
  muscleButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    paddingHorizontal: CONSTANTS.PADDING_HORIZONTAL,
    paddingVertical: 10,
    borderRadius: CONSTANTS.BUTTON_RADIUS,
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
