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
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../styles/theme";
import { RegisterForm } from "../components/RegisterForm";
import { AuthStackParamList } from "../navigation/AuthNavigator";

// טיפוס לניווט
type RegisterScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  "Register"
>;

type RegisterScreenRouteProp = RouteProp<AuthStackParamList, "Register">;

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const route = useRoute<RegisterScreenRouteProp>();

  // Check if coming from questionnaire
  const fromQuestionnaire = route.params?.fromQuestionnaire;
  console.log(
    `🔍 New RegisterScreen - fromQuestionnaire: ${fromQuestionnaire}`
  );

  // חזרה למסך הקודם
  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // מעבר למסך הבית אחרי הרשמה מוצלחת
  const handleRegisterSuccess = useCallback(() => {
    console.log(
      `🔍 handleRegisterSuccess called - fromQuestionnaire: ${fromQuestionnaire}`
    );

    if (fromQuestionnaire) {
      // If coming from questionnaire, navigate to main app
      navigation.reset({
        index: 0,
        routes: [{ name: "MainApp" as any }],
      });
    } else {
      // Otherwise, navigate to questionnaire
      navigation.reset({
        index: 0,
        routes: [{ name: "Questionnaire" as any }],
      });
    }
  }, [navigation, fromQuestionnaire]);

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
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Ionicons name="chevron-back" size={28} color={theme.colors.text} />
          </TouchableOpacity>

          {/* כותרת וסמל */}
          <View style={styles.headerContainer}>
            <Image
              source={require("../../../../assets/barbell.png")}
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
