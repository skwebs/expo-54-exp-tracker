// src/app/(tabs)/customer.tsx
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import AppBottomSheetModal from "@/components/AppBottomSheetModal"; // adjust path

const categories = [
  "All",
  "Food",
  "Transport",
  "Entertainment",
  "Shopping",
  "Other",
];

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
          contentClassName="px-2 "
        >
          {/* Category Filter selection */}
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
                  // className="text-lg font-semibold text-gray-800"
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
          </View>
        </AppBottomSheetModal>
      </GestureHandlerRootView>
    </>
  );
};

export default Customer;
