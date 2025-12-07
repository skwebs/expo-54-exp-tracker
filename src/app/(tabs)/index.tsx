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
            <Text className="text-gray-800 font-medium">
              <FontAwesome6
                name="indian-rupee-sign"
                size={14}
                color="#1F2937"
              />
              20000.00
            </Text>
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
                className="max-h-52"
                data={item.accounts}
                renderItem={renderBankAccount}
                keyExtractor={(account) => account.title}
                showsVerticalScrollIndicator={false}
              />
            )}
            {item.cards && (
              <FlatList
                className="max-h-52"
                data={item.cards}
                renderItem={renderCreditCard}
                keyExtractor={(card) => card.title}
                showsVerticalScrollIndicator={false}
              />
            )}
            {item.investments && (
              <FlatList
                className="max-h-52"
                data={item.investments}
                renderItem={renderInvestment}
                keyExtractor={(investment) => investment.title}
                showsVerticalScrollIndicator={false}
              />
            )}
            {item.recents && (
              <FlatList
                className="max-h-52"
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
  const expanded = useSharedValue<number | null>(4);

  const toggleAccordion = (id: number) => {
    expanded.value = expanded.value === id ? null : id;
  };

  const [expenses, setExpenses] = useState<number>(10000);
  const [budget, setBudget] = useState<number>(15000);

  return (
    <View className="flex-1 p-4 bg-white">
      {/* Budget progress card */}
      <View className="mb-3 rounded-2xl border border-gray-200 bg-white dark:bg-neutral-900 dark:border-neutral-800 p-4">
        {/* Header row */}
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Monthly budget
            </Text>
            <Text className="text-lg font-semibold text-gray-600 dark:text-gray-50">
              Balance
            </Text>
          </View>

          {/* Amounts */}
          <View className="items-end">
            <View className="flex-row items-center">
              <FontAwesome6
                name="indian-rupee-sign"
                size={14}
                color="#dc2626"
              />
              <Text className="ml-1 text-base font-semibold text-red-600 dark:text-red-400">
                {expenses.toLocaleString("en-IN")}.00
              </Text>
              <Text className="mx-1 text-base font-semibold text-gray-400 dark:text-gray-500">
                /
              </Text>
              <Text className="text-base font-semibold text-emerald-600 dark:text-emerald-400">
                {budget.toLocaleString("en-IN")}.00r
              </Text>
            </View>
            <Text className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
              Spent / Budget
            </Text>
          </View>
        </View>

        {/* Progress bar with label */}
        <View className="mb-2">
          <View className="relative h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-neutral-800">
            <View className="h-3 w-2/3 rounded-full bg-red-600 dark:bg-gray-400" />
          </View>
          <View className="mt-1 flex-row justify-between">
            <Text className="text-xs font-medium text-red-500 dark:text-gray-400">
              {Math.round((100 * expenses) / budget)}% of budget used
            </Text>
            <Text className="text-xs  text-emerald-600 font-semibold dark:text-gray-400">
              {Math.round((100 * (budget - expenses)) / budget)}% Remaining
            </Text>
          </View>
        </View>

        {/* Stats row */}
        <View className="mt-1 flex-row justify-between">
          <View>
            <Text className="text-[11px] text-gray-500 dark:text-gray-400">
              Remaining
            </Text>
            <View className="flex-row items-center">
              <FontAwesome6
                name="indian-rupee-sign"
                size={11}
                color="#16a34a"
              />
              <Text className="ml-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                {(budget - expenses).toLocaleString("en-IN")}.00
              </Text>
            </View>
          </View>

          <View>
            <Text className="text-[11px] text-gray-500 dark:text-gray-400">
              Days left
            </Text>
            <Text className="text-sm font-semibold text-gray-900 dark:text-gray-50">
              12
            </Text>
          </View>

          <View className="items-end">
            <Text className="text-[11px] text-gray-500 dark:text-gray-400">
              Daily safe spend
            </Text>
            <View className="flex-row items-center">
              <FontAwesome6
                name="indian-rupee-sign"
                size={11}
                color="#06b6d4"
              />
              <Text className="ml-1 text-sm font-semibold text-cyan-600 dark:text-cyan-400">
                {Math.round(budget / 30).toLocaleString("en-IN")} per day
              </Text>
            </View>
          </View>
        </View>
      </View>

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
      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={true}
        onRequestClose={() => {}}
      >
        <View className="flex-1 bg-gray-50">
          <View className="flex-1">
            <Text className="p-2 bg-gray-200">Customer</Text>
          </View>
        </View>
      </Modal> */}
    </View>
  );
}
