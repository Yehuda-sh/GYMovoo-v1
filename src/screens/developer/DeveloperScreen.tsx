/**
 * @file src/screens/developer/DeveloperScreen.tsx
 * @brief מסך פיתוח מקיף עם כלי בדיקה ודיבוג מותאמים לפרויקט
 * @dependencies React Native, Expo, userApi, userStore, BackButton, ConfirmationModal
 * @notes תומך ב-RTL ונגישות, משתמש בעקרונות מאוחדות (BackButton, ConfirmationModal)
 * @updates 2025-09-03: הוספת קבועי UI מרוכזים, הוספת מתודת create ל-userApi
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { userApi } from "../../services/api/userApi";
import { useUserStore } from "../../stores/userStore";
import { logger } from "../../utils/logger";
import { theme } from "../../styles/theme";
import { User } from "../../types";
import { fieldMapper } from "../../utils/fieldMapper";
import BackButton from "../../components/common/BackButton";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import UniversalButton from "../../components/ui/UniversalButton";
import { useAccessibilityAnnouncements } from "../../hooks/useAccessibilityAnnouncements";
import { ErrorBoundary } from "../../components/common/ErrorBoundary";

const DeveloperScreen = () => {
  const navigation = useNavigation();
  const { user, setUser } = useUserStore();
  const { announceSuccess, announceError, announceInfo } =
    useAccessibilityAnnouncements();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // קבועים למניעת קוד קשיח
  const QUESTIONNAIRE_MIN_ANSWERS = 10;
  const DEMO_USER_PREFIX = "משתמש דמו";
  const NO_QUESTIONNAIRE_PREFIX = "משתמש חסר שאלון";

  // קבועי UI
  const UI_TEXTS = {
    // כותרות
    SCREEN_TITLE: "מסך פיתוח",
    SYSTEM_INFO: "מידע מערכת",
    QUICK_ACTIONS: "פעולות מהירות",
    DEBUG_SETTINGS: "הגדרות Debug",
    USERS_LIST: "רשימת משתמשים",

    // מצבי חיבור
    CONNECTED: "מחובר",
    NOT_CONNECTED: "לא מחובר",
    NO_USER: "אין משתמש",

    // מצבי שאלון
    FULL_QUESTIONNAIRE: "שאלון מלא",
    REQUIRES_QUESTIONNAIRE: "דרוש שאלון",
    DEMO_TAG: "דמו",

    // מצבים כלליים
    NO_USERS: "אין משתמשים",
    LOADING: "טוען...",

    // כפתורי אישור
    CONFIRM: "אישור",
    CANCEL: "ביטול",
    DELETE_ALL: "מחק הכל",
    CONTINUE_TO_QUESTIONNAIRE: "המשך לשאלון",
  } as const;

  // פונקציית עזר לבדיקת מצב שאלון
  const checkQuestionnaireStatus = useCallback(
    (userItem: User) => {
      const answers = fieldMapper.getSmartAnswers(userItem);
      return Array.isArray(answers)
        ? answers.length >= QUESTIONNAIRE_MIN_ANSWERS
        : !!(
            answers && Object.keys(answers).length >= QUESTIONNAIRE_MIN_ANSWERS
          );
    },
    [QUESTIONNAIRE_MIN_ANSWERS]
  );

  // Modal state for ConfirmationModal
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    onConfirm: () => {},
    confirmText: "אישור",
    cancelText: "ביטול",
    destructive: false,
    singleButton: false,
  });

  // Debug settings
  const [debugSettings, setDebugSettings] = useState({
    verboseLogging: false,
    showPerformanceMetrics: false,
    mockNetworkDelay: false,
    bypassAuth: false,
  });

  // Helper function to show modal
  const showConfirmationModal = useCallback(
    (
      title: string,
      message: string,
      onConfirm: () => void,
      options: {
        confirmText?: string;
        cancelText?: string;
        destructive?: boolean;
        singleButton?: boolean;
      } = {}
    ) => {
      setModalConfig({
        title,
        message,
        onConfirm,
        confirmText: options.confirmText || UI_TEXTS.CONFIRM,
        cancelText: options.cancelText || UI_TEXTS.CANCEL,
        destructive: options.destructive || false,
        singleButton: options.singleButton || false,
      });
      setShowModal(true);
    },
    [UI_TEXTS.CONFIRM, UI_TEXTS.CANCEL]
  );

  // מידע מערכת
  const [systemInfo, setSystemInfo] = useState({
    storageKeys: 0,
    userCount: 0,
    currentUser: user?.name || UI_TEXTS.NO_USER,
    supabaseConnected: false,
  });

  // טעינת מידע מערכת
  const loadSystemInfo = useCallback(async () => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const supabaseTest = await userApi.health().catch(() => "fail");

      setSystemInfo({
        storageKeys: allKeys.length,
        userCount: users.length,
        currentUser: user?.name || UI_TEXTS.NO_USER,
        supabaseConnected: supabaseTest === "ok",
      });
    } catch (error) {
      logger.error("developer", "שגיאה בטעינת מידע מערכת", error);
    }
  }, [users.length, user?.name, UI_TEXTS.NO_USER]);

  useEffect(() => {
    loadSystemInfo();
  }, [loadSystemInfo]);

  // טעינת רשימת משתמשים
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const allUsers = await userApi.list();
      setUsers(allUsers || []);
      logger.info("developer", `נטענו ${allUsers?.length || 0} משתמשים`);
    } catch (error) {
      logger.error("developer", "שגיאה בטעינת משתמשים", error);
      showConfirmationModal(
        "שגיאה",
        "לא ניתן לטעון את רשימת המשתמשים",
        () => {},
        { singleButton: true }
      );
    } finally {
      setLoading(false);
    }
  }, [showConfirmationModal]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // רענון נתונים
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadUsers(), loadSystemInfo()]);
    setRefreshing(false);
  }, [loadUsers, loadSystemInfo]);

  // התחברות כמשתמש נבחר
  const loginAsUser = async (selectedUser: User) => {
    try {
      setLoading(true);
      logger.info("developer", `מתחבר כמשתמש: ${selectedUser.name}`);

      // 1) הגדרת המשתמש
      setUser(selectedUser);

      // 2) בדיקה אם למשתמש יש שאלון מלא
      const answers = fieldMapper.getSmartAnswers(selectedUser);
      const hasSmartQuestionnaire = checkQuestionnaireStatus(selectedUser);

      logger.info("developer", `בדיקת שאלון למשתמש ${selectedUser.name}`, {
        hasAnswers: !!answers,
        answersCount: answers ? Object.keys(answers).length : 0,
        hasSmartQuestionnaire,
      });

      if (hasSmartQuestionnaire) {
        // יש שאלון מלא - מעבר לאפליקציה הראשית
        logger.info("developer", "משתמש עם שאלון מלא - מעבר לאפליקציה ראשית");
        showConfirmationModal(
          "הצלחה",
          `התחברת בהצלחה כ-${selectedUser.name}`,
          () => navigation.navigate("MainApp"),
          { singleButton: true, confirmText: "אישור" }
        );
      } else {
        // אין שאלון מלא - מעבר לשאלון
        logger.info("developer", "משתמש ללא שאלון מלא - מעבר לשאלון");
        showConfirmationModal(
          "התחברות בהצלחה",
          `התחברת כ-${selectedUser.name}. כעת תעבור להשלמת השאלון.`,
          () => navigation.navigate("Questionnaire", {}),
          {
            singleButton: true,
            confirmText: UI_TEXTS.CONTINUE_TO_QUESTIONNAIRE,
          }
        );
      }
    } catch (error) {
      logger.error("developer", "שגיאה בהתחברות כמשתמש", error);
      showConfirmationModal("שגיאה", "לא ניתן להתחבר כמשתמש זה", () => {}, {
        singleButton: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // יצירת משתמש דמו
  const createDemoUser = async () => {
    try {
      setLoading(true);
      logger.info("developer", "יוצר משתמש דמו חדש");

      const testUser = {
        name: `${DEMO_USER_PREFIX} ${Date.now()}`,
        email: `demo${Date.now()}@test.com`,
        smartquestionnairedata: {
          answers: {
            gender: "male" as const,
            age: 30,
            fitnessLevel: "beginner" as const,
            goals: ["build_muscle"],
            equipment: ["dumbbells"],
            availability: ["3_days"],
          },
          completedAt: new Date().toISOString(),
          metadata: {
            completedAt: new Date().toISOString(),
            version: "1.0",
            source: "developer_tool",
          },
        },
      };

      const newUser = await userApi.create(testUser);
      logger.info("developer", `נוצר משתמש דמו: ${newUser.id}`);
      announceSuccess("משתמש דמו נוצר בהצלחה");
      showConfirmationModal("הצלחה", "משתמש דמו נוצר בהצלחה", () => {}, {
        singleButton: true,
      });
      await loadUsers();
    } catch (error) {
      logger.error("developer", "שגיאה ביצירת משתמש דמו", error);
      announceError("שגיאה ביצירת משתמש דמו");
      showConfirmationModal("שגיאה", "לא ניתן ליצור משתמש דמו", () => {}, {
        singleButton: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // יצירת משתמש ללא שאלון לבדיקה
  const createUserWithoutQuestionnaire = async () => {
    try {
      setLoading(true);
      logger.info("developer", "יוצר משתמש ללא שאלון לבדיקה");

      const testUser = {
        name: `${NO_QUESTIONNAIRE_PREFIX} ${Date.now()}`,
        email: `no-questionnaire${Date.now()}@test.com`,
        // ללא smartquestionnairedata - כדי לבדוק את הניווט לשאלון
      };

      const newUser = await userApi.create(testUser);
      logger.info("developer", `נוצר משתמש ללא שאלון: ${newUser.id}`);
      showConfirmationModal("הצלחה", "משתמש ללא שאלון נוצר בהצלחה", () => {}, {
        singleButton: true,
      });
      await loadUsers();
    } catch (error) {
      logger.error("developer", "שגיאה ביצירת משתמש ללא שאלון", error);
      showConfirmationModal(
        "שגיאה",
        "לא ניתן ליצור משתמש ללא שאלון",
        () => {},
        { singleButton: true }
      );
    } finally {
      setLoading(false);
    }
  };

  // איפוס נתונים מלא
  const resetAllData = async () => {
    showConfirmationModal(
      "איפוס נתונים",
      "האם אתה בטוח שברצונך למחוק את כל הנתונים? פעולה זו אינה הפיכה.",
      async () => {
        try {
          setLoading(true);
          logger.warn("developer", "מבצע איפוס נתונים מלא");

          // איפוס משתמש נוכחי
          setUser(null);

          // ניקוי AsyncStorage
          const allKeys = await AsyncStorage.getAllKeys();
          await AsyncStorage.multiRemove(allKeys);

          showConfirmationModal("הצלחה", "כל הנתונים נמחקו בהצלחה", () => {}, {
            singleButton: true,
          });
          await loadSystemInfo();
        } catch (error) {
          logger.error("developer", "שגיאה באיפוס נתונים", error);
          showConfirmationModal("שגיאה", "לא ניתן לאפס את הנתונים", () => {}, {
            singleButton: true,
          });
        } finally {
          setLoading(false);
        }
      },
      { destructive: true, confirmText: UI_TEXTS.DELETE_ALL }
    );
  };

  // עדכון הגדרות debug
  const updateDebugSetting = (
    key: keyof typeof debugSettings,
    value: boolean
  ) => {
    setDebugSettings((prev: typeof debugSettings) => ({
      ...prev,
      [key]: value,
    }));
    logger.info("developer", `עדכון הגדרת debug: ${String(key)} = ${value}`);
  };

  // בדיקת חיבור Supabase
  const testSupabaseConnection = async () => {
    try {
      setLoading(true);
      logger.info("developer", "בודק חיבור Supabase");

      const result = await userApi.health();
      announceInfo(
        result === "ok" ? "חיבור Supabase תקין" : "בעיה בחיבור Supabase"
      );
      showConfirmationModal(
        "חיבור Supabase",
        result === "ok" ? "חיבור תקין" : "בעיה בחיבור",
        () => {},
        { singleButton: true }
      );
    } catch (error) {
      logger.error("developer", "שגיאה בבדיקת Supabase", error);
      announceError("בעיה בחיבור ל-Supabase");
      showConfirmationModal("שגיאה", "בעיה בחיבור ל-Supabase", () => {}, {
        singleButton: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // רכיב כפתור debug עם טיפוס חזק
  const DebugToggle = ({
    label,
    value,
    onToggle,
  }: {
    label: string;
    value: boolean;
    onToggle: (value: boolean) => void;
  }) => (
    <View style={styles.debugRow}>
      <Text style={styles.debugLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
        thumbColor={theme.colors.background}
        accessibilityLabel={`${label} - ${value ? "מופעל" : "מכובה"}`}
        accessibilityRole="switch"
      />
    </View>
  );

  // כפתור פעולה משופר עם UniversalButton
  const ActionButton = ({
    title,
    onPress,
    icon,
    variant = "primary",
  }: {
    title: string;
    onPress: () => void;
    icon: string;
    variant?: "primary" | "secondary" | "danger" | "outline";
  }) => (
    <UniversalButton
      title={title}
      onPress={onPress}
      icon={icon as keyof typeof Ionicons.glyphMap}
      variant={variant}
      size="medium"
      fullWidth={false}
      style={styles.actionsGrid}
    />
  );

  return (
    <ErrorBoundary fallbackMessage="שגיאה במסך הפיתוח">
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <BackButton variant="minimal" />
          <Text style={styles.headerTitle}>{UI_TEXTS.SCREEN_TITLE}</Text>
          <TouchableOpacity onPress={onRefresh}>
            <Ionicons name="refresh" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* מידע מערכת */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{UI_TEXTS.SYSTEM_INFO}</Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>משתמש נוכחי</Text>
                <Text style={styles.infoValue}>{systemInfo.currentUser}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>כמות משתמשים</Text>
                <Text style={styles.infoValue}>{systemInfo.userCount}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>מפתחות באחסון</Text>
                <Text style={styles.infoValue}>{systemInfo.storageKeys}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Supabase</Text>
                <Text
                  style={[
                    styles.infoValue,
                    {
                      color: systemInfo.supabaseConnected
                        ? theme.colors.success
                        : theme.colors.error,
                    },
                  ]}
                >
                  {systemInfo.supabaseConnected
                    ? UI_TEXTS.CONNECTED
                    : UI_TEXTS.NOT_CONNECTED}
                </Text>
              </View>
            </View>
          </View>

          {/* פעולות מהירות */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{UI_TEXTS.QUICK_ACTIONS}</Text>
            <View style={styles.actionsGrid}>
              <ActionButton
                title="בדיקת Supabase"
                icon="cloud-outline"
                onPress={testSupabaseConnection}
              />
              <ActionButton
                title="יצירת משתמש דמו"
                icon="person-add-outline"
                onPress={createDemoUser}
              />
              <ActionButton
                title="משתמש ללא שאלון"
                icon="person-outline"
                onPress={createUserWithoutQuestionnaire}
                variant="outline"
              />
              <ActionButton
                title="איפוס נתונים"
                icon="trash-outline"
                onPress={resetAllData}
                variant="danger"
              />
            </View>
          </View>

          {/* הגדרות debug */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{UI_TEXTS.DEBUG_SETTINGS}</Text>
            <DebugToggle
              label="רישום מפורט"
              value={debugSettings.verboseLogging}
              onToggle={(value) => updateDebugSetting("verboseLogging", value)}
            />
            <DebugToggle
              label="מדדי ביצועים"
              value={debugSettings.showPerformanceMetrics}
              onToggle={(value) =>
                updateDebugSetting("showPerformanceMetrics", value)
              }
            />
            <DebugToggle
              label="סימולציית איחור רשת"
              value={debugSettings.mockNetworkDelay}
              onToggle={(value) =>
                updateDebugSetting("mockNetworkDelay", value)
              }
            />
            <DebugToggle
              label="עקיפת אימות"
              value={debugSettings.bypassAuth}
              onToggle={(value) => updateDebugSetting("bypassAuth", value)}
            />
          </View>

          {/* רשימת משתמשים */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {UI_TEXTS.USERS_LIST} ({users.length})
            </Text>
            {users.map((userItem) => {
              // בדיקת מצב השאלון לכל משתמש
              const hasSmartQuestionnaire = checkQuestionnaireStatus(userItem);
              return (
                <TouchableOpacity
                  key={userItem.id}
                  style={styles.userItem}
                  onPress={() => loginAsUser(userItem)}
                >
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{userItem.name}</Text>
                    <Text style={styles.userEmail}>{userItem.email}</Text>
                    <View style={styles.userTags}>
                      {userItem.name?.includes(DEMO_USER_PREFIX) && (
                        <Text style={styles.demoTag}>{UI_TEXTS.DEMO_TAG}</Text>
                      )}
                      <Text
                        style={[
                          styles.questionnaireTag,
                          {
                            backgroundColor: hasSmartQuestionnaire
                              ? theme.colors.success + "20"
                              : theme.colors.error + "20",
                            color: hasSmartQuestionnaire
                              ? theme.colors.success
                              : theme.colors.error,
                          },
                        ]}
                      >
                        {hasSmartQuestionnaire
                          ? UI_TEXTS.FULL_QUESTIONNAIRE
                          : UI_TEXTS.REQUIRES_QUESTIONNAIRE}
                      </Text>
                    </View>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={theme.colors.textSecondary}
                  />
                </TouchableOpacity>
              );
            })}

            {users.length === 0 && !loading && (
              <Text style={styles.emptyText}>{UI_TEXTS.NO_USERS}</Text>
            )}
          </View>
        </ScrollView>

        {loading && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContainer}>
              <LoadingSpinner
                size="large"
                color={theme.colors.primary}
                variant="pulse"
              />
              <Text style={styles.loadingText}>{UI_TEXTS.LOADING}</Text>
            </View>
          </View>
        )}

        {/* ConfirmationModal */}
        <ConfirmationModal
          visible={showModal}
          title={modalConfig.title}
          message={modalConfig.message}
          onClose={() => setShowModal(false)}
          onConfirm={() => {
            setShowModal(false);
            modalConfig.onConfirm();
          }}
          onCancel={() => setShowModal(false)}
          confirmText={modalConfig.confirmText}
          cancelText={modalConfig.cancelText}
          destructive={modalConfig.destructive}
          singleButton={modalConfig.singleButton}
        />
      </SafeAreaView>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: theme.colors.text,
  },
  content: {
    flex: 1,
  },
  section: {
    margin: 16,
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 12,
    textAlign: "right",
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  infoItem: {
    flex: 1,
    minWidth: "45%",
    padding: 12,
    backgroundColor: theme.colors.backgroundElevated,
    borderRadius: 8,
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
    textAlign: "center",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "center",
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  debugRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  debugLabel: {
    fontSize: 16,
    color: theme.colors.text,
    flex: 1,
    textAlign: "right",
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  userInfo: {
    flex: 1,
    alignItems: "flex-end",
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    textAlign: "right",
  },
  userEmail: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "right",
  },
  userTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 4,
    justifyContent: "flex-end",
  },
  demoTag: {
    fontSize: 12,
    color: theme.colors.primary,
    backgroundColor: theme.colors.backgroundElevated,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: "hidden",
  },
  questionnaireTag: {
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: "hidden",
  },
  emptyText: {
    textAlign: "center",
    color: theme.colors.textSecondary,
    fontSize: 16,
    paddingVertical: 20,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    backgroundColor: theme.colors.surface,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  loadingText: {
    color: theme.colors.text,
    fontSize: 16,
    marginTop: 10,
  },
});

export default DeveloperScreen;
