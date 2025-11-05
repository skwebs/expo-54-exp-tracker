import { API_URL } from "@/Constants";
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
const verifyOtpSchema = z.object({
  otp: z
    .string()
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;

export default function VerifyOtp(): JSX.Element {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();

  const [serverError, setServerError] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm<VerifyOtpFormData>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      otp: "",
    },
  });

  /* ✅ Submit Handler - Verify OTP */
  const onSubmit = async (data: VerifyOtpFormData) => {
    setServerError({});
    setLoading(true);

    try {
      const { data: res } = await axios.post(
        `${API_URL}/verify-reset-otp`,
        {
          email,
          otp: data.otp,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // Store reset token securely
      await SecureStore.setItemAsync("reset_token", res.reset_token);

      Toast.show({
        type: "success",
        text1: "OTP Verified",
        text2: res.message || "Please set your new password.",
      });

      // Navigate to reset password screen with email
      setTimeout(() => {
        router.push({
          pathname: "/reset-password",
          params: { email },
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
        } else if (status === 400) {
          Toast.show({
            type: "error",
            text1: "Invalid OTP",
            text2:
              responseData?.message ||
              "The OTP you entered is incorrect or expired.",
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

  /* ✅ Resend OTP Handler */
  const handleResendOTP = async () => {
    setResendLoading(true);

    try {
      const { data: res } = await axios.post(
        `${API_URL}/forgot-password`,
        { email },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      Toast.show({
        type: "success",
        text1: "OTP Resent",
        text2: res.message || "Please check your email inbox.",
      });
    } catch (error) {
      if (isAxiosError(error)) {
        const responseData = error.response?.data;
        Toast.show({
          type: "error",
          text1: "Resend Failed",
          text2: responseData?.message || "Could not resend OTP.",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Network Error",
          text2: "Please check your internet connection.",
        });
      }
    } finally {
      setResendLoading(false);
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
          Verify OTP
        </Text>

        {/* ✅ Display Email */}
        <Text className="mb-8 text-sm text-gray-600 text-center">
          We&apos;ve sent a 6-digit OTP to{"\n"}
          <Text className="font-semibold text-gray-800">{email}</Text>
        </Text>

        {/* ✅ OTP Input */}
        <Controller
          control={control}
          name="otp"
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="w-full mb-2">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                OTP Code
              </Text>
              <TextInput
                className={`border rounded-lg px-4 py-3 text-gray-700 text-center tracking-widest text-2xl focus:border-gray-400 ${
                  errors.otp || serverError?.otp
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="000000"
                keyboardType="number-pad"
                maxLength={6}
                onBlur={onBlur}
                onChangeText={(text) => {
                  onChange(text);
                  setServerError({});
                }}
                value={value}
              />
              <Text className="text-red-500 text-xs my-1">
                {errors.otp?.message || serverError?.otp?.[0] || ""}
              </Text>
            </View>
          )}
        />

        {/* ✅ Resend OTP Link */}
        <View className="flex-row items-center justify-center mb-6">
          <Text className="text-gray-600 text-sm">
            Didn&apos;t receive OTP?{" "}
          </Text>
          <TouchableOpacity onPress={handleResendOTP} disabled={resendLoading}>
            <Text
              className={`font-medium text-sm ${
                resendLoading ? "text-orange-300" : "text-orange-500"
              }`}
            >
              {resendLoading ? "Sending..." : "Resend"}
            </Text>
          </TouchableOpacity>
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
            <Text className="text-white font-medium text-base">Verify OTP</Text>
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
            }}
          >
            <Text className="text-orange-500 font-medium text-sm">Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
