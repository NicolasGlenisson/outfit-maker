import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';

import Button from '@/components/ui/Button';
import COLORS from '@/theme/colors';
import { Category, ClothingFormData, Occasion, Season } from '@/types/clothing';
import PhotoPicker from '../ui/ImagePicker';

interface ClothingFormProps {
  initialData?: Partial<ClothingFormData>;
  onSubmit: (data: ClothingFormData) => Promise<void>;
  submitButtonTitle?: string;
  isLoading?: boolean;
}

export default function ClothingForm({
  initialData,
  onSubmit,
  submitButtonTitle = 'Save',
  isLoading = false,
}: ClothingFormProps) {
  const [formData, setFormData] = useState<ClothingFormData>({
    name: initialData?.name || '',
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
    arrayName: 'seasons' | 'occasions'
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

  const handleSubmit = async () => {
    if (!formData.name) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    try {
      await onSubmit(formData);
      // Reset form data after successful submission
      setFormData({
        name: '',
        category: Category.TOP,
        imageUrl: undefined,
        seasons: [],
        occasions: [],
      });
    } catch {
      Alert.alert('Error', 'An error occurred while saving the clothing item.');
    }
  };

  return (
    <View>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={formData.name}
        onChangeText={(text) => handleChange('name', text)}
        placeholder="Enter clothing name"
      />

      <Text style={styles.label}>Category</Text>
      <View style={styles.pickerContainer}>
        {Object.values(Category).map((category) => (
          <Button
            key={category}
            title={category}
            onPress={() => handleChange('category', category)}
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
            onPress={() => toggleArrayItem(formData.seasons, season, 'seasons')}
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
              toggleArrayItem(formData.occasions, occasion, 'occasions')
            }
            selected={formData.occasions.includes(occasion)}
            style={styles.optionButton}
          />
        ))}
      </View>

      <PhotoPicker
        handleChangeImage={(uri) => {
          handleChange('imageUrl', uri);
          setImagePreview(uri);
        }}
        initialImage={imagePreview || undefined}
      />

      <Button
        title={submitButtonTitle}
        onPress={handleSubmit}
        loading={isLoading}
        isFullWidth
        style={styles.submitButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  submitButton: {
    marginTop: 8,
    marginBottom: 32,
  },
});
