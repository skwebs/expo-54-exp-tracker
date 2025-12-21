// src/app/(tabs)/Customer/create.tsx
import Feather from "@expo/vector-icons/Feather";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler"; // ← should be in App.tsx ideally
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from "zod";

import AppBottomSheetModal from "@/components/AppBottomSheetModal";
import { useRouter } from "expo-router";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  category: z.string().min(1, "Category is required"), // ← added to schema
});

type FormData = z.infer<typeof schema>;

const categories = ["Uncategorized", "Petrol", "Recharge", "Other"];

const ScreenHeader = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  return (
    <View style={{ paddingTop: insets.top }} className=" bg-teal-600 ">
      <View className="flex-row items-center justify-between px-2 dark:bg-gray-800">
        <View className="grow flex-row">
          <TouchableOpacity
            onPress={() => router.back()}
            className=" rounded-full p-2"
          >
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text className="grow text-center text-2xl font-semibold text-white">
          New Transaction
        </Text>

        <View className="grow flex-row-reverse">
          <TouchableOpacity className=" rounded-full p-2">
            <Feather name="more-vertical" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default function TransactionCreateScreen() {
  const [sheetVisible, setSheetVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      category: "Uncategorized",
    },
  });

  const selectedCategory = watch("category");

  const input2Ref = useRef<TextInput>(null);
  const input3Ref = useRef<TextInput>(null);

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    // TODO: Save to database, show success toast, etc.
  };

  return (
    // GestureHandlerRootView should ideally be in App.tsx
    <GestureHandlerRootView className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={insets.top + 20}
      >
        <ScrollView
          className="flex-1 bg-gray-50"
          keyboardShouldPersistTaps="handled"
        >
          <ScreenHeader />

          <View className="px-5 py-6">
            {/* <Text className="mb-6 text-2xl font-bold text-gray-800">
              New Transaction
            </Text> */}

            {/* Category Selector */}
            <View className="mb-6">
              <Text className="mb-2 text-lg font-medium text-gray-700">
                Category
              </Text>
              <Pressable
                onPress={() => setSheetVisible(true)}
                className="flex-row items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-4"
              >
                <Text className="text-lg text-gray-800">
                  {selectedCategory}
                </Text>
                <Feather name="chevron-down" size={24} color="gray" />
              </Pressable>
              {errors.category && (
                <Text className="mt-1 text-sm text-red-500">
                  {errors.category.message}
                </Text>
              )}
            </View>

            {/* Form Fields */}
            <View className="gap-5">
              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, value, onBlur } }) => (
                  <View>
                    <Text className="mb-2 text-lg font-medium text-gray-700">
                      First Name
                    </Text>
                    <TextInput
                      className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-lg"
                      placeholder="Enter first name"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      returnKeyType="next"
                      onSubmitEditing={() => input2Ref.current?.focus()}
                    />
                    {errors.firstName && (
                      <Text className="mt-1 text-sm text-red-500">
                        {errors.firstName.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              <Controller
                control={control}
                name="middleName"
                render={({ field: { onChange, value, onBlur } }) => (
                  <View>
                    <Text className="mb-2 text-lg font-medium text-gray-700">
                      Middle Name (optional)
                    </Text>
                    <TextInput
                      ref={input2Ref}
                      className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-lg"
                      placeholder="Enter middle name"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      returnKeyType="next"
                      onSubmitEditing={() => input3Ref.current?.focus()}
                    />
                  </View>
                )}
              />

              <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, value, onBlur } }) => (
                  <View>
                    <Text className="mb-2 text-lg font-medium text-gray-700">
                      Last Name
                    </Text>
                    <TextInput
                      ref={input3Ref}
                      className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-lg"
                      placeholder="Enter last name"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      returnKeyType="done"
                      onSubmitEditing={handleSubmit(onSubmit)}
                    />
                    {errors.lastName && (
                      <Text className="mt-1 text-sm text-red-500">
                        {errors.lastName.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              className="mt-8 rounded-lg bg-teal-600 py-4"
              activeOpacity={0.8}
            >
              <Text className="text-center text-xl font-semibold text-white">
                Create Transaction
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Sheet */}
      <AppBottomSheetModal
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        topSafeAreaInset={true}
        contentWrapperClassName="pb-6"
      >
        <View className="flex-1">
          {/* Header */}
          <View className="flex-row items-center justify-between border-b border-gray-200 bg-gray-100 px-4 py-3">
            <Text className="flex-1 text-lg font-semibold text-gray-800">
              Select Category
            </Text>
            <TouchableOpacity onPress={() => setSheetVisible(false)}>
              <Feather name="x" size={28} color="gray" />
            </TouchableOpacity>
          </View>

          {/* Categories */}
          <ScrollView className="flex-1 px-4 pt-4">
            <View className="flex-row flex-wrap gap-3">
              {categories.map((cat) => (
                <Pressable
                  key={cat}
                  onPress={() => {
                    setValue("category", cat);
                    setSheetVisible(false);
                  }}
                  className={`rounded-full px-5 py-2.5 ${
                    selectedCategory === cat ? "bg-teal-600" : "bg-gray-200"
                  }`}
                >
                  <Text
                    className={`text-base font-medium ${
                      selectedCategory === cat ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {cat}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Action Buttons (optional) */}
            <View className="mt-6 flex-row gap-3">
              <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-2 rounded-lg bg-gray-600 py-3">
                <Feather name="plus" size={20} color="white" />
                <Text className="text-base font-medium text-white">
                  Add New
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-2 rounded-lg bg-gray-600 py-3">
                <Feather name="edit-3" size={20} color="white" />
                <Text className="text-base font-medium text-white">Edit</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </AppBottomSheetModal>
    </GestureHandlerRootView>
  );
}
