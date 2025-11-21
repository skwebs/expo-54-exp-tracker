// import { useAuthStore } from "@/store/authStore";
// import { Stack } from "expo-router";
// import { StatusBar } from "expo-status-bar";
// import "react-native-reanimated";
// import {
//   SafeAreaProvider,
//   initialWindowMetrics,
// } from "react-native-safe-area-context";
// import Toast from "react-native-toast-message";
// import "./../global.css";

// export const unstable_settings = {
//   anchor: "(tabs)",
// };

// export default function RootLayout() {
//   // const { user, token, isAuthenticated, logout } = useAuthStore();
//   const { isAuthenticated } = useAuthStore();

//   return (
//     <SafeAreaProvider initialMetrics={initialWindowMetrics}>
//       <Stack>
//         <Stack.Protected guard={!isAuthenticated}>
//           <Stack.Screen
//             name="login"
//             options={{ headerShown: false, animation: "fade" }}
//           />
//           <Stack.Screen
//             name="register"
//             options={{ headerShown: false, animation: "fade" }}
//           />
//         </Stack.Protected>
//         <Stack.Protected guard={isAuthenticated}>
//           <Stack.Screen
//             name="(tabs)"
//             options={{ headerShown: false, animation: "fade" }}
//           />
//         </Stack.Protected>
//       </Stack>
//       <StatusBar style="auto" />
//       <Toast />
//     </SafeAreaProvider>
//   );
// }
import { ANDROID_ID } from "@/Constants";
import { useAuthStore } from "@/store/authStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Text } from "react-native";
import "react-native-reanimated";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import "./../global.css";
// Optional: React Query Devtools (for debugging)
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const { isAuthenticated } = useAuthStore();

  // ✅ Ensure QueryClient is created only once
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1, // Retry failed queries once
            refetchOnWindowFocus: false, // Avoid unnecessary refetch
          },
          mutations: {
            retry: 0, // No retry for mutations like login/register
          },
        },
      })
  );

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      {/* ✅ Provide React Query globally */}
      <QueryClientProvider client={queryClient}>
        <Stack>
          {/* Public Screens */}
          <Stack.Protected guard={!isAuthenticated}>
            <Stack.Screen
              name="(auth)"
              options={{ headerShown: false, animation: "fade" }}
            />
          </Stack.Protected>
          {/* Private Screens */}
          <Stack.Protected guard={isAuthenticated}>
            <Stack.Screen
              name="(tabs)"
              options={{ headerShown: false, animation: "fade" }}
            />
          </Stack.Protected>
        </Stack>

        <StatusBar style="auto" />
        <Toast />

        {ANDROID_ID && (
          <Text className="text-sm text-gray-500 dark:teTextray-400 text-center">
            Android ID: {ANDROID_ID}
          </Text>
        )}
        {/* Uncomment in dev mode */}
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
