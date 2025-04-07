import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";

import CategorySelector from "@/components/clothes/CategorySelector";
import ClothingList from "@/components/clothes/ClothingItemsList";
import SelectedClothingList from "@/components/outfits/ClothingPicker/SelectedClothingList";
import { Clothing, Category } from "@/types/clothing";
import COLORS from "@/theme/colors";

interface ClothingPickerProps {
  clothes: Clothing[];
  onSelect: (clothing: Clothing) => void;
  selectedIds: string[];
}

export default function ClothingPicker({
  clothes,
  onSelect,
  selectedIds,
}: ClothingPickerProps) {
  // State
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  // Get selected clothes
  const selectedClothes = clothes.filter((item) =>
    selectedIds.includes(item.id)
  );

  // Get all categories that have clothes
  const categories = [...new Set(clothes.map((item) => item.category))];

  // Handle back to categories
  const handleBackToCategories = useCallback(() => {
    setSelectedCategory(null);
  }, []);

  return (
    <View style={styles.container}>
      {/* Selected Clothes Section */}
      <SelectedClothingList selectedClothes={selectedClothes} />

      {/* Category or Clothing List */}
      <View style={styles.selectionContainer}>
        <Text style={styles.sectionHeader}>
          {selectedCategory ? `Select ${selectedCategory}` : "Select Category"}
        </Text>

        {!selectedCategory ? (
          // Show categories
          <CategorySelector
            categories={categories}
            clothes={clothes}
            onSelectCategory={setSelectedCategory}
          />
        ) : (
          // Show clothes from selected category
          <ClothingList
            clothes={clothes.filter(
              (item) => item.category === selectedCategory
            )}
            selectedIds={selectedIds}
            onSelect={onSelect}
            onBackPress={handleBackToCategories}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  selectionContainer: {
    flex: 1,
    marginTop: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    paddingHorizontal: 16,
  },
});
