import { cn } from "@/lib/cn";
import React, { forwardRef, useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type InputSize = "sm" | "md" | "lg";

type Props = {
  label: string;
  value?: string;
  onChangeText?: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  returnKeyType?: "done" | "next" | "go" | "send";
  onSubmitEditing?: () => void;
  disabled?: boolean;
  size?: InputSize;

  /** Icons */
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;

  className?: string;
  blurOnSubmit?: boolean;

  textContentType?:
    | "none"
    | "URL"
    | "username"
    | "password"
    | "newPassword"
    | "oneTimeCode"
    | "emailAddress";
};

const HEIGHT_MAP: Record<InputSize, number> = {
  sm: 42,
  md: 50,
  lg: 56,
};

export const FloatingLabelInput = forwardRef<TextInput, Props>(
  (
    {
      label,
      value,
      onChangeText,
      error,
      secureTextEntry,
      autoCapitalize = "none",
      autoCorrect = false,
      keyboardType = "default",
      returnKeyType = "done",
      onSubmitEditing,
      disabled = false,
      size = "md",
      startIcon,
      endIcon,
      className,
      textContentType,
    },
    ref,
  ) => {
    const [focused, setFocused] = useState(false);
    const progress = useSharedValue(value ? 1 : 0);
    const INPUT_HEIGHT = HEIGHT_MAP[size];

    useEffect(() => {
      progress.value = withTiming(focused || value ? 1 : 0, {
        duration: 180,
      });
    }, [focused, progress, value]);

    const labelStyle = useAnimatedStyle(() => ({
      transform: [
        {
          translateY: interpolate(
            progress.value,
            [0, 1],
            [INPUT_HEIGHT / 2 - 12, -12],
          ),
        },
        {
          scale: interpolate(progress.value, [0, 1], [1, 0.85]),
        },
      ],
    }));

    const borderColor = error
      ? "border-red-500"
      : focused
        ? "border-blue-600"
        : "border-zinc-300";

    const borderWidth = focused || error ? "border-2" : "border";

    return (
      <View className={cn("w-full pt-3", className)}>
        <View className="relative rounded-xl" style={{ height: INPUT_HEIGHT }}>
          {/* Border */}
          <View
            pointerEvents="none"
            className={cn(
              "absolute inset-0 rounded-xl",
              borderWidth,
              borderColor,
              disabled && "border-zinc-200",
            )}
          />

          {/* Floating Label */}
          <Animated.Text
            style={labelStyle}
            className={cn(
              "absolute left-4 bg-white px-1 text-base",
              error
                ? "text-red-500"
                : focused
                  ? "text-blue-600"
                  : "text-zinc-500",
              disabled && "text-zinc-400",
            )}
          >
            {label}
          </Animated.Text>

          {/* Input Row */}
          <View className="h-full flex-row items-center">
            {startIcon && <View className="mr-5">{startIcon}</View>}

            <TextInput
              ref={ref}
              value={value}
              onChangeText={onChangeText}
              secureTextEntry={secureTextEntry}
              autoCapitalize={autoCapitalize}
              keyboardType={keyboardType}
              returnKeyType={returnKeyType}
              onSubmitEditing={onSubmitEditing}
              editable={!disabled}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              accessibilityLabel={label}
              className={cn(
                "flex-1 px-4 text-base text-black",
                disabled && "text-zinc-400",
              )}
              textContentType={textContentType}
              autoCorrect={autoCorrect}
            />

            {endIcon && <View className="ml-2">{endIcon}</View>}
          </View>
        </View>

        {/* Error */}
        <Text className="mt-1 min-h-[18px] text-xs text-red-500">
          {error ?? ""}
        </Text>
      </View>
    );
  },
);

FloatingLabelInput.displayName = "FloatingLabelInput";
