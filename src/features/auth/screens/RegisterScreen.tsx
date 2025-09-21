/**
 * @file RegisterScreen.tsx
 * @description מסך הרשמה לאפליקציה
 */

import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../core/theme";
import { RegisterForm } from "../components/RegisterForm";
import { AuthStackParamList } from "../navigation/AuthNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";

// טיפוס לניווט
type RegisterScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  "Register"
>;

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  // חזרה למסך הקודם
  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // מעבר למסך הנכון אחרי הרשמה מוצלחת
  const handleRegisterSuccess = useCallback(async () => {
    try {
      // בדיקה ישירה אם יש שאלון שנשמר ב-AsyncStorage
      const savedQuestionnaire = await AsyncStorage.getItem(
        "smart_questionnaire_results"
      );
      const hasCompletedQuestionnaire = !!(
        savedQuestionnaire &&
        JSON.parse(savedQuestionnaire)?.metadata?.completedAt
      );

      if (hasCompletedQuestionnaire) {
        // השאלון הושלם - עבור ישירות למסך הראשי
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (navigation as any).reset({
          index: 0,
          routes: [{ name: "MainApp" }],
        });
      } else {
        // השאלון לא הושלם - עבור לשאלון
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (navigation as any).reset({
          index: 0,
          routes: [{ name: "Questionnaire" }],
        });
      }
    } catch (error) {
      // במקרה של שגיאה, עבור לשאלון כברירת מחדל
      console.error("Error checking questionnaire completion:", error);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (navigation as any).reset({
        index: 0,
        routes: [{ name: "Questionnaire" }],
      });
    }
  }, [navigation]);

  // מעבר למסך התחברות
  const handleLoginPress = useCallback(() => {
    navigation.navigate("Login");
  }, [navigation]);

  // מעבר למסך תנאי שימוש
  const handleTermsPress = useCallback(() => {
    navigation.navigate("Terms", { type: "terms" });
  }, [navigation]);

  // מעבר למסך מדיניות פרטיות
  const handlePrivacyPress = useCallback(() => {
    navigation.navigate("Terms", { type: "privacy" });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* כפתור חזרה */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
            hitSlop={{ top: 15, bottom: 15, start: 15, end: 15 }}
          >
            <Ionicons name="chevron-back" size={28} color={theme.colors.text} />
          </TouchableOpacity>

          {/* כותרת וסמל */}
          <View style={styles.headerContainer}>
            <Image
              source={{ uri: "../../../../assets/barbell.png" }}
              style={styles.logo}
            />
            <Text style={styles.title}>הרשמה</Text>
            <Text style={styles.subtitle}>
              הצטרף אלינו והתחל לנהל את האימונים שלך בדרך חכמה יותר
            </Text>
          </View>

          {/* טופס הרשמה */}
          <View style={styles.formContainer}>
            <RegisterForm
              onRegisterSuccess={handleRegisterSuccess}
              onLoginPress={handleLoginPress}
              onTermsPress={handleTermsPress}
              onPrivacyPress={handlePrivacyPress}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.lg,
  },
  backButton: {
    alignSelf: "flex-start",
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginHorizontal: theme.spacing.xl,
  },
  formContainer: {
    width: "100%",
  },
});
