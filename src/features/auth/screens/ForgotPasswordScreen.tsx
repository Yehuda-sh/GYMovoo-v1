/**
 * @file ForgotPasswordScreen.tsx
 * @description מסך שחזור סיסמה לאפליקציה
 */

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { theme } from "../../../styles/theme";
import { AuthStackParamList } from "../navigation/AuthNavigator";

// טיפוס לניווט
type ForgotPasswordScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  "ForgotPassword"
>;

export const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  // חזרה למסך הקודם
  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // שליחת הוראות איפוס סיסמה
  const handleSendResetInstructions = useCallback(async () => {
    // ניקוי שגיאות קודמות
    setError(null);

    // בדיקה בסיסית שהוזן אימייל
    if (!email || !email.includes("@")) {
      setError("נא להזין כתובת אימייל תקינה");
      return;
    }

    // סימולציית שליחת הוראות איפוס
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);

    // סימולציית הצלחה
    setEmailSent(true);

    // הודעת הצלחה
    Alert.alert(
      "הוראות נשלחו",
      `הוראות לאיפוס הסיסמה נשלחו לכתובת ${email}. יש לבדוק את תיבת הדואר הנכנס ולעקוב אחר ההוראות.`,
      [{ text: "הבנתי", style: "default" }]
    );
  }, [email]);

  // מעבר למסך התחברות
  const handleBackToLogin = useCallback(() => {
    // @ts-expect-error - נתעלם מבעיית טיפוסים כרגע
    navigation.navigate("Login");
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        {/* כפתור חזרה */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Ionicons name="chevron-back" size={28} color={theme.colors.text} />
        </TouchableOpacity>

        {/* כותרת והוראות */}
        <View style={styles.headerContainer}>
          <Ionicons
            name="lock-open-outline"
            size={80}
            color={theme.colors.primary}
            style={styles.icon}
          />
          <Text style={styles.title}>שחזור סיסמה</Text>
          <Text style={styles.subtitle}>
            הזן את כתובת האימייל שלך ואנו נשלח לך הוראות לאיפוס הסיסמה
          </Text>
        </View>

        {/* טופס שחזור סיסמה */}
        <View style={styles.formContainer}>
          {/* הזנת אימייל */}
          <View style={styles.inputContainer}>
            <View style={[styles.inputWrapper, error && styles.inputError]}>
              <Ionicons
                name="mail-outline"
                size={22}
                color={theme.colors.textSecondary}
                style={styles.iconMargin}
              />
              <TextInput
                style={styles.input}
                placeholder="כתובת אימייל"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (error) setError(null);
                }}
                textAlign="right"
                editable={!loading && !emailSent}
              />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>

          {/* כפתור שליחה */}
          <TouchableOpacity
            style={[
              styles.sendButton,
              (loading || emailSent) && styles.buttonDisabled,
            ]}
            onPress={handleSendResetInstructions}
            disabled={loading || emailSent}
          >
            <LinearGradient
              colors={[theme.colors.primary, `${theme.colors.primary}DD`]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientButton}
            >
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={styles.buttonText}>שולח הוראות...</Text>
                </View>
              ) : emailSent ? (
                <View style={styles.loadingContainer}>
                  <Ionicons name="checkmark-circle" size={20} color="#fff" />
                  <Text style={styles.buttonText}>הוראות נשלחו</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>שלח הוראות לאיפוס</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* חזרה למסך התחברות */}
          <TouchableOpacity
            style={styles.backToLoginButton}
            onPress={handleBackToLogin}
          >
            <Text style={styles.backToLoginText}>חזרה למסך התחברות</Text>
          </TouchableOpacity>
        </View>

        {/* הערה */}
        <Text style={styles.noteText}>
          אם אינך מקבל את האימייל, בדוק גם בתיקיית דואר הזבל
        </Text>
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
    paddingHorizontal: theme.spacing.lg,
  },
  backButton: {
    alignSelf: "flex-start",
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  icon: {
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
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  inputWrapper: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: theme.colors.backgroundAlt,
    borderRadius: theme.radius.xl,
    paddingHorizontal: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder + "40",
    height: 58,
  },
  inputError: {
    borderColor: theme.colors.error,
    borderWidth: 2,
  },
  input: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 16,
    textAlign: "right",
    paddingVertical: 0,
    marginEnd: 8,
  },
  iconMargin: {
    marginStart: theme.spacing.sm,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 13,
    marginTop: 6,
    textAlign: "right",
    marginEnd: 4,
  },
  sendButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    borderRadius: theme.radius.xl,
    overflow: "hidden",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  gradientButton: {
    paddingVertical: 18,
    alignItems: "center",
    minHeight: 56,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  loadingContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
  },
  backToLoginButton: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  backToLoginText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  noteText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: "auto",
    marginBottom: theme.spacing.xl,
  },
});
