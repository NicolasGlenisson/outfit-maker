import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet } from 'react-native';

import ClothingForm from '@/components/clothes/ClothingForm';
import { ClothingFormData } from '@/types/clothing';
import { saveClothing } from '@/utils/storage/index';

import { COLORS } from '@/theme/colors';

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: ClothingFormData) => {
    setIsLoading(true);
    try {
      // Save clothe in storage
      await saveClothing(formData);
      router.push('/');
    } catch {
      Alert.alert('Error', "Couldn't save the clothing item.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Add New Clothing',
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: COLORS.background,
        }}
      />
      <ScrollView style={styles.scrollContainer}>
        <ClothingForm
          onSubmit={handleSubmit}
          submitButtonTitle="Add Clothing"
          isLoading={isLoading}
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
});
