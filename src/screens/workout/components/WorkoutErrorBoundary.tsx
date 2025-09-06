/**
 * @file src/screens/workout/components/WorkoutErrorBoundary.tsx
 * @description Error boundary component for workout screens
 *
 * Features:
 * - Catches and displays errors in workout components
 * - Retry functionality to recover from errors
 * - Debug information in development mode
 */

import React, { Component, ReactNode } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../styles/theme";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
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
    console.error("🚨 WorkoutErrorBoundary caught an error:", error);
    console.error("📋 Error info:", errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  override render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <MaterialCommunityIcons
              name="alert-circle"
              size={48}
              color={theme.colors.error}
              style={styles.icon}
            />

            <Text style={styles.title}>אופס! משהו השתבש</Text>

            <Text style={styles.message}>
              נתקלנו בבעיה במסך האימון.{"\n"}
              אנא נסה שוב.
            </Text>

            {__DEV__ && this.state.error && (
              <View style={styles.debugInfo}>
                <Text style={styles.debugTitle}>שגיאה:</Text>
                <Text style={styles.debugText}>{this.state.error.message}</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.retryButton}
              onPress={this.handleRetry}
            >
              <MaterialCommunityIcons name="refresh" size={20} color="white" />
              <Text style={styles.retryButtonText}>נסה שוב</Text>
            </TouchableOpacity>
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

  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    marginTop: 16,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});

export default WorkoutErrorBoundary;
