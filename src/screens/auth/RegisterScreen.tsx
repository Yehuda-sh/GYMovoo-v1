/**
 * @file src/screens/auth/RegisterScreen.tsx
 * @description מסך הרשמה - שדות אימייל, סיסמה, אישור תנאים, Google, RTL ו־Theme.
 * English: Registration screen with email, password, terms, Google, RTL, theme.
 */

import React, { useState } from "react";
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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import { fakeGoogleRegister } from "../../services/authService";
import { useUserStore } from "../../stores/userStore";

export default function RegisterScreen() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [is16Plus, setIs16Plus] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setLoading(false);
      if (!email || !password) {
        setError("נא למלא אימייל וסיסמה");
        return;
      }
      if (password.length < 6) {
        setError("הסיסמה חייבת להיות לפחות 6 תווים");
        return;
      }
      if (!is16Plus) {
        setError("ההרשמה מותרת רק מגיל 16 ומעלה");
        return;
      }
      // הצלחה: העבר לשאלון
      useUserStore.getState().setUser({ email, name: "משתמש חדש" });
      navigation.reset({ index: 0, routes: [{ name: "Questionnaire" }] });
    }, 900);
  };

  // דמו Google Register (אותה לוגיקה, יפנה לשאלון!)
  const handleGoogleRegister = async () => {
    setLoading(true);
    try {
      const googleUser = await fakeGoogleRegister();
      if (!googleUser.age || googleUser.age < 16) {
        setError("ההרשמה מותרת רק מגיל 16 ומעלה");
        return;
      }
      useUserStore.getState().setUser(googleUser);
      navigation.reset({ index: 0, routes: [{ name: "Questionnaire" }] });
    } catch (e) {
      setError("הרשמה עם גוגל נכשלה");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <View style={styles.formBox}>
        <Text style={styles.title}>הרשמה</Text>
        <View style={styles.inputWrapper}>
          <MaterialIcons
            name="email"
            size={22}
            color={theme.colors.accent}
            style={{ marginLeft: 6 }}
          />
          <TextInput
            style={styles.input}
            placeholder="אימייל"
            placeholderTextColor={theme.colors.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            textAlign="right"
          />
        </View>
        <View style={styles.inputWrapper}>
          <Ionicons
            name="lock-closed"
            size={22}
            color={theme.colors.accent}
            style={{ marginLeft: 6 }}
          />
          <TextInput
            style={styles.input}
            placeholder="סיסמה (לפחות 6 תווים)"
            placeholderTextColor={theme.colors.textSecondary}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            value={password}
            onChangeText={setPassword}
            textAlign="right"
          />
        </View>
        <View style={styles.switchRow}>
          <Switch
            value={is16Plus}
            onValueChange={setIs16Plus}
            trackColor={{ false: "#555", true: theme.colors.accent }}
            thumbColor={is16Plus ? theme.colors.primary : "#eee"}
          />
          <Text style={styles.switchLabel}>אני בן/בת 16 ומעלה</Text>
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.registerButtonText}>הרשמה</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleRegister}
          disabled={loading}
        >
          <Ionicons name="logo-google" size={22} color="#fff" />
          <Text style={styles.googleButtonText}>הרשמה עם Google</Text>
        </TouchableOpacity>
        <View style={styles.linkRow}>
          <Text style={styles.linkText}>כבר יש לך חשבון?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginLink}>התחברות</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.md,
  },
  formBox: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  title: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 18,
    textAlign: "center",
    writingDirection: "rtl",
  },
  inputWrapper: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: theme.colors.backgroundAlt,
    borderRadius: theme.borderRadius.md,
    marginBottom: 14,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  input: {
    flex: 1,
    height: 46,
    color: theme.colors.text,
    fontSize: 17,
    textAlign: "right",
    paddingVertical: 0,
    backgroundColor: "transparent",
  },
  switchRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 9,
    gap: 8,
  },
  switchLabel: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    marginRight: 9,
    writingDirection: "rtl",
  },
  errorText: {
    color: "#ff4757",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 15,
    fontWeight: "500",
  },
  registerButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 14,
    marginBottom: 12,
    marginTop: 6,
    alignItems: "center",
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 1,
  },
  googleButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#ea4335",
    borderRadius: theme.borderRadius.md,
    paddingVertical: 12,
    justifyContent: "center",
    marginBottom: 14,
    gap: 8,
  },
  googleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  linkRow: {
    flexDirection: "row-reverse",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    gap: 5,
  },
  linkText: {
    color: theme.colors.textSecondary,
    fontSize: 15,
  },
  loginLink: {
    color: theme.colors.accent,
    fontWeight: "700",
    fontSize: 15,
    marginRight: 6,
    textDecorationLine: "underline",
  },
});
