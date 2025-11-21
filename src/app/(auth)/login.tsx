import { API_URL } from "@/Constants";
import { useAuthStore } from "@/store/authStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { isAxiosError } from "axios";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";

/* ✅ Validation Schema */
const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function SignInScreen() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  /* ✅ Form Submit Handler */
  const onSubmit = async (data: LoginFormData) => {
    setServerError({});
    setLoading(true);

    try {
      const { data: res } = await axios.post(`${API_URL}/login`, data, {
        headers: { "Content-Type": "application/json" },
      });

      // Save auth data in Zustand store
      setAuth(await res.token, await res.user);

      Toast.show({
        type: "success",
        text1: "Login Successful",
        text2: `Welcome back, ${res.user.name}!`,
      });

      // Navigate to home/dashboard
      // router.replace("/(tabs)");
      console.log("Token:", res.token);
    } catch (error) {
      if (isAxiosError(error)) {
        const status = error.response?.status;
        const responseData = error.response?.data;

        if (status === 401) {
          Toast.show({
            type: "error",
            text1: "Invalid Credentials",
            text2: responseData?.message || "Incorrect email or password.",
          });
        } else if (status === 422) {
          setServerError(responseData?.errors || {});
          Toast.show({
            type: "error",
            text1: "Validation Error",
            text2: responseData?.message || "Please check your inputs.",
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Server Error",
            text2: responseData?.message || "Something went wrong.",
          });
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Network Error",
          text2: "Please check your internet connection.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 justify-center items-center bg-white px-6"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text className="mb-8 text-3xl font-semibold text-gray-800">Sign In</Text>

      {/* ✅ Email Input */}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="w-full mb-2">
            <TextInput
              className={`border rounded-lg px-4 py-3 text-base text-gray-700 focus:border-gray-400  ${
                errors.email || serverError?.email
                  ? "border-red-500 "
                  : "border-gray-300"
              }`}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              onBlur={onBlur}
              onChangeText={(text) => {
                onChange(text);
                setServerError({});
              }}
              value={value}
            />
            <Text className="text-red-500 text-xs my-1">
              {errors.email?.message || serverError?.email?.[0] || ""}
            </Text>
          </View>
        )}
      />

      {/* ✅ Password Input */}
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="w-full mb-2">
            <View className="relative">
              <TextInput
                className={`border rounded-lg px-4 py-3 pr-12 text-base text-gray-700 focus:border-gray-400 ${
                  errors.password || serverError?.password
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Password"
                secureTextEntry={!showPassword}
                onBlur={onBlur}
                onChangeText={(text) => {
                  onChange(text);
                  setServerError({});
                }}
                value={value}
              />
              <TouchableOpacity
                className="absolute right-3 top-3"
                onPress={() => setShowPassword((prev) => !prev)}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={24}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>
            <Text className="text-red-500 text-xs my-1">
              {errors.password?.message || serverError?.password?.[0] || ""}
            </Text>
          </View>
        )}
      />

      {/* ✅ Forgot Password Link */}
      <View className="w-full items-end mb-4">
        <TouchableOpacity
          onPress={() => {
            router.push("/forgot-password");
            clearErrors();
            reset();
            setServerError({});
          }}
        >
          <Text className="text-orange-500 font-medium text-sm">
            Forgot Password?
          </Text>
        </TouchableOpacity>
      </View>

      {/* ✅ Sign In Button */}
      <TouchableOpacity
        className={`w-full rounded-lg px-4 py-3 items-center mb-4 ${
          loading ? "bg-orange-300" : "bg-orange-500"
        }`}
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-medium text-base">Sign In</Text>
        )}
      </TouchableOpacity>

      {/* ✅ Navigation to Register */}
      <View className="flex-row items-center mt-4">
        <Text className="text-gray-600 text-sm">
          Don&apos;t have an account?{" "}
        </Text>
        <TouchableOpacity
          onPress={() => {
            router.push("/register");
            clearErrors();
            reset();
            setServerError({});
          }}
        >
          <Text className="text-orange-500 font-medium text-sm">
            Create One
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
