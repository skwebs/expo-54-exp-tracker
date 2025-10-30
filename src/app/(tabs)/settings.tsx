import { useAuthStore } from "@/store/authStore";
import React from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  const { user, token, isAuthenticated, logout } = useAuthStore();
  return (
    <SafeAreaView className="flex-1 items-center justify-center  gap-y-5">
      <Text className=" text-4xl font-semibold underline ">Profile</Text>
      <View className=" gap-y-2">
        <Text className=" text-2xl font-medium">Welcome {user?.name}</Text>
        <Text className=" font-medium">Email: {user?.email}</Text>
      </View>
      <Pressable
        className=" bg-teal-500 px-5 py-2 rounded-md"
        onPress={() => logout()}
      >
        <Text className=" text-white text-lg font-medium">Logout</Text>
      </Pressable>

      <TouchableOpacity
        className=" bg-red-500 px-5 py-2 rounded-md"
        onPress={() => logout()}
      >
        <Text className=" text-white text-lg font-medium">Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
