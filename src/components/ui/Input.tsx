import React, { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type Props = {
  value?: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
};

const INPUT_HEIGHT = 56;

export function Input({
  value,
  placeholder,
  onChangeText,
  error,
  secureTextEntry,
}: Props) {
  const [focused, setFocused] = useState(false);

  /** border animation */
  const borderProgress = useSharedValue(0);

  useEffect(() => {
    borderProgress.value = withTiming(error ? 2 : focused ? 1 : 0, {
      duration: 180,
    });
  }, [focused, error, borderProgress]);

  /** animated border style */
  const borderStyle = useAnimatedStyle(() => ({
    borderWidth: interpolate(borderProgress.value, [0, 1, 2], [1, 2, 2]),
    borderColor: interpolateColor(
      borderProgress.value,
      [0, 1, 2],
      ["#d4d4d8", "#2563eb", "#ef4444"], // default → focus → error
    ),
  }));

  return (
    <View>
      <View className="relative rounded-xl" style={{ height: INPUT_HEIGHT }}>
        {/* Animated border */}
        <Animated.View
          pointerEvents="none"
          className="absolute inset-0 rounded-xl"
          style={borderStyle}
        />

        {/* Input */}
        <TextInput
          value={value}
          placeholder={placeholder}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="h-full rounded-xl px-5 text-base text-black"
          placeholderTextColor="#71717a" // zinc-500
        />
      </View>

      {/* Error message (fixed height → no layout shift) */}
      <Text className="mt-1 min-h-[18px] text-xs text-red-500">
        {error ?? ""}
      </Text>
    </View>
  );
}

// import { cn } from "@/lib/cn";
// import { Ionicons } from "@expo/vector-icons";
// import React, { useState } from "react";
// import {
//   ActivityIndicator,
//   Pressable,
//   Text,
//   TextInput,
//   View,
// } from "react-native";

// type InputVariant = "outline" | "filled";

// type InputProps = {
//   value?: string;
//   onChangeText?: (text: string) => void;
//   placeholder?: string;
//   error?: string;
//   secureTextEntry?: boolean;
//   keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
//   disabled?: boolean;
//   loading?: boolean;
//   leftIcon?: keyof typeof Ionicons.glyphMap;
//   variant?: InputVariant;
//   className?: string;
// };

// export function Input({
//   value,
//   onChangeText,
//   placeholder,
//   error,
//   secureTextEntry,
//   keyboardType = "default",
//   disabled = false,
//   loading = false,
//   leftIcon,
//   variant = "outline",
//   className,
// }: InputProps) {
//   const [focused, setFocused] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   return (
//     <View className="mb-4">
//       {/* Input Container */}
//       <View
//         className={cn(
//           "h-14 flex-row items-center rounded-xl px-4",
//           variant === "outline" && "border",
//           variant === "filled" && "bg-gray-100",
//           error
//             ? "border-red-500"
//             : focused
//               ? "border-blue-500"
//               : "border-gray-300",
//           disabled && "opacity-50",
//           className,
//         )}
//       >
//         {/* Left Icon */}
//         {leftIcon && (
//           <Ionicons name={leftIcon} size={20} className="mr-3 text-gray-500" />
//         )}

//         {/* Text Input */}
//         <TextInput
//           value={value}
//           onChangeText={onChangeText}
//           placeholder={placeholder}
//           secureTextEntry={secureTextEntry && !showPassword}
//           keyboardType={keyboardType}
//           editable={!disabled && !loading}
//           onFocus={() => setFocused(true)}
//           onBlur={() => setFocused(false)}
//           placeholderTextColor="#9CA3AF"
//           className="flex-1 text-base text-gray-900"
//         />

//         {/* Loading */}
//         {loading && <ActivityIndicator size="small" className="ml-2" />}

//         {/* Password Toggle */}
//         {secureTextEntry && !loading && (
//           <Pressable onPress={() => setShowPassword((p) => !p)}>
//             <Ionicons
//               name={showPassword ? "eye-off-outline" : "eye-outline"}
//               size={20}
//               className="ml-2 text-gray-500"
//             />
//           </Pressable>
//         )}
//       </View>

//       {/* Error Message (no layout shift) */}
//       <View className="mt-1 min-h-[18px]">
//         {error && <Text className="text-xs text-red-500">{error}</Text>}
//       </View>
//     </View>
//   );
// }
