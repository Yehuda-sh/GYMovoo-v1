/**
 * @file SettingsScreen.tsx
 * @description מסך הגדרות האפליקציה - ניהול העדפות משתמש, שפה, יחידות מידה ועוד
 * @created 2025-09-14
 */

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";

import { theme } from "../../core/theme";
import { ErrorBoundary } from "../../components/common/ErrorBoundary";
import { useUserStore } from "../../stores/userStore";
import { StorageKeys } from "../../constants/StorageKeys";
import { logger } from "../../utils/logger";

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  type: "toggle" | "navigation" | "action";
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

interface SettingSection {
  title: string;
  items: SettingItem[];
}

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, logout } = useUserStore();

  // הגדרות מקומיות
  const [settings, setSettings] = useState({
    notifications: true,
    soundEffects: true,
    hapticFeedback: true,
    autoSave: true,
    metricUnits: true, // true = metric (kg), false = imperial (lbs)
    language: "he", // 'he' | 'en'
  });

  // טעינת הגדרות משמורות
  React.useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem(
        StorageKeys.APP_SETTINGS
      );
      if (savedSettings) {
        setSettings((prev) => ({ ...prev, ...JSON.parse(savedSettings) }));
      }
    } catch (error) {
      logger.error("SettingsScreen", "Failed to load settings", error);
    }
  };

  const saveSettings = useCallback(async (newSettings: typeof settings) => {
    try {
      await AsyncStorage.setItem(
        StorageKeys.APP_SETTINGS,
        JSON.stringify(newSettings)
      );
      setSettings(newSettings);
      logger.info("SettingsScreen", "Settings saved successfully");
    } catch (error) {
      logger.error("SettingsScreen", "Failed to save settings", error);
    }
  }, []);

  const handleToggleSetting = useCallback(
    (key: keyof typeof settings) => {
      return (value: boolean) => {
        if (settings.hapticFeedback) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        const newSettings = { ...settings, [key]: value };
        saveSettings(newSettings);
      };
    },
    [settings, saveSettings]
  );

  const handleClearCache = useCallback(() => {
    Alert.alert(
      "נקה מטמון",
      "פעולה זו תמחק את כל הנתונים השמורים במטמון. האם אתה בטוח?",
      [
        { text: "בטל", style: "cancel" },
        {
          text: "נקה",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove([
                StorageKeys.WORKOUT_CACHE,
                StorageKeys.EXERCISE_CACHE,
                StorageKeys.PROGRESS_CACHE,
              ]);
              Alert.alert("הצלחה", "המטמון נוקה בהצלחה");
              logger.info("SettingsScreen", "Cache cleared successfully");
            } catch (error) {
              Alert.alert("שגיאה", "לא ניתן לנקות את המטמון");
              logger.error("SettingsScreen", "Failed to clear cache", error);
            }
          },
        },
      ]
    );
  }, []);

  const handleLogout = useCallback(() => {
    Alert.alert(
      "התנתק",
      "האם אתה בטוח שברצונך להתנתק? כל הנתונים הלא-שמורים יאבדו.",
      [
        { text: "בטל", style: "cancel" },
        {
          text: "התנתק",
          style: "destructive",
          onPress: () => {
            logout();
            navigation.navigate("Welcome" as never);
            logger.info("SettingsScreen", "User logged out");
          },
        },
      ]
    );
  }, [logout, navigation]);

  const handleShareApp = useCallback(async () => {
    try {
      await Share.share({
        message:
          "היי! בדקתי את אפליקציית GYMovoo לאימונים אישיים וזה מדהים! תנסה גם: https://gymovoo.app",
        url: "https://gymovoo.app",
      });
      logger.info("SettingsScreen", "App shared successfully");
    } catch (error) {
      logger.error("SettingsScreen", "Failed to share app", error);
    }
  }, []);

  const settingSections: SettingSection[] = [
    {
      title: "העדפות כלליות",
      items: [
        {
          id: "notifications",
          title: "התראות",
          subtitle: "קבל התראות על אימונים ותזכורות",
          icon: "bell",
          type: "toggle",
          value: settings.notifications,
          onToggle: handleToggleSetting("notifications"),
        },
        {
          id: "soundEffects",
          title: "אפקטי קול",
          subtitle: "הפעל צלילים באפליקציה",
          icon: "volume-high",
          type: "toggle",
          value: settings.soundEffects,
          onToggle: handleToggleSetting("soundEffects"),
        },
        {
          id: "hapticFeedback",
          title: "רטט משוב",
          subtitle: "רטט קל בלחיצות ופעולות",
          icon: "vibrate",
          type: "toggle",
          value: settings.hapticFeedback,
          onToggle: handleToggleSetting("hapticFeedback"),
        },
        {
          id: "metricUnits",
          title: "יחידות מידה",
          subtitle: settings.metricUnits
            ? "מטרי (ק״ג, ס״מ)"
            : "אימפריאלי (לב״ס, אינץ׳)",
          icon: "scale-bathroom",
          type: "toggle",
          value: settings.metricUnits,
          onToggle: handleToggleSetting("metricUnits"),
        },
      ],
    },
    {
      title: "נתונים ואבטחה",
      items: [
        {
          id: "autoSave",
          title: "שמירה אוטומטית",
          subtitle: "שמור אימונים אוטומטית",
          icon: "content-save-auto",
          type: "toggle",
          value: settings.autoSave,
          onToggle: handleToggleSetting("autoSave"),
        },
        {
          id: "clearCache",
          title: "נקה מטמון",
          subtitle: "מחק נתונים זמניים שמורים",
          icon: "broom",
          type: "action",
          onPress: handleClearCache,
        },
        {
          id: "exportData",
          title: "ייצא נתונים",
          subtitle: "ייצא את נתוני האימונים שלך",
          icon: "export",
          type: "navigation",
          onPress: () => {
            // TODO: Implement data export
            Alert.alert("בקרוב", "תכונה זו תהיה זמינה בעדכון הבא");
          },
        },
      ],
    },
    {
      title: "תמיכה ומידע",
      items: [
        {
          id: "help",
          title: "עזרה ותמיכה",
          subtitle: "מדריכים ושאלות נפוצות",
          icon: "help-circle",
          type: "navigation",
          onPress: () => {
            // TODO: Navigate to help screen
            Alert.alert("בקרוב", "מסך עזרה יהיה זמין בעדכון הבא");
          },
        },
        {
          id: "feedback",
          title: "שלח משוב",
          subtitle: "עזור לנו לשפר את האפליקציה",
          icon: "message-text",
          type: "navigation",
          onPress: () => {
            // TODO: Navigate to feedback screen
            Alert.alert("בקרוב", "מסך משוב יהיה זמין בעדכון הבא");
          },
        },
        {
          id: "share",
          title: "שתף את האפליקציה",
          subtitle: "ספר לחברים על GYMovoo",
          icon: "share",
          type: "action",
          onPress: handleShareApp,
        },
        {
          id: "about",
          title: "אודות GYMovoo",
          subtitle: "גרסה 1.0.0",
          icon: "information",
          type: "navigation",
          onPress: () => {
            Alert.alert(
              "GYMovoo v1.0.0",
              "אפליקציה לאימונים אישיים\nפותחה עם ❤️ בישראל\n\n© 2025 GYMovoo",
              [{ text: "סגור", style: "default" }]
            );
          },
        },
      ],
    },
    {
      title: "חשבון",
      items: [
        {
          id: "logout",
          title: "התנתק",
          subtitle: "התנתק מהחשבון הנוכחי",
          icon: "logout",
          type: "action",
          onPress: handleLogout,
        },
      ],
    },
  ];

  const renderSettingItem = (item: SettingItem) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.settingItem}
        onPress={item.onPress}
        disabled={item.type === "toggle"}
      >
        <View style={styles.settingIcon}>
          <MaterialCommunityIcons
            name={item.icon as keyof typeof MaterialCommunityIcons.glyphMap}
            size={24}
            color={theme.colors.primary}
          />
        </View>

        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          {item.subtitle && (
            <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
          )}
        </View>

        {item.type === "toggle" && (
          <Switch
            value={item.value}
            onValueChange={item.onToggle}
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.primary + "40",
            }}
            thumbColor={
              item.value ? theme.colors.primary : theme.colors.textSecondary
            }
          />
        )}

        {item.type === "navigation" && (
          <MaterialCommunityIcons
            name="chevron-left"
            size={20}
            color={theme.colors.textSecondary}
          />
        )}
      </TouchableOpacity>
    );
  };

  const renderSection = (section: SettingSection) => (
    <View key={section.title} style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.sectionContent}>
        {section.items.map(renderSettingItem)}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ErrorBoundary fallbackMessage="שגיאה בטעינת מסך ההגדרות">
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons
              name="arrow-right"
              size={24}
              color={theme.colors.text}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>הגדרות</Text>
          <View style={styles.placeholder} />
        </View>

        {/* User Info */}
        {user && (
          <View style={styles.userSection}>
            <View style={styles.userAvatar}>
              <MaterialCommunityIcons
                name="account"
                size={32}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.email || "משתמש"}</Text>
              <Text style={styles.userType}>
                {user.subscription?.type === "premium"
                  ? "משתמש פרימיום"
                  : "משתמש בסיסי"}
              </Text>
            </View>
          </View>
        )}

        {/* Settings Sections */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {settingSections.map(renderSection)}
        </ScrollView>
      </ErrorBoundary>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  placeholder: {
    width: 40,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.lg,
    backgroundColor: "white",
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 4,
  },
  userType: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  section: {
    marginTop: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  sectionContent: {
    backgroundColor: "white",
    marginHorizontal: theme.spacing.lg,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border + "40",
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary + "10",
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: theme.colors.text,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
});

export default SettingsScreen;
