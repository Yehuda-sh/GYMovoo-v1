/**
 * @file src/screens/auth/LoginScreen.tsx
 * @description מסך התחברות משודרג - אימות מתקדם, אנימציות, זכור אותי, שחזור סיסמה
 * English: Enhanced login screen with advanced validation, animations, remember me, password recovery
 * @dependencies BackButton, theme, authService, userStore
 * @notes כולל אנימציות shake, fade ו-scale, טיפול ב-route params לאוטומציה
 * @recurring_errors וודא שה-navigation ו-route types תואמים
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
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "../../styles/theme";
import BackButton from "../../components/common/BackButton";
import { fakeGoogleSignIn } from "../../services/authService";
import { useUserStore } from "../../stores/userStore";

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
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

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

  useEffect(() => {
    // טעינת פרטים שמורים // Load saved credentials
    console.log("🔐 LoginScreen - useEffect triggered");
    loadSavedCredentials();

    // אנימציית כניסה // Entry animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start(() => {
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

  /**
   * מטפל בתהליך ההתחברות
   * Handles login process
   */
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

    // אנימציית לחיצה // Press animation
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

      // סימולציית התחברות // Login simulation
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
            navigation.reset({ index: 0, routes: [{ name: "Main" }] });
          }
        } else {
          console.log("🔐 LoginScreen - Login failed - invalid credentials ❌");
          setError("כתובת האימייל או הסיסמה שגויים");
          createShakeAnimation(shakeAnim).start();
        }
      }, 1200);
    } catch (e) {
      console.error("🔐 LoginScreen - Login error:", e);
      setLoading(false);
      setError("אירעה שגיאה בהתחברות");
    }
  };

  /**
   * מטפל בהתחברות עם Google
   * Handles Google authentication
   */
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
        navigation.reset({ index: 0, routes: [{ name: "Main" }] });
      }
    } catch (e) {
      console.error("🔐 LoginScreen - Google auth failed:", e);
      setError("ההתחברות עם Google נכשלה");
    } finally {
      setLoading(false);
    }
  };

  /**
   * מטפל בשחזור סיסמה
   * Handles password recovery
   */
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: "padding", android: undefined })}
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
          <Text style={styles.title}>ברוך הבא חזרה!</Text>
        </LinearGradient>

        <Text style={styles.subtitle}>התחבר כדי להמשיך באימונים שלך</Text>

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
                true: theme.colors.primaryGradientStart,
              }}
              thumbColor={rememberMe ? theme.colors.primary : "#f4f3f4"}
              disabled={loading}
            />
          </View>
          <TouchableOpacity onPress={handleForgotPassword} disabled={loading}>
            <Text style={styles.forgotPassword}>שכחתי סיסמה</Text>
          </TouchableOpacity>
        </View>

        {/* הודעת שגיאה כללית // General error message */}
        {error && (
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Text style={styles.errorText}>{error}</Text>
          </Animated.View>
        )}

        {/* כפתור התחברות // Login button */}
        <TouchableOpacity
          style={[styles.loginButton, loading && styles.loginButtonDisabled]}
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
              <ActivityIndicator color="#fff" />
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
          style={[styles.googleButton, loading && styles.googleButtonDisabled]}
          onPress={handleGoogleAuth}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Ionicons name="logo-google" size={22} color="#fff" />
          <Text style={styles.googleButtonText}>התחבר עם Google</Text>
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
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
    fontSize: 13,
    marginTop: 4,
    textAlign: "right",
  },
  optionsRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  rememberMe: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
  },
  rememberMeText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
  },
  forgotPassword: {
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
  loginButton: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  gradientButton: {
    paddingVertical: 14,
    alignItems: "center",
  },
  loginButtonText: {
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
  registerLink: {
    color: theme.colors.accent,
    fontWeight: "600",
    fontSize: 14,
  },
});
