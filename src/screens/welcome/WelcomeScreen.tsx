/**
 * @file src/screens/welcome/WelcomeScreen.tsx
 * @brief מסך פתיחה ראשי של האפליקציה עם אפשרויות הרשמה והתחברות
 * @dependencies userStore (Zustand), React Navigation, Expo Linear Gradient
 * @notes כולל אנימציות fade-in, Google Sign-in מדומה עם משתמשים רנדומליים
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
import { fakeGoogleSignIn } from "../../services/authService";

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

  // התחברות עם Google - משתמש רנדומלי בכל פעם
  // Google Sign In - random user each time
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);

    try {
      // קריאה לפונקציה החדשה שמחזירה משתמש רנדומלי
      // Call the new function that returns random user
      const googleUser = await fakeGoogleSignIn();

      console.log("🎲 Random Google user signed in:", googleUser.email);

      // שמירה ב-store
      // Save to store
      setUser(googleUser);

      // ניווט למסך השאלון (כי המשתמש החדש תמיד ללא שאלון)
      // Navigate to questionnaire (new user always without questionnaire)
      navigation.navigate("Questionnaire");
    } catch (error) {
      console.error("❌ Google sign in failed:", error);
    } finally {
      setIsGoogleLoading(false);
    }
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
          <View style={styles.logoWrapper}>
            <MaterialCommunityIcons
              name="dumbbell"
              size={80}
              color={theme.colors.primary}
            />
          </View>
          <Text style={styles.appName}>GYMovoo</Text>
          <Text style={styles.tagline}>האימון המושלם שלך מתחיל כאן</Text>
        </Animated.View>

        {/* מונה משתמשים פעילים // Active users counter */}
        <Animated.View
          style={[
            styles.activeUsersContainer,
            {
              opacity: counterAnimation,
              transform: [
                {
                  scale: counterAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.activeUsersBadge}>
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <View style={styles.livePulse} />
            </View>
            <Text style={styles.activeUsersText}>
              {activeUsers.toLocaleString()} משתמשים פעילים כרגע
            </Text>
          </View>
        </Animated.View>

        {/* תכונות עיקריות // Main features */}
        <Animated.View
          style={[
            styles.featuresContainer,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <View style={styles.featureRow}>
            <View style={styles.feature}>
              <MaterialCommunityIcons
                name="target"
                size={28}
                color={theme.colors.primary}
              />
              <Text style={styles.featureText}>תוכניות מותאמות אישית</Text>
            </View>
            <View style={styles.feature}>
              <MaterialCommunityIcons
                name="chart-line"
                size={28}
                color={theme.colors.primary}
              />
              <Text style={styles.featureText}>מעקב התקדמות</Text>
            </View>
          </View>
          <View style={styles.featureRow}>
            <View style={styles.feature}>
              <MaterialCommunityIcons
                name="lightning-bolt"
                size={28}
                color={theme.colors.primary}
              />
              <Text style={styles.featureText}>אימונים מהירים</Text>
            </View>
            <View style={styles.feature}>
              <MaterialCommunityIcons
                name="account-group"
                size={28}
                color={theme.colors.primary}
              />
              <Text style={styles.featureText}>קהילה תומכת</Text>
            </View>
          </View>
        </Animated.View>

        {/* כפתורי פעולה // Action buttons */}
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
                <ActivityIndicator size="small" color="#4285F4" />
              ) : (
                <>
                  <Image
                    source={{
                      uri: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png",
                    }}
                    style={styles.googleLogo}
                    resizeMode="contain"
                  />
                  <Text style={styles.googleButtonText}>המשך עם Google</Text>
                </>
              )}
            </TouchableOpacity>

            {/* כפתור כניסה למשתמשים קיימים // Login button for existing users */}
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate("Login")}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="login"
                size={20}
                color={theme.colors.primary}
              />
              <Text style={styles.secondaryButtonText}>כבר יש לי חשבון</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* פוטר עם מדיניות // Footer with policies */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            בהמשך אתה מסכים ל<Text style={styles.footerLink}> תנאי השימוש</Text>
            {" ו"}
            <Text style={styles.footerLink}>מדיניות הפרטיות</Text>
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 30,
  },
  logoWrapper: {
    width: 120,
    height: 120,
    backgroundColor: theme.colors.card,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  appName: {
    fontSize: 48,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 8,
  },
  tagline: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  activeUsersContainer: {
    marginBottom: 30,
  },
  activeUsersBadge: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  liveIndicator: {
    marginLeft: 8,
    position: "relative",
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.success,
  },
  livePulse: {
    position: "absolute",
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: theme.colors.success,
    opacity: 0.3,
  },
  activeUsersText: {
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.text,
  },
  featuresContainer: {
    width: "100%",
    marginBottom: 40,
  },
  featureRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  feature: {
    alignItems: "center",
    flex: 1,
  },
  featureText: {
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.textSecondary,
    marginTop: 8,
    textAlign: "center",
  },
  buttonsContainer: {
    width: "100%",
    alignItems: "center",
  },
  primaryButton: {
    width: "100%",
    marginBottom: 12,
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden",
  },
  gradientButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  primaryButtonText: {
    fontSize: theme.typography.buttonLarge.fontSize,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 8,
  },
  trialBadge: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: `${theme.colors.warning}20`,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.full,
    marginBottom: 20,
  },
  trialText: {
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.warning,
    marginRight: 6,
  },
  dividerContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    width: "100%",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.textSecondary,
  },
  authGroup: {
    width: "100%",
    gap: 12,
  },
  googleButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  googleLogo: {
    width: 60,
    height: 20,
    marginLeft: 8,
  },
  googleButtonText: {
    fontSize: theme.typography.button.fontSize,
    color: "#3c4043",
    fontWeight: "500",
  },
  secondaryButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  secondaryButtonText: {
    fontSize: theme.typography.button.fontSize,
    color: theme.colors.primary,
    fontWeight: "500",
    marginRight: 8,
  },
  footer: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: theme.typography.captionSmall.fontSize,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  footerLink: {
    color: theme.colors.primary,
    textDecorationLine: "underline",
  },
});
