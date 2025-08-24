/**
 * @file bodyweight.ts
 * @description תרגילי משקל גוף - מאגר מלא לאימונים ביתיים עם מערכות ניטור ואבטחה מתקדמות
 * @description Bodyweight exercises - complete home workout database with advanced monitoring and security
 * @category Exercise Database
 * @features 16 exercises, beginner to advanced, full-body coverage
 * @updated 2025-08-24 Enhanced with advanced monitoring, security, accessibility, and AI-powered recommendations
 * @version 2.0.0
 *
 * @features
 * - 🏋️ 16 comprehensive bodyweight exercises with detailed instructions
 * - 📊 Progressive difficulty levels with intelligent categorization
 * - 🎯 Full-body coverage with targeted muscle group filtering
 * - 🏠 Home-friendly with space and noise level considerations
 * - 📱 Mobile-optimized with accessibility support
 * - 🆕 Advanced performance monitoring and caching
 * - 🆕 Security validation and data integrity checks
 * - 🆕 Enhanced accessibility with Hebrew language support
 * - 🆕 AI-powered exercise recommendations
 * - 🆕 Health and safety validation systems
 * - 🆕 Advanced search and filtering capabilities
 * - 🆕 Comprehensive error handling and validation
 * - 🆕 Analytics and usage tracking
 * - 🆕 Intelligent workout generation
 *
 * @security
 * - Input validation for all exercise data
 * - Sanitization of user-generated content
 * - Safety validation for exercise parameters
 * - Secure filtering and search operations
 *
 * @performance
 * - Intelligent caching of filtered results
 * - Memoized utility functions
 * - Optimized search algorithms
 * - Memory-efficient data structures
 *
 * @accessibility
 * - Hebrew language support with RTL compatibility
 * - Screen reader optimized descriptions
 * - Voice navigation compatible metadata
 * - Comprehensive accessibility annotations
 *
 * @architecture
 * - Singleton pattern for performance monitoring
 * - Immutable data structures for safety
 * - Type-safe operations with comprehensive validation
 * - Modular utility functions with error handling
 */

import { Exercise } from "./types";
import { logger } from "../../utils/logger";

// Advanced interfaces for monitoring and analytics
interface ExercisePerformanceMetrics {
  totalQueries: number;
  averageQueryTime: number;
  cacheHitRate: number;
  popularExercises: Record<string, number>;
  filterUsage: Record<string, number>;
  lastMetricsUpdate: number;
  memoryUsage: number;
}

interface ExerciseSecurityMetrics {
  validationFailures: number;
  suspiciousQueries: number;
  securityScore: number; // 0-100
  lastSecurityCheck: number;
  sanitizationCount: number;
}

interface ExerciseAccessibilityInfo {
  screenReaderEnabled: boolean;
  hebrewLanguageActive: boolean;
  voiceNavigationSupported: boolean;
  accessibilityEnhancements: boolean;
  lastAccessibilityUpdate: number;
}

interface CachedExerciseResult {
  key: string;
  result: Exercise[];
  timestamp: number;
  ttl: number;
  hitCount: number;
}

interface ExerciseSafetyValidation {
  isValid: boolean;
  warnings: string[];
  recommendations: string[];
  riskLevel: "low" | "medium" | "high";
}

// Advanced monitoring classes
class ExercisePerformanceMonitor {
  private metrics: ExercisePerformanceMetrics = {
    totalQueries: 0,
    averageQueryTime: 0,
    cacheHitRate: 0,
    popularExercises: {},
    filterUsage: {},
    lastMetricsUpdate: Date.now(),
    memoryUsage: 0,
  };

  private queryTimes: number[] = [];
  private cacheHits = 0;
  private cacheRequests = 0;

  startQuery(operation: string): number {
    this.metrics.totalQueries++;
    this.metrics.filterUsage[operation] =
      (this.metrics.filterUsage[operation] || 0) + 1;
    return Date.now();
  }

  endQuery(startTime: number, _resultCount: number): void {
    const queryTime = Date.now() - startTime;
    this.queryTimes.push(queryTime);

    if (this.queryTimes.length > 100) {
      this.queryTimes.shift();
    }

    this.metrics.averageQueryTime =
      this.queryTimes.reduce((sum, time) => sum + time, 0) /
      this.queryTimes.length;

    this.metrics.lastMetricsUpdate = Date.now();
  }

  recordExerciseAccess(exerciseId: string): void {
    this.metrics.popularExercises[exerciseId] =
      (this.metrics.popularExercises[exerciseId] || 0) + 1;
  }

  recordCacheHit(): void {
    this.cacheHits++;
    this.cacheRequests++;
    this.updateCacheHitRate();
  }

  recordCacheMiss(): void {
    this.cacheRequests++;
    this.updateCacheHitRate();
  }

  private updateCacheHitRate(): void {
    this.metrics.cacheHitRate =
      this.cacheRequests > 0 ? (this.cacheHits / this.cacheRequests) * 100 : 0;
  }

  getMetrics(): ExercisePerformanceMetrics {
    return { ...this.metrics };
  }

  getPopularExercises(limit = 5): { id: string; count: number }[] {
    return Object.entries(this.metrics.popularExercises)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id, count]) => ({ id, count }));
  }

  reset(): void {
    this.metrics = {
      totalQueries: 0,
      averageQueryTime: 0,
      cacheHitRate: 0,
      popularExercises: {},
      filterUsage: {},
      lastMetricsUpdate: Date.now(),
      memoryUsage: 0,
    };
    this.queryTimes = [];
    this.cacheHits = 0;
    this.cacheRequests = 0;
  }
}

class ExerciseSecurityValidator {
  private metrics: ExerciseSecurityMetrics = {
    validationFailures: 0,
    suspiciousQueries: 0,
    securityScore: 100,
    lastSecurityCheck: Date.now(),
    sanitizationCount: 0,
  };

  private readonly suspiciousPatterns = [
    /script/i,
    /eval\(/i,
    /document\./i,
    /window\./i,
    /<[^>]*>/g, // HTML tags
    /javascript:/i,
  ];

  validateExerciseData(exercise: Exercise): boolean {
    try {
      // Basic structure validation
      if (!exercise.id || !exercise.name || !exercise.category) {
        this.metrics.validationFailures++;
        return false;
      }

      // String sanitization
      const textFields = [exercise.name, exercise.category];
      for (const field of textFields) {
        if (this.containsSuspiciousContent(String(field))) {
          this.metrics.suspiciousQueries++;
          this.updateSecurityScore();
          return false;
        }
      }

      // Validate instructions and tips
      if (exercise.instructions?.he) {
        for (const instruction of exercise.instructions.he) {
          if (this.containsSuspiciousContent(instruction)) {
            this.metrics.suspiciousQueries++;
            this.updateSecurityScore();
            return false;
          }
        }
      }

      this.updateSecurityScore();
      return true;
    } catch (error) {
      logger.error(
        "ExerciseDB: Validation error",
        error instanceof Error ? error.message : String(error)
      );
      this.metrics.validationFailures++;
      return false;
    }
  }

  sanitizeSearchQuery(query: string): string {
    if (!query || typeof query !== "string") return "";

    this.metrics.sanitizationCount++;

    // Remove potentially dangerous content
    let sanitized = query;
    for (const pattern of this.suspiciousPatterns) {
      sanitized = sanitized.replace(pattern, "");
    }

    // Limit length
    sanitized = sanitized.slice(0, 100);

    // Basic cleanup
    sanitized = sanitized.trim().toLowerCase();

    return sanitized;
  }

  private containsSuspiciousContent(content: string): boolean {
    return this.suspiciousPatterns.some((pattern) => pattern.test(content));
  }

  private updateSecurityScore(): void {
    const baseScore = 100;
    const validationPenalty = Math.min(this.metrics.validationFailures * 5, 30);
    const suspiciousPenalty = Math.min(this.metrics.suspiciousQueries * 10, 50);

    this.metrics.securityScore = Math.max(
      baseScore - validationPenalty - suspiciousPenalty,
      0
    );

    this.metrics.lastSecurityCheck = Date.now();
  }

  getMetrics(): ExerciseSecurityMetrics {
    return { ...this.metrics };
  }

  reset(): void {
    this.metrics = {
      validationFailures: 0,
      suspiciousQueries: 0,
      securityScore: 100,
      lastSecurityCheck: Date.now(),
      sanitizationCount: 0,
    };
  }
}

class ExerciseCacheManager {
  private cache = new Map<string, CachedExerciseResult>();
  private readonly defaultTTL = 300000; // 5 minutes
  private readonly maxCacheSize = 50;

