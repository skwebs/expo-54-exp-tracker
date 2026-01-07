// AppRippleButton2.tsx
import React from "react";
import { ActivityIndicator, Pressable, ViewStyle } from "react-native";

type AppRippleButton2Props = {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle | ViewStyle[];
  rippleColor?: string;
  children: React.ReactNode;
  className?: string;
  borderless?: boolean;
};

export const AppRippleButton2: React.FC<AppRippleButton2Props> = ({
  onPress,
  loading = false,
  disabled = false,
  style,
  rippleColor = "#00000022",
  children,
  className,
  borderless = false,
}) => {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      android_ripple={{
        color: rippleColor,
        borderless: borderless,
        foreground: true,
      }}
      disabled={isDisabled}
      style={style}
      onPress={isDisabled ? undefined : onPress}
      className={className}
      // style={({ pressed }) => [
      //   {
      //     paddingHorizontal: 16,
      //     paddingVertical: 12,
      //     alignItems: "center",
      //     opacity: pressed && !isDisabled ? 0.9 : 1,
      //   },
      // ]}
    >
      {loading ? <ActivityIndicator color="#111827" /> : children}
    </Pressable>
  );
};
