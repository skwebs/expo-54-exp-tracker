// AppRippleButton.tsx
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

type AppRippleButtonProps = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  rippleColor?: string;
};

export const AppRippleButton: React.FC<AppRippleButtonProps> = ({
  label,
  onPress,
  loading = false,
  disabled = false,
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
            alignItems: "center",
            opacity: pressed && !isDisabled ? 0.9 : 1,
          },
        ]}
      >
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
      </Pressable>
    </View>
  );
};
