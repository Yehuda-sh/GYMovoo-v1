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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../../core/theme";
import { useAuth } from "../hooks/useAuth";
import type { RegisterCredentials } from "../types";

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
    confirmPasswordRequired: "נא לאשר את הסיסמה",
    passwordsMismatch: "הסיסמאות אינן תואמות",
    termsRequired: "יש לאשר את תנאי השימוש כדי להירשם",
  },
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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const { register, isLoading } = useAuth();

  // ניקוי שגיאות בעת שינוי קלט
  useEffect(() => {
    if (Object.keys(fieldErrors).length > 0) setFieldErrors({});
  }, [name, email, password, confirmPassword, agreeToTerms, fieldErrors]);

  // טיפול בהרשמה
  const handleRegister = async () => {
    // ניקוי שגיאות קודמות
    setFieldErrors({});

    // אימות בסיסי
    const errors: Record<string, string> = {};

    if (!name || name.trim().length < 2) {
      errors.name = STRINGS.errors.nameRequired;
    }

    if (!email || !email.includes("@")) {
      errors.email = STRINGS.errors.emailInvalid;
    }

    if (!password || password.length < 6) {
      errors.password = STRINGS.errors.passwordTooShort;
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = STRINGS.errors.passwordsMismatch;
    }

    if (!agreeToTerms) {
      errors.agreeToTerms = STRINGS.errors.termsRequired;
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      const credentials: RegisterCredentials = {
        name,
        email,
        password,
        confirmPassword,
        agreeToTerms,
      };

      await register(credentials);
      onRegisterSuccess();
    } catch (error) {
      console.error("Registration failed:", error);
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
            editable={!isLoading}
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
            editable={!isLoading}
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
            disabled={isLoading}
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
            editable={!isLoading}
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
            disabled={isLoading}
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
            editable={!isLoading}
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
            disabled={isLoading}
          />
        </View>

        <TouchableOpacity disabled={isLoading}>
          <Text style={styles.viewTermsText}>{STRINGS.ui.viewTerms}</Text>
        </TouchableOpacity>

        {fieldErrors.agreeToTerms && (
          <Text style={styles.fieldError}>{fieldErrors.agreeToTerms}</Text>
        )}
      </View>

      {/* הודעת שגיאה */}
      {/* כפתור הרשמה */}
      <TouchableOpacity
        style={[styles.registerButton, isLoading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={isLoading}
      >
        {isLoading ? (
          <View style={styles.isLoadingContainer}>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={styles.buttonText}>{STRINGS.buttons.registering}</Text>
          </View>
        ) : (
          <Text style={styles.buttonText}>{STRINGS.buttons.register}</Text>
        )}
      </TouchableOpacity>

      {/* קישור להתחברות */}
      <View style={styles.linkRow}>
        <Text style={styles.linkText}>{STRINGS.ui.alreadyHaveAccount}</Text>
        <TouchableOpacity onPress={onLoginPress} disabled={isLoading}>
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
  registerButton: {
    marginVertical: theme.spacing.lg,
    borderRadius: theme.radius.xl,
    overflow: "hidden",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  isLoadingContainer: {
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
