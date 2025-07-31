/**
 * @file src/components/ui/ScreenContainer.tsx
 * @brief מיכל מסך אוניברסלי עם header, scroll, ו-safe area
 * @dependencies theme, SafeAreaView, KeyboardAvoidingView
 * @notes תומך ב-scroll, keyboard avoiding, pull to refresh
 * @recurring_errors וודא העברת header נכון, שימוש ב-scroll רק כשצריך
 */

import React, { ReactNode } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";
import BackButton from "../common/BackButton";

interface ScreenContainerProps {
  children: ReactNode;
  // Header options
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  headerRight?: ReactNode;

  // Container options
  scroll?: boolean;
  keyboardAvoiding?: boolean;
  safeArea?: boolean;

  // Scroll options
  refreshing?: boolean;
  onRefresh?: () => void;
  scrollContentStyle?: ViewStyle;

  // Style
  style?: ViewStyle;
  headerStyle?: ViewStyle;
  backgroundColor?: string;

  // Loading/Empty states
  loading?: boolean;
  empty?: boolean;
  emptyText?: string;
  emptyIcon?: keyof typeof Ionicons.glyphMap;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  title,
  showBackButton = false,
  onBackPress,
  headerRight,
  scroll = false,
  keyboardAvoiding = false,
  safeArea = true,
  refreshing,
  onRefresh,
  scrollContentStyle,
  style,
  headerStyle,
  backgroundColor = theme.colors.background,
  loading = false,
  empty = false,
  emptyText = "אין נתונים להצגה",
  emptyIcon = "folder-open-outline",
}) => {
  // רכיב Header // Header component
  const Header = () => {
    if (!title && !showBackButton && !headerRight) return null;

    return (
      <View style={[styles.header, headerStyle]}>
        {showBackButton && (
          <View style={styles.headerLeft}>
            <BackButton absolute={false} onPress={onBackPress} />
          </View>
        )}

        {title && (
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{title}</Text>
          </View>
        )}

        {headerRight && <View style={styles.headerRight}>{headerRight}</View>}
      </View>
    );
  };

  // תוכן ריק // Empty content
  const EmptyContent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name={emptyIcon} size={64} color={theme.colors.textTertiary} />
      <Text style={styles.emptyText}>{emptyText}</Text>
    </View>
  );

  // תוכן טעינה // Loading content
  const LoadingContent = () => (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>טוען...</Text>
    </View>
  );

  // תוכן ראשי // Main content
  const MainContent = () => {
    if (loading) return <LoadingContent />;
    if (empty) return <EmptyContent />;

    if (scroll) {
      return (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, scrollContentStyle]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={refreshing || false}
                onRefresh={onRefresh}
                tintColor={theme.colors.primary}
                colors={[theme.colors.primary]}
              />
            ) : undefined
          }
        >
          {children}
        </ScrollView>
      );
    }

    return <View style={styles.content}>{children}</View>;
  };

  // Container wrapper
  const Container = safeArea ? SafeAreaView : View;

  const content = (
    <Container style={[styles.container, { backgroundColor }, style]}>
      <Header />
      <MainContent />
    </Container>
  );

  // Keyboard avoiding wrapper
  if (keyboardAvoiding) {
    return (
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {content}
      </KeyboardAvoidingView>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  header: {
    flexDirection: theme.isRTL ? "row-reverse" : "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
    minHeight: 56,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: theme.spacing.md,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: theme.typography.title3.fontSize,
    fontWeight: theme.typography.title3.fontWeight,
    color: theme.colors.text,
    textAlign: "center",
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: theme.spacing.xl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xxl,
  },
  emptyText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.textSecondary,
  },
});

export default ScreenContainer;
