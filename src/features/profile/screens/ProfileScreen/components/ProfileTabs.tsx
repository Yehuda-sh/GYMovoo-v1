/**
 * @file src/features/profile/screens/ProfileScreen/components/ProfileTabs.tsx
 * @description ניהול הטאבים במסך הפרופיל - פישוט הניווט
 *
 * השאלות שהובילו ליצירת הקומפוננט הזה:
 * - "למה הפונקציה הזאת כל כך מורכבת?" - ניהול הטאבים היה מפוזר
 * - "אפשר לעשות את זה בשורה אחת?" - פישוט הטאבים לרכיב עצמאי
 */

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../../../core/theme";
import { isRTL } from "../../../../../utils/rtlHelpers";

export interface ProfileTab {
  id: string;
  title: string;
  icon: string;
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
  return (
    <View style={styles.tabsContainer}>
      {PROFILE_TABS.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            styles.tabButton,
            activeTab === tab.id && styles.activeTabButton,
          ]}
          onPress={() => onTabChange(tab.id)}
        >
          <MaterialCommunityIcons
            name={tab.icon as keyof typeof MaterialCommunityIcons.glyphMap}
            size={20}
            color={
              activeTab === tab.id
                ? theme.colors.primary
                : theme.colors.textSecondary
            }
          />
          <Text
            style={[
              styles.tabButtonText,
              activeTab === tab.id && styles.activeTabButtonText,
            ]}
          >
            {tab.title}
          </Text>
        </TouchableOpacity>
      ))}
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
    backgroundColor: theme.colors.primary + "15",
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
