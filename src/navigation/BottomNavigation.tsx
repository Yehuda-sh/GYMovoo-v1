// src/navigation/BottomNavigation.tsx
/**
 * @file src/navigation/BottomNavigation.tsx
 * @description מנהל הניווט התחתון של האפליקציה עם טאבים עיקריים
 */
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../core/theme";
import {
  MainScreen,
  WorkoutPlansScreen,
  HistoryScreen,
  ProfileScreen,
} from "../screens";

const Tab = createBottomTabNavigator();

export default function BottomNavigation() {
  return (
    <Tab.Navigator
      initialRouteName="Main"
      // ✅ זה המקום הנכון ל-sceneContainerStyle (לא בתוך screenOptions)
      sceneContainerStyle={{ backgroundColor: theme.colors.background }}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        lazy: true,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.cardBorder,
          paddingBottom: 10,
          paddingTop: 10,
          height: 70,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      {/* Profile */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "פרופיל",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={size}
              color={color}
            />
          ),
          tabBarAccessibilityLabel: "כרטיסיית פרופיל",
        }}
      />

      {/* History */}
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: "היסטוריה",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "bar-chart" : "bar-chart-outline"}
              size={size}
              color={color}
            />
          ),
          tabBarAccessibilityLabel: "כרטיסיית היסטוריה",
        }}
      />

      {/* Workout Plans */}
      <Tab.Screen
        name="WorkoutPlans"
        component={WorkoutPlansScreen}
        options={{
          title: "תוכניות",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="brain" size={size} color={color} />
          ),
          tabBarAccessibilityLabel: "כרטיסיית תוכניות אימון",
        }}
      />

      {/* Main/Home */}
      <Tab.Screen
        name="Main"
        component={MainScreen}
        options={{
          title: "בית",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
          tabBarAccessibilityLabel: "כרטיסיית בית",
        }}
      />
    </Tab.Navigator>
  );
}
