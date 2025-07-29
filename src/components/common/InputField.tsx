// src/components/common/InputField.tsx
import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
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
  style?: any;
}

const InputField: React.FC<InputFieldProps> = ({
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
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const hasError = !!error;
  const containerStyle = [
    styles.container,
    isFocused && styles.containerFocused,
    hasError && styles.containerError,
    !editable && styles.containerDisabled,
  ];

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
            size={20}
            color={hasError ? theme.colors.error : theme.colors.textSecondary}
            style={styles.leftIcon}
          />
        )}

        <TextInput
          style={[
            styles.input,
            multiline && styles.inputMultiline,
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || showPasswordToggle) && styles.inputWithRightIcon,
          ]}
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
        />

        {showPasswordToggle && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.rightIcon}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        )}

        {rightIcon && !showPasswordToggle && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.rightIcon}
            disabled={!onRightIconPress}
          >
            <Ionicons
              name={rightIcon}
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {hasError && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

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
  container: {
    flexDirection: theme.isRTL ? "row-reverse" : "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    paddingHorizontal: theme.spacing.md,
  },
  containerFocused: {
    borderColor: theme.colors.primary,
  },
  containerError: {
    borderColor: theme.colors.error,
  },
  containerDisabled: {
    backgroundColor: theme.colors.backgroundAlt,
    opacity: 0.6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    paddingVertical: theme.spacing.md,
    minHeight: 48,
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
  leftIcon: {
    marginRight: theme.isRTL ? 0 : theme.spacing.sm,
    marginLeft: theme.isRTL ? theme.spacing.sm : 0,
  },
  rightIcon: {
    padding: theme.spacing.xs,
    marginLeft: theme.isRTL ? 0 : theme.spacing.sm,
    marginRight: theme.isRTL ? theme.spacing.sm : 0,
  },
  errorText: {
    fontSize: 12,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
});

export default InputField;
