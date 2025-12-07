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

import AppBottomSheetModal from "@/components/AppBottomSheetModal"; // adjust path
import { dummyTransactions } from "@/data/dummyTransactions";

const renderTransaction = ({
  item,
}: ListRenderItemInfo<(typeof dummyTransactions)[0]>) => (
  <View className="flex-row justify-between py-3 px-4 border-b border-gray-200">
    <View className="flex-1">
      <Text className="text-gray-800 font-medium">{item.description}</Text>
      <Text className="text-gray-500 text-sm">{item.date}</Text>
    </View>
    <View className="flex-row items-center">
      <FontAwesome6 name="indian-rupee-sign" size={16} color="#1F2937" />
      <Text className="text-gray-800 font-medium ml-2">
        {item.amount.toFixed(2)}
      </Text>
    </View>
  </View>
);

const Customer = () => {
  const [visible, setVisible] = useState(false);

  return (
    // ✅ Ideally have GestureHandlerRootView once in App.tsx, but this works for demo
    <>
      <GestureHandlerRootView
        style={{ flex: 1, position: "relative", backgroundColor: "#fff" }}
      >
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
          onPress={() => setVisible(true)}
          className="absolute bottom-6 right-6 z-10"
        >
          <View className="size-16 items-center justify-center bg-green-700/90 rounded-full">
            <FontAwesome6 name="plus" size={20} color="#fff" />
          </View>
        </Pressable>

        <AppBottomSheetModal
          visible={visible}
          onClose={() => setVisible(false)}
          title="Transactions"
          height="half" // "auto" | "half" | "full"
          onConfirm={() => {
            // Your save/apply logic here
            setVisible(false);
          }}
          contentClassName="px-2 "
        >
          <FlatList
            data={dummyTransactions}
            keyExtractor={(item) => item.id}
            renderItem={renderTransaction}
            style={{ flex: 1 }}
            initialNumToRender={8}
            maxToRenderPerBatch={8}
            windowSize={5}
            removeClippedSubviews
          />
        </AppBottomSheetModal>
      </GestureHandlerRootView>
    </>
  );
};

export default Customer;
