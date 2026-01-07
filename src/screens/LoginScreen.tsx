import { Pressable, Text, TextInput, View } from "react-native";

export default function FormScreen() {
  return (
    <View>
      {/* Push button to bottom */}
      <View className="flex-1" />

      <View className=" px-4 pt-6">
        <TextInput
          placeholder="First Name"
          className="mb-4 h-14 rounded-xl border border-zinc-300 px-4"
        />

        <TextInput
          placeholder="Email"
          className="mb-4 h-14 rounded-xl border border-zinc-300 px-4"
        />

        <TextInput
          placeholder="Password"
          secureTextEntry
          className="mb-4 h-14 rounded-xl border border-zinc-300 px-4"
        />

        <Pressable className="mb-6 h-14 items-center justify-center rounded-xl bg-blue-600">
          <Text className="font-semibold text-white">Submit</Text>
        </Pressable>
      </View>
    </View>
  );
}

// import { FormData, formSchema } from "@/schemas/form.schema";
// import { zodResolver } from "@hookform/resolvers/zod";
// import React from "react";
// import { Controller, useForm } from "react-hook-form";
// import { Pressable, Text, TextInput, View } from "react-native";
// import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// export default function LoginScreen() {
//   const {
//     control,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<FormData>({
//     resolver: zodResolver(formSchema),
//   });

//   const onSubmit = (data: FormData) => {
//     console.log(data);
//   };

//   return (
//     <KeyboardAwareScrollView
//       enableOnAndroid
//       keyboardShouldPersistTaps="handled"
//       extraScrollHeight={100} // 👈 keeps submit visible
//       contentContainerStyle={{ flexGrow: 1 }}
//       className="bg-white"
//     >
//       {/* PUSH BUTTON TO BOTTOM */}
//       <View className="flex-1" />

//       <View className=" px-4 pt-6">
//         {/* EMAIL */}
//         <Controller
//           control={control}
//           name="email"
//           render={({ field: { onChange, value } }) => (
//             <>
//               <TextInput
//                 placeholder="Email"
//                 value={value}
//                 onChangeText={onChange}
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//                 className="h-14 rounded-xl border border-zinc-300 px-4"
//               />
//               {errors.email && (
//                 <Text className="mt-1 text-sm text-red-500">
//                   {errors.email.message}
//                 </Text>
//               )}
//             </>
//           )}
//         />

//         {/* PASSWORD */}
//         <Controller
//           control={control}
//           name="password"
//           render={({ field: { onChange, value } }) => (
//             <>
//               <TextInput
//                 placeholder="Password"
//                 value={value}
//                 onChangeText={onChange}
//                 secureTextEntry
//                 className="mt-4 h-14 rounded-xl border border-zinc-300 px-4"
//               />
//               {errors.password && (
//                 <Text className="mt-1 text-sm text-red-500">
//                   {errors.password.message}
//                 </Text>
//               )}
//             </>
//           )}
//         />
//         <Controller
//           control={control}
//           name="email"
//           render={({ field: { onChange, value } }) => (
//             <>
//               <TextInput
//                 placeholder="Email"
//                 value={value}
//                 onChangeText={onChange}
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//                 className="h-14 rounded-xl border border-zinc-300 px-4"
//               />
//               {errors.email && (
//                 <Text className="mt-1 text-sm text-red-500">
//                   {errors.email.message}
//                 </Text>
//               )}
//             </>
//           )}
//         />

//         {/* PASSWORD */}
//         <Controller
//           control={control}
//           name="password"
//           render={({ field: { onChange, value } }) => (
//             <>
//               <TextInput
//                 placeholder="Password"
//                 value={value}
//                 onChangeText={onChange}
//                 secureTextEntry
//                 className="mt-4 h-14 rounded-xl border border-zinc-300 px-4"
//               />
//               {errors.password && (
//                 <Text className="mt-1 text-sm text-red-500">
//                   {errors.password.message}
//                 </Text>
//               )}
//             </>
//           )}
//         />
//         <Controller
//           control={control}
//           name="email"
//           render={({ field: { onChange, value } }) => (
//             <>
//               <TextInput
//                 placeholder="Email"
//                 value={value}
//                 onChangeText={onChange}
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//                 className="h-14 rounded-xl border border-zinc-300 px-4"
//               />
//               {errors.email && (
//                 <Text className="mt-1 text-sm text-red-500">
//                   {errors.email.message}
//                 </Text>
//               )}
//             </>
//           )}
//         />

//         {/* PASSWORD */}
//         <Controller
//           control={control}
//           name="password"
//           render={({ field: { onChange, value } }) => (
//             <>
//               <TextInput
//                 placeholder="Password"
//                 value={value}
//                 onChangeText={onChange}
//                 secureTextEntry
//                 className="mt-4 h-14 rounded-xl border border-zinc-300 px-4"
//               />
//               {errors.password && (
//                 <Text className="mt-1 text-sm text-red-500">
//                   {errors.password.message}
//                 </Text>
//               )}
//             </>
//           )}
//         />

//         {/* PUSH BUTTON TO BOTTOM */}
//         {/* <View className="flex-1" /> */}

//         {/* SUBMIT */}
//         <Pressable
//           onPress={handleSubmit(onSubmit)}
//           disabled={isSubmitting}
//           className="my-6 h-14 items-center justify-center rounded-xl bg-blue-600 active:bg-blue-700"
//         >
//           <Text className="text-base font-semibold text-white">
//             {isSubmitting ? "Submitting..." : "Submit"}
//           </Text>
//         </Pressable>
//       </View>
//     </KeyboardAwareScrollView>
//   );
// }
