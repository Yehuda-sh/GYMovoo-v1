import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageKeys } from "../../constants/StorageKeys";
import { theme } from "../../styles/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "../../components/common/BackButton";
import { useNavigation } from "@react-navigation/native";

const TermsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [agreed, setAgreed] = useState(false);

  const handleAgreement = async () => {
    setAgreed(true);

    try {
      const agreement = {
        agreed: true,
        agreedAt: new Date().toISOString(),
        version: "v1.0",
      };
      await AsyncStorage.setItem(
        StorageKeys.TERMS_AGREEMENT,
        JSON.stringify(agreement)
      );

      navigation.goBack();
    } catch (error) {
      console.warn("Failed to save agreement:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.title}>תנאי שימוש</Text>
        <View style={styles.spacer} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Introduction */}
          <View style={styles.introSection}>
            <MaterialCommunityIcons
              name="shield-check"
              size={48}
              color={theme.colors.primary}
            />
            <Text style={styles.introTitle}>ברוכים הבאים ל-GYMovoo</Text>
            <Text style={styles.introText}>
              התנאים הבאים מסדירים את השימוש באפליקציה שלנו
            </Text>
          </View>

          {/* General Terms */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>תנאים כלליים</Text>

            <View style={styles.termItem}>
              <View style={styles.termNumber}>
                <Text style={styles.termNumberText}>1</Text>
              </View>
              <Text style={styles.termText}>
                השימוש באפליקציה מותנה בקבלת תנאי השימוש במלואם
              </Text>
            </View>

            <View style={styles.termItem}>
              <View style={styles.termNumber}>
                <Text style={styles.termNumberText}>2</Text>
              </View>
              <Text style={styles.termText}>
                המשתמש אחראי לשמירה על פרטי הכניסה שלו בסודיות
              </Text>
            </View>

            <View style={styles.termItem}>
              <View style={styles.termNumber}>
                <Text style={styles.termNumberText}>3</Text>
              </View>
              <Text style={styles.termText}>
                אנו שומרים על זכות לעדכן את התנאים בהתראה מוקדמת
              </Text>
            </View>
          </View>

          {/* Privacy Policy */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>מדיניות פרטיות</Text>

            <View style={styles.termItem}>
              <View style={styles.termNumber}>
                <Text style={styles.termNumberText}>4</Text>
              </View>
              <Text style={styles.termText}>
                אנו אוספים נתונים רק לשיפור השירות ולמטרות פונקציונליות
              </Text>
            </View>

            <View style={styles.termItem}>
              <View style={styles.termNumber}>
                <Text style={styles.termNumberText}>5</Text>
              </View>
              <Text style={styles.termText}>
                פרטיכם מוגנים ולא יועברו לצדדים שלישיים ללא הסכמתכם
              </Text>
            </View>

            <View style={styles.termItem}>
              <View style={styles.termNumber}>
                <Text style={styles.termNumberText}>6</Text>
              </View>
              <Text style={styles.termText}>
                ניתן לבקש מחיקת נתונים אישיים בכל עת דרך הגדרות החשבון
              </Text>
            </View>
          </View>

          {/* Summary */}
          <View style={styles.summarySection}>
            <MaterialCommunityIcons
              name="check-circle"
              size={24}
              color={theme.colors.primary}
            />
            <Text style={styles.summaryText}>
              שימוש באפליקציה מהווה אישור לכל תנאי השימוש והפרטיות
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Agreement Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.agreeButton, agreed && styles.agreeButtonActive]}
          onPress={handleAgreement}
          disabled={agreed}
        >
          <MaterialCommunityIcons
            name={agreed ? "check-circle" : "check"}
            size={20}
            color={agreed ? "#fff" : theme.colors.primary}
          />
          <Text
            style={[
              styles.agreeButtonText,
              agreed && styles.agreeButtonTextActive,
            ]}
          >
            {agreed ? "הסכמתי לתנאים" : "אני מסכים לתנאי השימוש"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TermsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
  },
  introSection: {
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  introTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  introText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: "right",
  },
  termItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  termNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: theme.spacing.md,
  },
  termNumberText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  termText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
    textAlign: "right",
  },
  summarySection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary + "20",
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.md,
  },
  summaryText: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.primary,
    textAlign: "center",
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  footer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  agreeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  agreeButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  agreeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  },
  agreeButtonTextActive: {
    color: "#fff",
  },
  spacer: {
    width: 40,
  },
});
