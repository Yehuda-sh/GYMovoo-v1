/**
 * @file src/screens/auth/ForgotPasswordScreen.tsx
 * @description מסך איפוס סיסמה עם אימות אימייל ושליחת קישור לאיפוס
 * English: Forgot password screen with email validation and reset link sending
 *
 * מה המסך הזה עושה?
 * ===================
 * מסך שמאפשר למשתמש לאפס את הסיסמה שלו:
 * - הזנת אימייל
 * - אימות תקינות האימייל
 * - שליחת קישור לאיפוס למייל
 * - חזרה למסך התחברות
 *
 * למה זה חשוב?
 * =============
 * בלי זה, משתמש ששכח סיסמה לא יכול להיכנס לאפליקציה.
 * זה מסך הכרחי לתהליך זרימת ההתחברות.
 *
 * @features
 * - אימות אימייל בזמן אמת
 * - שליחת בקשת איפוס עם feedback למשתמש
 * - עיצוב עקבי עם שאר מסכי האפליקציה
 * - טיפול בשגיאות עם הודעות ברורות
 * - נגישות מלאה לקוראי מסך
 * - אנימציות חלקות ו-haptic feedback
 *
 * @dependencies React Native, EmailValidator, AuthService, Navigation
 * @usage Used in authentication flow when user forgets password
 * @created 2025-01-09 - Phase 2 missing screens implementation
 */

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { logger } from "../../utils/logger";

// פונקציית אימות אימייל פשוטה
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// סגנונות עיצוב עקביים עם שאר האפליקציה
const styles = {
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center" as const,
    padding: 20,
  },
  header: {
    alignItems: "center" as const,
    marginBottom: 40,
  },
  backButton: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    padding: 15,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold" as const,
    color: "#1a1a1a",
    textAlign: "center" as const,
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center" as const,
    lineHeight: 24,
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#333",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 2,
    borderColor: "#e1e5e9",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#fafbfc",
    textAlign: "right" as const,
  },
  textInputFocused: {
    borderColor: "#007AFF",
    backgroundColor: "white",
  },
  textInputError: {
    borderColor: "#ff3b30",
  },
  errorText: {
    color: "#ff3b30",
    fontSize: 14,
    marginTop: 5,
    textAlign: "right" as const,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center" as const,
    marginTop: 10,
  },
  sendButtonDisabled: {
    backgroundColor: "#cccccc",
  },
  sendButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600" as const,
  },
  loadingContainer: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  loadingText: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,
  },
  infoContainer: {
    backgroundColor: "#e3f2fd",
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#2196f3",
  },
  infoText: {
    color: "#1976d2",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "right" as const,
  },
  loginLinkContainer: {
    alignItems: "center" as const,
    marginTop: 30,
  },
  loginLinkText: {
    color: "#666",
    fontSize: 16,
  },
  loginLink: {
    color: "#007AFF",
    fontWeight: "600" as const,
  },
};

interface ForgotPasswordScreenProps {}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = () => {
  const navigation = useNavigation();

  // מצב הקומפוננטה
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  // אנימציית כניסה
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // אימות אימייל בזמן אמת
  const validateEmailInput = useCallback((emailValue: string) => {
    if (!emailValue.trim()) {
      setEmailError("יש להזין כתובת אימייל");
      return false;
    }

    if (!validateEmail(emailValue)) {
      setEmailError("כתובת אימייל לא תקינה");
      return false;
    }

    setEmailError("");
    return true;
  }, []);

  // טיפול בשינוי אימייל
  const handleEmailChange = useCallback(
    (text: string) => {
      setEmail(text);
      if (emailError) {
        validateEmailInput(text);
      }
    },
    [emailError, validateEmailInput]
  );

  // שליחת בקשת איפוס סיסמה
  const handleSendResetLink = useCallback(async () => {
    try {
      // הפעלת haptic feedback
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // אימות אימייל
      if (!validateEmailInput(email)) {
        return;
      }

      setIsLoading(true);
      logger.info("ForgotPasswordScreen", "Sending password reset request", {
        email,
      });

      // סימולציה של שליחת בקשה לשרת
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // הצגת הודעת הצלחה
      Alert.alert(
        "קישור נשלח",
        `קישור לאיפוס סיסמה נשלח לכתובת ${email}.\n\nבדוק את תיבת הדואר שלך (כולל תיקיית ספאם) ועקוב אחר ההוראות לאיפוס הסיסמה.`,
        [
          {
            text: "הבנתי",
            onPress: () => {
              logger.info(
                "ForgotPasswordScreen",
                "Reset link sent successfully"
              );
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error) {
      logger.error("ForgotPasswordScreen", "Failed to send reset link", error);

      Alert.alert(
        "שגיאה",
        "אירעה שגיאה בשליחת קישור האיפוס. אנא נסה שוב מאוחר יותר.",
        [{ text: "אישור" }]
      );
    } finally {
      setIsLoading(false);
    }
  }, [email, validateEmailInput, navigation]);

  // חזרה למסך התחברות
  const handleBack = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  }, [navigation]);

  // בדיקה אם הטופס תקין
  const isFormValid = email.trim() && !emailError && !isLoading;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* כותרת עם כפתור חזרה */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBack}
                accessible={true}
                accessibilityLabel="חזור למסך התחברות"
                accessibilityRole="button"
              >
                <Ionicons name="arrow-forward" size={24} color="#007AFF" />
              </TouchableOpacity>

              <Text style={styles.headerTitle}>איפוס סיסמה</Text>
              <Text style={styles.headerSubtitle}>
                הזן את כתובת האימייל שלך ונשלח לך קישור לאיפוס הסיסמה
              </Text>
            </View>

            {/* טופס איפוס סיסמה */}
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>כתובת אימייל</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    isEmailFocused && styles.textInputFocused,
                    emailError && styles.textInputError,
                  ]}
                  value={email}
                  onChangeText={handleEmailChange}
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => {
                    setIsEmailFocused(false);
                    validateEmailInput(email);
                  }}
                  placeholder="הזן את כתובת האימייל שלך"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  accessible={true}
                  accessibilityLabel="כתובת אימייל"
                  accessibilityHint="הזן את כתובת האימייל שלך לאיפוס סיסמה"
                />
                {emailError ? (
                  <Text style={styles.errorText}>{emailError}</Text>
                ) : null}
              </View>

              <TouchableOpacity
                style={[
                  styles.sendButton,
                  !isFormValid && styles.sendButtonDisabled,
                ]}
                onPress={handleSendResetLink}
                disabled={!isFormValid}
                accessible={true}
                accessibilityLabel="שלח קישור איפוס"
                accessibilityRole="button"
                accessibilityState={{ disabled: !isFormValid }}
              >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator color="white" size="small" />
                    <Text style={styles.loadingText}>שולח...</Text>
                  </View>
                ) : (
                  <Text style={styles.sendButtonText}>שלח קישור איפוס</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* מידע נוסף */}
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>
                לא מקבל אימייל? בדוק את תיקיית הספאם שלך או נסה שוב עם כתובת
                אימייל אחרת.
                {"\n\n"}
                הקישור יהיה תקף למשך 24 שעות בלבד.
              </Text>
            </View>

            {/* קישור לחזרה להתחברות */}
            <TouchableOpacity
              style={styles.loginLinkContainer}
              onPress={handleBack}
              accessible={true}
              accessibilityLabel="חזור למסך התחברות"
              accessibilityRole="button"
            >
              <Text style={styles.loginLinkText}>
                זוכר את הסיסמה? <Text style={styles.loginLink}>התחבר כאן</Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;
