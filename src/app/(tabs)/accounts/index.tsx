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
        `Type must be one of: ${allowedTypes.join(", ")}`
      );
      return;
    }
    const billingDayNum = Number(billingDay);
    if (isNaN(billingDayNum) || billingDayNum < 1 || billingDayNum > 31) {
      Alert.alert(
        "Validation",
        "Billing day must be a number between 1 and 31"
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
    <View className="flex-1 justify-center items-center bg-black/50 px-4 absolute inset-0 z-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md"
      >
        <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Add New Account
        </Text>

        <TextInput
          placeholder="Account Name"
          value={name}
          onChangeText={setName}
          className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md px-3 py-2 mb-4"
        />

        <View className="flex-row flex-wrap mb-4">
          {allowedTypes.map((typeOption) => (
            <TouchableOpacity
              key={typeOption}
              onPress={() => setType(typeOption)}
              className={`px-3 py-1 mr-2 mb-2 rounded-md border ${
                type === typeOption
                  ? "bg-green-600 border-green-600"
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
          className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md px-3 py-2 mb-4"
          maxLength={2}
        />

        <TextInput
          placeholder="Grace Period Days"
          value={gracePeriod}
          onChangeText={setGracePeriod}
          keyboardType="number-pad"
          className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md px-3 py-2 mb-4"
          maxLength={3}
        />

        <View className="flex-row items-center mb-4">
          <Text className="text-gray-900 dark:text-white mr-4">Active</Text>
          <TouchableOpacity onPress={() => setActive(!active)}>
            <View
              className={`w-10 h-6 rounded-full ${
                active ? "bg-green-500" : "bg-gray-400"
              }`}
            >
              <View
                className={`w-5 h-5 rounded-full bg-white mt-0.5 ml-${
                  active ? "5" : "0"
                } transition`}
              ></View>
            </View>
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-end">
          <TouchableOpacity
            onPress={onClose}
            className="px-4 py-2 mr-4 rounded-md bg-gray-300 dark:bg-gray-700"
          >
            <Text className="text-gray-700 dark:text-gray-300">Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleCreate}
            className="px-4 py-2 rounded-md bg-green-600"
          >
            <Text className="text-white font-semibold">Create</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

export default function Account() {
  const [accountData, setAccountData] = useState<AccountType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { token, user } = useAuthStore();

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
        }
      );
      setAccountData(res);
      console.log("Token:", token);
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error.response?.status, error.response?.data);
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

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
        }
      );
      setModalVisible(false);
      fetchAccounts();
    } catch (error) {
      if (isAxiosError(error)) {
        Alert.alert(
          "Error",
          `Failed to create account: ${error.response?.data || error.message}`
        );
      } else {
        Alert.alert("Error", "An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const renderAccountItem = ({ item }: { item: AccountType }) => (
    <View className="bg-white dark:bg-gray-800 rounded-lg p-4 my-2 w-80 shadow-md">
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
      <Text className="text-xs text-gray-400 dark:text-gray-500 mt-2">
        Created: {new Date(item.created_at).toLocaleDateString()}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 dark:bg-gray-900 justify-center items-center">
        <Text className="text-gray-800 dark:text-white">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900 px-4 ">
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
          <Text className="text-center text-gray-800 dark:text-white mt-10">
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
          className="bg-green-600 w-16 h-16 rounded-full items-center justify-center shadow-lg"
          style={{
            shadowColor: "#22c55e",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Text className="text-white text-3xl font-light">+</Text>
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
