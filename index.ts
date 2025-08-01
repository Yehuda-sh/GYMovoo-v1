/**
 * @file index.ts
 * @description נקודת כניסה ראשית לאפליקציית GYMovoo
 * English: Main entry point for GYMovoo application
 */
import { registerRootComponent } from "expo";
import App from "./App";

// רישום רכיב הבסיס של האפליקציה
// Register the root component of the application
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
