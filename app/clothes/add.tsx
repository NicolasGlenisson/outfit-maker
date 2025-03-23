import React, { useState } from "react";
import { Alert, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { ClothingFormData } from "@/types/clothing";
import { saveClothing } from "@/utils/storage";
import ClothingForm from "@/components/ClothingForm";

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: ClothingFormData) => {
    setIsLoading(true);
    try {
      // Save clothe in storage
      await saveClothing(formData);
      router.push("/");
    } catch (error) {
      Alert.alert("Error", "Couldn't save the clothing item.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add New Clothing</Text>
      </View>

      <ClothingForm
        onSubmit={handleSubmit}
        submitButtonTitle="Add Clothing"
        isLoading={isLoading}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
});
