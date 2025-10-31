import { API_URL } from "@/Constants";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { isAxiosError } from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
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
const verifyAndResetSchema = z
  .object({
    otp: z
      .string()
      .min(6, "OTP must be 6 digits")
      .max(6, "OTP must be 6 digits")
      .regex(/^\d+$/, "OTP must contain only numbers"),
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

type VerifyAndResetFormData = z.infer<typeof verifyAndResetSchema>;

export default function VerifyOtpResetPassword(): JSX.Element {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();

  const [serverError, setServerError] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm<VerifyAndResetFormData>({
    resolver: zodResolver(verifyAndResetSchema),
    defaultValues: {
      otp: "",
      new_password: "",
      new_password_confirmation: "",
    },
  });

  /* ✅ Submit Handler */
  const onSubmit = async (data: VerifyAndResetFormData) => {
    setServerError({});
    setLoading(true);

    try {
      const { data: res } = await axios.post(
        `${API_URL}/verify-otp-and-reset-password`,
        {
          email,
          otp: data.otp,
          new_password: data.new_password,
          new_password_confirmation: data.new_password_confirmation,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      Toast.show({
        type: "success",
        text1: "Password Reset Successful",
        text2: res.message || "You can now login with your new password.",
      });

      setTimeout(() => {
        router.replace("/login");
      }, 2000);
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
        `${API_URL}/send-reset-otp`,
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
          Reset Password
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
                className={`border rounded-lg px-4 py-3  text-gray-700 text-center tracking-widest text-2xl focus:border-gray-400 ${
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

        {/* ✅ Divider */}
        <View className="flex-row items-center mb-6">
          <View className="flex-1 h-px bg-gray-300" />
          <Text className="mx-4 text-gray-500 text-sm">Set New Password</Text>
          <View className="flex-1 h-px bg-gray-300" />
        </View>

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
                  className="absolute right-4 top-3"
                  onPress={() => setShowNewPassword(!showNewPassword)}
                >
                  <Text className="text-gray-500 text-sm font-medium">
                    {showNewPassword ? "Hide" : "Show"}
                  </Text>
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
                  className="absolute right-4 top-3"
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Text className="text-gray-500 text-sm font-medium">
                    {showConfirmPassword ? "Hide" : "Show"}
                  </Text>
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
            }}
          >
            <Text className="text-orange-500 font-medium text-sm">Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ==========================================================
// import { API_URL } from "@/Constants";
// import { zodResolver } from "@hookform/resolvers/zod";
// import axios, { isAxiosError } from "axios";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import React, { JSX, useState } from "react";
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
// const VerifyOtpResetPasswordSchema = z.object({
//   otp: z
//     .string()
//     .min(6, "OTP must be 6 digits")
//     .max(6, "OTP must be 6 digits")
//     .regex(/^\d+$/, "OTP must contain only numbers"),
// });

// type VerifyOtpResetPasswordFormData = z.infer<typeof VerifyOtpResetPasswordSchema>;

// export default function VerifyOtpResetPassword(): JSX.Element {
//   const router = useRouter();
//   const { email } = useLocalSearchParams<{ email: string }>();

//   const [serverError, setServerError] = useState<Record<string, string[]>>({});
//   const [loading, setLoading] = useState(false);
//   const [resendLoading, setResendLoading] = useState(false);

//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//     clearErrors,
//     reset,
//   } = useForm<VerifyOtpResetPasswordFormData>({
//     resolver: zodResolver(VerifyOtpResetPasswordSchema),
//     defaultValues: {
//       otp: "",
//     },
//   });

//   /* ✅ Submit Handler */
//   const onSubmit = async (data: VerifyOtpResetPasswordFormData) => {
//     setServerError({});
//     setLoading(true);

//     try {
//       const { data: res } = await axios.post(
//         `${API_URL}/verify-otp`,
//         {
//           email,
//           otp: data.otp,
//         },
//         {
//           headers: { "Content-Type": "application/json" },
//         }
//       );

//       Toast.show({
//         type: "success",
//         text1: "OTP Verified",
//         text2: res.message || "Now you can set your new password.",
//       });

//       // ✅ Navigate to Set New Password screen
//       setTimeout(() => {
//         router.push({
//           pathname: "/set-new-password",
//           params: { email, otp: data.otp },
//         });
//       }, 1000);
//     } catch (error) {
//       if (isAxiosError(error)) {
//         const status = error.response?.status;
//         const responseData = error.response?.data;

//         if (status === 422) {
//           setServerError(responseData?.errors || {});
//           Toast.show({
//             type: "error",
//             text1: "Validation Error",
//             text2: responseData?.message || "Please check your inputs.",
//           });
//         } else if (status === 400) {
//           Toast.show({
//             type: "error",
//             text1: "Invalid OTP",
//             text2: responseData?.message || "The OTP you entered is incorrect.",
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

//   /* ✅ Resend OTP Handler */
//   const handleResendOTP = async () => {
//     setResendLoading(true);

//     try {
//       const { data: res } = await axios.post(
//         `${API_URL}/send-reset-otp`,
//         { email },
//         {
//           headers: { "Content-Type": "application/json" },
//         }
//       );

//       Toast.show({
//         type: "success",
//         text1: "OTP Resent",
//         text2: res.message || "Please check your email inbox.",
//       });
//     } catch (error) {
//       if (isAxiosError(error)) {
//         const responseData = error.response?.data;
//         Toast.show({
//           type: "error",
//           text1: "Resend Failed",
//           text2: responseData?.message || "Could not resend OTP.",
//         });
//       } else {
//         Toast.show({
//           type: "error",
//           text1: "Network Error",
//           text2: "Please check your internet connection.",
//         });
//       }
//     } finally {
//       setResendLoading(false);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       className="flex-1 justify-center items-center bg-white px-6"
//       behavior={Platform.OS === "ios" ? "padding" : undefined}
//     >
//       <Text className="mb-4 text-3xl font-semibold text-gray-800">
//         Verify OTP
//       </Text>

//       {/* ✅ Display Email */}
//       <Text className="mb-8 text-sm text-gray-600 text-center">
//         We&apos;ve sent a 6-digit OTP to{"\n"}
//         <Text className="font-semibold text-gray-800">{email}</Text>
//       </Text>

//       {/* ✅ OTP Input */}
//       <Controller
//         control={control}
//         name="otp"
//         render={({ field: { onChange, onBlur, value } }) => (
//           <View className="w-full mb-2">
//             <TextInput
//               className={`border rounded-lg px-4 py-3  text-gray-700 text-center tracking-widest text-2xl focus:border-gray-400 ${
//                 errors.otp || serverError?.otp
//                   ? "border-red-500"
//                   : "border-gray-300"
//               }`}
//               placeholder="000000"
//               keyboardType="number-pad"
//               maxLength={6}
//               onBlur={onBlur}
//               onChangeText={(text) => {
//                 onChange(text);
//                 setServerError({});
//               }}
//               value={value}
//             />
//             <Text className="text-red-500 text-xs my-1">
//               {errors.otp?.message || serverError?.otp?.[0] || ""}
//             </Text>
//           </View>
//         )}
//       />

//       {/* ✅ Submit Button */}
//       <TouchableOpacity
//         className={`w-full rounded-lg px-4 py-3 items-center mb-4 ${
//           loading ? "bg-orange-300" : "bg-orange-500"
//         }`}
//         onPress={handleSubmit(onSubmit)}
//         disabled={loading}
//         activeOpacity={0.8}
//       >
//         {loading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text className="text-white font-medium text-base">Verify OTP</Text>
//         )}
//       </TouchableOpacity>

//       {/* ✅ Resend OTP */}
//       <View className="flex-row items-center mb-6">
//         <Text className="text-gray-600 text-sm">Didn&apos;t receive OTP? </Text>
//         <TouchableOpacity onPress={handleResendOTP} disabled={resendLoading}>
//           <Text
//             className={`font-medium text-sm ${
//               resendLoading ? "text-orange-300" : "text-orange-500"
//             }`}
//           >
//             {resendLoading ? "Sending..." : "Resend"}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* ✅ Back to Login */}
//       <View className="flex-row items-center mt-6">
//         <Text className="text-gray-600 text-sm">Remembered password? </Text>
//         <TouchableOpacity
//           onPress={() => {
//             router.replace("/login");
//             clearErrors();
//             reset();
//             setServerError({});
//           }}
//         >
//           <Text className="text-orange-500 font-medium text-sm">Sign In</Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }
// // =====================================================================================
// import { API_URL } from "@/Constants";
// import { zodResolver } from "@hookform/resolvers/zod";
// import axios, { isAxiosError } from "axios";
// import { useRouter } from "expo-router";
// import React, { JSX, useState } from "react";
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
// const VerifyOtpResetPasswordSchema = z
//   .object({
//     email: z.string().email("Enter a valid email address"),
//     otp: z
//       .string()
//       .min(6, "OTP must be 6 digits")
//       .max(6, "OTP must be 6 digits")
//       .regex(/^\d+$/, "OTP must contain only numbers"),
//     new_password: z
//       .string()
//       .min(8, "Password must be at least 8 characters")
//       .regex(
//         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
//         "Password must contain uppercase, lowercase, and number"
//       ),
//     new_password_confirmation: z.string(),
//   })
//   .refine((data) => data.new_password === data.new_password_confirmation, {
//     message: "Passwords don't match",
//     path: ["new_password_confirmation"],
//   });

// type VerifyOtpResetPasswordFormData = z.infer<typeof VerifyOtpResetPasswordSchema>;

// export default function VerifyOtpResetPassword(): JSX.Element {
//   const router = useRouter();

//   const [serverError, setServerError] = useState<Record<string, string[]>>({});
//   const [loading, setLoading] = useState(false);
//   const [resendLoading, setResendLoading] = useState(false);

//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//     clearErrors,
//     reset,
//     watch,
//   } = useForm<VerifyOtpResetPasswordFormData>({
//     resolver: zodResolver(VerifyOtpResetPasswordSchema),
//     defaultValues: {
//       email: "",
//       otp: "",
//       new_password: "",
//       new_password_confirmation: "",
//     },
//   });

//   const emailValue = watch("email");

//   /* ✅ Submit Handler */
//   const onSubmit = async (data: VerifyOtpResetPasswordFormData) => {
//     setServerError({});
//     setLoading(true);

//     try {
//       const { data: res } = await axios.post(
//         `${API_URL}/verify-reset-otp`,
//         data,
//         {
//           headers: { "Content-Type": "application/json" },
//         }
//       );

//       Toast.show({
//         type: "success",
//         text1: "Password Reset Successful",
//         text2: res.message || "You can now login with your new password.",
//       });

//       setTimeout(() => {
//         router.replace("/login");
//       }, 2000);
//     } catch (error) {
//       if (isAxiosError(error)) {
//         const status = error.response?.status;
//         const responseData = error.response?.data;

//         if (status === 422) {
//           setServerError(responseData?.errors || {});
//           Toast.show({
//             type: "error",
//             text1: "Validation Error",
//             text2: responseData?.message || "Please check your inputs.",
//           });
//         } else if (status === 400) {
//           Toast.show({
//             type: "error",
//             text1: "Invalid OTP",
//             text2: responseData?.message || "The OTP you entered is incorrect.",
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

//   /* ✅ Resend OTP Handler */
//   const handleResendOTP = async () => {
//     if (!emailValue) {
//       Toast.show({
//         type: "error",
//         text1: "Email Required",
//         text2: "Please enter your email first.",
//       });
//       return;
//     }

//     setResendLoading(true);

//     try {
//       const { data: res } = await axios.post(
//         `${API_URL}/send-reset-otp`,
//         { email: emailValue },
//         {
//           headers: { "Content-Type": "application/json" },
//         }
//       );

//       Toast.show({
//         type: "success",
//         text1: "OTP Resent",
//         text2: res.message || "Please check your email inbox.",
//       });
//     } catch (error) {
//       if (isAxiosError(error)) {
//         const responseData = error.response?.data;
//         Toast.show({
//           type: "error",
//           text1: "Resend Failed",
//           text2: responseData?.message || "Could not resend OTP.",
//         });
//       } else {
//         Toast.show({
//           type: "error",
//           text1: "Network Error",
//           text2: "Please check your internet connection.",
//         });
//       }
//     } finally {
//       setResendLoading(false);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       className="flex-1 justify-center items-center bg-white px-6"
//       behavior={Platform.OS === "ios" ? "padding" : undefined}
//     >
//       <Text className="mb-8 text-3xl font-semibold text-gray-800">
//         Verify OTP
//       </Text>

//       {/* ✅ Email Input */}
//       <Controller
//         control={control}
//         name="email"
//         render={({ field: { onChange, onBlur, value } }) => (
//           <View className="w-full mb-2">
//             <TextInput
//               className={`border rounded-lg px-4 py-3 text-base text-gray-700 focus:border-gray-400 ${
//                 errors.email || serverError?.email
//                   ? "border-red-500"
//                   : "border-gray-300"
//               }`}
//               placeholder="Enter your email"
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

//       {/* ✅ OTP Input */}
//       <Controller
//         control={control}
//         name="otp"
//         render={({ field: { onChange, onBlur, value } }) => (
//           <View className="w-full mb-2">
//             <TextInput
//               className={`border rounded-lg px-4 py-3 text-base text-gray-700 focus:border-gray-400 ${
//                 errors.otp || serverError?.otp
//                   ? "border-red-500"
//                   : "border-gray-300"
//               }`}
//               placeholder="Enter 6-digit OTP"
//               keyboardType="number-pad"
//               maxLength={6}
//               onBlur={onBlur}
//               onChangeText={(text) => {
//                 onChange(text);
//                 setServerError({});
//               }}
//               value={value}
//             />
//             <Text className="text-red-500 text-xs my-1">
//               {errors.otp?.message || serverError?.otp?.[0] || ""}
//             </Text>
//           </View>
//         )}
//       />

//       {/* ✅ New Password Input */}
//       <Controller
//         control={control}
//         name="new_password"
//         render={({ field: { onChange, onBlur, value } }) => (
//           <View className="w-full mb-2">
//             <TextInput
//               className={`border rounded-lg px-4 py-3 text-base text-gray-700 focus:border-gray-400 ${
//                 errors.new_password || serverError?.new_password
//                   ? "border-red-500"
//                   : "border-gray-300"
//               }`}
//               placeholder="Enter new password"
//               secureTextEntry
//               autoCapitalize="none"
//               onBlur={onBlur}
//               onChangeText={(text) => {
//                 onChange(text);
//                 setServerError({});
//               }}
//               value={value}
//             />
//             <Text className="text-red-500 text-xs my-1">
//               {errors.new_password?.message ||
//                 serverError?.new_password?.[0] ||
//                 ""}
//             </Text>
//           </View>
//         )}
//       />

//       {/* ✅ Confirm Password Input */}
//       <Controller
//         control={control}
//         name="new_password_confirmation"
//         render={({ field: { onChange, onBlur, value } }) => (
//           <View className="w-full mb-2">
//             <TextInput
//               className={`border rounded-lg px-4 py-3 text-base text-gray-700 focus:border-gray-400 ${
//                 errors.new_password_confirmation ||
//                 serverError?.new_password_confirmation
//                   ? "border-red-500"
//                   : "border-gray-300"
//               }`}
//               placeholder="Confirm new password"
//               secureTextEntry
//               autoCapitalize="none"
//               onBlur={onBlur}
//               onChangeText={(text) => {
//                 onChange(text);
//                 setServerError({});
//               }}
//               value={value}
//             />
//             <Text className="text-red-500 text-xs my-1">
//               {errors.new_password_confirmation?.message ||
//                 serverError?.new_password_confirmation?.[0] ||
//                 ""}
//             </Text>
//           </View>
//         )}
//       />

//       {/* ✅ Submit Button */}
//       <TouchableOpacity
//         className={`w-full rounded-lg px-4 py-3 items-center mb-4 ${
//           loading ? "bg-orange-300" : "bg-orange-500"
//         }`}
//         onPress={handleSubmit(onSubmit)}
//         disabled={loading}
//         activeOpacity={0.8}
//       >
//         {loading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text className="text-white font-medium text-base">
//             Reset Password
//           </Text>
//         )}
//       </TouchableOpacity>

//       {/* ✅ Resend OTP */}
//       <View className="flex-row items-center mb-6">
//         <Text className="text-gray-600 text-sm">Didn&apos;t receive OTP? </Text>
//         <TouchableOpacity onPress={handleResendOTP} disabled={resendLoading}>
//           <Text
//             className={`font-medium text-sm ${
//               resendLoading ? "text-orange-300" : "text-orange-500"
//             }`}
//           >
//             {resendLoading ? "Sending..." : "Resend"}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* ✅ Back to Login */}
//       <View className="flex-row items-center mt-6">
//         <Text className="text-gray-600 text-sm">Remembered password? </Text>
//         <TouchableOpacity
//           onPress={() => {
//             router.replace("/login");
//             clearErrors();
//             reset();
//             setServerError({});
//           }}
//         >
//           <Text className="text-orange-500 font-medium text-sm">Sign In</Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }
