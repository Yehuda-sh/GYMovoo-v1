/**
 * @file RegisterForm.tsx
 * @description טופס הרשמה לאפליקציה
 */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { theme } from "../../../styles/theme";
import { userApi } from "../../../services/api/userApi";
import type { RegisterCredentials } from "../types";
import { useUserStore } from "../../../stores/userStore";

interface RegisterFormProps {
  onRegisterSuccess: () => void;
  onLoginPress: () => void;
  onTermsPress?: () => void;
  onPrivacyPress?: () => void;
}

// טקסטים קבועים
const STRINGS = {
  placeholders: {
    name: "שם מלא",
    email: "כתובת אימייל",
    password: "סיסמה",
    confirmPassword: "אימות סיסמה",
  },
  buttons: {
    register: "הרשמה",
    registering: "מבצע הרשמה...",
  },
  ui: {
    agreeToTerms: "אני מסכים/ה לתנאי השימוש",
    viewTerms: "הצג תנאי שימוש",
    alreadyHaveAccount: "כבר יש לך חשבון?",
    loginNow: "התחבר עכשיו",
  },
  errors: {
    nameRequired: "נא להזין שם מלא",
    emailRequired: "נא להזין כתובת אימייל",
    emailInvalid: "כתובת אימייל לא תקינה",
    passwordRequired: "נא להזין סיסמה",
    passwordTooShort: "הסיסמה חייבת להכיל לפחות 6 תווים",
    passwordNoNumber: "הסיסמה חייבת להכיל לפחות ספרה אחת",
    passwordNoUppercase: "הסיסמה חייבת להכיל לפחות אות גדולה אחת",
    passwordNoSpecial: "הסיסמה חייבת להכיל לפחות תו מיוחד אחד",
    confirmPasswordRequired: "נא לאשר את הסיסמה",
    passwordsMismatch: "הסיסמאות אינן תואמות",
    termsRequired: "יש לאשר את תנאי השימוש כדי להירשם",
  },
};

