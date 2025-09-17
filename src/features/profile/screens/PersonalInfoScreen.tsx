import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../core/theme";
import { useUserStore } from "../../../stores/userStore";
import type { PersonalInfo } from "../../../core/types/user.types";
import AppButton from "../../../components/common/AppButton";
import { logger } from "../../../utils/logger";

const WORK_STYLES = [
  {
    value: "sitting" as const,
    label: "יושב רוב היום",
    icon: "chair-rolling" as const,
  },
  {
    value: "standing" as const,
    label: "עומד רוב היום",
    icon: "human-handsup" as const,
  },
  { value: "mixed" as const, label: "משולב", icon: "human" as const },
  { value: "active" as const, label: "פעיל מאוד", icon: "run" as const },
];

const TRAINING_TIMES = [
  {
    value: "morning" as const,
    label: "בוקר",
    icon: "weather-sunset-up" as const,
  },
  {
    value: "afternoon" as const,
    label: "צהריים",
    icon: "weather-sunny" as const,
  },
  {
    value: "evening" as const,
    label: "ערב",
    icon: "weather-sunset-down" as const,
  },
  { value: "night" as const, label: "לילה", icon: "weather-night" as const },
];

const STRESS_LEVELS = [
  { value: "low" as const, label: "נמוך", color: theme.colors.success },
  { value: "medium" as const, label: "בינוני", color: theme.colors.warning },
  { value: "high" as const, label: "גבוה", color: theme.colors.error },
];

