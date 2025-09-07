import { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { theme } from "../../styles/theme";
import { useUserStore } from "../../stores/userStore";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import AppButton from "../../components/common/AppButton";
import TouchableButton from "../../components/ui/TouchableButton";
import { RootStackParamList } from "../../navigation/types";

const WelcomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { user, getCompletionStatus } = useUserStore();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage] = useState("");

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

  const handleStartJourney = () => {
    navigation.navigate("Questionnaire", {});
  };

  const handleLoginNavigation = () => {
    navigation.navigate("Login", {});
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.backgroundAlt]}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* App Logo & Title */}
          <View style={styles.logoSection}>
            <View style={styles.logoWrapper}>
              <MaterialCommunityIcons
                name="weight-lifter"
                size={80}
                color={theme.colors.primary}
              />
            </View>
            <Text style={styles.appName}>GYMovoo</Text>
            <Text style={styles.tagline}>האימון המושלם שלך מתחיל כאן</Text>
          </View>

          {/* Features */}
          <View style={styles.featuresSection}>
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
          </View>

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

            <TouchableButton
              style={styles.loginButton}
              onPress={handleLoginNavigation}
              accessibilityLabel="כבר יש לי חשבון"
            >
              <MaterialCommunityIcons
                name="account-check"
                size={20}
                color={theme.colors.secondary}
              />
              <Text style={styles.loginButtonText}>כבר יש לי חשבון</Text>
            </TouchableButton>

            {/* כפתור נוסף לכניסה מהירה */}
            <AppButton
              title="כניסה מהירה"
              onPress={handleLoginNavigation}
              variant="outline"
              size="medium"
              icon="login"
              iconPosition="left"
              fullWidth
              style={{ marginTop: theme.spacing.sm }}
              accessibilityLabel="כניסה מהירה למשתמש קיים"
            />
          </View>
        </ScrollView>

        {/* Error Modal */}
        <ConfirmationModal
          visible={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          onConfirm={() => setShowErrorModal(false)}
          title="שגיאה"
          message={errorMessage}
          variant="error"
          singleButton={true}
          confirmText="אישור"
        />
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
  loginButtonText: {
    fontSize: 16,
    color: theme.colors.secondary,
    fontWeight: "600",
  },
});
