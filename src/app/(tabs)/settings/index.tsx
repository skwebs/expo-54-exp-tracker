import { ANDROID_ID } from "@/Constants";
import { useAuthStore } from "@/store/authStore";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Settings() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleChangePassword = () => {
    router.push("/settings/change-password");
  };

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to sign out from this device?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => logout(),
        },
      ]
    );
  };

  return (
    <ScrollView
      className="flex-1 bg-gray-50 dark:bg-gray-900"
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 px-5 py-4">
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

        <View className="mb-8 p-6 flex-row gap-x-4 items-center border border-gray-200 rounded-xl bg-white shadow-md dark:bg-gray-800">
          <View className="bg-gradient-to-tr from-indigo-100 to-indigo-300 dark:from-indigo-900 dark:to-indigo-700 min-w-14 min-h-14 rounded-full overflow-hidden flex items-center justify-center shadow">
            <Image
              source={{
                uri: "https://v1.anshumemorial.in/assets/static/img/ama/ama-128x128.png",
              }}
              className="w-full h-full"
              style={{ width: 56, height: 56 }}
              contentFit="cover"
            />
          </View>
          <View className="flex gap-1 flex-1">
            <Text className="text-xl font-semibold text-gray-900 dark:text-white">
              {user?.name}
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              {user?.email}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/settings/update-details")}
            accessibilityLabel="Edit Profile"
            accessibilityRole="button"
            className="p-2 bg-indigo-100 dark:bg-indigo-800 rounded-full"
          >
            <MaterialCommunityIcons name="pencil" size={22} color="#4F46E5" />
          </TouchableOpacity>
        </View>

        {/* Security Section */}
        <View className="mb-4">
          <Text className="pb-2 ml-1 text-xs uppercase text-gray-400 tracking-widest dark:text-gray-500">
            Profile
          </Text>
          <Pressable
            onPress={() => router.push("/settings/update-details")}
            android_ripple={{ color: "#E0E7FF" }}
            accessibilityLabel="Change Password"
            accessibilityRole="button"
            className="bg-white flex gap-x-4 dark:bg-gray-800 rounded-xl flex-row items-center border border-gray-200 dark:border-gray-700 px-5 py-4 mb-3"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 3,
              elevation: 2,
            }}
          >
            <View className="bg-gradient-to-tr from-indigo-100 to-indigo-300 dark:from-indigo-900 dark:to-indigo-700 min-w-14 min-h-14 rounded-full overflow-hidden flex items-center justify-center shadow">
              <Image
                source={{
                  uri: "https://v1.anshumemorial.in/assets/static/img/ama/ama-128x128.png",
                }}
                className="w-full h-full"
                style={{ width: 56, height: 56 }}
                contentFit="cover"
              />
            </View>
            <View className="flex gap-1 flex-1">
              <Text className="text-xl font-semibold text-gray-900 dark:text-white">
                {user?.name}
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {user?.email}
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
          </Pressable>
        </View>

        {/* Security Section */}
        <View className="mb-4">
          <Text className="pb-2 ml-1 text-xs uppercase text-gray-400 tracking-widest dark:text-gray-500">
            Security
          </Text>
          <Pressable
            onPress={handleChangePassword}
            android_ripple={{ color: "#E0E7FF" }}
            accessibilityLabel="Change Password"
            accessibilityRole="button"
            className="bg-white dark:bg-gray-800 rounded-xl flex-row items-center border border-gray-200 dark:border-gray-700 px-5 py-4 mb-3"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 3,
              elevation: 2,
            }}
          >
            <View className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-xl items-center justify-center mr-3">
              <MaterialIcons name="vpn-key" size={18} color="#4F46E5" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-gray-900 dark:text-white">
                Change Password
              </Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400">
                Update your security
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
          </Pressable>
        </View>

        {/* Logout Section */}
        <View>
          <Pressable
            onPress={handleLogout}
            android_ripple={{ color: "#FECACA" }}
            accessibilityLabel="Logout"
            accessibilityRole="button"
            className="bg-red-50 dark:bg-red-900/20 rounded-xl flex-row items-center border border-red-200 dark:border-red-800 px-5 py-4"
          >
            <View className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-xl items-center justify-center mr-3">
              <MaterialCommunityIcons name="logout" size={18} color="#EF4444" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-red-600 dark:text-red-400">
                Logout
              </Text>
              <Text className="text-xs text-red-500 dark:text-red-400">
                Sign out from this device
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Footer */}
        <View className="mt-10 items-center">
          <Text className="text-xs text-gray-400 dark:text-gray-500">
            App Version 1.0.0
          </Text>
          <Text className="text-xs text-gray-400 dark:text-gray-500">
            App ID : {ANDROID_ID}
          </Text>
          <Text className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            © 2025 My Wallet. All rights reserved.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
