/**
 * @file src/components/AdManager.tsx
 * @description מנהל פרסומות מתקדם לאפליקציית GYMovoo
 *
 * @features
 * - Free: פרסומת וידאו בתחילת + סוף אימון (חלק ארוכות)
 * - Paid: פרסומת קצרה אחת בסוף אימון בלבד
 * - התאמה אוטומטית לפי מצב המנוי
 * - נגישות מלאה עם screen readers
 * - RTL support ועיצוב מותאם
 */

import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../styles/theme";
import LoadingSpinner from "./common/LoadingSpinner";
import { useSubscription } from "../stores/userStore";
import { logger } from "../utils/logger";
import ConfirmationModal from "./common/ConfirmationModal";
import { CloseButton } from "../screens/workout/components/shared/CloseButton";

interface AdManagerProps {
  /** מיקום הפרסומת - תחילת או סוף אימון */
  placement: "workout-start" | "workout-end";
  /** האם להציג את הפרסומת */
  visible: boolean;
  /** פונקציה שנקראת לאחר סגירת הפרסומת */
  onAdClosed: () => void;
  /** פונקציה אופציונלית לטיפול בלחיצה על הפרסומת */
  onAdClicked?: () => void;
  /** פונקציה אופציונלית לטיפול בשגיאות */
  onAdError?: (error: string) => void;
}

interface AdContent {
  title: string;
  description: string;
  duration: number; // באלפיות שנייה
  type: "video" | "banner" | "interstitial";
  actionText: string;
}

