import { API_URL } from "@/Constants";
import { useAuthStore } from "@/store/authStore";
import Ionicons from "@expo/vector-icons/Ionicons"; // ← Expo Vector Icon
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { isAxiosError } from "axios";
import { useRouter } from "expo-router";
import React, { JSX, useState } from "react";
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

/* Validation Schema */
const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
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
  })
  .refine((data) => data.current_password !== data.new_password, {
    message: "New password must be different from current password",
    path: ["new_password"],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordScreen(): JSX.Element {
  const router = useRouter();
  const [serverError, setServerError] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { token } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    },
  });

  /* Submit Handler */
  const onSubmit = async (data: ChangePasswordFormData) => {
    setServerError({});
    setLoading(true);

    try {
      const { data: res } = await axios.post(
        `${API_URL}/change-password`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Toast.show({
        type: "success",
        text1: "Password Changed",
        text2: res.message || "Your password has been updated successfully.",
      });

      reset();
      // added delay to navigate back for showing toast
      setTimeout(() => router.back(), 500);
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
        } else if (status === 401 || status === 400) {
          Toast.show({
            type: "error",
            text1: "Invalid Password",
            text2: responseData?.message || "Current password is incorrect.",
          });
        } else if (status === 403) {
          Toast.show({
            type: "error",
            text1: "Unauthorized",
            text2: "Please login again to change your password.",
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
      <Text className="mb-8 text-3xl font-semibold text-gray-800">
        Change Password
      </Text>

      {/* Current Password */}
      <Controller
        control={control}
        name="current_password"
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="w-full mb-2">
            <View className="relative">
              <TextInput
                className={`border rounded-lg px-4 py-3 pr-12 text-base text-gray-700 focus:border-gray-400 ${
                  errors.current_password || serverError?.current_password
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Enter current password"
                secureTextEntry={!showCurrentPassword}
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
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={showCurrentPassword ? "eye-off" : "eye"}
                  size={22}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>
            <Text className="text-red-500 text-xs my-1">
              {errors.current_password?.message ||
                serverError?.current_password?.[0] ||
                ""}
            </Text>
          </View>
        )}
      />

      {/* New Password */}
      <Controller
        control={control}
        name="new_password"
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="w-full mb-2">
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
                activeOpacity={0.7}
              >
                <Ionicons
                  name={showNewPassword ? "eye-off" : "eye"}
                  size={22}
                  color="#6B7280"
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

      {/* Confirm New Password */}
      <Controller
        control={control}
        name="new_password_confirmation"
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="w-full mb-2">
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
                activeOpacity={0.7}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={22}
                  color="#6B7280"
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

      {/* Password Requirements */}
      <View className="w-full mb-4 px-2">
        <Text className="text-xs text-gray-500 mb-1">
          Password must contain:
        </Text>
        <Text className="text-xs text-gray-500">• At least 8 characters</Text>
        <Text className="text-xs text-gray-500">
          • Uppercase and lowercase letters
        </Text>
        <Text className="text-xs text-gray-500">• At least one number</Text>
      </View>

      {/* Submit Button */}
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
            Change Password
          </Text>
        )}
      </TouchableOpacity>

      {/* Cancel Button */}
      <TouchableOpacity
        className="w-full rounded-lg px-4 py-3 items-center border border-gray-300"
        onPress={() => {
          clearErrors();
          reset();
          setServerError({});
          router.back();
        }}
        activeOpacity={0.8}
      >
        <Text className="text-gray-700 font-medium text-base">Cancel</Text>
      </TouchableOpacity>

      {/* Forgot Password Link */}
      {/* <View className="flex-row items-center mt-6">
        <Text className="text-gray-600 text-sm">Forgot password? </Text>
        <TouchableOpacity
          onPress={() => {
            router.push("/verify-otp-reset-password");
            clearErrors();
            reset();
            setServerError({});
          }}
        >
          <Text className="text-orange-500 font-medium text-sm">
            Reset Password
          </Text>
        </TouchableOpacity>
      </View> */}
    </KeyboardAvoidingView>
  );
}
