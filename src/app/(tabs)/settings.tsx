// import { useAuthStore } from "@/store/authStore";
// import { useRouter } from "expo-router";
// import React from "react";
// import { Text, TouchableOpacity, View } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// export default function Settings() {
//   // const { user, token, isAuthenticated, logout } = useAuthStore();
//   const { user, logout } = useAuthStore();
//   const router = useRouter();
//   return (
//     <SafeAreaView className="flex-1 items-center justify-center  gap-y-5">
//       <Text className=" text-4xl font-semibold underline ">Profile</Text>
//       <View className=" gap-y-2">
//         <Text className=" text-2xl font-medium">Welcome {user?.name}</Text>
//         <Text className=" font-medium">Email: {user?.email}</Text>
//       </View>

//       <TouchableOpacity
//         className=" bg-red-500 px-5 py-2 rounded-md"
//         onPress={() => {
//           router.push("/change-password");
//           console.log(user);
//         }}
//       >
//         <Text className=" text-white text-lg font-medium">Change Password</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         className=" bg-red-500 px-5 py-2 rounded-md"
//         onPress={() => logout()}
//       >
//         <Text className=" text-white text-lg font-medium">Logout</Text>
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// }
// app/(tabs)/settings.tsx
import { useAuthStore } from "@/store/authStore";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleChangePassword = () => {
    router.push("../change-password"); // or "change-password" if inside (tabs) with href: null
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="flex-1 px-5 pt-4">
        {/* Header */}
        <View className="mb-8 items-center">
          <Text className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Account
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your profile and security
          </Text>
        </View>

        {/* Profile Card */}
        <View
          className={`
            bg-white dark:bg-gray-800 
            rounded-3xl p-6 
            border border-gray-200 dark:border-gray-700
            ${Platform.OS === "ios" ? "shadow-lg" : "shadow-xl"}
            shadow-gray-900/10 dark:shadow-black/50
            mb-8
          `}
          style={{
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.1,
            shadowRadius: 20,
            elevation: 10,
          }}
        >
          {/* Avatar */}
          <View className="items-center mb-5">
            <View
              className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full items-center justify-center shadow-lg"
              style={{
                shadowColor: "#4F46E5",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
                elevation: 8,
              }}
            >
              <Text className="text-3xl font-bold text-white">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </Text>
            </View>
          </View>

          {/* User Info */}
          <View className="space-y-4">
            <View className="flex-row items-center">
              <Ionicons
                name="person"
                size={22}
                color="#6366F1"
                style={{ marginRight: 12 }}
              />
              <View className="flex-1">
                <Text className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Full Name
                </Text>
                <Text className="text-lg font-semibold text-gray-900 dark:text-white mt-0.5">
                  {user?.name || "Guest User"}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <Ionicons
                name="mail"
                size={22}
                color="#6366F1"
                style={{ marginRight: 12 }}
              />
              <View className="flex-1">
                <Text className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Email Address
                </Text>
                <Text className="text-lg font-medium text-gray-900 dark:text-white mt-0.5">
                  {user?.email || "Not set"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action List */}
        <View className="gap-y-3">
          {/* Change Password */}
          <TouchableOpacity
            onPress={handleChangePassword}
            className="bg-white dark:bg-gray-800 rounded-2xl px-5 py-4 flex-row items-center justify-between border border-gray-200 dark:border-gray-700 active:bg-gray-50 dark:active:bg-gray-700"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 3,
              elevation: 2,
            }}
          >
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-xl items-center justify-center mr-3">
                <MaterialIcons name="vpn-key" size={18} color="#4F46E5" />
              </View>
              <View>
                <Text className="text-base font-semibold text-gray-900 dark:text-white">
                  Change Password
                </Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400">
                  Update your security
                </Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-50 dark:bg-red-900/20 rounded-2xl px-5 py-4 flex-row items-center border border-red-200 dark:border-red-800 active:bg-red-100 dark:active:bg-red-900/30"
          >
            <View className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-xl items-center justify-center mr-3">
              <MaterialCommunityIcons name="logout" size={18} color="#EF4444" />
            </View>
            <View>
              <Text className="text-base font-semibold text-red-600 dark:text-red-400">
                Logout
              </Text>
              <Text className="text-xs text-red-500 dark:text-red-400">
                Sign out from this device
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="mt-10 items-center">
          <Text className="text-xs text-gray-400 dark:text-gray-500">
            App Version 1.0.0
          </Text>
          <Text className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            © 2025 YourApp. All rights reserved.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
