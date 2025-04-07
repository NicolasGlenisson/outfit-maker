import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import OutfitForm from '@/components/outfits/OutfitForm';
import Button from '@/components/ui/Button';
import COLORS from '@/theme/colors';
import { Outfit, OutfitFormData } from '@/types/clothing';
import {
  deleteOutfit,
  getOutfitById,
  updateOutfit,
} from '@/utils/storage/index';

export default function EditOutfitPage() {
  const { outfitId } = useLocalSearchParams();
  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const id = Array.isArray(outfitId) ? outfitId[0] : outfitId;

  useEffect(() => {
    // Load the outfit data
    const loadOutfit = async () => {
      try {
        if (!id) {
          throw new Error('Missing outfit ID');
        }

        const outfitData = await getOutfitById(id);

        if (!outfitData) {
          throw new Error('Outfit not found');
        }

        setOutfit(outfitData);
      } catch {
        Alert.alert('Error', 'Could not load the outfit');
      } finally {
        setLoading(false);
      }
    };

    loadOutfit();
  }, [id]);

  const handleSubmit = async (formData: OutfitFormData) => {
    if (!id) return;

    setIsSubmitting(true);
    try {
      await updateOutfit(id, formData);
      Alert.alert('Success', 'Outfit updated successfully', [
        { text: 'OK', onPress: () => router.push('/outfit/') },
      ]);
    } catch {
      Alert.alert('Error', 'Could not update the outfit');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!id) return;

    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this outfit?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteOutfit(id);
              Alert.alert('Success', 'Outfit deleted', [
                { text: 'OK', onPress: () => router.replace('/') },
              ]);
            } catch {
              Alert.alert('Error', 'Could not delete the outfit');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Edit outfit',
            headerStyle: {
              backgroundColor: COLORS.primary,
            },
            headerTintColor: COLORS.background,
          }}
        />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#ffd33d" />
          <Text style={styles.loadingText}>Loading outfit...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!outfit) {
    router.replace('/outfit/');
    return;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Edit outfit',
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: COLORS.background,
        }}
      />
      <ScrollView>
        <OutfitForm
          initialData={outfit}
          onSubmit={handleSubmit}
          submitButtonTitle="Save Changes"
          isLoading={isSubmitting}
        />

        <View style={styles.deleteContainer}>
          <Button
            title="Delete Outfit"
            onPress={handleDelete}
            isFullWidth={true}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButtonContainer: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  placeholder: {
    width: 36,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.text,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.error,
    marginBottom: 16,
  },
  backButton: {
    marginTop: 16,
  },
  deleteContainer: {
    padding: 16,
    paddingBottom: 32,
  },
});
