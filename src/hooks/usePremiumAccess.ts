import { useCallback } from "react";
import { useSubscription } from "../stores/userStore";

/**
 * Hook לניהול גישה לתוכן פרימיום
 * מספק פונקציות להערכת הגישה והצגת Blur overlay
 */
export const usePremiumAccess = () => {
  const {
    subscription,
    subscriptionType,
    trialStatus,
    canAccessPremium,
    shouldBlurContent,
  } = useSubscription();

  /**
   * בודק אם המשתמש יכול לגשת לתוכן פרימיום
   */
  const hasAccessToContent = useCallback(
    (contentType: "basic" | "premium"): boolean => {
      if (contentType === "basic") {
        return true; // תוכן בסיסי זמין לכולם
      }

      // תוכן פרימיום - בודק מנוי או תקופת ניסיון
      return canAccessPremium;
    },
    [canAccessPremium]
  );

  /**
   * בודק אם להציג Blur overlay
   */
  const shouldShowBlur = useCallback(
    (contentType: "basic" | "premium"): boolean => {
      if (contentType === "basic") {
        return false; // אף פעם לא מטשטש תוכן בסיסי
      }

      // מטשטש תוכן פרימיום אם אין גישה
      return shouldBlurContent;
    },
    [shouldBlurContent]
  );

  /**
   * מחזיר הודעה מותאמת למצב המשתמש
   */
  const getBlurMessage = useCallback(() => {
    if (trialStatus.hasExpired) {
      return {
        title: "תקופת הניסיון הסתיימה",
        description: "שדרג למנוי פרימיום כדי להמשיך ליהנות מכל התכונות",
        actionText: "שדרג למנוי פרימיום",
      };
    }

    if (trialStatus.isTrialActive) {
      return {
        title: "תוכן פרימיום",
        description: `נותרו ${trialStatus.daysRemaining} ימים בתקופת הניסיון שלך`,
        actionText: "שדרג למנוי פרימיום",
      };
    }

    return {
      title: "תוכן פרימיום",
      description:
        "התוכן הזה זמין רק למנויים. התחל תקופת ניסיון חינם של 7 ימים!",
      actionText: "התחל תקופת ניסיון",
    };
  }, [trialStatus]);

  /**
   * מחזיר סטטוס המנוי הנוכחי
   */
  const getSubscriptionStatus = useCallback(() => {
    if (subscriptionType === "premium") {
      return { type: "premium", message: "מנוי פרימיום פעיל" };
    }

    if (trialStatus.isTrialActive) {
      return {
        type: "trial",
        message: `תקופת ניסיון - נותרו ${trialStatus.daysRemaining} ימים`,
      };
    }

    if (trialStatus.hasExpired) {
      return { type: "expired", message: "תקופת הניסיון הסתיימה" };
    }

    return { type: "basic", message: "חשבון בסיסי" };
  }, [subscriptionType, trialStatus]);

  return {
    hasAccessToContent,
    shouldShowBlur,
    getBlurMessage,
    getSubscriptionStatus,
    subscriptionType,
    subscription,
    trialStatus,
    canAccessPremium,
    shouldBlurContent,
  };
};