export function PersonalInfoScreen() {
  const navigation = useNavigation();
  const { user, updateUser } = useUserStore();
  const [formData, setFormData] = useState<PersonalInfo>(
    user?.personalInfo || {}
  );

  const handleSave = async () => {
    try {
      logger.info("PersonalInfoScreen", "Saving personal info");

      await updateUser({
        personalInfo: {
          ...formData,
          lastUpdated: new Date().toISOString(),
        },
      });

      logger.info("PersonalInfoScreen", "Personal info saved successfully");
      navigation.goBack();
    } catch (error) {
      logger.error("PersonalInfoScreen", "Error saving personal info", error);
    }
  };

  const updateField = (
    field: keyof PersonalInfo,
    value: string | number | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <MaterialCommunityIcons
                name="arrow-right"
                size={24}
                color={theme.colors.text}
              />
            </TouchableOpacity>
            <Text style={styles.title}>מידע אישי מתקדם</Text>
          </View>

          {/* Body Measurements Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>מידות גוף</Text>

            <View style={styles.row}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>משקל (ק"ג)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.weight?.toString() || ""}
                  onChangeText={(text) =>
                    updateField("weight", parseFloat(text) || undefined)
                  }
                  keyboardType="numeric"
                  placeholder="70"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>גובה (ס"מ)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.height?.toString() || ""}
                  onChangeText={(text) =>
                    updateField("height", parseFloat(text) || undefined)
                  }
                  keyboardType="numeric"
                  placeholder="175"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>אחוז שומן</Text>
                <TextInput
                  style={styles.input}
                  value={formData.bodyFat?.toString() || ""}
                  onChangeText={(text) =>
                    updateField("bodyFat", parseFloat(text) || undefined)
                  }
                  keyboardType="numeric"
                  placeholder="15"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>היקף מותניים</Text>
                <TextInput
                  style={styles.input}
                  value={formData.waist?.toString() || ""}
                  onChangeText={(text) =>
                    updateField("waist", parseFloat(text) || undefined)
                  }
                  keyboardType="numeric"
                  placeholder="80"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>היקף חזה</Text>
                <TextInput
                  style={styles.input}
                  value={formData.chest?.toString() || ""}
                  onChangeText={(text) =>
                    updateField("chest", parseFloat(text) || undefined)
                  }
                  keyboardType="numeric"
                  placeholder="100"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>היקף זרוע</Text>
                <TextInput
                  style={styles.input}
                  value={formData.bicep?.toString() || ""}
                  onChangeText={(text) =>
                    updateField("bicep", parseFloat(text) || undefined)
                  }
                  keyboardType="numeric"
                  placeholder="35"
                />
              </View>
            </View>
          </View>

          {/* Lifestyle Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>אורח חיים</Text>

            <Text style={styles.label}>סגנון עבודה</Text>
            <View style={styles.optionsGrid}>
              {WORK_STYLES.map((style) => (
                <TouchableOpacity
                  key={style.value}
                  style={[
                    styles.optionCard,
                    formData.workStyle === style.value && styles.selectedOption,
                  ]}
                  onPress={() => updateField("workStyle", style.value)}
                >
                  <MaterialCommunityIcons
                    name={style.icon}
                    size={24}
                    color={
                      formData.workStyle === style.value
                        ? theme.colors.primary
                        : theme.colors.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.optionText,
                      formData.workStyle === style.value && styles.selectedText,
                    ]}
                  >
                    {style.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.row}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>צעדים יומיים</Text>
                <TextInput
                  style={styles.input}
                  value={formData.dailySteps?.toString() || ""}
                  onChangeText={(text) =>
                    updateField("dailySteps", parseInt(text) || undefined)
                  }
                  keyboardType="numeric"
                  placeholder="8000"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>שעות שינה</Text>
                <TextInput
                  style={styles.input}
                  value={formData.sleepHours?.toString() || ""}
                  onChangeText={(text) =>
                    updateField("sleepHours", parseFloat(text) || undefined)
                  }
                  keyboardType="numeric"
                  placeholder="7"
                />
              </View>
            </View>

            <Text style={styles.label}>רמת לחץ</Text>
            <View style={styles.stressLevels}>
              {STRESS_LEVELS.map((level) => (
                <TouchableOpacity
                  key={level.value}
                  style={[
                    styles.stressOption,
                    formData.stressLevel === level.value && {
                      backgroundColor: level.color + "20",
                      borderColor: level.color,
                    },
                  ]}
                  onPress={() => updateField("stressLevel", level.value)}
                >
                  <Text
                    style={[
                      styles.stressText,
                      formData.stressLevel === level.value && {
                        color: level.color,
                      },
                    ]}
                  >
                    {level.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Training Preferences Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>העדפות אימון</Text>

            <Text style={styles.label}>זמן אימון מועדף</Text>
            <View style={styles.optionsGrid}>
              {TRAINING_TIMES.map((time) => (
                <TouchableOpacity
                  key={time.value}
                  style={[
                    styles.optionCard,
                    formData.preferredTrainingTime === time.value &&
                      styles.selectedOption,
                  ]}
                  onPress={() =>
                    updateField("preferredTrainingTime", time.value)
                  }
                >
                  <MaterialCommunityIcons
                    name={time.icon}
                    size={24}
                    color={
                      formData.preferredTrainingTime === time.value
                        ? theme.colors.primary
                        : theme.colors.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.optionText,
                      formData.preferredTrainingTime === time.value &&
                        styles.selectedText,
                    ]}
                  >
                    {time.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.row}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>חימום (דקות)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.warmupDuration?.toString() || ""}
                  onChangeText={(text) =>
                    updateField("warmupDuration", parseInt(text) || undefined)
                  }
                  keyboardType="numeric"
                  placeholder="10"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>מנוחה בין סטים (שניות)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.restBetweenSets?.toString() || ""}
                  onChangeText={(text) =>
                    updateField("restBetweenSets", parseInt(text) || undefined)
                  }
                  keyboardType="numeric"
                  placeholder="90"
                />
              </View>
            </View>
          </View>

          {/* Goals Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>יעדים</Text>

            <View style={styles.row}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>משקל יעד (ק"ג)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.targetWeight?.toString() || ""}
                  onChangeText={(text) =>
                    updateField("targetWeight", parseFloat(text) || undefined)
                  }
                  keyboardType="numeric"
                  placeholder="75"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>אחוז שומן יעד</Text>
                <TextInput
                  style={styles.input}
                  value={formData.targetBodyFat?.toString() || ""}
                  onChangeText={(text) =>
                    updateField("targetBodyFat", parseFloat(text) || undefined)
                  }
                  keyboardType="numeric"
                  placeholder="12"
                />
              </View>
            </View>
          </View>

          {/* Save Button */}
          <View style={styles.buttonContainer}>
            <AppButton
              title="שמור מידע אישי"
              onPress={handleSave}
              variant="primary"
              size="large"
              icon="content-save"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.text,
    marginRight: theme.spacing.md,
    flex: 1,
    textAlign: "right",
  },
  section: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: "right",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    textAlign: "right",
  },
  row: {
    flexDirection: "row-reverse",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  inputGroup: {
    flex: 1,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
    textAlign: "right",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  optionsGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  optionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    alignItems: "center",
    minWidth: 80,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedOption: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + "10",
  },
  optionText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: "center",
  },
  selectedText: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  stressLevels: {
    flexDirection: "row-reverse",
    gap: theme.spacing.sm,
  },
  stressOption: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: "center",
  },
  stressText: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.text,
  },
  buttonContainer: {
    padding: theme.spacing.xl,
  },
});
