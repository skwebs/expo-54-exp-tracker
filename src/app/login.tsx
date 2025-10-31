// import { API_URL } from "@/Constants";
// import { useAuthStore } from "@/store/authStore";
// import { Ionicons } from "@expo/vector-icons";
// import { zodResolver } from "@hookform/resolvers/zod";
// import axios, { isAxiosError } from "axios";
// import { useRouter } from "expo-router";
// import React, { useCallback, useRef, useState } from "react";
// import { Controller, useForm } from "react-hook-form";
// import {
//   ActivityIndicator,
//   Keyboard,
//   KeyboardAvoidingView,
//   Platform,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   View,
// } from "react-native";
// import Toast from "react-native-toast-message";
// import { z } from "zod";

// // ✅ Moved schema outside component to prevent recreation
// const loginSchema = z.object({
//   email: z.string().email("Enter a valid email"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
// });

// type LoginFormData = z.infer<typeof loginSchema>;

// interface ServerErrors {
//   email: string[];
//   password: string[];
// }

// export default function SignInScreen() {
//   const [serverError, setServerError] = useState<ServerErrors>({
//     email: [],
//     password: [],
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const router = useRouter();
//   const setAuth = useAuthStore((state) => state.setAuth);

//   // ✅ Refs for auto-focus management
//   const passwordInputRef = useRef<TextInput>(null);

//   const {
//     control,
//     handleSubmit,
//     formState: { errors, isValid },
//     clearErrors,
//     reset,
//   } = useForm<LoginFormData>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: { email: "", password: "" },
//     mode: "onBlur", // ✅ Better performance: validate only on blur, not on every keystroke
//   });

//   // ✅ Memoized callback to clear server errors
//   const clearServerErrors = useCallback(() => {
//     setServerError({ email: [], password: [] });
//   }, []);

//   // ✅ Memoized callback for password toggle
//   const togglePasswordVisibility = useCallback(() => {
//     setShowPassword((prev) => !prev);
//   }, []);

//   // ✅ Optimized submit handler with better error handling
//   const onSubmit = useCallback(
//     async (data: LoginFormData) => {
//       if (isSubmitting) return; // ✅ Prevent double submission

//       setIsSubmitting(true);
//       clearServerErrors();
//       Keyboard.dismiss(); // ✅ Dismiss keyboard on submit

//       try {
//         const response = await axios.post<{
//           token: string;
//           user: { name: string; email: string };
//         }>(`${API_URL}/login`, data, {
//           headers: {
//             "Content-Type": "application/json",
//           },
//           timeout: 10000, // ✅ Add timeout
//         });

//         // ✅ Store auth data
//         await setAuth(response.data.token, response.data.user);

//         // ✅ Optional: Show success toast
//         Toast.show({
//           type: "success",
//           text1: "Welcome back!",
//           text2: `Logged in as ${response.data.user.name}`,
//           position: "top",
//         });

//         // ✅ Navigation happens automatically via Zustand store watching
//       } catch (error) {
//         if (isAxiosError(error)) {
//           const status = error.response?.status;
//           const errorData = error.response?.data;

//           if (status === 401) {
//             Toast.show({
//               type: "error",
//               text1: "Authentication Failed",
//               text2: errorData?.message || "Invalid email or password",
//               position: "top",
//             });
//           } else if (status === 422) {
//             // ✅ Validation errors
//             const validationErrors = errorData?.errors || {
//               email: [],
//               password: [],
//             };
//             setServerError(validationErrors);

//             Toast.show({
//               type: "error",
//               text1: "Validation Error",
//               text2: errorData?.message || "Please check your input",
//               position: "top",
//             });
//           } else {
//             // ✅ Handle other errors
//             Toast.show({
//               type: "error",
//               text1: "Connection Error",
//               text2: "Unable to connect. Please try again.",
//               position: "top",
//             });
//           }
//         } else {
//           // ✅ Non-Axios errors
//           Toast.show({
//             type: "error",
//             text1: "Error",
//             text2: "An unexpected error occurred",
//             position: "top",
//           });
//         }
//       } finally {
//         setIsSubmitting(false);
//       }
//     },
//     [isSubmitting, clearServerErrors, setAuth]
//   );