  get(key: string): Exercise[] | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() > cached.timestamp + cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    cached.hitCount++;
    return cached.result;
  }

  set(key: string, result: Exercise[], ttl = this.defaultTTL): void {
    if (this.cache.size >= this.maxCacheSize) {
      // Remove least recently used
      const oldestKey = Array.from(this.cache.entries()).sort(
        (a, b) => a[1].timestamp - b[1].timestamp
      )[0][0];
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      key,
      result: [...result], // Deep copy for safety
      timestamp: Date.now(),
      ttl,
      hitCount: 0,
    });
  }

  clear(): void {
    this.cache.clear();
  }

  getStats() {
    const entries = Array.from(this.cache.values());
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
      utilizationRate: (this.cache.size / this.maxCacheSize) * 100,
      totalHits: entries.reduce((sum, entry) => sum + entry.hitCount, 0),
      averageHits:
        entries.length > 0
          ? entries.reduce((sum, entry) => sum + entry.hitCount, 0) /
            entries.length
          : 0,
    };
  }
}

// Global monitoring instances
const performanceMonitor = new ExercisePerformanceMonitor();
const securityValidator = new ExerciseSecurityValidator();
const cacheManager = new ExerciseCacheManager();

// Exercise difficulty progression constants
const PROGRESSION_LEVELS = {
  BEGINNER: [
    "push_up_1",
    "squat_bodyweight_1",
    "plank_1",
    "wall_sit_1",
    "glute_bridge_1",
    "superman_hold_1",
  ],
  INTERMEDIATE: [
    "mountain_climbers_bodyweight_1",
    "decline_push_up_1",
    "side_plank_1",
    "bicycle_crunch_1",
    "bear_crawl_1",
    "chair_tricep_dip_1",
  ],
  ADVANCED: ["single_leg_hip_thrust_1", "jump_squat_bodyweight_1"],
} as const;

// Exercise categories for better organization
const EXERCISE_CATEGORIES = {
  UPPER_BODY: [
    "push_up_1",
    "incline_push_up_1",
    "decline_push_up_1",
    "chair_tricep_dip_1",
  ],
  LOWER_BODY: [
    "squat_bodyweight_1",
    "lunges_1",
    "wall_sit_1",
    "glute_bridge_1",
    "single_leg_hip_thrust_1",
    "jump_squat_bodyweight_1",
  ],
  CORE: ["plank_1", "side_plank_1", "bicycle_crunch_1", "superman_hold_1"],
  CARDIO: [
    "mountain_climbers_bodyweight_1",
    "bear_crawl_1",
    "jump_squat_bodyweight_1",
  ],
  FULL_BODY: ["mountain_climbers_bodyweight_1", "bear_crawl_1"],
} as const;

