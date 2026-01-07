import AppBottomSheetModal from "@/components/AppBottomSheetModal";
import BudgetProgressCard from "@/components/dashboard/BudgetProgressCard";
import { AppRippleButton2 } from "@/components/ui/AppRippleButton2";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

// ModalHeader (same as before)
const ModalHeader = ({
  title,
  onClose,
}: {
  title: string;
  onClose: () => void;
}) => (
  <View className="flex-row items-center justify-between border-b border-gray-200 bg-gray-100 px-4 py-3">
    <Text className="flex-1 text-lg font-semibold text-gray-800">{title}</Text>
    <AppRippleButton2
      borderless={true}
      className="rounded-full"
      onPress={onClose}
    >
      <Feather name="x" size={28} color="gray" />
    </AppRippleButton2>
  </View>
);

// Card (same)
type CardProps = {
  title: string;
  amount: number;
  icon?: React.ReactNode;
  onPress: () => void;
};
const Card = ({ title, amount, icon, onPress }: CardProps) => {
  return (
    <Pressable
      android_ripple={{ color: "#00000022", foreground: true }}
      onPress={onPress}
      className=" "
    >
      <View className="flex flex-row items-center justify-between px-5 py-4">
        <View className="flex-row items-center gap-3">
          {icon && icon}
          <Text className="font-semibold text-slate-600">{title}</Text>
        </View>
        <View className="flex flex-row items-center">
          <MaterialIcons name="currency-rupee" size={14} color="black" />
          <Text className="ml-1">{amount}</Text>
          <MaterialIcons name="keyboard-arrow-down" size={24} color="gray" />
        </View>
      </View>
    </Pressable>
  );
};

type AccountItem = {
  id: string;
  name: string;
  balance: number;
  lastTransaction: string;
};
type CardKey = "credit" | "bank";

const Dashboard = () => {
  const [activeCard, setActiveCard] = useState<CardKey | null>(null);
  const [bankAccounts, setBankAccounts] = useState<AccountItem[]>([]);
  const [creditCards, setCreditCards] = useState<AccountItem[]>([]);

  // Simulate API fetch (replace with real axios/useQuery)
  useEffect(() => {
    if (activeCard === "bank") {
      // fetchBankAccounts().then(setBankAccounts);
      setBankAccounts([
        {
          id: "1",
          name: "SBI Savings",
          balance: 25000,
          lastTransaction: "Jan 6",
        },
        {
          id: "2",
          name: "HDFC Current",
          balance: 75000,
          lastTransaction: "Jan 7",
        },
      ]);
    } else if (activeCard === "credit") {
      // fetchCreditCards().then(setCreditCards);
      setCreditCards([
        {
          id: "1",
          name: "HDFC Visa",
          balance: 15000,
          lastTransaction: "Jan 5",
        },
        {
          id: "2",
          name: "ICICI Gold",
          balance: 5000,
          lastTransaction: "Jan 7",
        },
      ]);
    }
  }, [activeCard]);

  const renderAccountItem = ({ item }: { item: AccountItem }) => (
    <AppRippleButton2
      onPress={() => console.log(item.name)}
      className="flex-row items-center justify-between border-b border-gray-100 p-4"
    >
      <View className="flex-1">
        <Text className="font-semibold text-gray-800">{item.name}</Text>
        <Text className="text-sm text-gray-500">{item.lastTransaction}</Text>
      </View>
      <View className="flex-row items-center">
        <MaterialIcons name="currency-rupee" size={14} color="black" />
        <Text className="ml-1 text-lg font-bold">{item.balance}</Text>
      </View>
    </AppRippleButton2>
  );

  const cards = [
    {
      key: "credit" as CardKey,
      title: "Credit Card",
      amount: 20000,
      icon: <MaterialIcons name="credit-card" size={28} color="#475569" />,
    },
    {
      key: "bank" as CardKey,
      title: "Bank Balance",
      amount: 100000,
      icon: <MaterialIcons name="account-balance" size={28} color="#475569" />,
    },
  ];

  const cardConfigs: Record<
    CardKey,
    { title: string; data: AccountItem[]; emptyText: string }
  > = {
    credit: {
      title: "Credit Cards",
      data: creditCards,
      emptyText: "No credit cards added",
    },
    bank: {
      title: "Bank Accounts",
      data: bankAccounts,
      emptyText: "No bank accounts",
    },
  };

  const renderModalContent = () => {
    if (!activeCard) return null;
    const config = cardConfigs[activeCard];
    return (
      <View className="flex-1">
        <ModalHeader title={config.title} onClose={() => setActiveCard(null)} />
        <FlatList
          data={config.data}
          keyExtractor={(item) => item.id}
          renderItem={renderAccountItem}
          ListEmptyComponent={
            <Text className="p-4 text-center text-gray-500">
              {config.emptyText}
            </Text>
          }
          showsVerticalScrollIndicator={false}
          contentContainerClassName="bg-white"
        />
      </View>
    );
  };

  return (
    <>
      <View className="flex-1 bg-white">
        <View className="rounded-xl px-4 py-3">
          <BudgetProgressCard />
        </View>
        <View className="divide-y divide-gray-200">
          {cards.map(({ key, title, amount, icon }) => (
            <Card
              key={key}
              title={title}
              amount={amount}
              icon={icon}
              onPress={() => setActiveCard(key)}
            />
          ))}
        </View>
      </View>
      {/* bottom modal */}
      <AppBottomSheetModal
        visible={!!activeCard}
        onClose={() => setActiveCard(null)}
        topSafeAreaInset={true}
        contentWrapperClassName="pb-6"
      >
        {renderModalContent()}
      </AppBottomSheetModal>
    </>
  );
};

