import { API_URL } from "@/Constants";
import { useAuthStore } from "@/store/authStore";
import axios, { isAxiosError } from "axios";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { SlideInDown } from "react-native-reanimated";

interface AccountType {
  id: number;
  name: string;
  type: string;
  billing_day: number;
  grace_period_days: number;
  active: boolean;
  created_at: string;
}

const allowedTypes = ["credit_card", "bank_account", "cash", "lender", "loan"];

// Separate AddAccountModal component
interface AddAccountModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (newAccount: {
    name: string;
    type: string;
    billing_day: number;
    grace_period_days: number;
    active: boolean;
  }) => void;
}

function AddAccountModal({ visible, onClose, onSubmit }: AddAccountModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState("credit_card");
  const [billingDay, setBillingDay] = useState("1");
  const [gracePeriod, setGracePeriod] = useState("20");
  const [active, setActive] = useState(true);

  const handleCreate = () => {
    if (!name.trim()) {
      Alert.alert("Validation", "Account name is required");
      return;
    }
    if (!allowedTypes.includes(type)) {
      Alert.alert(
        "Validation",
        `Type must be one of: ${allowedTypes.join(", ")}`,
      );
      return;
    }
    const billingDayNum = Number(billingDay);
    if (isNaN(billingDayNum) || billingDayNum < 1 || billingDayNum > 31) {
      Alert.alert(
        "Validation",
        "Billing day must be a number between 1 and 31",
      );
      return;
    }
    const gracePeriodNum = Number(gracePeriod);
    if (isNaN(gracePeriodNum) || gracePeriodNum < 0) {
      Alert.alert("Validation", "Grace period must be a non-negative number");
      return;
    }

    onSubmit({
      name: name.trim(),
      type,
      billing_day: billingDayNum,
      grace_period_days: gracePeriodNum,
      active,
    });
    // Clear form after submit
    setName("");
    setType("credit_card");
    setBillingDay("1");
    setGracePeriod("20");
    setActive(true);
  };

  if (!visible) return null;

  return (
    <View className="absolute inset-0 z-50 flex-1 items-center justify-center bg-black/50 px-4">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800"
      >
        <Text className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Add New Account
        </Text>

        <TextInput
          placeholder="Account Name"
          value={name}
          onChangeText={setName}
          className="mb-4 rounded-md bg-gray-100 px-3 py-2 text-gray-900 dark:bg-gray-700 dark:text-white"
        />

        <View className="mb-4 flex-row flex-wrap">
          {allowedTypes.map((typeOption) => (
            <TouchableOpacity
              key={typeOption}
              onPress={() => setType(typeOption)}
              className={`mb-2 mr-2 rounded-md border px-3 py-1 ${
                type === typeOption
                  ? "border-green-600 bg-green-600"
                  : "border-gray-300 dark:border-gray-700"
              }`}
            >
              <Text
                className={
                  type === typeOption
                    ? "text-white"
                    : "text-gray-900 dark:text-white"
                }
              >
                {typeOption.replace("_", " ").toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          placeholder="Billing Day (1-31)"
          value={billingDay}
          onChangeText={setBillingDay}
          keyboardType="number-pad"
          className="mb-4 rounded-md bg-gray-100 px-3 py-2 text-gray-900 dark:bg-gray-700 dark:text-white"
          maxLength={2}
        />

        <TextInput
          placeholder="Grace Period Days"
          value={gracePeriod}
          onChangeText={setGracePeriod}
          keyboardType="number-pad"
          className="mb-4 rounded-md bg-gray-100 px-3 py-2 text-gray-900 dark:bg-gray-700 dark:text-white"
          maxLength={3}
        />

        <View className="mb-4 flex-row items-center">
          <Text className="mr-4 text-gray-900 dark:text-white">Active</Text>
          <TouchableOpacity onPress={() => setActive(!active)}>
            <View
              className={`h-6 w-10 rounded-full ${
                active ? "bg-green-500" : "bg-gray-400"
              }`}
            >
              <View
                className={`mt-0.5 h-5 w-5 rounded-full bg-white ml-${
                  active ? "5" : "0"
                } transition`}
              ></View>
            </View>
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-end">
          <TouchableOpacity
            onPress={onClose}
            className="mr-4 rounded-md bg-gray-300 px-4 py-2 dark:bg-gray-700"
          >
            <Text className="text-gray-700 dark:text-gray-300">Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleCreate}
            className="rounded-md bg-green-600 px-4 py-2"
          >
            <Text className="font-semibold text-white">Create</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

export default function Account() {
  const [accountData, setAccountData] = useState<AccountType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { token, user, logout } = useAuthStore();

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const { data: res } = await axios.get<AccountType[]>(
        `${API_URL}/accounts`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setAccountData(res);
      console.log("Token:", token);
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 401) {
          logout();
        }
        console.log(error.response?.status, error.response?.data);
      }
    } finally {
      setLoading(false);
    }
  }, [logout, token]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleAddAccount = async (newAccount: {
    name: string;
    type: string;
    billing_day: number;
    grace_period_days: number;
    active: boolean;
  }) => {
    try {
      setLoading(true);
      await axios.post(
        `${API_URL}/accounts`,
        {
          user_id: user?.id,
          ...newAccount,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setModalVisible(false);
      fetchAccounts();
    } catch (error) {
      if (isAxiosError(error)) {
        Alert.alert(
          "Error",
          `Failed to create account: ${error.response?.data || error.message}`,
        );
      } else {
        Alert.alert("Error", "An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const renderAccountItem = ({ item }: { item: AccountType }) => (
    <View className="my-2 w-80 rounded-lg bg-white p-4 shadow-md dark:bg-gray-800">
      <Text className="text-lg font-semibold text-gray-900 dark:text-white">
        {item.name}
      </Text>
      <Text className="text-sm text-gray-600 dark:text-gray-300">
        Type: {item.type}
      </Text>
      <Text className="text-sm text-gray-600 dark:text-gray-300">
        Billing Day: {item.billing_day}
      </Text>
      <Text className="text-sm text-gray-600 dark:text-gray-300">
        Grace Period: {item.grace_period_days} days
      </Text>
      <Text className="text-sm text-gray-600 dark:text-gray-300">
        Active: {item.active ? "Yes" : "No"}
      </Text>
      <Text className="mt-2 text-xs text-gray-400 dark:text-gray-500">
        Created: {new Date(item.created_at).toLocaleDateString()}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Text className="text-gray-800 dark:text-white">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 px-4 dark:bg-gray-900 ">
      {/* <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        Accounts
      </Text> */}

      <FlatList
        data={accountData}
        keyExtractor={(item) => item.id.toString()}
        onRefresh={fetchAccounts}
        refreshing={loading}
        renderItem={renderAccountItem}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text className="mt-10 text-center text-gray-800 dark:text-white">
            No accounts found.
          </Text>
        }
      />

      <Animated.View
        entering={SlideInDown.delay(300).springify()}
        className="absolute bottom-6 right-6"
      >
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
          className="h-16 w-16 items-center justify-center rounded-full bg-green-600 shadow-lg"
          style={{
            shadowColor: "#22c55e",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Text className="text-3xl font-light text-white">+</Text>
        </TouchableOpacity>
      </Animated.View>

      <AddAccountModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleAddAccount}
      />
    </View>
  );
}
