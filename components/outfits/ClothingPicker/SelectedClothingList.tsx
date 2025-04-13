import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import COLORS from '@/theme/colors';
import { Clothing } from '@/types/clothing';

interface SelectedClothingListProps {
  selectedClothes: Clothing[];
}

export default function SelectedClothingList({
  selectedClothes,
}: SelectedClothingListProps) {
  return (
    <View style={styles.selectedSection}>
      <Text style={styles.sectionTitle}>Selected Items</Text>
      {selectedClothes.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.selectedItemsContainer}>
            {selectedClothes.map((clothing) => (
              <View style={styles.selectedClothingItem} key={clothing.clientId}>
                {clothing.imageUrl ? (
                  <Image
                    source={{ uri: clothing.imageUrl }}
                    style={styles.selectedClothingImage}
                  />
                ) : (
                  <View style={styles.selectedPlaceholder}>
                    <Text style={styles.placeholderText}>
                      {clothing.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
                <Text style={styles.selectedClothingName} numberOfLines={1}>
                  {clothing.name}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <Text style={styles.emptyText}>No clothes selected yet</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  selectedSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: COLORS.text,
  },
  selectedItemsContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  selectedClothingItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  selectedClothingImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 4,
    backgroundColor: COLORS.background,
  },
  selectedPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  placeholderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  selectedClothingName: {
    fontSize: 12,
    textAlign: 'center',
    maxWidth: 80,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.text,
    padding: 20,
  },
});
