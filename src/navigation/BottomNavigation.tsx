/**
 * @file src/navigation/BottomNavigation.tsx
 * @brief ניווט תחתון ישראלי מותאם - 5 מסכים עיקריים בסדר RTL
 * @dependencies React Navigation Bottom Tabs, Ionicons, MaterialCommunityIcons
 * @notes סדר טאבים RTL: פרופיל → היסטוריה → תוכניות → אימון → בית (מימין לשמאל)
 * @version 2.4.0 - RTL עובד בהצלחה, הוסרו לוגי דיבוג מיותרים
 */

import React from "react";
import { View, StyleSheet, Platform, I18nManager } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../styles/theme";

// כפיית RTL לכל האפליקציה
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

// מסכים // Screens
import MainScreen from "../screens/main/MainScreen";
import WorkoutPlansScreen from "../screens/workout/WorkoutPlansScreen";
import HistoryScreen from "../screens/history/HistoryScreen"; // יש ליצור
import ProfileScreen from "../screens/profile/ProfileScreen";
import WorkoutMainScreen from "../screens/workout/WorkoutMainScreen";

const Tab = createBottomTabNavigator();

// טיפוסי אייקונים // Icon types
type IconName = keyof typeof Ionicons.glyphMap;
type MaterialIconName = keyof typeof MaterialCommunityIcons.glyphMap;

interface TabIconProps {
  focused: boolean;
  color: string;
  size: number;
  iconName: IconName | MaterialIconName;
  isMaterial?: boolean;
}

// קומפוננטת אייקון לטאב עם אנימציה // Tab icon component with animation
const TabIcon: React.FC<TabIconProps> = ({
  focused,
  color,
  size,
  iconName,
  isMaterial = false,
}) => {
  const IconComponent = isMaterial ? MaterialCommunityIcons : Ionicons;
  return (
    <View style={[styles.iconContainer, focused && styles.focusedIcon]}>
      <IconComponent
        name={iconName as IconName & MaterialIconName}
        size={focused ? size + 3 : size}
        color={color}
        style={{
          opacity: focused ? 1 : 0.7,
        }}
      />
      {focused && <View style={styles.activeIndicator} />}
    </View>
  );
};

export default function BottomNavigation() {
  return (
    <Tab.Navigator
      initialRouteName="Main" // מתחיל תמיד במסך הבית
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.cardBorder,
          borderTopWidth: StyleSheet.hairlineWidth,
          paddingBottom: Platform.OS === "ios" ? 25 : 10,
          paddingTop: 10,
          height: Platform.OS === "ios" ? 90 : 70,
          elevation: 8, // Android shadow
          shadowColor: "#000", // iOS shadow
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          textAlign: "center",
          fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
        },
        tabBarItemStyle: {
          paddingVertical: 6,
          paddingHorizontal: 2,
        },
      }}
    >
      {/* סדר RTL - מימין לשמאל: פרופיל → היסטוריה → תוכניות → אימון → בית */}

      {/* פרופיל - ראשון מימין */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "פרופיל",
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon
              focused={focused}
              color={color}
              size={size}
              iconName="person"
            />
          ),
        }}
      />

      {/* היסטוריה - שני מימין */}
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: "היסטוריה",
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon
              focused={focused}
              color={color}
              size={size}
              iconName="bar-chart"
            />
          ),
        }}
      />

      {/* תוכניות - במרכז */}
      <Tab.Screen
        name="WorkoutPlans"
        component={WorkoutPlansScreen}
        options={{
          title: "תוכניות",
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon
              focused={focused}
              color={color}
              size={size}
              iconName="brain"
              isMaterial={true}
            />
          ),
        }}
      />

      {/* אימון - שני משמאל */}
      <Tab.Screen
        name="QuickWorkout"
        component={WorkoutMainScreen}
        options={{
          title: "אימון",
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon
              focused={focused}
              color={color}
              size={size}
              iconName="fitness"
            />
          ),
        }}
      />

      {/* בית - אחרון משמאל */}
      <Tab.Screen
        name="Main"
        component={MainScreen}
        options={{
          title: "בית",
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon
              focused={focused}
              color={color}
              size={size}
              iconName="home"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
    position: "relative",
  },
  focusedIcon: {
    transform: [{ scale: 1.05 }],
  },
  activeIndicator: {
    position: "absolute",
    bottom: -4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.primary,
  },
});
