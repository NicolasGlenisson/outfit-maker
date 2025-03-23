import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Image,
} from "react-native";
import Button from "@/components/Button";
import * as ImagePicker from "expo-image-picker";
import { Category, Season, Occasion, ClothingFormData } from "@/types/clothing";

interface ClothingFormProps {
  initialData?: Partial<ClothingFormData>;
  onSubmit: (data: ClothingFormData) => Promise<void>;
  submitButtonTitle?: string;
  isLoading?: boolean;
}

export default function ClothingForm({
  initialData,
  onSubmit,
  submitButtonTitle = "Save",
  isLoading = false,
}: ClothingFormProps) {
  const [formData, setFormData] = useState<ClothingFormData>({
    name: initialData?.name || "",
    category: initialData?.category || Category.TOP,
    imageUrl: initialData?.imageUrl,
    seasons: initialData?.seasons || [],
    occasions: initialData?.occasions || [],
  });
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.imageUrl || null
  );

  // Handle form data on input change
  const handleChange = (name: keyof ClothingFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // function to handle season and occasions select
  const toggleArrayItem = <T extends Season | Occasion>(
    array: T[],
    item: T,
    arrayName: "seasons" | "occasions"
  ) => {
    if (array.includes(item)) {
      handleChange(
        arrayName,
        array.filter((i) => i !== item)
      );
    } else {
      handleChange(arrayName, [...array, item]);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImagePreview(uri);
      handleChange("imageUrl", uri);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      Alert.alert("Error", "Name is required");
      return;
    }

    try {
      await onSubmit(formData);
      // Reset form data after successful submission
      setFormData({
        name: "",
        category: Category.TOP,
        imageUrl: undefined,
        seasons: [],
        occasions: [],
      });
    } catch (error) {
      console.error("Form submission error:", error);
      Alert.alert("Error", "An error occurred while saving the clothing item.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={formData.name}
        onChangeText={(text) => handleChange("name", text)}
        placeholder="Enter clothing name"
      />

      <Text style={styles.label}>Category</Text>
      <View style={styles.pickerContainer}>
        {Object.values(Category).map((category) => (
          <Button
            key={category}
            title={category}
            onPress={() => handleChange("category", category)}
            selected={formData.category === category}
            style={styles.optionButton}
          />
        ))}
      </View>

      <Text style={styles.label}>Season</Text>
      <View style={styles.pickerContainer}>
        {Object.values(Season).map((season) => (
          <Button
            key={season}
            title={season}
            onPress={() => toggleArrayItem(formData.seasons, season, "seasons")}
            selected={formData.seasons.includes(season)}
            style={styles.optionButton}
          />
        ))}
      </View>

      <Text style={styles.label}>Occasions</Text>
      <View style={styles.pickerContainer}>
        {Object.values(Occasion).map((occasion) => (
          <Button
            key={occasion}
            title={occasion}
            onPress={() =>
              toggleArrayItem(formData.occasions, occasion, "occasions")
            }
            selected={formData.occasions.includes(occasion)}
            style={styles.optionButton}
          />
        ))}
      </View>

      <Button
        title="Choose an image"
        onPress={takePhoto}
        isFullWidth={true}
        style={styles.imageButton}
      />

      {imagePreview && (
        <Image source={{ uri: imagePreview }} style={styles.image} />
      )}

      <Button
        title={submitButtonTitle}
        onPress={handleSubmit}
        loading={isLoading}
        isFullWidth={true}
        style={styles.submitButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
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
    marginBottom: 16,
    fontSize: 16,
  },
  pickerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
    gap: 8,
  },
  optionButton: {
    marginBottom: 8,
    marginRight: 8,
  },
  imageButton: {
    marginVertical: 16,
  },
  image: {
    width: "100%",
    height: 300,
    marginBottom: 16,
    borderRadius: 8,
    resizeMode: "contain",
  },
  submitButton: {
    marginTop: 8,
    marginBottom: 32,
  },
});
