/**
 * @file src/screens/auth/LoginScreen.tsx
 * @description מסך התחברות - אימייל/סיסמה, התחברות עם Google, תמיכה ב־RTL ועיצוב Theme
 * English: Login screen with email/password, Google sign-in, RTL and theme support.
 */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import BackButton from "../../components/common/BackButton";
import { fakeGoogleSignIn } from "../../services/authService";
import { useUserStore } from "../../stores/userStore";

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // הפעלת Google אוטומטי אם הגיע עם google: true
  useEffect(() => {
    if (route?.params?.google) {
      handleGoogleAuth();
    }
  }, [route?.params?.google]);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setLoading(false);
      if (email === "test@example.com" && password === "123456") {
        // צריך לבדוק אם ענה על שאלון
        const user = { email, name: "משתמש לדוג'" }; // תוכל למשוך מ־DB אמיתי
        useUserStore.getState().setUser(user);
        navigation.reset({ index: 0, routes: [{ name: "Main" }] });
      } else {
        setError("פרטי התחברות שגויים");
      }
    }, 900);
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const googleUser = await fakeGoogleSignIn();
      useUserStore.getState().setUser(googleUser);
      // אם אין גיל/שאלון → שאלון; אם יש → Main
      if (
        !googleUser.questionnaire ||
        !googleUser.questionnaire[0] ||
        googleUser.questionnaire[0] === "מתחת ל-16"
      ) {
        navigation.reset({ index: 0, routes: [{ name: "Questionnaire" }] });
      } else {
        navigation.reset({ index: 0, routes: [{ name: "Main" }] });
      }
    } catch (e) {
      setError("התחברות עם גוגל נכשלה");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <BackButton />
      <View style={styles.formBox}>
        <Text style={styles.title}>התחברות</Text>
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
            placeholder="סיסמה"
            placeholderTextColor={theme.colors.textSecondary}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            value={password}
            onChangeText={setPassword}
            textAlign="right"
          />
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>התחבר</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleAuth}
          disabled={loading}
        >
          <Ionicons name="logo-google" size={22} color="#fff" />
          <Text style={styles.googleButtonText}>התחבר עם Google</Text>
        </TouchableOpacity>
        <View style={styles.linkRow}>
          <Text style={styles.linkText}>אין לך חשבון?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.registerLink}>הרשמה</Text>
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
  errorText: {
    color: "#ff4757",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 15,
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: 14,
    marginBottom: 12,
    marginTop: 6,
    alignItems: "center",
  },
  loginButtonText: {
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
  registerLink: {
    color: theme.colors.accent,
    fontWeight: "700",
    fontSize: 15,
    marginRight: 6,
    textDecorationLine: "underline",
  },
});
