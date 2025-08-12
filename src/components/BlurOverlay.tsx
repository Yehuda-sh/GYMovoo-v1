import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { theme } from "../styles/theme";

interface BlurOverlayProps {
  isVisible: boolean;
  title?: string;
  description?: string;
  actionText?: string;
  onActionPress?: () => void;
  children?: React.ReactNode;
}

/**
 * רכיב ערפול לתוכן פרימיום
 * מציג שכבת ערפול מעל תוכן שמחייב מנוי
 */
export const BlurOverlay: React.FC<BlurOverlayProps> = ({
  isVisible,
  title = "תוכן פרימיום",
  description = "התוכן הזה זמין רק למנויים",
  actionText = "שדרג למנוי פרימיום",
  onActionPress,
  children,
}) => {
  if (!isVisible) {
    return <>{children}</>;
  }

  return (
    <View style={styles.container}>
      {/* התוכן המטושטש */}
      <View style={styles.blurredContent}>{children}</View>

      {/* שכבת הערפול */}
      <View style={styles.overlay}>
        <View style={styles.messageContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>

          {onActionPress && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onActionPress}
            >
              <Text style={styles.actionText}>{actionText}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
  },
  blurredContent: {
    flex: 1,
    opacity: 0.3, // ערפול על ידי שקיפות
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  messageContainer: {
    backgroundColor: theme.colors.surface,
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    maxWidth: Dimensions.get("window").width * 0.8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 12,
    textAlign: "center",
    writingDirection: "rtl",
  },
  description: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
    writingDirection: "rtl",
  },
  actionButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 200,
  },
  actionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    writingDirection: "rtl",
  },
});
