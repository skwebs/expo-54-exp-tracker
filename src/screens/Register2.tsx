import { FloatingInput } from "@/components/ui/FloatingInput";
import { RegisterFormData, registerSchema } from "@/schemas/register.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function RegisterScreen() {
  const {
    control,
    handleSubmit,
    setError,
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

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // 🔹 API call here
      console.log(data);
    } catch (err: any) {
      /**
       * Example Laravel response:
       * {
       *   errors: {
       *     email: ["Email already exists"],
       *     password: ["Password too weak"]
       *   }
       */

      Object.entries(err?.errors || {}).forEach(([field, messages]) => {
        setError(field as keyof RegisterFormData, {
          type: "server",
          message: (messages as string[])[0],
        });
      });
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={12}
        className="flex-1 justify-center"
      >
        <View className="rounded-2xl bg-white p-6 shadow-md">
          {/* Header */}
          <View className="mb-6 items-center">
            <Text className="text-3xl font-bold text-slate-900">
              Create Account
            </Text>
            <Text className="mt-1 text-sm text-slate-500">
              Register to continue
            </Text>
          </View>

          {/* Name */}
          <View className="mb-2">
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <FloatingInput
                  label="Full name"
                  autoCapitalize="characters"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={errors.name?.message}
                />
              )}
            />
          </View>

          {/* Email */}
          <View className="mb-2">
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <FloatingInput
                  label="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={field.value}
                  onChangeText={field.onChange}
                  error={errors.email?.message}
                />
              )}
            />
          </View>

          {/* Password */}
          <View className="mb-2">
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <FloatingInput
                  label="Password"
                  secureTextEntry
                  value={field.value}
                  onChangeText={field.onChange}
                  error={errors.password?.message}
                />
              )}
            />
          </View>

          {/* Confirm Password */}
          <View className="mb-6">
            <Controller
              control={control}
              name="confirm_password"
              render={({ field }) => (
                <FloatingInput
                  label="Confirm Password"
                  secureTextEntry
                  value={field.value}
                  onChangeText={field.onChange}
                  error={errors.confirm_password?.message}
                />
              )}
            />
          </View>

          {/* Submit */}
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={isSubmitting}
            onPress={handleSubmit(onSubmit)}
            className={`rounded-xl py-4 ${
              isSubmitting ? "bg-blue-400" : "bg-blue-600"
            }`}
          >
            <Text className="text-center text-lg font-semibold text-white">
              {isSubmitting ? "Creating..." : "Register"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}
// import { FloatingInput } from "@/components/ui/FloatingInput";
// import { Input } from "@/components/ui/Input";
// import { RegisterFormData, registerSchema } from "@/schemas/register.schema";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Controller, useForm } from "react-hook-form";
// import {
//   KeyboardAvoidingView,
//   Platform,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// export default function RegisterScreen() {
//   const {
//     control,
//     handleSubmit,
//     setError,
//     formState: { errors, isSubmitting },
//   } = useForm<RegisterFormData>({
//     resolver: zodResolver(registerSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   const onSubmit = async (data: RegisterFormData) => {
//     try {
//       // 🔹 API call
//       console.log(data);
//     } catch (err: any) {
//       /**
//        * Example Laravel validation response:
//        * {
//        *   errors: {
//        *     email: ["Email already taken"],
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
//     <View className="flex-1 bg-slate-100 px-4">
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         keyboardVerticalOffset={12}
//         className="flex-1 justify-center"
//       >
//         <View className="rounded-2xl bg-white p-6 shadow-md">
//           {/* Header */}
//           <View className="mb-6 items-center">
//             <Text className="text-3xl font-bold text-slate-900">
//               Create Account
//             </Text>
//             <Text className="mt-1 text-sm text-slate-500">
//               Register to continue
//             </Text>
//           </View>

//           {/* Email */}
//           <View className="mb-2">
//             <Controller
//               control={control}
//               name="email"
//               render={({ field }) => (
//                 <Input
//                   placeholder="Email"
//                   value={field.value}
//                   onChangeText={field.onChange}
//                   error={errors.email?.message}
//                 />
//               )}
//             />
//           </View>

//           {/* Password */}
//           <View className="mb-6">
//             <Controller
//               control={control}
//               name="password"
//               render={({ field }) => (
//                 <FloatingInput
//                   label="Password"
//                   secureTextEntry
//                   value={field.value}
//                   onChangeText={field.onChange}
//                   error={errors.password?.message}
//                 />
//               )}
//             />
//           </View>

//           {/* Submit */}
//           <TouchableOpacity
//             activeOpacity={0.85}
//             disabled={isSubmitting}
//             onPress={handleSubmit(onSubmit)}
//             className={`rounded-xl py-4 ${
//               isSubmitting ? "bg-blue-400" : "bg-blue-600"
//             }`}
//           >
//             <Text className="text-center text-lg font-semibold text-white">
//               {isSubmitting ? "Creating..." : "Register"}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </View>
//   );
// }

