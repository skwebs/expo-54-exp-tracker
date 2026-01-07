import React, { ReactNode, useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  LayoutChangeEvent,
  Platform,
  ScrollView,
  View,
} from "react-native";

type Props = {
  children: ReactNode;
  bottomAction?: ReactNode; // submit button
  contentPadding?: number;
};

export function KeyboardFormWrapper({
  children,
  bottomAction,
  contentPadding = 0,
}: Props) {
  const scrollRef = useRef<ScrollView>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  /** listen keyboard */
  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });

    const hide = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  /** measure screen */
  const onLayout = (e: LayoutChangeEvent) => {
    setContainerHeight(e.nativeEvent.layout.height);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      onLayout={onLayout}
    >
      <ScrollView
        ref={scrollRef}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          padding: contentPadding,
          flexGrow: 1,
          // paddingBottom: 100, // space for button
          //   paddingBottom: keyboardHeight + (bottomAction ? 120 : 0), // space for button
          //   minHeight: containerHeight,
        }}
      >
        {children}
      </ScrollView>

      {/* 🔹 Fixed bottom action */}
      {bottomAction && (
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: keyboardHeight > 0 ? keyboardHeight : 16,
            paddingHorizontal: contentPadding,
          }}
        >
          {bottomAction}
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
