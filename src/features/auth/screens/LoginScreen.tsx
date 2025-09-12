/**
 * @file LoginScreen.tsx
 * @description מסך התחברות לאפליקציה
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
import { LoginForm } from "../components/LoginForm";
import { AuthStackParamList } from "../navigation/AuthNavigator";

// טיפוס לניווט
type LoginScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  "Login"
>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  // חזרה למסך הקודם
  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // מעבר למסך שכחתי סיסמה
  const handleForgotPassword = useCallback(() => {
    navigation.navigate("ForgotPassword");
  }, [navigation]);

  // מעבר למסך הרשמה
  const handleRegister = useCallback(() => {
    navigation.navigate("Register", {});
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
              source={{ uri: "../../../../assets/barbell.png" }}
              style={styles.logo}
            />
            <Text style={styles.title}>התחברות</Text>
            <Text style={styles.subtitle}>
              ברוכים השבים! התחבר לחשבונך והמשך מהיכן שעצרת
            </Text>
          </View>

          {/* טופס התחברות */}
          <View style={styles.formContainer}>
            <LoginForm
              onLoginSuccess={() => {}}
              onForgotPassword={handleForgotPassword}
              onRegisterPress={handleRegister}
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
