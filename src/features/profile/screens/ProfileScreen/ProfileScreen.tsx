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
import { View, StyleSheet } from "react-native";
import { theme } from "../../../../core/theme";
import { useProfileData } from "./hooks/useProfileData";
import { ProfileTabs } from "./components/ProfileTabs";
import { ProfileInfoTab } from "./components/ProfileInfoTab";
import { ProfileJourneyTab } from "./components/ProfileJourneyTab";
import { ProfileEquipmentTab } from "./components/ProfileEquipmentTab";
import { ProfileSettingsTab } from "./components/ProfileSettingsTab";

export const ProfileScreen: React.FC = () => {
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
  } = useProfileData();

  // פונקציות פעולה פשוטות - לא צריכות להיות ב-hook
  const handleEditPersonalInfo = () => {
    // TODO: Navigate to personal info screen
    console.log("Edit personal info");
  };

  const handleEditQuestionnaire = () => {
    // TODO: Navigate to questionnaire screen
    console.log("Edit questionnaire");
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion
    console.log("Delete account");
  };

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
        return null;
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
});
