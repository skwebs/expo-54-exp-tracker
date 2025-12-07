import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        // headerStyle: {
        //   backgroundColor: "#f4511e",
        // },
        // headerTintColor: "#fff",
        // headerTitleAlign: "center",
        // headerTitleStyle: {
        //   fontWeight: "bold",
        // },
      }}
    >
      <Stack.Screen
        name="login"
        options={{ title: "Login", presentation: "modal" }}
      />
      <Stack.Screen name="register" options={{ title: "Register" }} />
      <Stack.Screen
        name="forgot-password"
        options={{ title: "Forgot Password" }}
      />
      <Stack.Screen name="verify-otp" options={{ title: "Verify OTP" }} />
      <Stack.Screen
        name="reset-password"
        options={{ title: "Reset Password" }}
      />
    </Stack>
  );
}
