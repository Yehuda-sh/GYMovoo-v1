import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { theme } from "../../core/theme";
import { useUserStore } from "../../stores/userStore";
import AppButton from "../../components/common/AppButton";
import { RootStackParamList } from "../../navigation/types";

const WelcomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user, getCompletionStatus } = useUserStore();

  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  const scaleAnim = useState(new Animated.Value(0.9))[0];

  // Navigate authenticated users
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

  // Start animations on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim, slideAnim]);

  const handleStartJourney = () => {
    navigation.navigate("Questionnaire", {});
  };

  const handleLoginNavigation = () => {
    // עבור למודול האימות החדש במקום מסך ההתחברות הישן
    // הערה: "Login" הוא מסך בתוך AuthNavigator
    navigation.navigate("Auth", { screen: "Login" });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Dev button - only in development mode */}
      {__DEV__ && (
        <AppButton
          variant="ghost"
          title=""
          style={styles.devButton}
          onPress={() => navigation.navigate("DeveloperScreen")}
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
        >
          {/* App Logo & Title with animation */}
          <Animated.View
            style={[
              styles.logoSection,
              { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
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

          {/* Features with slide animation */}
          <Animated.View
            style={[
              styles.featuresSection,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <View style={styles.featureRow}>
              <View style={styles.feature}>
                <MaterialCommunityIcons
                  name="bullseye-arrow"
                  size={40}
                  color={theme.colors.primary}
                />
                <Text style={styles.featureText}>תוכניות מותאמות אישית</Text>
              </View>
              <View style={styles.feature}>
                <MaterialCommunityIcons
                  name="trending-up"
                  size={40}
                  color={theme.colors.primary}
                />
                <Text style={styles.featureText}>מעקב התקדמות</Text>
              </View>
            </View>

            <View style={styles.featureRow}>
              <View style={styles.feature}>
                <MaterialCommunityIcons
                  name="lightning-bolt"
                  size={40}
                  color={theme.colors.primary}
                />
                <Text style={styles.featureText}>אימונים מהירים</Text>
              </View>
              <View style={styles.feature}>
                <MaterialCommunityIcons
                  name="account-group"
                  size={40}
                  color={theme.colors.primary}
                />
                <Text style={styles.featureText}>קהילה תומכת</Text>
              </View>
            </View>
          </Animated.View>

          {/* Action Buttons */}
          <View style={styles.buttonsSection}>
            <View style={styles.motivationBox}>
              <Text style={styles.motivationText}>
                היום הוא היום המושלם להתחיל!
              </Text>
            </View>

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

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>או</Text>
              <View style={styles.dividerLine} />
            </View>

            <AppButton
              variant="outline"
              title="כבר יש לי חשבון"
              style={styles.loginButton}
              onPress={handleLoginNavigation}
              accessibilityLabel="כבר יש לי חשבון"
              icon="account-check"
            />

            {/* כפתורי רשתות חברתיות */}
            <View style={styles.socialSection}>
              <Text style={styles.socialTitle}>או התחבר באמצעות</Text>
              <View style={styles.socialButtons}>
                <TouchableOpacity
                  style={[styles.socialButton, styles.googleButton]}
                  onPress={() => console.log("Google login - בקרוב")}
                >
                  <FontAwesome name="google" size={20} color="#fff" />
                  <Text style={styles.socialButtonText}>Google</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.socialButton, styles.facebookButton]}
                  onPress={() => console.log("Facebook login - בקרוב")}
                >
                  <FontAwesome name="facebook" size={20} color="#fff" />
                  <Text style={styles.socialButtonText}>Facebook</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.socialButton, styles.appleButton]}
                  onPress={() => console.log("Apple login - בקרוב")}
                >
                  <FontAwesome name="apple" size={20} color="#fff" />
                  <Text style={styles.socialButtonText}>Apple</Text>
                </TouchableOpacity>
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
  devButton: {
    position: "absolute",
    top: 18,
    right: 18,
    backgroundColor: "#fff8",
    borderRadius: 20,
    padding: 8,
    zIndex: 100,
    elevation: 10,
  },
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
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
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
  googleButton: {
    backgroundColor: "#db4437",
  },
  facebookButton: {
    backgroundColor: "#4267B2",
  },
  appleButton: {
    backgroundColor: "#000",
  },
  socialButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
