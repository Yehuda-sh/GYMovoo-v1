/**
 * @file src/screens/main/components/WelcomeHeader.tsx
 * @description רכיב כותרת ברוכים הבאים עם אווטאר וברכה – RTL, Theme, A11y
 */

import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Animated,
  Pressable,
  Insets,
} from "react-native";
import DefaultAvatar from "../../../components/common/DefaultAvatar";
import { MAIN_SCREEN_TEXTS } from "../../../constants/mainScreenTexts";
import { theme } from "../../../core/theme";
import {
  getFlexDirection,
  getTextAlign,
  getTextDirection,
  isRTL,
} from "../../../utils/rtlHelpers";

interface WelcomeHeaderProps {
  userName?: string;
  greeting: string;
  onProfilePress: () => void;
  buttonScaleAnim: Animated.Value;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({
  userName = "חבר",
  greeting,
  onProfilePress,
  buttonScaleAnim,
  fadeAnim,
  slideAnim,
}) => {
  const handlePressIn = () => {
    Animated.timing(buttonScaleAnim, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(buttonScaleAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  // Insets לא תומך start/end — חובה left/right
  const hitSlop: Insets = { top: 20, bottom: 20, left: 20, right: 20 };

  return (
    <Animated.View
      style={[
        styles.welcomeSection,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
      accessible
      accessibilityLabel={MAIN_SCREEN_TEXTS.WELCOME.READY_TO_WORKOUT}
    >
      <View style={styles.welcomeHeader}>
        {/* טקסטי ברכה + שם משתמש */}
        <View style={styles.welcomeText}>
          <Text
            style={styles.greetingText}
            numberOfLines={1}
            accessibilityRole="header"
          >
            {greeting}
          </Text>
          <Text
            style={styles.userName}
            numberOfLines={1}
            // במקום MAIN_SCREEN_TEXTS.WELCOME.HELLO שאינו קיים
            accessibilityLabel={`${greeting} ${userName}`}
          >
            {userName}
          </Text>
        </View>

        {/* אווטאר + כפתור פרופיל */}
        <View style={styles.profileContainer}>
          <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
            <Pressable
              style={styles.profileButton}
              onPress={onProfilePress}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              android_ripple={{ color: theme.colors.ripple, borderless: true }}
              hitSlop={hitSlop}
              accessibilityLabel={MAIN_SCREEN_TEXTS.A11Y.PROFILE_BUTTON}
              accessibilityHint="לחץ לצפייה ועריכת הפרופיל האישי"
              accessibilityRole="button"
              testID="welcome-header-profile-btn"
            >
              <DefaultAvatar name={userName} size="medium" showBorder={false} />
            </Pressable>
          </Animated.View>
        </View>
      </View>

      {/* טקסט מוטיבציה */}
      <Text style={styles.motivationText}>
        {MAIN_SCREEN_TEXTS.WELCOME.READY_TO_WORKOUT}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  welcomeSection: {
    marginBottom: theme.spacing.xl,
  },
  welcomeHeader: {
    flexDirection: getFlexDirection(),
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  welcomeText: {
    flex: 1,
    alignItems: isRTL() ? "flex-end" : "flex-start",
  },
  greetingText: {
    fontSize: theme.typography.h6.fontSize,
    fontWeight: theme.typography.h6.fontWeight,
    color: theme.colors.textSecondary,
    textAlign: getTextAlign(),
    writingDirection: getTextDirection(),
  },
  userName: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: "800",
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
    textAlign: getTextAlign(),
    writingDirection: getTextDirection(),
  },
  profileContainer: {
    marginStart: theme.spacing.lg,
  },
  profileButton: {
    padding: theme.spacing.xs,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.card,
    ...theme.shadows.small,
  },
  motivationText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: theme.spacing.xl,
    lineHeight: theme.typography.body.lineHeight,
  },
});

export default WelcomeHeader;
