/**
 * @file src/screens/auth/RegisterScreen.tsx
 * @description מסך הרשמה משודרג - אימות מתקדם, אנימציות, חוזק סיסמה, תנאי שימוש
 * English: Enhanced registration screen with advanced validation, animations, password strength, terms
 * @dependencies BackButton, theme, authService, userStore, RootStackParamList
 * @notes כולל מד חוזק סיסמה, אישור גיל 16+, קישור לתנאי שימוש, ולידציה חזותית, אנימציות הצלחה, תמיכה מלאה ב-RTL
 * @enhancements אינדיקטורי ולידציה בזמן אמת, שיפורי חווית הקלדה, אנימציית הצלחה, תמיכה ב-Biometric
 * @recurring_errors השתמש ב-theme בלבד, וודא RTL נכון, השתמש ב-global navigation types
 * @updated 2025-07-30 שיפור RTL, אנימציות מתקדמות, תמיכה ב-global navigation types, אינדיקטורי טעינה חכמים
 *
 * === DEBUG MODE ENABLED ===
 * כל פעולה עיקרית מתועדת ב-console.log ו-console.group. ראה לוגים לכל שינוי state, הולידציה, try/catch, אנימציה, ניווט, ואירועי משתמש.
 */

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Switch,
  Animated,
  ScrollView,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../styles/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../components/common/BackButton";
import { fakeGoogleRegister } from "../../services/authService";
import { useUserStore } from "../../stores/userStore";
import { validateEmail as sharedValidateEmail } from "../../utils/authValidation";
import type { RootStackParamList } from "../../navigation/types";
import { localDataService } from "../../services/localDataService";

// Debug toggle
const DEBUG_REGISTER = false;
const debug = (...args: unknown[]) => {
  if (DEBUG_REGISTER) {
    // eslint-disable-next-line no-console
    console.log("[REGISTER]", ...args);
  }
};

// Centralized strings (hebrew only as UX surface; could add i18n layer later)
const STRINGS = {
  errors: {
    fullName: "אנא הזן שם מלא (לפחות 2 תווים)",
    emailRequired: "אנא הזן כתובת אימייל",
    emailInvalid: "כתובת אימייל לא תקינה",
    passwordRequired: "אנא הזן סיסמה",
    passwordShort: "הסיסמה חייבת להכיל לפחות 6 תווים",
    confirmRequired: "אנא אשר את הסיסמה",
    confirmMismatch: "הסיסמאות אינן תואמות",
    age: "ההרשמה מותרת רק מגיל 16 ומעלה",
    terms: "יש לאשר את תנאי השימוש",
    generic: "אירעה שגיאה בהרשמה. אנא נסה שוב",
    google: "ההרשמה עם Google נכשלה",
  },
  placeholders: {
    fullName: "שם מלא (לפחות 2 תווים)",
    email: "כתובת אימייל",
    password: "סיסמה (לפחות 6 תווים)",
    confirm: "אישור סיסמה",
  },
  buttons: {
    create: "צור חשבון",
    creating: "יוצר חשבון...",
    google: "הרשמה עם Google",
    googleLoading: "נרשם עם Google...",
    loginLink: "התחבר עכשיו",
  },
  misc: {
    or: "או",
    hasAccount: "כבר יש לך חשבון?",
    title: "יצירת חשבון חדש",
    subtitle: "הצטרף למהפכת הכושר שלך",
    ageConfirm: "אני מאשר/ת שאני בן/בת 16 ומעלה",
    termsPrefix: "אני מסכים/ה ל",
    termsLink: "תנאי השימוש",
    passwordStrengthLabel: "סיסמה",
  },
  accessibility: {
    fullNameField: "שדה שם מלא",
    emailField: "שדה אימייל",
    passwordField: "שדה סיסמה",
    confirmPasswordField: "שדה אישור סיסמה",
    createAccountButton: "כפתור יצירת חשבון",
    googleButton: "כפתור הרשמה עם גוגל",
    loginLink: "קישור התחברות",
  },
} as const;

// Pure helper (outside component) to compute password strength
const computePasswordStrength = (password: string) => {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 2)
    return {
      strength: "weak" as const,
      color: theme.colors.error,
      text: "חלשה",
      score,
    };
  if (score <= 3)
    return {
      strength: "medium" as const,
      color: theme.colors.warning,
      text: "בינונית",
      score,
    };
  return {
    strength: "strong" as const,
    color: theme.colors.success,
    text: "חזקה",
    score,
  };
};

