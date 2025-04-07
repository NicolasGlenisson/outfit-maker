import { COLORS } from '@/theme/colors';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ClothingForm from '@/components/clothes/ClothingForm';
import Button from '@/components/ui/Button';
import { Clothing, ClothingFormData } from '@/types/clothing';
import {
  deleteClothing,
  getClothingById,
  updateClothing,
} from '@/utils/storage/index';

export default function Page() {
  const { clothingId } = useLocalSearchParams();
  const [clothing, setClothing] = useState<Clothing | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const id = Array.isArray(clothingId) ? clothingId[0] : clothingId;

  useEffect(() => {
    // Get clothing from storage
    const loadClothing = async () => {
      try {
        if (!id) {
          throw new Error('Missing clothing ID');
        }

        const clothingData = await getClothingById(id);
        if (clothingData == null) {
          throw new Error('Clothing not found');
        }

        setClothing(clothingData);
      } catch {
        Alert.alert('Error', 'Could not load clothing item');
      } finally {
        setLoading(false);
      }
    };

    loadClothing();
  }, [id]);

  const handleSubmit = async (formData: ClothingFormData) => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      await updateClothing(id, formData);
      Alert.alert('Success', 'Clothing updated successfully', [
        { text: 'OK', onPress: () => router.push('/') },
      ]);
    } catch {
      Alert.alert('Error', 'Could not update clothing item');
    } finally {
      setIsSubmitting(false);
      router.push(`/clothes/${id}`);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this clothing item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteClothing(id);
              Alert.alert('Success', 'Clothing item deleted', [
                { text: 'OK', onPress: () => router.replace('/') },
              ]);
            } catch {
              Alert.alert('Error', 'Could not delete clothing item');
            }
          },
        },
      ]
    );
  };

  const renderStackScreen = () => {
    return (
      <Stack.Screen
        options={{
          title: 'Edit clothing',
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: COLORS.background,
        }}
      />
    );
  };

  if (loading || !clothing) {
    return (
      <SafeAreaView style={styles.container}>
        {renderStackScreen()}
        <View style={styles.centered}>
          <Text>Loading clothing item...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderStackScreen()}
      <ScrollView style={styles.scrollContainer}>
        <ClothingForm
          initialData={clothing}
          onSubmit={handleSubmit}
          submitButtonTitle="Save Changes"
          isLoading={isSubmitting}
        />

        <Button
          title="Delete Clothing"
          onPress={handleDelete}
          isFullWidth={true}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: { paddingHorizontal: 16, marginTop: 10 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  backButton: {
    marginTop: 16,
  },
});
