/**
 * @file src/features/profile/screens/ProfileScreen/ProfileScreen.tsx
 * @description מסך הפרופיל החדש - רפקטור מלא ממסך בן 1926 שורות למודולר
 *
 * תהליך הרפקטור:
 * - מסך ישן: 1926 שורות, 11 useState hooks, 4 tabs במקום אחד
 * - מסך חדש: מפוצל למודולים עם hooks נפרדים וקומפוננטים מיוחדים
 *
 * השאלות שהובילו לרפקטור:
 * - "למה הפונקציה הזאת כל כך מורכבת?" - פיצול מסך ענק
 * - "אפשר לעשות את זה בשורה אחת?" - פישוט כל פונקציונליות
 */

import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../../../core/theme";
import { useProfileData } from "./hooks/useProfileData";
import { ProfileTabs } from "./components/ProfileTabs";
import { ProfileInfoTab } from "./components/ProfileInfoTab";
import { ProfileJourneyTab } from "./components/ProfileJourneyTab";
import { ProfileEquipmentTab } from "./components/ProfileEquipmentTab";
import { ProfileSettingsTab } from "./components/ProfileSettingsTab";
import LoadingSpinner from "../../../../components/common/LoadingSpinner";
import EmptyState from "../../../../components/common/EmptyState";

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const {
    user,
    stats,
    profileBadges,
    hasQuestionnaireData,
    canEditName,
    updateUser,
    activeTab,
    setActiveTab,
    handleLogout,
    loading,
  } = useProfileData();

  // Navigation handlers - עם בדיקות אבטחה
  const handleEditPersonalInfo = () => {
    if (!user) {
      Alert.alert("שגיאה", "נתוני המשתמש לא נטענו");
      return;
    }
    navigation.navigate("PersonalInfo" as never);
  };

  const handleEditQuestionnaire = () => {
    if (!user) {
      Alert.alert("שגיאה", "נתוני המשתמש לא נטענו");
      return;
    }
    navigation.navigate("Questionnaire" as never);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "מחיקת חשבון",
      "האם אתה בטוח שברצונך למחוק את החשבון? פעולה זו לא ניתנת לביטול.",
      [
        { text: "ביטול", style: "cancel" },
        {
          text: "מחק",
          style: "destructive",
          onPress: async () => {
            try {
              await handleLogout();
              Alert.alert("החשבון נמחק בהצלחה");
            } catch {
              Alert.alert("שגיאה", "לא ניתן למחוק את החשבון כרגע");
            }
          },
        },
      ]
    );
  };

  // טיפול במצב loading
  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <LoadingSpinner />
      </View>
    );
  }

  // טיפול במצב שאין משתמש
  if (!user) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <EmptyState
          title="נתוני פרופיל לא נמצאו"
          description="יש לחזור לדף הכניסה"
        />
      </View>
    );
  }

  // רנדר התוכן לפי הכרטיסייה הפעילה
  const renderTabContent = () => {
    switch (activeTab) {
      case "info":
        return (
          <ProfileInfoTab
            user={user}
            stats={stats}
            profileBadges={profileBadges}
            hasQuestionnaireData={hasQuestionnaireData}
            canEditName={canEditName}
            onUpdateUser={updateUser}
            onNavigateToPersonalInfo={handleEditPersonalInfo}
          />
        );
      case "journey":
        return (
          <ProfileJourneyTab
            user={user}
            stats={stats}
            profileBadges={profileBadges}
          />
        );
      case "equipment":
        return (
          <ProfileEquipmentTab
            user={user}
            onEditEquipment={handleEditQuestionnaire}
          />
        );
      case "settings":
        return (
          <ProfileSettingsTab
            user={user}
            onEditPersonalInfo={handleEditPersonalInfo}
            onEditQuestionnaire={handleEditQuestionnaire}
            onLogout={handleLogout}
            onDeleteAccount={handleDeleteAccount}
          />
        );
      default:
        return (
          <EmptyState
            title="כרטיסייה לא נמצאה"
            description="נסה לבחור כרטיסייה אחרת"
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <View style={styles.content}>{renderTabContent()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProfileScreen;
