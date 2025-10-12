import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import React, { useState } from "react";
import {
  FlatList,
  LayoutChangeEvent,
  Pressable,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from "react-native";
import type { SharedValue } from "react-native-reanimated";
import Animated, {
  Easing,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import { SafeAreaView } from "react-native-safe-area-context";

// Type definitions for nested data
interface BankAccount {
  title: string;
  amount: number;
  type: string;
  lastUpdated: string;
}

interface CreditCard {
  title: string;
  amount: number;
  limit: number;
  dueDate: string;
}

interface Investment {
  title: string;
  amount: number;
  returns?: string;
  interest?: string;
  risk?: string;
  status?: string;
}

interface AccordionItemProps {
  id: number;
  title: string;
  accounts?: BankAccount[];
  cards?: CreditCard[];
  investments?: Investment[];
  recents?: Investment[];
}

// Updated accordion data with nested structure
const data: AccordionItemProps[] = [
  {
    id: 1,
    title: "Banks",
    accounts: [
      {
        title: "SBI",
        amount: 25000,
        type: "savings",
        lastUpdated: "2025-09-20",
      },
      {
        title: "PNB",
        amount: 15500,
        type: "current",
        lastUpdated: "2025-09-19",
      },
      {
        title: "HDFC",
        amount: 32000,
        type: "savings",
        lastUpdated: "2025-09-21",
      },
      {
        title: "ICICI",
        amount: 8500,
        type: "current",
        lastUpdated: "2025-09-18",
      },
    ],
  },
  {
    id: 2,
    title: "Credit Cards",
    cards: [
      {
        title: "Visa Platinum",
        amount: 8200,
        limit: 50000,
        dueDate: "2025-10-15",
      },
      {
        title: "MasterCard Gold",
        amount: 12450,
        limit: 75000,
        dueDate: "2025-10-20",
      },
      { title: "Amex Blue", amount: 5000, limit: 25000, dueDate: "2025-10-10" },
      {
        title: "HDFC Infinia",
        amount: 2300,
        limit: 100000,
        dueDate: "2025-10-25",
      },
    ],
  },
  {
    id: 3,
    title: "Others",
    investments: [
      {
        title: "Mutual Fund - Equity",
        amount: 50000,
        returns: "12.5%",
        risk: "High",
      },
      { title: "Fixed Deposit", amount: 100000, returns: "7.2%", risk: "Low" },
      {
        title: "Personal Loan",
        amount: 120000,
        interest: "10.5%",
        status: "Active",
      },
      {
        title: "Gold Investment",
        amount: 45000,
        returns: "8.3%",
        risk: "Medium",
      },
    ],
  },
  {
    id: 4,
    title: "Recents",
    recents: [
      {
        title: "Mutual Fund - Equity",
        amount: 50000,
        returns: "12.5%",
        risk: "High",
      },
    ],
  },
];

// Sample transaction data
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

interface AccordionItemComponentProps {
  item: AccordionItemProps;
  expanded: SharedValue<number | null>;
  toggle: (id: number) => void;
}

function AccordionItem({
  item,
  expanded,
  toggle,
}: AccordionItemComponentProps) {
  const height = useSharedValue(0);
  const isExpandedLocal = useDerivedValue(() =>
    expanded.value === item.id ? 1 : 0
  );
  const derivedHeight = useDerivedValue(() =>
    withTiming(height.value * isExpandedLocal.value, {
      duration: 300,
      easing: Easing.ease,
    })
  );
  const bodyStyle = useAnimatedStyle(() => ({
    height: derivedHeight.value,
  }));

  const [isExpandedUI, setIsExpandedUI] = useState(false);
  useAnimatedReaction(
    () => isExpandedLocal.value,
    (val) => {
      scheduleOnRN(setIsExpandedUI, val === 1);
    }
  );

  const onLayout = (e: LayoutChangeEvent) => {
    height.value = e.nativeEvent.layout.height;
  };

  // Render Bank Account Item
  const renderBankAccount = ({ item }: { item: BankAccount }) => (
    <View className="flex-row justify-between items-center py-3 px-4 border-b border-gray-200 last:border-b-0 bg-gray-100 rounded-lg my-1">
      <View className="flex-1">
        <Text className="text-gray-800 font-semibold text-base">
          {item.title}
        </Text>
        <Text className="text-gray-500 text-sm capitalize">
          {item.type} Account
        </Text>
        <Text className="text-gray-400 text-xs mt-1">
          Last updated: {item.lastUpdated}
        </Text>
      </View>
      <View className="flex-row items-center">
        <FontAwesome6 name="indian-rupee-sign" size={16} color="#10B981" />
        <Text className="text-green-600 font-bold text-base ml-2">
          {item.amount.toLocaleString("en-IN")}
        </Text>
      </View>
    </View>
  );

  // Render Credit Card Item
  const renderCreditCard = ({ item }: { item: CreditCard }) => (
    <View className="flex-row justify-between items-center py-3 px-4 border-b border-gray-200 last:border-b-0 bg-blue-50 rounded-lg my-1">
      <View className="flex-1">
        <Text className="text-gray-800 font-semibold text-base">
          {item.title}
        </Text>
        <Text className="text-red-600 text-sm font-medium">
          Spent: ₹{item.amount.toLocaleString("en-IN")}
        </Text>
        <Text className="text-blue-600 text-sm">Due: {item.dueDate}</Text>
        <Text className="text-gray-500 text-sm">
          Limit: ₹{item.limit.toLocaleString("en-IN")}
        </Text>
      </View>
      <View className="flex-row items-center">
        <Text className="text-red-600 font-bold text-base">
          {((item.amount / item.limit) * 100).toFixed(1)}%
        </Text>
      </View>
    </View>
  );

  // Render Investment Item
  const renderInvestment = ({ item }: { item: Investment }) => (
    <View className="flex-row justify-between items-center py-3 px-4 border-b border-gray-200 last:border-b-0 bg-gray-100 rounded-lg my-1">
      <View className="flex-1">
        <Text className="text-gray-800 font-semibold text-base">
          {item.title}
        </Text>
        <Text
          className={`text-sm font-medium ${
            item.returns
              ? "text-green-600"
              : item.interest
                ? "text-red-600"
                : "text-gray-500"
          }`}
        >
          {item.returns || item.interest || item.status}
        </Text>
        <Text className="text-gray-500 text-sm">{item.risk || "Active"}</Text>
      </View>
      <View className="flex-row items-center">
        <FontAwesome6 name="indian-rupee-sign" size={16} color="#059669" />
        <Text className="text-green-600 font-bold text-base ml-2">
          {item.amount.toLocaleString("en-IN")}
        </Text>
      </View>
    </View>
  );

  // Pressable style for hover/press feedback
  const getPressableStyle = (pressed: boolean): StyleProp<ViewStyle> => ({
    backgroundColor: pressed ? "#F3F4F6" : "#F9FAFB", // gray-100 to gray-50
  });

  return (
    <View className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
      <Pressable
        style={({ pressed }) => getPressableStyle(pressed)}
        onPress={() => toggle(item.id)}
      >
        <View className="flex-row items-center justify-between p-4">
          <View className="flex-row items-center">
            {item.title === "Banks" && (
              <FontAwesome name="bank" size={24} color="#1F2937" />
            )}
            {item.title === "Credit Cards" && (
              <Ionicons name="card" size={24} color="#1F2937" />
            )}
            {item.title === "Others" && (
              <Ionicons name="wallet" size={24} color="#1F2937" />
            )}
            {item.title === "Recents" && (
              <Ionicons name="time-outline" size={24} color="#1F2937" />
            )}
            <Text className="text-xl font-semibold text-gray-800 ml-3">
              {item.title}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="text-gray-800 font-medium">$20000.00</Text>
            <Ionicons
              name={isExpandedUI ? "chevron-up" : "chevron-down"}
              size={24}
              color="#6B7280"
            />
          </View>
        </View>
      </Pressable>
      <Animated.View className="w-full overflow-hidden" style={bodyStyle}>
        <View onLayout={onLayout} className="w-full absolute">
          <View className="px-4 pb-4">
            {item.accounts && (
              <FlatList
                data={item.accounts}
                renderItem={renderBankAccount}
                keyExtractor={(account) => account.title}
                showsVerticalScrollIndicator={false}
              />
            )}
            {item.cards && (
              <FlatList
                data={item.cards}
                renderItem={renderCreditCard}
                keyExtractor={(card) => card.title}
                showsVerticalScrollIndicator={false}
              />
            )}
            {item.investments && (
              <FlatList
                data={item.investments}
                renderItem={renderInvestment}
                keyExtractor={(investment) => investment.title}
                showsVerticalScrollIndicator={false}
              />
            )}
            {item.recents && (
              <FlatList
                data={item.recents}
                renderItem={renderInvestment}
                keyExtractor={(investment) => investment.title}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

export default function Index() {
  const expanded = useSharedValue<number | null>(null);

  const toggleAccordion = (id: number) => {
    expanded.value = expanded.value === id ? null : id;
  };

  // Render a single transaction item
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

  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      <View className="gap-y-4 mb-8">
        {data.map((item) => (
          <AccordionItem
            key={item.id}
            item={item}
            expanded={expanded}
            toggle={toggleAccordion}
          />
        ))}
      </View>
      <View className="p-4 bg-red-50 rounded-xl shadow max-h-72">
        <Text className="font-bold text-red-400 text-center mb-4">
          Recent Transactions
        </Text>
        <FlatList
          data={transactions.slice(0, 15)}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
  );
}