//   // ✅ Navigate to register with cleanup
//   const handleNavigateToRegister = useCallback(() => {
//     router.push("/register");
//     clearErrors();
//     reset();
//     clearServerErrors();
//   }, [router, clearErrors, reset, clearServerErrors]);

//   // ✅ Memoized error display logic
//   const getFieldError = useCallback(
//     (fieldName: keyof ServerErrors) => {
//       if (errors[fieldName]) {
//         return errors[fieldName]?.message;
//       }
//       if (serverError[fieldName]?.length > 0) {
//         return serverError[fieldName][0];
//       }
//       return null;
//     },
//     [errors, serverError]
//   );

//   // ✅ Check if field has error
//   const hasFieldError = useCallback(
//     (fieldName: keyof ServerErrors) => {
//       return Boolean(errors[fieldName] || serverError[fieldName]?.length > 0);
//     },
//     [errors, serverError]
//   );

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       className="flex-1"
//     >
//       <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//         <View className="flex-1 justify-center items-center bg-white px-6">
//           <Text className="mb-8 text-3xl font-semibold text-gray-800">
//             Sign In
//           </Text>

//           {/* Email Field */}
//           <Controller
//             control={control}
//             name="email"
//             render={({ field: { onChange, onBlur, value } }) => (
//               <View className="w-full">
//                 <TextInput
//                   className={`border rounded-lg px-4 py-3 text-base text-gray-700 ${
//                     hasFieldError("email")
//                       ? "border-red-600"
//                       : "border-gray-200"
//                   }`}
//                   placeholder="Email"
//                   onBlur={onBlur}
//                   onChangeText={(text) => {
//                     onChange(text);
//                     clearServerErrors();
//                   }}
//                   value={value}
//                   inputMode="email"
//                   autoCapitalize="none"
//                   autoCorrect={false}
//                   keyboardType="email-address"
//                   returnKeyType="next"
//                   onSubmitEditing={() => passwordInputRef.current?.focus()}
//                   editable={!isSubmitting}
//                   accessibilityLabel="Email input"
//                   accessibilityHint="Enter your email address"
//                 />
//                 <View className="h-5 mb-2">
//                   {getFieldError("email") && (
//                     <Text className="text-red-600 text-xs">
//                       {getFieldError("email")}
//                     </Text>
//                   )}
//                 </View>
//               </View>
//             )}
//           />

//           {/* Password Field */}
//           <Controller
//             control={control}
//             name="password"
//             render={({ field: { onChange, onBlur, value } }) => (
//               <View className="w-full">
//                 <View className="relative">
//                   <TextInput
//                     ref={passwordInputRef}
//                     className={`border rounded-lg px-4 py-3 pr-12 text-base text-gray-700 ${
//                       hasFieldError("password")
//                         ? "border-red-600"
//                         : "border-gray-200"
//                     }`}
//                     placeholder="Password"
//                     onBlur={onBlur}
//                     onChangeText={(text) => {
//                       onChange(text);
//                       clearServerErrors();
//                     }}
//                     value={value}
//                     secureTextEntry={!showPassword}
//                     returnKeyType="done"
//                     onSubmitEditing={handleSubmit(onSubmit)}
//                     editable={!isSubmitting}
//                     accessibilityLabel="Password input"
//                     accessibilityHint="Enter your password"
//                   />
//                   <TouchableOpacity
//                     className="absolute right-3 top-3"
//                     onPress={togglePasswordVisibility}
//                     disabled={isSubmitting}
//                     accessibilityLabel={
//                       showPassword ? "Hide password" : "Show password"
//                     }
//                     accessibilityRole="button"
//                   >
//                     <Ionicons
//                       name={showPassword ? "eye-off" : "eye"}
//                       size={24}
//                       color={isSubmitting ? "#D1D5DB" : "#9CA3AF"}
//                     />
//                   </TouchableOpacity>
//                 </View>
//                 <View className="h-5 mb-2">
//                   {getFieldError("password") && (
//                     <Text className="text-red-600 text-xs">
//                       {getFieldError("password")}
//                     </Text>
//                   )}
//                 </View>
//               </View>
//             )}
//           />