// ===================================================================================
// import { FloatingInput } from "@/components/ui/FloatingInput";
// import { Input } from "@/components/ui/Input";
// import { Controller, useForm } from "react-hook-form";
// import {
//   KeyboardAvoidingView,
//   Platform,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// type FormData = {
//   email: string;
//   password: string;
// };

// export default function RegisterScreen() {
//   const {
//     control,
//     handleSubmit,
//     setError,
//     formState: { errors, isSubmitting },
//   } = useForm<FormData>({
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   const onSubmit = async (data: FormData) => {
//     try {
//       // 🔹 API call here
//       console.log(data);
//     } catch (err: any) {
//       // 🔹 Server-side validation example
//       if (err?.errors?.email) {
//         setError("email", {
//           type: "server",
//           message: err.errors.email[0],
//         });
//       }
//       if (err?.errors?.password) {
//         setError("password", {
//           type: "server",
//           message: err.errors.password[0],
//         });
//       }
//     }
//   };

//   return (
//     <View className="flex-1 bg-slate-100 px-4">
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         keyboardVerticalOffset={12}
//         className="flex-1 justify-center"
//       >
//         {/* Card */}
//         <View className="rounded-2xl bg-white p-6 shadow-md">
//           {/* Header */}
//           <View className="mb-6 items-center">
//             <Text className="text-3xl font-bold text-slate-900">
//               Create Account
//             </Text>
//             <Text className="mt-1 text-sm text-slate-500">
//               Register to continue
//             </Text>
//           </View>

//           {/* Email */}
//           <View className="mb-2">
//             <Controller
//               control={control}
//               name="email"
//               rules={{ required: "Email is required" }}
//               render={({ field }) => (
//                 <Input
//                   placeholder="Email"
//                   value={field.value}
//                   onChangeText={field.onChange}
//                   error={errors.email?.message}
//                 />
//               )}
//             />
//           </View>

//           {/* Password */}
//           <View className="mb-6">
//             <Controller
//               control={control}
//               name="password"
//               rules={{ required: "Password is required" }}
//               render={({ field }) => (
//                 <FloatingInput
//                   label="Password"
//                   secureTextEntry
//                   value={field.value}
//                   onChangeText={field.onChange}
//                   error={errors.password?.message}
//                 />
//               )}
//             />
//           </View>

//           {/* Submit */}
//           <TouchableOpacity
//             activeOpacity={0.85}
//             disabled={isSubmitting}
//             onPress={handleSubmit(onSubmit)}
//             className={`rounded-xl py-4 ${
//               isSubmitting ? "bg-blue-400" : "bg-blue-600"
//             }`}
//           >
//             <Text className="text-center text-lg font-semibold text-white">
//               {isSubmitting ? "Creating..." : "Register"}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </View>
//   );
// }
// ================================================================================
// import { FloatingInput } from "@/components/ui/FloatingInput";
// import { Input } from "@/components/ui/Input";
// import { Controller, useForm } from "react-hook-form";
// import {
//   KeyboardAvoidingView,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// type FormData = {
//   email: string;
//   password: string;
// };

// export default function RegisterScreen() {
//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<FormData>({
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   return (
//     <View className="flex-1 justify-center  bg-white px-4 py-8">
//       <KeyboardAvoidingView
//         behavior="padding"
//         className="pb-4"
//         keyboardVerticalOffset={10}
//       >
//         <View className="mb-4 items-center justify-center">
//           <Text className="text-3xl font-bold">Register</Text>
//         </View>
//         <View className="mb-2">
//           <Controller
//             control={control}
//             name="email"
//             rules={{ required: "Email is required" }}
//             render={({ field }) => (
//               <Input
//                 placeholder="Email"
//                 value={field.value}
//                 onChangeText={field.onChange}
//                 error={errors.email?.message}
//               />
//             )}
//           />
//         </View>

//         <View className="mb-2">
//           <Controller
//             control={control}
//             name="password"
//             rules={{ required: "Password is required" }}
//             render={({ field }) => (
//               <FloatingInput
//                 label="Password"
//                 secureTextEntry
//                 value={field.value}
//                 onChangeText={field.onChange}
//                 error={errors.password?.message}
//               />
//             )}
//           />
//         </View>

//         <TouchableOpacity
//           onPress={handleSubmit(console.log)}
//           className="mb-5  rounded-lg bg-blue-600 p-5"
//         >
//           <Text className="text-center text-xl font-bold text-white">
//             Register
//           </Text>
//         </TouchableOpacity>
//       </KeyboardAvoidingView>
//     </View>
//   );
// }
