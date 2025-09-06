/**
 * @file src/screens/exercises/ExercisesScreen.tsx
 * @brief מסך תרגילים - סקירה כללית של קבוצות שרירים
 */

import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../styles/theme";
import type { RootStackParamList } from "../../navigation/types";
import BackButton from "../../components/common/BackButton";
import {
  EXERCISES_SCREEN_TEXTS,
  EXERCISES_MUSCLE_GROUPS,
  getMuscleGroupColor,
} from "../../constants/exercisesScreenTexts";

const { width: screenWidth } = Dimensions.get("window");

type ExercisesScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ExercisesScreen"
>;

const ExercisesScreen: React.FC = () => {
  const navigation = useNavigation<ExercisesScreenNavigationProp>();
  const route = useRoute();

  const { selectedMuscleGroup, filterTitle, returnScreen } =
    (route.params as RootStackParamList["ExercisesScreen"]) || {};

  // אם יש סינון, נעבור ישירות לרשימת התרגילים המסוננת
  useEffect(() => {
    if (selectedMuscleGroup) {
      navigation.navigate("ExerciseList", {
        fromScreen: returnScreen || "ExercisesScreen",
        mode: "view",
        selectedMuscleGroup: selectedMuscleGroup,
      });
    }
  }, [selectedMuscleGroup, navigation, returnScreen]);

  const handleMuscleGroupPress = (muscleGroupId: string) => {
    navigation.navigate("ExerciseList", {
      fromScreen: "ExercisesScreen",
      mode: "view",
      selectedMuscleGroup: muscleGroupId,
    });
  };

  const handleViewAllExercises = () => {
    navigation.navigate("ExerciseList", {
      fromScreen: "ExercisesScreen",
      mode: "view",
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <BackButton />

        {/* Header */}
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="dumbbell"
            size={80}
            color={theme.colors.primary}
          />
          <Text style={styles.title}>
            {filterTitle || EXERCISES_SCREEN_TEXTS.HEADERS.MAIN_TITLE}
          </Text>
          <Text style={styles.subtitle}>
            {selectedMuscleGroup
              ? `תרגילים מותאמים לקבוצת השרירים ${selectedMuscleGroup}`
              : EXERCISES_SCREEN_TEXTS.HEADERS.SUBTITLE}
          </Text>
        </View>

        {/* כפתור צפייה בכל התרגילים */}
        <View style={styles.quickAccessSection}>
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={handleViewAllExercises}
            activeOpacity={0.8}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="צפה בכל התרגילים"
          >
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.primary + "DD"]}
              style={styles.viewAllGradient}
            >
              <MaterialCommunityIcons
                name="view-list"
                size={24}
                color="#FFFFFF"
              />
              <Text style={styles.viewAllText}>צפה בכל התרגילים</Text>
              <MaterialCommunityIcons
                name="chevron-left"
                size={16}
                color="#FFFFFF"
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* קבוצות שרירים */}
        <View style={styles.muscleGroupsSection}>
          <Text style={styles.sectionTitle}>קבוצות שרירים</Text>
          <Text style={styles.sectionDescription}>
            בחר קבוצת שרירים לצפייה בתרגילים ספציפיים
          </Text>

          <View style={styles.muscleGrid}>
            {EXERCISES_MUSCLE_GROUPS.map((group) => {
              const color = getMuscleGroupColor(theme, group.id);
              return (
                <TouchableOpacity
                  key={group.id}
                  style={styles.muscleCard}
                  onPress={() => handleMuscleGroupPress(group.id)}
                  activeOpacity={0.8}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={`קבוצת שרירי ${group.name}`}
                  accessibilityHint={`לחץ כדי לצפות בתרגילים עבור ${group.name}`}
                >
                  <View
                    style={[
                      styles.muscleIconContainer,
                      { backgroundColor: color + "20" },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={group.icon}
                      size={32}
                      color={color}
                    />
                  </View>
                  <Text style={styles.muscleTitle}>{group.name}</Text>
                  <Text style={styles.muscleDescription}>
                    {group.description}
                  </Text>

                  <View style={styles.muscleArrow}>
                    <MaterialCommunityIcons
                      name="chevron-left"
                      size={16}
                      color={theme.colors.textSecondary}
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExercisesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: theme.spacing.sm,
    lineHeight: 24,
  },
  quickAccessSection: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  viewAllButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  viewAllGradient: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    flex: 1,
    textAlign: "center",
  },
  muscleGroupsSection: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: "right",
  },
  sectionDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    textAlign: "right",
    lineHeight: 20,
  },
  muscleGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  muscleCard: {
    width: (screenWidth - theme.spacing.lg * 2 - theme.spacing.sm) / 2,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: theme.spacing.md,
    alignItems: "center",
    position: "relative",
  },
  muscleIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.sm,
  },
  muscleTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.xs,
  },
  muscleDescription: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 16,
  },
  muscleArrow: {
    position: "absolute",
    top: theme.spacing.sm,
    left: theme.spacing.sm,
  },
});
