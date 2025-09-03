/**
 * @file src/setupTests.ts
 * @description הגדרות בסיס לבדיקות Jest
 */
import React from "react";

import "react-native-gesture-handler/jestSetup";

// Mock react-native-safe-area-context
jest.mock("react-native-safe-area-context", () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Mock expo-linear-gradient
jest.mock("expo-linear-gradient", () => ({
  LinearGradient: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock vector icons
jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
  MaterialCommunityIcons: "MaterialCommunityIcons",
  MaterialIcons: "MaterialIcons",
  FontAwesome5: "FontAwesome5",
}));

// Mock Animated from react-native
jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

// Mock react-native-reanimated (נדרש כדי למנוע אזהרות/שגיאות ב-Jest)
jest.mock("react-native-reanimated", () =>
  require("react-native-reanimated/mock")
);

// Mock AsyncStorage for Jest environment
jest.mock("@react-native-async-storage/async-storage", () => {
  let store: Record<string, string> = {};
  return {
    setItem: jest.fn(async (key: string, value: string) => {
      store[key] = value;
    }),
    getItem: jest.fn(async (key: string) => store[key] ?? null),
    removeItem: jest.fn(async (key: string) => {
      delete store[key];
    }),
    clear: jest.fn(async () => {
      store = {};
    }),
    getAllKeys: jest.fn(async () => Object.keys(store)),
    multiRemove: jest.fn(async (keys: string[]) => {
      for (const k of keys) delete store[k];
    }),
  };
});

// Mock NativeEventEmitter למניעת אזהרות
jest.mock("react-native/Libraries/EventEmitter/NativeEventEmitter");

// ניקוי אוטומטי בין בדיקות
afterEach(() => {
  jest.clearAllMocks();
});
