import { useAuthStore } from "@/store/authStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Alert, BackHandler, useColorScheme } from "react-native";
// import { KeyboardProvider } from "react-native-keyboard-controller";
import "react-native-reanimated";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import "./../global.css";

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const { isAuthenticated } = useAuthStore();
  const colorScheme = useColorScheme();
  const router = useRouter();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  );

  useEffect(() => {
    const backAction = () => {
      if (router.canGoBack()) {
        router.back();
      } else {
        Alert.alert("Hold on!", "Are you sure you want to exit?", [
          { text: "Cancel", style: "cancel" },
          { text: "YES", onPress: () => BackHandler.exitApp() },
        ]);
      }
      return true;
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => subscription.remove();
  }, [router]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          {/* <KeyboardProvider> */}
          <Stack>
            <Stack.Protected guard={!isAuthenticated}>
              <Stack.Screen
                name="(auth)"
                options={{ headerShown: false, animation: "fade" }}
              />
            </Stack.Protected>

            <Stack.Protected guard={isAuthenticated}>
              <Stack.Screen
                name="(tabs)"
                options={{ headerShown: false, animation: "fade" }}
              />
            </Stack.Protected>
          </Stack>

          <StatusBar style="auto" />
          <Toast />
          {/* </KeyboardProvider> */}
        </SafeAreaProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
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
// import { useAuthStore } from "@/store/authStore";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { Stack, useRouter } from "expo-router";
// import { StatusBar } from "expo-status-bar";
// import { useEffect, useState } from "react";
// import { Alert, BackHandler, useColorScheme } from "react-native";
// import "react-native-reanimated";
// import {
//   SafeAreaProvider,
//   initialWindowMetrics,
// } from "react-native-safe-area-context";
// import Toast from "react-native-toast-message";
// import "./../global.css";
// // Optional: React Query Devtools (for debugging)
// // import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import {
//   DarkTheme,
//   DefaultTheme,
//   ThemeProvider,
// } from "@react-navigation/native";
// export const unstable_settings = {
//   anchor: "(tabs)",
// };
// export default function RootLayout() {
//   const { isAuthenticated } = useAuthStore();
//   const colorScheme = useColorScheme();

//   // ✅ Ensure QueryClient is created only once
//   const [queryClient] = useState(
//     () =>
//       new QueryClient({
//         defaultOptions: {
//           queries: {
//             retry: 1, // Retry failed queries once
//             refetchOnWindowFocus: false, // Avoid unnecessary refetch
//           },
//           mutations: {
//             retry: 0, // No retry for mutations like login/register
//           },
//         },
//       }),
//   );
//   const router = useRouter();

//   useEffect(() => {
//     const backAction = () => {
//       if (router.canGoBack()) {
//         router.back();
//       } else {
//         Alert.alert("Hold on!", "Are you sure you want to go back?", [
//           {
//             text: "Cancel",
//             onPress: () => null,
//             style: "cancel",
//           },
//           { text: "YES", onPress: () => BackHandler.exitApp() },
//         ]);
//       }
//       return true;
//     };

//     const backHandler = BackHandler.addEventListener(
//       "hardwareBackPress",
//       backAction,
//     );

//     return () => backHandler.remove();
//   }, [router]);

//   return (
//     <SafeAreaProvider initialMetrics={initialWindowMetrics}>
//       {/* ✅ Provide React Query globally */}
//       <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
//         <QueryClientProvider client={queryClient}>
//           <Stack>
//             {/* Public Screens */}
//             <Stack.Protected guard={!isAuthenticated}>
//               <Stack.Screen
//                 name="(auth)"
//                 options={{ headerShown: false, animation: "fade" }}
//               />
//             </Stack.Protected>
//             {/* Private Screens */}
//             <Stack.Protected guard={isAuthenticated}>
//               <Stack.Screen
//                 name="(tabs)"
//                 options={{ headerShown: false, animation: "fade" }}
//               />
//             </Stack.Protected>
//           </Stack>

//           <StatusBar style="auto" />
//           <Toast />

//           {/* Uncomment in dev mode */}
//           {/* <ReactQueryDevtools initialIsOpen={false} /> */}
//         </QueryClientProvider>
//       </ThemeProvider>
//     </SafeAreaProvider>
//   );
// }
