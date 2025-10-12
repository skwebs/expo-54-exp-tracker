import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { FlatList, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const transactions = [
  { id: "1", amount: 50.0, date: "2025-09-20", description: "Coffee Shop" },
  { id: "2", amount: 120.5, date: "2025-09-19", description: "Grocery Store" },
  { id: "3", amount: 15.0, date: "2025-09-18", description: "Bus Fare" },
  {
    id: "4",
    amount: 200.0,
    date: "2025-09-17",
    description: "Online Purchase",
  },
  { id: "5", amount: 30.0, date: "2025-09-16", description: "Restaurant" },
  { id: "6", amount: 75.0, date: "2025-09-15", description: "Gas Station" },
  { id: "7", amount: 45.0, date: "2025-09-14", description: "Bookstore" },
  {
    id: "8",
    amount: 310.0,
    date: "2025-09-13",
    description: "Electronics Store",
  },
  { id: "9", amount: 22.5, date: "2025-09-12", description: "Fast Food" },
  { id: "10", amount: 90.0, date: "2025-09-11", description: "Pharmacy" },
  {
    id: "11",
    amount: 175.0,
    date: "2025-09-10",
    description: "Clothing Store",
  },
  { id: "12", amount: 12.0, date: "2025-09-09", description: "Metro Tickets" },
  { id: "13", amount: 60.0, date: "2025-09-08", description: "Supermarket" },
  {
    id: "14",
    amount: 250.0,
    date: "2025-09-07",
    description: "Furniture Shop",
  },
  { id: "15", amount: 40.0, date: "2025-09-06", description: "Cinema" },
  { id: "16", amount: 95.0, date: "2025-09-05", description: "Pet Store" },
  { id: "17", amount: 33.0, date: "2025-09-04", description: "Bakery" },
  {
    id: "18",
    amount: 520.0,
    date: "2025-09-03",
    description: "Airline Ticket",
  },
  { id: "19", amount: 28.0, date: "2025-09-02", description: "Laundry" },
  {
    id: "20",
    amount: 110.0,
    date: "2025-09-01",
    description: "Sports Equipment",
  },
  { id: "21", amount: 85.0, date: "2025-08-31", description: "Spa" },
  { id: "22", amount: 300.0, date: "2025-08-30", description: "Hotel Booking" },
  {
    id: "23",
    amount: 10.0,
    date: "2025-08-29",
    description: "Newspaper Stand",
  },
  {
    id: "24",
    amount: 130.0,
    date: "2025-08-28",
    description: "Hardware Store",
  },
  { id: "25", amount: 48.0, date: "2025-08-27", description: "Ice Cream Shop" },
];

const renderTransaction = ({ item }: { item: (typeof transactions)[0] }) => (
  <View className="flex-row justify-between py-3 px-4 border-b border-gray-200 last:border-b-0">
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
  return (
    <SafeAreaView className="flex-1 ">
      <Text>Customer</Text>
      <View className="flex-1 min-h-48">
        <FlatList
          className="flex-1"
          data={transactions.slice(0, 14)}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
        />
      </View>
      <ScrollView className="flex-1">
        <Text>Transactions</Text>
        <Text>Transactions</Text>
        <Text>Transactions</Text>
        <Text>Transactions</Text>
        <Text>Transactions</Text>
        <Text>Transactions</Text>
        <Text>Transactions</Text>
        <Text>Transactions</Text>
        <Text>Transactions</Text>
        <Text>Transactions</Text>
        <Text>Transactions</Text>
        <Text>Transactions</Text>
        <Text>Transactions</Text>
        <Text>Transactions</Text>
        <Text>Transactions</Text>
        <Text>Transactions</Text>
        <Text>Transactions</Text>
        <Text>Transactions</Text>
        <Text>Transactions</Text>
        <Text>Transactions</Text>
        <Text>Transactions</Text>
        <Text>Transactions</Text>
        <Text>Transactions</Text>
        <Text>Transactions</Text>
        <Text>Transactions</Text>
        <Text>Transactions</Text>
        <Text>Transactions</Text>
        <Text>Transactions</Text>
        <Text>Transactions</Text>
        <Text>Transactions</Text>
        <Text>Transactions</Text>
        <Text>Transactions</Text>
        <Text>Transactions</Text>
        <Text>Transactions</Text>
        <Text>Transactions</Text>
        <Text>Transactions</Text>
        <Text>Transactions</Text>
        <Text>Transactions</Text>
        <Text>Transactions</Text>
        <Text>Transactions</Text>
        <Text>Transactions</Text>
        <Text>Transactions</Text>
        <Text>Transactions</Text>
        <Text>Transactions</Text>
        <Text>Transactions</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Customer;
