import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "expo-image";
import { Link } from "expo-router";
import React, { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, TextInput, View } from "react-native";

import { KeyboardFormWrapper } from "@/components/KeyboardFormWrapper";
import { FloatingLabelInput } from "@/components/ui/FloatingLabelInput";
import { RegisterFormData, registerSchema } from "@/schemas/register.schema";

export default function RegisterForm() {
  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    console.log(data);
  };

  return (
    <View className="flex-1 bg-blue-50">
      <KeyboardFormWrapper>
        <View className="flex-1 justify-center px-4">
          {/* Header */}
          <View className="mb-4 items-center">
            <Image
              source={require("@/assets/images/new/blue/splash-icon-rupee.png")}
              style={{ width: 80, height: 80 }}
            />
            <Text className=" text-2xl font-bold text-blue-700">
              Create Account
            </Text>
            <Text className=" text-sm text-gray-500">Register to continue</Text>
          </View>

          {/* Card */}
          <View className="rounded-2xl bg-white p-5 shadow-sm">
            <View className="">
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <FloatingLabelInput
                    ref={nameRef}
                    label="Full name"
                    value={field.value}
                    onChangeText={field.onChange}
                    error={errors.name?.message}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    onSubmitEditing={() => emailRef.current?.focus()}
                  />
                )}
              />

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
                    returnKeyType="next"
                    blurOnSubmit={false}
                    onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                  />
                )}
              />

              <Controller
                control={control}
                name="confirm_password"
                render={({ field }) => (
                  <FloatingLabelInput
                    ref={confirmPasswordRef}
                    label="Confirm password"
                    value={field.value}
                    onChangeText={field.onChange}
                    error={errors.confirm_password?.message}
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
                {isSubmitting ? "Creating..." : "Create Account"}
              </Text>
            </Pressable>

            {/* Footer CTA */}
            <View className="mt-6 flex-row justify-center">
              <Text className="text-sm text-gray-500">
                Already have an account?
              </Text>
              <Link href="/login" asChild>
                <Pressable>
                  <Text className="ml-1 text-sm font-semibold text-blue-600">
                    Login
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
// import { RegisterFormData, registerSchema } from "@/schemas/register.schema";

// const RegisterForm = () => {
//   const nameRef = useRef<TextInput>(null);
//   const emailRef = useRef<TextInput>(null);
//   const passwordRef = useRef<TextInput>(null);
//   const confirmPasswordRef = useRef<TextInput>(null);

//   const {
//     control,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<RegisterFormData>({
//     resolver: zodResolver(registerSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       password: "",
//       confirm_password: "",
//     },
//   });

//   const onSubmit = async (data: RegisterFormData) => {
//     console.log(data);
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
//               Create Account
//             </Text>
//             <Text className="mt-1 text-sm text-gray-500">
//               Register to continue
//             </Text>
//           </View>

//           {/* Card */}
//           <View className="rounded-2xl bg-white p-5 shadow-sm">
//             <View className="gap-1">
//               {/* Name */}
//               <Controller
//                 control={control}
//                 name="name"
//                 render={({ field }) => (
//                   <FloatingLabelInput
//                     ref={nameRef}
//                     label="Full name"
//                     value={field.value}
//                     onChangeText={field.onChange}
//                     error={errors.name?.message}
//                     returnKeyType="next"
//                     blurOnSubmit={false}
//                     onSubmitEditing={() => emailRef.current?.focus()}
//                   />
//                 )}
//               />

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
//                     returnKeyType="next"
//                     blurOnSubmit={false}
//                     onSubmitEditing={() => confirmPasswordRef.current?.focus()}
//                   />
//                 )}
//               />

//               {/* Confirm Password */}
//               <Controller
//                 control={control}
//                 name="confirm_password"
//                 render={({ field }) => (
//                   <FloatingLabelInput
//                     ref={confirmPasswordRef}
//                     label="Confirm password"
//                     value={field.value}
//                     onChangeText={field.onChange}
//                     error={errors.confirm_password?.message}
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
//               android_ripple={{
//                 color: "rgba(255,255,255,0.25)",
//                 foreground: true,
//               }}
//               className={`mt-5 rounded-xl py-4 ${
//                 isSubmitting ? "bg-blue-400" : "bg-blue-600"
//               }`}
//             >
//               <Text className="text-center text-lg font-semibold text-white">
//                 {isSubmitting ? "Submitting..." : "Create Account"}
//               </Text>
//             </Pressable>
//           </View>
//         </View>
//       </KeyboardFormWrapper>
//     </View>
//   );
// };

// export default RegisterForm;
// import { zodResolver } from "@hookform/resolvers/zod";
// import React, { useRef } from "react";
// import { Controller, useForm } from "react-hook-form";
// import { Pressable, Text, TextInput, View } from "react-native";

// import { KeyboardFormWrapper } from "@/components/KeyboardFormWrapper";
// import { FloatingLabelInput } from "@/components/ui/FloatingLabelInput";
// import { RegisterFormData, registerSchema } from "@/schemas/register.schema";

// const RegisterForm = () => {
//   const nameRef = useRef<TextInput>(null);
//   const emailRef = useRef<TextInput>(null);
//   const passwordRef = useRef<TextInput>(null);
//   const confirmPasswordRef = useRef<TextInput>(null);

//   const {
//     control,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<RegisterFormData>({
//     resolver: zodResolver(registerSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       password: "",
//       confirm_password: "",
//     },
//   });

//   const onSubmit = (data: RegisterFormData) => {
//     console.log(data);
//   };

//   return (
//     <KeyboardFormWrapper>
//       <View className="flex-1 justify-center bg-white p-4">
//         <Text className="mb-6 text-center text-2xl font-bold text-blue-500">
//           Register Form
//         </Text>

//         {/* Name */}
//         <Controller
//           control={control}
//           name="name"
//           render={({ field }) => (
//             <FloatingLabelInput
//               ref={nameRef}
//               label="Full name"
//               value={field.value}
//               onChangeText={field.onChange}
//               error={errors.name?.message}
//               returnKeyType="next"
//               onSubmitEditing={() => emailRef.current?.focus()}
//             />
//           )}
//         />

//         {/* Email */}
//         <Controller
//           control={control}
//           name="email"
//           render={({ field }) => (
//             <FloatingLabelInput
//               ref={emailRef}
//               label="Email"
//               value={field.value}
//               onChangeText={field.onChange}
//               error={errors.email?.message}
//               keyboardType="email-address"
//               autoCapitalize="none"
//               returnKeyType="next"
//               onSubmitEditing={() => passwordRef.current?.focus()}
//             />
//           )}
//         />

//         {/* Password */}
//         <Controller
//           control={control}
//           name="password"
//           render={({ field }) => (
//             <FloatingLabelInput
//               ref={passwordRef}
//               label="Password"
//               value={field.value}
//               onChangeText={field.onChange}
//               error={errors.password?.message}
//               secureTextEntry
//               returnKeyType="next"
//               onSubmitEditing={() => confirmPasswordRef.current?.focus()}
//             />
//           )}
//         />

//         {/* Confirm Password */}
//         <Controller
//           control={control}
//           name="confirm_password"
//           render={({ field }) => (
//             <FloatingLabelInput
//               ref={confirmPasswordRef}
//               label="Confirm password"
//               value={field.value}
//               onChangeText={field.onChange}
//               error={errors.confirm_password?.message}
//               secureTextEntry
//               returnKeyType="done"
//               onSubmitEditing={handleSubmit(onSubmit)}
//             />
//           )}
//         />

//         <Pressable
//           onPress={handleSubmit(onSubmit)}
//           disabled={isSubmitting}
//           className="mt-4"
//         >
//           <Text className="rounded-xl bg-blue-600 py-4 text-center text-lg font-semibold text-white">
//             Submit
//           </Text>
//         </Pressable>
//       </View>
//     </KeyboardFormWrapper>
//   );
// };

// export default RegisterForm;

// import { KeyboardFormWrapper } from "@/components/KeyboardFormWrapper";
// import { FloatingLabelInput } from "@/components/ui/FloatingLabelInput";
// import { RegisterFormData, registerSchema } from "@/schemas/register.schema";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Image } from "expo-image";
// import React from "react";
// import { Controller, useForm } from "react-hook-form";
// import { Pressable, Text, View } from "react-native";
// // import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
// // import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

// const RegisterForm = () => {
//   const {
//     control,
//     handleSubmit,
//     setError,
//     formState: { errors, isSubmitting },
//   } = useForm<RegisterFormData>({
//     resolver: zodResolver(registerSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       password: "",
//       confirm_password: "",
//     },
//   });

//   const onSubmit = async (data: RegisterFormData) => {
//     try {
//       // 🔹 API call here
//       console.log(data);
//     } catch (err: any) {
//       /**
//        * Example Laravel response:
//        * {
//        *   errors: {
//        *     email: ["Email already exists"],
//        *     password: ["Password too weak"]
//        *   }
//        */

//       Object.entries(err?.errors || {}).forEach(([field, messages]) => {
//         setError(field as keyof RegisterFormData, {
//           type: "server",
//           message: (messages as string[])[0],
//         });
//       });
//     }
//   };

//   return (
//     <>
//       <KeyboardFormWrapper>
//         <View className="flex-1 justify-center bg-white p-4">
//           <Image
//             style={{ width: 100, height: 100, alignSelf: "center" }}
//             source={require("@/assets/images/new/blue/splash-icon-rupee.png")}
//           />
//           <Text className="py-5 text-center text-2xl font-bold text-blue-500">
//             Register Form
//           </Text>
//           <Controller
//             control={control}
//             name="name"
//             render={({ field }) => (
//               <FloatingLabelInput
//                 label="Full name"
//                 autoCapitalize="characters"
//                 value={field.value}
//                 onChangeText={field.onChange}
//                 error={errors.name?.message}
//               />
//             )}
//           />
//           <Controller
//             control={control}
//             name="email"
//             render={({ field }) => (
//               <FloatingLabelInput
//                 label="Email"
//                 autoCapitalize="characters"
//                 value={field.value}
//                 onChangeText={field.onChange}
//                 error={errors.email?.message}
//               />
//             )}
//           />
//           <Controller
//             control={control}
//             name="password"
//             render={({ field }) => (
//               <FloatingLabelInput
//                 label="Password"
//                 autoCapitalize="characters"
//                 value={field.value}
//                 onChangeText={field.onChange}
//                 error={errors.password?.message}
//               />
//             )}
//           />

//           <Controller
//             control={control}
//             name="confirm_password"
//             render={({ field }) => (
//               <FloatingLabelInput
//                 label="Confirm password"
//                 autoCapitalize="characters"
//                 value={field.value}
//                 onChangeText={field.onChange}
//                 error={errors.confirm_password?.message}
//               />
//             )}
//           />

//           <Pressable
//             android_ripple={{
//               color: "rgba(255, 255, 255, 0.3)",
//               foreground: true,
//             }}
//             onPress={handleSubmit(onSubmit)}
//             disabled={isSubmitting}
//             className="mb-4 mt-3 "
//           >
//             <Text className="rounded-xl bg-blue-600   px-5 py-4 text-center text-lg font-semibold text-white">
//               Submit
//             </Text>
//           </Pressable>
//         </View>
//       </KeyboardFormWrapper>
//     </>
//   );
// };

// export default RegisterForm;