export default Dashboard;

// import AppBottomSheetModal from "@/components/AppBottomSheetModal";
// import { AppRippleButton2 } from "@/components/ui/AppRippleButton2";
// import Feather from "@expo/vector-icons/Feather";
// import MaterialIcons from "@expo/vector-icons/MaterialIcons";
// import React from "react";
// import { Pressable, Text, View } from "react-native";
// import {
//   useAnimatedStyle,
//   useSharedValue,
//   withTiming,
// } from "react-native-reanimated";

// // Reusable Modal Header
// const ModalHeader = ({
//   title,
//   onClose,
// }: {
//   title: string;
//   onClose: () => void;
// }) => (
//   <View className="flex-row items-center justify-between border-b border-gray-200 bg-gray-100 px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
//     <Text className="flex-1 text-lg font-semibold text-gray-800 dark:text-gray-400">
//       {title}
//     </Text>
//     <AppRippleButton2
//       borderless={true}
//       className="rounded-full"
//       onPress={onClose}
//     >
//       <Feather name="x" size={28} color="gray" />
//     </AppRippleButton2>
//   </View>
// );

// type CardKey = "credit" | "bank" | "investments" | "loans";

// type CardProps = {
//   title: string;
//   amount: number;
//   onPress: () => void;
// };

// const Card = ({ title, amount, onPress }: CardProps) => {
//   const scale = useSharedValue(1);
//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: scale.value }],
//   }));

//   return (
//     <Pressable
//       android_ripple={{ color: "#00000022", foreground: true }}
//       onPressIn={() => (scale.value = withTiming(0.97, { duration: 80 }))}
//       onPressOut={() => (scale.value = withTiming(1, { duration: 80 }))}
//       onPress={onPress}
//       className=""
//     >
//       <View className="flex flex-row items-center justify-between px-5 py-4">
//         <Text className="font-semibold text-slate-600">{title}</Text>
//         <View className="flex flex-row items-center">
//           <MaterialIcons name="currency-rupee" size={14} color="black" />
//           <Text className="ml-1">{amount}</Text>
//           <MaterialIcons name="keyboard-arrow-down" size={24} color="gray" />
//         </View>
//       </View>
//     </Pressable>
//   );
// };

// const Dashboard = () => {
//   const [activeCard, setActiveCard] = React.useState<CardKey | null>(null);

//   const cards: { key: CardKey; title: string; amount: number }[] = [
//     { key: "credit", title: "Credit Card", amount: 20000 },
//     { key: "bank", title: "Bank Balance", amount: 50000 },
//     { key: "investments", title: "Investments", amount: 150000 },
//     { key: "loans", title: "Loans", amount: 30000 },
//   ];

//   const cardConfigs: Record<
//     CardKey,
//     { title: string; content: React.ReactNode }
//   > = {
//     credit: {
//       title: "Credit Cards",
//       content: (
//         <View className="flex-1 p-4">
//           <Text>Credit card details, bills, limits.</Text>
//         </View>
//       ),
//     },
//     bank: {
//       title: "Bank Balances",
//       content: (
//         <View className="flex-1 p-4">
//           <Text>Bank accounts, transactions.</Text>
//         </View>
//       ),
//     },
//     investments: {
//       title: "Investments",
//       content: (
//         <View className="flex-1 p-4">
//           <Text>Portfolio, stocks, funds.</Text>
//         </View>
//       ),
//     },
//     loans: {
//       title: "Loans",
//       content: (
//         <View className="flex-1 p-4">
//           <Text>Loan details, EMIs, payments.</Text>
//         </View>
//       ),
//     },
//   };

