/**
 * @file src/screens/auth/LoginScreen.tsx
 * @description מסך התחברות משודרג - אימות מתקדם, אנימציות, זכור אותי, שחזור סיסמה
 * English: Enhanced login screen with advanced validation, animations, remember me, password recovery
 * @dependencies BackButton, theme, authService, userStore, RootStackParamList
 * @notes כולל אנימציות shake, fade ו-scale, טיפול ב-route params לאוטומציה, תמיכה מלאה ב-RTL
 * @recurring_errors וודא שה-navigation ו-route types תואמים, השתמש ב-theme בלבד
 * @updated 2025-07-30 שיפור RTL, אנימציות מתקדמות, תמיכה ב-global navigation types
 */

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  Switch,
  Alert,
  ScrollView,
} from "react-native";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "../../styles/theme";
import BackButton from "../../components/common/BackButton";
import { fakeGoogleSignIn } from "../../services/authService";
import { useUserStore } from "../../stores/userStore";
import {
  useNavigation,
  useRoute,
  NavigationProp,
  RouteProp,
} from "@react-navigation/native";
import type { RootStackParamList } from "../../navigation/types";

// פונקציות עזר לאנימציות // Animation helper functions
/**
 * יוצר אנימציית רעידה לאלמנט
 * Creates shake animation for element
 */
const createShakeAnimation = (value: Animated.Value) => {
  return Animated.sequence([
    Animated.timing(value, {
      toValue: 10,
      duration: 50,
      useNativeDriver: true,
    }),
    Animated.timing(value, {
      toValue: -10,
      duration: 50,
      useNativeDriver: true,
    }),
    Animated.timing(value, {
      toValue: 10,
      duration: 50,
      useNativeDriver: true,
    }),
    Animated.timing(value, { toValue: 0, duration: 50, useNativeDriver: true }),
  ]);
};

