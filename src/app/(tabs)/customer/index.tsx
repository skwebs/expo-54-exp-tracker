// src/app/(tabs)/customer.tsx
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import React, { useState } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  Pressable,
  Text,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import AppBottomSheetModal from "@/components/AppBottomSheetModal";
import { dummyTransactions } from "@/data/dummyTransactions";
import { useRouter } from "expo-router";

const renderTransaction = ({
  item,
}: ListRenderItemInfo<(typeof dummyTransactions)[0]>) => (
  <View className="flex-row justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-900">
    <View className="flex-1">
      <Text className="font-medium text-gray-800 dark:text-gray-300">
        {item.description}
      </Text>
      <Text className="text-sm text-gray-500">{item.date}</Text>
    </View>
    <View className="flex-row items-center">
      <FontAwesome6
        name="indian-rupee-sign"
        size={16}
        color="#888888"
        className="fill-white text-gray-100 dark:text-gray-300"
      />
      <Text className="ml-2 font-medium text-gray-800 dark:text-gray-300">
        {item.amount.toFixed(2)}
      </Text>
    </View>
  </View>
);

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
  const router = useRouter();

  return (
    // ✅ Ideally have GestureHandlerRootView once in App.tsx, but this works for demo
    <>
      <GestureHandlerRootView>
        <FlatList
          // ListHeaderComponent={<Text>List of Customers</Text>}
          // stickyHeaderHiddenOnScroll={true}
          // stickyHeaderIndices={[0]}
          showsVerticalScrollIndicator={false}
          data={dummyTransactions}
          keyExtractor={(item) => item.id}
          renderItem={renderTransaction}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
        <View className="flex-1 ">
          <Text className="text-2xl font-semibold text-gray-800">
            Customer Screen
          </Text>
        </View>

        <Pressable
          // onPress={() => setVisible(true)}
          onPress={() => router.navigate("/customer/create")}
          className="absolute bottom-6 right-6 z-10"
        >
          <View className="size-16 items-center justify-center rounded-full bg-teal-700/90">
            <FontAwesome6 name="plus" size={20} color="#fff" />
          </View>
        </Pressable>

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
          {/* <FlatList
            data={dummyTransactions}
            keyExtractor={(item) => item.id}
            renderItem={renderTransaction}
            style={{ flex: 1 }}
            initialNumToRender={8}
            maxToRenderPerBatch={8}
            windowSize={5}
            removeClippedSubviews
          /> */}
          {/* Category Filter selection */}
          <View className="flex-row flex-wrap gap-2 p-2">
            {categories.map((category) => (
              <Pressable
                key={category}
                onPress={() => {
                  // Handle category selection
                  setVisible(false);
                }}
                className=" rounded-lg bg-gray-100 px-4 py-2 hover:bg-gray-200"
              >
                <Text className="text-lg font-semibold text-gray-800">
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
