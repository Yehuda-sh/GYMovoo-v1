/**
 * @file src/components/questionnaire/EquipmentSelector.tsx
 * @brief רכיב בחירת ציוד עם תמונות מזעריות
 * @dependencies React Native, theme
 * @notes תצוגת רשת עם תמונות, תגיות מומלץ, וברירות מחדל
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../styles/theme";
import { OptionWithImage } from "../../data/newSmartQuestionnaire";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const ITEM_SIZE = (SCREEN_WIDTH - theme.spacing.lg * 3) / 3; // 3 פריטים בשורה

interface EquipmentSelectorProps {
  options: OptionWithImage[];
  selectedItems: string[];
  onChange: (items: string[]) => void;
  defaultItems?: string[];
  helpText?: string;
  subtitle?: string;
}

export default function EquipmentSelector({
  options,
  selectedItems,
  onChange,
  defaultItems = [],
  helpText,
  subtitle,
}: EquipmentSelectorProps) {
  const [selected, setSelected] = useState<string[]>(selectedItems);

  useEffect(() => {
    // הוסף ברירות מחדל אם אין בחירה
    if (selected.length === 0 && defaultItems.length > 0) {
      setSelected(defaultItems);
      onChange(defaultItems);
    }
  }, []);

  const toggleItem = useCallback(
    (itemId: string) => {
      const isDefault = defaultItems.includes(itemId);
      const newSelected = selected.includes(itemId)
        ? selected.filter((id) => id !== itemId)
        : [...selected, itemId];

      // אל תאפשר הסרת ברירת מחדל אם זו הבחירה היחידה
      if (isDefault && newSelected.length === 0) {
        return;
      }

      setSelected(newSelected);
      onChange(newSelected);
    },
    [selected, defaultItems, onChange]
  );

  const renderEquipmentOption = useCallback(
    (item: OptionWithImage) => {
      const isSelected = selected.includes(item.id);
      const isDefault = defaultItems.includes(item.id);

      return (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.itemContainer,
            isSelected && styles.selectedItem,
            isDefault && styles.defaultItem,
          ]}
          onPress={() => toggleItem(item.id)}
          activeOpacity={0.8}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isSelected }}
          accessibilityLabel={`${item.label}${isDefault ? ", ברירת מחדל" : ""}${item.isPremium ? ", מומלץ" : ""}`}
        >
          {/* תג מומלץ */}
          {item.isPremium && (
            <View style={styles.premiumBadge}>
              <MaterialCommunityIcons
                name="crown"
                size={12}
                color={theme.colors.warning}
              />
            </View>
          )}

          {/* תמונה או אייקון */}
          <View style={styles.imageContainer}>
            {item.image ? (
              <Image
                source={
                  typeof item.image === "string"
                    ? { uri: item.image }
                    : item.image
                }
                style={styles.image}
                resizeMode="contain"
                accessibilityIgnoresInvertColors
              />
            ) : (
              <MaterialCommunityIcons
                name="dumbbell"
                size={32}
                color={
                  isSelected ? theme.colors.primary : theme.colors.textSecondary
                }
              />
            )}
          </View>

          {/* שם הציוד */}
          <Text
            style={[styles.itemLabel, isSelected && styles.selectedLabel]}
            numberOfLines={2}
          >
            {item.label}
          </Text>

          {/* סימון בחירה */}
          <View style={styles.checkContainer}>
            <MaterialCommunityIcons
              name={isSelected ? "checkbox-marked" : "checkbox-blank-outline"}
              size={20}
              color={isSelected ? theme.colors.primary : theme.colors.divider}
            />
          </View>

          {/* תג ברירת מחדל */}
          {isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>ברירת מחדל</Text>
            </View>
          )}
        </TouchableOpacity>
      );
    },
    [selected, defaultItems, toggleItem]
  );

  return (
    <View style={styles.container}>
      {subtitle && (
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={{ maxHeight: SCREEN_HEIGHT * 0.5 }}
        nestedScrollEnabled={true}
        accessible={true}
        accessibilityLabel="בחירת ציוד אימון"
      >
        <View style={styles.grid}>{options.map(renderEquipmentOption)}</View>
      </ScrollView>

      {helpText && (
        <View style={styles.helpContainer}>
          <MaterialCommunityIcons
            name="information"
            size={16}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.helpText}>{helpText}</Text>
        </View>
      )}

      {/* המלצות לציוד מומלץ */}
      {options.some((o) => o.isPremium && !selected.includes(o.id)) && (
        <LinearGradient
          colors={[
            theme.colors.primaryGradientStart + "10",
            theme.colors.primaryGradientEnd + "10",
          ]}
          style={styles.premiumSuggestion}
        >
          <MaterialCommunityIcons
            name="crown"
            size={20}
            color={theme.colors.warning}
          />
          <Text style={styles.premiumText}>ציוד מומלץ לתוצאות מיטביות</Text>
        </LinearGradient>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    writingDirection: "rtl",
  },
  subtitleContainer: {
    backgroundColor: theme.colors.primaryGradientStart + "10",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 12,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.primary + "20",
  },
  subtitle: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    textAlign: "center",
    writingDirection: "rtl",
    fontWeight: "500",
  },
  scrollContent: {
    paddingBottom: theme.spacing.md,
  },
  grid: {
    flexDirection: "row-reverse", // RTL
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: theme.spacing.xs,
  },
  itemContainer: {
    width: ITEM_SIZE,
    height: ITEM_SIZE + 40,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.cardBorder,
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    ...theme.shadows.small,
    // Enhanced interaction feedback
    transform: [{ scale: 1 }],
  },
  selectedItem: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryGradientStart + "10",
    transform: [{ scale: 1.02 }],
    ...theme.shadows.medium,
  },
  defaultItem: {
    borderStyle: "dashed",
    borderColor: theme.colors.primary + "80",
  },
  imageContainer: {
    width: ITEM_SIZE - 40,
    height: ITEM_SIZE - 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.xs,
    borderRadius: 8,
    backgroundColor: theme.colors.surface + "30",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 6,
  },
  itemLabel: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: theme.spacing.xs,
    writingDirection: "rtl",
    lineHeight: theme.typography.caption.lineHeight,
  },
  selectedLabel: {
    color: theme.colors.text,
    fontWeight: "600",
  },
  checkContainer: {
    position: "absolute",
    top: theme.spacing.xs,
    right: theme.spacing.xs, // RTL
    backgroundColor: theme.colors.card,
    borderRadius: 10,
    padding: 2,
  },
  premiumBadge: {
    position: "absolute",
    top: theme.spacing.xs,
    left: theme.spacing.xs, // RTL
    backgroundColor: theme.colors.warning + "20",
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: theme.colors.warning + "40",
  },
  defaultBadge: {
    position: "absolute",
    bottom: theme.spacing.xs,
    backgroundColor: theme.colors.primary + "20",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary + "40",
  },
  defaultText: {
    fontSize: 10,
    color: theme.colors.primary,
    fontWeight: "600",
    writingDirection: "rtl",
  },
  helpContainer: {
    flexDirection: "row-reverse", // RTL
    alignItems: "center",
    gap: theme.spacing.xs,
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface + "50",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.divider,
  },
  helpText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    flex: 1,
    writingDirection: "rtl",
    textAlign: "right",
    lineHeight: theme.typography.caption.lineHeight,
  },
  premiumSuggestion: {
    flexDirection: "row-reverse", // RTL
    alignItems: "center",
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: 12,
    marginTop: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.warning + "30",
  },
  premiumText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    flex: 1,
    writingDirection: "rtl",
    textAlign: "right",
    fontWeight: "500",
  },
});
