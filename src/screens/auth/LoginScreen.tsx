/**
 * LoginScreen - מסך התחברות פשוט ופונקציונלי
 */

import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Switch,
  ScrollView,
  Pressable,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageKeys } from "../../constants/StorageKeys";
import { logger } from "../../utils/logger";
import { theme } from "../../styles/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../components/common/BackButton";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ConfirmationModal from "../../components/common/ConfirmationModal";
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
  FormErrors,
} from "../../utils/authValidation";

const TEST_CREDENTIALS = {
  EMAIL: "test@example.com",
  PASSWORD: "123456",
  USER_ID: "user123",
};

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
  errors: {
    loginFailed: "פרטי ההתחברות שגויים",
    generalLoginError: "שגיאה בהתחברות",
    googleFailed: "ההתחברות עם Google נכשלה",
    emailRequired: "אנא הזן כתובת אימייל",
    emailInvalid: "פורמט אימייל לא תקין",
  },
};

const LoginScreen = () => {
  const navigation =
    useNavigation<NavigationProp<RootStackParamList, "Login">>();
  const route = useRoute<RouteProp<RootStackParamList, "Login">>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  const [confirmationModal, setConfirmationModal] = useState<{
    visible: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "error" | "success" | "warning" | "info";
    singleButton?: boolean;
  }>({
    visible: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const loading = loginLoading || googleLoading;

  useEffect(() => {
    loadSavedCredentials();

    // הפעלת Google אוטומטי אם הגיע עם google: true
    if (route?.params?.google) {
      handleGoogleAuth();
    }
  }, [route?.params?.google]);

  const loadSavedCredentials = async () => {
    try {
      const savedEmail = await AsyncStorage.getItem(StorageKeys.LAST_EMAIL);
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    } catch (error) {
      logger.error("LoginScreen", "Failed to load saved email", error);
    }
  };

  const validateForm = (): boolean => {
    const validation = validateLoginForm(email, password);
    setFieldErrors(validation);
    return Object.keys(validation).length === 0;
  };

  const routeAfterLogin = (hasQuestionnaire: boolean) => {
    navigation.reset({
      index: 0,
      routes: [{ name: hasQuestionnaire ? "MainApp" : "Questionnaire" }],
    });
  };

  const handleSuccessfulLogin = (user: User) => {
    useUserStore.getState().setUser(user);

    const hasQuestionnaire = !!(user?.questionnaire || user?.questionnaireData);
    routeAfterLogin(hasQuestionnaire);
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoginLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      // סימולציית התחברות
      setTimeout(async () => {
        setLoginLoading(false);

        if (
          email === TEST_CREDENTIALS.EMAIL &&
          password === TEST_CREDENTIALS.PASSWORD
        ) {
          const user = {
            email: email.trim(),
            name: "משתמש לדוגמה",
            id: TEST_CREDENTIALS.USER_ID,
            avatar: "",
            provider: "manual" as const,
            metadata: {},
          };

          // שמירת אימייל אם נבחר "זכור אותי"
          if (rememberMe) {
            await AsyncStorage.setItem(StorageKeys.LAST_EMAIL, email.trim());
          } else {
            await AsyncStorage.removeItem(StorageKeys.LAST_EMAIL);
          }

          await AsyncStorage.removeItem("user_logged_out");
          handleSuccessfulLogin(user as User);
        } else {
          setError(STRINGS.errors.loginFailed);
        }
      }, 1000);
    } catch (e) {
      logger.error("LoginScreen", "Login error", e);
      setLoginLoading(false);
      setError(STRINGS.errors.generalLoginError);
    }
  };

  const handleGoogleAuth = async () => {
    setGoogleLoading(true);
    setError(null);

    try {
      const googleUser = await fakeGoogleSignIn();
      await AsyncStorage.removeItem("user_logged_out");
      handleSuccessfulLogin(googleUser);
    } catch (e) {
      logger.error("LoginScreen", "Google auth failed", e);
      const isDevAuthDisabled =
        e instanceof Error && e.message.includes("Dev auth disabled");
      const errorMessage = isDevAuthDisabled
        ? "התחברות Google זמינה רק בסביבת פיתוח"
        : STRINGS.errors.googleFailed;
      setError(errorMessage);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setConfirmationModal({
      visible: true,
      title: STRINGS.ui.pwdResetTitle,
      message: STRINGS.ui.pwdResetMsg,
      confirmText: STRINGS.ui.send,
      cancelText: STRINGS.ui.cancel,
      variant: "info",
      onConfirm: () => {
        if (!email) {
          setFieldErrors({ email: STRINGS.errors.emailRequired });
          return;
        }
        if (!validateEmail(email)) {
          setFieldErrors({ email: STRINGS.errors.emailInvalid });
          return;
        }
        setConfirmationModal({
          visible: true,
          title: STRINGS.ui.sent,
          message: STRINGS.ui.sentMsg,
          confirmText: "אישור",
          variant: "success",
          singleButton: true,
          onConfirm: () => {},
        });
      },
      onCancel: () => {},
    });
  };

  const hideConfirmationModal = () =>
    setConfirmationModal({
      visible: false,
      title: "",
      message: "",
      onConfirm: () => {},
    });

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "right", "left", "bottom"]}
    >
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
            <BackButton loading={loading} />

            <View style={styles.formBox}>
              {/* לוגו */}
              <View style={styles.logoContainer}>
                <View style={styles.logoBackground}>
                  <MaterialCommunityIcons
                    name="dumbbell"
                    size={48}
                    color={theme.colors.primary}
                  />
                </View>
              </View>

              {/* כותרות */}
              <Text style={styles.title}>{STRINGS.ui.welcomeBack}</Text>
              <Text style={styles.subtitle}>{STRINGS.ui.subtitle}</Text>

              {/* שדה אימייל */}
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
                      const newErrors = { ...fieldErrors };
                      delete newErrors.email;
                      setFieldErrors(newErrors);
                      if (error) setError(null);
                    }}
                    textAlign="right"
                    editable={!loading}
                  />
                </View>
                {fieldErrors.email && (
                  <Text style={styles.fieldError}>{fieldErrors.email}</Text>
                )}
              </View>

              {/* שדה סיסמה */}
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
                      const newErrors = { ...fieldErrors };
                      delete newErrors.password;
                      setFieldErrors(newErrors);
                      if (error) setError(null);
                    }}
                    textAlign="right"
                    editable={!loading}
                  />
                </View>
                {fieldErrors.password && (
                  <Text style={styles.fieldError}>{fieldErrors.password}</Text>
                )}
              </View>

              {/* זכור אותי ושכחתי סיסמה */}
              <View style={styles.optionsRow}>
                <View style={styles.rememberMe}>
                  <Text style={styles.rememberMeText}>
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
                <Pressable onPress={handleForgotPassword} disabled={loading}>
                  <Text style={styles.forgotPassword}>
                    {STRINGS.buttons.forgotPassword}
                  </Text>
                </Pressable>
              </View>

              {/* הודעת שגיאה */}
              {error && (
                <View style={styles.errorContainer}>
                  <MaterialCommunityIcons
                    name="alert-circle"
                    size={18}
                    color={theme.colors.error}
                  />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* כפתור התחברות */}
              <Pressable
                style={({ pressed }) => [
                  styles.loginButton,
                  loading && styles.loginButtonDisabled,
                  pressed && { opacity: 0.85 },
                ]}
                onPress={handleLogin}
                disabled={loading}
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
                      <LoadingSpinner size="small" color="#fff" />
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

              {/* או */}
              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>{STRINGS.ui.or}</Text>
                <View style={styles.divider} />
              </View>

              {/* כפתור Google */}
              <Pressable
                style={({ pressed }) => [
                  styles.googleButton,
                  googleLoading && styles.googleButtonDisabled,
                  pressed && { opacity: 0.85 },
                ]}
                onPress={handleGoogleAuth}
                disabled={loading}
              >
                {googleLoading ? (
                  <LoadingSpinner size="small" color="#DB4437" />
                ) : (
                  <Ionicons name="logo-google" size={20} color="#DB4437" />
                )}
                <Text style={styles.googleButtonText}>
                  {googleLoading
                    ? STRINGS.buttons.googleLoading
                    : `${STRINGS.buttons.google} (דמו)`}
                </Text>
              </Pressable>

              {/* קישור להרשמה */}
              <View style={styles.linkRow}>
                <Text style={styles.linkText}>{STRINGS.ui.noAccount}</Text>
                <Pressable
                  onPress={() => navigation.navigate("Questionnaire", {})}
                  disabled={loading}
                >
                  <Text style={styles.registerLink}>התחל עכשיו</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <ConfirmationModal
          visible={confirmationModal.visible}
          title={confirmationModal.title}
          message={confirmationModal.message}
          onClose={hideConfirmationModal}
          onConfirm={confirmationModal.onConfirm}
          onCancel={confirmationModal.onCancel || hideConfirmationModal}
          confirmText={confirmationModal.confirmText || "אישור"}
          cancelText={confirmationModal.cancelText || "ביטול"}
          variant={confirmationModal.variant || "default"}
          singleButton={confirmationModal.singleButton || false}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
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
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xxl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder + "40",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  logoBackground: {
    backgroundColor: theme.colors.primaryGradientStart + "20",
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    color: theme.colors.text,
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: theme.spacing.md,
    writingDirection: "rtl",
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: 18,
    textAlign: "center",
    marginBottom: theme.spacing.xl,
    writingDirection: "rtl",
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
  passwordToggle: {
    padding: 4,
  },
  fieldError: {
    color: theme.colors.error,
    fontSize: 13,
    marginTop: 6,
    textAlign: "right",
    marginEnd: 4,
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
    marginEnd: 8,
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
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },
  loginButton: {
    marginBottom: theme.spacing.lg,
    borderRadius: theme.radius.xl,
    overflow: "hidden",
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  gradientButton: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
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
    fontSize: 20,
    fontWeight: "700",
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
    borderRadius: theme.radius.xl,
    paddingVertical: 18,
    justifyContent: "center",
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder + "40",
    minHeight: 56,
  },
  googleButtonDisabled: {
    opacity: 0.7,
  },
  googleButtonText: {
    color: theme.colors.text,
    fontSize: 18,
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
