/**
 * @file src/screens/welcome/WelcomeScreen.tsx
 * @description מסך קבלת הפנים עם אנימציות מיטוביות ותכונות עיקריות
 */
import { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
  Platform,
  Alert,
  AccessibilityInfo,
  I18nManager,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { theme } from "../../core/theme";
import { useUserStore } from "../../stores/userStore";
import AppButton from "../../components/common/AppButton";
import { RootStackParamList } from "../../navigation/types";

// טיפוסים מדויקים לאייקונים (מחליף as any)
type MCIconName = keyof typeof MaterialCommunityIcons.glyphMap;
type FAIconName = keyof typeof FontAwesome.glyphMap;

// נתוני פיצ'רים ורשתות – מחוץ לקומפוננטה (ביצועים)
const FEATURES: { icon: MCIconName; text: string }[] = [
  { icon: "bullseye-arrow", text: "תוכניות מותאמות אישית" },
  { icon: "trending-up", text: "מעקב התקדמות" },
  { icon: "lightning-bolt", text: "אימונים מהירים" },
  { icon: "account-group", text: "קהילה תומכת" },
];

const SOCIALS: { name: string; icon: FAIconName; color: string }[] = [
  { name: "Google", icon: "google", color: "#db4437" },
  { name: "Facebook", icon: "facebook", color: "#4267B2" },
  { name: "Apple", icon: "apple", color: "#000" },
];

const WelcomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user, getCompletionStatus } = useUserStore();

  // ערכי אנימציה
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  // דגלים
  const [animationsStarted, setAnimationsStarted] = useState(false);
  const reduceMotionRef = useRef(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      reduceMotionRef.current = !!enabled;
    });
  }, []);

  // ניווט אוטומטי למשתמש שמחובר
  useEffect(() => {
    if (!user) return;
    const timer = setTimeout(() => {
      const completion = getCompletionStatus();
      if (completion.isFullySetup) {
        navigation.reset({ index: 0, routes: [{ name: "MainApp" }] });
      } else {
        navigation.reset({ index: 0, routes: [{ name: "Questionnaire" }] });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [user, getCompletionStatus, navigation]);

  // התחלת אנימציות בהרכבה
  useEffect(() => {
    if (animationsStarted) return;
    setAnimationsStarted(true);

    if (reduceMotionRef.current) {
      fadeAnim.setValue(1);
      slideAnim.setValue(0);
      scaleAnim.setValue(1);
      return;
    }

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: 200,
        useNativeDriver: true,
        speed: 20,
      }),
    ]).start();
  }, [animationsStarted, fadeAnim, scaleAnim, slideAnim]);

  // פעולות
  const handleStartJourney = useCallback(() => {
    navigation.navigate("Questionnaire", {});
  }, [navigation]);

  const handleLoginNavigation = useCallback(() => {
    navigation.navigate("Auth", { screen: "Login" } as never);
  }, [navigation]);

  const handleDeveloperScreen = useCallback(() => {
    navigation.navigate("DeveloperScreen");
  }, [navigation]);

  const handleSocialLogin = useCallback((provider: string) => {
    Alert.alert(
      "בקרוב",
      `התחברות באמצעות ${provider} תהיה זמינה בקרוב`,
      [{ text: "אישור", style: "default" }],
      { cancelable: true }
    );
  }, []);

  // 👇 פותר TS2322 על style: מאחדים לאובייקט ViewStyle יחיד (לא מערך)
  const devButtonStyle: ViewStyle = {
    position: "absolute",
    top: 18,
    backgroundColor: "#ffffffcc",
    borderRadius: 20,
    padding: 8,
    zIndex: 100,
    elevation: 10,
    ...(I18nManager.isRTL ? { left: 18 } : { right: 18 }),
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Dev button - רק במצב פיתוח */}
      {__DEV__ && (
        <AppButton
          variant="ghost"
          title=""
          style={devButtonStyle}
          onPress={handleDeveloperScreen}
          accessibilityLabel="כניסה למסך פיתוח"
          icon="tools"
        />
      )}

      <LinearGradient
        colors={[theme.colors.background, theme.colors.backgroundAlt]}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={Platform.OS === "android"}
        >
          {/* לוגו וכותרת */}
          <Animated.View
            style={[
              styles.logoSection,
              { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
            ]}
            accessible
            accessibilityLabel="GYMovoo - האימון המושלם שלך מתחיל כאן"
          >
            <View style={styles.logoWrapper}>
              <MaterialCommunityIcons
                name={"weight-lifter"}
                size={80}
                color={theme.colors.primary}
                accessibilityLabel="אייקון איש מרימים משקולת"
                accessibilityRole="image"
              />
            </View>
            <Text style={styles.appName}>GYMovoo</Text>
            <Text style={styles.tagline}>האימון המושלם שלך מתחיל כאן</Text>
          </Animated.View>

          {/* מאפיינים */}
          <Animated.View
            style={[
              styles.featuresSection,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <View style={styles.featuresGrid}>
              {FEATURES.map((feature) => (
                <View key={feature.icon} style={styles.feature} accessible>
                  <MaterialCommunityIcons
                    name={feature.icon}
                    size={40}
                    color={theme.colors.primary}
                    accessibilityLabel={feature.text}
                  />
                  <Text style={styles.featureText}>{feature.text}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* כפתורים */}
          <View style={styles.buttonsSection}>
            <View style={styles.motivationBox} accessible>
              <Text style={styles.motivationText}>
                היום הוא היום המושלם להתחיל!
              </Text>
            </View>

            {/* הסרתי accessibilityRole שאינו קיים ב-AppButtonProps */}
            <AppButton
              title="התחל עכשיו"
              onPress={handleStartJourney}
              variant="primary"
              size="large"
              icon="chevron-right"
              iconPosition="right"
              fullWidth
              accessibilityLabel="התחל המסע"
            />

            <View style={styles.divider} accessible accessibilityLabel="או">
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>או</Text>
              <View style={styles.dividerLine} />
            </View>

            <AppButton
              variant="outline"
              title="כבר יש לי חשבון"
              style={styles.loginButton}
              onPress={handleLoginNavigation}
              accessibilityLabel="כניסה למשתמש קיים"
              icon="account-check"
            />

            {/* רשתות חברתיות */}
            <View style={styles.socialSection}>
              <Text style={styles.socialTitle}>או התחבר באמצעות</Text>
              <View style={styles.socialButtons}>
                {SOCIALS.map((provider) => (
                  <TouchableOpacity
                    key={provider.name}
                    style={[
                      styles.socialButton,
                      { backgroundColor: provider.color },
                    ]}
                    onPress={() => handleSocialLogin(provider.name)}
                    activeOpacity={0.8}
                    accessible
                    accessibilityRole="button"
                    accessibilityLabel={`התחברות עם ${provider.name}`}
                  >
                    <FontAwesome name={provider.icon} size={20} color="#fff" />
                    <Text style={styles.socialButtonText}>{provider.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl * 2,
    alignItems: "center",
  },

  // Logo Section
  logoSection: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  logoWrapper: {
    width: 120,
    height: 120,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.card,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  appName: {
    fontSize: 32,
    fontWeight: "800",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: "center",
  },
  tagline: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    textAlign: "center",
    fontWeight: "500",
  },

  // Features Section
  featuresSection: {
    width: "100%",
    marginBottom: theme.spacing.xl,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    gap: theme.spacing.md,
  },
  feature: {
    alignItems: "center",
    width: "45%",
    marginBottom: theme.spacing.md,
  },
  featureText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: "center",
    fontWeight: "500",
  },

  // Buttons Section
  buttonsSection: {
    width: "100%",
    alignItems: "center",
  },
  motivationBox: {
    width: "100%",
    backgroundColor: `${theme.colors.primary}10`,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    // קו צד שמכבד RTL
    borderStartWidth: 3,
    borderStartColor: theme.colors.primary,
  },
  motivationText: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: "center",
    fontWeight: "500",
  },

  // Divider
  divider: {
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
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },

  // Login Button
  loginButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.secondary,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    width: "100%",
    minHeight: 50,
    gap: theme.spacing.xs,
  },

  // Social Login Section
  socialSection: {
    marginTop: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider + "30",
    width: "100%",
  },
  socialTitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: theme.spacing.md,
    fontWeight: "500",
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: theme.spacing.sm,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    gap: theme.spacing.xs,
    minWidth: 80,
    justifyContent: "center",
  },
  socialButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
