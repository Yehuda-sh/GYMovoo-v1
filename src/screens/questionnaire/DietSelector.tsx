/**
 * @file src/screens/questionnaire/DietSelector.tsx
 * @brief רכיב בחירת סוג תזונה עם תמונות ותיאורים
 * @dependencies React Native, theme
 * @notes תצוגת אפשרויות תזונה עם סמלים מוכרים
 */

import React, { useCallback } from "react";
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
import { OptionWithImage } from "../../data/questionnaireData";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ITEM_WIDTH = (SCREEN_WIDTH - theme.spacing.lg * 2 - theme.spacing.sm) / 2; // 2 פריטים בשורה

interface DietSelectorProps {
  options: OptionWithImage[];
  selectedItem: string;
  onChange: (item: string) => void;
}

export default function DietSelector({
  options,
  selectedItem,
  onChange,
}: DietSelectorProps) {
  const handleItemPress = useCallback(
    (itemId: string) => {
      onChange(itemId);
    },
    [onChange]
  );

  const renderDietOption = useCallback(
    (item: OptionWithImage) => {
      const isSelected = selectedItem === item.id;

      return (
        <TouchableOpacity
          key={item.id}
          style={[styles.itemContainer, isSelected && styles.selectedItem]}
          onPress={() => handleItemPress(item.id)}
          activeOpacity={0.8}
          accessibilityRole="radio"
          accessibilityState={{ selected: isSelected }}
          accessibilityLabel={`${item.label}${item.description ? `, ${item.description}` : ""}`}
        >
          {/* תמונה */}
          <View style={styles.imageContainer}>
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
          </View>

          {/* שם התזונה */}
          <Text style={[styles.itemLabel, isSelected && styles.selectedLabel]}>
            {item.label}
          </Text>

          {/* תיאור */}
          {item.description && (
            <Text
              style={[
                styles.itemDescription,
                isSelected && styles.selectedDescription,
              ]}
              numberOfLines={2}
            >
              {item.description}
            </Text>
          )}

          {/* סימון בחירה */}
          <View style={styles.checkContainer}>
            <View
              style={[
                styles.radioOuter,
                isSelected && styles.radioOuterSelected,
              ]}
            >
              {isSelected && <View style={styles.radioInner} />}
            </View>
          </View>

          {/* רקע מודגש לנבחר */}
          {isSelected && (
            <LinearGradient
              colors={[
                theme.colors.primaryGradientStart + "10",
                theme.colors.primaryGradientEnd + "10",
              ]}
              style={styles.selectedBackground}
            />
          )}
        </TouchableOpacity>
      );
    },
    [selectedItem, handleItemPress]
  );

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
      accessibilityRole="radiogroup"
      accessibilityLabel="בחירת סוג תזונה"
    >
      <View style={styles.grid}>{options.map(renderDietOption)}</View>

      {/* מידע נוסף */}
      <View style={styles.infoContainer}>
        <MaterialCommunityIcons
          name="information"
          size={16}
          color={theme.colors.textSecondary}
        />
        <Text style={styles.infoText}>
          בחירת סוג התזונה תעזור לנו להתאים את התוכנית שלך
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.md,
    writingDirection: "rtl",
  },
  grid: {
    flexDirection: "row-reverse", // RTL
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: theme.spacing.xs,
  },
  itemContainer: {
    width: ITEM_WIDTH,
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: theme.colors.cardBorder,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    ...theme.shadows.small,
    // Enhanced interaction feedback
    transform: [{ scale: 1 }],
  },
  selectedItem: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.card,
    transform: [{ scale: 1.02 }],
    ...theme.shadows.medium,
  },
  imageContainer: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.sm,
    borderRadius: 12,
    backgroundColor: theme.colors.surface + "50",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  itemLabel: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.xs,
    writingDirection: "rtl",
  },
  selectedLabel: {
    color: theme.colors.primary,
    fontWeight: "700",
  },
  itemDescription: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
    writingDirection: "rtl",
    lineHeight: theme.typography.caption.lineHeight,
  },
  selectedDescription: {
    color: theme.colors.text,
  },
  checkContainer: {
    position: "absolute",
    top: theme.spacing.sm,
    right: theme.spacing.sm, // RTL
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.divider,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.card,
  },
  radioOuterSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + "10",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
  },
  selectedBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  infoContainer: {
    flexDirection: "row-reverse", // RTL
    alignItems: "center",
    gap: theme.spacing.xs,
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface + "50",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.divider,
  },
  infoText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    flex: 1,
    writingDirection: "rtl",
    textAlign: "right",
    lineHeight: theme.typography.caption.lineHeight,
  },
});
