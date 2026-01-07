import { cn } from "@/lib/cn";
import { theme } from "@/lib/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type Variant = "outlined" | "filled" | "underlined";
type Size = "sm" | "md" | "lg";

type AppInputProps = {
  label: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onBlur?: () => void;

  error?: string;
  helperText?: string;

  startIcon?: keyof typeof Ionicons.glyphMap;
  endIcon?: keyof typeof Ionicons.glyphMap;

  secureTextEntry?: boolean;
  clearable?: boolean;

  disabled?: boolean;
  readOnly?: boolean;

  variant?: Variant;
  size?: Size;

  keyboardType?: any;
  autoCapitalize?: any;
};

const HEIGHT: Record<Size, number> = {
  sm: 44,
  md: 56,
  lg: 64,
};

export function AppInput({
  label,
  value,
  onChangeText,
  onBlur,
  error,
  helperText,
  startIcon,
  endIcon,
  secureTextEntry,
  clearable,
  disabled,
  readOnly,
  variant = "outlined",
  size = "md",
  keyboardType,
  autoCapitalize = "none",
}: AppInputProps) {
  const [focused, setFocused] = useState(false);
  const [secure, setSecure] = useState(secureTextEntry);

  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(focused || value ? 1 : 0, { duration: 180 });
  }, [focused, value]);

  const labelStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          progress.value,
          [0, 1],
          [HEIGHT[size] / 2 - 10, 6],
        ),
      },
    ],
    fontSize: interpolate(progress.value, [0, 1], [16, 12]),
  }));

  const borderColor = error
    ? theme.colors.error
    : focused
      ? theme.colors.primary
      : theme.colors.border;

  return (
    <View className="mb-4">
      <View
        style={{
          height: HEIGHT[size],
          borderColor,
          backgroundColor: variant === "filled" ? "#f4f4f5" : "transparent",
          borderWidth: variant === "underlined" ? 0 : 1,
          borderBottomWidth: variant === "underlined" ? 1 : 1,
        }}
        className={cn(
          "relative flex-row items-center rounded-xl px-3",
          disabled && "opacity-50",
        )}
      >
        {startIcon && (
          <Ionicons
            name={startIcon}
            size={20}
            color={theme.colors.muted}
            style={{ marginRight: 6 }}
          />
        )}

        <TextInput
          value={value}
          editable={!disabled && !readOnly}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            onBlur?.();
          }}
          secureTextEntry={secure}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          className="flex-1 text-base"
          style={{ color: theme.colors.text }}
        />

        {/* Clear */}
        {clearable && !!value && !secureTextEntry && (
          <Pressable onPress={() => onChangeText?.("")}>
            <Ionicons name="close-circle" size={18} color="#a1a1aa" />
          </Pressable>
        )}

        {/* Password toggle / end icon */}
        {(secureTextEntry || endIcon) && (
          <Pressable
            onPress={secureTextEntry ? () => setSecure((p) => !p) : undefined}
          >
            <Ionicons
              name={
                secureTextEntry
                  ? secure
                    ? "eye-off-outline"
                    : "eye-outline"
                  : endIcon!
              }
              size={20}
              color={theme.colors.muted}
              style={{ marginLeft: 6 }}
            />
          </Pressable>
        )}

        {/* Floating Label */}
        <Animated.Text
          style={[
            labelStyle,
            {
              color: error
                ? theme.colors.error
                : focused
                  ? theme.colors.primary
                  : theme.colors.muted,
            },
          ]}
          className="absolute left-3 bg-white px-1"
        >
          {label}
        </Animated.Text>
      </View>

      {/* Helper / Error */}
      {(error || helperText) && (
        <Text
          className="mt-1 text-xs"
          style={{ color: error ? theme.colors.error : theme.colors.muted }}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
}