//   const renderModalContent = () => {
//     if (!activeCard || !cardConfigs[activeCard]) return null;
//     const { title, content } = cardConfigs[activeCard];
//     return (
//       <View className="flex-1">
//         <ModalHeader title={title} onClose={() => setActiveCard(null)} />
//         {content}
//       </View>
//     );
//   };

//   return (
//     <>
//       <View className="flex-1 bg-white">
//         <View className="">
//           <View className="rounded-xl bg-white px-3 py-2">
//             <Text>Dashboard</Text>
//           </View>
//           {cards.map(({ key, title, amount }) => (
//             <Card
//               key={key}
//               title={title}
//               amount={amount}
//               onPress={() => setActiveCard(key)}
//             />
//           ))}
//         </View>
//       </View>
//       <AppBottomSheetModal
//         visible={!!activeCard}
//         onClose={() => setActiveCard(null)}
//         topSafeAreaInset={true}
//         contentWrapperClassName="pb-6"
//       >
//         {renderModalContent()}
//       </AppBottomSheetModal>
//     </>
//   );
// };

// export default Dashboard;

// import AppBottomSheetModal from "@/components/AppBottomSheetModal";
// import { AppRippleButton2 } from "@/components/ui/AppRippleButton2";
// import Feather from "@expo/vector-icons/Feather";
// import MaterialIcons from "@expo/vector-icons/MaterialIcons";
// import React from "react";
// import { Pressable, Text, View } from "react-native";
// import {
//   useAnimatedStyle,
//   useSharedValue,
//   withTiming,
// } from "react-native-reanimated";
// type CardProps = {
//   title: string;
//   amount: number;
//   onPress: () => void;
// };

// const Card = ({ title, amount, onPress }: CardProps) => {
//   const scale = useSharedValue(1);

//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: scale.value }],
//   }));
//   return (
//     <Pressable
//       android_ripple={{
//         color: "#00000022",
//         foreground: true,
//       }}
//       onPressIn={() => (scale.value = withTiming(0.97, { duration: 80 }))}
//       onPressOut={() => (scale.value = withTiming(1, { duration: 80 }))}
//       onPress={onPress}
//       className=""
//     >
//       <View
//         // style={animatedStyle}
//         className="flex flex-row items-center justify-between  px-5 py-4"
//       >
//         <Text className="font-semibold text-slate-600">{title}</Text>

//         <View className="flex flex-row items-center">
//           <MaterialIcons name="currency-rupee" size={14} color="black" />
//           <Text className="ml-1">{amount}</Text>
//           <MaterialIcons name="keyboard-arrow-down" size={24} color="gray" />
//         </View>
//       </View>
//     </Pressable>
//   );
// };
// const Dashboard = () => {
//   const [sheetVisible, setSheetVisible] = React.useState(false);
//   return (
//     <>
//       <View className="flex-1 bg-white">
//         <View className="">
//           <View className="rounded-xl bg-white px-3 py-2">
//             <Text>Dashboard</Text>
//           </View>
//           <Card
//             onPress={() => console.log(" Credit Card Pressed")}
//             title="Credit Card "
//             amount={20000}
//           />
//           <Card
//             onPress={() => setSheetVisible(true)}
//             title="Bank Balance"
//             amount={20000}
//           />
//         </View>
//       </View>
//       <AppBottomSheetModal
//         visible={sheetVisible}
//         onClose={() => setSheetVisible(false)}
//         topSafeAreaInset={true}
//         contentWrapperClassName="pb-6"
//       >
//         <View className="flex-1">
//           {/* Header */}
//           <View className="flex-row items-center justify-between border-b border-gray-200 bg-gray-100 px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
//             <Text className="flex-1 text-lg font-semibold text-gray-800 dark:text-gray-400">
//               Bank Balances
//             </Text>
//             <AppRippleButton2
//               borderless={true}
//               className="rounded-full "
//               onPress={() => setSheetVisible(false)}
//             >
//               <Feather name="x" size={28} color="gray" />
//             </AppRippleButton2>
//           </View>
//           {/* Content */}
//         </View>
//       </AppBottomSheetModal>
//     </>
//   );
// };

// export default Dashboard;
