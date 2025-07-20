import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { theme } from "../../styles/theme";
import { useUserStore } from "../../stores/userStore";

const QUESTIONS = [
  {
    id: 0,
    question: "בן כמה אתה?",
    options: ["מתחת ל-16", "16 ומעלה"], // אפשר גם טקסט חופשי/Picker
  },
  {
    id: 1,
    question: "מה מטרת האימון שלך?",
    options: ["חיטוב", "עליה במסת שריר", "שיפור כוח", "שיפור כושר כללי"],
  },
  {
    id: 2,
    question: "מה רמת הניסיון שלך?",
    options: ["מתחיל", "בינוני", "מתקדם"],
  },
  {
    id: 3,
    question: "כמה פעמים בשבוע תרצה להתאמן?",
    options: ["2", "3", "4", "5 ומעלה"],
  },
];

export default function QuestionnaireScreen({ navigation }: any) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [error, setError] = useState<string | null>(null);

  const setQuestionnaire = useUserStore((s) => s.setQuestionnaire);

  const handleOption = (option: string) => {
    setAnswers((prev) => ({ ...prev, [QUESTIONS[current].id]: option }));
    setError(null); // איפוס שגיאה כשמשנים תשובה
  };

  const handleNext = () => {
    if (current === 0 && answers[0] === "מתחת ל-16") {
      setError("ההרשמה מותרת רק מגיל 16 ומעלה");
      return;
    }
    if (current < QUESTIONS.length - 1) {
      setCurrent(current + 1);
    } else {
      setQuestionnaire(answers);
      navigation.reset({ index: 0, routes: [{ name: "Main" }] });
    }
  };

  const question = QUESTIONS[current];

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>{`${current + 1}/${
        QUESTIONS.length
      }`}</Text>
      <Text style={styles.title}>{question.question}</Text>
      <View style={styles.optionsWrapper}>
        {question.options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.option,
              answers[question.id] === option && styles.selectedOption,
            ]}
            onPress={() => handleOption(option)}
            activeOpacity={0.82}
          >
            <Text
              style={[
                styles.optionText,
                answers[question.id] === option && styles.selectedOptionText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* הצגת הודעת שגיאה אם קיימת */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity
        style={[styles.nextButton, !answers[question.id] && { opacity: 0.5 }]}
        onPress={handleNext}
        disabled={!answers[question.id]}
        activeOpacity={0.85}
      >
        <Text style={styles.nextButtonText}>
          {current < QUESTIONS.length - 1 ? "הבא" : "סיום"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.lg,
  },
  progress: {
    fontSize: 15,
    color: theme.colors.accent,
    alignSelf: "flex-end",
    marginBottom: 8,
    writingDirection: "rtl",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 12,
    writingDirection: "rtl",
  },
  optionsWrapper: {
    marginTop: 18,
    width: "100%",
  },
  option: {
    backgroundColor: theme.colors.card,
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: theme.borderRadius.md,
    marginBottom: 12,
    borderColor: theme.colors.divider,
    borderWidth: 1,
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: theme.colors.accent + "22",
    borderColor: theme.colors.accent,
  },
  optionText: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    writingDirection: "rtl",
  },
  selectedOptionText: {
    color: theme.colors.primary,
    fontWeight: "bold",
  },
  errorText: {
    color: "#ff4757",
    fontSize: 16,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 2,
    fontWeight: "600",
  },
  nextButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: theme.borderRadius.md,
    marginTop: 30,
    alignSelf: "center",
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  nextButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
  },
});
