import React, { useEffect } from "react";
import { ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type AnimatedViewProps = {
  visible: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
  duration?: number;
};

export default function AnimatedView({
  visible,
  children,
  style,
  duration = 220,
}: AnimatedViewProps) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration });
    } else {
      opacity.value = 0; // instant reset
    }
  }, [visible, duration, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>
      {visible ? children : null}
    </Animated.View>
  );
}
