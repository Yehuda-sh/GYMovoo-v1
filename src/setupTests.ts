/**
 * @file src/setupTests.ts
 * @description הגדרות בסיס לבדיקות Jest
 */

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

// Mock expo-modules-core (מונע שגיאות ESM כמו "Cannot use import statement outside a module")
jest.mock("expo-modules-core", () => ({
  NativeModulesProxy: {},
  EventEmitter: class MockEventEmitter {
    addListener() {
      return { remove: () => undefined };
    }
    removeAllListeners() {}
  },
  requireNativeModule: () => ({}),
  requireNativeViewManager: () => ({}),
}));

// Mock ל-polyfill בעייתי של RN שנכשל בפרסינג בסביבת Jest
jest.mock("@react-native/js-polyfills/error-guard", () => ({}));

// Suppress console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
