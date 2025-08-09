/**
 * @file src/screens/auth/LoginScreen.tsx
 * @description מסך התחברות משודרג - אימות מתקדם, אנימציות, זכור אותי, שחזור סיסמה
 * English: Enhanced login screen with advanced validation, animations, remember me, password recovery
 * @dependencies BackButton, theme, authService, userStore, RootStackParamList
 * @notes כולל אנימציות shake, fade ו-scale, טיפול ב-route params לאוטומציה, תמיכה מלאה ב-RTL
 * @recurring_errors וודא שה-navigation ו-route types תואמים, השתמש ב-theme בלבד
 * @updated 2025-07-30 שיפור RTL, אנימציות מתקדמות, תמיכה ב-global navigation types
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
  Switch,
  Alert,
  ScrollView,
  Pressable,
} from "react-native";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "../../styles/theme";
import BackButton from "../../components/common/BackButton";
import { fakeGoogleSignIn } from "../../services/authService";
import type { User } from "../../services/authService";
import { useUserStore } from "../../stores/userStore";
import {
  useNavigation,
  useRoute,
  NavigationProp,
  RouteProp,
} from "@react-navigation/native";
import type { RootStackParamList } from "../../navigation/types";
import {
  validateEmail,
  validateLoginForm,
  AUTH_STRINGS,
  LoginFieldErrors,
} from "../../utils/authValidation";

// Local strings object centralizing repeated literals (Hebrew only for now)
const STRINGS = {
  placeholders: {
    email: "כתובת אימייל",
    password: "סיסמה",
  },
  buttons: {
    login: "התחבר",
    loggingIn: "מתחבר...",
    google: "התחבר עם Google",
    googleLoading: "מתחבר עם Google...",
    forgotPassword: "שכחתי סיסמה",
    registerNow: "הרשם עכשיו",
  },
  ui: {
    or: "או",
    rememberMe: "זכור אותי",
    welcomeBack: "ברוך הבא חזרה!",
    subtitle: "התחבר כדי להמשיך באימונים שלך",
    noAccount: "אין לך חשבון עדיין?",
    pwdResetTitle: "שחזור סיסמה",
    pwdResetMsg: "נשלח לך קישור לאיפוס הסיסמה לכתובת האימייל שלך",
    sent: "נשלח!",
    sentMsg: "קישור לאיפוס סיסמה נשלח לאימייל שלך",
    cancel: "ביטול",
    send: "שלח",
  },
  accessibility: {
    emailInput: "שדה אימייל",
    passwordInput: "שדה סיסמה",
    togglePassword: "הצג או הסתר סיסמה",
    loginButton: "כפתור התחברות",
    googleButton: "כפתור התחברות עם גוגל",
    rememberMeSwitch: "זכור אותי מתג",
    forgotPassword: "כפתור שחזור סיסמה",
    registerLink: "קישור להרשמה",
    errorMessage: "הודעת שגיאה",
  },
};

// Debounce helper
const useDebouncedCallback = <T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => fn(...args), delay);
    },
    [fn, delay]
  );
};

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

  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const loading = loginLoading || googleLoading; // retained for existing disable logic
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});

  // אנימציות // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // טעינת פרטים שמורים // Load saved credentials
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
    ]).start(() => {});

    // הפעלת Google אוטומטי אם הגיע עם google: true
    if (route?.params?.google) {
      // eslint-disable-next-line no-console
      console.log(
        "🔐 LoginScreen - Auto Google login triggered from route params"
      );
      handleGoogleAuth();
    }
    // Intentionally only tracking route param trigger; animation refs stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route?.params?.google]);

  /**
   * טוען פרטי התחברות שמורים מ-AsyncStorage
   * Loads saved credentials from AsyncStorage
   */
  const loadSavedCredentials = async () => {
    try {
      const savedEmail = await AsyncStorage.getItem("savedEmail");
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      } else {
        // no saved email found
      }
    } catch (error) {
      console.error("🔐 LoginScreen - Failed to load saved email:", error);
    }
  };

  /**
   * בודק תקינות כתובת אימייל
   * Validates email format
   */
  const validateForm = (): boolean => {
    const errors = validateLoginForm(email, password);
    setFieldErrors(errors);
    if (Object.keys(errors).length) {
      createShakeAnimation(shakeAnim).start();
      return false;
    }
    return true;
  };

  const routeAfterLogin = (hasQuestionnaire: boolean) => {
    navigation.reset({
      index: 0,
      routes: [{ name: hasQuestionnaire ? "MainApp" : "Questionnaire" }],
    });
  };

  interface MinimalUser {
    email: string;
    name: string;
    id: string;
    avatar?: string | undefined;
    questionnaire?: unknown;
    questionnaireData?: unknown;
    smartQuestionnaireData?: unknown;
  }

  const handleSuccessfulLogin = (user: MinimalUser) => {
    // Cast to User (minimal required fields for store); legacy optional questionnaire fields tolerated
    useUserStore.getState().setUser(user as unknown as User);
    const hasQuestionnaire = !!(
      user?.questionnaire ||
      user?.questionnaireData ||
      user?.smartQuestionnaireData
    );
    routeAfterLogin(hasQuestionnaire);
  };

  const _handleLogin = async () => {
    if (!validateForm()) {
      return;
    }
    setLoginLoading(true);
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
      // Save only after success so moved inside success branch later

      // סימולציית התחברות משופרת // Enhanced login simulation
      setTimeout(async () => {
        setLoginLoading(false);
        if (email === "test@example.com" && password === "123456") {
          const user = {
            email: email.trim(),
            name: "משתמש לדוגמה",
            id: "user123",
            avatar: undefined,
          };
          // Persist email only if remember me after successful login
          if (rememberMe) {
            await AsyncStorage.setItem("savedEmail", email.trim());
          } else {
            await AsyncStorage.removeItem("savedEmail");
          }
          handleSuccessfulLogin(user);
        } else {
          setError(AUTH_STRINGS.errors.loginFailed);
          createShakeAnimation(shakeAnim).start();
        }
      }, 1200);
    } catch (e) {
      console.error("🔐 LoginScreen - Login error:", e);
      setLoginLoading(false);
      setError(AUTH_STRINGS.errors.generalLoginError);
    }
  };

  const handleLogin = useDebouncedCallback(_handleLogin, 350);

  const handleGoogleAuth = async () => {
    setGoogleLoading(true);
    setError(null);

    try {
      const googleUser = await fakeGoogleSignIn();

      handleSuccessfulLogin(googleUser);
    } catch (e) {
      console.error("🔐 LoginScreen - Google auth failed:", e);
      setError(AUTH_STRINGS.errors.googleFailed);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(STRINGS.ui.pwdResetTitle, STRINGS.ui.pwdResetMsg, [
      {
        text: STRINGS.ui.cancel,
        style: "cancel",
      },
      {
        text: STRINGS.ui.send,
        onPress: () => {
          if (!email) {
            setFieldErrors({ email: AUTH_STRINGS.errors.emailRequired });
            return;
          }
          if (!validateEmail(email)) {
            setFieldErrors({ email: AUTH_STRINGS.errors.emailInvalid });
            return;
          }
          Alert.alert(STRINGS.ui.sent, STRINGS.ui.sentMsg);
        },
      },
    ]);
  };

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.backgroundAlt]}
      style={styles.gradientFill}
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
            <Text
              style={styles.title}
              accessibilityRole="header"
              accessibilityLabel={STRINGS.ui.welcomeBack}
            >
              {STRINGS.ui.welcomeBack}
            </Text>
            <Text
              style={styles.subtitle}
              accessibilityLabel={STRINGS.ui.subtitle}
            >
              {STRINGS.ui.subtitle}
            </Text>

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
                  style={styles.iconMargin}
                />
                <TextInput
                  style={styles.input}
                  placeholder={STRINGS.placeholders.email}
                  placeholderTextColor={theme.colors.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setFieldErrors((prev) => ({ ...prev, email: undefined }));
                    if (error) setError(null);
                  }}
                  textAlign="right"
                  editable={!loading}
                  accessibilityLabel={STRINGS.accessibility.emailInput}
                  accessibilityHint="הזן אימייל"
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
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  style={({ pressed }) => [
                    styles.passwordToggle,
                    pressed && { opacity: 0.6 },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={STRINGS.accessibility.togglePassword}
                  accessibilityHint="הצגת או הסתרת טקסט הסיסמה"
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
                </Pressable>
                <TextInput
                  style={styles.input}
                  placeholder={STRINGS.placeholders.password}
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
                    if (error) setError(null);
                  }}
                  textAlign="right"
                  editable={!loading}
                  accessibilityLabel={STRINGS.accessibility.passwordInput}
                  accessibilityHint="הזן סיסמה"
                />
              </View>
              {fieldErrors.password && (
                <Text style={styles.fieldError}>{fieldErrors.password}</Text>
              )}
            </View>

            {/* זכור אותי ושכחתי סיסמה // Remember me & Forgot password */}
            <View style={styles.optionsRow}>
              <View style={styles.rememberMe}>
                <Text
                  style={styles.rememberMeText}
                  accessibilityRole="text"
                  accessibilityLabel={STRINGS.ui.rememberMe}
                >
                  {STRINGS.ui.rememberMe}
                </Text>
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
              <Pressable
                onPress={handleForgotPassword}
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel={STRINGS.accessibility.forgotPassword}
              >
                <Text style={styles.forgotPassword}>
                  {STRINGS.buttons.forgotPassword}
                </Text>
              </Pressable>
            </View>

            {/* הודעת שגיאה כללית // General error message */}
            {error && (
              <Animated.View
                style={[
                  styles.errorContainer,
                  { transform: [{ scale: scaleAnim }] },
                ]}
                accessibilityLiveRegion="polite"
                accessibilityRole="alert"
                accessibilityLabel={STRINGS.accessibility.errorMessage}
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
            <Pressable
              style={({ pressed }) => [
                styles.loginButton,
                (loginLoading || googleLoading) && styles.loginButtonDisabled,
                pressed && { opacity: 0.85 },
              ]}
              onPress={handleLogin}
              disabled={loginLoading || googleLoading}
              accessibilityRole="button"
              accessibilityLabel={STRINGS.accessibility.loginButton}
            >
              <LinearGradient
                colors={[
                  theme.colors.primaryGradientStart,
                  theme.colors.primaryGradientEnd,
                ]}
                style={styles.gradientButton}
              >
                {loginLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator color="#fff" size="small" />
                    <Text style={styles.loadingText}>
                      {STRINGS.buttons.loggingIn}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.loginButtonText}>
                    {STRINGS.buttons.login}
                  </Text>
                )}
              </LinearGradient>
            </Pressable>

            {/* או // OR */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>{STRINGS.ui.or}</Text>
              <View style={styles.divider} />
            </View>

            {/* כפתור Google // Google button */}
            <Pressable
              style={({ pressed }) => [
                styles.googleButton,
                googleLoading && styles.googleButtonDisabled,
                pressed && { opacity: 0.85 },
              ]}
              onPress={handleGoogleAuth}
              disabled={googleLoading || loginLoading}
              accessibilityRole="button"
              accessibilityLabel={STRINGS.accessibility.googleButton}
            >
              {googleLoading ? (
                <ActivityIndicator size="small" color="#DB4437" />
              ) : (
                <Ionicons name="logo-google" size={20} color="#DB4437" />
              )}
              <Text style={styles.googleButtonText}>
                {googleLoading
                  ? STRINGS.buttons.googleLoading
                  : STRINGS.buttons.google}
              </Text>
            </Pressable>

            {/* קישור להרשמה // Registration link */}
            <View style={styles.linkRow}>
              <Text style={styles.linkText}>{STRINGS.ui.noAccount}</Text>
              <Pressable
                onPress={() => navigation.navigate("Register")}
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel={STRINGS.accessibility.registerLink}
              >
                <Text style={styles.registerLink}>
                  {STRINGS.buttons.registerNow}
                </Text>
              </Pressable>
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
  iconMargin: { marginEnd: 8 },
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
  gradientFill: { flex: 1 },
});
