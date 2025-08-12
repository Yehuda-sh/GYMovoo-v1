/**
 * @file src/navigation/BottomNavigation.tsx
 * @brief ניווט תחתון ישראלי מותאם - 5 מסכים עיקריים בסדר RTL
 * @brief Israeli adapted bottom navigation - 5 main screens in RTL order
 * @dependencies React Navigation Bottom Tabs, Ionicons, MaterialCommunityIcons
 * @notes סדר טאבים RTL: פרופיל → היסטוריה → תוכניות → אימון → בית (מימין לשמאל)
 * @notes Tabs RTL order: Profile → History → Plans → Workout → Home (right to left)
 * @version 2.5.0 - Enhanced imports consistency, removed RTL duplication
 * @updated 2025-08-04 Improved organization and performance optimizations
 */

import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../styles/theme";

// ===============================================
// 📱 Screen Imports - יבוא מסכים
// ===============================================
// שימוש עקבי במרכז הייצוא לעקביות / Consistent use of export hub for consistency
import {
  MainScreen,
  WorkoutPlansScreen,
  HistoryScreen,
  ProfileScreen,
  ActiveWorkoutScreen,
} from "../screens";

// הערה: RTL מוגדר גלובלית ב-App.tsx -> rtlHelpers
// Note: RTL is configured globally in App.tsx -> rtlHelpers

// ===============================================
// 🔧 Navigation Setup - הגדרת ניווט
// ===============================================
const Tab = createBottomTabNavigator();

// טיפוסי אייקונים / Icon types
type IconName = keyof typeof Ionicons.glyphMap;
type MaterialIconName = keyof typeof MaterialCommunityIcons.glyphMap;

// ===============================================
// 🎨 Tab Icon Component - רכיב אייקון טאב
// ===============================================
// אופטימיזציה עם React.memo / Performance optimization with React.memo

interface TabIconProps {
  focused: boolean;
  color: string;
  size: number;
  iconName: IconName | MaterialIconName;
  isMaterial?: boolean;
  accessibilityLabel?: string;
}

// קומפוננטת אייקון לטאב עם אנימציה מותאמת
// Tab icon component with optimized animation
const TabIcon: React.FC<TabIconProps> = React.memo(
  ({
    focused,
    color,
    size,
    iconName,
    isMaterial = false,
    accessibilityLabel,
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
          accessible={false}
          importantForAccessibility="no"
        />
        {focused && <View style={styles.activeIndicator} />}
      </View>
    );
  }
);

// תמיכה ב-debugging / Debugging support
TabIcon.displayName = "TabIcon";

/**
 * רכיב ניווט תחתון ראשי
 * Main bottom navigation component
 *
 * @returns {React.JSX.Element} רכיב ניווט עם 5 טאבים ב-RTL
 * @returns {React.JSX.Element} Navigation component with 5 RTL tabs
 */
export default function BottomNavigation(): React.JSX.Element {
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
      {/* =============================================== */}
      {/* 📱 Tab Screens - מסכי טאבים (סדר RTL)        */}
      {/* =============================================== */}
      {/* סדר RTL - מימין לשמאל: פרופיל → היסטוריה → תוכניות → אימון → בית */}
      {/* RTL Order - Right to Left: Profile → History → Plans → Workout → Home */}

      {/* 👤 פרופיל - ראשון מימין / Profile - First from right */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "פרופיל",
          tabBarAccessibilityLabel: "פרופיל, טאב ניווט",
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon
              focused={focused}
              color={color}
              size={size}
              iconName="person"
              accessibilityLabel="פרופיל"
            />
          ),
        }}
      />

      {/* 📊 היסטוריה - שני מימין / History - Second from right */}
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: "היסטוריה",
          tabBarAccessibilityLabel: "היסטוריה, טאב ניווט",
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon
              focused={focused}
              color={color}
              size={size}
              iconName="bar-chart"
              accessibilityLabel="היסטוריה"
            />
          ),
        }}
      />

      {/* 🧠 תוכניות - במרכז / Plans - Center */}
      <Tab.Screen
        name="WorkoutPlans"
        component={WorkoutPlansScreen}
        options={{
          title: "תוכניות",
          tabBarAccessibilityLabel: "תוכניות אימונים, טאב ניווט",
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon
              focused={focused}
              color={color}
              size={size}
              iconName="brain"
              isMaterial={true}
              accessibilityLabel="תוכניות אימונים"
            />
          ),
        }}
      />

      {/* 💪 אימון - שני משמאל / Workout - Second from left */}
      <Tab.Screen
        name="QuickWorkout"
        component={ActiveWorkoutScreen}
        options={{
          title: "אימון",
          tabBarAccessibilityLabel: "אימון מהיר, טאב ניווט",
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon
              focused={focused}
              color={color}
              size={size}
              iconName="fitness"
              accessibilityLabel="אימון מהיר"
            />
          ),
        }}
      />

      {/* 🏠 בית - אחרון משמאל / Home - Last from left */}
      <Tab.Screen
        name="Main"
        component={MainScreen}
        options={{
          title: "בית",
          tabBarAccessibilityLabel: "בית, מסך ראשי, טאב ניווט",
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon
              focused={focused}
              color={color}
              size={size}
              iconName="home"
              accessibilityLabel="מסך הבית"
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
