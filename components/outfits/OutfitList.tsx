import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import OutfitCard from '@/components/outfits/OutfitCard';
import COLORS from '@/theme/colors';
import { Outfit } from '@/types/clothing';
import { syncEmitter } from '@/utils/api/user';
import { getOutfits } from '@/utils/storage/index';
import { useLocalSearchParams } from 'expo-router';

export default function OutfitList() {
  const { refresh } = useLocalSearchParams();
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadOutfits = useCallback(async () => {
    try {
      setRefreshing(true);
      const outfitsData = await getOutfits();
      setOutfits(outfitsData);
    } catch (error) {
      console.error('Error loading outfits:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Effect for initial loading and sync event listening
  useEffect(() => {
    loadOutfits();

    // Listen for clothing update events to refresh outfits
    // (because outfits contain clothing items that might be updated)
    syncEmitter.on('clothes-updated', loadOutfits);

    return () => {
      syncEmitter.off('clothes-updated', loadOutfits);
    };
  }, [loadOutfits]);

  // Effect to react to the refresh parameter
  useEffect(() => {
    if (refresh) {
      loadOutfits();
    }
  }, [refresh, loadOutfits]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading outfits...</Text>
      </View>
    );
  }

  if (refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
        <Text style={styles.loadingText}>Refreshing...</Text>
      </View>
    );
  }

  if (outfits.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No outfits found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={outfits}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <OutfitCard outfit={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: COLORS.primary,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.primary,
    fontSize: 16,
  },
});