export default function LoginScreen() {
  const navigation =
    useNavigation<NavigationProp<RootStackParamList, "Login">>();
  const route = useRoute<RouteProp<RootStackParamList, "Login">>();

  console.log("🔐 LoginScreen - Component mounted");

  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  // אנימציות // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // טעינת פרטים שמורים // Load saved credentials
    console.log("🔐 LoginScreen - useEffect triggered");
    loadSavedCredentials();

    // אנימציית כניסה משופרת // Enhanced entry animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800, // זמן ארוך יותר לחוויה חלקה
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start(() => {
      console.log("🔐 LoginScreen - Entry animation completed");
    });

    // הפעלת Google אוטומטי אם הגיע עם google: true
    if (route?.params?.google) {
      console.log(
        "🔐 LoginScreen - Auto Google login triggered from route params"
      );
      handleGoogleAuth();
    }
  }, [route?.params?.google]);

  /**
   * טוען פרטי התחברות שמורים מ-AsyncStorage
   * Loads saved credentials from AsyncStorage
   */
  const loadSavedCredentials = async () => {
    try {
      console.log("🔐 LoginScreen - Loading saved credentials...");
      const savedEmail = await AsyncStorage.getItem("savedEmail");
      if (savedEmail) {
        console.log("🔐 LoginScreen - Found saved email:", savedEmail);
        setEmail(savedEmail);
        setRememberMe(true);
      } else {
        console.log("🔐 LoginScreen - No saved credentials found");
      }
    } catch (error) {
      console.error("🔐 LoginScreen - Failed to load saved email:", error);
    }
  };

  /**
   * בודק תקינות כתובת אימייל
   * Validates email format
   */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * בודק תקינות סיסמה
   * Validates password requirements
   */
  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  /**
   * בודק תקינות כל הטופס
   * Validates entire form
   */
  const validateForm = (): boolean => {
    console.log("🔐 LoginScreen - Validating form...");
    const errors: typeof fieldErrors = {};

    if (!email) {
      errors.email = "אנא הזן כתובת אימייל";
    } else if (!validateEmail(email)) {
      errors.email = "כתובת אימייל לא תקינה";
    }

    if (!password) {
      errors.password = "אנא הזן סיסמה";
    } else if (!validatePassword(password)) {
      errors.password = "הסיסמה חייבת להכיל לפחות 6 תווים";
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      console.log("🔐 LoginScreen - Validation failed:", errors);
      createShakeAnimation(shakeAnim).start();
      return false;
    }

    console.log("🔐 LoginScreen - Validation passed ✅");
    return true;
  };

  const handleLogin = async () => {
    console.log("🔐 LoginScreen - Login attempt started");
    console.log("🔐 LoginScreen - Email:", email);
    console.log("🔐 LoginScreen - Password length:", password.length);
    console.log("🔐 LoginScreen - Remember me:", rememberMe);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setFieldErrors({});

    // אנימציית לחיצה משופרת // Enhanced press animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      // שמירת אימייל אם נבחר "זכור אותי" // Save email if remember me
      if (rememberMe) {
        console.log("🔐 LoginScreen - Saving email to AsyncStorage");
        await AsyncStorage.setItem("savedEmail", email);
      } else {
        console.log("🔐 LoginScreen - Removing saved email from AsyncStorage");
        await AsyncStorage.removeItem("savedEmail");
      }

      // סימולציית התחברות משופרת // Enhanced login simulation
      setTimeout(async () => {
        setLoading(false);
        if (email === "test@example.com" && password === "123456") {
          console.log("🔐 LoginScreen - Login successful! ✅");
          const user = {
            email,
            name: "משתמש לדוגמה",
            id: "user123",
            avatar: undefined,
          };

          // שמירה ב-Zustand // Save to Zustand
          console.log("🔐 LoginScreen - Saving user to Zustand store");
          useUserStore.getState().setUser(user);

          // בדיקה אם יש שאלון // Check if questionnaire exists
          const hasQuestionnaire = useUserStore.getState().user?.questionnaire;
          console.log(
            "🔐 LoginScreen - Has questionnaire?",
            !!hasQuestionnaire
          );

          if (!hasQuestionnaire) {
            console.log("🔐 LoginScreen - Navigating to Questionnaire");
            navigation.reset({ index: 0, routes: [{ name: "Questionnaire" }] });
          } else {
            console.log("🔐 LoginScreen - Navigating to Main");
            navigation.reset({ index: 0, routes: [{ name: "MainApp" }] });
          }
        } else {
          console.log("🔐 LoginScreen - Login failed - invalid credentials ❌");
          setError("פרטי ההתחברות שגויים. אנא בדוק את האימייל והסיסמה.");
          createShakeAnimation(shakeAnim).start();
        }
      }, 1200);
    } catch (e) {
      console.error("🔐 LoginScreen - Login error:", e);
      setLoading(false);
      setError("אירעה שגיאה בהתחברות");
    }
  };

  const handleGoogleAuth = async () => {
    console.log("🔐 LoginScreen - Google auth started");
    setLoading(true);
    setError(null);

    try {
      console.log("🔐 LoginScreen - Calling fakeGoogleSignIn...");
      const googleUser = await fakeGoogleSignIn();
      console.log("🔐 LoginScreen - Google user received:", googleUser);

      useUserStore.getState().setUser(googleUser);

      // בדיקה אם יש גיל תקין ושאלון // Check age and questionnaire
      console.log(
        "🔐 LoginScreen - Checking questionnaire:",
        googleUser.questionnaire
      );
      if (
        !googleUser.questionnaire ||
        !googleUser.questionnaire[0] ||
        googleUser.questionnaire[0] === "מתחת ל-16"
      ) {
        console.log(
          "🔐 LoginScreen - Google user needs questionnaire, navigating..."
        );
        navigation.reset({ index: 0, routes: [{ name: "Questionnaire" }] });
      } else {
        console.log(
          "🔐 LoginScreen - Google user has questionnaire, navigating to Main"
        );
        navigation.reset({ index: 0, routes: [{ name: "MainApp" }] });
      }
    } catch (e) {
      console.error("🔐 LoginScreen - Google auth failed:", e);
      setError("ההתחברות עם Google נכשלה");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    console.log("🔐 LoginScreen - Forgot password clicked");
    Alert.alert(
      "שחזור סיסמה",
      "נשלח לך קישור לאיפוס הסיסמה לכתובת האימייל שלך",
      [
        {
          text: "ביטול",
          style: "cancel",
          onPress: () =>
            console.log("🔐 LoginScreen - Password reset cancelled"),
        },
        {
          text: "שלח",
          onPress: () => {
            console.log(
              "🔐 LoginScreen - Password reset requested for:",
              email
            );
            if (!email) {
              setFieldErrors({ email: "אנא הזן כתובת אימייל לשחזור" });
              return;
            }
            if (!validateEmail(email)) {
              setFieldErrors({ email: "כתובת אימייל לא תקינה" });
              return;
            }
            console.log("🔐 LoginScreen - Password reset email sent! ✅");
            Alert.alert("נשלח!", "קישור לאיפוס סיסמה נשלח לאימייל שלך");
          },
        },
      ]
    );
  };

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.backgroundAlt]}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <BackButton />

          <Animated.View
            style={[
              styles.formBox,
              {
                opacity: fadeAnim,
                transform: [
                  { translateX: shakeAnim },
                  { translateY: slideAnim },
                ],
              },
            ]}
          >
            {/* לוגו // Logo */}
            <View style={styles.logoContainer}>
              <View style={styles.logoBackground}>
                <MaterialCommunityIcons
                  name="dumbbell"
                  size={48}
                  color={theme.colors.primary}
                />
              </View>
            </View>

            {/* כותרות // Titles */}
            <Text style={styles.title}>ברוך הבא חזרה!</Text>
            <Text style={styles.subtitle}>התחבר כדי להמשיך באימונים שלך</Text>

            {/* שדה אימייל // Email field */}
            <View style={styles.inputContainer}>
              <View
                style={[
                  styles.inputWrapper,
                  fieldErrors.email && styles.inputError,
                ]}
              >
                <MaterialCommunityIcons
                  name="email-outline"
                  size={24}
                  color={
                    fieldErrors.email
                      ? theme.colors.error
                      : theme.colors.textSecondary
                  }
                  style={{ marginEnd: 8 }} // שינוי RTL: marginEnd במקום marginStart
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
                    setFieldErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  textAlign="right"
                  editable={!loading}
                />
              </View>
              {fieldErrors.email && (
                <Text style={styles.fieldError}>{fieldErrors.email}</Text>
              )}
            </View>

            {/* שדה סיסמה // Password field */}
            <View style={styles.inputContainer}>
              <View
                style={[
                  styles.inputWrapper,
                  fieldErrors.password && styles.inputError,
                ]}
              >
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  style={styles.passwordToggle}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={24}
                    color={
                      fieldErrors.password
                        ? theme.colors.error
                        : theme.colors.textSecondary
                    }
                  />
                </TouchableOpacity>
                <TextInput
                  style={styles.input}
                  placeholder="סיסמה"
                  placeholderTextColor={theme.colors.textSecondary}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setFieldErrors((prev) => ({
                      ...prev,
                      password: undefined,
                    }));
                  }}
                  textAlign="right"
                  editable={!loading}
                />
              </View>
              {fieldErrors.password && (
                <Text style={styles.fieldError}>{fieldErrors.password}</Text>
              )}
            </View>

            {/* זכור אותי ושכחתי סיסמה // Remember me & Forgot password */}
            <View style={styles.optionsRow}>
              <View style={styles.rememberMe}>
                <Text style={styles.rememberMeText}>זכור אותי</Text>
                <Switch
                  value={rememberMe}
                  onValueChange={setRememberMe}
                  trackColor={{
                    false: theme.colors.divider,
                    true: theme.colors.primary + "50",
                  }}
                  thumbColor={
                    rememberMe ? theme.colors.primary : theme.colors.card
                  }
                  disabled={loading}
                />
              </View>
              <TouchableOpacity
                onPress={handleForgotPassword}
                disabled={loading}
              >
                <Text style={styles.forgotPassword}>שכחתי סיסמה</Text>
              </TouchableOpacity>
            </View>

            {/* הודעת שגיאה כללית // General error message */}
            {error && (
              <Animated.View
                style={[
                  styles.errorContainer,
                  { transform: [{ scale: scaleAnim }] },
                ]}
              >
                <MaterialCommunityIcons
                  name="alert-circle"
                  size={18}
                  color={theme.colors.error}
                />
                <Text style={styles.errorText}>{error}</Text>
              </Animated.View>
            )}

            {/* כפתור התחברות // Login button */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                loading && styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[
                  theme.colors.primaryGradientStart,
                  theme.colors.primaryGradientEnd,
                ]}
                style={styles.gradientButton}
              >
                {loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator color="#fff" size="small" />
                    <Text style={styles.loadingText}>מתחבר...</Text>
                  </View>
                ) : (
                  <Text style={styles.loginButtonText}>התחבר</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* או // OR */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>או</Text>
              <View style={styles.divider} />
            </View>

            {/* כפתור Google // Google button */}
            <TouchableOpacity
              style={[
                styles.googleButton,
                loading && styles.googleButtonDisabled,
              ]}
              onPress={handleGoogleAuth}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#DB4437" />
              ) : (
                <Ionicons name="logo-google" size={20} color="#DB4437" />
              )}
              <Text style={styles.googleButtonText}>
                {loading ? "מתחבר עם Google..." : "התחבר עם Google"}
              </Text>
            </TouchableOpacity>

            {/* קישור להרשמה // Registration link */}
            <View style={styles.linkRow}>
              <Text style={styles.linkText}>אין לך חשבון עדיין?</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Register")}
                disabled={loading}
              >
                <Text style={styles.registerLink}>הרשם עכשיו</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
    paddingTop: Platform.OS === "ios" ? 80 : 60,
  },
  formBox: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    ...theme.shadows.medium,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  logoBackground: {
    backgroundColor: theme.colors.primaryGradientStart + "15",
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    ...theme.shadows.small,
  },
  title: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: theme.spacing.sm,
    writingDirection: "rtl",
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: 16,
    textAlign: "center",
    marginBottom: theme.spacing.xl,
    lineHeight: 22,
    writingDirection: "rtl",
  },
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  inputWrapper: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: theme.colors.backgroundAlt,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    height: 56,
    ...theme.shadows.small,
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
    marginHorizontal: 0,
    marginEnd: 8, // שינוי RTL: marginEnd במקום marginStart
  },
  passwordToggle: {
    padding: 4,
  },
  fieldError: {
    color: theme.colors.error,
    fontSize: 13,
    marginTop: 6,
    textAlign: "right",
    marginEnd: 4, // שינוי RTL: marginEnd במקום marginRight
  },
  optionsRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  rememberMe: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginEnd: 8, // שינוי RTL: marginEnd במקום marginStart
  },
  rememberMeText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: "500",
  },
  forgotPasswordButton: {
    padding: 4, // אזור מגע גדול יותר
  },
  forgotPassword: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  errorContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: theme.colors.error + "15",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 8, // מתקדם - gap מתוך theme
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },
  loginButton: {
    marginBottom: 20,
    borderRadius: theme.radius.lg,
    overflow: "hidden",
    ...theme.shadows.medium,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  dividerContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.divider,
  },
  dividerText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    marginHorizontal: 16,
  },
  googleButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    paddingVertical: 16,
    justifyContent: "center",
    marginBottom: theme.spacing.lg,
    gap: 10,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...theme.shadows.small,
  },
  googleButtonDisabled: {
    opacity: 0.7,
  },
  googleButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  linkRow: {
    flexDirection: "row-reverse",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  linkText: {
    color: theme.colors.textSecondary,
    fontSize: 15,
  },
  registerLink: {
    color: theme.colors.primary,
    fontWeight: "600",
    fontSize: 15,
  },
});