// קומפוננטת אינדיקטור ולידציה // Validation indicator component
const ValidationIndicator = ({
  isValid,
  isChecking,
}: {
  isValid: boolean | null;
  isChecking?: boolean;
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (isValid !== null && !isChecking) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isValid, isChecking, scaleAnim]);
  if (isChecking) {
    return <ActivityIndicator size="small" color={theme.colors.primary} />;
  }
  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      {isValid === true && (
        <Ionicons
          name="checkmark-circle"
          size={22}
          color={theme.colors.success}
        />
      )}
      {isValid === false && (
        <Ionicons name="close-circle" size={22} color={theme.colors.error} />
      )}
    </Animated.View>
  );
};

export default function RegisterScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // ----------- DEBUG: MOUNT -----------
  useEffect(() => {
    debug("Component mounted", { ts: new Date().toISOString() });
  }, []);

  // ----------- STATE -----------
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [is16Plus, setIs16Plus] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [fieldValidation, setFieldValidation] = useState<{
    fullName: boolean | null;
    email: boolean | null;
    password: boolean | null;
    confirmPassword: boolean | null;
  }>({
    fullName: null,
    email: null,
    password: null,
    confirmPassword: null,
  });

  // Refs
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const successScaleAnim = useRef(new Animated.Value(0)).current;
  const successRotateAnim = useRef(new Animated.Value(0)).current;

  // --- DEBUG: STATE CHANGE LOGGING ---
  // Removed redundant empty effects
  useEffect(() => {
    if (error) console.warn("[REGISTER] error:", error);
  }, [error]);
  useEffect(() => {
    debug("Loading state changed", { loading });
  }, [loading]);

  // Password strength
  const passwordStrength = useMemo(
    () => computePasswordStrength(password),
    [password]
  );

  // --- DEBUG: Animations ---
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: passwordStrength.score / 5,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [passwordStrength.score, progressAnim]);

  // --- DEBUG: Real-time field validation ---
  useEffect(() => {
    if (fullName.length > 0) {
      const valid = fullName.length >= 2;
      setFieldValidation((prev) => ({ ...prev, fullName: valid }));
    }
  }, [fullName]);
  useEffect(() => {
    if (email.length > 0) {
      setFieldValidation((prev) => ({
        ...prev,
        email: sharedValidateEmail(email),
      }));
    }
  }, [email]);
  useEffect(() => {
    if (password.length > 0) {
      const valid = password.length >= 6;
      setFieldValidation((prev) => ({ ...prev, password: valid }));
    }
  }, [password]);
  useEffect(() => {
    if (confirmPassword.length > 0) {
      const valid = password === confirmPassword;
      setFieldValidation((prev) => ({ ...prev, confirmPassword: valid }));
    }
  }, [confirmPassword, password]);

  const validateEmail = sharedValidateEmail; // reuse shared util

  const createShakeAnimation = useCallback(() => {
    return Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]);
  }, [shakeAnim]);

  const createSuccessAnimation = useCallback(() => {
    return Animated.parallel([
      Animated.spring(successScaleAnim, {
        toValue: 1,
        friction: 6, // פחות חלק לאפקט דרמטי יותר
        tension: 60,
        useNativeDriver: true,
      }),
      Animated.timing(successRotateAnim, {
        toValue: 1,
        duration: 800, // זמן ארוך יותר לסיבוב
        useNativeDriver: true,
      }),
    ]);
  }, [successRotateAnim, successScaleAnim]);

  // ----------- DEBUG: FORM VALIDATION -----------
  const validateForm = (): boolean => {
    debug("Form validation start");
    const errors: typeof fieldErrors = {};
    if (!fullName || fullName.length < 2)
      errors.fullName = STRINGS.errors.fullName;
    if (!email) errors.email = STRINGS.errors.emailRequired;
    else if (!validateEmail(email)) errors.email = STRINGS.errors.emailInvalid;
    if (!password) errors.password = STRINGS.errors.passwordRequired;
    else if (password.length < 6)
      errors.password = STRINGS.errors.passwordShort;
    if (!confirmPassword)
      errors.confirmPassword = STRINGS.errors.confirmRequired;
    else if (password !== confirmPassword)
      errors.confirmPassword = STRINGS.errors.confirmMismatch;
    setFieldErrors(errors);
    debug("Validation errors", errors);
    if (Object.keys(errors).length > 0) {
      createShakeAnimation().start();
      return false;
    }
    return true;
  };

  // ----------- DEBUG: REGISTRATION -----------
  const handleRegister = async () => {
    debug("handleRegister invoked", {
      fullName: fullName ? "✓" : "✗",
      email: email ? "✓" : "✗",
      passwordEntered: password ? "✓" : "✗",
      confirmPasswordEntered: confirmPassword ? "✓" : "✗",
      is16Plus,
      acceptTerms,
    });
    if (!validateForm()) {
      console.warn("[REGISTER] Form validation failed.");
      return;
    }
    if (!is16Plus) {
      setError(STRINGS.errors.age);
      console.warn("[REGISTER] User is under 16.");
      return;
    }
    if (!acceptTerms) {
      setError(STRINGS.errors.terms);
      console.warn("[REGISTER] Terms not accepted.");
      return;
    }
    if (loading) {
      debug("Double-submit prevented");
      return; // guard
    }
    setLoading(true);
    setError(null);
    setFieldErrors({});
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      createSuccessAnimation().start();
      const newUser = {
        email,
        name: fullName,
        id: `user_${Date.now()}`,
        avatar: undefined,
        provider: "manual" as const,
        registration: {
          password,
          confirmPassword,
          is16Plus,
          acceptedTerms: acceptTerms,
          completedAt: new Date().toISOString(),
        },
        metadata: {
          createdAt: new Date().toISOString(),
          isRandom: false,
          sessionId: `register_${Date.now()}`,
        },
      };

      // שמירה ב-Zustand store
      useUserStore.getState().setUser(newUser);

      // שמירה גם ב-localDataService כדי שיהיה זמין להתחברות מהירה
      try {
        localDataService.addUser(newUser);
        console.warn("✅ RegisterScreen: User saved to localDataService", {
          email: newUser.email,
          name: newUser.name,
        });
      } catch (saveError) {
        console.warn(
          "⚠️ RegisterScreen: Failed to save to localDataService:",
          saveError
        );
        // לא נעצור את התהליך אם השמירה המקומית נכשלה
      }

      debug("Registration success", newUser);
      await new Promise((resolve) => setTimeout(resolve, 500));
      navigation.reset({ index: 0, routes: [{ name: "Questionnaire" }] });
      debug("Navigated to Questionnaire");
    } catch (error) {
      console.error("[REGISTER] Registration failed:", error);
      setError(STRINGS.errors.generic);
    } finally {
      setLoading(false);
    }
  };

  // ----------- DEBUG: GOOGLE REGISTER -----------
  const handleGoogleRegister = async () => {
    debug("handleGoogleRegister invoked");
    if (!is16Plus) {
      setError(STRINGS.errors.age);
      console.warn("[REGISTER] Google - under 16.");
      return;
    }
    if (!acceptTerms) {
      setError(STRINGS.errors.terms);
      console.warn("[REGISTER] Google - terms not accepted.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const googleUser = await fakeGoogleRegister();
      createSuccessAnimation().start();

      // שמירה ב-Zustand store
      useUserStore.getState().setUser(googleUser);

      // שמירה גם ב-localDataService כדי שיהיה זמין להתחברות מהירה
      try {
        localDataService.addUser(googleUser);
        console.warn(
          "✅ RegisterScreen: Google user saved to localDataService",
          {
            email: googleUser.email,
            name: googleUser.name,
            provider: googleUser.provider,
          }
        );
      } catch (saveError) {
        console.warn(
          "⚠️ RegisterScreen: Failed to save Google user to localDataService:",
          saveError
        );
        // לא נעצור את התהליך אם השמירה המקומית נכשלה
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
      navigation.reset({ index: 0, routes: [{ name: "Questionnaire" }] });
      debug("Google registration success; navigated to Questionnaire");
    } catch (e) {
      console.error("[REGISTER] Google registration failed:", e);
      setError(STRINGS.errors.google);
    } finally {
      setLoading(false);
    }
  };

  // ----------- DEBUG: NAVIGATE TO TERMS -----------
  const handleNavigateToTerms = () => {
    try {
      navigation.navigate("Terms");
      debug("Navigate to Terms");
    } catch (error) {
      console.error("[NAVIGATE] Failed to Terms:", error);
    }
  };

  // ------------------------- RENDER -------------------------
  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top", "right", "left", "bottom"]}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <BackButton />
          {/* אנימציית הצלחה */}
          {loading && (
            <Animated.View
              style={[
                styles.successOverlay,
                {
                  opacity: successScaleAnim,
                  transform: [
                    { scale: successScaleAnim },
                    {
                      rotate: successRotateAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", "360deg"],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Ionicons
                name="checkmark-circle"
                size={100}
                color={theme.colors.success}
              />
            </Animated.View>
          )}

          <Animated.View
            style={[
              styles.formBox,
              {
                opacity: fadeAnim,
                transform: [{ translateX: shakeAnim }],
              },
            ]}
          >
            {/* --- כותרת --- */}
            <LinearGradient
              colors={[
                theme.colors.primaryGradientStart,
                theme.colors.primaryGradientEnd,
              ]}
              style={styles.titleGradient}
            >
              <Text style={styles.title}>{STRINGS.misc.title}</Text>
            </LinearGradient>
            <Text style={styles.subtitle}>{STRINGS.misc.subtitle}</Text>

            {/* --- שדה שם מלא --- */}
            <View style={styles.inputContainer}>
              <View
                style={[
                  styles.inputWrapper,
                  fieldErrors.fullName && styles.inputError,
                  fieldValidation.fullName === true && styles.inputValid,
                ]}
              >
                <ValidationIndicator isValid={fieldValidation.fullName} />
                <FontAwesome5
                  name="user"
                  size={20}
                  color={
                    fieldErrors.fullName
                      ? theme.colors.error
                      : fieldValidation.fullName === true
                        ? theme.colors.success
                        : theme.colors.accent
                  }
                  style={styles.iconMarginEnd}
                />
                <TextInput
                  style={styles.input}
                  placeholder={STRINGS.placeholders.fullName}
                  placeholderTextColor={theme.colors.textSecondary}
                  accessibilityLabel={STRINGS.accessibility.fullNameField}
                  autoCapitalize="words"
                  autoCorrect={false}
                  value={fullName}
                  onChangeText={(text) => {
                    setFullName(text);
                    setFieldErrors((prev) => ({
                      ...prev,
                      fullName: undefined,
                    }));
                  }}
                  textAlign="right"
                  editable={!loading}
                  returnKeyType="next"
                  onSubmitEditing={() => emailRef.current?.focus()}
                  textContentType="name"
                />
              </View>
              {fieldErrors.fullName && (
                <Text style={styles.fieldError}>{fieldErrors.fullName}</Text>
              )}
            </View>

            {/* --- שדה אימייל --- */}
            <View style={styles.inputContainer}>
              <View
                style={[
                  styles.inputWrapper,
                  fieldErrors.email && styles.inputError,
                  fieldValidation.email === true && styles.inputValid,
                ]}
              >
                <ValidationIndicator isValid={fieldValidation.email} />
                <MaterialIcons
                  name="email"
                  size={22}
                  color={
                    fieldErrors.email
                      ? theme.colors.error
                      : fieldValidation.email === true
                        ? theme.colors.success
                        : theme.colors.accent
                  }
                  style={styles.iconMarginEndSm}
                />
                <TextInput
                  ref={emailRef}
                  style={styles.input}
                  placeholder={STRINGS.placeholders.email}
                  placeholderTextColor={theme.colors.textSecondary}
                  accessibilityLabel={STRINGS.accessibility.emailField}
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
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  textContentType="emailAddress"
                />
              </View>
              {fieldErrors.email && (
                <Text style={styles.fieldError}>{fieldErrors.email}</Text>
              )}
            </View>

            {/* --- שדה סיסמה --- */}
            <View style={styles.inputContainer}>
              <View
                style={[
                  styles.inputWrapper,
                  fieldErrors.password && styles.inputError,
                  fieldValidation.password === true && styles.inputValid,
                ]}
              >
                <ValidationIndicator isValid={fieldValidation.password} />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="הצג או הסתר סיסמה"
                  accessibilityHint="לחץ כדי להציג או להסתיר את טקסט הסיסמה"
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={22}
                    color={
                      fieldErrors.password
                        ? theme.colors.error
                        : fieldValidation.password === true
                          ? theme.colors.success
                          : theme.colors.accent
                    }
                    style={styles.iconMarginEndSm}
                  />
                </TouchableOpacity>
                <TextInput
                  ref={passwordRef}
                  style={styles.input}
                  placeholder={STRINGS.placeholders.password}
                  placeholderTextColor={theme.colors.textSecondary}
                  accessibilityLabel={STRINGS.accessibility.passwordField}
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
                  returnKeyType="next"
                  onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                  textContentType="newPassword"
                />
              </View>
              {fieldErrors.password && (
                <Text style={styles.fieldError}>{fieldErrors.password}</Text>
              )}
              {/* --- מד חוזק סיסמה --- */}
              {password.length > 0 && (
                <View style={styles.passwordStrength}>
                  <View style={styles.strengthBar}>
                    <Animated.View
                      style={[
                        styles.strengthProgress,
                        {
                          width: progressAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ["0%", "100%"],
                          }),
                          backgroundColor: passwordStrength.color,
                        },
                      ]}
                    />
                  </View>
                  <Text
                    style={[
                      styles.strengthText,
                      { color: passwordStrength.color },
                    ]}
                  >
                    סיסמה {passwordStrength.text}
                  </Text>
                </View>
              )}
            </View>

            {/* --- שדה אישור סיסמה --- */}
            <View style={styles.inputContainer}>
              <View
                style={[
                  styles.inputWrapper,
                  fieldErrors.confirmPassword && styles.inputError,
                  fieldValidation.confirmPassword === true && styles.inputValid,
                ]}
              >
                <ValidationIndicator
                  isValid={fieldValidation.confirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="הצג או הסתר אימות סיסמה"
                  accessibilityHint="לחץ כדי להציג או להסתיר את טקסט אימות הסיסמה"
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    size={22}
                    color={
                      fieldErrors.confirmPassword
                        ? theme.colors.error
                        : fieldValidation.confirmPassword === true
                          ? theme.colors.success
                          : theme.colors.accent
                    }
                    style={styles.iconMarginEndSm}
                  />
                </TouchableOpacity>
                <TextInput
                  ref={confirmPasswordRef}
                  style={styles.input}
                  placeholder={STRINGS.placeholders.confirm}
                  placeholderTextColor={theme.colors.textSecondary}
                  accessibilityLabel={
                    STRINGS.accessibility.confirmPasswordField
                  }
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    setFieldErrors((prev) => ({
                      ...prev,
                      confirmPassword: undefined,
                    }));
                  }}
                  textAlign="right"
                  editable={!loading}
                  returnKeyType="done"
                  onSubmitEditing={handleRegister}
                  textContentType="password"
                />
              </View>
              {fieldErrors.confirmPassword && (
                <Text style={styles.fieldError}>
                  {fieldErrors.confirmPassword}
                </Text>
              )}
            </View>

            {/* --- אישור גיל --- */}
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>{STRINGS.misc.ageConfirm}</Text>
              <Switch
                value={is16Plus}
                onValueChange={setIs16Plus}
                trackColor={{
                  false: theme.colors.divider,
                  true: theme.colors.primaryGradientStart,
                }}
                thumbColor={is16Plus ? theme.colors.primary : "#f4f3f4"}
                disabled={loading}
                style={styles.switchMarginStart}
              />
            </View>
            {/* --- אישור תנאים --- */}
            <View style={styles.switchRow}>
              <View style={styles.termsTextContainer}>
                <Text style={styles.switchLabel}>
                  {STRINGS.misc.termsPrefix}
                </Text>
                <TouchableOpacity
                  onPress={handleNavigateToTerms}
                  disabled={loading}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="תנאי שימוש"
                  accessibilityHint="לחץ כדי לקרוא את תנאי השימוש"
                >
                  <Text style={styles.termsLink}>{STRINGS.misc.termsLink}</Text>
                </TouchableOpacity>
              </View>
              <Switch
                value={acceptTerms}
                onValueChange={setAcceptTerms}
                trackColor={{
                  false: theme.colors.divider,
                  true: theme.colors.primaryGradientStart,
                }}
                thumbColor={acceptTerms ? theme.colors.primary : "#f4f3f4"}
                disabled={loading}
                style={styles.switchMarginStart}
              />
            </View>

            {/* --- הודעת שגיאה כללית --- */}
            {error && <Text style={styles.errorText}>{error}</Text>}

            {/* --- כפתור הרשמה --- */}
            <TouchableOpacity
              style={[
                styles.registerButton,
                loading && styles.registerButtonDisabled,
              ]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.8}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="צור חשבון"
              accessibilityHint="לחץ כדי ליצור חשבון חדש בGYMovoo"
              accessibilityState={{ disabled: loading }}
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
                    <Text style={styles.registerLoadingText}>
                      {STRINGS.buttons.creating}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.registerButtonText}>
                    {STRINGS.buttons.create}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* --- או --- */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>{STRINGS.misc.or}</Text>
              <View style={styles.divider} />
            </View>

            {/* --- כפתור Google --- */}
            <TouchableOpacity
              style={[
                styles.googleButton,
                loading && styles.googleButtonDisabled,
              ]}
              onPress={handleGoogleRegister}
              disabled={loading}
              activeOpacity={0.8}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="הרשמה עם Google"
              accessibilityHint="לחץ כדי להירשם באמצעות חשבון Google"
              accessibilityState={{ disabled: loading }}
            >
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#ea4335" />
                  <Text style={styles.googleLoadingText}>
                    {STRINGS.buttons.googleLoading}
                  </Text>
                </View>
              ) : (
                <>
                  <Text style={styles.googleButtonText}>
                    {STRINGS.buttons.google}
                  </Text>
                  <Ionicons name="logo-google" size={22} color="#ea4335" />
                </>
              )}
            </TouchableOpacity>

            {/* --- קישור להתחברות --- */}
            <View style={styles.linkRow}>
              <Text style={styles.linkText}>{STRINGS.misc.hasAccount}</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Login", {})}
                disabled={loading}
                accessibilityLabel={STRINGS.accessibility.loginLink}
              >
                <Text style={styles.loginLink}>
                  {STRINGS.buttons.loginLink}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

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
    paddingBottom: theme.spacing.xxl,
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
  titleGradient: {
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  inputWrapper: {
    flexDirection: "row-reverse", // קבוע לעברית, בלי תנאי
    alignItems: "center",
    backgroundColor: theme.colors.backgroundAlt,
    borderRadius: theme.radius.md,
    paddingStart: theme.spacing.md,
    paddingEnd: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.divider,
    height: 48,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  inputValid: {
    borderColor: theme.colors.success,
  },
  input: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 16,
    textAlign: "right",
    writingDirection: "rtl",
    paddingVertical: 0,
  },
  fieldError: {
    color: theme.colors.error,
    fontSize: 12,
    marginTop: 4,
    textAlign: "right",
  },
  passwordStrength: {
    marginTop: 8,
  },
  strengthBar: {
    height: 4,
    backgroundColor: theme.colors.divider,
    borderRadius: 2,
    overflow: "hidden",
  },
  strengthProgress: {
    height: "100%",
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 11,
    marginTop: 4,
    textAlign: "right",
  },
  switchRow: {
    flexDirection: "row-reverse", // קבוע לעברית, בלי תנאי
    alignItems: "center",
    marginBottom: theme.spacing.sm,
    justifyContent: "space-between", // כדי שהטקסט יהיה מימין והכפתור משמאל
    // gap: 8, // עדיף margin בין האלמנטים עצמם
  },
  switchLabel: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    textAlign: "right",
  },
  termsTextContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-start", // כדי שהטקסט יהיה מימין
    // gap: 4, // כנ"ל
  },
  termsLink: {
    color: theme.colors.accent,
    fontSize: 13,
    textDecorationLine: "underline",
    marginEnd: 4,
    padding: 2, // אזור מגע גדול יותר
  },
  errorText: {
    color: theme.colors.error,
    textAlign: "center",
    marginBottom: theme.spacing.md,
    fontSize: 14,
    fontWeight: "500",
  },
  registerButton: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.radius.md,
    overflow: "hidden",
  },
  registerButtonDisabled: {
    opacity: 0.7,
  },
  gradientButton: {
    paddingVertical: theme.spacing.md,
    alignItems: "center",
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  registerLoadingText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.divider,
  },
  dividerText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    marginHorizontal: theme.spacing.sm,
  },
  googleButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    justifyContent: "center",
    marginBottom: theme.spacing.lg,
    gap: 8,
    borderWidth: 1,
    borderColor: "#ea4335",
  },
  googleButtonDisabled: {
    opacity: 0.7,
  },
  googleButtonText: {
    color: "#ea4335",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
  },
  googleLoadingText: {
    color: "#ea4335",
    fontSize: 16,
    fontWeight: "600",
  },
  linkRow: {
    flexDirection: "row-reverse", // קבוע לעברית, בלי תנאי
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  linkText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    marginEnd: 4, // רווח בין הטקסט לקישור
  },
  loginLink: {
    color: theme.colors.accent,
    fontWeight: "600",
    fontSize: 14,
  },
  successOverlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginStart: -50, // RTL: שמירה על marginStart למיקום מרכזי
    marginTop: -50,
    zIndex: 1000,
  },
  iconMarginEnd: {
    marginEnd: 8,
  },
  iconMarginEndSm: {
    marginEnd: 6,
  },
  switchMarginStart: {
    marginStart: 8,
  },
});
