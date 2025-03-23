import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Clothing, ClothingFormData } from "@/types/clothing";
import {
  getClothingById,
  updateClothing,
  deleteClothing,
} from "@/utils/storage";
import ClothingForm from "@/components/ClothingForm";
import Button from "@/components/Button";

export default function Page() {
  const { clothingId } = useLocalSearchParams();
  const [clothing, setClothing] = useState<Clothing | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const id = Array.isArray(clothingId) ? clothingId[0] : clothingId;

  useEffect(() => {
    // Get clothing from storage
    const loadClothing = async () => {
      try {
        if (!id) {
          throw new Error("Missing clothing ID");
        }

        const clothingData = await getClothingById(id);
        if (clothingData == null) {
          throw new Error("Clothing not found");
        }

        setClothing(clothingData);
      } catch (error) {
        console.error("Error loading clothing:", error);
        Alert.alert("Error", "Could not load clothing item");
      } finally {
        setLoading(false);
      }
    };

    loadClothing();
  }, [id]);

  const handleSubmit = async (formData: ClothingFormData) => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      await updateClothing(id, formData);
      Alert.alert("Success", "Clothing updated successfully", [
        { text: "OK", onPress: () => router.push("/") },
      ]);
    } catch (error) {
      console.error("Error updating clothing:", error);
      Alert.alert("Error", "Could not update clothing item");
    } finally {
      setIsSubmitting(false);
      router.push(`/clothes/${id}`);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this clothing item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteClothing(id);
              Alert.alert("Success", "Clothing item deleted", [
                { text: "OK", onPress: () => router.push("/") },
              ]);
            } catch (error) {
              console.error("Error deleting clothing:", error);
              Alert.alert("Error", "Could not delete clothing item");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text>Loading clothing item...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!clothing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text>Clothing item not found</Text>
          <Button
            title="Go Back"
            onPress={() => router.push("/")}
            style={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Edit Clothing</Text>
      </View>

      <ClothingForm
        initialData={clothing}
        onSubmit={handleSubmit}
        submitButtonTitle="Save Changes"
        isLoading={isSubmitting}
      />

      <View style={styles.deleteContainer}>
        <Button title="Delete Clothing" onPress={handleDelete} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
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
  backButton: {
    marginTop: 16,
  },
  deleteContainer: {
    padding: 16,
    paddingTop: 0,
  },
});
