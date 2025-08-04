/**
 * @file src/components/common/InputField.tsx
 * @brief שדה קלט אוניברסלי עם תמיכה מלאה ב-RTL, נגישות, ו-validation
 * @brief Universal input field with full RTL support, accessibility, and validation
 * @dependencies Ionicons, theme, useState, TouchableOpacity
 * @notes תמיכה מלאה ב-RTL, אייקונים, toggle סיסמה, validation, ונגישות מתקדמת
 * @notes Full RTL support, icons, password toggle, validation, and advanced accessibility
 * @updated 2025-08-04 אופטימיזציה עם React.memo, שיפורי נגישות ותמיכת variants
 */

// src/components/common/InputField.tsx
import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../styles/theme";

interface InputFieldProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  editable?: boolean;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  showPasswordToggle?: boolean;
  required?: boolean;
  style?: ViewStyle;
  // 🆕 שיפורים חדשים // New enhancements
  variant?: "default" | "outlined" | "filled";
  size?: "small" | "medium" | "large";
  testID?: string;
  successMessage?: string;
}

const InputField: React.FC<InputFieldProps> = React.memo(
  ({
    label,
    placeholder,
    value,
    onChangeText,
    onBlur,
    onFocus,
    secureTextEntry = false,
    keyboardType = "default",
    autoCapitalize = "sentences",
    multiline = false,
    numberOfLines = 1,
    maxLength,
    editable = true,
    error,
    leftIcon,
    rightIcon,
    onRightIconPress,
    showPasswordToggle = false,
    required = false,
    style,
    variant = "default",
    size = "medium",
    testID = "input-field",
    successMessage,
  }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] =
      useState(!secureTextEntry);

    // 🎯 פונקציות מחושבות עם useCallback לאופטימיזציה
    // Computed functions with useCallback for optimization
    const handleFocus = React.useCallback(() => {
      setIsFocused(true);
      onFocus?.();
    }, [onFocus]);

    const handleBlur = React.useCallback(() => {
      setIsFocused(false);
      onBlur?.();
    }, [onBlur]);

    const togglePasswordVisibility = React.useCallback(() => {
      setIsPasswordVisible((prev) => !prev);
    }, []);

    // 🎨 חישוב סגנונות דינמיים
    // Dynamic styling calculation
    const { containerStyle, inputStyle } = React.useMemo(() => {
      const hasError = !!error;
      const hasSuccess = !!successMessage && !hasError;

      // Container styles
      const baseContainerStyle = [styles.container] as any[];

      // Variant styles
      switch (variant) {
        case "outlined":
          baseContainerStyle.push(styles.containerOutlined);
          break;
        case "filled":
          baseContainerStyle.push(styles.containerFilled);
          break;
        default:
          // default variant - no additional styles
          break;
      }

      // Size styles
      const sizeStyle =
        size === "small"
          ? styles.containerSmall
          : size === "large"
            ? styles.containerLarge
            : {}; // medium is default
      if (sizeStyle) baseContainerStyle.push(sizeStyle);

      // State styles
      if (isFocused) baseContainerStyle.push(styles.containerFocused);
      if (hasError) baseContainerStyle.push(styles.containerError);
      if (hasSuccess) baseContainerStyle.push(styles.containerSuccess);
      if (!editable) baseContainerStyle.push(styles.containerDisabled);

      // Input styles
      const baseInputStyle = [styles.input] as any[];
      if (multiline) baseInputStyle.push(styles.inputMultiline);
      if (leftIcon) baseInputStyle.push(styles.inputWithLeftIcon);
      if (rightIcon || showPasswordToggle)
        baseInputStyle.push(styles.inputWithRightIcon);

      // Size-specific input styles
      if (size === "small") baseInputStyle.push(styles.inputSmall);
      if (size === "large") baseInputStyle.push(styles.inputLarge);

      return {
        containerStyle: baseContainerStyle,
        inputStyle: baseInputStyle,
      };
    }, [
      variant,
      size,
      isFocused,
      error,
      successMessage,
      editable,
      multiline,
      leftIcon,
      rightIcon,
      showPasswordToggle,
    ]);

    const hasError = !!error;
    const hasSuccess = !!successMessage && !hasError;

    return (
      <View style={[styles.wrapper, style]}>
        {label && (
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        )}

        <View style={containerStyle}>
          {leftIcon && (
            <Ionicons
              name={leftIcon}
              size={size === "small" ? 18 : size === "large" ? 24 : 20}
              color={
                hasError
                  ? theme.colors.error
                  : hasSuccess
                    ? theme.colors.success
                    : theme.colors.textSecondary
              }
              style={styles.leftIcon}
            />
          )}

          <TextInput
            style={inputStyle}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.textTertiary}
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            secureTextEntry={
              showPasswordToggle ? !isPasswordVisible : secureTextEntry
            }
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            multiline={multiline}
            numberOfLines={numberOfLines}
            maxLength={maxLength}
            editable={editable}
            textAlign={theme.isRTL ? "right" : "left"}
            accessible={true}
            accessibilityLabel={label || placeholder || "שדה קלט"}
            accessibilityHint={
              hasError
                ? `שגיאה: ${error}`
                : hasSuccess
                  ? `הצלחה: ${successMessage}`
                  : undefined
            }
            accessibilityState={{
              disabled: !editable,
            }}
            testID={`${testID}-input`}
          />

          {showPasswordToggle && (
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={styles.rightIcon}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={
                isPasswordVisible ? "הסתר סיסמה" : "הצג סיסמה"
              }
              accessibilityHint="מחליף בין הצגה להסתרה של הסיסמה"
              testID={`${testID}-password-toggle`}
            >
              <Ionicons
                name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
                size={size === "small" ? 18 : size === "large" ? 24 : 20}
                color={theme.colors.textSecondary}
                accessible={false}
              />
            </TouchableOpacity>
          )}

          {rightIcon && !showPasswordToggle && (
            <TouchableOpacity
              onPress={onRightIconPress}
              style={styles.rightIcon}
              disabled={!onRightIconPress}
              accessible={!!onRightIconPress}
              accessibilityRole="button"
              accessibilityLabel={`כפתור ${rightIcon}`}
              testID={`${testID}-right-icon`}
            >
              <Ionicons
                name={rightIcon}
                size={size === "small" ? 18 : size === "large" ? 24 : 20}
                color={theme.colors.textSecondary}
                accessible={false}
              />
            </TouchableOpacity>
          )}
        </View>

        {hasError && <Text style={styles.errorText}>{error}</Text>}
        {hasSuccess && <Text style={styles.successText}>{successMessage}</Text>}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  required: {
    color: theme.colors.error,
  },

  // 🎨 Container variants - variants של קונטיינר
  container: {
    flexDirection: theme.isRTL ? "row-reverse" : "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    paddingHorizontal: theme.spacing.md,
  },
  containerOutlined: {
    backgroundColor: "transparent",
    borderWidth: 2,
  },
  containerFilled: {
    backgroundColor: theme.colors.backgroundAlt,
    borderWidth: 0,
  },
  containerSmall: {
    paddingHorizontal: theme.spacing.sm,
  },
  containerLarge: {
    paddingHorizontal: theme.spacing.lg,
  },
  containerFocused: {
    borderColor: theme.colors.primary,
  },
  containerError: {
    borderColor: theme.colors.error,
  },
  containerSuccess: {
    borderColor: theme.colors.success,
  },
  containerDisabled: {
    backgroundColor: theme.colors.backgroundAlt,
    opacity: 0.6,
  },

  // 📝 Input variants - variants של קלט
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    paddingVertical: theme.spacing.md,
    minHeight: 48,
  },
  inputSmall: {
    fontSize: 14,
    paddingVertical: theme.spacing.sm,
    minHeight: 40,
  },
  inputLarge: {
    fontSize: 18,
    paddingVertical: theme.spacing.lg,
    minHeight: 56,
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: "top",
    paddingTop: theme.spacing.md,
  },
  inputWithLeftIcon: {
    marginLeft: theme.isRTL ? 0 : theme.spacing.sm,
    marginRight: theme.isRTL ? theme.spacing.sm : 0,
  },
  inputWithRightIcon: {
    marginRight: theme.isRTL ? 0 : theme.spacing.sm,
    marginLeft: theme.isRTL ? theme.spacing.sm : 0,
  },

  // 🎯 Icon styles - סגנונות אייקונים
  leftIcon: {
    marginRight: theme.isRTL ? 0 : theme.spacing.sm,
    marginLeft: theme.isRTL ? theme.spacing.sm : 0,
  },
  rightIcon: {
    padding: theme.spacing.xs,
    marginLeft: theme.isRTL ? 0 : theme.spacing.sm,
    marginRight: theme.isRTL ? theme.spacing.sm : 0,
  },

  // 📄 Message styles - סגנונות הודעות
  errorText: {
    fontSize: 12,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
  successText: {
    fontSize: 12,
    color: theme.colors.success,
    marginTop: theme.spacing.xs,
  },
});

// 🔧 תמיכה ב-displayName לדיבוג
// displayName support for debugging
InputField.displayName = "InputField";

export default InputField;
