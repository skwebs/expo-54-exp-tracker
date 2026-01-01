// src/app/(tabs)/customer/index.tsx
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import React from "react";
import {
  FlatList,
  ListRenderItemInfo,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { dummyTransactions } from "@/data/dummyTransactions";
// import { useHeaderHeight } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const renderTransaction = ({
  item,
}: ListRenderItemInfo<(typeof dummyTransactions)[0]>) => (
  <View className="flex-row justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-800 ">
    <View className="flex-1">
      <Text className="font-medium text-gray-800 dark:text-gray-400">
        {item.description}
      </Text>
      <Text className="text-sm text-gray-600">{item.date}</Text>
    </View>
    <View className="flex-row items-center">
      <FontAwesome6 name="indian-rupee-sign" size={16} color="#888888" />
      <Text className="ml-2 font-medium text-gray-800 dark:text-gray-400">
        {item.amount.toFixed(2)}
      </Text>
    </View>
  </View>
);

const ListHeader = () => {
  // const headerHeight = useHeaderHeight();
  const headerHeight = Platform.OS === "ios" ? 64 : 56;
  const inset = useSafeAreaInsets();
  return (
    <View
      style={{ paddingTop: inset.top }}
      className="bg-teal-700/80  dark:bg-slate-950/80"
    >
      <View
        className="flex items-center justify-center "
        style={{ height: headerHeight }}
      >
        <Text className=" text-center text-2xl font-semibold text-white dark:text-gray-400">
          List of Customers
        </Text>
      </View>
    </View>
  );
};

const Customer = () => {
  const router = useRouter();

  return (
    // ✅ Ideally have GestureHandlerRootView once in App.tsx, but this works for demo
    <>
      <GestureHandlerRootView className="flex-1 bg-red-600">
        <FlatList
          // ListHeaderComponent={<ListHeader />}
          ListHeaderComponent={() => <ListHeader />}
          // stickyHeaderHiddenOnScroll={true}
          stickyHeaderIndices={[0]}
          showsVerticalScrollIndicator={false}
          data={dummyTransactions}
          keyExtractor={(item) => item.id}
          renderItem={renderTransaction}
          // contentContainerStyle={{ paddingBottom: 100 }}
          contentContainerClassName="bg-white dark:bg-gray-900 pb-28"
        />
        <Pressable
          onPress={() => router.navigate("/customer/create")}
          className="absolute bottom-6 right-6 z-10"
        >
          <View className="size-16 items-center justify-center rounded-full bg-teal-700/80 dark:bg-gray-700/80">
            <FontAwesome6 name="plus" size={28} color="#fff" />
          </View>
        </Pressable>
      </GestureHandlerRootView>
    </>
  );
};

export default Customer;
