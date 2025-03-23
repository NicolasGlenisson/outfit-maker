import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Clothing, Category } from "@/types/clothing";
import { AntDesign } from "@expo/vector-icons";
import ClothingItem from "@/components/ClothingItem";
import CategoryItem from "@/components/CategoryItem";

interface ClothingPickerContentProps {
  clothes: Clothing[];
  selectedIds: string[];
  onSelect: (clothing: Clothing) => void;
  closeBottomSheet: () => void;
  selectedCategory: Category | null;
  setSelectedCategory: (category: Category | null) => void;
}

export default function ClothingPickerContent({
  clothes,
  selectedIds,
  onSelect,
  closeBottomSheet,
  selectedCategory,
  setSelectedCategory,
}: ClothingPickerContentProps) {
  // Get all categories that have clothes
  const categories = [...new Set(clothes.map((item) => item.category))];

  // Handle category selection
  const handleCategorySelect = useCallback(
    (category: Category) => {
      setSelectedCategory(category);
    },
    [setSelectedCategory]
  );

  return (
    <View style={styles.sheetContainer}>
      {/* Header */}
      <View style={styles.sheetHeader}>
        <Text style={styles.sheetTitle}>
          {selectedCategory ? `Select ${selectedCategory}` : "Select Category"}
        </Text>
      </View>

      {/* Content */}
      <View style={styles.sheetContent}>
        {!selectedCategory ? (
          // Category Selection View
          <FlatList
            data={categories}
            renderItem={({ item: category }) => {
              const categoryClothes = clothes.filter(
                (clothing) => clothing.category === category
              );
              return (
                <CategoryItem
                  category={category}
                  count={categoryClothes.length}
                  onPress={() => handleCategorySelect(category)}
                />
              );
            }}
            keyExtractor={(item) => item}
          />
        ) : (
          // Clothing Selection View for the selected category
          <View style={styles.clothingListContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setSelectedCategory(null)}
            >
              <AntDesign name="left" size={16} color="#666" />
              <Text style={styles.backButtonText}>Back to Categories</Text>
            </TouchableOpacity>

            <FlatList
              data={clothes.filter(
                (item) => item.category === selectedCategory
              )}
              renderItem={({ item }) => (
                <ClothingItem
                  clothing={item}
                  isSelected={selectedIds.includes(item.id)}
                  onSelect={onSelect}
                />
              )}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={() => (
                <Text style={styles.emptyText}>
                  No clothing items in this category
                </Text>
              )}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sheetContainer: {
    flex: 1,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "600",
    ...Platform.select({
      ios: {
        fontWeight: "600",
      },
      android: {
        fontFamily: "sans-serif-medium",
      },
      web: {
        fontFamily: "system-ui, -apple-system, sans-serif",
      },
    }),
  },
  closeButton: {
    padding: 4,
  },
  sheetContent: {
    flex: 1,
  },
  clothingListContainer: {
    flex: 1,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButtonText: {
    fontSize: 16,
    marginLeft: 8,
    color: "#666",
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    padding: 20,
  },
  sheetFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
});
