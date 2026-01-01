import { API_URL } from "@/Constants";
import { useAuthStore } from "@/store/authStore";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from "@expo/vector-icons/Octicons";
import axios, { isAxiosError } from "axios";
import { Tabs } from "expo-router";
import { useCallback, useEffect } from "react";
import { Alert } from "react-native";
import "react-native-reanimated";

interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

interface UserResponse {
  user: User;
}

export default function TabLayout() {
  const { logout, token } = useAuthStore();
  // const [loading, setLoading] = useState<boolean>(false);
  // const [userData, setUserData] = useState<UserResponse | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      // const { data: res } = await axios.get<UserResponse>(`${API_URL}/me`, {
      await axios.get<UserResponse>(`${API_URL}/me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      // setUserData(res); // no use of it yet, but keeping for future
      // console.log("Token:", token);
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 401) {
          logout();
          Alert.alert("Session Expired", "Please log in again.");
        }
        console.log(error.response?.status, error.response?.data);
      }
    } finally {
      // setLoading(false);
    }
  }, [logout, token]);

  useEffect(() => {
    fetchUser(); // Fetch user data when the component mounts or token changes
  }, [fetchUser]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "teal",
        popToTopOnBlur: true, // added this to pop to top on tab switch
      }}
      // backBehavior="order"
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <AntDesign name="dashboard" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="accounts"
        options={{
          title: "Accounts",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="customer"
        options={{
          title: "Customer",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: "Transactions",
          tabBarIcon: ({ color }) => (
            <Octicons name="arrow-switch" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="gear" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
