import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Outfit, OutfitFormData } from "@/types/clothing";
import { getOutfitById, updateOutfit, deleteOutfit } from "@/utils/storage";
import OutfitForm from "@/components/OutfitForm";
import Button from "@/components/Button";
import { AntDesign } from "@expo/vector-icons";

export default function EditOutfitPage() {
  const { outfitId } = useLocalSearchParams();
  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const id = Array.isArray(outfitId) ? outfitId[0] : outfitId;

  useEffect(() => {
    // Load the outfit data
    const loadOutfit = async () => {
      try {
        if (!id) {
          throw new Error("Missing outfit ID");
        }

        const outfitData = await getOutfitById(id);
        if (!outfitData) {
          throw new Error("Outfit not found");
        }

        setOutfit(outfitData);
      } catch (error) {
        console.error("Error loading outfit:", error);
        Alert.alert("Error", "Could not load the outfit");
      } finally {
        setLoading(false);
      }
    };

    loadOutfit();
  }, [id]);

  const handleSubmit = async (formData: OutfitFormData) => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      await updateOutfit(id, formData);
      Alert.alert("Success", "Outfit updated successfully", [
        { text: "OK", onPress: () => router.push("/") },
      ]);
    } catch (error) {
      console.error("Error updating outfit:", error);
      Alert.alert("Error", "Could not update the outfit");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!id) return;

    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this outfit?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteOutfit(id);
              Alert.alert("Success", "Outfit deleted", [
                { text: "OK", onPress: () => router.push("/") },
              ]);
            } catch (error) {
              console.error("Error deleting outfit:", error);
              Alert.alert("Error", "Could not delete the outfit");
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
          <ActivityIndicator size="large" color="#ffd33d" />
          <Text style={styles.loadingText}>Loading outfit...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!outfit) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>Outfit not found</Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            style={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButtonContainer}
          onPress={() => router.back()}
        >
          <AntDesign name="left" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Outfit</Text>
        <View style={styles.placeholder} />
      </View>

      <OutfitForm
        initialData={outfit}
        onSubmit={handleSubmit}
        submitButtonTitle="Save Changes"
        isLoading={isSubmitting}
      />

      <View style={styles.deleteContainer}>
        <Button
          title="Delete Outfit"
          onPress={handleDelete}
          style={styles.deleteButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButtonContainer: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  placeholder: {
    width: 36, // To balance the back button
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 16,
  },
  backButton: {
    marginTop: 16,
  },
  deleteContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  deleteButton: {
    backgroundColor: "#ff4d4f",
  },
});
