/**
 * @file src/setupTests.ts
 * @description הגדרות בסיס לבדיקות Jest - מאופטם וקומפקטי
 */

import "react-native-gesture-handler/jestSetup";

// ===============================================
// 🎭 UI Component Mocks
// ===============================================

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

// ===============================================
// 🎬 Animation & Performance Mocks
// ===============================================

// Mock react-native-reanimated
jest.mock("react-native-reanimated", () =>
  require("react-native-reanimated/mock")
);

// Mock NativeEventEmitter
jest.mock("react-native/Libraries/EventEmitter/NativeEventEmitter");

// ===============================================
// 📱 Expo & React Native API Mocks
// ===============================================

// Mock expo-status-bar
jest.mock("expo-status-bar", () => ({
  StatusBar: "StatusBar",
}));

// Mock react-native-toast-message
jest.mock("react-native-toast-message", () => ({
  show: jest.fn(),
  hide: jest.fn(),
  default: "Toast",
}));

// ===============================================
// 💾 Storage Mock - פשוט ויעיל
// ===============================================

// Mock AsyncStorage - פשוט ומהיר לבדיקות
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
  multiRemove: jest.fn(() => Promise.resolve()),
}));

// ===============================================
// 🧹 Cleanup
// ===============================================

// ניקוי אוטומטי בין בדיקות
afterEach(() => {
  jest.clearAllMocks();
});
