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
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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
  const buttonSlide = useRef(new Animated.Value(50)).current;

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
      Animated.timing(buttonSlide, {
        toValue: 0,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, logoScale, counterAnimation, buttonSlide]);

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
          <View style={styles.logoBackground}>
            <Image
              source={require("../../../assets/welcome.png")}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        </Animated.View>

        {/* כותרות // Titles */}
        <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
          <Text style={styles.title}>ברוכים הבאים ל־GYMovoo</Text>
          <Text style={styles.subtitle}>
            האפליקציה שתבנה לך תוכנית אימון אישית
          </Text>
        </Animated.View>

        {/* מונה משתמשים פעילים // Active users counter */}
        <Animated.View
          style={[styles.usersCounter, { opacity: counterAnimation }]}
        >
          <LinearGradient
            colors={[
              theme.colors.primaryGradientStart + "20",
              theme.colors.primaryGradientEnd + "20",
            ]}
            style={styles.counterGradient}
          >
            <View style={styles.counterContent}>
              <Text style={styles.counterNumber}>
                {activeUsers.toLocaleString()}
              </Text>
              <MaterialCommunityIcons
                name="account-group"
                size={24}
                color={theme.colors.primary}
              />
            </View>
            <Text style={styles.counterText}>משתמשים פעילים</Text>
          </LinearGradient>
        </Animated.View>

        {/* כפתורים ראשיים // Main buttons */}
        <Animated.View
          style={[
            styles.buttonsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: buttonSlide }],
            },
          ]}
        >
          {/* כפתור התחל עכשיו // Start now button */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate("Register")}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[
                theme.colors.primaryGradientStart,
                theme.colors.primaryGradientEnd,
              ]}
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.primaryButtonText}>התחל עכשיו</Text>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          {/* הערה על תקופת ניסיון // Trial period note */}
          <View style={styles.trialBadge}>
            <MaterialCommunityIcons
              name="gift"
              size={16}
              color={theme.colors.warning}
            />
            <Text style={styles.trialText}>
              7 ימי ניסיון חינם • ללא כרטיס אשראי
            </Text>
          </View>

          {/* מפריד // Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>או</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* קבוצת כפתורי אימות משניים // Secondary auth buttons group */}
          <View style={styles.authGroup}>
            {/* כפתור Google // Google button */}
            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleSignIn}
              disabled={isGoogleLoading}
              activeOpacity={0.8}
            >
              {isGoogleLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="logo-google" size={20} color="#fff" />
                  <Text style={styles.googleButtonText}>המשך עם Google</Text>
                </>
              )}
            </TouchableOpacity>

            {/* כפתור כניסה // Login button */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate("Login")}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>כבר יש לי חשבון</Text>
              <Ionicons name="log-in" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Footer with features */}
        <Animated.View
          style={[styles.featuresContainer, { opacity: fadeAnim }]}
        >
          <View style={styles.featureItem}>
            <MaterialCommunityIcons
              name="dumbbell"
              size={20}
              color={theme.colors.primary}
            />
            <Text style={styles.featureText}>תוכניות מותאמות אישית</Text>
          </View>
          <View style={styles.featureItem}>
            <MaterialCommunityIcons
              name="chart-line"
              size={20}
              color={theme.colors.accent}
            />
            <Text style={styles.featureText}>מעקב התקדמות</Text>
          </View>
          <View style={styles.featureItem}>
            <MaterialCommunityIcons
              name="account-group"
              size={20}
              color={theme.colors.success}
            />
            <Text style={styles.featureText}>קהילה תומכת</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: Platform.OS === "ios" ? 80 : 60,
    paddingBottom: 40,
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: "center",
  },
  logoBackground: {
    backgroundColor: theme.colors.card,
    borderRadius: 30,
    padding: theme.spacing.lg,
    ...theme.shadows.large,
  },
  image: {
    width: screenWidth * 0.5,
    height: screenWidth * 0.5,
    maxWidth: 200,
    maxHeight: 200,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 26,
  },
  usersCounter: {
    marginBottom: 40,
    borderRadius: 16,
    overflow: "hidden",
    ...theme.shadows.medium,
  },
  counterGradient: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    borderRadius: 16,
  },
  counterContent: {
    flexDirection: "row-reverse", // RTL
    alignItems: "center",
    gap: 10,
    marginBottom: 4,
  },
  counterNumber: {
    fontSize: 24,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  counterText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  buttonsContainer: {
    width: "100%",
    alignItems: "center",
  },
  primaryButton: {
    width: "100%",
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    ...theme.shadows.large,
  },
  gradientButton: {
    flexDirection: "row-reverse", // RTL
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  primaryButtonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    textAlign: "right", // RTL
  },
  trialBadge: {
    flexDirection: "row-reverse", // RTL
    alignItems: "center",
    gap: 6,
    backgroundColor: theme.colors.warning + "15",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  trialText: {
    fontSize: 14,
    color: theme.colors.warning,
    fontWeight: "500",
  },
  dividerContainer: {
    flexDirection: "row-reverse", // RTL
    alignItems: "center",
    width: "100%",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.divider,
  },
  dividerText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    paddingHorizontal: 16,
  },
  authGroup: {
    width: "100%",
    gap: 12,
  },
  googleButton: {
    flexDirection: "row-reverse", // RTL
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#DB4437",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    ...theme.shadows.medium,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  loginButton: {
    flexDirection: "row-reverse", // RTL
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: theme.colors.card,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...theme.shadows.small,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: theme.colors.text,
  },
  featuresContainer: {
    marginTop: 40,
    gap: 16,
  },
  featureItem: {
    flexDirection: "row-reverse", // RTL
    alignItems: "center",
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
});
