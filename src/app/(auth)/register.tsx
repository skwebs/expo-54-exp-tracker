import { API_URL } from "@/Constants";
import { useAuthStore } from "@/store/authStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { isAxiosError } from "axios";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Keyboard,
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

// ✅ Define schema outside component to prevent recreating on each render
const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 chars"),
    confirmPassword: z.string().min(6, "Password must be at least 6 chars"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

// ✅ Define server error type
interface ServerErrorResponse {
  name?: string[];
  email?: string[];
  password?: string[];
  confirmPassword?: string[];
}

// ✅ Extracted Password Input Component for reusability
interface PasswordInputProps {
  value: string;
  placeholder: string;
  onBlur: () => void;
  onChangeText: (text: string) => void;
  error?: string;
  showPassword: boolean;
  toggleShowPassword: () => void;
  editable?: boolean;
}

const PasswordInput = React.memo<PasswordInputProps>(
  ({
    value,
    placeholder,
    onBlur,
    onChangeText,
    error,
    showPassword,
    toggleShowPassword,
    editable = true,
  }) => (
    <View className="w-full">
      <View className="relative">
        <TextInput
          className={`rounded-lg border px-4 py-3 pr-12 text-base text-gray-700 ${
            error ? "border-red-600" : "border-gray-200"
          }`}
          placeholder={placeholder}
          onBlur={onBlur}
          onChangeText={onChangeText}
          value={value}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="password"
          accessibilityLabel={placeholder}
          editable={editable}
        />
        <TouchableOpacity
          className="absolute right-3 top-3"
          onPress={toggleShowPassword}
          accessibilityLabel={showPassword ? "Hide password" : "Show password"}
          accessibilityRole="button"
        >
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="#9CA3AF"
          />
        </TouchableOpacity>
      </View>
      <View className="mb-2 h-5">
        {error && <Text className="text-xs text-red-600">{error}</Text>}
      </View>
    </View>
  ),
);

PasswordInput.displayName = "PasswordInput";

export default function RegisterScreen() {
  const router = useRouter();
  const [serverError, setServerError] = useState<ServerErrorResponse>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Get setAuth action from store
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur", // ✅ Only validate on blur for better performance
  });

  // ✅ Memoized callbacks for better performance
  const clearServerErrors = useCallback(() => {
    setServerError({});
  }, []);

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const toggleConfirmPassword = useCallback(() => {
    setShowConfirmPassword((prev) => !prev);
  }, []);

  // ✅ Optimized submit handler with proper error handling
  const onSubmit = useCallback(
    async (data: RegisterFormData) => {
      // ✅ Prevent double submission
      if (isSubmitting) return;

      setIsSubmitting(true);
      setServerError({});
      Keyboard.dismiss(); // ✅ Dismiss keyboard on submit

      try {
        const response = await axios.post(
          `${API_URL}/register`,
          {
            name: data.name,
            email: data.email,
            password: data.password,
            password_confirmation: data.confirmPassword,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            timeout: 10000, // ✅ Add timeout to prevent hanging
          },
        );

        // ✅ Store auth data securely in Zustand + SecureStore
        await setAuth(response.data.token, response.data.user);

        Toast.show({
          type: "success",
          text1: "Registration Successful",
          text2: `Welcome, ${response.data.user.name}!`,
          position: "top",
        });

        // ✅ Reset form after successful registration
        reset();

        // ✅ Navigate to main app (adjust route as needed)
        // router.replace("/(tabs)"); // Uncomment and adjust route
      } catch (error) {
        if (isAxiosError(error)) {
          if (error.response?.status === 422) {
            // ✅ Validation errors from server
            const errors = error.response?.data?.errors || {};
            setServerError(errors);

            Toast.show({
              type: "error",
              text1: "Validation Error",
              text2:
                error.response?.data?.message || "Please check your inputs",
              position: "top",
            });
          } else if (error.code === "ECONNABORTED") {
            // ✅ Timeout error
            Toast.show({
              type: "error",
              text1: "Connection Timeout",
              text2: "Please check your internet connection",
              position: "top",
            });
          } else if (error.code === "ERR_NETWORK") {
            // ✅ Network error
            Toast.show({
              type: "error",
              text1: "Network Error",
              text2: "Unable to connect to server",
              position: "top",
            });
          } else {
            // ✅ Other errors
            Toast.show({
              type: "error",
              text1: "Registration Failed",
              text2: error.response?.data?.message || error.message,
              position: "top",
            });
          }
        } else {
          // ✅ Non-Axios errors
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "An unexpected error occurred",
            position: "top",
          });
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, setAuth, reset],
  );

  // ✅ Memoized navigation handler
  const navigateToLogin = useCallback(() => {
    router.back();
    reset();
    setServerError({});
  }, [router, reset]);

  // ✅ Get server error for specific field
  const getServerError = useCallback(
    (field: keyof ServerErrorResponse) => {
      return serverError[field]?.[0];
    },
    [serverError],
  );

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        contentContainerClassName="flex-1 justify-center px-6"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="py-8">
          <Text className="mb-8 text-center text-3xl font-semibold text-gray-800">
            Create Account
          </Text>

          {/* ✅ Name Field */}
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <View className="w-full">
                <TextInput
                  className={`rounded-lg border px-4 py-3 text-base text-gray-700 ${
                    errors.name || getServerError("name")
                      ? "border-red-600"
                      : "border-gray-200"
                  }`}
                  placeholder="Full Name"
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    onChange(text);
                    clearServerErrors();
                  }}
                  value={value}
                  autoCapitalize="words"
                  autoCorrect={false}
                  textContentType="name"
                  returnKeyType="next"
                  editable={!isSubmitting}
                  accessibilityLabel="Full Name"
                />
                <View className="mb-2 h-5">
                  {(errors.name?.message || getServerError("name")) && (
                    <Text className="text-xs text-red-600">
                      {errors.name?.message || getServerError("name")}
                    </Text>
                  )}
                </View>
              </View>
            )}
          />

          {/* ✅ Email Field */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <View className="w-full">
                <TextInput
                  className={`rounded-lg border px-4 py-3 text-base text-gray-700 ${
                    errors.email || getServerError("email")
                      ? "border-red-600"
                      : "border-gray-200"
                  }`}
                  placeholder="Email"
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    onChange(text);
                    clearServerErrors();
                  }}
                  value={value}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  textContentType="emailAddress"
                  returnKeyType="next"
                  editable={!isSubmitting}
                  accessibilityLabel="Email"
                />
                <View className="mb-2 h-5">
                  {(errors.email?.message || getServerError("email")) && (
                    <Text className="text-xs text-red-600">
                      {errors.email?.message || getServerError("email")}
                    </Text>
                  )}
                </View>
              </View>
            )}
          />

          {/* ✅ Password Field */}
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <PasswordInput
                value={value}
                placeholder="Password"
                onBlur={onBlur}
                onChangeText={(text) => {
                  onChange(text);
                  clearServerErrors();
                }}
                editable={!isSubmitting}
                error={errors.password?.message || getServerError("password")}
                showPassword={showPassword}
                toggleShowPassword={togglePassword}
              />
            )}
          />

          {/* ✅ Confirm Password Field */}
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <PasswordInput
                value={value}
                placeholder="Confirm Password"
                onBlur={onBlur}
                onChangeText={(text) => {
                  onChange(text);
                  clearServerErrors();
                }}
                error={
                  errors.confirmPassword?.message ||
                  getServerError("confirmPassword")
                }
                showPassword={showConfirmPassword}
                toggleShowPassword={toggleConfirmPassword}
                editable={!isSubmitting}
              />
            )}
          />

          {/* ✅ Submit Button with Loading State */}
          <TouchableOpacity
            className={`mb-4 w-full items-center rounded-lg bg-orange-500 px-4 py-3 ${
              isSubmitting ? "opacity-70" : ""
            }`}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            accessibilityLabel="Create Account"
            accessibilityRole="button"
            accessibilityState={{ disabled: isSubmitting }}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text className="text-base font-medium text-white">
                Create Account
              </Text>
            )}
          </TouchableOpacity>

          {/* ✅ Sign In Button */}
          <View className="mt-8 flex-row items-center justify-center">
            <Text className="text-sm text-gray-600">
              Already have an account?{" "}
            </Text>
            <TouchableOpacity
              onPress={navigateToLogin}
              disabled={isSubmitting}
              accessibilityLabel="Sign In"
              accessibilityRole="button"
            >
              <Text className="text-sm font-medium text-orange-500">
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
