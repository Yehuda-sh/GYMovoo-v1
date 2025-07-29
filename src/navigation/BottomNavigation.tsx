/**
 * @file src/navigation/BottomNavigation.tsx
 * @brief ניווט תחתון קומפקטי - 5 מסכים עיקריים בעיצוב מינימליסטי
 * @dependencies React Navigation Bottom Tabs, Ionicons, WorkoutPlanScreen
 * @notes גובה מינימלי, אייקונים קטנים, תמיכה מלאה ב-RTL
 */

import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../styles/theme";

// מסכים // Screens
import MainScreen from "../screens/main/MainScreen";
import WorkoutPlansScreen from "../screens/workout/WorkoutPlansScreen";
import WorkoutRouterScreen from "../screens/workout/WorkoutRouterScreen";
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
    </View>
  );
};

export default function BottomNavigation() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.cardBorder,
          borderTopWidth: 1,
          paddingBottom: Platform.OS === "ios" ? 20 : 8,
          paddingTop: 8,
          height: Platform.OS === "ios" ? 85 : 65,
          ...theme.shadows.medium,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
          textAlign: "center",
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      {/* מסך ראשי */}
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

      {/* תוכניות אימון AI */}
      <Tab.Screen
        name="WorkoutPlans"
        component={WorkoutPlansScreen}
        options={{
          title: "תוכניות AI",
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

      {/* אימון חכם */}
      <Tab.Screen
        name="QuickWorkout"
        component={WorkoutRouterScreen}
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

      {/* היסטוריה */}
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
              iconName="stats-chart"
            />
          ),
        }}
      />

      {/* פרופיל */}
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
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 24,
    height: 24,
  },
});
