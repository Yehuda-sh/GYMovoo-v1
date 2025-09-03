/**
 * @file App.tsx
 * @brief נקודת הכניסה הראשית לאפליקציית GYMovoo
 * @updated 2025-09-03
 */

import React, { useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import AppNavigator from "./src/navigation/AppNavigator";
import { StorageCleanup } from "./src/utils/storageCleanup";
import { dataManager } from "./src/services/core";
import { useUserStore } from "./src/stores/userStore";
import { ErrorBoundary } from "./src/components/common/ErrorBoundary";
import "./src/utils/rtlHelpers";

import "react-native-reanimated";
import "react-native-gesture-handler";

/**
 * רכיב האפליקציה הראשי
 */
export default function App(): React.JSX.Element {
  const { user } = useUserStore();
  const initializedUserIdRef = useRef<string | null>(null);
  const isInitializingRef = useRef(false);
  const didRefreshRef = useRef(false);

  // RTL initialization and other setup
  useEffect(() => {
    // Removed performance cleanup - not needed for simple fitness app
  }, []);

  // ניקוי אחסון
  useEffect(() => {
    const initStorageCleanup = async (): Promise<void> => {
      try {
        const isFull = await StorageCleanup.isStorageFull();
        if (isFull) {
          await StorageCleanup.emergencyCleanup();
        } else {
          await StorageCleanup.cleanOldData();
        }
      } catch (error) {
        console.warn("Storage cleanup failed:", error);
      }
    };
    initStorageCleanup();
  }, []);

  // אתחול מנהל נתונים
  useEffect(() => {
    const initData = async (): Promise<void> => {
      if (!user?.id) {
        return;
      }

      // איפוס דגל רענון כשמתחלף משתמש
      if (initializedUserIdRef.current !== user.id) {
        didRefreshRef.current = false;
      }

      // אם כבר מאותחל עבור המשתמש הזה והמערכת מוכנה
      if (initializedUserIdRef.current === user.id && dataManager.isReady()) {
        return;
      }

      // הימנע מהרצות מקבילות
      if (isInitializingRef.current) {
        return;
      }

      try {
        // רענון מהשרת
        if (!didRefreshRef.current) {
          await useUserStore.getState().refreshFromServer();
          didRefreshRef.current = true;
        }
      } catch (e) {
        console.warn(
          "refreshFromServer failed:",
          e instanceof Error ? e.message : String(e)
        );
      }

      try {
        if (dataManager.isReady() && initializedUserIdRef.current === user.id) {
          return;
        }
        isInitializingRef.current = true;
        await dataManager.initialize(user);
        initializedUserIdRef.current = user.id;
      } catch (error) {
        console.error("Data manager initialization failed:", error);
      } finally {
        isInitializingRef.current = false;
      }
    };

    if (user?.id) initData();
  }, [user]);

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
