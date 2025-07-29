/**
 * @file src/screens/welcome/WelcomeScreen.tsx
 * @brief מסך פתיחה ראשי של האפליקציה עם אפשרויות הרשמה והתחברות
 * @dependencies userStore (Zustand), React Navigation, Expo Linear Gradient
 * @notes כולל אנימציות fade-in, Google Sign-in מדומה עם משתמשים רנדומליים
 * @enhancements אנימציית פעימה לנקודה ירוקה, Ripple effects, מיקרו-אינטראקציות, נגישות משופרת, Skeleton loading
 */

import React, { useState, useEffect, useRef } from "react";
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
import { fakeGoogleSignIn } from "../../services/authService";
import { realisticDemoService } from "../../services/realisticDemoService";
import { workoutSimulationService } from "../../services/workoutSimulationService";
import { RootStackParamList } from "../../navigation/types";

// Skeleton component for Google button loading
// קומפוננטת Skeleton לטעינת כפתור Google
const GoogleButtonSkeleton = () => (
  <View style={styles.googleButton}>
    <View style={[styles.googleLogo, { backgroundColor: "#f0f0f0" }]} />
    <View
      style={{
        width: 100,
        height: 16,
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
      }}
    />
  </View>
);

// Interface for TouchableButton props
interface TouchableButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  style?: object;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

// Touchable wrapper with platform-specific feedback
// עטיפת Touchable עם feedback ספציפי לפלטפורמה
const TouchableButton = ({
  children,
  onPress,
  style,
  disabled,
  accessibilityLabel,
  accessibilityHint,
}: TouchableButtonProps) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

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
  const { setUser } = useUserStore();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isDevLoading, setIsDevLoading] = useState(false);
  const [activeUsers] = useState(Math.floor(Math.random() * 2000) + 8000);

  // אנימציות // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.9)).current;
  const counterAnimation = useRef(new Animated.Value(0)).current;
  const buttonSlide = useRef(new Animated.Value(50)).current;
  const pulseAnimation = useRef(new Animated.Value(0.3)).current;

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

    // אנימציית פעימה לנקודה ירוקה // Pulse animation for live dot
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
  }, [fadeAnim, logoScale, counterAnimation, buttonSlide, pulseAnimation]);

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
      navigation.navigate("Questionnaire", { stage: "profile" });
    } catch (error) {
      console.error("❌ Google sign in failed:", error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // דמו מציאותי - משתמש שמתחיל מאפס
  // Realistic demo - user starting from zero
  const handleDevQuickLogin = async () => {
    setIsDevLoading(true);

    try {
      console.log("🌟 REALISTIC DEMO: Creating user starting from zero...");

      // יצירת משתמש דמו עם נתוני שאלון בסיסיים בלבד
      await realisticDemoService.createRealisticDemoUser();

      // סימולציה של 6 חודשי אימונים מציאותיים
      console.log(
        "🏃‍♂️ REALISTIC DEMO: Simulating 6 months of realistic workouts..."
      );
      await workoutSimulationService.simulateRealisticWorkoutHistory();

      // קבלת המשתמש המעודכן עם ההיסטוריה
      const demoUser = await realisticDemoService.getDemoUser();

      if (!demoUser) {
        throw new Error("Failed to create demo user");
      }

      console.log("✅ Realistic demo user created with simulated history:");
      console.log(`📊 Total workouts: ${demoUser.currentStats.totalWorkouts}`);
      console.log(`🏋️ Total volume: ${demoUser.currentStats.totalVolume}kg`);
      console.log(`⭐ Average rating: ${demoUser.currentStats.averageRating}`);
      console.log(
        `🔥 Current streak: ${demoUser.currentStats.currentStreak} days`
      );

      // שמירה ב-store
      setUser(demoUser);

      // ניווט למסך הראשי
      navigation.navigate("MainApp");
    } catch (error) {
      console.error("❌ Realistic demo creation failed:", error);
    } finally {
      setIsDevLoading(false);
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
              name="weight-lifter"
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
              <Animated.View
                style={[styles.livePulse, { opacity: pulseAnimation }]}
              />
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
                  onError={() => console.warn("Google logo failed to load")} // הגנה מפני כשל טעינת תמונה
                />
                <Text style={styles.googleButtonText}>המשך עם Google</Text>
              </TouchableButton>
            )}

            {/* כפתור פיתוח מהיר - רק לפיתוח! // Dev quick button - DEV ONLY! */}
            {__DEV__ && (
              <TouchableButton
                style={[
                  styles.devButton,
                  isDevLoading && styles.disabledButton,
                ]}
                onPress={handleDevQuickLogin}
                disabled={isDevLoading || isGoogleLoading}
                accessibilityLabel="כניסה מהירה לפיתוח עם שאלון מלא"
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

            {/* כפתור כניסה למשתמשים קיימים // Login button for existing users */}
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

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  logoWrapper: {
    width: 120,
    height: 120,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.xl,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    ...theme.shadows.large,
  },
  appName: {
    fontSize: 48,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 8,
    textAlign: "center",
    writingDirection: "rtl",
  },
  tagline: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
    textAlign: "center",
    writingDirection: "rtl",
  },
  activeUsersContainer: {
    marginBottom: 20,
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
    marginHorizontal: 0,
    marginStart: 8, // שינוי RTL: marginStart במקום marginLeft
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
  },
  activeUsersText: {
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.text,
  },
  featuresContainer: {
    width: "100%",
    marginBottom: 20,
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
    writingDirection: "rtl",
  },
  buttonsContainer: {
    width: "100%",
    alignItems: "center",
  },
  primaryButton: {
    width: "100%",
    marginBottom: 10,
    borderRadius: theme.radius.lg,
    overflow: "hidden",
    ...theme.shadows.medium, // הוספת צל עקבי מהtheme
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
    marginHorizontal: 0,
    marginStart: 8, // שינוי RTL: marginStart במקום marginLeft
    textAlign: "center",
  },
  trialBadge: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: `${theme.colors.warning}20`,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.radius.full,
    marginBottom: 15,
  },
  trialText: {
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.warning,
    marginHorizontal: 0,
    marginEnd: 6, // שינוי RTL: marginEnd במקום marginRight
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
    textAlign: "center",
  },
  authGroup: {
    width: "100%",
    gap: 12, // שימוש ב-gap במקום margin מרובים - React Native תומך מגרסה 0.71+
  },
  googleButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    paddingVertical: 14,
    paddingHorizontal: 20,
    ...theme.shadows.small, // שימוש בצללים מהtheme במקום shadow ידני
  },
  googleLogo: {
    width: 60,
    height: 20,
    marginHorizontal: 0,
    marginStart: 8, // שינוי RTL: marginStart במקום marginLeft
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
    borderRadius: theme.radius.lg,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  secondaryButtonText: {
    fontSize: theme.typography.button.fontSize,
    color: theme.colors.primary,
    fontWeight: "500",
    marginHorizontal: 0,
    marginEnd: 8, // שינוי RTL: marginEnd במקום marginRight
  },
  footer: {
    marginTop: 20,
    paddingHorizontal: 20,
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
  },
  // סטיילים לכפתור פיתוח // Dev button styles
  devButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.warning,
    borderRadius: theme.radius.lg,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderStyle: "dashed",
  },
  devButtonText: {
    fontSize: theme.typography.button.fontSize,
    color: theme.colors.warning,
    fontWeight: "600",
    marginHorizontal: 0,
    marginEnd: 8, // שינוי RTL: marginEnd במקום marginRight
  },
  disabledButton: {
    opacity: 0.6,
  },
});
