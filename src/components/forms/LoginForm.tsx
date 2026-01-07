import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "expo-image";
import { Link } from "expo-router";
import React, { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, TextInput, View } from "react-native";
import { z } from "zod";

import { KeyboardFormWrapper } from "@/components/KeyboardFormWrapper";
import { FloatingLabelInput } from "@/components/ui/FloatingLabelInput";

/* ---------------- Schema ---------------- */
const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

/* ---------------- Component ---------------- */
export default function LoginForm() {
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: LoginFormData) => {
    console.log(data);
  };

  return (
    <View className="flex-1 bg-blue-50">
      <KeyboardFormWrapper>
        <View className="flex-1 justify-center px-4">
          {/* Header */}
          <View className="mb-8 items-center">
            <Image
              source={require("@/assets/images/new/blue/splash-icon-rupee.png")}
              style={{ width: 80, height: 80 }}
            />
            <Text className=" mt-4 w-full text-center text-2xl font-semibold text-blue-700">
              Welcome Back
            </Text>
            <Text className="mt-1 text-sm text-gray-500">
              Login to continue
            </Text>
          </View>

          {/* Card */}
          <View className="rounded-2xl bg-white p-5 shadow-sm">
            <View className="">
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <FloatingLabelInput
                    ref={emailRef}
                    label="Email"
                    value={field.value}
                    onChangeText={field.onChange}
                    error={errors.email?.message}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    returnKeyType="next"
                    blurOnSubmit={false}
                    onSubmitEditing={() => passwordRef.current?.focus()}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <FloatingLabelInput
                    ref={passwordRef}
                    label="Password"
                    value={field.value}
                    onChangeText={field.onChange}
                    error={errors.password?.message}
                    secureTextEntry
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit(onSubmit)}
                  />
                )}
              />
            </View>

            {/* Submit */}
            <Pressable
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              android_ripple={{
                color: "rgba(255, 255, 255, 0.3)",
                foreground: true,
              }}
              className={`mt-5 rounded-xl py-4 ${
                isSubmitting ? "bg-blue-400" : "bg-blue-600"
              }`}
            >
              <Text className="text-center text-lg font-semibold text-white">
                {isSubmitting ? "Logging in..." : "Login"}
              </Text>
            </Pressable>

            {/* Footer CTA */}
            <View className="mt-6 flex-row justify-center">
              <Text className="text-sm text-gray-500">
                Don’t have an account?
              </Text>
              <Link href="/register" asChild>
                <Pressable>
                  <Text className="ml-1 text-sm font-semibold text-blue-600">
                    Register
                  </Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </View>
      </KeyboardFormWrapper>
    </View>
  );
}
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Image } from "expo-image";
// import React, { useRef } from "react";
// import { Controller, useForm } from "react-hook-form";
// import { Pressable, Text, TextInput, View } from "react-native";

// import { KeyboardFormWrapper } from "@/components/KeyboardFormWrapper";
// import { FloatingLabelInput } from "@/components/ui/FloatingLabelInput";
// import { z } from "zod";

// /* ------------------ Schema ------------------ */
// const loginSchema = z.object({
//   email: z.string().email("Enter a valid email"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
// });

// type LoginFormData = z.infer<typeof loginSchema>;

// /* ------------------ Component ------------------ */
// const LoginForm = () => {
//   const emailRef = useRef<TextInput>(null);
//   const passwordRef = useRef<TextInput>(null);

//   const {
//     control,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<LoginFormData>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   const onSubmit = async (data: LoginFormData) => {
//     console.log(data);
//     // 🔹 API call here
//   };

//   return (
//     <View className="flex-1 bg-blue-50">
//       <KeyboardFormWrapper>
//         <View className="flex-1 justify-center px-4">
//           {/* Header */}
//           <View className="mb-8 items-center">
//             <Image
//               source={require("@/assets/images/new/blue/splash-icon-rupee.png")}
//               style={{ width: 80, height: 80 }}
//             />
//             <Text className="mt-4 text-2xl font-bold text-blue-700">
//               Welcome Back
//             </Text>
//             <Text className="mt-1 text-sm text-gray-500">
//               Login to continue
//             </Text>
//           </View>

//           {/* Card */}
//           <View className="rounded-2xl bg-white p-5 shadow-sm">
//             <View className="gap-3">
//               {/* Email */}
//               <Controller
//                 control={control}
//                 name="email"
//                 render={({ field }) => (
//                   <FloatingLabelInput
//                     ref={emailRef}
//                     label="Email"
//                     value={field.value}
//                     onChangeText={field.onChange}
//                     error={errors.email?.message}
//                     keyboardType="email-address"
//                     autoCapitalize="none"
//                     autoCorrect={false}
//                     textContentType="emailAddress"
//                     returnKeyType="next"
//                     blurOnSubmit={false}
//                     onSubmitEditing={() => passwordRef.current?.focus()}
//                   />
//                 )}
//               />

//               {/* Password */}
//               <Controller
//                 control={control}
//                 name="password"
//                 render={({ field }) => (
//                   <FloatingLabelInput
//                     ref={passwordRef}
//                     label="Password"
//                     value={field.value}
//                     onChangeText={field.onChange}
//                     error={errors.password?.message}
//                     secureTextEntry
//                     textContentType="password"
//                     returnKeyType="done"
//                     onSubmitEditing={handleSubmit(onSubmit)}
//                   />
//                 )}
//               />
//             </View>

//             {/* Submit */}
//             <Pressable
//               onPress={handleSubmit(onSubmit)}
//               disabled={isSubmitting}
//               android_ripple={{ color: "rgba(255,255,255,0.25)" }}
//               className={`mt-5 rounded-xl py-4 ${
//                 isSubmitting ? "bg-blue-400" : "bg-blue-600"
//               }`}
//             >
//               <Text className="text-center text-lg font-semibold text-white">
//                 {isSubmitting ? "Logging in..." : "Login"}
//               </Text>
//             </Pressable>

//             {/* Footer */}
//             <Text className="mt-4 text-center text-sm text-gray-500">
//               Forgot password?
//             </Text>
//           </View>
//         </View>
//       </KeyboardFormWrapper>
//     </View>
//   );
// };

// export default LoginForm;
