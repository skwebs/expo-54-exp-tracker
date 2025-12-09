import { Stack } from "expo-router";
import React from "react";

const CustomerLayout = () => {
  return (
    <Stack>
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
