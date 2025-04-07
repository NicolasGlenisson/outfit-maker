import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import OutfitForm from '@/components/outfits/OutfitForm';
import COLORS from '@/theme/colors';
import { OutfitFormData } from '@/types/clothing';
import { saveOutfit } from '@/utils/storage/index';

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitForm = async (formData: OutfitFormData) => {
    setIsLoading(true);
    try {
      await saveOutfit(formData);
      router.push('/outfit');
    } catch {
      Alert.alert('Error', "Couldn't save the outfit.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Add New Outfit',
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: COLORS.background,
        }}
      />
      <ScrollView>
        <OutfitForm onSubmit={handleSubmitForm} isLoading={isLoading} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
