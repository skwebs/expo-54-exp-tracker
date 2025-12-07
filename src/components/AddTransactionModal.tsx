import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { SlideInDown } from "react-native-reanimated";
import { Transaction } from "./TransactionList";

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (transaction: Omit<Transaction, "id">) => void;
}

export default function AddTransactionModal({
  visible,
  onClose,
  onSubmit,
}: AddTransactionModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"credit" | "debit">("debit");
  const [category, setCategory] = useState("");

  const categories = [
    "Shopping",
    "Food",
    "Transport",
    "Bills",
    "Entertainment",
    "Health",
    "Education",
    "Income",
    "Transfer",
    "Other",
  ];

  function handleSubmit() {
    if (!title || !amount) {
      alert("Please fill in required fields");
      return;
    }

    const transaction: Omit<Transaction, "id"> = {
      title: title.trim(),
      description: description.trim(),
      amount:
        type === "debit"
          ? -Math.abs(parseFloat(amount))
          : Math.abs(parseFloat(amount)),
      type,
      date: new Date().toISOString(),
      category: category || undefined,
    };

    onSubmit(transaction);

    // Reset form
    setTitle("");
    setDescription("");
    setAmount("");
    setType("debit");
    setCategory("");
  }

  function handleClose() {
    // Reset form
    setTitle("");
    setDescription("");
    setAmount("");
    setType("debit");
    setCategory("");
    onClose();
  }

  return (
    <Modal
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      backdropColor={"rgba(0,0,0,0.5)"}
      visible={visible}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        {/* Backdrop */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleClose}
          className="flex-1 bg-black/50"
        >
          {/* Modal Content */}
          <View className="flex-1 justify-end">
            <TouchableOpacity
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
            >
              <Animated.View
                entering={SlideInDown.springify()}
                className="bg-white dark:bg-gray-900 rounded-t-3xl"
              >
                <ScrollView
                  className="max-h-[85vh]"
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
                  <View className="p-6">
                    {/* Header */}
                    <View className="flex-row items-center justify-between mb-6">
                      <Text className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                        Add Transaction
                      </Text>
                      <TouchableOpacity
                        onPress={handleClose}
                        className="w-8 h-8 items-center justify-center"
                      >
                        <Text className="text-gray-400 text-2xl">×</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Type Selector */}
                    <View className="flex-row gap-3 mb-6">
                      <TouchableOpacity
                        onPress={() => setType("debit")}
                        className={`flex-1 py-3 rounded-xl border-2 ${
                          type === "debit"
                            ? "bg-red-50 border-red-500 dark:bg-red-900/20 dark:border-red-400"
                            : "bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                        }`}
                      >
                        <Text
                          className={`text-center font-semibold ${
                            type === "debit"
                              ? "text-red-600 dark:text-red-400"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          💸 Expense
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => setType("credit")}
                        className={`flex-1 py-3 rounded-xl border-2 ${
                          type === "credit"
                            ? "bg-green-50 border-green-500 dark:bg-green-900/20 dark:border-green-400"
                            : "bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                        }`}
                      >
                        <Text
                          className={`text-center font-semibold ${
                            type === "credit"
                              ? "text-green-600 dark:text-green-400"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          💰 Income
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Title Input */}
                    <View className="mb-4">
                      <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Title *
                      </Text>
                      <TextInput
                        value={title}
                        onChangeText={setTitle}
                        placeholder="e.g., Grocery Shopping"
                        placeholderTextColor="#9ca3af"
                        className="border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800"
                      />
                    </View>

                    {/* Amount Input */}
                    <View className="mb-4">
                      <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Amount *
                      </Text>
                      <View className="flex-row items-center border border-gray-300 dark:border-gray-700 rounded-xl px-4 bg-white dark:bg-gray-800">
                        <Text className="text-gray-500 dark:text-gray-400 text-lg mr-2">
                          ₹
                        </Text>
                        <TextInput
                          value={amount}
                          onChangeText={setAmount}
                          placeholder="0.00"
                          placeholderTextColor="#9ca3af"
                          keyboardType="decimal-pad"
                          className="flex-1 py-3 text-gray-800 dark:text-gray-200 text-lg"
                        />
                      </View>
                    </View>

                    {/* Description Input */}
                    <View className="mb-4">
                      <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </Text>
                      <TextInput
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Optional details"
                        placeholderTextColor="#9ca3af"
                        multiline
                        numberOfLines={3}
                        className="border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800"
                        style={{ textAlignVertical: "top" }}
                      />
                    </View>

                    {/* Category Selector */}
                    <View className="mb-6">
                      <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category
                      </Text>
                      <View className="flex-row flex-wrap gap-2">
                        {categories.map((cat) => (
                          <TouchableOpacity
                            key={cat}
                            onPress={() =>
                              setCategory(cat === category ? "" : cat)
                            }
                            className={`px-4 py-2 rounded-full border ${
                              category === cat
                                ? "bg-orange-500 border-orange-500"
                                : "bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-700"
                            }`}
                          >
                            <Text
                              className={`text-sm font-medium ${
                                category === cat
                                  ? "text-white"
                                  : "text-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {cat}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                      onPress={handleSubmit}
                      activeOpacity={0.8}
                      className="bg-orange-500 rounded-xl py-4 items-center"
                    >
                      <Text className="text-white font-semibold text-lg">
                        Add Transaction
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </Animated.View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}
