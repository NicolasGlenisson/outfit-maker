import React, { useState } from "react";
import { SafeAreaView, StyleSheet, View, Text } from "react-native";
import { Clothing, Category } from "@/types/clothing";
import { getClothes } from "@/utils/storage";
import ClothingPickerContent from "@/components/ClothingPickerContent";
import { useEffect } from "react";

export default function TestClothingPickerContentScreen() {
  const [clothes, setClothes] = useState<Clothing[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  useEffect(() => {
    const loadClothes = async () => {
      const clothesData = await getClothes();
      setClothes(clothesData);
    };

    loadClothes();
  }, []);

  const handleSelectClothing = (clothing: Clothing) => {
    setSelectedIds((prev) => {
      if (prev.includes(clothing.id)) {
        return prev.filter((id) => id !== clothing.id);
      }
      return [...prev, clothing.id];
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Test ClothingPickerContent</Text>
        <Text style={styles.subtitle}>
          Selected items: {selectedIds.length}
        </Text>
      </View>

      <View style={styles.contentContainer}>
        <ClothingPickerContent
          clothes={clothes}
          selectedIds={selectedIds}
          onSelect={handleSelectClothing}
          closeBottomSheet={() => console.log("Close bottomsheet")}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
  },
  contentContainer: {
    flex: 1,
  },
});
