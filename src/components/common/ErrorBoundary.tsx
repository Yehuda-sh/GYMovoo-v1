/**
 * @file src/components/common/ErrorBoundary.tsx
 * @brief Error Boundary גלובלי עם Fallback UI ידידותי ותמיכת RTL
 * @dependencies React, React Native, theme, errorHandler, logger
 * @notes תומך RTL, SafeAreaView, accessibility, כפתור נסה שוב
 */

import React, { Component, ReactNode } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import { errorHandler } from "../../utils/errorHandler";
import { logger } from "../../utils/logger";

interface ErrorBoundaryState {
  hasError: boolean;
  details?: string;
  errorType?: "network" | "auth" | "validation" | "unknown";
  retryCount: number;
  lastErrorTime?: number;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackMessage?: string;
  maxRetries?: number;
  retryDelay?: number;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  showFeedbackButton?: boolean;
  variant?: "default" | "minimal" | "compact";
}

/**
 * Error Boundary גלובלי עם UI fallback מותאם RTL
 * Global Error Boundary with RTL-adapted UI fallback
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // קטלוג שגיאות לפי סוג
    const errorType = ErrorBoundary.categorizeError(error);

    return {
      hasError: true,
      details: __DEV__ ? error.message : undefined,
      errorType,
      retryCount: 0,
      lastErrorTime: Date.now(),
    };
  }

  /**
   * קטלוג שגיאות לפי סוג
   */
  private static categorizeError(
    error: Error
  ): "network" | "auth" | "validation" | "unknown" {
    const message = error.message.toLowerCase();

    if (
      message.includes("network") ||
      message.includes("fetch") ||
      message.includes("connection")
    ) {
      return "network";
    }
    if (
      message.includes("auth") ||
      message.includes("unauthorized") ||
      message.includes("forbidden")
    ) {
      return "auth";
    }
    if (
      message.includes("validation") ||
      message.includes("invalid") ||
      message.includes("required")
    ) {
      return "validation";
    }

    return "unknown";
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // דיווח שגיאה למערכת מרכזית
    errorHandler.reportError(error, {
      componentStack: errorInfo.componentStack,
      source: "ErrorBoundary",
      errorType: this.state.errorType,
      retryCount: this.state.retryCount,
    });

    // קריאה לפונקציית callback אם סופקה
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // לוג מפורט למצב פיתוח
    logger.error("ErrorBoundary", "Component error caught", {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorType: this.state.errorType,
      retryCount: this.state.retryCount,
    });
  }

  handleRetry = () => {
    const { maxRetries = 3, retryDelay = 1000 } = this.props;
    const { retryCount } = this.state;

    if (retryCount < maxRetries) {
      // חישוב delay עם exponential backoff
      const delay = retryDelay * Math.pow(2, retryCount);

      setTimeout(() => {
        this.setState((prevState) => ({
          hasError: false,
          details: undefined,
          retryCount: prevState.retryCount + 1,
        }));
      }, delay);
    } else {
      // לאחר maxRetries, איפוס מלא
      this.setState({
        hasError: false,
        details: undefined,
        retryCount: 0,
      });
    }
  };

  handleFeedback = () => {
    // TODO: פתיחת מודל משוב למשתמש
    logger.info("ErrorBoundary", "User requested feedback", {
      errorType: this.state.errorType,
      retryCount: this.state.retryCount,
    });
  };

  override render() {
    if (this.state.hasError) {
      const {
        variant = "default",
        showFeedbackButton = false,
        maxRetries = 3,
      } = this.props;
      const { errorType, retryCount } = this.state;
      const canRetry = retryCount < maxRetries;

      return (
        <SafeAreaView style={styles.container}>
          <View
            style={[
              styles.content,
              variant === "compact" && styles.contentCompact,
              variant === "minimal" && styles.contentMinimal,
            ]}
          >
            {/* אייקון שגיאה */}
            <View style={styles.iconContainer}>
              <Ionicons
                name={this.getErrorIcon(errorType)}
                size={this.getIconSize(variant)}
                color={this.getErrorColor(errorType)}
              />
            </View>

            {/* כותרת */}
            {variant !== "minimal" && (
              <Text
                style={[
                  styles.title,
                  variant === "compact" && styles.titleCompact,
                ]}
              >
                {this.getErrorTitle(errorType)}
              </Text>
            )}

            {/* הודעת משנה */}
            <Text
              style={[
                styles.subtitle,
                variant === "compact" && styles.subtitleCompact,
                variant === "minimal" && styles.subtitleMinimal,
              ]}
            >
              {this.getErrorMessage(errorType)}
            </Text>

            {/* פרטי שגיאה במצב פיתוח בלבד */}
            {__DEV__ && this.state.details && variant !== "minimal" && (
              <View style={styles.detailsContainer}>
                <Text style={styles.detailsTitle}>פרטי שגיאה (פיתוח):</Text>
                <Text style={styles.detailsText}>{this.state.details}</Text>
              </View>
            )}

            {/* כפתורי פעולה */}
            <View style={styles.actionsContainer}>
              {/* כפתור נסה שוב */}
              {canRetry && (
                <TouchableOpacity
                  style={[styles.retryButton, styles.primaryButton]}
                  onPress={this.handleRetry}
                  hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                  accessibilityRole="button"
                  accessibilityLabel="נסה שוב"
                  accessibilityHint="מנסה לטעון מחדש את האפליקציה"
                >
                  <Ionicons
                    name="refresh-outline"
                    size={16}
                    color={theme.colors.background}
                    style={styles.retryIcon}
                  />
                  <Text style={styles.retryText}>
                    {retryCount > 0
                      ? `נסה שוב (${retryCount}/${maxRetries})`
                      : "נסה שוב"}
                  </Text>
                </TouchableOpacity>
              )}

              {/* כפתור משוב */}
              {showFeedbackButton && (
                <TouchableOpacity
                  style={[styles.feedbackButton, styles.secondaryButton]}
                  onPress={this.handleFeedback}
                  hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                  accessibilityRole="button"
                  accessibilityLabel="שלח משוב"
                  accessibilityHint="פתח טופס משוב על השגיאה"
                >
                  <Ionicons
                    name="chatbubble-outline"
                    size={16}
                    color={theme.colors.primary}
                    style={styles.feedbackIcon}
                  />
                  <Text style={styles.feedbackText}>שלח משוב</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }

  /**
   * קבלת אייקון מתאים לפי סוג השגיאה
   */
  private getErrorIcon(errorType?: string): keyof typeof Ionicons.glyphMap {
    switch (errorType) {
      case "network":
        return "wifi-outline";
      case "auth":
        return "lock-closed-outline";
      case "validation":
        return "alert-circle-outline";
      default:
        return "alert-circle-outline";
    }
  }

  /**
   * קבלת גודל אייקון לפי variant
   */
  private getIconSize(variant: string): number {
    switch (variant) {
      case "compact":
        return 48;
      case "minimal":
        return 32;
      default:
        return 64;
    }
  }

  /**
   * קבלת צבע מתאים לפי סוג השגיאה
   */
  private getErrorColor(errorType?: string): string {
    switch (errorType) {
      case "network":
        return theme.colors.warning;
      case "auth":
        return theme.colors.error;
      case "validation":
        return theme.colors.secondary;
      default:
        return theme.colors.error;
    }
  }

  /**
   * קבלת כותרת מתאימה לפי סוג השגיאה
   */
  private getErrorTitle(errorType?: string): string {
    switch (errorType) {
      case "network":
        return "בעיית חיבור";
      case "auth":
        return "שגיאת הרשאה";
      case "validation":
        return "נתונים לא תקינים";
      default:
        return this.props.fallbackMessage || "משהו השתבש";
    }
  }

  /**
   * קבלת הודעה מתאימה לפי סוג השגיאה
   */
  private getErrorMessage(errorType?: string): string {
    switch (errorType) {
      case "network":
        return "אנא בדוק את החיבור לאינטרנט ונסה שוב";
      case "auth":
        return "אנא התחבר מחדש למערכת";
      case "validation":
        return "אנא תקן את הנתונים ונסה שוב";
      default:
        return "אנחנו עובדים על פתרון הבעיה. אנא נסה שוב.";
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  content: {
    alignItems: "center",
    maxWidth: 320,
    width: "100%",
  },
  iconContainer: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: theme.spacing.xl,
  },
  detailsContainer: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.xl,
    width: "100%",
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.warning,
    marginBottom: theme.spacing.sm,
  },
  detailsText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 16,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44, // נגישות - מינימום 44px לגודל מגע
    minWidth: 120,
    ...theme.shadows.medium,
  },
  retryIcon: {
    marginRight: theme.spacing.sm,
  },
  contentCompact: {
    maxWidth: 280,
    paddingHorizontal: theme.spacing.md,
  },
  contentMinimal: {
    maxWidth: 240,
    paddingHorizontal: theme.spacing.sm,
  },

  // Title variants
  titleCompact: {
    fontSize: 20,
    marginBottom: theme.spacing.sm,
  },

  // Subtitle variants
  subtitleCompact: {
    fontSize: 14,
    marginBottom: theme.spacing.lg,
  },
  subtitleMinimal: {
    fontSize: 12,
    marginBottom: theme.spacing.md,
  },

  // Actions container
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },

  // Button variants
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },

  // Feedback button
  feedbackButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    minWidth: 120,
  },
  feedbackIcon: {
    marginRight: theme.spacing.sm,
  },
  retryText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: "600",
  },
  feedbackText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});
