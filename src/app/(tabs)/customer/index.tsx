// src/app/(tabs)/customer/index.tsx
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import React from "react";
import {
  FlatList,
  ListRenderItemInfo,
  Pressable,
  Text,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { dummyTransactions } from "@/data/dummyTransactions";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
      <FontAwesome6 name="indian-rupee-sign" size={16} color="#888888" />
      <Text className="ml-2 font-medium text-gray-800 dark:text-gray-300">
        {item.amount.toFixed(2)}
      </Text>
    </View>
  </View>
);

const ListHeader = () => {
  const inset = useSafeAreaInsets();
  return (
    <View
      style={{ paddingTop: inset.top }}
      className="bg-white/80 px-4 py-3 text-center dark:bg-gray-800"
    >
      <Text className=" text-center text-2xl font-semibold text-teal-700">
        List of Customers
      </Text>
    </View>
  );
};

const Customer = () => {
  const router = useRouter();

  return (
    // ✅ Ideally have GestureHandlerRootView once in App.tsx, but this works for demo
    <>
      <GestureHandlerRootView>
        <FlatList
          // ListHeaderComponent={<ListHeader />}
          ListHeaderComponent={() => <ListHeader />}
          // stickyHeaderHiddenOnScroll={true}
          stickyHeaderIndices={[0]}
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
          onPress={() => router.navigate("/customer/create")}
          className="absolute bottom-6 right-6 z-10"
        >
          <View className="size-16 items-center justify-center rounded-full bg-teal-700/90">
            <FontAwesome6 name="plus" size={20} color="#fff" />
          </View>
        </Pressable>
      </GestureHandlerRootView>
    </>
  );
};

export default Customer;
