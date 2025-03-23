import React from "react";
import { View, StyleSheet } from "react-native";
import { Category, Clothing } from "@/types/clothing";
import CategoryItem from "./CategoryItem";

interface CategorySelectorProps {
  categories: Category[];
  clothes: Clothing[];
  onSelectCategory: (category: Category) => void;
}

export default function CategorySelector({
  categories,
  clothes,
  onSelectCategory,
}: CategorySelectorProps) {
  return (
    <View style={styles.container}>
      {categories.map((category) => {
        const categoryClothes = clothes.filter(
          (clothing) => clothing.category === category
        );
        return (
          <CategoryItem
            key={category}
            category={category}
            count={categoryClothes.length}
            onPress={() => onSelectCategory(category)}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