const AdManager: React.FC<AdManagerProps> = ({
  placement,
  visible,
  onAdClosed,
  onAdClicked,
  onAdError: _onAdError,
}) => {
  const { subscriptionType, canAccessPremium } = useSubscription();
  const [isLoading, setIsLoading] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [adContent, setAdContent] = useState<AdContent | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // קביעת תוכן הפרסומת לפי מצב המנוי ומיקום
  const determineAdContent = useCallback((): AdContent | null => {
    const isFreeUser = !canAccessPremium;

    if (!isFreeUser && placement === "workout-start") {
      // משתמשי Premium לא רואים פרסומות בתחילת אימון
      return null;
    }

    if (placement === "workout-start" && isFreeUser) {
      // Free users - פרסומת ארוכה בתחילת אימון
      return {
        title: "💪 GYMovoo Premium - שדרג עכשיו!",
        description:
          "קבל גישה למאמן AI מותאם אישית, תוכניות אימון חכמות ועוד...",
        duration: 8000, // 8 שניות
        type: "video",
        actionText: "שדרג ל-Premium",
      };
    }

    if (placement === "workout-end") {
      if (isFreeUser) {
        // Free users - פרסומת ארוכה בסוף אימון
        return {
          title: "🎯 אימון מעולה! שדרג ל-Premium",
          description:
            "פתח דוחות התקדמות מתקדמים, מעקב מקצועי והמלצות מותאמות אישית",
          duration: 6000, // 6 שניות
          type: "interstitial",
          actionText: "התחל תקופת ניסיון",
        };
      } else {
        // Premium users - פרסומת קצרה בסוף אימון
        return {
          title: "⭐ שתף את ההתקדמות שלך",
          description: "הצטרף לקהילת GYMovoo ושתף את ההישגים שלך עם חברים",
          duration: 3000, // 3 שניות
          type: "banner",
          actionText: "שתף עכשיו",
        };
      }
    }

    return null;
  }, [placement, canAccessPremium]);

  // קריאה יציבה לסגירת פרסומת
  const handleAdClosed = useCallback(() => {
    onAdClosed();
  }, [onAdClosed]);

  // הגדרת תוכן הפרסומת כשהקומפוננטה נטענת
  useEffect(() => {
    if (visible) {
      setIsLoading(true);
      const content = determineAdContent();

      if (!content) {
        // אין פרסומת להציג - קריאה מאוחרת למניעת בעיות רינדור
        setTimeout(() => handleAdClosed(), 0);
        return;
      }

      // סימולציה של טעינת פרסומת
      setTimeout(() => {
        setAdContent(content);
        setCountdown(Math.ceil(content.duration / 1000));
        setIsLoading(false);

        logger.info("AdManager", "Ad displayed", {
          placement,
          subscriptionType,
          duration: content.duration,
        });
      }, 1000);
    }
  }, [
    visible,
    determineAdContent,
    handleAdClosed,
    placement,
    subscriptionType,
  ]);

  // ניקוי state כשהקומפוננטה נעלמת
  useEffect(() => {
    if (!visible) {
      setIsLoading(false);
      setCountdown(0);
      setAdContent(null);
      setShowUpgradeModal(false);
    }
  }, [visible]);

  // ספירה לאחור עד שניתן לסגור את הפרסומת
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (adContent && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown, adContent]);

  // טיפול בלחיצה על הפרסומת
  const handleAdClick = useCallback(() => {
    if (onAdClicked) {
      onAdClicked();
    } else {
      // הצגת מודל שדרוג במקום Alert
      setShowUpgradeModal(true);
    }
  }, [onAdClicked]);

  // טיפול באישור שדרוג
  const handleUpgradeConfirm = useCallback(() => {
    logger.info("AdManager", "User interested in upgrade");
    setShowUpgradeModal(false);
    // כאן ניתן להוסיף ניווט לעמוד השדרוג
  }, []);

  // טיפול בביטול שדרוג
  const handleUpgradeCancel = useCallback(() => {
    setShowUpgradeModal(false);
  }, []);

  // טיפול בסגירת הפרסומת
  const handleAdClose = useCallback(() => {
    logger.info("AdManager", "Ad closed", {
      placement,
      watchTime: adContent?.duration,
    });
    onAdClosed();
  }, [onAdClosed, placement, adContent]);

  if (!visible || !adContent) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={countdown === 0 ? handleAdClose : undefined}
      accessibilityLabel="פרסומת"
      accessibilityHint={`פרסומת תיסגר אוטומטית בעוד ${countdown} שניות`}
    >
      <View style={styles.overlay}>
        <LinearGradient
          colors={[theme.colors.background, theme.colors.backgroundAlt]}
          style={styles.adContainer}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <LoadingSpinner
                size="large"
                variant="fade"
                text="טוען פרסומת..."
                testID="ad-loading"
              />
            </View>
          ) : (
            <>
              {/* כותרת הפרסומת */}
              <View style={styles.header}>
                <Text style={styles.adTitle}>{adContent.title}</Text>

                {/* כפתור סגירה - זמין רק לאחר הספירה לאחור */}
                {countdown === 0 ? (
                  <CloseButton
                    onPress={handleAdClose}
                    size="medium"
                    variant="solid"
                    accessibilityLabel="סגור פרסומת"
                    accessibilityHint="הקש כדי לסגור את הפרסומת"
                    testID="ad-close-button"
                  />
                ) : (
                  <View style={styles.countdownContainer}>
                    <Text style={styles.countdownText}>{countdown}</Text>
                  </View>
                )}
              </View>

              {/* תוכן הפרסומת */}
              <TouchableOpacity
                style={styles.adContent}
                onPress={handleAdClick}
                accessibilityLabel={`לחץ כדי ${adContent.actionText}`}
                accessibilityRole="button"
              >
                <View style={styles.adIcon}>
                  <MaterialCommunityIcons
                    name={adContent.type === "video" ? "play-circle" : "star"}
                    size={60}
                    color={theme.colors.primary}
                  />
                </View>

                <Text style={styles.adDescription}>
                  {adContent.description}
                </Text>

                <View style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>
                    {adContent.actionText}
                  </Text>
                  <MaterialCommunityIcons
                    name="chevron-left"
                    size={20}
                    color={theme.colors.background}
                    style={{ transform: [{ scaleX: theme.isRTL ? -1 : 1 }] }}
                  />
                </View>
              </TouchableOpacity>

              {/* אינדיקטור סוג מנוי */}
              <View style={styles.subscriptionIndicator}>
                <Text style={styles.subscriptionText}>
                  {canAccessPremium ? "Premium" : "Free"} •{" "}
                  {placement === "workout-start" ? "טרום אימון" : "פוסט אימון"}
                </Text>
              </View>
            </>
          )}
        </LinearGradient>
      </View>

      {/* ConfirmationModal לשדרוג */}
      <ConfirmationModal
        visible={showUpgradeModal}
        title="שדרוג ל-Premium"
        message="האם ברצונך לשדרג ל-GYMovoo Premium ולקבל גישה לכל התכונות המתקדמות?"
        onClose={handleUpgradeCancel}
        onConfirm={handleUpgradeConfirm}
        onCancel={handleUpgradeCancel}
        confirmText="כן, שדרג"
        cancelText="לא תודה"
        variant="info"
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  adContainer: {
    width: "100%",
    maxWidth: 400,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  loadingContainer: {
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  header: {
    flexDirection: theme.isRTL ? "row-reverse" : "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: theme.spacing.lg,
  },
  adTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: "bold",
    color: theme.colors.text,
    flex: 1,
    textAlign: theme.isRTL ? "right" : "left",
    writingDirection: theme.isRTL ? "rtl" : "ltr",
  },
  countdownContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  countdownText: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: "bold",
    color: theme.colors.background,
  },
  adContent: {
    width: "100%",
    alignItems: "center",
    padding: theme.spacing.lg,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.card,
    marginBottom: theme.spacing.md,
  },
  adIcon: {
    marginBottom: theme.spacing.md,
  },
  adDescription: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: theme.spacing.lg,
    writingDirection: theme.isRTL ? "rtl" : "ltr",
  },
  actionButton: {
    flexDirection: theme.isRTL ? "row-reverse" : "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    gap: theme.spacing.sm,
  },
  actionButtonText: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: "bold",
    color: theme.colors.background,
  },
  subscriptionIndicator: {
    alignItems: "center",
  },
  subscriptionText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
});

export default AdManager;
