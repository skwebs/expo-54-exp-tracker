import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import React from "react";
import { Text, View } from "react-native";

const BudgetProgressCard = () => {
  const budget = 50000;
  const expenses = 32000;
  const daysLeft = 12;
  const usedPercent = Math.round((100 * expenses) / budget);
  const remainingPercent = 100 - usedPercent;
  const remaining = budget - expenses;
  const dailySafeSpend = Math.round(budget / 30);

  return (
    <View className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      {/* Header */}
      <View className="mb-3 flex-row items-center justify-between">
        <View>
          <Text className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Monthly budget
          </Text>
          <Text className="text-lg font-semibold text-gray-600 dark:text-gray-50">
            Balance
          </Text>
        </View>
        <View className="flex-row items-center">
          <FontAwesome6 name="indian-rupee-sign" size={14} color="#dc2626" />
          <Text className="ml-1 text-base font-semibold text-red-600 dark:text-red-400">
            {expenses.toLocaleString("en-IN")}.00
          </Text>
          <Text className="mx-1 text-base font-semibold text-gray-400">/</Text>
          <Text className="text-base font-semibold text-emerald-600 dark:text-emerald-400">
            {budget.toLocaleString("en-IN")}.00
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View className="mb-3">
        <View className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-neutral-800">
          <View
            className={`h-3 rounded-full bg-red-500 transition-all duration-300 dark:bg-red-400`}
            style={{ width: `${(expenses / budget) * 100}%` }}
          />
        </View>
        <View className="mt-2 flex-row justify-between">
          <Text className="text-xs font-medium text-red-500 dark:text-gray-400">
            {usedPercent}% of budget used
          </Text>
          <Text className="text-xs font-semibold text-emerald-600 dark:text-gray-400">
            {remainingPercent}% Remaining
          </Text>
        </View>
      </View>

      {/* Stats Row */}
      <View className="flex-row justify-between">
        {/* Remaining */}
        <View className="flex-1 pr-2">
          <Text className="mb-1 text-[11px] text-gray-500 dark:text-gray-400">
            Remaining
          </Text>
          <View className="flex-row items-center">
            <FontAwesome6 name="indian-rupee-sign" size={11} color="#16a34a" />
            <Text className="ml-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              {remaining.toLocaleString("en-IN")}.00
            </Text>
          </View>
        </View>

        {/* Days Left */}
        <View className="flex-1 items-center px-2">
          <Text className="mb-1 text-[11px] text-gray-500 dark:text-gray-400">
            Days left
          </Text>
          <Text className="text-sm font-semibold text-gray-900 dark:text-gray-50">
            {daysLeft}
          </Text>
        </View>

        {/* Daily Safe Spend */}
        <View className="flex-1 pl-2">
          <Text className="mb-1 text-[11px] text-gray-500 dark:text-gray-400">
            Daily safe spend
          </Text>
          <View className="flex-row items-center justify-end">
            <FontAwesome6 name="indian-rupee-sign" size={11} color="#06b6d4" />
            <Text className="ml-1 text-sm font-semibold text-cyan-600 dark:text-cyan-400">
              {dailySafeSpend}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default BudgetProgressCard;

// import React from "react";
// import { View, Text } from "react-native";
// import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

// // Simplified Budget Progress Card with dummy data
// const BudgetProgressCard = () => {
//   const budget = 50000;      // Dummy total budget
//   const expenses = 32000;    // Dummy spent
//   const daysLeft = 12;       // Dummy days remaining
//   const usedPercent = Math.round((100 * expenses) / budget);
//   const remainingPercent = 100 - usedPercent;
//   const remaining = budget - expenses;
//   const dailySafeSpend = Math.round(budget / 30);

//   return (
//     <View className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
//       {/* Header */}
//       <View className="mb-3 flex-row items-center justify-between">
//         <View>
//           <Text className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
//             Monthly budget
//           </Text>
//           <Text className="text-lg font-semibold text-gray-600 dark:text-gray-50">Balance</Text>
//         </View>
//         <View className="flex-row items-center">
//           <FontAwesome6 name="indian-rupee-sign" size={14} color="#dc2626" />
//           <Text className="ml-1 text-base font-semibold text-red-600 dark:text-red-400">
//             {expenses.toLocaleString("en-IN")}.00
//           </Text>
//           <Text className="mx-1 text-base font-semibold text-gray-400">/</Text>
//           <Text className="text-base font-semibold text-emerald-600 dark:text-emerald-400">
//             {budget.toLocaleString("en-IN")}.00
//           </Text>
//         </View>
//       </View>

//       {/* Progress Bar */}
//       <View className="mb-3">
//         <View className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-neutral-800">
//           <View className="h-3 w-[64%] rounded-full bg-red-500" /> {/* Dynamic: expenses/budget */}
//         </View>
//         <View className="mt-2 flex-row justify-between">
//           <Text className="text-xs font-medium text-red-500 dark:text-gray-400">
//             {usedPercent}% of budget used
//           </Text>
//           <Text className="text-xs font-semibold text-emerald-600 dark:text-gray-400">
//             {remainingPercent}% Remaining
//           </Text>
//         </View>
//       </View>

//       {/* Stats Row */}
//       <View className="flex-row justify-between">
//         <View className="flex-1">
//           <Text className="text-[11px] text-gray-500 dark:text-gray-400 mb-1">Remaining</Text>
//           <View className="flex-row items-center">
//             <FontAwesome6 name="indian-rupee-sign" size={11} color="#16a34a" />
//             <Text className="ml-1 text-sm font-semibold text-emerald-600">
//               {remaining.toLocaleString("en-IN")}.00
//             </Text>
//           </View>
//         </View>

//         <View className="flex-1 items-center mx-2">
//           <Text className="text-[11px] text-gray-500 dark:text-gray-400 mb-1">Days left</Text>
//           <Text className="text-sm font-semibold text-gray-900 dark:text-gray-50">{daysLeft}</Text>
//         </View>

//         <View className="flex-1">
//           <Text className="text-[11px] text-gray-500 dark:text-gray-400 mb-1">Daily safe spend</Text>
//           <View className="flex-row items-center justify-end">
//             <FontAwesome6 name="indian-rupee-sign" size={11} color="#06b6d4" />
//             <Text className="ml-1 text-sm font-semibold text-cyan-600">
//               {dailySafeSpend}
//             </Text>
//           </View>
//         </View>
//         </View>
//       </View>

//     );
//   );
// };

// export default BudgetProgressCard;
