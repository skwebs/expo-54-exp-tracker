// ==============================================================================================================
import { cn } from "@/lib/cn";
import React, { useEffect, type ReactNode } from "react";
import { Pressable, View, type ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  Modal,
  type ModalAnimationConfig,
  type ModalSwipeConfig,
} from "react-native-reanimated-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type AppBottomSheetModalProps = {
  visible: boolean;
  /** Called when the modal has fully opened (optional) */
  onOpen?: () => void;
  /** Called when the modal has fully closed (optional) */
  onClose?: () => void;

  contentContainerStyle?: ViewStyle;
  contentClassName?: string;

  animationConfig?: ModalAnimationConfig<any>;
  swipeConfig?: ModalSwipeConfig;

  /** Children will fade in AFTER modal is fully shown */
  children: ReactNode;
  contentWrapperClassName?: string;
  contentStyle?: ViewStyle;
  topSafeAreaInset?: boolean;
};

const defaultSlideDown: ModalAnimationConfig<"slide"> = {
  type: "slide",
  duration: 280,
  direction: "down",
};

const defaultSwipe: ModalSwipeConfig = {
  enabled: false,
};

const advancedSwipe: ModalSwipeConfig = {
  enabled: true,
  directions: ["down"], // Only down swipes
  threshold: 80,
  bounceSpringConfig: {
    dampingRatio: 0.7,
    duration: 400,
  },
  bounceOpacityThreshold: 0.1,
};

const AppBottomSheetModalComponent: React.FC<AppBottomSheetModalProps> = ({
  visible,
  onOpen,
  onClose,
  contentContainerStyle,
  contentClassName,
  animationConfig,
  swipeConfig,
  children,
  contentWrapperClassName,
  contentStyle,
  topSafeAreaInset = false,
}) => {
  // const [contentVisible, setContentVisible] = useState(false);
  const opacity = useSharedValue(0);

  // Reset content visibility & opacity when modal is hidden
  useEffect(() => {
    if (!visible) {
      // setContentVisible(false);
      opacity.value = 0; // instantly reset (no animation)
    }
  }, [visible, opacity]);

  // Called when modal is fully shown
  const handleOpen = () => {
    // setContentVisible(true);
    opacity.value = withTiming(1, { duration: 220 });
    onOpen?.(); // safely call if provided
  };

  // Called when modal is fully hidden
  const handleClose = () => {
    onClose?.(); // safely call if provided
  };

  const animatedContentStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      onShow={handleOpen}
      onHide={handleClose}
      backdrop={{ enabled: true }}
      statusBarTranslucent
      navigationBarTranslucent
      animation={animationConfig ?? defaultSlideDown}
      swipe={swipeConfig ?? advancedSwipe}
      contentContainerStyle={[
        { flex: 1, justifyContent: "flex-end" },
        contentContainerStyle,
      ]}
    >
      <View className="flex-1">
        {/* Backdrop area – tap to close */}
        <Pressable
          style={{ flex: 1, paddingTop: topSafeAreaInset ? insets.top : 0 }}
          onPress={() => {
            // Also allow closing via backdrop tap
            handleClose();
          }}
        />

        {/* Bottom sheet content */}
        <View
          style={contentStyle}
          className={cn(
            "h-1/2 overflow-hidden rounded-t-3xl bg-white",
            contentWrapperClassName,
          )}
        >
          <Animated.View
            style={[{ flex: 1 }, animatedContentStyle]}
            className={contentClassName}
          >
            {children}
            {/* {contentVisible ? children : null} */}
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
};

const AppBottomSheetModal = React.memo(AppBottomSheetModalComponent);

export default AppBottomSheetModal;
