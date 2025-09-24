/**
 * @file src/screens/main/components/AIRecommendationsSection.tsx
 * @description AI recommendations component extracted from MainScreen
 */

import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../core/theme";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import { logger } from "../../../utils/logger";
import { AIRecommendationEngine } from "../utils/aiRecommendationEngine";
import type { AIRecommendation } from "../types/aiRecommendations.types";
import type { WorkoutHistoryItem } from "../../../core/types/user.types";

interface AIRecommendationsSectionProps {
  historyItems: WorkoutHistoryItem[];
}

export const AIRecommendationsSection: React.FC<
  AIRecommendationsSectionProps
> = ({ historyItems }) => {
  const [aiRecommendations, setAiRecommendations] = useState<
    AIRecommendation[]
  >([]);
  const [aiLoading, setAiLoading] = useState(false);

  // Load AI recommendations
  const loadAIRecommendations = useCallback(
    async (workoutHistory: WorkoutHistoryItem[]) => {
      try {
        setAiLoading(true);
        const aiEngine = new AIRecommendationEngine();
        const recommendations =
          await aiEngine.generateRecommendations(workoutHistory);
        setAiRecommendations(recommendations);
        logger.info(
          "AIRecommendationsSection",
          `Loaded ${recommendations.length} AI recommendations`
        );
      } catch (error) {
        logger.error(
          "AIRecommendationsSection",
          "Error loading AI recommendations",
          error
        );
        setAiRecommendations([]);
      } finally {
        setAiLoading(false);
      }
    },
    []
  );

  // Load recommendations when component mounts or history changes
  React.useEffect(() => {
    if (historyItems.length > 0) {
      loadAIRecommendations(historyItems);
    }
  }, [historyItems, loadAIRecommendations]);

  if (aiLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner size="small" color={theme.colors.primary} />
        <Text style={styles.loadingText}>טוען המלצות AI...</Text>
      </View>
    );
  }

  if (aiRecommendations.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        <MaterialCommunityIcons
          name="brain"
          size={20}
          color={theme.colors.primary}
        />{" "}
        המלצות AI
      </Text>

      <View style={styles.recommendationsContainer}>
        {aiRecommendations.map((recommendation, index) => (
          <View key={index} style={styles.recommendationCard}>
            <View style={styles.recommendationHeader}>
              <Text style={styles.recommendationType}>
                {recommendation.type}
              </Text>
              <Text style={styles.confidenceScore}>
                {recommendation.priority}
              </Text>
            </View>
            <Text style={styles.recommendationText}>
              {recommendation.description}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 12,
    textAlign: "right",
  },
  recommendationsContainer: {
    gap: 12,
  },
  recommendationCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  recommendationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  recommendationType: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  confidenceScore: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  recommendationText: {
    fontSize: 14,
    color: theme.colors.text,
    textAlign: "right",
    lineHeight: 20,
  },
});
