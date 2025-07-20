/**
 * @file src/screens/welcome/WelcomeScreen.tsx
 * @description Welcome Screen משודרג - אנימציות, תצוגת יתרונות, התחלה מהירה ומונה משתמשים
 */

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { theme } from "../../styles/theme";
import { useUserStore } from "../../stores/userStore";

const { width: screenWidth } = Dimensions.get("window");

export default function WelcomeScreen() {
  const navigation = useNavigation<any>();
  const setUser = useUserStore((state) => state.setUser);

  // אנימציות כניסה // Entry animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const buttonsTranslate = useRef(new Animated.Value(50)).current;
  const featuresOpacity = useRef(new Animated.Value(0)).current;

  // מונה משתמשים // Users counter
  const [activeUsers, setActiveUsers] = useState(0);
  const targetUsers = 2847; // מספר קטן יותר כמבוקש

  // קרוסלת יתרונות // Benefits carousel
  const [currentFeature, setCurrentFeature] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // סטייט לטעינת Google // Google loading state
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // יתרונות האפליקציה // App benefits
  const features = [
    {
      icon: "dumbbell",
      title: "תוכנית אישית",
      description: "מותאמת לרמתך ומטרותיך",
      color: "#4e9eff",
    },
    {
      icon: "trending-up",
      title: "מעקב התקדמות",
      description: "גרפים וסטטיסטיקות מפורטות",
      color: "#5856D6",
    },
    {
      icon: "school",
      title: "הדרכה מקצועית",
      description: "וידאו הדרכה לכל תרגיל",
      color: "#34C759",
    },
  ];

  useEffect(() => {
    // אנימציות כניסה // Entry animations sequence
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(buttonsTranslate, {
        toValue: 0,
        duration: 600,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(featuresOpacity, {
        toValue: 1,
        duration: 800,
        delay: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // אנימציית מונה // Counter animation
    const increment = targetUsers / 50;
    const timer = setInterval(() => {
      setActiveUsers((prev) => {
        if (prev >= targetUsers) {
          clearInterval(timer);
          return targetUsers;
        }
        return Math.min(prev + increment, targetUsers);
      });
    }, 30);

    // קרוסלה אוטומטית // Auto carousel
    const carouselTimer = setInterval(() => {
      setCurrentFeature((prev) => {
        const next = (prev + 1) % features.length;
        scrollViewRef.current?.scrollTo({
          x: next * (screenWidth * 0.8 + 20), // רוחב כרטיס + מרווחים
          animated: true,
        });
        return next;
      });
    }, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(carouselTimer);
    };
  }, []);

  // אנימציה בלחיצה // Press animation
  const animatePress = (scaleValue: Animated.Value) => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const buttonScale = useRef(new Animated.Value(1)).current;

  // סימולציית Google Sign In // Google Sign In simulation
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);

    // סימולציה של תהליך אימות // Simulating auth process
    setTimeout(() => {
      // יצירת משתמש פיקטיבי מ-Google // Creating fake Google user
      const googleUser = {
        id: "google_" + Date.now(),
        email: "user@gmail.com",
        name: "משתמש Google",
        provider: "google",
        avatar:
          "https://ui-avatars.com/api/?name=Google+User&background=4285F4&color=fff",
      };

      // שמירה ב-store // Save to store
      setUser(googleUser);

      // ניווט למסך הבא // Navigate to next screen
      // אם המשתמש חדש - לשאלון, אם קיים - למסך ראשי
      navigation.navigate("Questionnaire");

      setIsGoogleLoading(false);
    }, 1500); // השהייה של 1.5 שניות לסימולציה
  };

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.backgroundAlt]}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* לוגו עם אנימציה // Animated logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Image
            source={require("../../../assets/welcome.png")}
            style={styles.image}
            resizeMode="contain"
          />
        </Animated.View>

        {/* כותרות // Titles */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.title}>ברוכים הבאים ל־GYMovoo</Text>
          <Text style={styles.subtitle}>
            האפליקציה שתבנה לך תוכנית אימון אישית
          </Text>
        </Animated.View>

        {/* מונה משתמשים פעילים // Active users counter */}
        <Animated.View
          style={[styles.usersCounter, { opacity: featuresOpacity }]}
        >
          <Icon name="account-group" size={20} color={theme.colors.accent} />
          <Text style={styles.usersText}>
            {Math.floor(activeUsers).toLocaleString()} מתאמנים פעילים
          </Text>
        </Animated.View>

        {/* תצוגת יתרונות // Benefits display */}
        <Animated.View style={{ opacity: featuresOpacity }}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            snapToInterval={screenWidth * 0.8 + 20} // הוספת snap מדויק
            decelerationRate="fast"
            contentContainerStyle={styles.featuresContainer}
            onMomentumScrollEnd={(event) => {
              const newIndex = Math.round(
                event.nativeEvent.contentOffset.x / (screenWidth * 0.8 + 20)
              );
              setCurrentFeature(newIndex);
            }}
            style={styles.featuresScroll}
          >
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <Icon name={feature.icon} size={40} color={feature.color} />
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </View>
            ))}
          </ScrollView>

          {/* אינדיקטורים לקרוסלה // Carousel indicators */}
          <View style={styles.indicators}>
            {features.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  currentFeature === index && styles.indicatorActive,
                ]}
              />
            ))}
          </View>
        </Animated.View>

        {/* כפתורים // Buttons */}
        <Animated.View
          style={[
            styles.buttonsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: buttonsTranslate }],
            },
          ]}
        >
          {/* כפתור התחל מיד - מודגש // Start now button - emphasized */}
          <TouchableOpacity
            onPress={() => {
              animatePress(buttonScale);
              navigation.navigate("Questionnaire");
            }}
            activeOpacity={0.8}
          >
            <Animated.View
              style={[
                styles.primaryButton,
                { transform: [{ scale: buttonScale }] },
              ]}
            >
              <LinearGradient
                colors={["#4e9eff", "#007AFF"]}
                style={styles.gradientButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Icon name="rocket-launch" size={24} color="#fff" />
                <Text style={styles.primaryButtonText}>התחל ללא הרשמה</Text>
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>

          {/* הסבר על ההרשמה // Registration explanation */}
          <Text style={styles.registrationNote}>
            תוכל להירשם בסוף השאלון ולקבל גישה מלאה לכל התכונות
          </Text>

          {/* כפתורי כניסה // Login buttons */}
          <View style={styles.authGroup}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate("Login")}
              activeOpacity={0.8}
            >
              <Icon name="lock-outline" size={20} color="#6bb5ff" />
              <Text style={styles.secondaryButtonText}>כבר יש לי חשבון</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryButton, styles.googleButton]}
              onPress={handleGoogleSignIn}
              activeOpacity={0.8}
              disabled={isGoogleLoading}
            >
              {isGoogleLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <FontAwesome name="google" size={20} color="#fff" />
                  <Text style={[styles.secondaryButtonText, { color: "#fff" }]}>
                    כניסה עם Google
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 20,
  },
  image: {
    width: 180,
    height: 180,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: 20,
  },
  usersCounter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 30,
    backgroundColor: theme.colors.userCounterBg,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  usersText: {
    color: theme.colors.accent,
    fontSize: 14,
    fontWeight: "600",
  },
  featuresScroll: {
    maxHeight: 150,
    marginBottom: 20,
  },
  featuresContainer: {
    paddingHorizontal: screenWidth * 0.1,
  },
  featureCard: {
    width: screenWidth * 0.8,
    marginHorizontal: 10,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginTop: 10,
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  indicators: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 30,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.indicator,
  },
  indicatorActive: {
    backgroundColor: theme.colors.indicatorActive,
    width: 24,
  },
  buttonsContainer: {
    width: "100%",
    alignItems: "center",
  },
  primaryButton: {
    width: screenWidth - 40,
    marginBottom: 12,
  },
  gradientButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.glow,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  registrationNote: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  authGroup: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    justifyContent: "center",
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: "#6bb5ff",
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6bb5ff",
  },
  googleButton: {
    backgroundColor: theme.colors.google,
    borderColor: theme.colors.google,
    minWidth: 140,
    justifyContent: "center",
  },
});
