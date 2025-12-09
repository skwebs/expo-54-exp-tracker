import AddTransactionModal from "@/components/AddTransactionModal";
import TransactionList, { Transaction } from "@/components/TransactionList";
import { dummyTransactions } from "@/data/dummyTransactions";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import Animated, { SlideInDown } from "react-native-reanimated";

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    try {
      setLoading(true);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Use dummy data for now
      setTransactions(dummyTransactions);

      // TODO: Replace with real API call
      // const response = await axiosInstance.get("/transactions");
      // setTransactions(response.data);
    } catch (error) {
      console.error("Error loading transactions:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }

  function handleTransactionPress(transaction: Transaction) {
    // Navigate to transaction detail or show modal
    // console.log("Transaction pressed:", transaction);
    // router.push(`/transaction/${transaction.id}`);
  }

  function handleAddTransaction(transaction: Omit<Transaction, "id">) {
    // Add new transaction with generated ID
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };

    setTransactions([newTransaction, ...transactions]);
    setModalVisible(false);

    // TODO: Send to API
    // await axiosInstance.post("/transactions", newTransaction);
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <TransactionList
        transactions={transactions}
        onTransactionPress={handleTransactionPress}
        onRefresh={loadTransactions}
        refreshing={loading}
        emptyMessage="No transactions yet"
      />

      {/* Floating Action Button */}
      <Animated.View
        entering={SlideInDown.delay(300).springify()}
        className="absolute bottom-6 right-6"
      >
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
          className="h-16 w-16 items-center justify-center rounded-full bg-orange-500 shadow-lg"
          style={{
            shadowColor: "#f97316",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Text className="text-3xl font-light text-white">+</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleAddTransaction}
      />
    </View>
  );
}
