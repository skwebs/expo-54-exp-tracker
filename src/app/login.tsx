import { API_URL } from "@/Constants";
import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { isAxiosError } from "axios";
import { useRouter } from "expo-router"; // ✅ Add router for navigation
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 chars"),
});

export default function LoginScreen() {
  const [serverError, setServerError] = useState<{
    email: string[];
    password: string[];
  }>({
    email: [],
    password: [],
  });

  const [showPassword, setShowPassword] = useState(false); // ✅ Password toggle state

  const router = useRouter(); // ✅ Router for navigation

  // Get setAuth action from store ✅
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    setServerError({ email: [], password: [] });

    try {
      const response = await axios.post(`${API_URL}/login`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Store auth data securely in Zustand + SecureStore ✅
      setAuth(response.data.token, response.data.user);

      // Show success toast
      // Toast.show({
      //   type: "success",
      //   text1: "Login Successful",
      //   text2: `Welcome back, ${response.data.user.name}!`,
      // });
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 401) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: error.response?.data?.message || error.message,
          });
        }
        if (error.response?.status === 422) {
          setServerError(
            error.response?.data?.errors || { email: [], password: [] }
          );
          Toast.show({
            type: "error",
            text1: "Validation Error",
            text2: error.response?.data?.message || error.message,
          });
        }
      }
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <Text className="mb-8 text-3xl font-semibold text-gray-800">Sign In</Text>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="w-full">
            <TextInput
              className={`border border-gray-200 rounded-lg px-4 py-3 text-base text-gray-700 ${
                errors.email
                  ? "border-red-600"
                  : serverError?.email?.length > 0 && "border-red-600"
              }`}
              placeholder="Email"
              onBlur={onBlur}
              onChangeText={(text) => {
                onChange(text);
                setServerError({ email: [], password: [] }); // Clear server errors
              }}
              value={value}
              inputMode="email"
              autoCapitalize="none"
            />
            <View className="h-5 mb-2">
              {errors.email ? (
                <Text className="text-red-600 text-xs">
                  {errors.email.message}
                </Text>
              ) : (
                serverError?.email &&
                serverError.email.length > 0 && (
                  <Text className="text-red-600 text-xs">
                    {serverError.email[0]}
                  </Text>
                )
              )}
            </View>
          </View>
        )}
      />

      {/* ✅ Password Field with Toggle */}
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="w-full">
            <View className="relative">
              <TextInput
                className={`border border-gray-200 rounded-lg px-4 py-3 pr-12 text-base text-gray-700 ${
                  errors.password
                    ? "border-red-600"
                    : serverError?.password?.length > 0 && "border-red-600"
                }`}
                placeholder="Password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                className="absolute right-3 top-3"
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={24}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>
            <View className="h-5 mb-2">
              {errors.password && (
                <Text className="text-red-600 text-xs">
                  {errors.password.message}
                </Text>
              )}
            </View>
          </View>
        )}
      />

      {/* Sign In Button */}
      <TouchableOpacity
        className="w-full bg-orange-500 rounded-lg px-4 py-3 items-center mb-4"
        onPress={handleSubmit(onSubmit)}
      >
        <Text className="text-white font-medium text-base">Sign In</Text>
      </TouchableOpacity>

      {/* ✅ Sign Up Button */}
      <View className="flex-row items-center mt-8">
        <Text className="text-gray-600 text-sm">
          Don&lsquo;t have an account?{" "}
        </Text>
        <TouchableOpacity
          onPress={() => {
            router.push("/register");
            clearErrors();
            reset();
            setServerError({ email: [], password: [] });
          }}
        >
          <Text className="text-orange-500 font-medium text-sm">
            Create One
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
