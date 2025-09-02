/**
 * @file src/screens/workout/components/WorkoutErrorBoundary.tsx
 * @brief Error Boundary for Workout Components
 * @updated August 2025 - Enhanced error handling with recovery options
 */

import React, { Component, ReactNode } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../styles/theme";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

class WorkoutErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });

    // Log error to console
    console.error("🚨 WorkoutErrorBoundary caught an error:", error);
    console.error("📋 Error info:", errorInfo);

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  override render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <MaterialCommunityIcons
              name="alert-circle"
              size={64}
              color={theme.colors.error}
              style={styles.icon}
            />

            <Text style={styles.title}>אופס! משהו השתבש</Text>

            <Text style={styles.message}>
              נתקלנו בבעיה טכנית במסך האימון.{"\n"}
              אנא נסה שוב או חזור למסך הקודם.
            </Text>

            {__DEV__ && this.state.error && (
              <View style={styles.debugInfo}>
                <Text style={styles.debugTitle}>Debug Info:</Text>
                <Text style={styles.debugText}>{this.state.error.message}</Text>
                {this.state.errorInfo && (
                  <Text style={styles.debugText}>
                    {this.state.errorInfo.componentStack}
                  </Text>
                )}
              </View>
            )}

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.button, styles.retryButton]}
                onPress={this.handleRetry}
                accessibilityLabel="נסה שוב"
                accessibilityHint="לנסות לטעון את המסך מחדש"
              >
                <MaterialCommunityIcons
                  name="refresh"
                  size={20}
                  color={theme.colors.background}
                />
                <Text style={styles.retryButtonText}>נסה שוב</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    padding: 24,
    maxWidth: 320,
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  debugInfo: {
    backgroundColor: theme.colors.surfaceVariant,
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    width: "100%",
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.colors.error,
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontFamily: "monospace",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.background,
  },
});

export default WorkoutErrorBoundary;
