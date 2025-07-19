/**
 * @file src/screens/questionnaire/QuestionnaireScreen.tsx
 * @description מסך שאלון - דמו בסיסי עם שאלה אחת, כפתור המשך, RTL מלא
 */

import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

// שאלות דמו — אפשר להרחיב בקלות
const QUESTIONS = [
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

  const handleOption = (option: string) => {
    setAnswers((prev) => ({ ...prev, [current]: option }));
  };

  const handleNext = () => {
    if (current < QUESTIONS.length - 1) {
      setCurrent(current + 1);
    } else {
      // פה תוכל לשמור תשובות ב-AsyncStorage / Zustand, ולהעביר למסך הבא
      navigation.navigate("Summary"); // תוכל להגדיר מסך סיכום בעתיד
    }
  };

  const question = QUESTIONS[current];

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>{`${current + 1}/${
        QUESTIONS.length
      }`}</Text>
      <Text style={styles.title}>{question.question}</Text>
      <View style={{ marginTop: 18, width: "100%" }}>
        {question.options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.option,
              answers[current] === option && styles.selectedOption,
            ]}
            onPress={() => handleOption(option)}
          >
            <Text
              style={[
                styles.optionText,
                answers[current] === option && styles.selectedOptionText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.nextButton, !answers[current] && { opacity: 0.5 }]}
        onPress={handleNext}
        disabled={!answers[current]}
      >
        <Text style={styles.nextButtonText}>
          {current < QUESTIONS.length - 1 ? "הבא" : "סיים"}
        </Text>
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
  progress: {
    fontSize: 15,
    color: "#5856D6",
    alignSelf: "flex-end",
    marginBottom: 8,
    writingDirection: "rtl",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#007AFF",
    textAlign: "center",
    marginBottom: 12,
    writingDirection: "rtl",
  },
  option: {
    backgroundColor: "#fff",
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 12,
    borderColor: "#ddd",
    borderWidth: 1,
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: "#007AFF22",
    borderColor: "#007AFF",
  },
  optionText: {
    fontSize: 18,
    color: "#333",
    writingDirection: "rtl",
  },
  selectedOptionText: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  nextButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 12,
    marginTop: 30,
    alignSelf: "center",
    shadowColor: "#007AFF",
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
