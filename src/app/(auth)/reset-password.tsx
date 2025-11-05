import { API_URL } from "@/Constants";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { isAxiosError } from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { JSX, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";

/* ✅ Validation Schema */
const resetPasswordSchema = z
  .object({
    new_password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and number"
      ),
    new_password_confirmation: z.string(),
  })
  .refine((data) => data.new_password === data.new_password_confirmation, {
    message: "Passwords don't match",
    path: ["new_password_confirmation"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword(): JSX.Element {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();

  const [serverError, setServerError] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      new_password: "",
      new_password_confirmation: "",
    },
  });

  /* ✅ Submit Handler - Reset Password */
  const onSubmit = async (data: ResetPasswordFormData) => {
    setServerError({});
    setLoading(true);

    try {
      // Retrieve reset token from secure storage
      const resetToken = await SecureStore.getItemAsync("reset_token");

      if (!resetToken) {
        Toast.show({
          type: "error",
          text1: "Session Expired",
          text2: "Please verify OTP again.",
        });
        router.replace("/forgot-password");
        return;
      }

      const { data: res } = await axios.post(
        `${API_URL}/reset-password`,
        {
          reset_token: resetToken,
          new_password: data.new_password,
          new_password_confirmation: data.new_password_confirmation,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // Clear reset token after successful password reset
      await SecureStore.deleteItemAsync("reset_token");

      Toast.show({
        type: "success",
        text1: "Password Reset Successful",
        text2: res.message || "You can now login with your new password.",
      });

      setTimeout(() => {
        router.replace("/login");
      }, 10);
    } catch (error) {
      if (isAxiosError(error)) {
        const status = error.response?.status;
        const responseData = error.response?.data;

        if (status === 422) {
          setServerError(responseData?.errors || {});
          Toast.show({
            type: "error",
            text1: "Validation Error",
            text2: responseData?.message || "Please check your inputs.",
          });
        } else if (status === 400) {
          Toast.show({
            type: "error",
            text1: "Invalid Token",
            text2:
              responseData?.message ||
              "Reset token is invalid or expired. Please try again.",
          });
          // Clear invalid token and redirect
          await SecureStore.deleteItemAsync("reset_token");
          setTimeout(() => {
            router.replace("/forgot-password");
          }, 2000);
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
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 24,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="mb-4 text-3xl font-semibold text-gray-800 text-center">
          Reset Password
        </Text>

        {/* ✅ Display Email */}
        <Text className="mb-8 text-sm text-gray-600 text-center">
          Set a new password for{"\n"}
          <Text className="font-semibold text-gray-800">{email}</Text>
        </Text>

        {/* ✅ New Password Input */}
        <Controller
          control={control}
          name="new_password"
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="w-full mb-2">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                New Password
              </Text>
              <View className="relative">
                <TextInput
                  className={`border rounded-lg px-4 py-3 pr-12 text-base text-gray-700 focus:border-gray-400 ${
                    errors.new_password || serverError?.new_password
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter new password"
                  secureTextEntry={!showNewPassword}
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    onChange(text);
                    setServerError({});
                  }}
                  value={value}
                />
                <TouchableOpacity
                  className="absolute right-4 top-3.5"
                  onPress={() => setShowNewPassword(!showNewPassword)}
                >
                  <Ionicons
                    name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#6b7280"
                  />
                </TouchableOpacity>
              </View>
              <Text className="text-red-500 text-xs my-1">
                {errors.new_password?.message ||
                  serverError?.new_password?.[0] ||
                  ""}
              </Text>
            </View>
          )}
        />

        {/* ✅ Confirm Password Input */}
        <Controller
          control={control}
          name="new_password_confirmation"
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="w-full mb-2">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </Text>
              <View className="relative">
                <TextInput
                  className={`border rounded-lg px-4 py-3 pr-12 text-base text-gray-700 focus:border-gray-400 ${
                    errors.new_password_confirmation ||
                    serverError?.new_password_confirmation
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Confirm new password"
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    onChange(text);
                    setServerError({});
                  }}
                  value={value}
                />
                <TouchableOpacity
                  className="absolute right-4 top-3.5"
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={
                      showConfirmPassword ? "eye-off-outline" : "eye-outline"
                    }
                    size={20}
                    color="#6b7280"
                  />
                </TouchableOpacity>
              </View>
              <Text className="text-red-500 text-xs my-1">
                {errors.new_password_confirmation?.message ||
                  serverError?.new_password_confirmation?.[0] ||
                  ""}
              </Text>
            </View>
          )}
        />

        {/* ✅ Password Requirements */}
        <View className="w-full mb-6 px-2">
          <Text className="text-xs text-gray-500 mb-1">
            Password must contain:
          </Text>
          <Text className="text-xs text-gray-500">• At least 8 characters</Text>
          <Text className="text-xs text-gray-500">
            • Uppercase and lowercase letters
          </Text>
          <Text className="text-xs text-gray-500">• At least one number</Text>
        </View>

        {/* ✅ Submit Button */}
        <TouchableOpacity
          className={`w-full rounded-lg px-4 py-3 items-center mb-4 ${
            loading ? "bg-orange-300" : "bg-orange-500"
          }`}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-medium text-base">
              Reset Password
            </Text>
          )}
        </TouchableOpacity>

        {/* ✅ Back to Login */}
        <View className="flex-row items-center justify-center mt-4 mb-8">
          <Text className="text-gray-600 text-sm">Remembered password? </Text>
          <TouchableOpacity
            onPress={() => {
              router.replace("/login");
              clearErrors();
              reset();
              setServerError({});
              // Clear token if going back to login
              SecureStore.deleteItemAsync("reset_token");
            }}
          >
            <Text className="text-orange-500 font-medium text-sm">Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
