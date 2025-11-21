import React, { useRef, useState } from "react";
import { SectionList, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export interface Transaction {
  id: string;
  title: string;
  description?: string;
  amount: number;
  type: "credit" | "debit";
  date: string;
  category?: string;
}

interface TransactionSection {
  title: string;
  data: Transaction[];
}

interface TransactionListProps {
  transactions?: Transaction[];
  emptyMessage?: string;
  onTransactionPress?: (transaction: Transaction) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export default function TransactionList({
  transactions = [],
  emptyMessage = "No transactions found",
  onTransactionPress,
  onRefresh,
  refreshing = false,
}: TransactionListProps) {
  const [currentStickyDate, setCurrentStickyDate] = useState<string>("");
  const stickyOpacity = useSharedValue(0);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const groupedTransactions = React.useMemo(() => {
    if (
      !transactions ||
      !Array.isArray(transactions) ||
      transactions.length === 0
    ) {
      return [];
    }

    const groups: { [key: string]: Transaction[] } = {};

    transactions.forEach((transaction) => {
      if (!transaction?.date) return;

      const date = new Date(transaction.date);
      const dateKey = formatSectionDate(date);

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(transaction);
    });

    return Object.keys(groups)
      .sort((a, b) => {
        const dateA = new Date(groups[a][0].date);
        const dateB = new Date(groups[b][0].date);
        return dateB.getTime() - dateA.getTime();
      })
      .map((date) => ({
        title: date,
        data: groups[date].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        ),
      }));
  }, [transactions]);

  function formatSectionDate(date: Date): string {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);

    if (compareDate.getTime() === today.getTime()) {
      return "Today";
    } else if (compareDate.getTime() === yesterday.getTime()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
  }

  function formatAmount(amount: number): string {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  // Show sticky date on scroll
  function showStickyDate(date: string) {
    // Clear previous timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    setCurrentStickyDate(date);
    stickyOpacity.value = withTiming(1, { duration: 200 });

    // Auto-hide after 2 seconds
    hideTimeoutRef.current = setTimeout(() => {
      stickyOpacity.value = withTiming(0, { duration: 300 });
    }, 2000);
  }

  // Handle scroll and detect current section
  const handleViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const currentSection = viewableItems[0]?.section?.title;
      if (currentSection) {
        showStickyDate(currentSection);
      }
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 100,
  }).current;

  // Animated style for sticky date
  const stickyDateStyle = useAnimatedStyle(() => {
    return {
      opacity: stickyOpacity.value,
    };
  });

  const renderSectionHeader = ({
    section,
  }: {
    section: TransactionSection;
  }) => (
    <Animated.View
      entering={FadeInRight.duration(300)}
      className=" flex justify-center items-center "
    >
      <Text className="text-sm bg-white dark:bg-gray-800/80 px-4 py-1.5 rounded-3xl text-gray-600 dark:text-gray-300 text-center border border-gray-100 shadow dark:border-gray-700">
        {section.title}
      </Text>
    </Animated.View>
  );

  const renderItem = ({
    item,
    index,
  }: {
    item: Transaction;
    index: number;
  }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 50).duration(400)}
      className="mx-4 my-2"
    >
      <TouchableOpacity
        onPress={() => onTransactionPress?.(item)}
        activeOpacity={0.7}
        className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1 mr-3">
            <Text className="text-base font-semibold text-gray-800 dark:text-gray-200">
              {item.title}
            </Text>
            {item.description && (
              <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {item.description}
              </Text>
            )}
            <View className="flex-row items-center mt-2 gap-2">
              {item.category && (
                <View className="bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded">
                  <Text className="text-xs font-medium text-orange-600 dark:text-orange-400">
                    {item.category}
                  </Text>
                </View>
              )}
              <Text className="text-xs text-gray-400 dark:text-gray-500">
                {new Date(item.date).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          </View>

          <View className="items-end">
            <Text
              className={`text-lg font-bold ${
                item.type === "credit"
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {item.type === "credit" ? "+" : "-"}
              {formatAmount(Math.abs(item.amount))}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center py-20">
      <Text className="text-6xl mb-4">💳</Text>
      <Text className="text-gray-400 dark:text-gray-500 text-base font-medium">
        {emptyMessage}
      </Text>
    </View>
  );

  return (
    <View className="flex-1">
      {/* Floating Sticky Date (WhatsApp-style) */}
      {currentStickyDate && (
        <Animated.View
          style={[stickyDateStyle]}
          className="absolute top-1 self-center z-50 bg-white  dark:bg-gray-800/90 px-4 py-2 rounded-full shadow border border-gray-100 dark:border-gray-700"
          pointerEvents="none"
        >
          <Text className="text-gray-600 dark:text-gray-200 text-sm ">
            {currentStickyDate}
          </Text>
        </Animated.View>
      )}

      <SectionList
        sections={groupedTransactions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ListEmptyComponent={renderEmpty}
        // stickySectionHeadersEnabled={true}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: 6,
          paddingBottom: 96,
        }}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />
    </View>
  );
}
// import React from "react";
// import { SectionList, Text, TouchableOpacity, View } from "react-native";
// import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";

// export interface Transaction {
//   id: string;
//   title: string;
//   description?: string;
//   amount: number;
//   type: "credit" | "debit";
//   date: string;
//   category?: string;
// }

// interface TransactionSection {
//   title: string;
//   data: Transaction[];
// }

// interface TransactionListProps {
//   transactions?: Transaction[];
//   emptyMessage?: string;
//   onTransactionPress?: (transaction: Transaction) => void;
// }

// export default function TransactionList({
//   transactions = [],
//   emptyMessage = "No transactions found",
//   onTransactionPress,
// }: TransactionListProps) {
//   const groupedTransactions = React.useMemo(() => {
//     if (
//       !transactions ||
//       !Array.isArray(transactions) ||
//       transactions.length === 0
//     ) {
//       return [];
//     }

//     const groups: { [key: string]: Transaction[] } = {};

//     transactions.forEach((transaction) => {
//       if (!transaction?.date) return;

//       const date = new Date(transaction.date);
//       const dateKey = formatSectionDate(date);

//       if (!groups[dateKey]) {
//         groups[dateKey] = [];
//       }
//       groups[dateKey].push(transaction);
//     });

//     return Object.keys(groups)
//       .sort((a, b) => {
//         const dateA = new Date(groups[a][0].date);
//         const dateB = new Date(groups[b][0].date);
//         return dateB.getTime() - dateA.getTime();
//       })
//       .map((date) => ({
//         title: date,
//         data: groups[date].sort(
//           (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
//         ),
//       }));
//   }, [transactions]);

//   function formatSectionDate(date: Date): string {
//     const today = new Date();
//     const yesterday = new Date(today);
//     yesterday.setDate(yesterday.getDate() - 1);

//     const compareDate = new Date(date);
//     compareDate.setHours(0, 0, 0, 0);
//     today.setHours(0, 0, 0, 0);
//     yesterday.setHours(0, 0, 0, 0);

//     if (compareDate.getTime() === today.getTime()) {
//       return "Today";
//     } else if (compareDate.getTime() === yesterday.getTime()) {
//       return "Yesterday";
//     } else {
//       return date.toLocaleDateString("en-IN", {
//         day: "numeric",
//         month: "short",
//         year: "numeric",
//       });
//     }
//   }

//   function formatAmount(amount: number): string {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(amount);
//   }

//   const renderSectionHeader = ({
//     section,
//   }: {
//     section: TransactionSection;
//   }) => (
//     <Animated.View
//       entering={FadeInRight.duration(300)}
//       className=" px-4 py-2  flex justify-center items-center"
//     >
//       <Text className="text-sm text-center text-gray-500 dark:text-gray-300 bg-white/80 dark:bg-gray-900/80 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800">
//         {section.title}
//       </Text>
//     </Animated.View>
//   );

//   const renderItem = ({
//     item,
//     index,
//   }: {
//     item: Transaction;
//     index: number;
//   }) => (
//     <Animated.View
//       entering={FadeInDown.delay(index * 50).duration(400)}
//       className="mx-4 my-2"
//     >
//       <TouchableOpacity
//         onPress={() => onTransactionPress?.(item)}
//         activeOpacity={0.7}
//         className="bg-white dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm"
//       >
//         <View className="flex-row items-center justify-between">
//           <View className="flex-1 mr-3">
//             <Text className="text-base font-semibold text-gray-800 dark:text-gray-200">
//               {item.title}
//             </Text>
//             {item.description && (
//               <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
//                 {item.description}
//               </Text>
//             )}
//             <View className="flex-row items-center mt-2 gap-2">
//               {item.category && (
//                 <View className="bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded">
//                   <Text className="text-xs font-medium text-orange-600 dark:text-orange-400">
//                     {item.category}
//                   </Text>
//                 </View>
//               )}
//               <Text className="text-xs text-gray-400 dark:text-gray-500">
//                 {new Date(item.date).toLocaleTimeString("en-IN", {
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 })}
//               </Text>
//             </View>
//           </View>

//           <View className="items-end">
//             <Text
//               className={`text-lg font-bold ${
//                 item.type === "credit"
//                   ? "text-green-600 dark:text-green-400"
//                   : "text-red-600 dark:text-red-400"
//               }`}
//             >
//               {item.type === "credit" ? "+" : "-"}
//               {formatAmount(Math.abs(item.amount))}
//             </Text>
//           </View>
//         </View>
//       </TouchableOpacity>
//     </Animated.View>
//   );

//   const renderEmpty = () => (
//     <View className="flex-1 items-center justify-center py-20">
//       <Text className="text-6xl mb-4">💳</Text>
//       <Text className="text-gray-400 dark:text-gray-500 text-base font-medium">
//         {emptyMessage}
//       </Text>
//     </View>
//   );

//   return (
//     <SectionList
//       sections={groupedTransactions}
//       keyExtractor={(item) => item.id}
//       renderItem={renderItem}
//       renderSectionHeader={renderSectionHeader}
//       ListEmptyComponent={renderEmpty}
//       stickySectionHeadersEnabled={true}
//       showsVerticalScrollIndicator={false}
//       contentContainerStyle={{
//         flexGrow: 1,
//         paddingBottom: 16,
//       }}
//     />
//   );
// }
