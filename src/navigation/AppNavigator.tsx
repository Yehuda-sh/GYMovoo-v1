import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// ניווט תחתון // Bottom navigation
import BottomNavigation from "./BottomNavigation";

// טיפוסי ניווט
import { RootStackParamList } from "./types";

// מסכי Onboarding ו-Auth // Onboarding and Auth screens
import WelcomeScreen from "../screens/welcome/WelcomeScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import TermsScreen from "../screens/auth/TermsScreen";

// שאלון חכם מתקדם עם AI // Advanced smart questionnaire with AI
import SmartQuestionnaireScreen from "../screens/questionnaire/SmartQuestionnaireScreen";
// מסכי אימון // Workout screens
import WorkoutPlanScreen from "../screens/workout/WorkoutPlansScreen";
import QuickWorkoutScreen from "../screens/workout/QuickWorkoutScreen";

// מסכים נוספים שלא ב-Bottom Tabs // Additional screens not in Bottom Tabs
import ExerciseListScreen from "../screens/exercise/ExerciseListScreen";

// מסכים חדשים שנוספו
import NotificationsScreen from "../screens/notifications/NotificationsScreen";
import ProgressScreen from "../screens/progress/ProgressScreen";
import ExercisesScreen from "../screens/exercises/ExercisesScreen";

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: "horizontal-inverted", // RTL תמיכה
          animationTypeForReplace: "push",
          // אנימציות חלקות יותר
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            };
          },
          // אופטימיזציית ביצועים
          detachPreviousScreen: false,
        }}
      >
        {/* מסכי התחברות ורישום עם אבטחה מתקדמת */}
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{
            gestureEnabled: false, // מונע יציאה מהמסך הראשון
            // אנימציה מיוחדת למסך הפתיחה
            animationTypeForReplace: "pop",
          }}
        />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Terms" component={TermsScreen} />

        {/* שאלון חכם מתקדם עם AI ואינסייטים */}
        <Stack.Screen
          name="Questionnaire"
          component={SmartQuestionnaireScreen}
          options={{
            headerShown: false,
            presentation: "modal",
            gestureDirection: "vertical", // סגירה למטה
            gestureResponseDistance: 200, // מרחק גרירה לסגירה
          }}
        />

        {/* מסך תוכנית אימון חכמה עם AI */}
        <Stack.Screen
          name="WorkoutPlan"
          component={WorkoutPlanScreen}
          options={{
            presentation: "card",
            gestureDirection: "horizontal-inverted", // RTL
            animationTypeForReplace: "push",
            headerShown: false,
          }}
        />

        {/* אפליקציה ראשית עם Bottom Tabs - ניווט מתקדם */}
        <Stack.Screen
          name="MainApp"
          component={BottomNavigation}
          options={{
            gestureEnabled: false, // מונע יציאה מהאפליקציה הראשית
            // אנימציה מיוחדת לכניסה לאפליקציה
            animationTypeForReplace: "pop",
          }}
        />

        {/* מסך אימון פעיל מתקדם עם מעקב חכם */}
        <Stack.Screen
          name="QuickWorkout"
          component={QuickWorkoutScreen}
          options={{
            gestureEnabled: false, // מונע יציאה בטעות מאימון פעיל
            presentation: "card",
            headerShown: false,
            // אנימציה מיוחדת לכניסה לאימון
            animationTypeForReplace: "push",
            cardStyle: {
              backgroundColor: "transparent", // רקע שקוף לאנימציות חלקות
            },
          }}
        />

        {/* מסך רשימת תרגילים מתקדם עם WGER API */}
        <Stack.Screen
          name="ExerciseList"
          component={ExerciseListScreen}
          options={{
            presentation: "modal", // פתיחה כמודל
            gestureDirection: "vertical", // סגירה למטה
            headerShown: false,
            // אנימציה חלקה למעלה
            cardStyle: {
              backgroundColor: "rgba(0,0,0,0.5)", // רקע כהה למודל
            },
          }}
        />

        {/* מסכים נוספים משופרים עם חוויית משתמש מתקדמת */}
        <Stack.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{
            presentation: "card",
            gestureDirection: "horizontal-inverted", // RTL
            headerShown: false,
            // אנימציה חלקה
            animationTypeForReplace: "push",
          }}
        />

        <Stack.Screen
          name="Progress"
          component={ProgressScreen}
          options={{
            presentation: "card",
            gestureDirection: "horizontal-inverted", // RTL
            headerShown: false,
            // רקע מותאם לגרפים
            cardStyle: {
              backgroundColor: "rgba(248, 250, 252, 1)", // רקע בהיר לחוויה טובה יותר
            },
          }}
        />

        <Stack.Screen
          name="Exercises"
          component={ExercisesScreen}
          options={{
            presentation: "card",
            gestureDirection: "horizontal-inverted", // RTL
            headerShown: false,
            // אופטימיזציה לרשימות גדולות
            freezeOnBlur: true, // חיסכון בביצועים
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
