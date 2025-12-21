import { useHeaderHeight } from "@react-navigation/elements";
import { Stack } from "expo-router";
import React from "react";

import { Platform, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ... a custom BackButton component would be needed here

const CustomHeader = ({ options }: { options: any }) => {
  const headerHeight = useHeaderHeight();

  const insets = useSafeAreaInsets();
  // Set a specific height
  const customHeight = Platform.OS === "android" ? 64 : 100;

  return (
    <View
      style={{
        height: headerHeight, // Add safe area insets for a true custom height
        backgroundColor: "white",
        paddingTop: insets.top,
        // Add other styling as needed
      }}
    >
      <Text>
        {options.title} {headerHeight}
      </Text>
      {/* Add custom components like buttons here */}
    </View>
  );
};

const CustomerLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        header: (props) => <CustomHeader {...props} />,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Customers",
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          headerTitle: "Create Customer",
        }}
      />
    </Stack>
  );
};

export default CustomerLayout;
