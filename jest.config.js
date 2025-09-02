module.exports = {
  preset: "jest-expo",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|@react-native|react-navigation|@react-navigation|expo|@expo|expo-modules-core|@unimodules|unimodules|react-native-safe-area-context|@react-native-community)/)",
  ],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "identity-obj-proxy",
    "^react-native/Libraries/Animated/NativeAnimatedHelper$":
      "<rootDir>/__mocks__/react-native/Libraries/Animated/NativeAnimatedHelper.js",
  },
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/services/demo/**",
    "!src/**/__tests__/**",
    "!src/**/node_modules/**",
  ],
};
