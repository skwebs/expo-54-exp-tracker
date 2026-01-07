import { cn } from "@/lib/cn";
import React, { forwardRef } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
  ViewStyle,
} from "react-native";

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;

  /** Icons */
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;

  /** Layout */
  fullWidth?: boolean;
  style?: ViewStyle;

  className?: string;
};

export const PrimaryButton = forwardRef<View, Props>(
  (
    {
      title,
      onPress,
      disabled = false,
      loading = false,
      startIcon,
      endIcon,
      fullWidth = true,
      style,
      className,
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <Pressable
        ref={ref}
        onPress={onPress}
        disabled={isDisabled}
        android_ripple={{ color: "rgba(255,255,255,0.2)" }}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityState={{
          disabled: isDisabled,
          busy: loading,
        }}
        className={cn(
          "rounded-xl bg-blue-600 px-4 py-3",
          fullWidth && "w-full",
          isDisabled && "bg-blue-400",
          className,
        )}
        style={({ pressed }) => [
          {
            paddingVertical: 18,
            alignItems: "center",
            justifyContent: "center",
          },
          pressed &&
            !isDisabled && {
              opacity: 0.9,
              transform: [{ scale: 0.98 }],
            },
          style,
        ]}
      >
        <View className="flex-row items-center gap-2">
          {loading && <ActivityIndicator size="small" color="#fff" />}

          {!loading && startIcon}

          <Text
            className={cn(
              "text-center text-lg font-semibold text-white",
              loading && "opacity-80",
            )}
          >
            {title}
          </Text>

          {!loading && endIcon}
        </View>
      </Pressable>
    );
  },
);

PrimaryButton.displayName = "PrimaryButton";

// import { cn } from "@/lib/cn";
// import { Pressable, Text } from "react-native";

// type Props = {
//   title: string;
//   onPress: () => void;
//   disabled?: boolean;
// };

// export function PrimaryButton({ title, onPress, disabled }: Props) {
//   return (
//     <Pressable
//       onPress={onPress}
//       disabled={disabled}
//       android_ripple={{ color: "rgba(255,255,255,0.2)" }}
//       className={cn("rounded-xl bg-blue-600 py-5", disabled && "bg-blue-400")}
//       style={({ pressed }) => [
//         pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
//       ]}
//       accessibilityRole="button"
//     >
//       <Text className="text-center text-lg font-semibold text-white">
//         {title}
//       </Text>
//     </Pressable>
//   );
// }
