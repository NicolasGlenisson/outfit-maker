import axios from 'axios';
import * as Application from 'expo-application';
import { Platform } from 'react-native';
import { syncClothing } from './clothes';

import { EventEmitter } from 'events';
export const syncEmitter = new EventEmitter();

/**
 * Récupère l'identifiant unique du téléphone selon la plateforme
 */
const getDeviceId = async (): Promise<string> => {
  let deviceId = '';

  if (Platform.OS === 'android') {
    deviceId = Application.getAndroidId() ?? '';
  } else if (Platform.OS === 'ios') {
    deviceId = (await Application.getIosIdForVendorAsync()) ?? '';
  }

  if (!deviceId) {
    throw new Error('No Device ID');
  }

  return deviceId;
};

/**
 * Vérifie si un utilisateur existe déjà dans l'API avec l'ID de l'appareil
 */
const checkExistingUser = async (deviceId: string) => {
  try {
    const response = await axios.get(
      `${process.env.EXPO_PUBLIC_API_URL}/api/user/${deviceId}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    }

    return null;
  } catch (error) {
    return null;
  }
};

/**
 * Crée un nouvel utilisateur dans l'API avec l'ID de l'appareil
 */
const createUser = async (deviceId: string) => {
  const response = await axios.post(
    `${process.env.EXPO_PUBLIC_API_URL}/api/user/create`,
    { deviceId },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (response.status !== 201) {
    throw new Error(`Erreur API: ${response.status}`);
  }

  console.log('User créé avec succès:', response.data);
  return response.data;
};

/**
 * Récupère ou crée un utilisateur en fonction de l'ID de l'appareil
 */
const getDeviceUser = async () => {
  try {
    const deviceId = await getDeviceId();

    // Vérifie si un user existe déjà
    const existingUser = await checkExistingUser(deviceId);
    if (existingUser) {
      return existingUser;
    }

    // Si l'utilisateur n'existe pas, on le crée
    return await createUser(deviceId);
  } catch (error) {
    throw error;
  }
};

/**
 * Synchronise l'identifiant unique du téléphone avec le serveur backend.
 * Récupère l'ID unique de l'appareil et l'envoie à l'API REST.
 */
export const syncUser = async () => {
  try {
    // Récupére l'utilisateur dans l'API
    const user = await getDeviceUser();

    // Synchronise les clothing
    await syncClothing(user);

    syncEmitter.emit('clothes-updated');
    return {
      message: 'Synchronisé',
      data: user,
    };
  } catch (error) {
    console.error('Échec de la synchronisation utilisateur:', error);
    return {
      message: 'Erreur de synchro',
    };
  }
};

// const syncClothing = async (user: UserAPI) => {
//   try {
//     const response: ApiResponse = await getClothes(user);

//     const clothesData = await getClothesLocal();

//     console.log(response.data, clothesData);
//     // clothesData.forEach( async(clothing) => {
//     //   await createClothes(user, clothing);
//     // })
//   } catch(error) {
//     throw error;
//   }
// }
