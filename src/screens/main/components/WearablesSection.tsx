/**
 * @file src/screens/main/components/WearablesSection.tsx
 * @description Wearables integration component extracted from MainScreen
 */

import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../../core/theme";
import { logger } from "../../../utils/logger";
import { WearableIntegration } from "../utils/wearableIntegration";
import type { WearableData } from "../types/aiRecommendations.types";

export const WearablesSection: React.FC = () => {
  const [wearableData, setWearableData] = useState<WearableData | null>(null);
  const [wearableConnected, setWearableConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);

  // Connect to wearables
  const connectToWearables = useCallback(async () => {
    try {
      setConnecting(true);
      const wearableIntegration = WearableIntegration.getInstance();
      const hasPermission = await wearableIntegration.requestPermissions();

      if (hasPermission) {
        setWearableConnected(true);
        const healthData = await wearableIntegration.getHealthData();
        setWearableData(healthData);
        logger.info("WearablesSection", "Wearables connection successful", {
          steps: healthData?.steps?.count || 0,
          heartRate: healthData?.heartRate?.current || 0,
        });
      } else {
        logger.warn("WearablesSection", "Wearables permissions not granted");
        setWearableConnected(false);
      }
    } catch (error) {
      logger.error("WearablesSection", "Error connecting to wearables", error);
      setWearableConnected(false);
    } finally {
      setConnecting(false);
    }
  }, []);

  // Auto-connect on mount
  React.useEffect(() => {
    connectToWearables();
  }, [connectToWearables]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          <MaterialCommunityIcons
            name="watch"
            size={20}
            color={theme.colors.primary}
          />{" "}
          מכשירים חכמים
        </Text>
        {wearableConnected && (
          <View style={styles.connectedBadge}>
            <Text style={styles.connectedText}>מחובר</Text>
          </View>
        )}
      </View>

      {wearableConnected && wearableData ? (
        <View style={styles.healthDataGrid}>
          <View style={styles.healthDataItem}>
            <MaterialCommunityIcons
              name="walk"
              size={24}
              color={theme.colors.primary}
            />
            <Text style={styles.healthDataValue}>
              {wearableData.steps?.count?.toLocaleString() || "0"}
            </Text>
            <Text style={styles.healthDataLabel}>צעדים היום</Text>
          </View>

          <View style={styles.healthDataItem}>
            <MaterialCommunityIcons
              name="heart-pulse"
              size={24}
              color={theme.colors.secondary}
            />
            <Text style={styles.healthDataValue}>
              {wearableData.heartRate?.current || "---"}
            </Text>
            <Text style={styles.healthDataLabel}>דופק נוכחי</Text>
          </View>

          <View style={styles.healthDataItem}>
            <MaterialCommunityIcons
              name="fire"
              size={24}
              color={theme.colors.accent}
            />
            <Text style={styles.healthDataValue}>
              {wearableData.calories?.burned || "0"}
            </Text>
            <Text style={styles.healthDataLabel}>קלוריות</Text>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.connectButton}
          onPress={connectToWearables}
          disabled={connecting}
        >
          <MaterialCommunityIcons
            name={connecting ? "loading" : "watch"}
            size={20}
            color={theme.colors.primary}
          />
          <Text style={styles.connectButtonText}>
            {connecting ? "מתחבר..." : "התחבר למכשירים חכמים"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  connectedBadge: {
    backgroundColor: theme.colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  connectedText: {
    fontSize: 12,
    color: "white",
    fontWeight: "500",
  },
  healthDataGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  healthDataItem: {
    flex: 1,
    alignItems: "center",
    padding: 12,
  },
  healthDataValue: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
    marginTop: 4,
  },
  healthDataLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: 2,
  },
  connectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  connectButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: "500",
  },
});
