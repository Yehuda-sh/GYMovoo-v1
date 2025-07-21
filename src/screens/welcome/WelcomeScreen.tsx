/**
 * @file src/screens/welcome/WelcomeScreen.tsx
 * @brief מסך פתיחה ראשי של האפליקציה עם אפשרויות הרשמה והתחברות
 * @dependencies userStore (Zustand), React Navigation, Expo Linear Gradient
 * @notes כולל אנימציות fade-in, Google Sign-in מדומה, ומונה משתמשים פעילים
 * @recurring_errors חסר RTL במספר מקומות, flexDirection צריך להיות row-reverse
 */

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
  ActivityIndicator,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../styles/theme";
import { useUserStore } from "../../stores/userStore";

const { width: screenWidth } = Dimensions.get("window");

export default function WelcomeScreen() {
  const navigation = useNavigation<any>();
  const { setUser } = useUserStore();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [activeUsers] = useState(Math.floor(Math.random() * 2000) + 8000);

  // אנימציות // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.9)).current;
  const counterAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // אנימציית fade in // Fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(counterAnimation, {
        toValue: 1,
        duration: 1500,
        delay: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, logoScale, counterAnimation]);

  // סימולציית Google Sign In // Google Sign In simulation
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);

    // סימולציה של תהליך אימות // Simulating auth process
    setTimeout(() => {
      // יצירת משתמש פיקטיבי מ-Google // Creating fake Google user
      const googleUser = {
        id: "google_" + Date.now(),
        email: "user@gmail.com",
        name: "משתמש Google",
        provider: "google",
        avatar:
          "https://ui-avatars.com/api/?name=Google+User&background=4285F4&color=fff",
      };

      // שמירה ב-store // Save to store
      setUser(googleUser);

      // ניווט למסך הבא // Navigate to next screen
      // אם המשתמש חדש - לשאלון, אם קיים - למסך ראשי
      navigation.navigate("Questionnaire");

      setIsGoogleLoading(false);
    }, 1500); // השהייה של 1.5 שניות לסימולציה
  };

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.backgroundAlt]}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* לוגו עם אנימציה // Animated logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Image
            source={require("../../../assets/welcome.png")}
            style={styles.image}
            resizeMode="contain"
          />
        </Animated.View>

        {/* כותרות // Titles */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.title}>ברוכים הבאים ל־GYMovoo</Text>
          <Text style={styles.subtitle}>
            האפליקציה שתבנה לך תוכנית אימון אישית
          </Text>
        </Animated.View>

        {/* מונה משתמשים פעילים // Active users counter */}
        <Animated.View
          style={[styles.usersCounter, { opacity: counterAnimation }]}
        >
          <View style={styles.counterContent}>
            <Text style={styles.counterNumber}>
              {activeUsers.toLocaleString()}
            </Text>
            <Ionicons
              name="people"
              size={20}
              color={theme.colors.secondary}
              style={styles.peopleIcon}
            />
          </View>
          <Text style={styles.counterText}>משתמשים פעילים</Text>
        </Animated.View>

        {/* כפתורים ראשיים // Main buttons */}
        <Animated.View style={[styles.buttonsContainer, { opacity: fadeAnim }]}>
          {/* כפתור התחל עכשיו // Start now button */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate("Register")}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.secondary]}
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.primaryButtonText}>התחל עכשיו</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          {/* הערה על תקופת ניסיון // Trial period note */}
          <Text style={styles.registrationNote}>
            🎉 תקופת ניסיון של 7 ימים חינם! ללא צורך בכרטיס אשראי
          </Text>

          {/* קבוצת כפתורי אימות משניים // Secondary auth buttons group */}
          <View style={styles.authGroup}>
            {/* כפתור Google // Google button */}
            <TouchableOpacity
              style={[styles.secondaryButton, styles.googleButton]}
              onPress={handleGoogleSignIn}
              disabled={isGoogleLoading}
              activeOpacity={0.8}
            >
              {isGoogleLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="logo-google" size={18} color="#fff" />
                  <Text style={[styles.secondaryButtonText, { color: "#fff" }]}>
                    Google
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* כפתור כניסה // Login button */}
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate("Login")}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>יש לי חשבון</Text>
              <Ionicons name="log-in" size={18} color="#6bb5ff" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: "center",
  },
  image: {
    width: screenWidth * 0.6,
    height: screenWidth * 0.6,
    maxWidth: 250,
    maxHeight: 250,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: 30,
  },
  usersCounter: {
    backgroundColor: theme.colors.card,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 50, // עיגול מלא
    marginBottom: 40,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  counterContent: {
    flexDirection: "row-reverse", // RTL: תיקון כיווניות
    alignItems: "center",
    gap: 8,
  },
  counterNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  peopleIcon: {
    marginTop: 2,
  },
  counterText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: 4,
  },
  buttonsContainer: {
    width: "100%",
    alignItems: "center",
  },
  primaryButton: {
    width: screenWidth - 40,
    marginBottom: 12,
  },
  gradientButton: {
    flexDirection: "row-reverse", // RTL: תיקון כיווניות
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.glow,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "right", // RTL: יישור טקסט
  },
  registrationNote: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  authGroup: {
    flexDirection: "row-reverse", // RTL: תיקון כיווניות
    gap: 12,
    width: "100%",
    justifyContent: "center",
  },
  secondaryButton: {
    flexDirection: "row-reverse", // RTL: תיקון כיווניות
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: "#6bb5ff",
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6bb5ff",
    textAlign: "right", // RTL: יישור טקסט
  },
  googleButton: {
    backgroundColor: theme.colors.google,
    borderColor: theme.colors.google,
    minWidth: 140,
    justifyContent: "center",
  },
});
