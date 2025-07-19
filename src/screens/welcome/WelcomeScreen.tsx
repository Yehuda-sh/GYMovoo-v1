/**
 * @file src/screens/welcome/WelcomeScreen.tsx
 * @description Welcome Screen - שלושה כפתורים: התחברות, התחברות עם Google, התחלת שאלון (הרשמה)
 * עברית: מסך ברוכים הבאים עם ניווט לכל מסך מתאים, עיצוב RTL.
 * English: Welcome screen with login/register/google, RTL design.
 */

import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function WelcomeScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/welcome.png")}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>ברוכים הבאים ל־GYMovoo</Text>
      <Text style={styles.subtitle}>האפליקציה שתבנה לך תוכנית אימון אישית</Text>

      <TouchableOpacity
        style={styles.buttonOutline}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.buttonTextOutline}>התחברות</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonGoogle}
        onPress={() => {
          // אפשר לשלב Google Auth אמיתי בעתיד
          navigation.navigate("Login", { google: true });
        }}
      >
        <Text style={styles.buttonTextGoogle}>התחברות מהירה עם Google</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.buttonText}>התחל שאלון</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#007AFF",
    textAlign: "center",
    marginBottom: 12,
    writingDirection: "rtl",
  },
  subtitle: {
    fontSize: 16,
    color: "#5856D6",
    textAlign: "center",
    marginBottom: 32,
    writingDirection: "rtl",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 6,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
    letterSpacing: 1,
  },
  buttonOutline: {
    backgroundColor: "#fff",
    borderColor: "#007AFF",
    borderWidth: 2,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 6,
  },
  buttonTextOutline: {
    color: "#007AFF",
    fontWeight: "600",
    fontSize: 18,
    letterSpacing: 1,
  },
  buttonGoogle: {
    backgroundColor: "#fff",
    borderColor: "#4285F4",
    borderWidth: 2,
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 12,
    marginBottom: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonTextGoogle: {
    color: "#4285F4",
    fontWeight: "600",
    fontSize: 18,
    letterSpacing: 1,
    textAlign: "center",
    width: "100%",
  },
});
