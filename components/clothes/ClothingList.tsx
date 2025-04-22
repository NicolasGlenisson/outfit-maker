import { syncEmitter } from '@/utils/api/user';
import { AntDesign } from '@expo/vector-icons';
import { Link, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import COLORS from '@/theme/colors';
import { Category, Clothing } from '@/types/clothing';
import { getClothes } from '@/utils/storage/index';

// Interface for category sections
interface CategorySection {
  category: Category;
  clothes: Clothing[];
  expanded: boolean;
}

export default function ClotheList() {
  const { refresh } = useLocalSearchParams();
  const [clothes, setClothes] = useState<Clothing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [categorySections, setCategorySections] = useState<CategorySection[]>(
    []
  );

  // Move loadClothes outside useEffect to be able to use it in other functions
  const loadClothes = useCallback(async () => {
    try {
      setRefreshing(true);
      const clothesData = await getClothes();
      setClothes(clothesData);

      // Group clothes by category
      const categories = Object.values(Category);
      const sections: CategorySection[] = categories
        .map((category) => ({
          category,
          clothes: clothesData.filter(
            (clothing) => clothing.category === category
          ),
          expanded: false, // All sections are closed by default
        }))
        .filter((section) => section.clothes.length > 0); // Only keep categories with clothing items

      setCategorySections(sections);
    } catch (error) {
      console.error('Error loading clothes:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Effect for initial update and when receiving a sync event
  useEffect(() => {
    loadClothes();

    // Listen for update event
    syncEmitter.on('clothes-updated', loadClothes);

    // Clean up listener when component unmounts
    return () => {
      syncEmitter.off('clothes-updated', loadClothes);
    };
  }, [loadClothes]);

  // Additional effect to reload data when the refresh parameter changes
  useEffect(() => {
    if (refresh) {
      loadClothes();
    }
  }, [refresh, loadClothes]);

  // Function to toggle a section's expanded state
  const toggleSection = (index: number) => {
    setCategorySections((prevSections) => {
      const newSections = [...prevSections];
      newSections[index].expanded = !newSections[index].expanded;
      return newSections;
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading clothes...</Text>
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

  if (clothes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No clothes found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={categorySections}
        keyExtractor={(item) => item.category}
        renderItem={({ item, index }) => (
          <View style={styles.categorySection}>
            {/* Category header */}
            <TouchableOpacity
              style={styles.categoryHeader}
              onPress={() => toggleSection(index)}
            >
              <View style={styles.categoryTitleContainer}>
                <Text style={styles.categoryTitle}>{item.category}</Text>
                <View style={styles.counterContainer}>
                  <Text style={styles.counter}>{item.clothes.length}</Text>
                </View>
              </View>
              <AntDesign
                name={item.expanded ? 'up' : 'down'}
                size={20}
                color={COLORS.text}
              />
            </TouchableOpacity>

            {/* Display clothes */}
            {item.expanded && (
              <View style={styles.clothesList}>
                {item.clothes.map((clothing) => (
                  <Link
                    href={`/clothes/${clothing.clientId}`}
                    key={clothing.clientId}
                    style={styles.clotheLink}
                  >
                    <View style={styles.clotheItem}>
                      {clothing.imageUrl && (
                        <Image
                          source={{ uri: clothing.imageUrl }}
                          style={styles.clotheImage}
                        />
                      )}
                      {!clothing.imageUrl && (
                        <View style={styles.placeholderImage}>
                          <Text style={styles.placeholderText}>
                            {clothing.name.charAt(0)}
                          </Text>
                        </View>
                      )}
                      <View style={styles.clotheDetails}>
                        <Text style={styles.clotheName}>{clothing.name}</Text>
                        <View style={styles.tagsContainer}>
                          {clothing.seasons?.length > 0 && (
                            <Text style={styles.tagLabel}>
                              {clothing.seasons.slice(0, 2).join(', ')}
                              {clothing.seasons.length > 2 ? '...' : ''}
                            </Text>
                          )}
                        </View>
                      </View>
                    </View>
                  </Link>
                ))}
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.text,
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.text,
  },
  categorySection: {
    marginBottom: 10,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  categoryHeader: {
    backgroundColor: COLORS.background,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginRight: 8,
  },
  counterContainer: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  counter: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.background,
  },
  clothesList: {
    padding: 8,
  },
  clotheLink: {},
  clotheItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  clotheImage: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 12,
    backgroundColor: COLORS.border,
  },
  placeholderImage: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 12,
    backgroundColor: COLORS.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  clotheDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  clotheName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  tagLabel: {
    fontSize: 12,
    color: COLORS.background,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.background,
    marginHorizontal: 16,
  },
});
