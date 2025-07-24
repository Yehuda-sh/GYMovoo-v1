/**
 * @file src/navigation/BottomNavigation.tsx
 * @brief ניווט תחתון קומפקטי - 5 מסכים עיקריים בעיצוב מינימליסטי
 * @dependencies React Navigation Bottom Tabs, Ionicons
 * @notes גובה מינימלי, אייקונים קטנים, תמיכה מלאה ב-RTL
 */

import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../styles/theme";

// מסכים // Screens
import MainScreen from "../screens/main/MainScreen";
import WorkoutPlansScreen from "../screens/workout/WorkoutPlansScreen"; // יש ליצור
import QuickWorkoutScreen from "../screens/workout/QuickWorkoutScreen";
import HistoryScreen from "../screens/history/HistoryScreen"; // יש ליצור
import ProfileScreen from "../screens/profile/ProfileScreen";

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

// קומפוננטת אייקון לטאב // Tab icon component
const TabIcon: React.FC<TabIconProps> = ({
  focused,
  color,
  size,
  iconName,
  isMaterial = false,
}) => {
  const IconComponent = isMaterial ? MaterialCommunityIcons : Ionicons;
  return (
    <View style={styles.iconContainer}>
      <IconComponent
        name={iconName as any}
        size={focused ? size + 2 : size}
        color={color}
      />
      {focused && (
        <View style={[styles.indicator, { backgroundColor: color }]} />
      )}
    </View>
  );
};

export default function BottomNavigation() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIconStyle: styles.tabBarIcon,
        tabBarItemStyle: styles.tabBarItem,
        // מאפייני נגישות // Accessibility
        tabBarAccessibilityLabel: "ניווט ראשי",
      }}
    >
      {/* מסך ראשי // Home screen */}
      <Tab.Screen
        name="Home"
        component={MainScreen}
        options={{
          tabBarLabel: "בית",
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon
              focused={focused}
              color={color}
              size={20}
              iconName="home"
            />
          ),
          tabBarAccessibilityLabel: "מסך הבית",
        }}
      />

      {/* תוכניות אימון // Workout plans */}
      <Tab.Screen
        name="Plans"
        component={WorkoutPlansScreen}
        options={{
          tabBarLabel: "תוכניות",
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon
              focused={focused}
              color={color}
              size={20}
              iconName="calendar-multiselect"
              isMaterial={true}
            />
          ),
          tabBarAccessibilityLabel: "תוכניות אימון",
        }}
      />

      {/* אימון מהיר // Quick workout */}
      <Tab.Screen
        name="Workout"
        component={QuickWorkoutScreen}
        options={{
          tabBarLabel: "אימון",
          tabBarIcon: ({ focused, color, size }) => (
            <View style={styles.workoutIconContainer}>
              <View
                style={[
                  styles.workoutIconBackground,
                  focused && styles.workoutIconBackgroundActive,
                ]}
              >
                <MaterialCommunityIcons
                  name="dumbbell"
                  size={22}
                  color={focused ? "#fff" : theme.colors.primary}
                />
              </View>
            </View>
          ),
          tabBarAccessibilityLabel: "התחל אימון",
        }}
      />

      {/* היסטוריה // History */}
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarLabel: "היסטוריה",
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon
              focused={focused}
              color={color}
              size={20}
              iconName="time"
            />
          ),
          tabBarAccessibilityLabel: "היסטוריית אימונים",
        }}
      />

      {/* פרופיל // Profile */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "פרופיל",
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon
              focused={focused}
              color={color}
              size={20}
              iconName="person"
            />
          ),
          tabBarAccessibilityLabel: "פרופיל משתמש",
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.cardBorder,
    height: Platform.OS === "ios" ? 60 : 56, // גובה מינימלי
    paddingTop: 4,
    paddingBottom: Platform.OS === "ios" ? 20 : 8,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabBarLabel: {
    fontSize: 10, // פונט קטן לחיסכון במקום
    fontWeight: "600",
    marginTop: -4,
    marginBottom: 0,
  },
  tabBarIcon: {
    marginBottom: -2,
  },
  tabBarItem: {
    paddingTop: 4,
    paddingBottom: 0,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  indicator: {
    position: "absolute",
    bottom: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  workoutIconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  workoutIconBackground: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.backgroundAlt,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  workoutIconBackgroundActive: {
    backgroundColor: theme.colors.primary,
    transform: [{ scale: 1.05 }],
  },
});
