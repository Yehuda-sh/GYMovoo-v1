import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Modal,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../core/theme";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
}

interface AchievementNotificationProps {
  achievement: Achievement | null;
  visible: boolean;
  onClose: () => void;
}

const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  visible,
  onClose,
}) => {
  const [slideAnimation] = useState(new Animated.Value(-100));
  const [scaleAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible && achievement) {
      // Slide in from top
      Animated.sequence([
        Animated.timing(slideAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        // Scale up the icon
        Animated.spring(scaleAnimation, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        // Wait for 3 seconds
        Animated.delay(3000),
        // Slide out
        Animated.timing(slideAnimation, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onClose();
        slideAnimation.setValue(-100);
        scaleAnimation.setValue(0);
      });
    }
  }, [visible, achievement, slideAnimation, scaleAnimation, onClose]);

  if (!achievement || !visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.notification,
            {
              transform: [{ translateY: slideAnimation }],
            },
          ]}
        >
          <View style={styles.header}>
            <Animated.View
              style={[
                styles.iconContainer,
                {
                  transform: [{ scale: scaleAnimation }],
                },
              ]}
            >
              <MaterialCommunityIcons
                name={
                  achievement.icon as keyof typeof MaterialCommunityIcons.glyphMap
                }
                size={32}
                color={theme.colors.primary}
              />
            </Animated.View>

            <View style={styles.content}>
              <Text style={styles.title}>הישג חדש נפתח!</Text>
              <Text style={styles.achievementTitle}>{achievement.title}</Text>
              <Text style={styles.description}>{achievement.description}</Text>
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <MaterialCommunityIcons
                name="close"
                size={20}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <View style={styles.reward}>
              <MaterialCommunityIcons
                name="star"
                size={16}
                color={theme.colors.warning}
              />
              <Text style={styles.points}>+{achievement.points} נקודות</Text>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: theme.spacing.lg,
  },
  notification: {
    width: "100%",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: theme.colors.primary + "30",
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: theme.spacing.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary + "20",
    alignItems: "center",
    justifyContent: "center",
    marginStart: theme.spacing.md,
  },
  content: {
    flex: 1,
    paddingEnd: theme.spacing.sm,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  description: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  reward: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  points: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.colors.warning,
  },
});

export default AchievementNotification;
