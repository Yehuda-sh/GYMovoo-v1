import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";

export default function BackButton({
  absolute = true,
}: {
  absolute?: boolean;
}) {
  const navigation = useNavigation<any>();
  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={[styles.button, absolute && styles.absolute]}
      activeOpacity={0.85}
      accessibilityLabel="חזור"
    >
      <Ionicons
        name="arrow-back"
        size={24}
        color={theme.colors.text}
        style={{ transform: [{ scaleX: -1 }] }} // RTL
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#232a46bb", // כהה, חצי שקוף
    borderRadius: 24,
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    zIndex: 99,
  },
  absolute: {
    position: "absolute",
    top: 40, // קצת מתחת לסטטוס בר
    right: 16,
  },
});