//           {/* Sign In Button */}
//           <TouchableOpacity
//             className={`w-full rounded-lg px-4 py-3 items-center justify-center mb-4 ${
//               isSubmitting ? "bg-orange-400" : "bg-orange-500"
//             }`}
//             onPress={handleSubmit(onSubmit)}
//             disabled={isSubmitting}
//             accessibilityLabel="Sign in button"
//             accessibilityRole="button"
//             accessibilityState={{ disabled: isSubmitting }}
//           >
//             <View className="flex-row items-center justify-center min-h-[24px]">
//               {isSubmitting ? (
//                 <ActivityIndicator color="#ffffff" size="small" />
//               ) : (
//                 <Text className="text-white font-medium text-base">
//                   Sign In
//                 </Text>
//               )}
//             </View>
//           </TouchableOpacity>

//           {/* Sign Up Link */}
//           <View className="flex-row items-center mt-8">
//             <Text className="text-gray-600 text-sm">
//               Don&apos;t have an account?{" "}
//             </Text>
//             <TouchableOpacity
//               onPress={handleNavigateToRegister}
//               disabled={isSubmitting}
//               accessibilityLabel="Create account"
//               accessibilityRole="button"
//             >
//               <Text
//                 className={`font-medium text-sm ${
//                   isSubmitting ? "text-orange-400" : "text-orange-500"
//                 }`}
//               >
//                 Create One
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </TouchableWithoutFeedback>
//     </KeyboardAvoidingView>
//   );
// }

// import { API_URL } from "@/Constants";
// import { useAuthStore } from "@/store/authStore";
// import { Ionicons } from "@expo/vector-icons";
// import { zodResolver } from "@hookform/resolvers/zod";
// import axios, { isAxiosError } from "axios";
// import { useRouter } from "expo-router";
// import React, { useState } from "react";
// import { Controller, useForm } from "react-hook-form";
// import {
//   ActivityIndicator,
//   KeyboardAvoidingView,
//   Platform,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import Toast from "react-native-toast-message";
// import { z } from "zod";

// /* ✅ Validation Schema */
// const loginSchema = z.object({
//   email: z.string().email("Enter a valid email"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
// });

// type LoginFormData = z.infer<typeof loginSchema>;

// export default function SignInScreen() {
//   const router = useRouter();
//   const setAuth = useAuthStore((state) => state.setAuth);

//   const [showPassword, setShowPassword] = useState(false);
//   const [serverError, setServerError] = useState<Record<string, string[]>>({});
//   const [loading, setLoading] = useState(false);

//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//     clearErrors,
//     reset,
//   } = useForm<LoginFormData>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: { email: "", password: "" },
//   });

//   /* ✅ Form Submit Handler */
//   const onSubmit = async (data: LoginFormData) => {
//     setServerError({});
//     setLoading(true);

//     try {
//       const { data: res } = await axios.post(`${API_URL}/login`, data, {
//         headers: { "Content-Type": "application/json" },
//       });

//       // Save auth data in Zustand store
//       setAuth(await res.token, await res.user);

//       Toast.show({
//         type: "success",
//         text1: "Login Successful",
//         text2: `Welcome back, ${res.user.name}!`,
//       });

//       // Navigate to home/dashboard
//       router.replace("/(tabs)");
//     } catch (error) {
//       if (isAxiosError(error)) {
//         const status = error.response?.status;
//         const responseData = error.response?.data;

//         if (status === 401) {
//           Toast.show({
//             type: "error",
//             text1: "Invalid Credentials",
//             text2: responseData?.message || "Incorrect email or password.",
//           });
//         } else if (status === 422) {
//           setServerError(responseData?.errors || {});
//           Toast.show({
//             type: "error",
//             text1: "Validation Error",
//             text2: responseData?.message || "Please check your inputs.",
//           });
//         } else {
//           Toast.show({
//             type: "error",
//             text1: "Server Error",
//             text2: responseData?.message || "Something went wrong.",
//           });
//         }
//       } else {
//         Toast.show({
//           type: "error",
//           text1: "Network Error",
//           text2: "Please check your internet connection.",
//         });
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       className="flex-1 justify-center items-center bg-white px-6"
//       behavior={Platform.OS === "ios" ? "padding" : undefined}
//     >
//       <Text className="mb-8 text-3xl font-semibold text-gray-800">Sign In</Text>

