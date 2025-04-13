import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import ClothingItem from './ClothingItem';

import COLORS from '@/theme/colors';
import { Clothing } from '@/types/clothing';

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
        <AntDesign name="left" size={16} color={COLORS.text} />
        <Text style={styles.backButtonText}>Back to Categories</Text>
      </TouchableOpacity>

      {clothes.length === 0 ? (
        <Text style={styles.emptyText}>No clothing items in this category</Text>
      ) : (
        <View>
          {clothes.map((item) => (
            <ClothingItem
              key={item.clientId}
              clothing={item}
              isSelected={selectedIds.includes(item.clientId)}
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButtonText: {
    fontSize: 16,
    marginLeft: 8,
    color: COLORS.text,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.text,
    padding: 20,
  },
});
