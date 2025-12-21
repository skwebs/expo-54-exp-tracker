import { ANDROID_ID } from "@/Constants";
import imagePath from "@/constants/imagePath";
import { useAuthStore } from "@/store/authStore";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Clipboard from "expo-clipboard";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import Toast from "react-native-toast-message";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

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
      ],
    );
  };

  const copyAppIdToClipboard = async () => {
    await Clipboard.setStringAsync(ANDROID_ID!);
    Toast.show({
      position: "bottom",
      type: "success",
      text1: "App ID Copied",
      text2: `App ID: ${ANDROID_ID}`,
    });
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
          <Text className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your profile and security
          </Text>
        </View>

        {/* Profile Card */}

        <View className="mb-4">
          <Text className="ml-1 pb-2 text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Profile
          </Text>
          <Pressable
            onPress={() => router.push("/settings/update-details")}
            android_ripple={{ color: "#E0E7FF" }}
            accessibilityLabel="Change Password"
            accessibilityRole="button"
            className="mb-3 flex flex-row items-center gap-x-4 rounded-xl border border-gray-200 bg-white px-5 py-4 dark:border-gray-700 dark:bg-gray-800"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 3,
              elevation: 2,
            }}
          >
            <View className="flex min-h-14 min-w-14 items-center justify-center overflow-hidden rounded-full bg-gradient-to-tr from-indigo-100 to-indigo-300 shadow dark:from-indigo-900 dark:to-indigo-700">
              <Image
                source={imagePath.ama_logo}
                placeholder={{ blurhash }}
                transition={1000} // duration for crossfade effect in ms
                className="h-full w-full"
                style={{ width: 56, height: 56 }}
                contentFit="cover"
              />
            </View>
            <View className="flex flex-1 gap-1">
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
          <Text className="ml-1 pb-2 text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Security
          </Text>
          <Pressable
            onPress={handleChangePassword}
            android_ripple={{ color: "#E0E7FF" }}
            accessibilityLabel="Change Password"
            accessibilityRole="button"
            className="mb-3 flex-row items-center rounded-xl border border-gray-200 bg-white px-5 py-4 dark:border-gray-700 dark:bg-gray-800"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 3,
              elevation: 2,
            }}
          >
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900">
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
            className="flex-row items-center rounded-xl border border-red-200 bg-red-50 px-5 py-4 dark:border-red-800 dark:bg-red-900/20"
          >
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900">
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
          <Pressable onPress={copyAppIdToClipboard}>
            <Text className="text-xs text-gray-400 dark:text-gray-500">
              App ID : {ANDROID_ID}
            </Text>
          </Pressable>
          <Text className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            © 2025 My Wallet. All rights reserved.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
