/**
 * @file src/features/profile/screens/ProfileScreen/components/ProfileSettingsTab.tsx
 * @description כרטיסיית הגדרות המשתמש - גרסה משופרת
 */

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../../../../core/theme";
import { isRTL, wrapBidi } from "../../../../../utils/rtlHelpers";
import type { User } from "../../../../../core/types";

interface Props {
  user: User | null;
  onEditPersonalInfo: () => void;
  onEditQuestionnaire: () => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
}

interface SettingsItem {
  title: string;
  subtitle?: string;
  icon: string;
  iconFamily: "MaterialCommunityIcons" | "MaterialIcons";
  onPress: () => void;
  type: "action" | "navigation";
  danger?: boolean;
}

export const ProfileSettingsTab: React.FC<Props> = ({
  user,
  onEditPersonalInfo,
  onEditQuestionnaire,
  onLogout,
  onDeleteAccount,
}) => {
  // Alerts פשוטים יותר
  const handleDeleteAccount = () => {
    Alert.alert(
      "מחיקת חשבון",
      "פעולה זו תמחק את כל הנתונים ולא ניתן לבטל אותה.",
      [
        { text: "ביטול", style: "cancel" },
        { text: "מחק", style: "destructive", onPress: onDeleteAccount },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert("יציאה", "לצאת מהחשבון?", [
      { text: "ביטול", style: "cancel" },
      { text: "יציאה", onPress: onLogout },
    ]);
  };

  const settingsItems: SettingsItem[] = [
    {
      title: "עריכת נתונים אישיים",
      subtitle: "משקל, גובה, יעדים",
      icon: "account-edit",
      iconFamily: "MaterialCommunityIcons",
      onPress: onEditPersonalInfo,
      type: "navigation",
    },
    {
      title: "עריכת שאלון",
      subtitle: "עדכון העדפות וציוד",
      icon: "clipboard-edit",
      iconFamily: "MaterialCommunityIcons",
      onPress: onEditQuestionnaire,
      type: "navigation",
    },
    {
      title: "יציאה מהחשבון",
      icon: "logout",
      iconFamily: "MaterialCommunityIcons",
      onPress: handleLogout,
      type: "action",
    },
    {
      title: "מחיקת חשבון",
      subtitle: "מחיקה סופית",
      icon: "delete-forever",
      iconFamily: "MaterialIcons",
      onPress: handleDeleteAccount,
      type: "action",
      danger: true,
    },
  ];

  // רנדור item מפושט
  const renderSettingsItem = (item: SettingsItem, index: number) => {
    const iconColor = item.danger ? theme.colors.error : theme.colors.primary;

    return (
      <TouchableOpacity
        key={`settings-${index}`}
        style={[styles.settingsItem, item.danger && styles.dangerItem]}
        onPress={item.onPress}
      >
        <View style={styles.itemContent}>
          {item.iconFamily === "MaterialCommunityIcons" ? (
            <MaterialCommunityIcons
              name={item.icon as keyof typeof MaterialCommunityIcons.glyphMap}
              size={24}
              color={iconColor}
            />
          ) : (
            <MaterialIcons
              name={item.icon as keyof typeof MaterialIcons.glyphMap}
              size={24}
              color={iconColor}
            />
          )}
          <View style={styles.itemText}>
            <Text style={[styles.itemTitle, item.danger && styles.dangerText]}>
              {wrapBidi(item.title)}
            </Text>
            {item.subtitle && (
              <Text style={styles.itemSubtitle}>{wrapBidi(item.subtitle)}</Text>
            )}
          </View>
        </View>
        {item.type === "navigation" && (
          <MaterialIcons
            name={isRTL() ? "keyboard-arrow-left" : "keyboard-arrow-right"}
            size={24}
            color={theme.colors.textSecondary}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Account Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>חשבון</Text>
        <View style={styles.accountInfo}>
          <MaterialCommunityIcons
            name="account-circle"
            size={40}
            color={theme.colors.primary}
          />
          <View style={styles.accountText}>
            <Text style={styles.accountName}>
              {wrapBidi(user?.name || "משתמש")}
            </Text>
            <Text style={styles.accountEmail}>
              {wrapBidi(user?.email || "לא זמין")}
            </Text>
          </View>
        </View>
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>הגדרות</Text>
        <View style={styles.settingsList}>
          {settingsItems.map(renderSettingsItem)}
        </View>
      </View>

      {/* App Info - פשוט יותר */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>אודות</Text>
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>GYMovoo v1.0.0</Text>
          <Text style={styles.appDescription}>אפליקציה לאימונים חכמים</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: isRTL() ? "right" : "left",
  },
  accountInfo: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    gap: theme.spacing.md,
  },
  accountText: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: isRTL() ? "right" : "left",
  },
  accountEmail: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 2,
    textAlign: isRTL() ? "right" : "left",
  },
  settingsList: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    overflow: "hidden",
  },
  settingsItem: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  dangerItem: {
    // פשוט יותר - ללא string concatenation
    backgroundColor: `${theme.colors.error}05`,
  },
  itemContent: {
    flexDirection: isRTL() ? "row-reverse" : "row",
    alignItems: "center",
    flex: 1,
    gap: theme.spacing.md,
  },
  itemText: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: theme.colors.text,
    textAlign: isRTL() ? "right" : "left",
  },
  dangerText: {
    color: theme.colors.error,
  },
  itemSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 2,
    textAlign: isRTL() ? "right" : "left",
  },
  appInfo: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    alignItems: "center",
  },
  appVersion: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  appDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});
