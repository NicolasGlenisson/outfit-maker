import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Clothing } from "@/types/clothing";
import { AntDesign } from "@expo/vector-icons";
import ClothingItem from "./ClothingItem";

interface ClothingListProps {
  clothes: Clothing[];
  selectedIds: string[];
  onSelect: (clothing: Clothing) => void;
  onBackPress: () => void;
}

export default function ClothingItemsList({
  clothes,
  selectedIds,
  onSelect,
  onBackPress,
}: ClothingListProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
        <AntDesign name="left" size={16} color="#666" />
        <Text style={styles.backButtonText}>Back to Categories</Text>
      </TouchableOpacity>

      {clothes.length === 0 ? (
        <Text style={styles.emptyText}>No clothing items in this category</Text>
      ) : (
        <View>
          {clothes.map((item) => (
            <ClothingItem
              key={item.id}
              clothing={item}
              isSelected={selectedIds.includes(item.id)}
              onSelect={onSelect}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
});
