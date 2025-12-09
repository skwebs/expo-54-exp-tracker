// src/components/AppBottomSheetModal.tsx
import Ionicons from "@expo/vector-icons/Ionicons";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Animated, Pressable, Text, View, ViewStyle } from "react-native";
import {
  Modal,
  type ModalAnimationConfig,
  type ModalSwipeConfig,
} from "react-native-reanimated-modal";

type HeightVariant = "auto" | "half" | "full";

type AppBottomSheetModalProps = {
  visible: boolean;
  onClose: () => void;

  title?: string;
  showHeader?: boolean;

  /** simple confirm callback (used by default right icon) */
  onConfirm?: () => void;

  /** custom header actions (optional, override defaults) */
  renderLeftAction?: (close: () => void) => ReactNode;
  renderRightAction?: (close: () => void) => ReactNode;

  height?: HeightVariant;
  contentContainerStyle?: ViewStyle;
  contentClassName?: string;

  animationConfig?: ModalAnimationConfig<any>;
  swipeConfig?: ModalSwipeConfig;

  /** Children will fade in AFTER modal fully shown */
  children: ReactNode;
};

const defaultSlideDown: ModalAnimationConfig<"slide"> = {
  type: "slide",
  duration: 280,
  direction: "down",
};

// By default, disable vertical swipe so FlatList scroll is smooth
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
  onClose,
  title = "Modal",
  showHeader = true,
  onConfirm,
  renderLeftAction,
  renderRightAction,
  height = "half",
  contentContainerStyle,
  contentClassName,
  animationConfig,
  swipeConfig,
  children,
}) => {
  const [contentVisible, setContentVisible] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;

  const containerHeightClass =
    height === "full" ? "h-full pt-10r" : height === "auto" ? "" : "h-1/2";

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Reset content when modal is hidden
  useEffect(() => {
    if (!visible) {
      setContentVisible(false);
      opacity.setValue(0);
    }
  }, [visible, opacity]);

  // Called when modal animation is complete and it's fully visible
  const handleModalShow = () => {
    setContentVisible(true);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Modal
      visible={visible}
      backdrop={{ enabled: true }}
      statusBarTranslucent
      navigationBarTranslucent
      animation={animationConfig ?? defaultSlideDown}
      swipe={swipeConfig ?? advancedSwipe}
      contentContainerStyle={[
        { flex: 1, justifyContent: "flex-end" },
        contentContainerStyle,
      ]}
      onShow={handleModalShow}
    >
      <View className="flex-1 justify-end">
        {/* Backdrop area – tap to close */}
        <Pressable className="flex-1" onPress={handleClose} />

        {/* Bottom sheet */}
        <View
          className={`overflow-hidden rounded-t-3xl bg-white ${containerHeightClass}`}
        >
          {showHeader && (
            <View className="flex-row items-center justify-between border-b border-gray-200 p-4">
              {/* LEFT ACTION */}
              {renderLeftAction ? (
                renderLeftAction(handleClose)
              ) : (
                <Pressable onPress={handleClose} hitSlop={8}>
                  <Ionicons name="close-outline" size={28} color="black" />
                </Pressable>
              )}

              {/* TITLE */}
              <Text className="text-xl font-semibold" numberOfLines={1}>
                {title}
              </Text>

              {/* RIGHT ACTION */}
              {renderRightAction ? (
                renderRightAction(handleClose)
              ) : onConfirm ? (
                <Pressable onPress={onConfirm} hitSlop={8}>
                  <Ionicons name="checkmark-outline" size={28} color="black" />
                </Pressable>
              ) : (
                // spacer to keep title centered if no right action
                <View style={{ width: 28, height: 28 }} />
              )}
            </View>
          )}

          {/* Content area with fade-in */}
          <Animated.View
            style={{ flex: 1, opacity }}
            className={contentClassName}
          >
            {contentVisible ? children : null}
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
};

const AppBottomSheetModal = React.memo(AppBottomSheetModalComponent);

export default AppBottomSheetModal;
