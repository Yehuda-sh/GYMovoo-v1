/**
 * @file App.tsx
 * @brief נקודת הכניסה הראשית לאפליקציית GYMovoo
 * @updated 2025-09-06
 */

import React from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import AppNavigator from "./src/navigation/AppNavigator";
import { ErrorBoundary } from "./src/components/common/ErrorBoundary";
import { useAppInitialization } from "./src/hooks";
import { initializeRTL } from "./src/utils/rtlHelpers";

import "react-native-reanimated";
import "react-native-gesture-handler";

// Initialize RTL support
initializeRTL();

/**
 * רכיב האפליקציה הראשי
 */
export default function App(): React.JSX.Element {
  // אתחול האפליקציה (ניקוי storage, טעינת נתונים וכו')
  useAppInitialization();

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
