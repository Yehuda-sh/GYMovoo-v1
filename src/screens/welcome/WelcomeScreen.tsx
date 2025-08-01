/**
 * @file src/screens/welcome/WelcomeScreen.tsx
 * @brief מסך ברוכים הבאים ראשי עם אפשרויות הרשמה והתחברות | Main welcome screen with sign-up and sign-in options
 * @description כולל אנימציות מתקדמות, Google Sign-in מדומה, ודמו מציאותי עם סימולציית היסטוריה | Features advanced animations, mock Google Sign-in, and realistic demo with history simulation
 * @dependencies userStore (Zustand), React Navigation, Expo Linear Gradient, realisticDemoService, workoutSimulationService
 * @features אנימציות fade-in/scale, אפקטי Ripple, מיקרו-אינטראקציות, נגישות משופרת, Skeleton loading, מונה משתמשים חי | Fade-in/scale animations, Ripple effects, micro-interactions, enhanced accessibility, Skeleton loading, live user counter
 * @performance מותאם עם useCallback, אנימציות עם useNativeDriver, טעינה אסינכרונית | Optimized with useCallback, native driver animations, async loading
 * @accessibility תמיכה מלאה ב-screen readers, תוויות נגישות, רמזי נגישות | Full screen reader support, accessibility labels and hints
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Animated,
  Platform,
  TouchableNativeFeedback,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { theme } from "../../styles/theme";
import { useUserStore } from "../../stores/userStore";
import {
  fakeGoogleSignIn,
  realisticDemoService,
  workoutSimulationService,
} from "../../services";
import { RootStackParamList } from "../../navigation/types";

// Skeleton loading component for Google authentication button during async operations
// קומפוננטת Skeleton לטעינת כפתור Google במהלך פעולות אסינכרוניות
const GoogleButtonSkeleton = () => (
  <View style={styles.googleButton}>
    <View
      style={[
        styles.googleLogo,
        { backgroundColor: theme.colors.backgroundAlt },
      ]}
    />
    <View
      style={{
        width: 100,
        height: 16,
        backgroundColor: theme.colors.backgroundAlt,
        borderRadius: theme.radius.xs,
      }}
    />
  </View>
);

// Enhanced TouchableButton props interface with comprehensive accessibility support
// ממשק מורחב לכפתור מגע עם תמיכה מקיפה בנגישות
interface TouchableButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  style?: object;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

// Cross-platform touchable wrapper with native feedback and micro-interactions
// עטיפת מגע חוצת פלטפורמות עם משוב נטיבי ומיקרו-אינטראקציות
const TouchableButton = ({
  children,
  onPress,
  style,
  disabled,
  accessibilityLabel,
  accessibilityHint,
}: TouchableButtonProps) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  }, [scaleValue]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [scaleValue]);

  if (Platform.OS === "android") {
    return (
      <TouchableNativeFeedback
        onPress={onPress}
        disabled={disabled}
        background={TouchableNativeFeedback.Ripple(
          theme.colors.primary + "20",
          false
        )}
        accessible={true}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityRole="button"
      >
        <Animated.View style={[style, { transform: [{ scale: scaleValue }] }]}>
          {children}
        </Animated.View>
      </TouchableNativeFeedback>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
    >
      <Animated.View style={[style, { transform: [{ scale: scaleValue }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

export default function WelcomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { setUser, user, isLoggedIn } = useUserStore();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isDevLoading, setIsDevLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Generate active users count only once
  const [activeUsers] = useState(() => Math.floor(Math.random() * 2000) + 8000);

  // Animation references for enhanced UI transitions // רפרנסי אנימציה למעברי UI משופרים
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.9)).current;
  const counterAnimation = useRef(new Animated.Value(0)).current;
  const buttonSlide = useRef(new Animated.Value(50)).current;
  const pulseAnimation = useRef(new Animated.Value(0.3)).current;

  // בדיקת מצב התחברות קיים - ניווט אוטומטי למשתמש מחובר
  // Check existing authentication state - auto-navigate for logged-in user
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        console.log("🔍 WelcomeScreen - בודק מצב התחברות:", {
          hasUser: !!user,
          userEmail: user?.email,
          isLoggedInResult: isLoggedIn(),
        });

        // נתן זמן קצר ל-store להתחזר מ-AsyncStorage
        // Give store time to rehydrate from AsyncStorage
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (isLoggedIn() && user) {
          console.log(
            "✅ WelcomeScreen - משתמש מחובר נמצא! מנווט למסך הבית:",
            user.email
          );
          navigation.navigate("MainApp");
          return;
        }

        console.log("ℹ️ WelcomeScreen - משתמש לא מחובר, מציג מסך ברוכים הבאים");
        setIsCheckingAuth(false);
      } catch (error) {
        console.error("❌ WelcomeScreen - שגיאה בבדיקת מצב התחברות:", error);
        setIsCheckingAuth(false);
      }
    };

    checkAuthStatus();
  }, [user, isLoggedIn, navigation]);

  useEffect(() => {
    if (isCheckingAuth) return; // לא להתחיל אנימציות בזמן בדיקת התחברות

    // Coordinated entrance animations with optimized timing // אנימציות כניסה מתואמות עם זמנים מותאמים
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
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
        duration: 1200,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.timing(buttonSlide, {
        toValue: 0,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous pulse animation for live activity indicator // אנימציית פעימה רציפה למחוון פעילות חי
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 0.6,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [
    fadeAnim,
    logoScale,
    counterAnimation,
    buttonSlide,
    pulseAnimation,
    isCheckingAuth,
  ]);

  // Google Sign-In with randomized user simulation for demo purposes
  // התחברות עם Google עם סימולציית משתמש רנדומלי למטרות הדגמה
  const handleGoogleSignIn = useCallback(async () => {
    setIsGoogleLoading(true);

    try {
      // Generate randomized demo user through auth service // יצירת משתמש דמו רנדומלי דרך שירות האימות
      const googleUser = await fakeGoogleSignIn();

      // Save user data to global store // שמירת נתוני משתמש ב-store גלובלי
      setUser(googleUser);

      // Navigate to questionnaire for new user setup // ניווט לשאלון להגדרת משתמש חדש
      navigation.navigate("Questionnaire", { stage: "profile" });
    } catch {
      // Handle error silently in production
    } finally {
      setIsGoogleLoading(false);
    }
  }, [setUser, navigation]);

  // Realistic demo creation with comprehensive workout history simulation
  // יצירת דמו מציאותי עם סימולציית היסטוריית אימונים מקיפה
  const handleDevQuickLogin = useCallback(async () => {
    setIsDevLoading(true);

    try {
      // Create baseline demo user with essential questionnaire data // יצירת משתמש דמו בסיסי עם נתוני שאלון חיוניים
      await realisticDemoService.createRealisticDemoUser();

      // Simulate realistic 6-month workout progression // סימולציית התקדמות אימונים מציאותית של 6 חודשים
      await workoutSimulationService.simulateRealisticWorkoutHistory();

      // Retrieve updated user with complete simulated history // קבלת משתמש מעודכן עם היסטוריה מדומה מלאה
      const demoUser = await realisticDemoService.getDemoUser();

      if (!demoUser) {
        throw new Error("Demo user creation failed");
      }

      // Save demo user to global store // שמירת משתמש דמו ב-store גלובלי
      setUser(demoUser);

      // Navigate to main application interface // ניווט לממשק האפליקציה הראשי
      navigation.navigate("MainApp");
    } catch {
      // Handle error silently in production
    } finally {
      setIsDevLoading(false);
    }
  }, [setUser, navigation]);

  // מסך טעינה בזמן בדיקת מצב התחברות
  // Loading screen while checking authentication status
  if (isCheckingAuth) {
    return (
      <LinearGradient
        colors={[theme.colors.background, theme.colors.backgroundAlt]}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <MaterialCommunityIcons
          name="weight-lifter"
          size={80}
          color={theme.colors.primary}
        />
        <Text style={[styles.appName, { marginTop: 16 }]}>GYMovoo</Text>
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={{ marginTop: 24 }}
        />
        <Text style={[styles.tagline, { marginTop: 16 }]}>
          בודק מצב התחברות...
        </Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.backgroundAlt]}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand logo with enhanced animations and accessibility // לוגו המותג עם אנימציות משופרות ונגישות */}
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
              name="weight-lifter"
              size={80}
              color={theme.colors.primary}
            />
          </View>
          <Text style={styles.appName}>GYMovoo</Text>
          <Text style={styles.tagline}>האימון המושלם שלך מתחיל כאן</Text>
        </Animated.View>

        {/* Live user activity counter with pulse animation // מונה פעילות משתמשים חי עם אנימציית פעימה */}
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
              <Animated.View
                style={[styles.livePulse, { opacity: pulseAnimation }]}
              />
            </View>
            <Text style={styles.activeUsersText}>
              {activeUsers.toLocaleString()} משתמשים פעילים כרגע
            </Text>
          </View>
        </Animated.View>

        {/* Key application features showcase // מדור הצגת תכונות מפתח של האפליקציה */}
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
                name="bullseye-arrow"
                size={28}
                color={theme.colors.primary}
              />
              <Text style={styles.featureText}>תוכניות מותאמות אישית</Text>
            </View>
            <View style={styles.feature}>
              <MaterialCommunityIcons
                name="trending-up"
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

        {/* Main action buttons with enhanced accessibility and animations // כפתורי פעולה ראשיים עם נגישות ואנימציות משופרות */}
        <Animated.View
          style={[
            styles.buttonsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: buttonSlide }],
            },
          ]}
        >
          {/* Primary call-to-action button with gradient design // כפתור קריאה לפעולה ראשי עם עיצוב גרדיאנט */}
          <TouchableButton
            style={styles.primaryButton}
            onPress={() => navigation.navigate("Register")}
            accessibilityLabel="התחל את המסע שלך לכושר מושלם"
            accessibilityHint="לחץ כדי להתחיל בתהליך ההרשמה"
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
              <Ionicons name="arrow-forward" size={22} color="#fff" />
            </LinearGradient>
          </TouchableButton>

          {/* Free trial promotion badge // תג קידום לתקופת ניסיון חינם */}
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

          {/* Content divider for alternative authentication options // מפריד תוכן לאפשרויות אימות חלופיות */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>או</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Alternative authentication methods group // קבוצת שיטות אימות חלופיות */}
          <View style={styles.authGroup}>
            {/* Google OAuth integration with skeleton loading // אינטגרציית Google OAuth עם Skeleton loading */}
            {isGoogleLoading ? (
              <GoogleButtonSkeleton />
            ) : (
              <TouchableButton
                style={styles.googleButton}
                onPress={handleGoogleSignIn}
                disabled={isGoogleLoading}
                accessibilityLabel="התחבר עם חשבון Google"
                accessibilityHint="לחץ כדי להתחבר באמצעות חשבון Google שלך"
              >
                <Image
                  source={{
                    uri: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png",
                  }}
                  style={styles.googleLogo}
                  resizeMode="contain"
                />
                <Text style={styles.googleButtonText}>המשך עם Google</Text>
              </TouchableButton>
            )}

            {/* Development-only realistic demo with comprehensive workout simulation // דמו מציאותי לפיתוח בלבד עם סימולציית אימונים מקיפה */}
            {__DEV__ && (
              <TouchableButton
                style={[
                  styles.devButton,
                  isDevLoading && styles.disabledButton,
                ]}
                onPress={handleDevQuickLogin}
                disabled={isDevLoading || isGoogleLoading}
                accessibilityLabel="כניסה מהירה לפיתוח עם דמו מציאותי מלא"
                accessibilityHint="לחץ לכניסה מהירה עם נתונים מדומים - רק למפתחים"
              >
                {isDevLoading ? (
                  <ActivityIndicator
                    size="small"
                    color={theme.colors.warning}
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="rocket-launch"
                    size={20}
                    color={theme.colors.warning}
                  />
                )}
                <Text style={styles.devButtonText}>
                  {isDevLoading
                    ? "יוצר דמו מציאותי..."
                    : "🎯 דמו מציאותי (6 חודשים)"}
                </Text>
              </TouchableButton>
            )}

            {/* Existing user login access // גישה להתחברות למשתמשים קיימים */}
            <TouchableButton
              style={styles.secondaryButton}
              onPress={() => navigation.navigate("Login", {})}
              accessibilityLabel="כניסה למשתמשים קיימים"
              accessibilityHint="לחץ אם כבר יש לך חשבון"
            >
              <MaterialCommunityIcons
                name="login"
                size={20}
                color={theme.colors.primary}
              />
              <Text style={styles.secondaryButtonText}>כבר יש לי חשבון</Text>
            </TouchableButton>
          </View>
        </Animated.View>

        {/* Legal compliance and policy links footer // פוטר עם קישורי ציות משפטי ומדיניות */}
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

export const styles = StyleSheet.create({
  // Main container with responsive layout // קונטיינר ראשי עם פריסה רספונסיבית
  container: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl * 2,
    paddingBottom: theme.spacing.lg,
    alignItems: "center",
  },

  // Brand identity section // מדור זהות מותג
  logoContainer: {
    alignItems: "center",
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  logoWrapper: {
    width: 120,
    height: 120,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.xl,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.md,
    ...theme.shadows.large,
  },
  appName: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: theme.typography.h1.fontWeight,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: "center",
    writingDirection: "rtl",
  },
  tagline: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
    textAlign: "center",
    writingDirection: "rtl",
  },

  // Live activity indicator section // מדור מחוון פעילות חי
  activeUsersContainer: {
    marginBottom: theme.spacing.lg,
  },
  activeUsersBadge: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...theme.shadows.small,
  },
  liveIndicator: {
    marginStart: theme.spacing.xs,
    position: "relative",
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: theme.radius.xs,
    backgroundColor: theme.colors.success,
  },
  livePulse: {
    position: "absolute",
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: theme.radius.xs,
    borderWidth: 2,
    borderColor: theme.colors.success,
  },
  activeUsersText: {
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.text,
    fontWeight: "500",
    writingDirection: "rtl",
  },
  // Features showcase section // מדור הצגת תכונות
  featuresContainer: {
    width: "100%",
    marginBottom: theme.spacing.lg,
  },
  featureRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-around",
    marginBottom: theme.spacing.lg,
  },
  feature: {
    alignItems: "center",
    flex: 1,
  },
  featureText: {
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: "center",
    writingDirection: "rtl",
    fontWeight: "500",
  },

  // Action buttons section // מדור כפתורי פעולה
  buttonsContainer: {
    width: "100%",
    alignItems: "center",
  },
  primaryButton: {
    width: "100%",
    marginBottom: theme.spacing.sm,
    borderRadius: theme.radius.lg,
    overflow: "hidden",
    ...theme.shadows.medium,
  },
  gradientButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
  },
  primaryButtonText: {
    fontSize: theme.typography.buttonLarge.fontSize,
    fontWeight: theme.typography.buttonLarge.fontWeight,
    color: "#fff",
    marginStart: theme.spacing.xs,
    textAlign: "center",
    writingDirection: "rtl",
  },

  // Promotional elements // אלמנטים קידומיים
  trialBadge: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: `${theme.colors.warning}20`,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.full,
    marginBottom: theme.spacing.md,
  },
  trialText: {
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.warning,
    marginEnd: theme.spacing.xs,
    fontWeight: "500",
    writingDirection: "rtl",
  },

  // Content separators // מפרידי תוכן
  dividerContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    width: "100%",
    marginVertical: theme.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.divider,
  },
  dividerText: {
    marginHorizontal: theme.spacing.md,
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.textSecondary,
    textAlign: "center",
    fontWeight: "500",
  },
  // Authentication options group // קבוצת אפשרויות אימות
  authGroup: {
    width: "100%",
    gap: theme.spacing.sm,
  },
  googleButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    borderRadius: theme.radius.lg,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    ...theme.shadows.small,
  },
  googleLogo: {
    width: 60,
    height: 20,
    marginStart: theme.spacing.xs,
  },
  googleButtonText: {
    fontSize: theme.typography.button.fontSize,
    color: theme.colors.textSecondary,
    fontWeight: "500",
    writingDirection: "rtl",
  },
  secondaryButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    borderRadius: theme.radius.lg,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    ...theme.shadows.small,
  },
  secondaryButtonText: {
    fontSize: theme.typography.button.fontSize,
    color: theme.colors.primary,
    fontWeight: "500",
    marginEnd: theme.spacing.xs,
    writingDirection: "rtl",
  },

  // Development tools styles // סטיילים לכלי פיתוח
  devButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.warning,
    borderRadius: theme.radius.lg,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderStyle: "dashed",
  },
  devButtonText: {
    fontSize: theme.typography.button.fontSize,
    color: theme.colors.warning,
    fontWeight: "600",
    marginEnd: theme.spacing.xs,
    writingDirection: "rtl",
  },
  disabledButton: {
    opacity: 0.6,
  },

  // Legal and policy footer // פוטר משפטי ומדיניות
  footer: {
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  footerText: {
    fontSize: theme.typography.captionSmall.fontSize,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    writingDirection: "rtl",
  },
  footerLink: {
    color: theme.colors.primary,
    textDecorationLine: "underline",
    fontWeight: "500",
  },
});