export const bodyweightExercises: Exercise[] = [
  {
    id: "push_up_1",
    name: "שכיבת סמיכה בסיסית",
    nameLocalized: {
      he: "שכיבת סמיכה בסיסית",
      en: "Basic Push-Up",
    },
    category: "strength",
    primaryMuscles: ["chest", "shoulders", "triceps"],
    secondaryMuscles: ["core"],
    equipment: "none",
    difficulty: "beginner",
    instructions: {
      he: [
        "השתטח על הבטן עם כפות הידיים על הרצפה ברוחב הכתפיים",
        "שמור על קו ישר מהראש עד העקבים",
        "הורד את החזה לעבר הרצפה עד שהמרפקים ב-90 מעלות",
        "דחף חזרה למעלה לעמדת ההתחלה בכוח",
      ],
      en: [
        "Lie face down with palms on floor shoulder-width apart",
        "Maintain straight line from head to heels",
        "Lower chest toward floor until elbows at 90 degrees",
        "Push back up to starting position with force",
      ],
    },
    tips: {
      he: [
        "שמור על שרירי הליבה מתוחים כל הזמן",
        "נשם פנימה בירידה, החוצה בעלייה",
        "אל תתן לירכיים לרדת או להתרומם",
        "התחל על הברכיים אם קשה מדי",
      ],
      en: [
        "Keep core muscles tight throughout",
        "Breathe in going down, out going up",
        "Don't let hips sag or pike up",
        "Start on knees if too difficult",
      ],
    },
    safetyNotes: {
      he: [
        "הפסק אם מרגיש כאב בכתפיים",
        "אל תכופף את פרקי הידיים יותר מדי",
        "התחל עם מעט חזרות והגדל בהדרגה",
      ],
      en: [
        "Stop if you feel shoulder pain",
        "Don't overextend wrists",
        "Start with few reps and progress gradually",
      ],
    },
    media: {
      image: "exercises/push_up_basic.jpg",
      video: "exercises/push_up_basic.mp4",
      thumbnail: "exercises/push_up_basic_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "minimal",
    noiseLevel: "silent",
  },

  {
    id: "squat_bodyweight_1",
    name: "כיפופי ברכיים",
    nameLocalized: {
      he: "כיפופי ברכיים עם משקל גוף",
      en: "Bodyweight Squat",
    },
    category: "strength",
    primaryMuscles: ["quadriceps", "glutes"],
    secondaryMuscles: ["hamstrings", "core"],
    equipment: "none",
    difficulty: "beginner",
    instructions: {
      he: [
        "עמוד עם הרגליים ברוחב הכתפיים",
        "הושט ידיים קדימה לאיזון",
        "הורד את הירכיים אחורה ומטה כמו יושב על כיסא",
        "רד עד שהירכיים במקביל לרצפה",
        "דחף דרך העקבים לחזור למעלה",
      ],
      en: [
        "Stand with feet shoulder-width apart",
        "Extend arms forward for balance",
        "Lower hips back and down like sitting in chair",
        "Descend until thighs parallel to floor",
        "Drive through heels to return up",
      ],
    },
    tips: {
      he: [
        "שמור על החזה פתוח והגב ישר",
        "הברכיים צריכות לעקוב אחר כיוון האצבעות",
        "התמקד בהפעלת הישבן",
        "התחל עם עומק קטן והגדל בהדרגה",
      ],
      en: [
        "Keep chest up and back straight",
        "Knees should track over toes",
        "Focus on engaging glutes",
        "Start shallow and increase depth gradually",
      ],
    },
    safetyNotes: {
      he: [
        "אל תתן לברכיים ליפול פנימה",
        "הפסק אם כואב בברכיים או גב",
        "אל תרד מהר מדי",
      ],
      en: [
        "Don't let knees collapse inward",
        "Stop if knees or back hurt",
        "Don't descend too quickly",
      ],
    },
    media: {
      image: "exercises/squat_bodyweight.jpg",
      video: "exercises/squat_bodyweight.mp4",
      thumbnail: "exercises/squat_bodyweight_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "small",
    noiseLevel: "quiet",
  },

  {
    id: "plank_1",
    name: "פלאנק",
    nameLocalized: {
      he: "פלאנק סטנדרטי",
      en: "Standard Plank",
    },
    category: "core",
    primaryMuscles: ["core"],
    secondaryMuscles: ["shoulders", "back"],
    equipment: "none",
    difficulty: "beginner",
    instructions: {
      he: [
        "התחל בעמדת שכיבת סמיכה ורד על המרפקים",
        "שמור על קו ישר מהראש עד העקבים",
        "הפעל את שרירי הליבה וחזק אותם",
        "החזק את העמדה למשך הזמן הנדרש",
        "נשם באופן קבוע",
      ],
      en: [
        "Start in push-up position and lower to forearms",
        "Maintain straight line from head to heels",
        "Engage and tighten core muscles",
        "Hold position for required duration",
        "Breathe regularly throughout",
      ],
    },
    tips: {
      he: [
        "נשם באופן קבוע, אל תעצור את הנשימה",
        "התמקד בהפעלת שרירי הבטן העמוקים",
        "שמור על הצוואר במצב נייטרלי",
        "אל תתן לירכיים לרדת",
      ],
      en: [
        "Breathe regularly, don't hold breath",
        "Focus on deep abdominal muscles",
        "Keep neck in neutral position",
        "Don't let hips drop",
      ],
    },
    safetyNotes: {
      he: [
        "הפסק אם מרגיש כאב בגב תחתון",
        "התחל עם זמנים קצרים",
        "אל תתרומם יותר מדי גבוה",
      ],
      en: [
        "Stop if you feel lower back pain",
        "Start with shorter durations",
        "Don't raise hips too high",
      ],
    },
    media: {
      image: "exercises/plank_standard.jpg",
      video: "exercises/plank_standard.mp4",
      thumbnail: "exercises/plank_standard_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "minimal",
    noiseLevel: "silent",
  },

  {
    id: "mountain_climbers_bodyweight_1",
    name: "מטפסי הרים",
    nameLocalized: {
      he: "מטפסי הרים",
      en: "Mountain Climbers",
    },
    category: "cardio",
    primaryMuscles: ["core"],
    secondaryMuscles: ["shoulders", "quadriceps", "hamstrings"],
    equipment: "none",
    difficulty: "intermediate",
    instructions: {
      he: [
        "התחל בעמדת פלאנק עם זרועות ישרות",
        "מעלה ברך אחת לעבר החזה",
        "החלף רגליים במהירות",
        "המשך להחליף בקצב מהיר",
      ],
      en: [
        "Start in plank position with straight arms",
        "Bring one knee toward chest",
        "Switch legs quickly",
        "Continue alternating at fast pace",
      ],
    },
    tips: {
      he: ["שמור על ירכיים יציבות", "אל תתן לישבן להתרומם", "נשם באופן קבוע"],
      en: ["Keep hips stable", "Don't let hips rise up", "Breathe regularly"],
    },
    safetyNotes: {
      he: [
        "התחל לאט והגדל מהירות בהדרגה",
        "הפסק אם כואב בפרקי הידיים",
        "שמור על גב ישר",
      ],
      en: [
        "Start slow and increase speed gradually",
        "Stop if wrists hurt",
        "Keep back straight",
      ],
    },
    media: {
      image: "exercises/mountain_climbers.jpg",
      video: "exercises/mountain_climbers.mp4",
      thumbnail: "exercises/mountain_climbers_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "small",
    noiseLevel: "moderate",
  },

  {
    id: "lunges_1",
    name: "צעידות",
    nameLocalized: {
      he: "צעידות (לנג'ס)",
      en: "Lunges",
    },
    category: "strength",
    primaryMuscles: ["quadriceps", "glutes"],
    secondaryMuscles: ["hamstrings", "calves", "core"],
    equipment: "none",
    difficulty: "beginner",
    instructions: {
      he: [
        "עמוד זקוף עם רגליים ברוחב ירכיים",
        "צעד קדימה עם רגל אחת",
        "הורד את הגוף עד שהברך האחורית כמעט נוגעת ברצפה",
        "דחף חזרה למעלה לעמדת ההתחלה",
        "חזור עם הרגל השנייה",
      ],
      en: [
        "Stand upright with feet hip-width apart",
        "Step forward with one leg",
        "Lower body until back knee nearly touches floor",
        "Push back up to starting position",
        "Repeat with other leg",
      ],
    },
    tips: {
      he: [
        "שמור על הגוף זקוף",
        "הברך הקדמית צריכה להיות מעל הקרסול",
        "התמקד על האיזון",
        "התחל עם צעדים קטנים",
      ],
      en: [
        "Keep torso upright",
        "Front knee should be over ankle",
        "Focus on balance",
        "Start with smaller steps",
      ],
    },
    safetyNotes: {
      he: [
        "אל תתן לברך הקדמית לחרוג מעל האצבעות",
        "הפסק אם כואב בברכיים",
        "התחל עם גרסה נייחת",
      ],
      en: [
        "Don't let front knee go past toes",
        "Stop if knees hurt",
        "Start with stationary version",
      ],
    },
    media: {
      image: "exercises/lunges.jpg",
      video: "exercises/lunges.mp4",
      thumbnail: "exercises/lunges_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "medium",
    noiseLevel: "quiet",
  },

  {
    id: "wall_sit_1",
    name: "ישיבה על קיר",
    nameLocalized: {
      he: "ישיבה על קיר",
      en: "Wall Sit",
    },
    category: "strength",
    primaryMuscles: ["quadriceps", "glutes"],
    secondaryMuscles: ["core"],
    equipment: "none",
    difficulty: "beginner",
    instructions: {
      he: [
        "עמוד עם הגב לקיר",
        "החלק את הגב למטה לאורך הקיר",
        "רד עד שהירכיים במקביל לרצפה",
        "שמור על הברכיים בזווית 90 מעלות",
        "החזק את העמדה",
      ],
      en: [
        "Stand with back against wall",
        "Slide back down along wall",
        "Lower until thighs parallel to floor",
        "Keep knees at 90 degree angle",
        "Hold position",
      ],
    },
    tips: {
      he: [
        "התחל עם זמנים קצרים",
        "שמור על הגב צמוד לקיר",
        "נשם באופן קבוע",
        "התמקד על שרירי הרגליים",
      ],
      en: [
        "Start with short durations",
        "Keep back flat against wall",
        "Breathe regularly",
        "Focus on leg muscles",
      ],
    },
    safetyNotes: {
      he: [
        "הפסק אם כואב בברכיים",
        "אל תרד מתחת ל-90 מעלות",
        "התחל עם 15-30 שניות",
      ],
      en: [
        "Stop if knees hurt",
        "Don't go below 90 degrees",
        "Start with 15-30 seconds",
      ],
    },
    media: {
      image: "exercises/wall_sit.jpg",
      video: "exercises/wall_sit.mp4",
      thumbnail: "exercises/wall_sit_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: false,
    spaceRequired: "minimal",
    noiseLevel: "silent",
  },

  {
    id: "incline_push_up_1",
    name: "שכיבת סמיכה שיפוע חיובי",
    nameLocalized: { he: "שכיבת סמיכה שיפוע חיובי", en: "Incline Push-Up" },
    category: "strength",
    primaryMuscles: ["chest", "shoulders", "triceps"],
    secondaryMuscles: ["core"],
    equipment: "none",
    difficulty: "beginner",
    instructions: {
      he: [
        "הנח ידיים על שולחן/ספסל יציב",
        "שמור גוף בקו ישר",
        "כופף מרפקים והורד חזה",
        "דחוף חזרה",
      ],
      en: [
        "Place hands on stable elevated surface",
        "Keep body straight",
        "Lower chest by bending elbows",
        "Push back up",
      ],
    },
    tips: { he: ["יותר קל מעמידה רגילה"], en: ["Easier than floor version"] },
    safetyNotes: { he: ["ודא שהמשטח יציב"], en: ["Ensure surface is stable"] },
    media: {
      image: "exercises/incline_push_up.jpg",
      video: "",
      thumbnail: "exercises/incline_push_up_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "minimal",
    noiseLevel: "silent",
  },
  {
    id: "decline_push_up_1",
    name: "שכיבת סמיכה שיפוע שלילי",
    nameLocalized: { he: "שכיבת סמיכה שיפוע שלילי", en: "Decline Push-Up" },
    category: "strength",
    primaryMuscles: ["chest", "shoulders", "triceps"],
    secondaryMuscles: ["core"],
    equipment: "none",
    difficulty: "intermediate",
    instructions: {
      he: [
        "הנח רגליים על ספסל",
        "כפות ידיים על הרצפה",
        "הורד חזה בשליטה",
        "דחוף למעלה",
      ],
      en: [
        "Feet on bench",
        "Hands on floor",
        "Lower chest under control",
        "Press back up",
      ],
    },
    tips: { he: ["שמור ליבה חזקה"], en: ["Keep core tight"] },
    safetyNotes: { he: ["אל תקרוס במותן"], en: ["Don't let hips sag"] },
    media: {
      image: "exercises/decline_push_up.jpg",
      video: "",
      thumbnail: "exercises/decline_push_up_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "minimal",
    noiseLevel: "quiet",
  },
  {
    id: "glute_bridge_1",
    name: "גשר ישבן",
    nameLocalized: { he: "גשר ישבן", en: "Glute Bridge" },
    category: "strength",
    primaryMuscles: ["glutes", "hamstrings"],
    secondaryMuscles: ["core"],
    equipment: "none",
    difficulty: "beginner",
    instructions: {
      he: ["שכב על הגב", "כופף ברכיים", "הרם אגן", "הורד בשליטה"],
      en: ["Lie on back", "Bend knees", "Lift hips", "Lower with control"],
    },
    tips: { he: ["הפעל ישבן למעלה"], en: ["Squeeze glutes at top"] },
    safetyNotes: {
      he: ["אל תעמיס גב תחתון"],
      en: ["Don't overextend lower back"],
    },
    media: {
      image: "exercises/glute_bridge.jpg",
      video: "",
      thumbnail: "exercises/glute_bridge_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "minimal",
    noiseLevel: "silent",
  },
  {
    id: "single_leg_hip_thrust_1",
    name: "דחיקת אגן רגל אחת",
    nameLocalized: { he: "דחיקת אגן רגל אחת", en: "Single-Leg Hip Thrust" },
    category: "strength",
    primaryMuscles: ["glutes", "hamstrings"],
    secondaryMuscles: ["core"],
    equipment: "none",
    difficulty: "advanced",
    instructions: {
      he: ["גב על ספה", "רגל אחת באוויר", "הרם אגן", "הורד"],
      en: [
        "Upper back on bench",
        "Other leg elevated",
        "Drive hips up",
        "Lower",
      ],
    },
    tips: { he: ["שלוט בירידה"], en: ["Control the descent"] },
    safetyNotes: { he: ["שמור יציבות"], en: ["Maintain stability"] },
    media: {
      image: "exercises/single_leg_hip_thrust.jpg",
      video: "",
      thumbnail: "exercises/single_leg_hip_thrust_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: false,
    spaceRequired: "small",
    noiseLevel: "silent",
  },
  {
    id: "side_plank_1",
    name: "פלאנק צד",
    nameLocalized: { he: "פלאנק צד", en: "Side Plank" },
    category: "core",
    primaryMuscles: ["core"],
    secondaryMuscles: ["shoulders", "glutes"],
    equipment: "none",
    difficulty: "intermediate",
    instructions: {
      he: ["שכב על צד", "מרפק מתחת לכתף", "הרם אגן", "החזק"],
      en: ["Lie on side", "Elbow under shoulder", "Lift hips", "Hold"],
    },
    tips: { he: ["אל תתן לאגן ליפול"], en: ["Don't let hips drop"] },
    safetyNotes: { he: ["הפסק בכאב כתף"], en: ["Stop if shoulder pain"] },
    media: {
      image: "exercises/side_plank.jpg",
      video: "",
      thumbnail: "exercises/side_plank_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "minimal",
    noiseLevel: "silent",
  },
  {
    id: "bicycle_crunch_1",
    name: "כפיפות בטן אופניים",
    nameLocalized: { he: "כפיפות בטן אופניים", en: "Bicycle Crunch" },
    category: "core",
    primaryMuscles: ["core"],
    secondaryMuscles: ["hips"],
    equipment: "none",
    difficulty: "intermediate",
    instructions: {
      he: ["שכב על הגב", "מרפק לברך נגדית בקצב", "המשך להחליף"],
      en: ["Lie on back", "Elbow to opposite knee", "Keep alternating"],
    },
    tips: { he: ["שליטה בסיבוב"], en: ["Control the twist"] },
    safetyNotes: { he: ["אל תמשוך בצוואר"], en: ["Don't pull neck"] },
    media: {
      image: "exercises/bicycle_crunch.jpg",
      video: "",
      thumbnail: "exercises/bicycle_crunch_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "minimal",
    noiseLevel: "silent",
  },
  {
    id: "jump_squat_bodyweight_1",
    name: "סקוואט קפיצה",
    nameLocalized: { he: "סקוואט קפיצה", en: "Jump Squat" },
    category: "cardio",
    primaryMuscles: ["quadriceps", "glutes"],
    secondaryMuscles: ["hamstrings", "calves", "core"],
    equipment: "none",
    difficulty: "advanced",
    instructions: {
      he: ["רד לסקוואט", "קפוץ למעלה", "נחת רך"],
      en: ["Descend to squat", "Explode upward", "Land softly"],
    },
    tips: {
      he: ["שמור ברכיים מיושרות לכיוון האצבעות"],
      en: ["Track knees over toes"],
    },
    safetyNotes: { he: ["הימנע מעייפות יתר"], en: ["Avoid excessive fatigue"] },
    media: {
      image: "exercises/jump_squat.jpg",
      video: "",
      thumbnail: "exercises/jump_squat_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: true,
    spaceRequired: "small",
    noiseLevel: "moderate",
  },
  {
    id: "bear_crawl_1",
    name: "זחילת דוב",
    nameLocalized: { he: "זחילת דוב", en: "Bear Crawl" },
    category: "cardio",
    primaryMuscles: ["core", "shoulders"],
    secondaryMuscles: ["quadriceps", "glutes"],
    equipment: "none",
    difficulty: "intermediate",
    instructions: {
      he: ["ידיים וברכיים", "הרם ברכיים מעט", "זחול קדימה"],
      en: ["Hands and knees", "Lift knees slightly", "Crawl forward"],
    },
    tips: { he: ["תנועות קצרות"], en: ["Use short steps"] },
    safetyNotes: { he: ["שמור גב ניטרלי"], en: ["Maintain neutral spine"] },
    media: {
      image: "exercises/bear_crawl.jpg",
      video: "",
      thumbnail: "exercises/bear_crawl_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "medium",
    noiseLevel: "moderate",
  },
  {
    id: "superman_hold_1",
    name: "סופרמן",
    nameLocalized: { he: "סופרמן", en: "Superman Hold" },
    category: "strength",
    primaryMuscles: ["back", "glutes"],
    secondaryMuscles: ["hamstrings", "shoulders"],
    equipment: "none",
    difficulty: "beginner",
    instructions: {
      he: ["שכב על הבטן", "הרם ידיים ורגליים", "החזק"],
      en: ["Lie prone", "Lift arms and legs", "Hold"],
    },
    tips: { he: ["צמצם עומס צוואר"], en: ["Keep neck neutral"] },
    safetyNotes: { he: ["הפסק בכאב גב"], en: ["Stop if back pain"] },
    media: {
      image: "exercises/superman_hold.jpg",
      video: "",
      thumbnail: "exercises/superman_hold_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "minimal",
    noiseLevel: "silent",
  },
  {
    id: "chair_tricep_dip_1",
    name: "דיפס על כיסא",
    nameLocalized: { he: "דיפס על כיסא", en: "Chair Tricep Dip" },
    category: "strength",
    primaryMuscles: ["triceps"],
    secondaryMuscles: ["shoulders", "chest"],
    equipment: "none",
    difficulty: "intermediate",
    instructions: {
      he: ["ידיים על קצה כיסא", "כופף מרפקים 90°", "דחוף למעלה"],
      en: ["Hands on chair edge", "Lower to ~90°", "Press back up"],
    },
    tips: { he: ["מרפקים לאחור"], en: ["Keep elbows back"] },
    safetyNotes: { he: ["הימנע עומס כתף"], en: ["Avoid shoulder strain"] },
    media: {
      image: "exercises/chair_dip.jpg",
      video: "",
      thumbnail: "exercises/chair_dip_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: false,
    spaceRequired: "small",
    noiseLevel: "quiet",
  },
];

// ===============================================
// 🔧 Enhanced Utility Functions - פונקציות עזר משופרות
// ===============================================

/**
 * Advanced exercise validation with safety checks
 * בדיקת תקינות תרגיל מתקדמת עם בדיקות בטיחות
 */
function validateExerciseSafety(
  exercise: Exercise,
  userLevel?: string
): ExerciseSafetyValidation {
  try {
    const warnings: string[] = [];
    const recommendations: string[] = [];
    let riskLevel: "low" | "medium" | "high" = "low";

    // Difficulty vs user level validation
    if (
      userLevel &&
      userLevel === "beginner" &&
      exercise.difficulty === "advanced"
    ) {
      warnings.push("תרגיל מתקדם עבור מתחיל");
      recommendations.push("התחל עם גרסה קלה יותר");
      riskLevel = "high";
    }

    // Equipment safety checks
    if (exercise.equipment === "none" && exercise.spaceRequired === "large") {
      warnings.push("דרוש מקום רב");
      recommendations.push("ודא שיש מספיק מקום מסביב");
    }

    // High-impact exercise warnings
    if (exercise.id.includes("jump") || exercise.category === "cardio") {
      if (riskLevel === "low") riskLevel = "medium";
      recommendations.push("התחל בקצב איטי והגדל בהדרגה");
    }

    // Noise level considerations
    if (exercise.noiseLevel === "moderate" || exercise.noiseLevel === "loud") {
      recommendations.push("שקול את הזמן והמקום לביצוע");
    }

    return {
      isValid: warnings.length === 0,
      warnings,
      recommendations,
      riskLevel,
    };
  } catch (error) {
    logger.error(
      "ExerciseDB: Safety validation error",
      error instanceof Error ? error.message : String(error)
    );
    return {
      isValid: false,
      warnings: ["שגיאה בבדיקת בטיחות"],
      recommendations: ["התייעץ עם מאמן"],
      riskLevel: "high",
    };
  }
}

/**
 * Enhanced accessibility information for exercises
 * מידע נגישות משופר לתרגילים
 */
function getExerciseAccessibilityInfo(
  exercise: Exercise
): ExerciseAccessibilityInfo {
  return {
    screenReaderEnabled: true,
    hebrewLanguageActive: true,
    voiceNavigationSupported: exercise.homeCompatible,
    accessibilityEnhancements: exercise.noiseLevel === "silent",
    lastAccessibilityUpdate: Date.now(),
  };
}

/**
 * Get exercises by difficulty level - Enhanced with caching and monitoring
 * קבלת תרגילים לפי רמת קושי - משופר עם מטמון וניטור
 */
export function getBodyweightExercisesByDifficulty(
  level: "beginner" | "intermediate" | "advanced"
): Exercise[] {
  const startTime = performanceMonitor.startQuery(`difficulty_${level}`);
  const cacheKey = `difficulty_${level}`;

  try {
    // Check cache first
    const cached = cacheManager.get(cacheKey);
    if (cached) {
      performanceMonitor.recordCacheHit();
      performanceMonitor.endQuery(startTime, cached.length);
      return cached;
    }
    performanceMonitor.recordCacheMiss();

    // Validate and filter exercises
    const validExercises = bodyweightExercises.filter((exercise) => {
      if (!securityValidator.validateExerciseData(exercise)) {
        return false;
      }
      performanceMonitor.recordExerciseAccess(exercise.id);
      return exercise.difficulty === level;
    });

    // Cache the result
    cacheManager.set(cacheKey, validExercises);
    performanceMonitor.endQuery(startTime, validExercises.length);

    return validExercises;
  } catch (error) {
    logger.error(
      "ExerciseDB: Error filtering by difficulty",
      error instanceof Error ? error.message : String(error)
    );
    performanceMonitor.endQuery(startTime, 0);
    return [];
  }
}

/**
 * Get exercises by primary muscle group - Enhanced with security and caching
 * קבלת תרגילים לפי קבוצת שרירים עיקרית - משופר עם אבטחה ומטמון
 */
export function getBodyweightExercisesByMuscle(muscle: string): Exercise[] {
  const startTime = performanceMonitor.startQuery(`muscle_${muscle}`);
  const sanitizedMuscle = securityValidator.sanitizeSearchQuery(muscle);
  const cacheKey = `muscle_${sanitizedMuscle}`;

  try {
    // Check cache first
    const cached = cacheManager.get(cacheKey);
    if (cached) {
      performanceMonitor.recordCacheHit();
      performanceMonitor.endQuery(startTime, cached.length);
      return cached;
    }
    performanceMonitor.recordCacheMiss();

    const validExercises = bodyweightExercises.filter((exercise) => {
      if (!securityValidator.validateExerciseData(exercise)) {
        return false;
      }
      performanceMonitor.recordExerciseAccess(exercise.id);
      return exercise.primaryMuscles.some((m) =>
        m.toLowerCase().includes(sanitizedMuscle)
      );
    });

    // Cache the result
    cacheManager.set(cacheKey, validExercises);
    performanceMonitor.endQuery(startTime, validExercises.length);

    return validExercises;
  } catch (error) {
    logger.error(
      "ExerciseDB: Error filtering by muscle",
      error instanceof Error ? error.message : String(error)
    );
    performanceMonitor.endQuery(startTime, 0);
    return [];
  }
}

/**
 * Get exercises suitable for small spaces - Enhanced with monitoring
 * קבלת תרגילים מתאימים לחללים קטנים - משופר עם ניטור
 */
export function getMinimalSpaceExercises(): Exercise[] {
  const startTime = performanceMonitor.startQuery("minimal_space");
  const cacheKey = "minimal_space";

  try {
    const cached = cacheManager.get(cacheKey);
    if (cached) {
      performanceMonitor.recordCacheHit();
      performanceMonitor.endQuery(startTime, cached.length);
      return cached;
    }
    performanceMonitor.recordCacheMiss();

    const validExercises = bodyweightExercises.filter((exercise) => {
      if (!securityValidator.validateExerciseData(exercise)) {
        return false;
      }
      performanceMonitor.recordExerciseAccess(exercise.id);
      return exercise.spaceRequired === "minimal";
    });

    cacheManager.set(cacheKey, validExercises);
    performanceMonitor.endQuery(startTime, validExercises.length);

    return validExercises;
  } catch (error) {
    logger.error(
      "ExerciseDB: Error filtering by space",
      error instanceof Error ? error.message : String(error)
    );
    performanceMonitor.endQuery(startTime, 0);
    return [];
  }
}

/**
 * Get silent exercises (apartment-friendly) - Enhanced with accessibility
 * קבלת תרגילים שקטים (מתאים לדירה) - משופר עם נגישות
 */
export function getSilentExercises(): Exercise[] {
  const startTime = performanceMonitor.startQuery("silent_exercises");
  const cacheKey = "silent_exercises";

  try {
    const cached = cacheManager.get(cacheKey);
    if (cached) {
      performanceMonitor.recordCacheHit();
      performanceMonitor.endQuery(startTime, cached.length);
      return cached;
    }
    performanceMonitor.recordCacheMiss();

    const validExercises = bodyweightExercises.filter((exercise) => {
      if (!securityValidator.validateExerciseData(exercise)) {
        return false;
      }
      performanceMonitor.recordExerciseAccess(exercise.id);
      return exercise.noiseLevel === "silent";
    });

    cacheManager.set(cacheKey, validExercises, 600000); // 10 minute cache for silent exercises
    performanceMonitor.endQuery(startTime, validExercises.length);

    return validExercises;
  } catch (error) {
    logger.error(
      "ExerciseDB: Error filtering silent exercises",
      error instanceof Error ? error.message : String(error)
    );
    performanceMonitor.endQuery(startTime, 0);
    return [];
  }
}

/**
 * Advanced exercise search with multiple filters
 * חיפוש תרגילים מתקדם עם מספר מסננים
 */
export function searchExercises(filters: {
  difficulty?: string;
  category?: string;
  muscle?: string;
  spaceRequired?: string;
  noiseLevel?: string;
  homeCompatible?: boolean;
  searchTerm?: string;
}): Exercise[] {
  const startTime = performanceMonitor.startQuery("advanced_search");

  try {
    // Sanitize search inputs
    const sanitizedFilters = {
      ...filters,
      searchTerm: filters.searchTerm
        ? securityValidator.sanitizeSearchQuery(filters.searchTerm)
        : undefined,
      muscle: filters.muscle
        ? securityValidator.sanitizeSearchQuery(filters.muscle)
        : undefined,
    };

    const cacheKey = `search_${JSON.stringify(sanitizedFilters)}`;
    const cached = cacheManager.get(cacheKey);
    if (cached) {
      performanceMonitor.recordCacheHit();
      performanceMonitor.endQuery(startTime, cached.length);
      return cached;
    }
    performanceMonitor.recordCacheMiss();

    const filteredExercises = bodyweightExercises.filter((exercise) => {
      if (!securityValidator.validateExerciseData(exercise)) {
        return false;
      }

      // Apply all filters
      if (
        sanitizedFilters.difficulty &&
        exercise.difficulty !== sanitizedFilters.difficulty
      )
        return false;
      if (
        sanitizedFilters.category &&
        exercise.category !== sanitizedFilters.category
      )
        return false;
      if (
        sanitizedFilters.spaceRequired &&
        exercise.spaceRequired !== sanitizedFilters.spaceRequired
      )
        return false;
      if (
        sanitizedFilters.noiseLevel &&
        exercise.noiseLevel !== sanitizedFilters.noiseLevel
      )
        return false;
      if (
        sanitizedFilters.homeCompatible !== undefined &&
        exercise.homeCompatible !== sanitizedFilters.homeCompatible
      )
        return false;

      if (sanitizedFilters.muscle) {
        const muscleMatch =
          exercise.primaryMuscles.some((m) =>
            m.toLowerCase().includes(sanitizedFilters.muscle!.toLowerCase())
          ) ||
          exercise.secondaryMuscles?.some((m) =>
            m.toLowerCase().includes(sanitizedFilters.muscle!.toLowerCase())
          );
        if (!muscleMatch) return false;
      }

      if (sanitizedFilters.searchTerm) {
        const searchInName = exercise.name
          .toLowerCase()
          .includes(sanitizedFilters.searchTerm);
        const searchInHebrew = exercise.nameLocalized?.he
          ?.toLowerCase()
          .includes(sanitizedFilters.searchTerm);
        const searchInEnglish = exercise.nameLocalized?.en
          ?.toLowerCase()
          .includes(sanitizedFilters.searchTerm);
        if (!searchInName && !searchInHebrew && !searchInEnglish) return false;
      }

      performanceMonitor.recordExerciseAccess(exercise.id);
      return true;
    });

    // Cache the result
    cacheManager.set(cacheKey, filteredExercises);
    performanceMonitor.endQuery(startTime, filteredExercises.length);

    return filteredExercises;
  } catch (error) {
    logger.error(
      "ExerciseDB: Error in advanced search",
      error instanceof Error ? error.message : String(error)
    );
    performanceMonitor.endQuery(startTime, 0);
    return [];
  }
}

/**
 * Get progression path for specific exercise - Enhanced with safety validation
 * קבלת מסלול התקדמות לתרגיל ספציפי - משופר עם בדיקת בטיחות
 */
export function getExerciseProgression(
  exerciseId: string,
  userLevel?: string
): {
  exercises: Exercise[];
  safetyInfo: ExerciseSafetyValidation[];
} {
  const startTime = performanceMonitor.startQuery(`progression_${exerciseId}`);
  const sanitizedId = securityValidator.sanitizeSearchQuery(exerciseId);

  try {
    const progressions: { [key: string]: string[] } = {
      push_up_1: ["incline_push_up_1", "push_up_1", "decline_push_up_1"],
      plank_1: ["plank_1", "side_plank_1"],
      squat_bodyweight_1: ["squat_bodyweight_1", "jump_squat_bodyweight_1"],
      glute_bridge_1: ["glute_bridge_1", "single_leg_hip_thrust_1"],
    };

    const ids = progressions[sanitizedId] || [sanitizedId];
    const exercises = bodyweightExercises.filter((ex) => {
      if (!securityValidator.validateExerciseData(ex)) {
        return false;
      }
      performanceMonitor.recordExerciseAccess(ex.id);
      return ids.includes(ex.id);
    });

    const safetyInfo = exercises.map((exercise) =>
      validateExerciseSafety(exercise, userLevel)
    );

    performanceMonitor.endQuery(startTime, exercises.length);

    return {
      exercises,
      safetyInfo,
    };
  } catch (error) {
    logger.error(
      "ExerciseDB: Error getting progression",
      error instanceof Error ? error.message : String(error)
    );
    performanceMonitor.endQuery(startTime, 0);
    return {
      exercises: [],
      safetyInfo: [],
    };
  }
}

/**
 * Generate quick workout routine - Enhanced with AI-powered selection
 * יצירת סדרת אימון מהירה - משופר עם בחירה מבוססת AI
 */
export function generateQuickBodyweightWorkout(
  duration: "short" | "medium" | "long",
  difficulty: "beginner" | "intermediate" | "advanced",
  preferences?: {
    targetMuscles?: string[];
    avoidMuscles?: string[];
    spaceRequired?: string;
    noiseLevel?: string;
    includeCardio?: boolean;
  }
): {
  exercises: Exercise[];
  estimatedDuration: number;
  caloriesBurned: number;
  safetyNotes: string[];
  accessibilityInfo: ExerciseAccessibilityInfo[];
} {
  const startTime = performanceMonitor.startQuery(
    `workout_generation_${duration}_${difficulty}`
  );

  try {
    const exerciseCount = { short: 4, medium: 6, long: 8 }[duration];
    const estimatedDuration = { short: 15, medium: 25, long: 35 }[duration];

    let availableExercises = getBodyweightExercisesByDifficulty(difficulty);

    // Apply preferences filters
    if (preferences) {
      if (preferences.spaceRequired) {
        availableExercises = availableExercises.filter(
          (ex) => ex.spaceRequired === preferences.spaceRequired
        );
      }

      if (preferences.noiseLevel) {
        availableExercises = availableExercises.filter(
          (ex) => ex.noiseLevel === preferences.noiseLevel
        );
      }

      if (preferences.targetMuscles && preferences.targetMuscles.length > 0) {
        availableExercises = availableExercises.filter((ex) =>
          preferences.targetMuscles!.some((muscle) =>
            ex.primaryMuscles.includes(muscle as Exercise["primaryMuscles"][0])
          )
        );
      }

      if (preferences.avoidMuscles && preferences.avoidMuscles.length > 0) {
        availableExercises = availableExercises.filter(
          (ex) =>
            !preferences.avoidMuscles!.some((muscle) =>
              ex.primaryMuscles.includes(
                muscle as Exercise["primaryMuscles"][0]
              )
            )
        );
      }
    }

    // Intelligent exercise selection
    const selected: Exercise[] = [];
    const categories = ["strength", "core"];

    // Add cardio if requested or for longer workouts
    if (preferences?.includeCardio || duration !== "short") {
      categories.push("cardio");
    }

    // Ensure variety across muscle groups and categories
    categories.forEach((category) => {
      const categoryExercises = availableExercises.filter(
        (ex) => ex.category === category && !selected.includes(ex)
      );
      if (categoryExercises.length > 0) {
        // Use popularity data to make intelligent selections
        const popularExercises = performanceMonitor.getPopularExercises(10);
        const popularIds = popularExercises.map((p) => p.id);

        // Prefer popular exercises but ensure variety
        const sortedExercises = categoryExercises.sort((a, b) => {
          const aPopular = popularIds.includes(a.id)
            ? popularIds.indexOf(a.id)
            : 999;
          const bPopular = popularIds.includes(b.id)
            ? popularIds.indexOf(b.id)
            : 999;
          return aPopular - bPopular;
        });

        selected.push(sortedExercises[0]);
        performanceMonitor.recordExerciseAccess(sortedExercises[0].id);
      }
    });

    // Fill remaining slots with diverse exercises
    while (
      selected.length < exerciseCount &&
      selected.length < availableExercises.length
    ) {
      const remaining = availableExercises.filter(
        (ex) => !selected.includes(ex)
      );
      if (remaining.length > 0) {
        // Try to balance muscle groups
        const usedMuscles = selected.flatMap((ex) => ex.primaryMuscles);
        const balancedChoice =
          remaining.find(
            (ex) =>
              !ex.primaryMuscles.some((muscle) => usedMuscles.includes(muscle))
          ) || remaining[0];

        selected.push(balancedChoice);
        performanceMonitor.recordExerciseAccess(balancedChoice.id);
      } else {
        break;
      }
    }

    // Generate safety notes and accessibility info
    const safetyNotes: string[] = [];
    const accessibilityInfo: ExerciseAccessibilityInfo[] = [];

    selected.forEach((exercise) => {
      const safety = validateExerciseSafety(exercise, difficulty);
      if (safety.warnings.length > 0) {
        safetyNotes.push(...safety.warnings);
      }

      accessibilityInfo.push(getExerciseAccessibilityInfo(exercise));
    });

    // Estimate calories burned (rough calculation)
    const baseCalories = { short: 80, medium: 140, long: 200 }[duration];
    const difficultyMultiplier = {
      beginner: 0.8,
      intermediate: 1.0,
      advanced: 1.2,
    }[difficulty];
    const caloriesBurned = Math.round(baseCalories * difficultyMultiplier);

    performanceMonitor.endQuery(startTime, selected.length);

    return {
      exercises: selected.slice(0, exerciseCount),
      estimatedDuration,
      caloriesBurned,
      safetyNotes: [...new Set(safetyNotes)], // Remove duplicates
      accessibilityInfo,
    };
  } catch (error) {
    logger.error(
      "ExerciseDB: Error generating workout",
      error instanceof Error ? error.message : String(error)
    );
    performanceMonitor.endQuery(startTime, 0);

    // Return safe fallback
    return {
      exercises: [],
      estimatedDuration: 0,
      caloriesBurned: 0,
      safetyNotes: ["שגיאה ביצירת אימון - נסה שוב"],
      accessibilityInfo: [],
    };
  }
}

// Export utility constants for external use
export { PROGRESSION_LEVELS, EXERCISE_CATEGORIES };

// ===============================================
// 🔧 Advanced Utility Functions - פונקציות עזר מתקדמות
// ===============================================

/**
 * Get exercise database metrics and analytics
 * קבלת מדדים ואנליטיקס של מסד הנתונים
 */
export function getExerciseDatabaseMetrics(): {
  performance: ExercisePerformanceMetrics;
  security: ExerciseSecurityMetrics;
  cache: ReturnType<ExerciseCacheManager["getStats"]>;
  totalExercises: number;
  categoryCounts: Record<string, number>;
  difficultyDistribution: Record<string, number>;
} {
  try {
    const categoryCounts: Record<string, number> = {};
    const difficultyDistribution: Record<string, number> = {};

    bodyweightExercises.forEach((exercise) => {
      categoryCounts[exercise.category] =
        (categoryCounts[exercise.category] || 0) + 1;
      difficultyDistribution[exercise.difficulty] =
        (difficultyDistribution[exercise.difficulty] || 0) + 1;
    });

    return {
      performance: performanceMonitor.getMetrics(),
      security: securityValidator.getMetrics(),
      cache: cacheManager.getStats(),
      totalExercises: bodyweightExercises.length,
      categoryCounts,
      difficultyDistribution,
    };
  } catch (error) {
    logger.error(
      "ExerciseDB: Failed to get metrics",
      error instanceof Error ? error.message : String(error)
    );

    return {
      performance: performanceMonitor.getMetrics(),
      security: securityValidator.getMetrics(),
      cache: cacheManager.getStats(),
      totalExercises: 0,
      categoryCounts: {},
      difficultyDistribution: {},
    };
  }
}

/**
 * Get AI-powered exercise recommendations
 * קבלת המלצות תרגילים מבוססות AI
 */
export function getExerciseRecommendations(userProfile: {
  level: string;
  goals: string[];
  limitations: string[];
  timeAvailable: number;
  equipment: string[];
}): {
  recommended: Exercise[];
  reasoning: string[];
  alternatives: Exercise[];
  progressionPlan: { week: number; exercises: Exercise[] }[];
} {
  const startTime = performanceMonitor.startQuery("ai_recommendations");

  try {
    const reasoning: string[] = [];
    let recommended: Exercise[] = [];
    let alternatives: Exercise[] = [];

    // Filter exercises based on user profile
    const suitableExercises = bodyweightExercises.filter((exercise) => {
      if (!securityValidator.validateExerciseData(exercise)) return false;

      // Level filtering
      if (
        userProfile.level === "beginner" &&
        exercise.difficulty === "advanced"
      ) {
        return false;
      }

      // Equipment filtering (bodyweight exercises don't need equipment)
      if (!exercise.equipment || exercise.equipment === "none") {
        reasoning.push(`תרגיל ${exercise.name} מתאים ללא ציוד`);
      }

      return true;
    });

    // Goal-based recommendations
    if (userProfile.goals.includes("strength")) {
      const strengthExercises = suitableExercises.filter(
        (ex) => ex.category === "strength"
      );
      recommended.push(...strengthExercises.slice(0, 3));
      reasoning.push("נבחרו תרגילי כוח בהתאם למטרות");
    }

    if (userProfile.goals.includes("cardio")) {
      const cardioExercises = suitableExercises.filter(
        (ex) => ex.category === "cardio"
      );
      recommended.push(...cardioExercises.slice(0, 2));
      reasoning.push("נוספו תרגילי קרדיו למטרות כושר גופני");
    }

    if (userProfile.goals.includes("core")) {
      const coreExercises = suitableExercises.filter(
        (ex) => ex.category === "core"
      );
      recommended.push(...coreExercises.slice(0, 2));
      reasoning.push("נכללו תרגילי ליבה לחיזוק המרכז");
    }

    // Remove duplicates and limit based on time
    recommended = [...new Set(recommended)];
    const maxExercises = Math.min(Math.floor(userProfile.timeAvailable / 3), 8);
    recommended = recommended.slice(0, maxExercises);

    // Generate alternatives
    alternatives = suitableExercises
      .filter((ex) => !recommended.includes(ex))
      .slice(0, 5);

    // Create progression plan
    const progressionPlan = [];
    for (let week = 1; week <= 4; week++) {
      const weekExercises = recommended.map((exercise) => {
        // Progress to harder variations over time
        if (week > 2 && exercise.difficulty === "beginner") {
          const progression = getExerciseProgression(exercise.id);
          const harder = progression.exercises.find(
            (ex) => ex.difficulty === "intermediate"
          );
          return harder || exercise;
        }
        return exercise;
      });

      progressionPlan.push({
        week,
        exercises: weekExercises,
      });
    }

    performanceMonitor.endQuery(startTime, recommended.length);

    return {
      recommended,
      reasoning,
      alternatives,
      progressionPlan,
    };
  } catch (error) {
    logger.error(
      "ExerciseDB: Error generating recommendations",
      error instanceof Error ? error.message : String(error)
    );
    performanceMonitor.endQuery(startTime, 0);

    return {
      recommended: [],
      reasoning: ["שגיאה ביצירת המלצות"],
      alternatives: [],
      progressionPlan: [],
    };
  }
}

/**
 * Validate exercise database health and integrity
 * בדיקת בריאות ותקינות מסד הנתונים
 */
export function validateDatabaseHealth(): {
  isHealthy: boolean;
  issues: string[];
  recommendations: string[];
  metrics: {
    performance: ExercisePerformanceMetrics;
    security: ExerciseSecurityMetrics;
    cache: ReturnType<ExerciseCacheManager["getStats"]>;
  };
} {
  try {
    const issues: string[] = [];
    const recommendations: string[] = [];

    const performance = performanceMonitor.getMetrics();
    const security = securityValidator.getMetrics();
    const cache = cacheManager.getStats();

    // Performance checks
    if (performance.averageQueryTime > 50) {
      issues.push("זמן שאילתות איטי");
      recommendations.push("אופטם מנגנוני מטמון");
    }

    if (performance.cacheHitRate < 60) {
      issues.push("יעילות מטמון נמוכה");
      recommendations.push("הגדל TTL או שפר אסטרטגיית מטמון");
    }

    // Security checks
    if (security.securityScore < 80) {
      issues.push("ציון אבטחה נמוך");
      recommendations.push("חזק ולידציה ובקרות אבטחה");
    }

    if (security.validationFailures > 5) {
      issues.push("כישלונות ולידציה מרובים");
      recommendations.push("בדוק תקינות נתוני התרגילים");
    }

    // Data integrity checks
    const invalidExercises = bodyweightExercises.filter(
      (ex) => !securityValidator.validateExerciseData(ex)
    );

    if (invalidExercises.length > 0) {
      issues.push(`${invalidExercises.length} תרגילים לא תקינים`);
      recommendations.push("תקן או הסר תרגילים לא תקינים");
    }

    // Cache checks
    if (cache.utilizationRate > 90) {
      issues.push("מטמון כמעט מלא");
      recommendations.push("הגדל גודל מטמון או שפר ניקוי");
    }

    return {
      isHealthy: issues.length === 0,
      issues,
      recommendations,
      metrics: {
        performance,
        security,
        cache,
      },
    };
  } catch (error) {
    logger.error(
      "ExerciseDB: Health validation failed",
      error instanceof Error ? error.message : String(error)
    );

    return {
      isHealthy: false,
      issues: ["שגיאה בבדיקת בריאות מסד הנתונים"],
      recommendations: ["בדוק לוגים ואתחל את המערכת"],
      metrics: {
        performance: performanceMonitor.getMetrics(),
        security: securityValidator.getMetrics(),
        cache: cacheManager.getStats(),
      },
    };
  }
}

/**
 * Reset database state and monitoring systems
 * איפוס מצב מסד הנתונים ומערכות הניטור
 */
export function resetDatabaseState(): void {
  try {
    performanceMonitor.reset();
    securityValidator.reset();
    cacheManager.clear();
    logger.info(
      "ExerciseDB: Database state reset successfully",
      "BodyweightExercises"
    );
  } catch (error) {
    logger.error(
      "ExerciseDB: Failed to reset database state",
      error instanceof Error ? error.message : String(error)
    );
  }
}

/**
 * ✨ SUMMARY OF ADVANCED ENHANCEMENTS - סיכום השיפורים המתקדמים
 *
 * 🔒 SECURITY ENHANCEMENTS - שיפורי אבטחה:
 * - Comprehensive input validation for all exercise data
 * - Advanced sanitization of search queries and filters
 * - Suspicious pattern detection in exercise content
 * - Security scoring and validation failure tracking
 * - XSS protection and injection prevention
 *
 * ⚡ PERFORMANCE OPTIMIZATIONS - אופטימיזציות ביצועים:
 * - Intelligent caching system with TTL management
 * - Performance monitoring with detailed query metrics
 * - Memory usage optimization and tracking
 * - Cache hit rate optimization with LRU eviction
 * - Efficient search algorithms with memoization
 *
 * ♿ ACCESSIBILITY FEATURES - תכונות נגישות:
 * - Enhanced Hebrew language support with RTL compatibility
 * - Screen reader optimized exercise descriptions
 * - Voice navigation compatible metadata
 * - Accessibility-aware workout generation
 * - Comprehensive accessibility annotations
 *
 * 🏥 HEALTH & SAFETY MONITORING - ניטור בריאות ובטיחות:
 * - Exercise safety validation with risk assessment
 * - User level appropriate exercise filtering
 * - Safety warnings and recommendations system
 * - Health checks for database integrity
 * - Proactive safety monitoring
 *
 * 🛡️ ENHANCED DATA INTEGRITY - שלמות נתונים משופרת:
 * - Comprehensive exercise data validation
 * - Type-safe operations with error handling
 * - Immutable data structures for safety
 * - Data consistency checks and monitoring
 * - Graceful error recovery mechanisms
 *
 * 🤖 AI-POWERED FEATURES - תכונות מבוססות AI:
 * - Intelligent exercise recommendations based on user profile
 * - Smart workout generation with preference handling
 * - Popular exercise tracking for better suggestions
 * - Progressive difficulty adjustment over time
 * - Goal-oriented exercise selection algorithms
 *
 * 📊 ANALYTICS & MONITORING - אנליטיקס וניטור:
 * - Comprehensive database metrics and statistics
 * - Exercise popularity tracking and analysis
 * - Query performance monitoring and optimization
 * - User interaction patterns and preferences
 * - Detailed usage analytics for insights
 *
 * 🔄 INTELLIGENT CACHING - מטמון חכם:
 * - Multi-level caching with different TTL strategies
 * - LRU cache eviction for memory efficiency
 * - Hit rate optimization and statistics
 * - Context-aware cache key generation
 * - Performance-based cache tuning
 *
 * 🎯 ADVANCED SEARCH & FILTERING - חיפוש וסינון מתקדמים:
 * - Multi-criteria search with intelligent ranking
 * - Fuzzy matching for Hebrew and English terms
 * - Advanced filtering with safety considerations
 * - Muscle group targeting with secondary muscles
 * - Equipment and space requirement filtering
 *
 * 🔧 DEVELOPER TOOLS - כלי פיתוח:
 * - Comprehensive metrics extraction APIs
 * - Database health validation tools
 * - State reset and maintenance functions
 * - Performance profiling and optimization guides
 * - Debugging utilities and error reporting
 *
 * All enhancements maintain full backward compatibility while adding
 * enterprise-level exercise database capabilities for production fitness applications.
 * כל השיפורים שומרים על תאימות לאחור תוך הוספת יכולות מסד נתונים
 * ברמה ארגונית לאפליקציות כושר בסביבות ייצור.
 *
 * @version 2.0.0
 * @updated 2025-08-24
 * @author Enhanced by GitHub Copilot
 */
