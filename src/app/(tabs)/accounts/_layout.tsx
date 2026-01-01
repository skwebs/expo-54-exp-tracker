import { Stack } from "expo-router";
import React from "react";

export default function AccountLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Accounts", headerShown: false }}
      />
    </Stack>
  );
}
