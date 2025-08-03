/**
 * @file MuscleMapInteractive.tsx
 * @description קומפוננטה אינטראקטיבית להצגת מפת גוף תלת־מימדית עם בחירת שרירים, הנפinterface Props {
  onMuscleSelect?: (muscle: MuscleGroup) => void;
  selectedMuscleId?: string;
}

// מצב עריכה - שמירת קואורדינטות מעודכנות
interface EditableHotspot {
  muscleId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  side?: "left" | "right";
}

const MuscleMapInteractive: React.FC<Props> = ({
  onMuscleSelect,
  selectedMuscleId,
}) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableHotspots, setEditableHotspots] = useState<EditableHotspot[]>(
    MUSCLE_HOTSPOTS.map(hotspot => ({ ...hotspot }))
  ); */
import React, { useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Switch,
  Alert,
} from "react-native";
import {
  PanGestureHandler,
  GestureHandlerRootView,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
} from "react-native-reanimated";
import { MUSCLE_GROUPS, MuscleGroup } from "../../utils/muscleGroupsMap";

const { width: screenWidth } = Dimensions.get("window");

// מיפוי hotspots על התמונה התלת־מימדית (קואורדינטות מדויקות + גדלים פרופורציונליים לגודל השריר)
const MUSCLE_HOTSPOTS = [
  // === ידיים (Arms) ===
  // יד קדמית (בייספס) - שריר בינוני - מספר 1,2
  { muscleId: "biceps", x: 85, y: 180, width: 30, height: 40, side: "left" },
  { muscleId: "biceps", x: 235, y: 180, width: 30, height: 40, side: "right" },

  // יד אחורית (טרייספס) - שריר בינוני - מספר 17,18
  { muscleId: "triceps", x: 60, y: 195, width: 26, height: 35, side: "left" },
  { muscleId: "triceps", x: 264, y: 195, width: 26, height: 35, side: "right" },

  // אמות - שריר קטן - מספר 5,6
  { muscleId: "forearms", x: 88, y: 240, width: 18, height: 25, side: "left" },
  {
    muscleId: "forearms",
    x: 244,
    y: 240,
    width: 18,
    height: 25,
    side: "right",
  },

  // === חזה (Chest) - שריר גדול ===
  // חזה עליון - חלק עליון של החזה - מספר 19
  { muscleId: "chest_upper", x: 138, y: 142, width: 74, height: 28 },

  // חזה אמצעי - מרכז החזה (הגדול ביותר) - מספר 20
  { muscleId: "chest_middle", x: 132, y: 170, width: 86, height: 28 },

  // חזה תחתון - תחתית החזה - מספר 21
  { muscleId: "chest_lower", x: 142, y: 198, width: 66, height: 24 },

  // === כתפיים (Shoulders) - שרירים קטנים-בינוניים ===
  // כתף קדמית - דלטואיד קדמי - מספר 10,12
  {
    muscleId: "shoulder_front",
    x: 108,
    y: 120,
    width: 24,
    height: 20,
    side: "left",
  },
  {
    muscleId: "shoulder_front",
    x: 218,
    y: 120,
    width: 24,
    height: 20,
    side: "right",
  },

  // כתף אמצעית - דלטואיד צידי - מספר 11,13
  {
    muscleId: "shoulder_side",
    x: 88,
    y: 130,
    width: 24,
    height: 24,
    side: "left",
  },
  {
    muscleId: "shoulder_side",
    x: 238,
    y: 130,
    width: 24,
    height: 24,
    side: "right",
  },

  // כתף אחורית - דלטואיד אחורי (קטן יותר)
  {
    muscleId: "shoulder_rear",
    x: 68,
    y: 140,
    width: 20,
    height: 20,
    side: "left",
  },
  {
    muscleId: "shoulder_rear",
    x: 262,
    y: 140,
    width: 20,
    height: 20,
    side: "right",
  },

  // טרפז - שריר בינוני - מספר 16
  { muscleId: "trapezius", x: 148, y: 88, width: 44, height: 32 },

  // === גב (Back) - שרירים גדולים ===
  // רחב גבי - שריר גדול - מספר 7,14
  { muscleId: "lats", x: 102, y: 165, width: 28, height: 58, side: "left" },
  { muscleId: "lats", x: 220, y: 165, width: 28, height: 58, side: "right" },

  // גב עליון - שריר גדול - מספר 8
  { muscleId: "upper_back", x: 138, y: 125, width: 74, height: 38 },

  // גב תחתון - שריר בינוני - מספר 9
  { muscleId: "lower_back", x: 148, y: 230, width: 54, height: 32 },

  // === בטן (Core) - שרירים בינוניים ===
  // בטן עליונה - מספר 23
  { muscleId: "abs_upper", x: 148, y: 245, width: 44, height: 32 },

  // בטן תחתונה - מספר 24
  { muscleId: "abs_lower", x: 152, y: 277, width: 36, height: 28 },

  // אלכסונים - שרירים קטנים - מספר 29,22
  { muscleId: "obliques", x: 118, y: 265, width: 20, height: 32, side: "left" },
  {
    muscleId: "obliques",
    x: 212,
    y: 265,
    width: 20,
    height: 32,
    side: "right",
  },

  // === רגליים (Legs) - שרירים גדולים ===
  // ירך קדמית (Quads) - שריר גדול מאוד - מספר 27,28
  { muscleId: "quads", x: 108, y: 310, width: 38, height: 75, side: "left" },
  { muscleId: "quads", x: 204, y: 310, width: 38, height: 75, side: "right" },

  // ירך אחורית (Hamstrings) - שריר גדול
  {
    muscleId: "hamstrings",
    x: 103,
    y: 330,
    width: 33,
    height: 65,
    side: "left",
  },
  {
    muscleId: "hamstrings",
    x: 214,
    y: 330,
    width: 33,
    height: 65,
    side: "right",
  },

  // ישבן (Glutes) - שריר גדול
  { muscleId: "glutes", x: 123, y: 280, width: 58, height: 38 },

  // תאומים (Calves) - שרירים קטנים-בינוניים - מספר 30,31
  { muscleId: "calves", x: 113, y: 425, width: 26, height: 42, side: "left" },
  { muscleId: "calves", x: 211, y: 425, width: 26, height: 42, side: "right" },
];