// הוק מוק זמני עד שנשלים את useAuth
const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // פונקציית הרשמה מדמה
  const register = async (data: RegisterCredentials) => {
    setLoading(true);
    console.log("הרשמה עם:", data);

    // סימולציית עיכוב ברשת
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // אימות נתונים בסיסי
    const errors: Record<string, string> = {};

    if (!data.name || data.name.trim().length < 2) {
      errors.name = STRINGS.errors.nameRequired;
    }

    if (!data.email || !data.email.includes("@")) {
      errors.email = STRINGS.errors.emailInvalid;
    }

    if (!data.password || data.password.length < 6) {
      errors.password = STRINGS.errors.passwordTooShort;
    }

    if (data.password !== data.confirmPassword) {
      errors.confirmPassword = STRINGS.errors.passwordsMismatch;
    }

    if (!data.agreeToTerms) {
      errors.agreeToTerms = STRINGS.errors.termsRequired;
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setLoading(false);
      return false;
    }

    // סימולציית הרשמה מוצלחת
    setLoading(false);
    return true;
  };

  return {
    register,
    loading,
    error,
    setError,
    fieldErrors,
    setFieldErrors,
  };
};

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegisterSuccess,
  onLoginPress,
  onTermsPress,
  onPrivacyPress,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [autoFillCounter, setAutoFillCounter] = useState(0);

  // גישה ל-Store של המשתמש
  const { setUser } = useUserStore();

  // פונקציה למילוי אוטומטי של הטופס עם נתונים רנדומליים
  const fillWithRandomData = () => {
    const counter = autoFillCounter + 1;
    setAutoFillCounter(counter);

    // שמות רנדומליים באנגלית
    const randomNames = [
      "John Smith",
      "Emma Johnson",
      "Michael Brown",
      "Sarah Davis",
      "James Wilson",
      "Lisa Taylor",
      "Robert Miller",
      "Jennifer Moore",
      "David Anderson",
      "Michelle Thomas",
    ];

    // דומיינים רנדומליים לאימייל
    const randomDomains = [
      "gmail.com",
      "outlook.com",
      "yahoo.com",
      "hotmail.com",
      "icloud.com",
      "example.com",
      "mail.com",
    ];

    // בחירת שם רנדומלי
    const index = counter % randomNames.length;
    const randomName: string = randomNames[index] || "John Doe";

    // יצירת אימייל רנדומלי - מחליף רווחים בנקודה ומשתמש באות ראשונה של שם משפחה
    const nameParts = randomName.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts[1] || "";
    const namePart =
      firstName.toLowerCase() + "." + lastName.toLowerCase().charAt(0);
    const domain =
      randomDomains[counter % randomDomains.length] || "example.com";
    const randomEmail = `${namePart}${counter}@${domain}`;

    // סיסמה קבועה פשוטה
    const randomPassword = "12345678";

    // עדכון השדות
    setName(randomName);
    setEmail(randomEmail);
    setPassword(randomPassword);
    setConfirmPassword(randomPassword);
    setAgreeToTerms(true);
  };

  const { register, loading, error, setError, fieldErrors, setFieldErrors } =
    useRegister();

  // ניקוי שגיאות בעת שינוי קלט
  useEffect(() => {
    if (error) setError(null);
    if (Object.keys(fieldErrors).length > 0) setFieldErrors({});
  }, [
    name,
    email,
    password,
    confirmPassword,
    agreeToTerms,
    setError,
    error,
    fieldErrors,
    setFieldErrors,
  ]);

  // הצגת תנאי שימוש
  const handleViewTerms = () => {
    Alert.alert(
      "תנאי שימוש",
      "תנאי השימוש באפליקציה הם... (כאן יוצגו תנאי השימוש המלאים)",
      [{ text: "הבנתי", style: "default" }]
    );
  };

  // טיפול בהרשמה
  const handleRegister = async () => {
    const credentials: RegisterCredentials = {
      name,
      email,
      password,
      confirmPassword,
      agreeToTerms,
    };

    const success = await register(credentials);
    if (success) {
      console.log(
        "🔍 RegisterForm - Registration successful, calling onRegisterSuccess"
      );
      // עדכון ה-store של משתמש חדש
      const newUser: Record<string, unknown> = {
        email,
        name,
        id: `user_${Date.now()}`,
        provider: "manual",
      };

      // טיפול בנתוני שאלון אם יש
      try {
        // בדיקה אם יש נתוני שאלון ב-AsyncStorage
        const savedResults = await AsyncStorage.getItem(
          "smart_questionnaire_results"
        );
        if (savedResults) {
          console.log("🔍 Found questionnaire data in AsyncStorage");
          const smartData = JSON.parse(savedResults);
          // הוסף את נתוני השאלון למשתמש
          newUser.questionnaireData = smartData;
          // סמן את המשתמש כמי שהשלים את השאלון
          newUser.hasQuestionnaire = true;
        }

        // שמירת המשתמש ב-AsyncStorage
        await AsyncStorage.setItem("user", JSON.stringify(newUser));

        // סנכרון עם השרת
        try {
          console.log("🔄 Syncing user data with server...");

          // להדפיס את המידע שאנחנו שולחים לשרת
          // שליחת גם ID מקומי כדי לפתור את בעיית ה-NOT NULL בשרת
          const userData = {
            id: newUser.id, // שליחת ה-ID שיצרנו
            name: newUser.name,
            email: newUser.email,
            provider: newUser.provider || "manual",
            // העברת נתוני השאלון אם קיימים
            questionnaireData: newUser.questionnaireData,
            hasQuestionnaire: newUser.hasQuestionnaire,
          };
          console.log(
            "User data being sent to server:",
            JSON.stringify(userData, null, 2)
          );

          // יצירת משתמש חדש בשרת - שימוש בטיפוס User שמוגדר בפרויקט
          const serverUser = await userApi.create(userData);

          console.log("✅ User created in server with ID:", serverUser.id);

          // עדכון ה-id המקומי עם ה-id מהשרת
          newUser.id = serverUser.id;
          await AsyncStorage.setItem("user", JSON.stringify(newUser));
        } catch (serverError) {
          console.error("❌ Server sync failed:", serverError);
          // הצג פרטים נוספים על השגיאה
          if (serverError instanceof Error) {
            console.error("Error message:", serverError.message);
            console.error("Error stack:", serverError.stack);
          }
          // ממשיכים בתהליך גם אם נכשל הסנכרון עם השרת
        }

        // שמירת המשתמש במאגר מרכזי
        console.log("🔑 Saving user to central store:", {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          hasQuestionnaire: newUser.hasQuestionnaire,
        });
        setUser(newUser);
      } catch (error) {
        console.error("Error handling questionnaire data:", error);
      }

      onRegisterSuccess();
    }
  };

  return (
    <View style={styles.container}>
      {/* שדה שם */}
      <View style={styles.inputContainer}>
        <View
          style={[styles.inputWrapper, fieldErrors.name && styles.inputError]}
        >
          <Ionicons
            name="person-outline"
            size={22}
            color={theme.colors.textSecondary}
            style={styles.iconMargin}
          />
          <TextInput
            style={styles.input}
            placeholder={STRINGS.placeholders.name}
            placeholderTextColor={theme.colors.textSecondary}
            autoCapitalize="words"
            autoCorrect={false}
            value={name}
            onChangeText={setName}
            textAlign="right"
            editable={!loading}
          />
        </View>
        {fieldErrors.name && (
          <Text style={styles.fieldError}>{fieldErrors.name}</Text>
        )}
      </View>

      {/* שדה אימייל */}
      <View style={styles.inputContainer}>
        <View
          style={[styles.inputWrapper, fieldErrors.email && styles.inputError]}
        >
          <Ionicons
            name="mail-outline"
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
        {fieldErrors.password && (
          <Text style={styles.fieldError}>{fieldErrors.password}</Text>
        )}
      </View>

      {/* שדה אימות סיסמה */}
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
            placeholder={STRINGS.placeholders.confirmPassword}
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
        {fieldErrors.confirmPassword && (
          <Text style={styles.fieldError}>{fieldErrors.confirmPassword}</Text>
        )}
      </View>

      {/* תנאי שימוש */}
      <View style={styles.termsContainer}>
        <View style={styles.termsRow}>
          <View style={styles.termsTextContainer}>
            <Text
              style={[
                styles.termsText,
                fieldErrors.agreeToTerms && styles.termsError,
              ]}
            >
              אני מסכים/ה ל
              <Text style={styles.termsLink} onPress={onTermsPress}>
                תנאי השימוש
              </Text>{" "}
              ול
              <Text style={styles.termsLink} onPress={onPrivacyPress}>
                מדיניות הפרטיות
              </Text>
            </Text>
          </View>
          <Switch
            value={agreeToTerms}
            onValueChange={setAgreeToTerms}
            trackColor={{
              false: theme.colors.divider,
              true: theme.colors.primary,
            }}
            thumbColor={agreeToTerms ? theme.colors.primary : "#f4f3f4"}
            disabled={loading}
          />
        </View>

        <TouchableOpacity onPress={handleViewTerms} disabled={loading}>
          <Text style={styles.viewTermsText}>{STRINGS.ui.viewTerms}</Text>
        </TouchableOpacity>

        {fieldErrors.agreeToTerms && (
          <Text style={styles.fieldError}>{fieldErrors.agreeToTerms}</Text>
        )}
      </View>

      {/* הודעת שגיאה */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* כפתור למילוי אוטומטי - רק במצב פיתוח */}
      {__DEV__ && (
        <TouchableOpacity
          style={styles.autoFillButton}
          onPress={fillWithRandomData}
          disabled={loading}
        >
          <Text style={styles.autoFillButtonText}>מילוי אוטומטי 🧙‍♂️</Text>
        </TouchableOpacity>
      )}

      {/* כפתור הרשמה */}
      <TouchableOpacity
        style={[styles.registerButton, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
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
              <Text style={styles.buttonText}>
                {STRINGS.buttons.registering}
              </Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>{STRINGS.buttons.register}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {/* קישור להתחברות */}
      <View style={styles.linkRow}>
        <Text style={styles.linkText}>{STRINGS.ui.alreadyHaveAccount}</Text>
        <TouchableOpacity onPress={onLoginPress} disabled={loading}>
          <Text style={styles.loginLink}>{STRINGS.ui.loginNow}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
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
  termsContainer: {
    marginBottom: theme.spacing.lg,
  },
  termsRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  termsTextContainer: {
    flex: 1,
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  termsText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    marginStart: theme.spacing.sm,
  },
  termsLink: {
    color: theme.colors.primary,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  termsError: {
    color: theme.colors.error,
  },
  viewTermsText: {
    color: theme.colors.primary,
    fontSize: 14,
    marginTop: theme.spacing.xs,
    textAlign: "right",
  },
  errorText: {
    color: theme.colors.error,
    textAlign: "center",
    marginBottom: theme.spacing.md,
    fontSize: 14,
    fontWeight: "500",
  },
  autoFillButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: theme.radius.xl,
    padding: 12,
    alignItems: "center",
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  autoFillButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  registerButton: {
    marginVertical: theme.spacing.lg,
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
    fontSize: 15,
  },
  loginLink: {
    color: theme.colors.primary,
    fontWeight: "600",
    fontSize: 15,
  },
});
