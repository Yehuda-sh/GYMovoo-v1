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
import UnifiedQuestionnaireScreen from "../screens/questionnaire/UnifiedQuestionnaireScreen";
// מסכי אימון // Workout screens
import WorkoutPlanScreen from "../screens/workout/WorkoutPlansScreen";
import ActiveWorkoutScreen from "../screens/workout/ActiveWorkoutScreen";

// מסכים נוספים שלא ב-Bottom Tabs // Additional screens not in Bottom Tabs
import ExerciseListScreen from "../screens/exercise/ExerciseListScreen";

// מסכים חדשים שנוספו
import NotificationsScreen from "../screens/notifications/NotificationsScreen";
import ProgressScreen from "../screens/progress/ProgressScreen";
import ExercisesScreen from "../screens/exercises/ExercisesScreen";
import ExerciseDetailsScreen from "../screens/exercises/ExerciseDetailsScreen";

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
          component={UnifiedQuestionnaireScreen}
          options={{
            headerShown: false,
            gestureEnabled: false, // השבת gesture למניעת יציאה בטעות
            presentation: "card", // החלפה מ-modal ל-card
          }}
        />

        {/* מסך תוכנית אימון חכמה עם AI */}
        <Stack.Screen name="WorkoutPlan" component={WorkoutPlanScreen} />

        {/* אפליקציה ראשית עם Bottom Tabs - ניווט מתקדם */}
        <Stack.Screen
          name="MainApp"
          component={BottomNavigation}
          options={{
            gestureEnabled: false, // מונע יציאה מהאפליקציה הראשית
          }}
        />

        {/* מסך אימון יחיד פעיל - טיפול בתרגיל יחיד */}
        <Stack.Screen
          name="ActiveWorkout"
          component={ActiveWorkoutScreen}
          options={{
            gestureEnabled: false, // מונע יציאה בטעות מאימון פעיל
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
            cardStyle: {
              backgroundColor: "rgba(0,0,0,0.5)", // רקע כהה למודל
            },
          }}
        />

        {/* מסכים נוספים משופרים עם חוויית משתמש מתקדמת */}
        <Stack.Screen name="Notifications" component={NotificationsScreen} />

        <Stack.Screen
          name="Progress"
          component={ProgressScreen}
          options={{
            cardStyle: {
              backgroundColor: "rgba(248, 250, 252, 1)", // רקע בהיר לחוויה טובה יותר
            },
          }}
        />

        {/* מסך פרטי תרגיל מפורט */}
        <Stack.Screen
          name="ExerciseDetails"
          component={ExerciseDetailsScreen}
          options={{
            presentation: "card", // פתיחה כמסך מלא
            cardStyle: {
              backgroundColor: "rgba(248, 250, 252, 1)", // רקע בהיר
            },
          }}
        />

        {/* מסך ספריית תרגילים עם סינון (יחיד – מנקה כפילות) */}
        <Stack.Screen
          name="ExercisesScreen"
          component={ExercisesScreen}
          options={{
            freezeOnBlur: true, // חיסכון בביצועים
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
