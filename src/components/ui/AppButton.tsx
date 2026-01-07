// AppButton.tsx
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

type AppButtonProps = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  rippleColor?: string;
};

export const AppButton: React.FC<AppButtonProps> = ({
  label,
  onPress,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  rippleColor = "#00000022",
}) => {
  const isDisabled = disabled || loading;

  return (
    <View
      style={[
        {
          borderRadius: 12,
          overflow: "hidden",
          backgroundColor: isDisabled ? "#E5E7EB" : "#ffffff",
        },
        style,
      ]}
    >
      <Pressable
        android_ripple={{ color: rippleColor, borderless: false }}
        onPress={isDisabled ? undefined : onPress}
        style={({ pressed }) => [
          {
            paddingHorizontal: 16,
            paddingVertical: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            opacity: pressed && !isDisabled ? 0.9 : 1,
          },
        ]}
      >
        {leftIcon && !loading && <View>{leftIcon}</View>}

        {loading ? (
          <ActivityIndicator color="#111827" />
        ) : (
          <Text
            style={[
              {
                fontSize: 16,
                fontWeight: "600",
                color: isDisabled ? "#9CA3AF" : "#111827",
              },
              textStyle,
            ]}
          >
            {label}
          </Text>
        )}

        {rightIcon && !loading && <View>{rightIcon}</View>}
      </Pressable>
    </View>
  );
};
