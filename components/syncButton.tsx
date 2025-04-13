import { COLORS } from '@/theme/colors';
import { ApiResponse } from '@/types/clothing';
import { syncUser } from '@/utils/api/user';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

interface SyncButtonProps {}

export default function SyncButton({}: SyncButtonProps) {
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);

    try {
      // Simuler une opération de synchronisation
      const response: ApiResponse = await syncUser();

      Alert.alert('Success', response.message, [
        {
          text: 'OK',
          onPress: () => router.replace(`/?refresh=${Date.now()}`),
        },
      ]);
    } catch (error) {
      console.error('Sync error:', error);
      Alert.alert('Error', 'Could not sync data');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleSync}
      disabled={syncing}
    >
      {syncing ? (
        <ActivityIndicator size="small" color={COLORS.background} />
      ) : (
        <AntDesign name="sync" size={24} color={COLORS.background} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
