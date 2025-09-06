module.exports = {
  preset: "jest-expo",
  roots: ["<rootDir>/src"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|@react-native|expo|@expo|expo-modules-core|react-navigation|@react-navigation|@supabase|zustand|react-native-reanimated|react-native-gesture-handler|react-native-svg|react-native-toast-message)/)",
  ],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  testTimeout: 10000,
  maxWorkers: "50%",
  verbose: false,
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "identity-obj-proxy",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  clearMocks: true,
  restoreMocks: true,
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/__tests__/**",
    "!src/**/*.test.{ts,tsx}",
    "!src/setupTests.ts",
    "!src/constants/**",
    "!src/types/**",
    "!src/data/**",
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  coverageReporters: ["text", "lcov", "html"],
};
