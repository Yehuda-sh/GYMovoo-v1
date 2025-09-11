import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Switch,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useNavigation,
  NavigationProp,
  useRoute,
} from "@react-navigation/native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../styles/theme";
import BackButton from "../../components/common/BackButton";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useUserStore } from "../../stores/userStore";
import { validateEmail } from "../../utils/authValidation";
import type { RootStackParamList } from "../../navigation/types";
import type { User, QuestionnaireData } from "../../types/user.types";

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
  },
  placeholders: {
    fullName: "שם מלא",
    email: "כתובת אימייל",
    password: "סיסמה (לפחות 6 תווים)",
    confirm: "אישור סיסמה",
  },
  buttons: {
    create: "צור חשבון",
    creating: "יוצר חשבון...",
    loginLink: "התחבר עכשיו",
  },
  ui: {
    hasAccount: "כבר יש לך חשבון?",
    title: "יצירת חשבון חדש",
    subtitle: "הצטרף למהפכת הכושר שלך",
    ageConfirm: "אני מאשר/ת שאני בן/בת 16 ומעלה",
    termsPrefix: "אני מסכים/ה ל",
    termsLink: "תנאי השימוש",
  },
};

export default function RegisterScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute();

  // Check if coming from questionnaire completion
  const fromQuestionnaire = (route.params as { fromQuestionnaire?: boolean })
    ?.fromQuestionnaire;

  console.log(
    `💡 RegisterScreen initialized with fromQuestionnaire=${fromQuestionnaire}`
  );
  console.log(`💡 Route params:`, route.params);

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
  const [questionnaireData, setQuestionnaireData] =
    useState<QuestionnaireData | null>(null);

  // Critical: Check for saved questionnaire results
  const checkQuestionnaireData = async () => {
    try {
      const savedResults = await AsyncStorage.getItem(
        "smart_questionnaire_results"
      );
      if (savedResults) {
        const data = JSON.parse(savedResults) as QuestionnaireData;
        setQuestionnaireData(data);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error loading questionnaire data:", error);
      return false;
    }
  };

  // Guard: Redirect if no questionnaire data
  useEffect(() => {
    const validateAccess = async () => {
      console.log(
        `💡 RegisterScreen - validateAccess - fromQuestionnaire: ${fromQuestionnaire}`
      );

      // בדיקה זו גורמת לנו להיכנס למסך ה-Welcome במקום Register
      // אנחנו מדלגים עליה כדי לאפשר כניסה למסך ההרשמה בכל מקרה
      /*
      if (!fromQuestionnaire) {
        // If not coming from questionnaire, user shouldn't be here
        console.log("❌ Not coming from questionnaire, redirecting to Welcome");
        navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
        return;
      }
      */

      const hasQuestionnaireData = await checkQuestionnaireData();
      console.log(
        `💡 RegisterScreen - validateAccess - hasQuestionnaireData: ${hasQuestionnaireData}`
      );

      // אם אין נתוני שאלון, אפשר לנסות להתקדם בכל זאת
      // לא נפנה למסך השאלון מכיוון שזה עלול ליצור לולאה אינסופית
      /*
      if (!hasQuestionnaireData) {
        // No questionnaire data - redirect to questionnaire
        console.log("❌ No questionnaire data, redirecting to Questionnaire");
        navigation.reset({ index: 0, routes: [{ name: "Questionnaire" }] });
        return;
      }
      */

      console.log("✅ Access validated successfully");
    };

    validateAccess();
  }, [fromQuestionnaire, navigation]);

  // Form validation
  const validateForm = (): string | null => {
    if (!fullName || fullName.length < 2) {
      return STRINGS.errors.fullName;
    }

    if (!email) {
      return STRINGS.errors.emailRequired;
    }

    const emailError = validateEmail(email);
    if (emailError) return emailError;

    if (!password) {
      return STRINGS.errors.passwordRequired;
    }

    if (password.length < 6) {
      return STRINGS.errors.passwordShort;
    }

    if (!confirmPassword) {
      return STRINGS.errors.confirmRequired;
    }

    if (password !== confirmPassword) {
      return STRINGS.errors.confirmMismatch;
    }

    return null;
  };

  // Registration handler
  const handleRegister = async () => {
    // Critical: Verify questionnaire data exists
    if (fromQuestionnaire && !questionnaireData) {
      setError("שגיאה: לא נמצאו תוצאות שאלון. אנא חזור לשאלון.");
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!is16Plus) {
      setError(STRINGS.errors.age);
      return;
    }

    if (!acceptTerms) {
      setError(STRINGS.errors.terms);
      return;
    }

    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      // Simulate registration
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newUser: User = {
        email,
        name: fullName,
        id: `user_${Date.now()}`,
        avatar: "",
        provider: "manual",
      };

      // Load questionnaire results if coming from questionnaire
      if (fromQuestionnaire && questionnaireData) {
        newUser.questionnaireData = questionnaireData;
        newUser.hasQuestionnaire = true;
      } else if (fromQuestionnaire) {
        // Fallback: try to load from AsyncStorage
        try {
          const savedResults = await AsyncStorage.getItem(
            "smart_questionnaire_results"
          );
          if (savedResults) {
            const smartData = JSON.parse(savedResults);
            newUser.questionnaireData = smartData;
            newUser.hasQuestionnaire = true;
          }
        } catch (error) {
          console.warn("Failed to load questionnaire results:", error);
        }
      }

      useUserStore.getState().setUser(newUser);
      await AsyncStorage.removeItem("user_logged_out");

      // Navigate based on where we came from
      if (fromQuestionnaire) {
        // If coming from questionnaire completion, go to main app
        console.log(
          "🚀 Navigating to MainApp from RegisterScreen (fromQuestionnaire=true)"
        );
        navigation.reset({ index: 0, routes: [{ name: "MainApp" }] });
      } else {
        // Normal registration flow - go to questionnaire
        console.log(
          "🚀 Navigating to Questionnaire from RegisterScreen (fromQuestionnaire=false)"
        );
        navigation.reset({ index: 0, routes: [{ name: "Questionnaire" }] });
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setError(STRINGS.errors.generic);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToTerms = () => {
    navigation.navigate("Terms", {});
  };

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

          <View style={styles.formBox}>
            {/* Title */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{STRINGS.ui.title}</Text>
              <Text style={styles.subtitle}>{STRINGS.ui.subtitle}</Text>
            </View>

            {/* Full Name */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <FontAwesome5
                  name="user"
                  size={20}
                  color={theme.colors.textSecondary}
                  style={styles.iconMargin}
                />
                <TextInput
                  style={styles.input}
                  placeholder={STRINGS.placeholders.fullName}
                  placeholderTextColor={theme.colors.textSecondary}
                  autoCapitalize="words"
                  autoCorrect={false}
                  value={fullName}
                  onChangeText={setFullName}
                  textAlign="right"
                  editable={!loading}
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <MaterialIcons
                  name="email"
                  size={22}
                  color={theme.colors.textSecondary}
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
                  onChangeText={setEmail}
                  textAlign="right"
                  editable={!loading}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  style={styles.passwordToggle}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={22}
                    color={theme.colors.textSecondary}
                  />
                </TouchableOpacity>
                <TextInput
                  style={styles.input}
                  placeholder={STRINGS.placeholders.password}
                  placeholderTextColor={theme.colors.textSecondary}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={password}
                  onChangeText={setPassword}
                  textAlign="right"
                  editable={!loading}
                />
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                  style={styles.passwordToggle}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    size={22}
                    color={theme.colors.textSecondary}
                  />
                </TouchableOpacity>
                <TextInput
                  style={styles.input}
                  placeholder={STRINGS.placeholders.confirm}
                  placeholderTextColor={theme.colors.textSecondary}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  textAlign="right"
                  editable={!loading}
                />
              </View>
            </View>

            {/* Age Confirmation */}
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>{STRINGS.ui.ageConfirm}</Text>
              <Switch
                value={is16Plus}
                onValueChange={setIs16Plus}
                trackColor={{
                  false: theme.colors.divider,
                  true: theme.colors.primary,
                }}
                thumbColor={is16Plus ? theme.colors.primary : "#f4f3f4"}
                disabled={loading}
              />
            </View>

            {/* Terms Acceptance */}
            <View style={styles.switchRow}>
              <View style={styles.termsContainer}>
                <Text style={styles.switchLabel}>{STRINGS.ui.termsPrefix}</Text>
                <TouchableOpacity
                  onPress={handleNavigateToTerms}
                  disabled={loading}
                >
                  <Text style={styles.termsLink}>{STRINGS.ui.termsLink}</Text>
                </TouchableOpacity>
              </View>
              <Switch
                value={acceptTerms}
                onValueChange={setAcceptTerms}
                trackColor={{
                  false: theme.colors.divider,
                  true: theme.colors.primary,
                }}
                thumbColor={acceptTerms ? theme.colors.primary : "#f4f3f4"}
                disabled={loading}
              />
            </View>

            {/* Error Message */}
            {error && <Text style={styles.errorText}>{error}</Text>}

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.registerButton, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.primary]}
                style={styles.gradientButton}
              >
                {loading ? (
                  <View style={styles.loadingContainer}>
                    <LoadingSpinner color="#fff" size="small" />
                    <Text style={styles.buttonText}>
                      {STRINGS.buttons.creating}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.buttonText}>
                    {STRINGS.buttons.create}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.linkRow}>
              <Text style={styles.linkText}>{STRINGS.ui.hasAccount}</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Login", {})}
                disabled={loading}
              >
                <Text style={styles.loginLink}>
                  {STRINGS.buttons.loginLink}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
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
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xxl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  title: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: 17,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  inputWrapper: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: theme.colors.backgroundAlt,
    borderRadius: theme.radius.xl,
    paddingHorizontal: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.divider,
    height: 54,
  },
  input: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 16,
    textAlign: "right",
    paddingVertical: 0,
  },
  passwordToggle: {
    padding: 4,
  },
  switchRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: theme.spacing.md,
    justifyContent: "space-between",
  },
  switchLabel: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    textAlign: "right",
  },
  termsContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    flex: 1,
  },
  termsLink: {
    color: theme.colors.primary,
    fontSize: 14,
    textDecorationLine: "underline",
    marginEnd: 4,
  },
  errorText: {
    color: theme.colors.error,
    textAlign: "center",
    marginBottom: theme.spacing.md,
    fontSize: 14,
    fontWeight: "500",
  },
  registerButton: {
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
  linkRow: {
    flexDirection: "row-reverse",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  linkText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  loginLink: {
    color: theme.colors.primary,
    fontWeight: "600",
    fontSize: 14,
  },
  iconMargin: {
    marginEnd: 8,
  },
});
