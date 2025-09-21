/**
 * @file App.tsx
 * @brief נקודת הכניסה הראשית לאפליקציית GYMovoo
 */

import { initializeRTL } from "./src/utils/rtlHelpers";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import AppNavigator from "./src/navigation/AppNavigator";
import { ErrorBoundary } from "./src/components/common/ErrorBoundary";
import { useAppInitialization } from "./src/hooks/useAppInitialization";
import { logger } from "./src/utils/logger";

import "react-native-reanimated";
import "react-native-gesture-handler";

/**
 * רכיב האפליקציה הראשי
 */
export default function App(): React.JSX.Element {
  useAppInitialization();

  // אתחול RTL בתחילת האפליקציה
  useEffect(() => {
    initializeRTL();
  }, []);

  // טיפול ב-unhandled promise rejections
  useEffect(() => {
    // Error handler for unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      logger.error("App", "Unhandled promise rejection", {
        reason: event.reason,
        promise: event.promise,
      });

      // מנע התרסקות האפליקציה
      event.preventDefault?.();
    };

    // Error handler for uncaught exceptions
    const handleError = (event: ErrorEvent) => {
      logger.error("App", "Uncaught exception", {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
      });
    };

    // הוספת event listeners (אם זמינים)
    if (typeof window !== "undefined") {
      window.addEventListener?.("unhandledrejection", handleUnhandledRejection);
      window.addEventListener?.("error", handleError);
    }

    return () => {
      // ניקוי
      if (typeof window !== "undefined") {
        window.removeEventListener?.(
          "unhandledrejection",
          handleUnhandledRejection
        );
        window.removeEventListener?.("error", handleError);
      }
    };
  }, []);

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={styles.root}>
        <SafeAreaProvider>
          <AppNavigator />
          <Toast />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
