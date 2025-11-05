// import { API_URL } from "@/Constants";
// import { useAuthStore } from "@/store/authStore";
// import { Ionicons } from "@expo/vector-icons";
// import { zodResolver } from "@hookform/resolvers/zod";
// import axios, { isAxiosError } from "axios";
// import { useRouter } from "expo-router";
// import React, { useState } from "react";
// import { Controller, useForm } from "react-hook-form";
// import { Text, TextInput, TouchableOpacity, View } from "react-native";
// import Toast from "react-native-toast-message";
// import { z } from "zod";

// const registerSchema = z
//   .object({
//     name: z.string().min(2, "Name must be at least 2 characters"),
//     email: z.string().email("Enter a valid email"),
//     password: z.string().min(6, "Password must be at least 6 chars"),
//     confirmPassword: z.string().min(6, "Password must be at least 6 chars"),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords do not match",
//     path: ["confirmPassword"],
//   });

// export default function RegisterScreen() {
//   const router = useRouter();
//   const [serverError, setServerError] = useState<{
//     name: string[];
//     email: string[];
//     password: string[];
//   }>({
//     name: [],
//     email: [],
//     password: [],
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   // Get setAuth action from store
//   const setAuth = useAuthStore((state) => state.setAuth);

//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm({
//     resolver: zodResolver(registerSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//     },
//   });

//   const onSubmit = async (data: {
//     name: string;
//     email: string;
//     password: string;
//     confirmPassword: string;
//   }) => {
//     setServerError({ name: [], email: [], password: [] });

//     try {
//       const response = await axios.post(
//         `${API_URL}/register`,
//         {
//           name: data.name,
//           email: data.email,
//           password: data.password,
//           password_confirmation: data.confirmPassword,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       // Store auth data securely in Zustand + SecureStore
//       setAuth(response.data.token, response.data.user);

//       Toast.show({
//         type: "success",
//         text1: "Registration Successful",
//         text2: `Welcome, ${response.data.user.name}!`,
//       });
//     } catch (error) {
//       if (isAxiosError(error)) {
//         if (error.response?.status === 422) {
//           setServerError(
//             error.response?.data?.errors || {
//               name: [],
//               email: [],
//               password: [],
//             }
//           );
//           Toast.show({
//             type: "error",
//             text1: "Validation Error",
//             text2: error.response?.data?.message || error.message,
//           });
//         } else {
//           Toast.show({
//             type: "error",
//             text1: "Error",
//             text2: error.response?.data?.message || error.message,
//           });
//         }
//       }
//     }
//   };

//   return (
//     <View className="flex-1 justify-center items-center bg-white px-6">
//       <Text className="mb-8 text-3xl font-semibold text-gray-800">
//         Create Account
//       </Text>

//       {/* Name Field */}
//       <Controller
//         control={control}
//         name="name"
//         render={({ field: { onChange, onBlur, value } }) => (
//           <View className="w-full">
//             <TextInput
//               className={`border border-gray-200 rounded-lg px-4 py-3 text-base text-gray-700 ${
//                 errors.name
//                   ? "border-red-600"
//                   : serverError?.name?.length > 0 && "border-red-600"
//               }`}
//               placeholder="Full Name"
//               onBlur={onBlur}
//               onChangeText={(text) => {
//                 onChange(text);
//                 setServerError({ name: [], email: [], password: [] });
//               }}
//               value={value}
//               autoCapitalize="words"
//             />
//             <View className="h-5 mb-2">
//               {errors.name ? (
//                 <Text className="text-red-600 text-xs">
//                   {errors.name.message}
//                 </Text>
//               ) : (
//                 serverError?.name &&
//                 serverError.name.length > 0 && (
//                   <Text className="text-red-600 text-xs">
//                     {serverError.name[0]}
//                   </Text>
//                 )
//               )}
//             </View>
//           </View>
//         )}
//       />

//       {/* Email Field */}
//       <Controller
//         control={control}
//         name="email"
//         render={({ field: { onChange, onBlur, value } }) => (
//           <View className="w-full">
//             <TextInput
//               className={`border border-gray-200 rounded-lg px-4 py-3 text-base text-gray-700 ${
//                 errors.email
//                   ? "border-red-600"
//                   : serverError?.email?.length > 0 && "border-red-600"
//               }`}
//               placeholder="Email"
//               onBlur={onBlur}
//               onChangeText={(text) => {
//                 onChange(text);
//                 setServerError({ name: [], email: [], password: [] });
//               }}
//               value={value}
//               inputMode="email"
//               autoCapitalize="none"
//             />
//             <View className="h-5 mb-2">
//               {errors.email ? (
//                 <Text className="text-red-600 text-xs">
//                   {errors.email.message}
//                 </Text>
//               ) : (
//                 serverError?.email &&
//                 serverError.email.length > 0 && (
//                   <Text className="text-red-600 text-xs">
//                     {serverError.email[0]}
//                   </Text>
//                 )
//               )}
//             </View>
//           </View>
//         )}
//       />

