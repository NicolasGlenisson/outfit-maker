import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { Category } from "@/types/clothing";
import { AntDesign } from "@expo/vector-icons";

interface CategoryItemProps {
  category: Category;
  count: number;
  onPress: () => void;
}

export default function CategoryItem({
  category,
  count,
  onPress,
}: CategoryItemProps) {
  return (
    <TouchableOpacity style={styles.categoryOption} onPress={onPress}>
      <Text style={styles.categoryOptionText}>{category}</Text>
      <View style={styles.categoryCountContainer}>
        <Text style={styles.categoryCount}>{count}</Text>
      </View>
      <AntDesign name="right" size={16} color="#666" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  categoryOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  categoryOptionText: {
    fontSize: 16,
    flex: 1,
  },
  categoryCountContainer: {
    backgroundColor: "#ffd33d",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: "center",
    marginRight: 10,
  },
  categoryCount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
});
