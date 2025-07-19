/**
 * @file src/screens/welcome/WelcomeScreen.tsx
 * @description Welcome Screen - שלושה כפתורים: התחברות, Google, התחלת שאלון (הרשמה)
 * Visual Upgrade - עיצוב מודרני, ריווח וכפתורים גדולים עם צל.
 */

/**
 * @file src/screens/welcome/WelcomeScreen.tsx
 * @description Welcome Screen - אייקונים לכל כפתור, גרדיאנט, עיצוב מודרני וקליקבילי
 */

import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { theme } from "../../styles/theme";

export default function WelcomeScreen() {
  const navigation = useNavigation<any>();

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.backgroundAlt]}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <Image
          source={require("../../../assets/welcome.png")}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>ברוכים הבאים ל־GYMovoo</Text>
        <Text style={styles.subtitle}>
          האפליקציה שתבנה לך תוכנית אימון אישית
        </Text>

        <View style={styles.authGroup}>
          <TouchableOpacity
            style={styles.buttonOutline}
            onPress={() => navigation.navigate("Login")}
            activeOpacity={0.8}
          >
            <Icon
              name="lock-outline"
              size={22}
              color="#6bb5ff"
              style={styles.icon}
            />
            <Text style={[styles.buttonTextOutline, { color: "#6bb5ff" }]}>
              התחברות
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.buttonOutline, { borderColor: "#fff" }]}
            onPress={() => navigation.navigate("Login", { google: true })}
            activeOpacity={0.8}
          >
            <FontAwesome
              name="google"
              size={22}
              color="#fff"
              style={styles.icon}
            />
            <Text style={[styles.buttonTextOutline, { color: "#fff" }]}>
              התחברות עם Google
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>או</Text>
          <View style={styles.divider} />
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          style={{ width: "100%" }}
          onPress={() => navigation.navigate("Register")}
        >
          <LinearGradient
            colors={["#4e9eff", "#1e67c6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Icon
              name="clipboard-list-outline"
              size={22}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>התחל שאלון</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  image: {
    width: 160,
    height: 160,
    marginBottom: 28,
    borderRadius: 24,
    borderWidth: 0,
    backgroundColor: "#242a47",
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 0.5,
    writingDirection: "rtl",
  },
  subtitle: {
    fontSize: 16,
    color: "#8CA8FF",
    textAlign: "center",
    marginBottom: 30,
    fontWeight: "500",
    writingDirection: "rtl",
  },
  authGroup: {
    width: "100%",
    gap: 14,
    marginBottom: 24,
  },
  buttonOutline: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#1e2640",
    borderColor: "#6bb5ff",
    borderWidth: 2,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 24,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 8,
    width: "100%",
    justifyContent: "center",
  },
  buttonTextOutline: {
    color: "#6bb5ff",
    fontWeight: "bold",
    fontSize: 19,
    letterSpacing: 1,
  },
  icon: {
    marginLeft: 12,
    marginRight: 0,
  },
  dividerRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    width: "100%",
    marginVertical: 18,
    gap: 6,
  },
  divider: {
    flex: 1,
    height: 1.5,
    backgroundColor: "#4b5a7a",
    borderRadius: 1,
  },
  dividerText: {
    fontSize: 16,
    color: "#7a8ab5",
    marginHorizontal: 9,
    fontWeight: "500",
  },
  gradientButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 24,
    width: "100%",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.23,
    shadowRadius: 18,
    elevation: 5,
    marginBottom: 2,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 19,
    letterSpacing: 1,
  },
});
