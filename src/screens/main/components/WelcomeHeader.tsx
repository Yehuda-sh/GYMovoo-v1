/**
 * @file src/screens/main/components/WelcomeHeader.tsx
 * @description רכיב כותרת ברוכים הבאים עם אוואטר וברכה
 */

import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";
import DefaultAvatar from "../../../components/common/DefaultAvatar";
import { MAIN_SCREEN_TEXTS } from "../../../constants/mainScreenTexts";

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
  return (
    <Animated.View
      style={[
        styles.welcomeSection,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.welcomeHeader}>
        <View style={styles.welcomeText}>
          <Text style={styles.greetingText}>{greeting}</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
        <View style={styles.profileContainer}>
          <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={onProfilePress}
              onPressIn={() => {
                Animated.timing(buttonScaleAnim, {
                  toValue: 0.95,
                  duration: 100,
                  useNativeDriver: true,
                }).start();
              }}
              onPressOut={() => {
                Animated.timing(buttonScaleAnim, {
                  toValue: 1,
                  duration: 100,
                  useNativeDriver: true,
                }).start();
              }}
              hitSlop={{ top: 20, bottom: 20, start: 20, end: 20 }}
              accessibilityLabel={MAIN_SCREEN_TEXTS.A11Y.PROFILE_BUTTON}
              accessibilityHint="לחץ לצפייה ועריכת הפרופיל האישי"
              accessibilityRole="button"
            >
              <DefaultAvatar name={userName} size="medium" showBorder={false} />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
      <Text style={styles.motivationText}>
        {MAIN_SCREEN_TEXTS.WELCOME.READY_TO_WORKOUT}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  welcomeText: {
    flex: 1,
    alignItems: "flex-end",
  },
  greetingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    textAlign: "right",
  },
  userName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginTop: 4,
    textAlign: "right",
  },
  profileContainer: {
    marginStart: 20,
  },
  profileButton: {
    padding: 4,
  },
  motivationText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 22,
  },
});
