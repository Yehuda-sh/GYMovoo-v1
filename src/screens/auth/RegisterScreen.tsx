/**
 * @file src/screens/auth/RegisterScreen.tsx
 * @description מסך הרשמה משודרג - אימות מתקדם, אנימציות, חוזק סיסמה, תנאי שימוש
 * English: Enhanced registration screen with advanced validation, animations, password strength, terms
 * @dependencies BackButton, theme, authService, userStore
 * @notes כולל מד חוזק סיסמה, אישור גיל 16+, קישור לתנאי שימוש
 * @recurring_errors שים לב לסנכרון בין סיסמה לאישור סיסמה, וודא בדיקת גיל ותנאים
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
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../styles/theme";
import BackButton from "../../components/common/BackButton";
import { fakeGoogleRegister } from "../../services/authService";
import { useUserStore } from "../../stores/userStore";

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

  // קריטריונים לחישוב ציון // Criteria for score calculation
  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++; // אות גדולה // Capital letter
  if (/[0-9]/.test(password)) score++; // ספרה // Number
  if (/[^A-Za-z0-9]/.test(password)) score++; // תו מיוחד // Special character

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

export default function RegisterScreen() {
  const navigation = useNavigation<any>();

  console.log("📝 RegisterScreen - Component mounted");

  // States
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

  // חישוב חוזק סיסמה // Password strength calculation
  const passwordStrength = getPasswordStrength(password);

  // אנימציות // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    console.log("📝 RegisterScreen - useEffect triggered");
    // אנימציית כניסה // Entry animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start(() => {
      console.log("📝 RegisterScreen - Entry animation completed");
    });
  }, []);

  useEffect(() => {
    // אנימציית חוזק סיסמה // Password strength animation
    console.log(
      "📝 RegisterScreen - Password strength:",
      passwordStrength.strength,
      passwordStrength.score
    );
    Animated.timing(progressAnim, {
      toValue: passwordStrength.score / 5,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [passwordStrength.score]);

  /**
   * בודק תקינות כתובת אימייל
   * Validates email format
   */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * יוצר אנימציית רעידה לשגיאות
   * Creates shake animation for errors
   */
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

  /**
   * בודק תקינות כל הטופס
   * Validates entire form
   */
  const validateForm = (): boolean => {
    console.log("📝 RegisterScreen - Validating form...");
    console.log("📝 RegisterScreen - Full name:", fullName);
    console.log("📝 RegisterScreen - Email:", email);
    console.log("📝 RegisterScreen - Password length:", password.length);
    console.log(
      "📝 RegisterScreen - Passwords match:",
      password === confirmPassword
    );

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

    if (Object.keys(errors).length > 0) {
      console.log("📝 RegisterScreen - Validation failed:", errors);
      createShakeAnimation().start();
      return false;
    }

    console.log("📝 RegisterScreen - Validation passed ✅");
    return true;
  };

  /**
   * מטפל בתהליך ההרשמה
   * Handles registration process
   */
  const handleRegister = async () => {
    console.log("📝 RegisterScreen - Registration attempt started");
    console.log("📝 RegisterScreen - Is 16+:", is16Plus);
    console.log("📝 RegisterScreen - Accept terms:", acceptTerms);

    if (!validateForm()) {
      return;
    }

    if (!is16Plus) {
      console.log("📝 RegisterScreen - Registration blocked - under 16 ❌");
      setError("ההרשמה מותרת רק מגיל 16 ומעלה");
      return;
    }

    if (!acceptTerms) {
      console.log(
        "📝 RegisterScreen - Registration blocked - terms not accepted ❌"
      );
      setError("יש לאשר את תנאי השימוש");
      return;
    }

    setLoading(true);
    setError(null);
    setFieldErrors({});

    setTimeout(() => {
      setLoading(false);
      console.log("📝 RegisterScreen - Registration successful! ✅");

      // יצירת משתמש חדש // Create new user
      const newUser = {
        email,
        name: fullName,
        id: `user_${Date.now()}`,
        avatar: undefined,
      };

      console.log("📝 RegisterScreen - New user created:", newUser);
      console.log("📝 RegisterScreen - Saving to Zustand store");
      useUserStore.getState().setUser(newUser);

      console.log("📝 RegisterScreen - Navigating to Questionnaire");
      navigation.reset({ index: 0, routes: [{ name: "Questionnaire" }] });
    }, 1200);
  };

  /**
   * מטפל בהרשמה עם Google
   * Handles Google registration
   */
  const handleGoogleRegister = async () => {
    console.log("📝 RegisterScreen - Google registration started");
    console.log("📝 RegisterScreen - Is 16+:", is16Plus);
    console.log("📝 RegisterScreen - Accept terms:", acceptTerms);

    if (!is16Plus) {
      console.log(
        "📝 RegisterScreen - Google registration blocked - under 16 ❌"
      );
      setError("ההרשמה מותרת רק מגיל 16 ומעלה");
      return;
    }

    if (!acceptTerms) {
      console.log(
        "📝 RegisterScreen - Google registration blocked - terms not accepted ❌"
      );
      setError("יש לאשר את תנאי השימוש");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("📝 RegisterScreen - Calling fakeGoogleRegister...");
      const googleUser = await fakeGoogleRegister();
      console.log("📝 RegisterScreen - Google user received:", googleUser);

      useUserStore.getState().setUser(googleUser);
      console.log("📝 RegisterScreen - Navigating to Questionnaire");
      navigation.reset({ index: 0, routes: [{ name: "Questionnaire" }] });
    } catch (e) {
      console.error("📝 RegisterScreen - Google registration failed:", e);
      setError("ההרשמה עם Google נכשלה");
    } finally {
      setLoading(false);
    }
  };

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

        <Animated.View
          style={[
            styles.formBox,
            {
              opacity: fadeAnim,
              transform: [{ translateX: shakeAnim }],
            },
          ]}
        >
          {/* כותרת עם גרדיאנט // Title with gradient */}
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

          {/* שדה שם מלא // Full name field */}
          <View style={styles.inputContainer}>
            <View
              style={[
                styles.inputWrapper,
                fieldErrors.fullName && styles.inputError,
              ]}
            >
              <FontAwesome5
                name="user"
                size={20}
                color={
                  fieldErrors.fullName
                    ? theme.colors.error
                    : theme.colors.accent
                }
                style={{ marginLeft: 8 }}
              />
              <TextInput
                style={styles.input}
                placeholder="שם מלא"
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
              />
            </View>
            {fieldErrors.fullName && (
              <Text style={styles.fieldError}>{fieldErrors.fullName}</Text>
            )}
          </View>

          {/* שדה אימייל // Email field */}
          <View style={styles.inputContainer}>
            <View
              style={[
                styles.inputWrapper,
                fieldErrors.email && styles.inputError,
              ]}
            >
              <MaterialIcons
                name="email"
                size={22}
                color={
                  fieldErrors.email ? theme.colors.error : theme.colors.accent
                }
                style={{ marginLeft: 6 }}
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
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={22}
                  color={
                    fieldErrors.password
                      ? theme.colors.error
                      : theme.colors.accent
                  }
                  style={{ marginLeft: 6 }}
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
                  setFieldErrors((prev) => ({ ...prev, password: undefined }));
                }}
                textAlign="right"
                editable={!loading}
              />
            </View>
            {fieldErrors.password && (
              <Text style={styles.fieldError}>{fieldErrors.password}</Text>
            )}

            {/* מד חוזק סיסמה // Password strength meter */}
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

          {/* שדה אישור סיסמה // Confirm password field */}
          <View style={styles.inputContainer}>
            <View
              style={[
                styles.inputWrapper,
                fieldErrors.confirmPassword && styles.inputError,
              ]}
            >
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
                      : theme.colors.accent
                  }
                  style={{ marginLeft: 6 }}
                />
              </TouchableOpacity>
              <TextInput
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
              />
            </View>
            {fieldErrors.confirmPassword && (
              <Text style={styles.fieldError}>
                {fieldErrors.confirmPassword}
              </Text>
            )}
          </View>

          {/* אישור גיל // Age confirmation */}
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
            />
          </View>

          {/* אישור תנאים // Terms acceptance */}
          <View style={styles.switchRow}>
            <View style={styles.termsTextContainer}>
              <Text style={styles.switchLabel}>אני מסכים/ה ל</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Terms")}
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
            />
          </View>

          {/* הודעת שגיאה כללית // General error message */}
          {error && <Text style={styles.errorText}>{error}</Text>}

          {/* כפתור הרשמה // Register button */}
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
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.registerButtonText}>צור חשבון</Text>
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
            onPress={handleGoogleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Ionicons name="logo-google" size={22} color="#fff" />
            <Text style={styles.googleButtonText}>הרשמה עם Google</Text>
          </TouchableOpacity>

          {/* קישור להתחברות // Login link */}
          <View style={styles.linkRow}>
            <Text style={styles.linkText}>כבר יש לך חשבון?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
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
    padding: 16,
    paddingBottom: 40,
  },
  formBox: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 24,
    ...theme.shadows.medium,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  titleGradient: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
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
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: theme.colors.backgroundAlt,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: theme.colors.divider,
    height: 48,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  input: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 16,
    textAlign: "right",
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
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  switchLabel: {
    color: theme.colors.textSecondary,
    fontSize: 13,
  },
  termsTextContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
  },
  termsLink: {
    color: theme.colors.accent,
    fontSize: 13,
    textDecorationLine: "underline",
  },
  errorText: {
    color: theme.colors.error,
    textAlign: "center",
    marginBottom: 12,
    fontSize: 14,
    fontWeight: "500",
  },
  registerButton: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  registerButtonDisabled: {
    opacity: 0.7,
  },
  gradientButton: {
    paddingVertical: 14,
    alignItems: "center",
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.divider,
  },
  dividerText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    marginHorizontal: 12,
  },
  googleButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    paddingVertical: 14,
    justifyContent: "center",
    marginBottom: 20,
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
  },
  linkRow: {
    flexDirection: "row-reverse",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  linkText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  loginLink: {
    color: theme.colors.accent,
    fontWeight: "600",
    fontSize: 14,
  },
});
