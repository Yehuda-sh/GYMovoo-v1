import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../styles/theme";

import {
  MainScreen,
  WorkoutPlansScreen,
  HistoryScreen,
  ProfileScreen,
  ActiveWorkoutScreen,
} from "../screens";

const Tab = createBottomTabNavigator();

export default function BottomNavigation() {
  return (
    <Tab.Navigator
      initialRouteName="Main"
      screenOptions={{
        headerShown: false,
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
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />

      {/* History */}
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: "היסטוריה",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart" size={size} color={color} />
          ),
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
        }}
      />

      {/* Quick Workout */}
      <Tab.Screen
        name="QuickWorkout"
        component={ActiveWorkoutScreen}
        options={{
          title: "אימון",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="fitness" size={size} color={color} />
          ),
        }}
      />

      {/* Main/Home */}
      <Tab.Screen
        name="Main"
        component={MainScreen}
        options={{
          title: "בית",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
