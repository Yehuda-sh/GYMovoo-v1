/**
 * @file src/components/workout/VideoTutorials.tsx
 * @brief Video tutorial placeholders component for WorkoutPlansScreen
 */

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../core/theme";

interface VideoTutorial {
  id: string;
  title: string;
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
  thumbnail: string;
  description: string;
  views: number;
  rating: number;
}

interface VideoTutorialsProps {
  workoutCategory?: string;
  userLevel?: string;
}

const VideoTutorials: React.FC<VideoTutorialsProps> = ({
  workoutCategory: _workoutCategory = "כללי",
  userLevel: _userLevel = "beginner",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock video tutorials data - in a real app, this would come from an API
  const videoTutorials: VideoTutorial[] = [
    {
      id: "1",
      title: "אימון כלל הגוף למתחילים",
      duration: "15:30",
      difficulty: "beginner",
      category: "כלל הגוף",
      thumbnail:
        "https://via.placeholder.com/320x180/007AFF/FFFFFF?text=Full+Body",
      description:
        "אימון מקיף לכל הגוף, מושלם למתחילים ולמי שרוצה להתחיל בכושר",
      views: 12543,
      rating: 4.8,
    },
    {
      id: "2",
      title: "תרגילי בטן ליווי",
      duration: "10:45",
      difficulty: "intermediate",
      category: "בטן",
      thumbnail:
        "https://via.placeholder.com/320x180/FF9500/FFFFFF?text=Core+Workout",
      description: "חיזוק שרירי הליבה והבטן עם תרגילים מתקדמים",
      views: 8921,
      rating: 4.6,
    },
    {
      id: "3",
      title: "אימון כרדיו בבית",
      duration: "20:15",
      difficulty: "beginner",
      category: "כרדיו",
      thumbnail:
        "https://via.placeholder.com/320x180/FF3B30/FFFFFF?text=Cardio+Home",
      description: "אימון כרדיו אפקטיבי שניתן לבצע בבית ללא ציוד",
      views: 15632,
      rating: 4.9,
    },
    {
      id: "4",
      title: "פילאטיס למתחילים",
      duration: "25:00",
      difficulty: "beginner",
      category: "גמישות",
      thumbnail:
        "https://via.placeholder.com/320x180/34C759/FFFFFF?text=Pilates",
      description: "שיעור פילאטיס בסיסי לשיפור הגמישות והיציבה",
      views: 6789,
      rating: 4.7,
    },
    {
      id: "5",
      title: "אימון כוח עם דמבלים",
      duration: "18:20",
      difficulty: "intermediate",
      category: "כוח",
      thumbnail:
        "https://via.placeholder.com/320x180/AF52DE/FFFFFF?text=Strength",
      description: "בניית שריר וכוח עם תרגילי דמבלים מתקדמים",
      views: 11234,
      rating: 4.5,
    },
    {
      id: "6",
      title: "יוגה לאחר אימון",
      duration: "12:30",
      difficulty: "beginner",
      category: "יוגה",
      thumbnail: "https://via.placeholder.com/320x180/5856D6/FFFFFF?text=Yoga",
      description: "רגיעת השרירים והתארכות לאחר אימון אינטנסיבי",
      views: 9876,
      rating: 4.8,
    },
  ];

  const categories = [
    { key: "all", label: "הכל" },
    { key: "כלל הגוף", label: "כלל הגוף" },
    { key: "בטן", label: "בטן" },
    { key: "כרדיו", label: "כרדיו" },
    { key: "גמישות", label: "גמישות" },
    { key: "כוח", label: "כוח" },
    { key: "יוגה", label: "יוגה" },
  ];

  const filteredVideos = videoTutorials.filter(
    (video) => selectedCategory === "all" || video.category === selectedCategory
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return theme.colors.success;
      case "intermediate":
        return theme.colors.warning;
      case "advanced":
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "מתחיל";
      case "intermediate":
        return "בינוני";
      case "advanced":
        return "מתקדם";
      default:
        return "לא ידוע";
    }
  };

  const handleVideoPress = (video: VideoTutorial) => {
    Alert.alert(
      "סרטון הדרכה",
      `${video.title}\n\n${video.description}\n\nזוהי תכונה לדמו - בגרסה מלאה תוכלו לצפות בסרטונים מלאים.`,
      [
        { text: "סגור", style: "cancel" },
        { text: "הוסף למועדפים", onPress: () => Alert.alert("נוסף למועדפים!") },
      ]
    );
  };

  const renderVideo = (video: VideoTutorial) => (
    <TouchableOpacity
      key={video.id}
      style={styles.videoCard}
      onPress={() => handleVideoPress(video)}
    >
      <View style={styles.videoThumbnail}>
        <View style={styles.placeholderThumbnail}>
          <MaterialCommunityIcons
            name="play-circle-outline"
            size={40}
            color={theme.colors.white}
          />
        </View>
        <View style={styles.videoDuration}>
          <Text style={styles.videoDurationText}>{video.duration}</Text>
        </View>
      </View>

      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle}>{video.title}</Text>
        <Text style={styles.videoDescription} numberOfLines={2}>
          {video.description}
        </Text>

        <View style={styles.videoMeta}>
          <View style={styles.videoMetaRow}>
            <View
              style={[
                styles.difficultyBadge,
                {
                  backgroundColor: getDifficultyColor(video.difficulty) + "20",
                },
              ]}
            >
              <Text
                style={[
                  styles.difficultyText,
                  { color: getDifficultyColor(video.difficulty) },
                ]}
              >
                {getDifficultyLabel(video.difficulty)}
              </Text>
            </View>

            <View style={styles.ratingContainer}>
              <MaterialCommunityIcons
                name="star"
                size={14}
                color={theme.colors.warning}
              />
              <Text style={styles.ratingText}>{video.rating}</Text>
            </View>
          </View>

          <Text style={styles.videoViews}>
            {video.views.toLocaleString()} צפיות
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons
            name="video-outline"
            size={24}
            color={theme.colors.primary}
          />
          <Text style={styles.title}>סרטוני הדרכה</Text>
          <View style={styles.videosCount}>
            <Text style={styles.videosCountText}>{filteredVideos.length}</Text>
          </View>
        </View>
        <MaterialCommunityIcons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={theme.colors.textSecondary}
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.content}>
          {/* Category Filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.key}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.key &&
                    styles.categoryButtonSelected,
                ]}
                onPress={() => setSelectedCategory(category.key)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === category.key &&
                      styles.categoryButtonTextSelected,
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Videos List */}
          {filteredVideos.length > 0 ? (
            <ScrollView
              style={styles.videosList}
              showsVerticalScrollIndicator={false}
            >
              {filteredVideos.map(renderVideo)}
            </ScrollView>
          ) : (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="video-off-outline"
                size={48}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.emptyStateText}>אין סרטונים בקטגוריה זו</Text>
            </View>
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              💡 טיפ: בגרסה המלאה תוכלו לצפות בסרטונים מלאים ולהוריד לצפייה
              אופליין
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.sm,
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
  videosCount: {
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
  },
  videosCountText: {
    fontSize: 12,
    color: theme.colors.white,
    fontWeight: "600",
    textAlign: "center",
  },
  content: {
    padding: theme.spacing.md,
    paddingTop: 0,
  },
  categoriesContainer: {
    marginBottom: theme.spacing.md,
  },
  categoryButton: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 16,
    marginEnd: theme.spacing.xs,
    backgroundColor: theme.colors.background,
  },
  categoryButtonSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryButtonText: {
    fontSize: 12,
    color: theme.colors.text,
  },
  categoryButtonTextSelected: {
    color: theme.colors.white,
    fontWeight: "600",
  },
  videosList: {
    maxHeight: 400, // Limit height to prevent excessive scrolling
  },
  videoCard: {
    flexDirection: "row",
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    marginBottom: theme.spacing.sm,
    overflow: "hidden",
  },
  videoThumbnail: {
    width: 120,
    height: 80,
    position: "relative",
  },
  placeholderThumbnail: {
    flex: 1,
    backgroundColor: theme.colors.primary + "80",
    justifyContent: "center",
    alignItems: "center",
  },
  videoDuration: {
    position: "absolute",
    bottom: 4,
    end: 4,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  videoDurationText: {
    fontSize: 10,
    color: theme.colors.white,
    fontWeight: "500",
  },
  videoInfo: {
    flex: 1,
    padding: theme.spacing.sm,
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 4,
    textAlign: "right",
  },
  videoDescription: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    textAlign: "right",
    lineHeight: 16,
  },
  videoMeta: {
    gap: 4,
  },
  videoMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  difficultyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: "600",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    color: theme.colors.text,
    fontWeight: "500",
  },
  videoViews: {
    fontSize: 10,
    color: theme.colors.textTertiary,
    textAlign: "right",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: theme.spacing.xl,
  },
  emptyStateText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    textAlign: "center",
  },
  footer: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  footerText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: "center",
    fontStyle: "italic",
  },
});

export default VideoTutorials;
