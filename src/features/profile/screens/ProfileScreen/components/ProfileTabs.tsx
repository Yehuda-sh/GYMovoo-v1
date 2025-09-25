/**
 * @file src/features/profile/screens/ProfileScreen/components/ProfileTabs.tsx
 * @description ניהול הטאבים במסך הפרופיל - גרסה משופרת
 */

import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../../../core/theme";
import { isRTL } from "../../../../../utils/rtlHelpers";

export interface ProfileTab {
  id: string;
  title: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

const PROFILE_TABS: ProfileTab[] = [
  {
    id: "info",
    title: "המידע שלי",
    icon: "account-circle",
  },
  {
    id: "journey",
    title: "המסע שלי",
    icon: "trophy",
  },
  {
    id: "equipment",
    title: "הציוד שלי",
    icon: "dumbbell",
  },
  {
    id: "settings",
    title: "הגדרות",
    icon: "cog",
  },
];

interface Props {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const ProfileTabs: React.FC<Props> = ({ activeTab, onTabChange }) => {
  // מחשוב styles עם useMemo לאופטימיזציה
  const activeTabStyle = useMemo(
    () => ({
      backgroundColor: `${theme.colors.primary}15`,
    }),
    []
  );

  return (
    <View style={styles.tabsContainer}>
      {PROFILE_TABS.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tabButton,
              isActive && [styles.activeTabButton, activeTabStyle],
            ]}
            onPress={() => onTabChange(tab.id)}
          >
            <MaterialCommunityIcons
              name={tab.icon}
              size={20}
              color={
                isActive ? theme.colors.primary : theme.colors.textSecondary
              }
            />
            <Text
              style={[
                styles.tabButtonText,
                isActive && styles.activeTabButtonText,
              ]}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    justifyContent: "space-around",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  tabButton: {
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    borderRadius: theme.radius.md,
    flex: 1,
  },
  activeTabButton: {
    // הצבע מחושב ב-component עם useMemo
  },
  tabButtonText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: theme.spacing.xs,
    fontWeight: "500",
  },
  activeTabButtonText: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
});
