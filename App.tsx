/**
 * @file App.tsx
 * @brief נקודת הכניסה הראשית לאפליקציית GYMovoo - גרסה פשוטה ומשופרת
 */

// חשוב: חייב להיות ממש בהתחלה לפני כל ייבוא אחר
import "react-native-gesture-handler";
import "react-native-reanimated";

import React, { useEffect, useRef } from "react";
import { StyleSheet, AppState, StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import AppNavigator from "./src/navigation/AppNavigator";
import { ErrorBoundary } from "./src/components/common/ErrorBoundary";
import { useAppInitialization } from "./src/hooks/useAppInitialization";
import { logger } from "./src/utils/logger";
import { initializeRTL } from "./src/utils/rtlHelpers";

export default function App(): React.JSX.Element {
  // מניעת אתחול כפול של הגדרות עברית
  const isRTLInitialized = useRef(false);
  const appState = useRef(AppState.currentState);

  useAppInitialization();

  // אתחול הגדרות עברית פעם אחת בלבד
  useEffect(() => {
    if (!isRTLInitialized.current) {
      initializeRTL();
      isRTLInitialized.current = true;
      logger.info("App", "RTL initialized successfully");
    }
  }, []);

  // מעקב אחרי מצב האפליקציה (רקע/חזית)
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      // חזרה מרקע לחזית
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        logger.info("App", "App returned to foreground");
        // כאן אפשר לרענן נתונים אם צריך
      }

      // מעבר לרקע
      if (nextAppState.match(/inactive|background/)) {
        logger.info("App", "App moved to background");
        // כאן אפשר לשמור נתונים חשובים
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={styles.root}>
        <SafeAreaProvider>
          {/* סטטוס בר – נראה טוב גם במצב כהה וגם בבהיר */}
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="light-content"
          />
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
