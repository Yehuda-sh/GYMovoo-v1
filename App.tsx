import React from "react";
import AppNavigator from "./src/navigation/AppNavigator";
// בתחילת הקובץ הראשי (App.tsx או app/_layout.tsx)
import "react-native-reanimated";
import Toast from "react-native-toast-message";
import "react-native-gesture-handler";
export default function App() {
  return (
    <>
      <AppNavigator />
      <Toast />
    </>
  );
}
