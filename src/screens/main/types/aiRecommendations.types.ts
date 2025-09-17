/**
 * @file aiRecommendations.types.ts
 * @description טיפוסים עבור מערכת ההמלצות החכמות והתמיכה ב-wearables
 */

// טיפוסי המלצות AI
export interface AIRecommendation {
  id: string;
  type: "rest_recovery" | "intensity" | "balance" | "nutrition" | "sleep";
  title: string;
  description: string;
  action: string;
  priority: "low" | "medium" | "high";
  icon: string;
  color: string;
  timestamp: string;
}

// טיפוסי נתוני wearables
export interface WearableData {
  heartRate?: {
    current: number;
    resting: number;
    max: number;
    timestamp: string;
  };
  steps?: {
    count: number;
    goal: number;
    distance: number; // km
    timestamp: string;
  };
  calories?: {
    burned: number;
    goal: number;
    active: number;
    resting: number;
    timestamp: string;
  };
  sleep?: {
    duration: number; // hours
    quality: "poor" | "fair" | "good" | "excellent";
    deepSleep: number; // hours
    remSleep: number; // hours
    timestamp: string;
  };
  activity?: {
    activeMinutes: number;
    goal: number;
    zones: {
      fat_burn: number;
      cardio: number;
      peak: number;
    };
    timestamp: string;
  };
}

// טיפוס להגדרות חיבור
export interface WearableConnectionStatus {
  isConnected: boolean;
  deviceName?: string;
  deviceType:
    | "apple_health"
    | "google_fit"
    | "fitbit"
    | "garmin"
    | "samsung_health"
    | "unknown";
  lastSync?: string;
  permissions: {
    heartRate: boolean;
    steps: boolean;
    calories: boolean;
    sleep: boolean;
    workouts: boolean;
  };
}

// טיפוס לניתוח דפוסי אימון
export interface WorkoutPattern {
  frequencyPerWeek: number;
  averageDuration: number;
  preferredTimes: string[];
  muscleGroupFrequency: Record<string, number>;
  difficultyTrend: "increasing" | "decreasing" | "stable";
  consistencyScore: number; // 0-100
}