//       {/* ✅ Email Input */}
//       <Controller
//         control={control}
//         name="email"
//         render={({ field: { onChange, onBlur, value } }) => (
//           <View className="w-full mb-2">
//             <TextInput
//               className={`border rounded-lg px-4 py-3 text-base text-gray-700 focus:border-gray-400  ${
//                 errors.email || serverError?.email
//                   ? "border-red-500 "
//                   : "border-gray-300"
//               }`}
//               placeholder="Email"
//               keyboardType="email-address"
//               autoCapitalize="none"
//               onBlur={onBlur}
//               onChangeText={(text) => {
//                 onChange(text);
//                 setServerError({});
//               }}
//               value={value}
//             />
//             <Text className="text-red-500 text-xs my-1">
//               {errors.email?.message || serverError?.email?.[0] || ""}
//             </Text>
//           </View>
//         )}
//       />

//       {/* ✅ Password Input */}
//       <Controller
//         control={control}
//         name="password"
//         render={({ field: { onChange, onBlur, value } }) => (
//           <View className="w-full mb-2">
//             <View className="relative">
//               <TextInput
//                 className={`border rounded-lg px-4 py-3 pr-12 text-base text-gray-700 focus:border-gray-400 ${
//                   errors.password || serverError?.password
//                     ? "border-red-500"
//                     : "border-gray-300"
//                 }`}
//                 placeholder="Password"
//                 secureTextEntry={!showPassword}
//                 onBlur={onBlur}
//                 onChangeText={(text) => {
//                   onChange(text);
//                   setServerError({});
//                 }}
//                 value={value}
//               />
//               <TouchableOpacity
//                 className="absolute right-3 top-3"
//                 onPress={() => setShowPassword((prev) => !prev)}
//               >
//                 <Ionicons
//                   name={showPassword ? "eye-off" : "eye"}
//                   size={24}
//                   color="#9CA3AF"
//                 />
//               </TouchableOpacity>
//             </View>
//             <Text className="text-red-500 text-xs my-1">
//               {errors.password?.message || serverError?.password?.[0] || ""}
//             </Text>
//           </View>
//         )}
//       />

//       {/* ✅ Sign In Button */}
//       <TouchableOpacity
//         className={`w-full rounded-lg px-4 py-3 items-center mb-4 ${
//           loading ? "bg-orange-300" : "bg-orange-500"
//         }`}
//         onPress={handleSubmit(onSubmit)}
//         disabled={loading}
//       >
//         {loading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text className="text-white font-medium text-base">Sign In</Text>
//         )}
//       </TouchableOpacity>

//       {/* ✅ Navigation to Register */}
//       <View className="flex-row items-center mt-8">
//         <Text className="text-gray-600 text-sm">Don’t have an account? </Text>
//         <TouchableOpacity
//           onPress={() => {
//             router.push("/register");
//             clearErrors();
//             reset();
//             setServerError({});
//           }}
//         >
//           <Text className="text-orange-500 font-medium text-sm">
//             Create One
//           </Text>
//         </TouchableOpacity>
//       </View>
//       {/* ✅ Navigation to reset-password */}
//       <View className="flex-row items-center mt-8">
//         <Text className="text-gray-600 text-sm">Forgot password? </Text>
//         <TouchableOpacity
//           onPress={() => {
//             router.push("/reset-password");
//             clearErrors();
//             reset();
//             setServerError({});
//           }}
//         >
//           <Text className="text-orange-500 font-medium text-sm">
//             Reset Password
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

import { API_URL } from "@/Constants";
import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
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
      router.replace("/(tabs)");
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
            router.push("/reset-password");
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
