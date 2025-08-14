import { useCallback, useMemo } from "react";
import { useSubscription } from "../stores/userStore";

// Performance cache types
interface BlurMessageCache {
  title: string;
  description: string;
  actionText: string;
}

// Performance cache for premium access calculations
const PremiumAccessCache = new Map<string, boolean>();
const BlurMessageStore = new Map<string, BlurMessageCache>();

/**
 * Content type definitions for better type safety
 */
export type ContentType = "basic" | "premium" | "trial_feature" | "exclusive";
export type SubscriptionTier = "free" | "trial" | "premium" | "lifetime";

/**
 * Advanced premium insights for analytics
 */
export interface PremiumInsights {
  accessAttempts: number;
  blockedAttempts: number;
  conversionOpportunities: string[];
  recommendedUpgrade: {
    timing: "immediate" | "trial_end" | "feature_locked";
    incentive: string;
    urgency: "low" | "medium" | "high";
  };
}

/**
 * Hook מתקדם לניהול גישה לתוכן פרימיום
 * מספק פונקציות מותאמות להערכת גישה, הצגת Blur overlay,
 * ניתוח התנהגות משתמש, והמלצות מותאמות אישית
 *
 * Features:
 * - Cache מובנה לביצועים מעולים
 * - ניתוח מתקדם של מצב המנוי
 * - הודעות מותאמות דינמיות
 * - מעקב אחר שימוש בתוכן פרימיום
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
   * Advanced access checker with caching and analytics
   */
  const hasAccessToContent = useCallback(
    (contentType: ContentType): boolean => {
      const cacheKey = `${contentType}_${subscriptionType}_${canAccessPremium}`;

      // Check cache first for performance
      if (PremiumAccessCache.has(cacheKey)) {
        return PremiumAccessCache.get(cacheKey)!;
      }

      let hasAccess = false;

      switch (contentType) {
        case "basic":
          hasAccess = true;
          break;
        case "trial_feature":
          hasAccess = trialStatus.isTrialActive || canAccessPremium;
          break;
        case "premium":
        case "exclusive":
          hasAccess = canAccessPremium;
          break;
        default:
          hasAccess = false;
      }

      // Cache result for performance
      PremiumAccessCache.set(cacheKey, hasAccess);
      return hasAccess;
    },
    [canAccessPremium, subscriptionType, trialStatus.isTrialActive]
  );

  /**
   * Advanced blur overlay logic with content-specific rules
   */
  const shouldShowBlur = useCallback(
    (contentType: ContentType): boolean => {
      if (contentType === "basic") {
        return false; // Basic content never blurred
      }

      // Premium content - show blur if no access
      return !hasAccessToContent(contentType);
    },
    [hasAccessToContent]
  );

  /**
   * Dynamic messaging system with context-aware recommendations
   */
  const getBlurMessage = useCallback(
    (contentType: ContentType = "premium") => {
      const cacheKey = `${contentType}_${subscriptionType}_${trialStatus.isTrialActive}_${trialStatus.daysRemaining}`;

      // Check cache for performance
      if (BlurMessageStore.has(cacheKey)) {
        return BlurMessageStore.get(cacheKey)!;
      }

      let message: BlurMessageCache;

      if (trialStatus.hasExpired) {
        message = {
          title: "תקופת הניסיון הסתיימה",
          description:
            "שדרג למנוי פרימיום כדי להמשיך ליהנות מכל התכונות המתקדמות",
          actionText: "שדרג למנוי פרימיום",
        };
      } else if (trialStatus.isTrialActive) {
        const urgency = trialStatus.daysRemaining <= 2 ? "רק " : "";
        message = {
          title: "תוכן פרימיום",
          description: `${urgency}נותרו ${trialStatus.daysRemaining} ימים בתקופת הניסיון שלך`,
          actionText:
            trialStatus.daysRemaining <= 2
              ? "שדרג עכשיו"
              : "שדרג למנוי פרימיום",
        };
      } else {
        const contentSpecificMessage =
          contentType === "exclusive"
            ? "תוכן בלעדי למנויים בלבד"
            : "התוכן הזה זמין רק למנויים";

        message = {
          title: "תוכן פרימיום",
          description: `${contentSpecificMessage}. התחל תקופת ניסיון חינם של 7 ימים!`,
          actionText: "התחל תקופת ניסיון",
        };
      }

      // Cache the result
      BlurMessageStore.set(cacheKey, message);
      return message;
    },
    [subscriptionType, trialStatus]
  );

  /**
   * Enhanced subscription status with detailed analytics
   */
  const getSubscriptionStatus = useCallback(() => {
    const baseStatus = (() => {
      if (subscriptionType === "premium") {
        return { type: "premium" as const, message: "מנוי פרימיום פעיל" };
      }

      if (trialStatus.isTrialActive) {
        const urgencyLevel =
          trialStatus.daysRemaining <= 2 ? " - נגמר בקרוב!" : "";
        return {
          type: "trial" as const,
          message: `תקופת ניסיון - נותרו ${trialStatus.daysRemaining} ימים${urgencyLevel}`,
        };
      }

      if (trialStatus.hasExpired) {
        return { type: "expired" as const, message: "תקופת הניסיון הסתיימה" };
      }

      return { type: "basic" as const, message: "חשבון בסיסי" };
    })();

    return {
      ...baseStatus,
      tier: subscriptionType as SubscriptionTier,
      canUpgrade: subscriptionType !== "premium",
      trialDaysLeft: trialStatus.daysRemaining,
      isTrialActive: trialStatus.isTrialActive,
    };
  }, [subscriptionType, trialStatus]);

  /**
   * Generate personalized premium insights and conversion opportunities
   */
  const generatePremiumInsights = useCallback((): PremiumInsights => {
    const conversionOpportunities: string[] = [];
    let urgency: "low" | "medium" | "high" = "low";
    let timing: "immediate" | "trial_end" | "feature_locked" = "immediate";
    let incentive = "חסוך 30% עם מנוי שנתי";

    if (trialStatus.isTrialActive) {
      if (trialStatus.daysRemaining <= 2) {
        urgency = "high";
        timing = "trial_end";
        incentive = "המשך ללא הפרעה - שדרג עכשיו";
        conversionOpportunities.push("trial_about_to_expire");
      } else if (trialStatus.daysRemaining <= 5) {
        urgency = "medium";
        timing = "trial_end";
        conversionOpportunities.push("trial_ending_soon");
      }
    } else if (trialStatus.hasExpired) {
      urgency = "high";
      timing = "feature_locked";
      incentive = "חזור לתכונות המתקדמות שאהבת";
      conversionOpportunities.push("expired_trial_reactivation");
    } else {
      conversionOpportunities.push("free_user_conversion");
    }

    return {
      accessAttempts: 0, // This would be tracked in real implementation
      blockedAttempts: 0, // This would be tracked in real implementation
      conversionOpportunities,
      recommendedUpgrade: {
        timing,
        incentive,
        urgency,
      },
    };
  }, [trialStatus]);

  /**
   * Clear performance caches (useful for testing or memory management)
   */
  const clearCache = useCallback(() => {
    PremiumAccessCache.clear();
    BlurMessageStore.clear();
  }, []);

  return {
    // Core access functions
    hasAccessToContent,
    shouldShowBlur,
    getBlurMessage,
    getSubscriptionStatus,

    // Advanced features
    generatePremiumInsights,
    clearCache,

    // Direct state access
    subscriptionType,
    subscription,
    trialStatus,
    canAccessPremium,
    shouldBlurContent,

    // Utility functions
    isFreeTier: subscriptionType === "free",
    isTrialActive: trialStatus.isTrialActive,
    isPremiumActive: subscriptionType === "premium",
    daysUntilTrialExpiry: trialStatus.daysRemaining,

    // Type-safe content types
    ContentType: {
      BASIC: "basic" as ContentType,
      PREMIUM: "premium" as ContentType,
      TRIAL_FEATURE: "trial_feature" as ContentType,
      EXCLUSIVE: "exclusive" as ContentType,
    },
  };
};
