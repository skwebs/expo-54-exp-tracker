import { API_URL } from "@/Constants";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { isAxiosError } from "axios";
import { useRouter } from "expo-router";
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
const UpdateDetailsSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters"),
  email: z.string().email("Enter a valid email address"),
});

type UpdateDetailsFormData = z.infer<typeof UpdateDetailsSchema>;

export default function UpdateDetailsScreen(): JSX.Element {
  const router = useRouter();
  const { user, updateUser, token } = useAuthStore();

  const [serverError, setServerError] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    clearErrors,
    reset,
  } = useForm<UpdateDetailsFormData>({
    resolver: zodResolver(UpdateDetailsSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  /* ✅ Submit Handler */
  const onSubmit = async (data: UpdateDetailsFormData) => {
    // Check if any changes were made
    if (data.name === user?.name && data.email === user?.email) {
      Toast.show({
        type: "info",
        text1: "No Changes",
        text2: "You haven't made any changes to your details.",
      });
      return;
    }

    setServerError({});
    setLoading(true);

    try {
      const { data: res } = await axios.post(
        `${API_URL}/update-profile`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            // Add your auth token here
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update user in auth store
      if (res.user) {
        updateUser(res.user);
        handleReset();
      }

      Toast.show({
        type: "success",
        text1: "Details Updated",
        text2: res.message || "Your profile has been updated successfully.",
      });
      // added delay to navigate to settings for showing toast
      setTimeout(() => {
        router.push(`/settings`);
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
        } else if (status === 409) {
          Toast.show({
            type: "error",
            text1: "Email Already Exists",
            text2: responseData?.message || "This email is already registered.",
          });
        } else if (status === 403) {
          Toast.show({
            type: "error",
            text1: "Unauthorized",
            text2: "Please login again to update your details.",
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

  /* ✅ Reset to Original Values */
  const handleReset = () => {
    reset({
      name: user?.name || "",
      email: user?.email || "",
    });
    clearErrors();
    setServerError({});
    Toast.show({
      type: "info",
      text1: "Reset",
      text2: "Changes have been discarded.",
    });
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
        <Text className="mb-8 text-3xl font-semibold text-gray-800 text-center">
          Change Details
        </Text>

        {/* ✅ Name Input */}
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="w-full mb-2">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Full Name
              </Text>
              <TextInput
                className={`border rounded-lg px-4 py-3 text-base text-gray-700 focus:border-gray-400 ${
                  errors.name || serverError?.name
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Enter your full name"
                autoCapitalize="words"
                onBlur={onBlur}
                onChangeText={(text) => {
                  onChange(text);
                  setServerError({});
                }}
                value={value}
              />
              <Text className="text-red-500 text-xs my-1">
                {errors.name?.message || serverError?.name?.[0] || ""}
              </Text>
            </View>
          )}
        />

        {/* ✅ Email Input */}
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="w-full mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Email Address
              </Text>
              <TextInput
                className={`border rounded-lg px-4 py-3 text-base text-gray-700 focus:border-gray-400 ${
                  errors.email || serverError?.email
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Enter your email"
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

        {/* ✅ Info Message */}
        {isDirty && (
          <View className="w-full mb-4 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
            <Text className="text-blue-800 text-sm">
              ℹ️ You have unsaved changes. Make sure to save them before
              leaving.
            </Text>
          </View>
        )}

        {/* ✅ Save Changes Button */}
        <TouchableOpacity
          className={`w-full rounded-lg px-4 py-3 items-center mb-3 ${
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
              Save Changes
            </Text>
          )}
        </TouchableOpacity>

        {/* ✅ Reset Button */}
        {isDirty && (
          <TouchableOpacity
            className="w-full rounded-lg px-4 py-3 items-center mb-3 bg-gray-200"
            onPress={handleReset}
            activeOpacity={0.8}
          >
            <Text className="text-gray-700 font-medium text-base">
              Discard Changes
            </Text>
          </TouchableOpacity>
        )}

        {/* ✅ Cancel Button */}
        <TouchableOpacity
          className="w-full rounded-lg px-4 py-3 items-center border border-gray-300"
          onPress={() => {
            if (isDirty) {
              // Optionally show confirmation dialog
              Toast.show({
                type: "info",
                text1: "Unsaved Changes",
                text2: "Your changes will be lost.",
              });
            }
            // router.push(`/settings`);
            router.back();
          }}
          activeOpacity={0.8}
        >
          <Text className="text-gray-700 font-medium text-base">Cancel</Text>
        </TouchableOpacity>

        {/* ✅ Additional Info */}
        <View className="w-full mt-6 px-2">
          <Text className="text-xs text-gray-500 text-center">
            If you change your email, you may need to verify it before it takes
            effect.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
