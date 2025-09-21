/**
 * @file src/screens/developer/RTLTestScreen.tsx
 * @description מסך בדיקה להתאמות RTL החדשות
 */

import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ExampleTitle,
  ExampleButton,
  ExampleWorkoutCard,
} from "../../components/examples/RTLExamples";

const RTLTestScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* כותרת המסך */}
        <ExampleTitle title="בדיקת RTL והתאמות" emoji="🧪" level="h1" />

        {/* תיאור */}
        <Text style={styles.description}>
          מסך זה מדגים את השימוש הנכון במדריך העברית והאימוג'ים שיצרנו
        </Text>

        {/* דוגמת כפתורים */}
        <View style={styles.section}>
          <ExampleTitle title="דוגמאות כפתורים" emoji="🔘" level="h2" />

          <ExampleButton
            title="התחל אימון"
            action="start"
            onPress={() => alert("התחל אימון!")}
            variant="primary"
          />

          <ExampleButton
            title="הוסף תרגיל"
            action="add"
            onPress={() => alert("הוסף תרגיל!")}
            variant="secondary"
          />

          <ExampleButton
            title="שמור התקדמות"
            action="save"
            onPress={() => alert("שמור!")}
            variant="primary"
          />
        </View>

        {/* דוגמת כרטיס */}
        <View style={styles.section}>
          <ExampleTitle title="דוגמת כרטיס אימון" emoji="🏋️" level="h2" />

          <ExampleWorkoutCard
            workout={{
              name: "אימון דוגמה",
              emoji: "💪",
              duration: 30,
              exercises: 6,
              calories: 250,
            }}
          />
        </View>

        {/* מסך מלא */}
        <View style={styles.section}>
          <ExampleTitle title="מסך מלא לדוגמה" emoji="📱" level="h2" />

          <Text style={styles.note}>
            רכיב ExampleScreen מדגים מסך מלא עם כל האלמנטים יחד
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 16,
  },
  description: {
    fontSize: 16,
    textAlign: "right",
    color: "#666",
    marginBottom: 24,
    lineHeight: 24,
  },
  section: {
    marginBottom: 32,
  },
  note: {
    fontSize: 14,
    textAlign: "right",
    color: "#888",
    fontStyle: "italic",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderStartWidth: 4,
    borderLeftColor: "#007AFF",
  },
});

export default RTLTestScreen;
