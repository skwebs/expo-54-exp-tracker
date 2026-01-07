import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View } from "react-native";

type OverallBudgetProps = {
  totalAllocated: number;
  totalSpent: number;
  currency?: string;
};

const OverallBudgetCard = ({
  totalAllocated,
  totalSpent,
  currency = "₹",
}: OverallBudgetProps) => {
  const progress = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;
  const remaining = totalAllocated - totalSpent;
  const isOverBudget = totalSpent > totalAllocated;
  const progressColor =
    progress < 80 ? "#10b981" : isOverBudget ? "#ef4444" : "#f59e0b";

  return (
    <View className="mb-6 rounded-3xl border border-white/20 bg-gradient-to-r from-blue-500 to-indigo-600 p-6 shadow-xl">
      {/* Header */}
      <View className="mb-4 flex-row items-center justify-between">
        <View>
          <Text className="mb-1 text-xl font-bold text-white">
            Monthly Budget
          </Text>
          <Text className="text-sm text-blue-100">Overall Progress</Text>
        </View>
        <View
          className={`rounded-full p-2 ${isOverBudget ? "bg-red-500/20" : "bg-green-500/20"}`}
        >
          <MaterialIcons
            name={isOverBudget ? "warning" : "check-circle"}
            size={24}
            color={isOverBudget ? "#fecaca" : "#bbf7d0"}
          />
        </View>
      </View>

      {/* Progress Bar */}
      <View className="mb-5">
        <View className="mb-3 flex-row justify-between">
          <Text className="text-sm text-white/90">Budget Used</Text>
          <Text className="text-lg font-semibold text-white">
            {currency}
            {totalSpent.toLocaleString()} / {currency}
            {totalAllocated.toLocaleString()}
          </Text>
        </View>
        <View className="h-4 overflow-hidden rounded-2xl bg-white/20">
          <LinearGradient
            colors={["transparent", progressColor, progressColor]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className={`h-full rounded-2xl ${progress > 0 ? `w-[${progress}%]` : "w-0"}`}
          />
        </View>
        <Text className="mt-2 text-right text-base font-semibold text-white/90">
          {Math.round(progress)}%
        </Text>
      </View>

      {/* Stats */}
      <View className="flex-row justify-between border-t border-white/20 pt-4">
        <View className="flex-1 items-center">
          <Text className="text-3xl font-black text-white">
            {currency}
            {remaining.toLocaleString()}
          </Text>
          <Text className="text-xs font-medium uppercase tracking-wider text-white/80">
            Remaining
          </Text>
        </View>
        <View className="mx-3 w-px bg-white/20" />
        <View className="flex-1 items-center">
          <Text
            className={`text-2xl font-black ${isOverBudget ? "text-red-300" : "text-white/70"}`}
          >
            {currency}
            {totalSpent.toLocaleString()}
          </Text>
          <Text className="text-xs font-medium uppercase tracking-wider text-white/70">
            Spent
          </Text>
        </View>
      </View>
    </View>
  );
};

// Usage at top of Dashboard
const DashboardTop = () => {
  const totalAllocated = 100000; // From Zustand/sum of budgets
  const totalSpent = 65000;

  return (
    <View className="px-4 pt-4">
      <OverallBudgetCard
        totalAllocated={totalAllocated}
        totalSpent={totalSpent}
      />
    </View>
  );
};

export { DashboardTop, OverallBudgetCard };
