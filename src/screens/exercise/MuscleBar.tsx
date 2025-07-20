// src/screens/exercise/MuscleBar.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Muscle } from "../../services/exerciseService";
import { theme } from "../../styles/theme";

// טיפוסי props
type MuscleBarProps = {
  muscles: Muscle[];
  selected: number | "all";
  onSelect: (id: number | "all") => void;
};

const MuscleBar: React.FC<MuscleBarProps> = ({
  muscles,
  selected,
  onSelect,
}) => {
  // הוספת "All" ככפתור ראשון
  const buttons = [{ id: "all", name: "All" } as any, ...muscles];

  return (
    <View style={styles.barContainer}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={buttons}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ alignItems: "center", paddingHorizontal: 6 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.muscleBtn,
              selected === item.id && styles.muscleBtnActive,
            ]}
            onPress={() => onSelect(item.id)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.muscleBtnText,
                selected === item.id && styles.muscleBtnTextActive,
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default MuscleBar;

// --- סטיילינג ---
const styles = StyleSheet.create({
  barContainer: {
    paddingVertical: 10,
    backgroundColor: theme.colors.background,
  },
  muscleBtn: {
    minWidth: 72,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#87b7ff",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
    paddingHorizontal: 16,
    backgroundColor: "transparent",
  },
  muscleBtnActive: {
    backgroundColor: "#0080ff",
    borderColor: "#4fc3ff",
  },
  muscleBtnText: {
    color: "#aaddff",
    fontWeight: "600",
    fontSize: 15,
  },
  muscleBtnTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
});
