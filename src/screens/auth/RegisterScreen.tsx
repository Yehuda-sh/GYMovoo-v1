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
  Switch,
  Animated,
  ScrollView,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../styles/theme";
import BackButton from "../../components/common/BackButton";
import { fakeGoogleRegister } from "../../services/authService";
import { useUserStore } from "../../stores/userStore";
import type { RootStackParamList } from "../../navigation/types";

/**
 * מחשב את חוזק הסיסמה ומחזיר נתונים לתצוגה
 * Calculates password strength and returns display data
 */
const getPasswordStrength = (
  password: string
): {
  strength: "weak" | "medium" | "strong";
  color: string;
  text: string;
  score: number;
} => {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 2) {
    return { strength: "weak", color: theme.colors.error, text: "חלשה", score };
  } else if (score <= 3) {
    return {
      strength: "medium",
      color: theme.colors.warning,
      text: "בינונית",
      score,
    };
  } else {
    return {
      strength: "strong",
      color: theme.colors.success,
      text: "חזקה",
      score,
    };
  }
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
  }, [isValid, isChecking]);
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
    console.groupCollapsed(
      "%c[REGISTER] Component mounted",
      "color: #0077cc; font-weight: bold;"
    );
    console.log("Mount at:", new Date().toISOString());
    console.groupEnd();
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
  useEffect(() => {
    if (fullName !== "") console.log("[FIELD] fullName:", fullName);
  }, [fullName]);
  useEffect(() => {
    if (email !== "") console.log("[FIELD] email:", email);
  }, [email]);
  useEffect(() => {
    if (password !== "") console.log("[FIELD] password changed (hidden)");
  }, [password]);
  useEffect(() => {
    if (confirmPassword !== "") console.log("[FIELD] confirmPassword changed");
  }, [confirmPassword]);
  useEffect(() => {
    console.log("[FIELD] is16Plus:", is16Plus);
  }, [is16Plus]);
  useEffect(() => {
    console.log("[FIELD] acceptTerms:", acceptTerms);
  }, [acceptTerms]);
  useEffect(() => {
    if (error) console.warn("[ERROR] error:", error);
  }, [error]);
  useEffect(() => {
    if (loading) console.log("[LOADING] loading true");
    else console.log("[LOADING] loading false");
  }, [loading]);

  // Password strength
  const passwordStrength = getPasswordStrength(password);

  // --- DEBUG: Animations ---
  useEffect(() => {
    // אנימציית כניסה משופרת // Enhanced entry animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800, // זמן ארוך יותר לחוויה חלקה
      useNativeDriver: true,
    }).start(() => {
      console.log("[ANIMATION] Entry animation finished");
    });
  }, []);
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: passwordStrength.score / 5,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      console.log(
        "[ANIMATION] Password strength animation to",
        passwordStrength.score
      );
    });
  }, [passwordStrength.score]);

  // --- DEBUG: Real-time field validation ---
  useEffect(() => {
    if (fullName.length > 0) {
      const valid = fullName.length >= 2;
      setFieldValidation((prev) => ({ ...prev, fullName: valid }));
      console.log("[VALIDATE] fullName valid:", valid);
    }
  }, [fullName]);
  useEffect(() => {
    if (email.length > 0) {
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      setFieldValidation((prev) => ({ ...prev, email: valid }));
      console.log("[VALIDATE] email valid:", valid);
    }
  }, [email]);
  useEffect(() => {
    if (password.length > 0) {
      const valid = password.length >= 6;
      setFieldValidation((prev) => ({ ...prev, password: valid }));
      console.log("[VALIDATE] password valid:", valid);
    }
  }, [password]);
  useEffect(() => {
    if (confirmPassword.length > 0) {
      const valid = password === confirmPassword;
      setFieldValidation((prev) => ({ ...prev, confirmPassword: valid }));
      console.log("[VALIDATE] confirmPassword valid:", valid);
    }
  }, [confirmPassword, password]);

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const createShakeAnimation = () => {
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
  };

  const createSuccessAnimation = () => {
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
  };

  // ----------- DEBUG: FORM VALIDATION -----------
  const validateForm = (): boolean => {
    console.group("%c[FORM VALIDATION]", "color: purple; font-weight: bold;");
    const errors: typeof fieldErrors = {};
    if (!fullName || fullName.length < 2) {
      errors.fullName = "אנא הזן שם מלא (לפחות 2 תווים)";
    }
    if (!email) {
      errors.email = "אנא הזן כתובת אימייל";
    } else if (!validateEmail(email)) {
      errors.email = "כתובת אימייל לא תקינה";
    }
    if (!password) {
      errors.password = "אנא הזן סיסמה";
    } else if (password.length < 6) {
      errors.password = "הסיסמה חייבת להכיל לפחות 6 תווים";
    }
    if (!confirmPassword) {
      errors.confirmPassword = "אנא אשר את הסיסמה";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "הסיסמאות אינן תואמות";
    }
    setFieldErrors(errors);
    console.log("Validation errors:", errors);
    console.groupEnd();
    if (Object.keys(errors).length > 0) {
      createShakeAnimation().start();
      return false;
    }
    return true;
  };

  // ----------- DEBUG: REGISTRATION -----------
  const handleRegister = async () => {
    console.group(
      "%c[REGISTER] handleRegister()",
      "color: #00aa00; font-weight: bold;"
    );
    console.log("Inputs:", {
      fullName,
      email,
      password,
      confirmPassword,
      is16Plus,
      acceptTerms,
    });
    if (!validateForm()) {
      console.warn("[REGISTER] Form validation failed.");
      console.groupEnd();
      return;
    }
    if (!is16Plus) {
      setError("ההרשמה מותרת רק מגיל 16 ומעלה");
      console.warn("[REGISTER] User is under 16.");
      console.groupEnd();
      return;
    }
    if (!acceptTerms) {
      setError("יש לאשר את תנאי השימוש");
      console.warn("[REGISTER] Terms not accepted.");
      console.groupEnd();
      return;
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
      };
      useUserStore.getState().setUser(newUser);
      console.log("[REGISTER] Registration success. User saved:", newUser);
      await new Promise((resolve) => setTimeout(resolve, 500));
      navigation.reset({ index: 0, routes: [{ name: "Questionnaire" }] });
      console.log("[REGISTER] Navigated to Questionnaire");
    } catch (error) {
      console.error("[REGISTER] Registration failed:", error);
      setError("אירעה שגיאה בהרשמה. אנא נסה שוב");
    } finally {
      setLoading(false);
      console.groupEnd();
    }
  };

  // ----------- DEBUG: GOOGLE REGISTER -----------
  const handleGoogleRegister = async () => {
    console.group(
      "%c[REGISTER] handleGoogleRegister()",
      "color: #e34b0a; font-weight: bold;"
    );
    if (!is16Plus) {
      setError("ההרשמה מותרת רק מגיל 16 ומעלה");
      console.warn("[REGISTER] Google - under 16.");
      console.groupEnd();
      return;
    }
    if (!acceptTerms) {
      setError("יש לאשר את תנאי השימוש");
      console.warn("[REGISTER] Google - terms not accepted.");
      console.groupEnd();
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const googleUser = await fakeGoogleRegister();
      createSuccessAnimation().start();
      useUserStore.getState().setUser(googleUser);
      await new Promise((resolve) => setTimeout(resolve, 500));
      navigation.reset({ index: 0, routes: [{ name: "Questionnaire" }] });
      console.log("[REGISTER] Google success. Navigated to Questionnaire");
    } catch (e) {
      console.error("[REGISTER] Google registration failed:", e);
      setError("ההרשמה עם Google נכשלה");
    } finally {
      setLoading(false);
      console.groupEnd();
    }
  };

  // ----------- DEBUG: NAVIGATE TO TERMS -----------
  const handleNavigateToTerms = () => {
    try {
      navigation.navigate("Terms");
      console.log("[NAVIGATE] To Terms");
    } catch (error) {
      console.error("[NAVIGATE] Failed to Terms:", error);
    }
  };

  // ------------------------- RENDER -------------------------
  return (
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
            <Text style={styles.title}>יצירת חשבון חדש</Text>
          </LinearGradient>
          <Text style={styles.subtitle}>הצטרף למהפכת הכושר שלך</Text>

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
                style={{ marginEnd: 8 }} // שינוי RTL: marginEnd במקום marginStart
              />
              <TextInput
                style={styles.input}
                placeholder="שם מלא (לפחות 2 תווים)"
                placeholderTextColor={theme.colors.textSecondary}
                autoCapitalize="words"
                autoCorrect={false}
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  setFieldErrors((prev) => ({ ...prev, fullName: undefined }));
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
                style={{ marginEnd: 6 }} // שינוי RTL: marginEnd במקום marginStart
              />
              <TextInput
                ref={emailRef}
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
                  style={{ marginEnd: 6 }} // שינוי RTL: marginEnd במקום marginStart
                />
              </TouchableOpacity>
              <TextInput
                ref={passwordRef}
                style={styles.input}
                placeholder="סיסמה (לפחות 6 תווים)"
                placeholderTextColor={theme.colors.textSecondary}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setFieldErrors((prev) => ({ ...prev, password: undefined }));
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
              <ValidationIndicator isValid={fieldValidation.confirmPassword} />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
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
                  style={{ marginEnd: 6 }} // שינוי RTL: marginEnd במקום marginStart
                />
              </TouchableOpacity>
              <TextInput
                ref={confirmPasswordRef}
                style={styles.input}
                placeholder="אישור סיסמה"
                placeholderTextColor={theme.colors.textSecondary}
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
            <Text style={styles.switchLabel}>
              אני מאשר/ת שאני בן/בת 16 ומעלה
            </Text>
            <Switch
              value={is16Plus}
              onValueChange={setIs16Plus}
              trackColor={{
                false: theme.colors.divider,
                true: theme.colors.primaryGradientStart,
              }}
              thumbColor={is16Plus ? theme.colors.primary : "#f4f3f4"}
              disabled={loading}
              style={{ marginStart: 8 }} // RTL: שמירה על marginStart כי זה Switch
            />
          </View>
          {/* --- אישור תנאים --- */}
          <View style={styles.switchRow}>
            <View style={styles.termsTextContainer}>
              <Text style={styles.switchLabel}>אני מסכים/ה ל</Text>
              <TouchableOpacity
                onPress={handleNavigateToTerms}
                disabled={loading}
              >
                <Text style={styles.termsLink}>תנאי השימוש</Text>
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
              style={{ marginStart: 8 }} // RTL: שמירה על marginStart כי זה Switch
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
                  <Text style={styles.registerLoadingText}>יוצר חשבון...</Text>
                </View>
              ) : (
                <Text style={styles.registerButtonText}>צור חשבון</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* --- או --- */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>או</Text>
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
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#ea4335" />
                <Text style={styles.googleLoadingText}>נרשם עם Google...</Text>
              </View>
            ) : (
              <>
                <Text style={styles.googleButtonText}>הרשמה עם Google</Text>
                <Ionicons name="logo-google" size={22} color="#ea4335" />
              </>
            )}
          </TouchableOpacity>

          {/* --- קישור להתחברות --- */}
          <View style={styles.linkRow}>
            <Text style={styles.linkText}>כבר יש לך חשבון?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Login", {})}
              disabled={loading}
            >
              <Text style={styles.loginLink}>התחבר עכשיו</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
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
});