// מצב עריכה - שמירת קואורדינטות מעודכנות
interface EditableHotspot {
  muscleId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  side?: "left" | "right";
}

interface Props {
  onMuscleSelect?: (muscle: MuscleGroup) => void;
  selectedMuscleId?: string;
}

const MuscleMapInteractive: React.FC<Props> = ({
  onMuscleSelect,
  selectedMuscleId,
}) => {
  const [selected, setSelected] = useState<string | null>(
    selectedMuscleId || null
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableHotspots, setEditableHotspots] = useState<EditableHotspot[]>(
    MUSCLE_HOTSPOTS.map((hotspot) => ({
      muscleId: hotspot.muscleId,
      x: hotspot.x,
      y: hotspot.y,
      width: hotspot.width,
      height: hotspot.height,
      side: hotspot.side as "left" | "right" | undefined,
    }))
  );

  // מיפוי muscleId לנתוני השריר
  const muscleIdToMuscle = useMemo(
    () => Object.fromEntries(MUSCLE_GROUPS.map((m) => [m.id, m])),
    []
  );

  const handlePress = (muscleId: string) => {
    const muscle = muscleIdToMuscle[muscleId];
    if (muscle) {
      setSelected(muscle.id);
      onMuscleSelect?.(muscle);
    }
  };

  // חישוב גודל מותאם למסך - גדול יותר לעמודה אחת
  const imageDimensions = useMemo(() => {
    const maxWidth = Math.min(screenWidth * 0.85, 450); // 85% מהמסך או מקסימום 450
    return {
      width: maxWidth,
      height: maxWidth * 1.6, // יחס מותאם לתמונה
    };
  }, []);

  // פונקציה לעדכון מיקום hotspot
  const updateHotspotPosition = (index: number, newX: number, newY: number) => {
    setEditableHotspots((prev) => {
      const updated = [...prev];
      const scaleX = 300 / imageDimensions.width; // המרה חזרה לקואורדינטות מקוריות
      const scaleY = 600 / imageDimensions.height;

      updated[index] = {
        ...updated[index],
        x: Math.round(newX * scaleX),
        y: Math.round(newY * scaleY),
      };
      return updated;
    });
  };

  // פונקציה לייצוא הקואורדינטות החדשות
  const exportCoordinates = () => {
    const coordinatesString = editableHotspots
      .map(
        (hotspot, index) =>
          `  // ${hotspot.muscleId} - מספר ${index + 1}\n  { muscleId: "${hotspot.muscleId}", x: ${hotspot.x}, y: ${hotspot.y}, width: ${hotspot.width}, height: ${hotspot.height}${hotspot.side ? `, side: "${hotspot.side}"` : ""} },`
      )
      .join("\n");

    console.log("New Coordinates:\n", coordinatesString);
    Alert.alert(
      "קואורדינטות חדשות",
      "הקואורדינטות החדשות נשמרו ב-console. פתח את הכלי פיתוח כדי לראות.",
      [{ text: "אישור" }]
    );
  };

  // קומפוננטת Hotspot ניתנת לגרירה
  const DraggableHotspot: React.FC<{
    hotspot: EditableHotspot;
    index: number;
    scaleX: number;
    scaleY: number;
    isSelected: boolean;
  }> = ({ hotspot, index, scaleX, scaleY, isSelected }) => {
    const translateX = useSharedValue(hotspot.x * scaleX);
    const translateY = useSharedValue(hotspot.y * scaleY);

    const gestureHandler =
      useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
        onStart: () => {
          // כאשר מתחילים לגרור
        },
        onActive: (event) => {
          if (isEditMode) {
            translateX.value = hotspot.x * scaleX + event.translationX;
            translateY.value = hotspot.y * scaleY + event.translationY;
          }
        },
        onEnd: (event) => {
          if (isEditMode) {
            const newX = hotspot.x * scaleX + event.translationX;
            const newY = hotspot.y * scaleY + event.translationY;
            runOnJS(updateHotspotPosition)(index, newX, newY);
          }
        },
      });

    const animatedStyle = useAnimatedStyle(() => {
      return {
        left: isEditMode ? translateX.value : hotspot.x * scaleX,
        top: isEditMode ? translateY.value : hotspot.y * scaleY,
      };
    });

    if (isEditMode) {
      return (
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View
            style={[
              styles.hotspot,
              {
                width: hotspot.width * scaleX,
                height: hotspot.height * scaleY,
              },
              animatedStyle,
              isSelected && styles.hotspotSelected,
            ]}
          >
            <Text
              style={[
                styles.hotspotNumber,
                { color: "red", fontWeight: "bold" },
              ]}
            >
              {index + 1}
            </Text>
            <Text style={styles.coordinatesText}>
              {hotspot.x},{hotspot.y}
            </Text>
            {isSelected && <View style={styles.marker} />}
          </Animated.View>
        </PanGestureHandler>
      );
    }

    // מצב רגיל - לא ניתן לגרירה
    return (
      <TouchableOpacity
        style={[
          styles.hotspot,
          {
            left: hotspot.x * scaleX,
            top: hotspot.y * scaleY,
            width: hotspot.width * scaleX,
            height: hotspot.height * scaleY,
          },
          isSelected && styles.hotspotSelected,
        ]}
        onPress={() => handlePress(hotspot.muscleId)}
        onLongPress={() => {
          console.log(
            `Hotspot ${index + 1} (${hotspot.muscleId}): x=${hotspot.x}, y=${hotspot.y}, w=${hotspot.width}, h=${hotspot.height}`
          );
          Alert.alert(
            "פרטי הנקודה",
            `מספר ${index + 1}: ${hotspot.muscleId}\nX: ${hotspot.x}, Y: ${hotspot.y}\nW: ${hotspot.width}, H: ${hotspot.height}`
          );
        }}
        activeOpacity={0.7}
      >
        <Text style={styles.hotspotNumber}>{index + 1}</Text>
        <Text style={styles.coordinatesText}>
          {hotspot.x},{hotspot.y}
        </Text>
        {isSelected && <View style={styles.marker} />}
      </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>בחר שריר</Text>

        <View style={styles.editControls}>
          <Text style={styles.editLabel}>מצב עריכה:</Text>
          <Switch
            value={isEditMode}
            onValueChange={setIsEditMode}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isEditMode ? "#f5dd4b" : "#f4f3f4"}
          />
          {isEditMode && (
            <TouchableOpacity
              style={styles.exportButton}
              onPress={exportCoordinates}
            >
              <Text style={styles.exportButtonText}>ייצא קואורדינטות</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={[styles.bodyContainer, imageDimensions]}>
        {/* תמונת הגוף התלת־מימדית */}
        <Image
          source={require("../../../assets/exercises/body_new.png")}
          style={[styles.bodyImage, imageDimensions]}
          resizeMode="contain"
        />

        {/* רשת קואורדינטות לעזרה בפיתוח - יוסר בגרסת ייצור */}
        {__DEV__ && (
          <View style={[styles.gridOverlay, imageDimensions]}>
            {/* קווים אנכיים כל 50 פיקסלים */}
            {Array.from({ length: 7 }, (_, i) => (
              <View
                key={`vertical-${i}`}
                style={[
                  styles.gridLine,
                  {
                    left: i * 50 * (imageDimensions.width / 300),
                    width: 1,
                    height: imageDimensions.height,
                  },
                ]}
              />
            ))}
            {/* קווים אופקיים כל 50 פיקסלים */}
            {Array.from({ length: 13 }, (_, i) => (
              <View
                key={`horizontal-${i}`}
                style={[
                  styles.gridLine,
                  {
                    top: i * 50 * (imageDimensions.height / 600),
                    height: 1,
                    width: imageDimensions.width,
                  },
                ]}
              />
            ))}
            {/* מספור הרשת */}
            {Array.from({ length: 7 }, (_, x) =>
              Array.from({ length: 13 }, (_, y) => (
                <Text
                  key={`grid-${x}-${y}`}
                  style={[
                    styles.gridLabel,
                    {
                      left: x * 50 * (imageDimensions.width / 300),
                      top: y * 50 * (imageDimensions.height / 600),
                    },
                  ]}
                >
                  {x * 50},{y * 50}
                </Text>
              ))
            )}
          </View>
        )}

        {/* Hotspots אינטראקטיביים */}
        {MUSCLE_HOTSPOTS.map((hotspot, index) => {
          const isSelected = selected === hotspot.muscleId;
          const scaleX = imageDimensions.width / 300; // יחס סקייל לגודל המקורי
          const scaleY = imageDimensions.height / 600;

          return (
            <TouchableOpacity
              key={`${hotspot.muscleId}-${hotspot.side || "center"}-${index}`}
              style={[
                styles.hotspot,
                {
                  left: hotspot.x * scaleX,
                  top: hotspot.y * scaleY,
                  width: hotspot.width * scaleX,
                  height: hotspot.height * scaleY,
                },
                isSelected && styles.hotspotSelected,
              ]}
              onPress={() => handlePress(hotspot.muscleId)}
              onLongPress={() => {
                // הצגת קואורדינטות למפתח - כלי עזר לדיוק
                console.log(
                  `Hotspot ${index + 1} (${hotspot.muscleId}): x=${hotspot.x}, y=${hotspot.y}, w=${hotspot.width}, h=${hotspot.height}`
                );
                alert(
                  `מספר ${index + 1}: ${hotspot.muscleId}\nX: ${hotspot.x}, Y: ${hotspot.y}\nW: ${hotspot.width}, H: ${hotspot.height}`
                );
              }}
              activeOpacity={0.7}
            >
              {/* מספור זמני לבדיקה + קואורדינטות */}
              <Text style={styles.hotspotNumber}>{index + 1}</Text>
              {/* הצגת קואורדינטות למטה מהמספר - כלי פיתוח */}
              <Text style={styles.coordinatesText}>
                {hotspot.x},{hotspot.y}
              </Text>
              {isSelected && <View style={styles.marker} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* תווית השריר הנבחר */}
      {selected && (
        <View style={styles.selectedContainer}>
          <Text style={styles.selectedLabel}>
            {muscleIdToMuscle[selected]?.nameHe}
          </Text>
          <Text style={styles.selectedLabelEn}>
            {muscleIdToMuscle[selected]?.nameEn}
          </Text>
        </View>
      )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 20,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  bodyContainer: {
    position: "relative",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  bodyImage: {
    borderRadius: 12,
  },
  hotspot: {
    position: "absolute",
    backgroundColor: "transparent", // ללא רקע - רק מספרים
    borderRadius: 8,
    borderWidth: 0, // ללא מסגרת
    borderColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  hotspotSelected: {
    backgroundColor: "rgba(0, 188, 212, 0.3)", // כחול בהיר קל כשנבחר
    borderColor: "#00bcd4",
    borderWidth: 2,
    borderRadius: 8,
  },
  hotspotNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333", // כהה כדי שיבלוט על הגוף
    textAlign: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)", // רקע לבן קל למספר
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 24,
    minHeight: 24,
    lineHeight: 20,
  },
  coordinatesText: {
    fontSize: 8,
    fontWeight: "normal",
    color: "#666666",
    textAlign: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 4,
    paddingHorizontal: 2,
    paddingVertical: 1,
    marginTop: 2,
  },
  gridOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    pointerEvents: "none",
  },
  gridLine: {
    position: "absolute",
    backgroundColor: "rgba(255, 0, 0, 0.3)",
  },
  gridLabel: {
    position: "absolute",
    fontSize: 8,
    color: "red",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 1,
    borderRadius: 2,
  },
  marker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ff4444",
    borderWidth: 1,
    borderColor: "#ffffff",
  },
  selectedContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#e8f5e8",
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#00bcd4",
    minWidth: 200,
  },
  selectedLabel: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00838f",
    textAlign: "center",
  },
  selectedLabelEn: {
    fontSize: 16,
    color: "#00695c",
    marginTop: 4,
    fontStyle: "italic",
  },
});

export default MuscleMapInteractive;
