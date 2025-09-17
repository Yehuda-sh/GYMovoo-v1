/**
 * @file src/components/profile/BMIBMRCalculator.tsx
 * @brief BMI/BMR Calculator component for ProfileScreen
 */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../core/theme";
import { useUserStore } from "../../stores/userStore";
import type { BMIBMRHistory, BMIBMRResults } from "../../core/types/user.types";

interface BMIBMRData {
  weight: number;
  height: number;
  age: number;
  gender: "male" | "female";
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active";
}

const BMIBMRCalculator: React.FC = () => {
  const { user, updateUser } = useUserStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState<BMIBMRData>({
    weight: 0,
    height: 0,
    age: 0,
    gender: "male",
    activityLevel: "moderate",
  });
  const [results, setResults] = useState<BMIBMRResults | null>(null);
  const [history, setHistory] = useState<BMIBMRHistory[]>([]);

  // Initialize form data from user questionnaire
  useEffect(() => {
    if (user?.questionnaireData?.answers) {
      const answers = user.questionnaireData.answers;

      // Extract weight (convert from range to middle value)
      let weight = 70; // default
      if (typeof answers.weight === "number") {
        weight = answers.weight;
      } else if (typeof answers.weight === "string") {
        const weightRanges: Record<string, number> = {
          under_50: 45,
          "50_60": 55,
          "61_70": 65,
          "71_80": 75,
          "81_90": 85,
          "91_100": 95,
          over_100: 105,
        };
        weight = weightRanges[answers.weight] || 70;
      }

      // Extract height (convert from range to middle value)
      let height = 170; // default
      if (typeof answers.height === "number") {
        height = answers.height;
      } else if (typeof answers.height === "string") {
        const heightRanges: Record<string, number> = {
          under_150: 145,
          "150_160": 155,
          "161_170": 165,
          "171_180": 175,
          "181_190": 185,
          over_190: 195,
        };
        height = heightRanges[answers.height] || 170;
      }

      // Extract age (convert from range to middle value)
      let age = 30; // default
      if (typeof answers.age === "number") {
        age = answers.age;
      } else if (typeof answers.age === "string") {
        const ageRanges: Record<string, number> = {
          under_18: 16,
          "18_25": 22,
          "26_35": 30,
          "36_50": 43,
          "51_65": 58,
          over_65: 70,
        };
        age = ageRanges[answers.age] || 30;
      }

      // Extract gender
      const gender = answers.gender === "female" ? "female" : "male";

      // Determine activity level from availability and fitness goals
      let activityLevel: BMIBMRData["activityLevel"] = "moderate";
      if (answers.availability) {
        const availability = Array.isArray(answers.availability)
          ? answers.availability[0]
          : answers.availability;

        const activityMapping: Record<string, BMIBMRData["activityLevel"]> = {
          "2_days": "light",
          "3_days": "moderate",
          "4_days": "moderate",
          "5_days": "active",
          "6_days": "active",
          "7_days": "very_active",
        };
        activityLevel = activityMapping[availability as string] || "moderate";
      }

      setFormData({
        weight,
        height,
        age,
        gender,
        activityLevel,
      });

      // Calculate initial results
      calculateResults({ weight, height, age, gender, activityLevel });
    }

    // Load history from user data
    if (user?.bmiHistory) {
      setHistory(user.bmiHistory);
    }
  }, [user]);

  const calculateResults = (data: BMIBMRData): BMIBMRResults => {
    const { weight, height, age, gender, activityLevel } = data;

    // BMI Calculation
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    // BMI Category
    let bmiCategory = "";
    if (bmi < 18.5) bmiCategory = "תת משקל";
    else if (bmi < 25) bmiCategory = "משקל תקין";
    else if (bmi < 30) bmiCategory = "עודף משקל";
    else bmiCategory = "השמנה";

    // BMR Calculation (Mifflin-St Jeor Equation)
    let bmr: number;
    if (gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // TDEE Calculation (Total Daily Energy Expenditure)
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };
    const tdee = bmr * activityMultipliers[activityLevel];

    // Ideal Weight Range (based on BMI 18.5-24.9)
    const heightInMetersSquared = heightInMeters * heightInMeters;
    const idealWeight = {
      min: Math.round(18.5 * heightInMetersSquared),
      max: Math.round(24.9 * heightInMetersSquared),
    };

    const results = {
      bmi: Math.round(bmi * 10) / 10,
      bmiCategory,
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      idealWeight,
    };

    setResults(results);
    return results;
  };

  const handleCalculate = () => {
    if (!formData.weight || !formData.height || !formData.age) {
      Alert.alert("שגיאה", "אנא מלא את כל השדות הנדרשים");
      return;
    }

    if (formData.weight < 30 || formData.weight > 300) {
      Alert.alert("שגיאה", 'משקל חייב להיות בין 30-300 ק"ג');
      return;
    }

    if (formData.height < 100 || formData.height > 250) {
      Alert.alert("שגיאה", 'גובה חייב להיות בין 100-250 ס"מ');
      return;
    }

    if (formData.age < 10 || formData.age > 120) {
      Alert.alert("שגיאה", "גיל חייב להיות בין 10-120 שנים");
      return;
    }

    const newResults = calculateResults(formData);

    // Save to history
    const currentDate = new Date().toISOString().split("T")[0];
    const newHistoryEntry: BMIBMRHistory = {
      date: currentDate || "",
      weight: formData.weight,
      bmi: newResults.bmi,
      bmr: newResults.bmr,
    };

    const updatedHistory = [newHistoryEntry, ...history.slice(0, 9)]; // Keep last 10 entries
    setHistory(updatedHistory);

    // Update user store
    updateUser({
      bmiHistory: updatedHistory,
      lastBMICalculation: {
        ...newResults,
        date: newHistoryEntry.date,
      },
    });
  };

  const renderFormField = (
    label: string,
    value: string | number,
    onChangeText: (text: string) => void,
    keyboardType: "numeric" | "default" = "numeric",
    placeholder?: string
  ) => (
    <View style={styles.formField}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.fieldInput}
        value={String(value)}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
      />
    </View>
  );

  const renderActivityLevelSelector = () => (
    <View style={styles.formField}>
      <Text style={styles.fieldLabel}>רמת פעילות</Text>
      <View style={styles.activityLevels}>
        {[
          { key: "sedentary" as const, label: "בישיבה" },
          { key: "light" as const, label: "קלה" },
          { key: "moderate" as const, label: "בינונית" },
          { key: "active" as const, label: "פעילה" },
          { key: "very_active" as const, label: "מאוד פעילה" },
        ].map((level) => (
          <TouchableOpacity
            key={level.key}
            style={[
              styles.activityButton,
              formData.activityLevel === level.key &&
                styles.activityButtonSelected,
            ]}
            onPress={() =>
              setFormData({ ...formData, activityLevel: level.key })
            }
          >
            <Text
              style={[
                styles.activityButtonText,
                formData.activityLevel === level.key &&
                  styles.activityButtonTextSelected,
              ]}
            >
              {level.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderResults = () => {
    if (!results) return null;

    return (
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>תוצאות החישוב</Text>

        <View style={styles.resultsGrid}>
          <View style={styles.resultCard}>
            <MaterialCommunityIcons
              name="scale-bathroom"
              size={24}
              color={theme.colors.primary}
            />
            <Text style={styles.resultNumber}>{results.bmi}</Text>
            <Text style={styles.resultLabel}>BMI</Text>
            <Text style={styles.resultCategory}>{results.bmiCategory}</Text>
          </View>

          <View style={styles.resultCard}>
            <MaterialCommunityIcons
              name="fire"
              size={24}
              color={theme.colors.warning}
            />
            <Text style={styles.resultNumber}>{results.bmr}</Text>
            <Text style={styles.resultLabel}>BMR</Text>
            <Text style={styles.resultSubtext}>קלוריות בסיס</Text>
          </View>

          <View style={styles.resultCard}>
            <MaterialCommunityIcons
              name="nutrition"
              size={24}
              color={theme.colors.success}
            />
            <Text style={styles.resultNumber}>{results.tdee}</Text>
            <Text style={styles.resultLabel}>TDEE</Text>
            <Text style={styles.resultSubtext}>קלוריות יומיות</Text>
          </View>
        </View>

        <View style={styles.idealWeightContainer}>
          <Text style={styles.idealWeightTitle}>משקל אידיאלי</Text>
          <Text style={styles.idealWeightRange}>
            {results.idealWeight.min}-{results.idealWeight.max} ק"ג
          </Text>
        </View>
      </View>
    );
  };

  const renderHistory = () => {
    if (history.length === 0) return null;

    return (
      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>היסטוריה</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {history.slice(0, 5).map((entry, index) => (
            <View key={index} style={styles.historyItem}>
              <Text style={styles.historyDate}>{entry.date}</Text>
              <Text style={styles.historyWeight}>{entry.weight} ק"ג</Text>
              <Text style={styles.historyBMI}>BMI: {entry.bmi}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons
            name="calculator"
            size={24}
            color={theme.colors.primary}
          />
          <Text style={styles.title}>מחשבון BMI/BMR</Text>
        </View>
        <MaterialCommunityIcons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={theme.colors.textSecondary}
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.content}>
          <View style={styles.formContainer}>
            <View style={styles.formRow}>
              {renderFormField(
                'משקל (ק"ג)',
                formData.weight || "",
                (text) =>
                  setFormData({ ...formData, weight: parseFloat(text) || 0 }),
                "numeric",
                "70"
              )}
              {renderFormField(
                'גובה (ס"מ)',
                formData.height || "",
                (text) =>
                  setFormData({ ...formData, height: parseFloat(text) || 0 }),
                "numeric",
                "170"
              )}
            </View>

            <View style={styles.formRow}>
              {renderFormField(
                "גיל",
                formData.age || "",
                (text) =>
                  setFormData({ ...formData, age: parseInt(text) || 0 }),
                "numeric",
                "30"
              )}
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>מין</Text>
                <View style={styles.genderSelector}>
                  <TouchableOpacity
                    style={[
                      styles.genderButton,
                      formData.gender === "male" && styles.genderButtonSelected,
                    ]}
                    onPress={() => setFormData({ ...formData, gender: "male" })}
                  >
                    <Text
                      style={[
                        styles.genderButtonText,
                        formData.gender === "male" &&
                          styles.genderButtonTextSelected,
                      ]}
                    >
                      זכר
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.genderButton,
                      formData.gender === "female" &&
                        styles.genderButtonSelected,
                    ]}
                    onPress={() =>
                      setFormData({ ...formData, gender: "female" })
                    }
                  >
                    <Text
                      style={[
                        styles.genderButtonText,
                        formData.gender === "female" &&
                          styles.genderButtonTextSelected,
                      ]}
                    >
                      נקבה
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {renderActivityLevelSelector()}

            <TouchableOpacity
              style={styles.calculateButton}
              onPress={handleCalculate}
            >
              <Text style={styles.calculateButtonText}>חשב</Text>
            </TouchableOpacity>
          </View>

          {renderResults()}
          {renderHistory()}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing.md,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  content: {
    padding: theme.spacing.md,
    paddingTop: 0,
  },
  formContainer: {
    marginBottom: theme.spacing.lg,
  },
  formRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  formField: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: "right",
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: theme.spacing.sm,
    fontSize: 16,
    color: theme.colors.text,
    textAlign: "right",
    backgroundColor: theme.colors.background,
  },
  genderSelector: {
    flexDirection: "row",
    gap: theme.spacing.xs,
  },
  genderButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  genderButtonSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  genderButtonText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  genderButtonTextSelected: {
    color: theme.colors.white,
    fontWeight: "600",
  },
  activityLevels: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.xs,
  },
  activityButton: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
  },
  activityButtonSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  activityButtonText: {
    fontSize: 12,
    color: theme.colors.text,
  },
  activityButtonTextSelected: {
    color: theme.colors.white,
    fontWeight: "600",
  },
  calculateButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    padding: theme.spacing.md,
    alignItems: "center",
    marginTop: theme.spacing.sm,
  },
  calculateButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  resultsContainer: {
    marginBottom: theme.spacing.lg,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: "right",
  },
  resultsGrid: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  resultCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    padding: theme.spacing.sm,
    alignItems: "center",
  },
  resultNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
  },
  resultLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  resultCategory: {
    fontSize: 10,
    color: theme.colors.primary,
    marginTop: 2,
    fontWeight: "500",
  },
  resultSubtext: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  idealWeightContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    padding: theme.spacing.sm,
    alignItems: "center",
  },
  idealWeightTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  idealWeightRange: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  historyContainer: {
    marginTop: theme.spacing.sm,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: "right",
  },
  historyItem: {
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    padding: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    minWidth: 80,
    alignItems: "center",
  },
  historyDate: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  historyWeight: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.text,
  },
  historyBMI: {
    fontSize: 10,
    color: theme.colors.primary,
    marginTop: 2,
  },
});

export default BMIBMRCalculator;