//       {/* Password Field with Toggle */}
//       <Controller
//         control={control}
//         name="password"
//         render={({ field: { onChange, onBlur, value } }) => (
//           <View className="w-full">
//             <View className="relative">
//               <TextInput
//                 className={`border border-gray-200 rounded-lg px-4 py-3 pr-12 text-base text-gray-700 ${
//                   errors.password
//                     ? "border-red-600"
//                     : serverError?.password?.length > 0 && "border-red-600"
//                 }`}
//                 placeholder="Password"
//                 onBlur={onBlur}
//                 onChangeText={(text) => {
//                   onChange(text);
//                   setServerError({ name: [], email: [], password: [] });
//                 }}
//                 value={value}
//                 secureTextEntry={!showPassword}
//               />
//               <TouchableOpacity
//                 className="absolute right-3 top-3"
//                 onPress={() => setShowPassword(!showPassword)}
//               >
//                 <Ionicons
//                   name={showPassword ? "eye-off" : "eye"}
//                   size={24}
//                   color="#9CA3AF"
//                 />
//               </TouchableOpacity>
//             </View>
//             <View className="h-5 mb-2">
//               {errors.password ? (
//                 <Text className="text-red-600 text-xs">
//                   {errors.password.message}
//                 </Text>
//               ) : (
//                 serverError?.password &&
//                 serverError.password.length > 0 && (
//                   <Text className="text-red-600 text-xs">
//                     {serverError.password[0]}
//                   </Text>
//                 )
//               )}
//             </View>
//           </View>
//         )}
//       />

//       {/* Confirm Password Field with Toggle */}
//       <Controller
//         control={control}
//         name="confirmPassword"
//         render={({ field: { onChange, onBlur, value } }) => (
//           <View className="w-full">
//             <View className="relative">
//               <TextInput
//                 className={`border border-gray-200 rounded-lg px-4 py-3 pr-12 text-base text-gray-700 ${
//                   errors.confirmPassword && "border-red-600"
//                 }`}
//                 placeholder="Confirm Password"
//                 onBlur={onBlur}
//                 onChangeText={onChange}
//                 value={value}
//                 secureTextEntry={!showConfirmPassword}
//               />
//               <TouchableOpacity
//                 className="absolute right-3 top-3"
//                 onPress={() => setShowConfirmPassword(!showConfirmPassword)}
//               >
//                 <Ionicons
//                   name={showConfirmPassword ? "eye-off" : "eye"}
//                   size={24}
//                   color="#9CA3AF"
//                 />
//               </TouchableOpacity>
//             </View>
//             <View className="h-5 mb-2">
//               {errors.confirmPassword && (
//                 <Text className="text-red-600 text-xs">
//                   {errors.confirmPassword.message}
//                 </Text>
//               )}
//             </View>
//           </View>
//         )}
//       />
//       <TouchableOpacity
//         className="w-full bg-orange-500 rounded-lg px-4 py-3 items-center mb-4"
//         onPress={handleSubmit(onSubmit)}
//       >
//         <Text className="text-white font-medium text-base">Create Account</Text>
//       </TouchableOpacity>

//       {/* ✅ Sign In Button */}
//       <View className="flex-row items-center mt-8">
//         <Text className="text-gray-600 text-sm">Already have an account? </Text>
//         <TouchableOpacity
//           onPress={() => {
//             router.back();
//             // router.push("/login");
//             reset();
//             setServerError({ name: [], email: [], password: [] });
//           }}
//         >
//           <Text className="text-orange-500 font-medium text-sm">Sign In</Text>
//         </TouchableOpacity>
//         {/* <TouchableOpacity onPress={() => router.push("/login")}>
//           <Text className="text-orange-500 font-medium text-sm">Sign In</Text>
//         </TouchableOpacity> */}
//       </View>
//     </View>
//   );
// }
import { API_URL } from "@/Constants";
import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
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
  }) => (
    <View className="w-full">
      <View className="relative">
        <TextInput
          className={`border rounded-lg px-4 py-3 pr-12 text-base text-gray-700 ${
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
      <View className="h-5 mb-2">
        {error && <Text className="text-red-600 text-xs">{error}</Text>}
      </View>
    </View>
  )
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
          }
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
    [isSubmitting, setAuth, reset]
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
    [serverError]
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
          <Text className="mb-8 text-3xl font-semibold text-gray-800 text-center">
            Create Account
          </Text>

          {/* ✅ Name Field */}
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <View className="w-full">
                <TextInput
                  className={`border rounded-lg px-4 py-3 text-base text-gray-700 ${
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
                <View className="h-5 mb-2">
                  {(errors.name?.message || getServerError("name")) && (
                    <Text className="text-red-600 text-xs">
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
                  className={`border rounded-lg px-4 py-3 text-base text-gray-700 ${
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
                <View className="h-5 mb-2">
                  {(errors.email?.message || getServerError("email")) && (
                    <Text className="text-red-600 text-xs">
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
                onChangeText={onChange}
                error={errors.confirmPassword?.message}
                showPassword={showConfirmPassword}
                toggleShowPassword={toggleConfirmPassword}
              />
            )}
          />

          {/* ✅ Submit Button with Loading State */}
          <TouchableOpacity
            className={`w-full bg-orange-500 rounded-lg px-4 py-3 items-center mb-4 ${
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
              <Text className="text-white font-medium text-base">
                Create Account
              </Text>
            )}
          </TouchableOpacity>

          {/* ✅ Sign In Button */}
          <View className="flex-row items-center justify-center mt-8">
            <Text className="text-gray-600 text-sm">
              Already have an account?{" "}
            </Text>
            <TouchableOpacity
              onPress={navigateToLogin}
              disabled={isSubmitting}
              accessibilityLabel="Sign In"
              accessibilityRole="button"
            >
              <Text className="text-orange-500 font-medium text-sm">
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
