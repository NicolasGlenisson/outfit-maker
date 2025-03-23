import React, { useEffect, useState } from "react";
import {
  ScrollView,
  TextInput,
  Text,
  StyleSheet,
  View,
  Alert,
} from "react-native";
import { OutfitFormData } from "@/types/clothing";
import { Clothing } from "@/types/clothing";
import { getClothes } from "@/utils/storage";
import PhotoPicker from "@/components/PhotoPicker";
import ClothingPicker from "@/components/ClothingPicker";
import Button from "@/components/Button";

interface OutfitFormProps {
  initialData?: Partial<OutfitFormData>;
  onSubmit: (data: OutfitFormData) => Promise<void>;
  submitButtonTitle?: string;
  isLoading?: boolean;
}

export default function OutfitForm({
  initialData,
  onSubmit,
  submitButtonTitle = "Create Outfit",
  isLoading = false,
}: OutfitFormProps) {
  const [clothes, setClothes] = useState<Clothing[]>([]);
  const [formData, setFormData] = useState<OutfitFormData>({
    name: initialData?.name || "",
    imageUrl: initialData?.imageUrl,
    clothes: initialData?.clothes || [],
  });
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.imageUrl || null
  );

  // Handle form data on input change
  const handleChange = (name: keyof OutfitFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // get user's clothes
  useEffect(() => {
    const loadClothes = async () => {
      const clothesData = await getClothes();
      setClothes(clothesData);
    };
    loadClothes();
  }, []);

  const handleSelectClothing = (clothing: Clothing) => {
    setFormData((prev) => {
      // Already selected item?
      if (
        prev.clothes.some((prevClothing) => prevClothing.id === clothing.id)
      ) {
        return {
          ...prev,
          clothes: prev.clothes.filter(
            (prevClothing) => prevClothing.id !== clothing.id
          ),
        };
      }
      // if not, we add it to form data
      return { ...prev, clothes: [...prev.clothes, clothing] };
    });
  };

  const handleSubmit = async () => {
    // Validation checks
    if (!formData.name) {
      Alert.alert("Error", "Please provide a name for your outfit");
      return;
    }

    if (formData.clothes.length === 0) {
      Alert.alert("Error", "Please select at least one clothing item");
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting outfit:", error);
      Alert.alert("Error", "Failed to save outfit. Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => handleChange("name", text)}
          placeholder="Enter outfit name"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Photo (Optional)</Text>
        <PhotoPicker
          handleChangeImage={(uri) => {
            handleChange("imageUrl", uri);
            setImagePreview(uri);
          }}
          initialImage={imagePreview || undefined}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Select Clothes</Text>
        <ClothingPicker
          clothes={clothes}
          onSelect={handleSelectClothing}
          selectedIds={formData.clothes.map((item) => item.id)}
        />
      </View>

      <View style={styles.submitContainer}>
        <Button
          title={submitButtonTitle}
          onPress={handleSubmit}
          loading={isLoading}
          isFullWidth={true}
          style={styles.submitButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  submitContainer: {
    marginTop: 16,
    marginBottom: 40,
  },
  submitButton: {
    backgroundColor: "#ffd33d",
  },
});
