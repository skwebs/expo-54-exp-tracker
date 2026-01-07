import { cn } from "@/lib/cn";
import React, { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type Props = {
  label: string;
  value?: string;
  onChangeText?: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  className?: string;
  size?: "default" | "small" | "medium" | "large";
};

export function FloatingInput({
  label,
  value,
  autoCapitalize = "none",
  keyboardType = "default",
  onChangeText,
  error,
  secureTextEntry,
  className,
  size = "default",
  ...props
}: Props) {
  const [focused, setFocused] = useState(false);
  const progress = useSharedValue(value ? 1 : 0);
  const INPUT_HEIGHT = size === "default" ? 50 : 44;
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

  const borderWidthClass = focused || error ? "border-2" : "border";

  return (
    <View className="">
      {/* CONTAINER (NO BORDER LOGIC HERE) */}
      <View className="relative rounded-xl" style={{ height: INPUT_HEIGHT }}>
        {/* SINGLE INNER BORDER (ALWAYS INSIDE) */}
        <View
          pointerEvents="none"
          className={cn(
            "absolute inset-0 rounded-xl",
            borderWidthClass,
            borderColor,
          )}
        />

        {/* FLOATING LABEL */}
        <Animated.Text
          style={labelStyle}
          className={cn(
            "absolute left-4 bg-white px-1 text-base",
            error
              ? "text-red-500"
              : focused
                ? "text-blue-600"
                : "text-zinc-500",
          )}
        >
          {label}
        </Animated.Text>

        {/* INPUT */}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="h-full rounded-xl px-5 text-base text-black"
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
        />
      </View>

      {/* ERROR TEXT (RESERVED SPACE) */}
      <Text className="mt-1 min-h-[18px] text-xs text-red-500">
        {error ?? ""}
      </Text>
    </View>
  );
}
