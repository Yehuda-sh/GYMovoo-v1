/**
 * @file LoginForm.tsx
 * @description טופס התחברות לאפליקציה
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
import type { LoginCredentials } from "../types";

interface LoginFormProps {
  onLoginSuccess: () => void;
  onForgotPassword: () => void;
  onRegisterPress: () => void;
}

// טקסטים קבועים
const STRINGS = {
  placeholders: {
    email: "כתובת אימייל",
    password: "סיסמה",
  },
  buttons: {
    login: "התחבר",
    loggingIn: "מתחבר...",
    forgotPassword: "שכחתי סיסמה",
  },
  ui: {
    rememberMe: "זכור אותי",
    noAccount: "אין לך חשבון עדיין?",
    registerNow: "הרשם עכשיו",
  },
};

export const LoginForm: React.FC<LoginFormProps> = ({
  onLoginSuccess,
  onForgotPassword,
  onRegisterPress,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const { login, isLoading } = useAuth();

  // ניקוי שגיאות בעת שינוי קלט
  useEffect(() => {
    if (Object.keys(fieldErrors).length > 0) {
      setFieldErrors({});
    }
    if (error) {
      setError(null);
    }
  }, [email, password, fieldErrors, error]);

  // טיפול בהתחברות
  const handleLogin = async () => {
    try {
      const credentials: LoginCredentials = {
        email,
        password,
        rememberMe,
      };

      await login(credentials, rememberMe);
      onLoginSuccess();
    } catch (loginError) {
      setError("שגיאה בהתחברות");
      console.error("Login failed:", loginError);
    }
  };

  return (
    <View style={styles.container}>
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

      {/* אפשרויות נוספות */}
      <View style={styles.optionsRow}>
        <View style={styles.rememberMeContainer}>
          <Text style={styles.rememberMeText}>{STRINGS.ui.rememberMe}</Text>
          <Switch
            value={rememberMe}
            onValueChange={setRememberMe}
            trackColor={{
              false: theme.colors.divider,
              true: theme.colors.primary,
            }}
            thumbColor={rememberMe ? theme.colors.primary : "#f4f3f4"}
            disabled={isLoading}
          />
        </View>
        <TouchableOpacity
          onPress={onForgotPassword}
          disabled={isLoading}
          style={styles.forgotPasswordLink}
        >
          <Text style={styles.forgotPasswordText}>
            {STRINGS.buttons.forgotPassword}
          </Text>
        </TouchableOpacity>
      </View>

      {/* הודעת שגיאה */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* כפתור התחברות */}
      <TouchableOpacity
        style={[
          styles.loginButton,
          isLoading && styles.buttonDisabled,
          styles.loginButtonBackground,
        ]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={styles.buttonText}>{STRINGS.buttons.loggingIn}</Text>
          </View>
        ) : (
          <Text style={styles.buttonText}>{STRINGS.buttons.login}</Text>
        )}
      </TouchableOpacity>

      {/* קישור להרשמה */}
      <View style={styles.linkRow}>
        <Text style={styles.linkText}>{STRINGS.ui.noAccount}</Text>
        <TouchableOpacity onPress={onRegisterPress} disabled={isLoading}>
          <Text style={styles.registerLink}>{STRINGS.ui.registerNow}</Text>
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
  optionsRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  rememberMeContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  rememberMeText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    marginStart: theme.spacing.sm,
  },
  forgotPasswordLink: {
    padding: 4,
  },
  forgotPasswordText: {
    color: theme.colors.primary,
    fontSize: 14,
  },
  errorText: {
    color: theme.colors.error,
    textAlign: "center",
    marginBottom: theme.spacing.md,
    fontSize: 14,
    fontWeight: "500",
  },
  loginButton: {
    marginBottom: theme.spacing.lg,
    borderRadius: theme.radius.xl,
    overflow: "hidden",
  },
  loginButtonBackground: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 18,
    alignItems: "center",
    minHeight: 56,
  },
  buttonDisabled: {
    opacity: 0.7,
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
  registerLink: {
    color: theme.colors.primary,
    fontWeight: "600",
    fontSize: 15,
  },
});
