// src/app/(tabs)/customer.tsx
import React, { useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import AppBottomSheetModal from "@/components/AppBottomSheetModal";
import Feather from "@expo/vector-icons/Feather";

const categories = ["All", "Food", "Transport", "Entert.", "Shopping", "Other"];

const Customer = () => {
  const [visible, setVisible] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    // ✅ Ideally have GestureHandlerRootView once in App.tsx, but this works for demo
    <>
      <GestureHandlerRootView>
        <View className="flex-1 bg-white p-4">
          <Text className="text-2xl font-semibold text-gray-800">
            Create Customer Screen
          </Text>
          <View className="mt-6 rounded-lg bg-gray-100 p-4">
            <Text>Category:</Text>
            <Pressable onPress={() => setVisible(true)} className="">
              <Text className=" rounded-lg bg-green-600 p-3 text-center text-2xl font-semibold text-white">
                {selectedCategory}
              </Text>
            </Pressable>
          </View>
        </View>

        <AppBottomSheetModal
          visible={visible}
          onClose={() => setVisible(false)}
          title="Select Category"
          height="half" // "auto" | "half" | "full"
          onConfirm={() => {
            // Your save/apply logic here
            setVisible(false);
          }}
          contentClassName=""
        >
          <View>
            {/* Category Filter selection */}
            <View className="flex w-full flex-row items-center justify-between border-b border-gray-300 bg-gray-200">
              <Text className="flex-1 "> </Text>
              <Text className="flex-grow items-center  p-2 text-center text-lg font-semibold text-gray-700">
                Select Category
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setVisible(false);
                }}
                className="flex-1 items-end  p-2"
              >
                {/* Close button icon */}
                <Feather name="x-circle" size={24} color="gray" />
              </TouchableOpacity>
            </View>
            <View className="flex-row flex-wrap gap-2 p-2">
              {categories.map((category) => (
                <Pressable
                  key={category}
                  onPress={() => {
                    setSelectedCategory(category);
                    setVisible(false);
                  }}
                >
                  <Text
                    className={`rounded-lg px-4 py-2 text-lg  ${
                      selectedCategory === category
                        ? "bg-teal-700 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {category}
                  </Text>
                </Pressable>
              ))}

              <TouchableOpacity
                onPress={() => null}
                className="flex flex-row items-center gap-2 rounded-lg border bg-gray-500 px-3  "
              >
                <Feather name="edit-3" size={24} color="white" />
                {/* <Text className="p-1 text-lg font-semibold text-white">New</Text> */}
              </TouchableOpacity>
            </View>
          </View>
        </AppBottomSheetModal>
      </GestureHandlerRootView>
    </>
  );
};

export default Customer;
