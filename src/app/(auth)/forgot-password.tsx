import { API_URL } from "@/Constants";
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

/* ✅ Validation Schema */
const resetSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type ResetFormData = z.infer<typeof resetSchema>;

export default function ForgotPasswordScreen(): JSX.Element {
  const router = useRouter();

  const [serverError, setServerError] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: "" },
  });

  /* ✅ Submit Handler */
  const onSubmit = async (data: ResetFormData) => {
    setServerError({});
    setLoading(true);

    try {
      const { data: res } = await axios.post(
        `${API_URL}/forgot-password`,
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      Toast.show({
        type: "success",
        text1: "OTP Sent",
        text2: res.message || "Please check your email inbox.",
      });

      // ✅ Navigate to Verify OTP screen with email
      setTimeout(() => {
        router.push({
          pathname: "/verify-otp",
          params: { email: data.email },
        });
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
        } else if (status === 404) {
          Toast.show({
            type: "error",
            text1: "Email Not Found",
            text2: responseData?.message || "No account found with that email.",
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
        Reset Password
      </Text>

      {/* ✅ Email Input */}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="w-full mb-2">
            <TextInput
              className={`border rounded-lg px-4 py-3 text-base text-gray-700 focus:border-gray-400 ${
                errors.email || serverError?.email
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Enter your registered email"
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
          <Text className="text-white font-medium text-base">Send OTP</Text>
        )}
      </TouchableOpacity>

      {/* ✅ Back to Login */}
      <View className="flex-row items-center mt-6">
        <Text className="text-gray-600 text-sm">Remembered password? </Text>
        <TouchableOpacity
          onPress={() => {
            router.replace("/login");
            clearErrors();
            reset();
            setServerError({});
          }}
        >
          <Text className="text-orange-500 font-medium text-sm">Sign In</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
