import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Clothing } from "@/types/clothing";
import { AntDesign } from "@expo/vector-icons";

interface ClothingItemProps {
  clothing: Clothing;
  isSelected: boolean;
  onSelect: (clothing: Clothing) => void;
}

export default function ClothingItem({
  clothing,
  isSelected,
  onSelect,
}: ClothingItemProps) {
  return (
    <TouchableOpacity
      style={[styles.clothingItem, isSelected && styles.selectedItem]}
      onPress={() => onSelect(clothing)}
      key={clothing.id}
    >
      <View style={styles.clothingContent}>
        {clothing.imageUrl ? (
          <Image
            source={{ uri: clothing.imageUrl }}
            style={styles.clothingImage}
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>
              {clothing.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        <View style={styles.clothingDetails}>
          <Text style={styles.clothingName}>{clothing.name}</Text>
          {clothing.occasions && clothing.occasions.length > 0 && (
            <Text style={styles.clothingTags}>
              {clothing.occasions.slice(0, 2).join(", ")}
              {clothing.occasions.length > 2 && "..."}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.selectionIndicator}>
        {isSelected ? (
          <AntDesign name="checkcircle" size={20} color="#4CAF50" />
        ) : (
          <View style={styles.emptyCircle} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  clothingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    justifyContent: "space-between",
  },
  selectedItem: {
    backgroundColor: "rgba(76, 175, 80, 0.1)",
  },
  clothingContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  clothingImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 12,
  },
  placeholderImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  placeholderText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#999",
  },
  clothingDetails: {
    flex: 1,
  },
  clothingName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  clothingTags: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  selectionIndicator: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
