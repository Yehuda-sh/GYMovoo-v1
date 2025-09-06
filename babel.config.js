module.exports = {
  presets: ["babel-preset-expo"],
  plugins: [
    // Performance optimizations
    "react-native-reanimated/plugin", // Must be last
  ],
  env: {
    production: {
      plugins: [
        "transform-remove-console", // Remove console.* in production
      ],
    },
  },
};
