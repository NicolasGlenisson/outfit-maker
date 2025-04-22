import axios from 'axios';
import * as Application from 'expo-application';
import { Platform } from 'react-native';
import { syncClothing } from './clothes';

import { EventEmitter } from 'events';
export const syncEmitter = new EventEmitter();

/**
 * Get the unique device identifier based on platform
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
 * Check if a user already exists in the API with the device ID
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
 * Create a new user in the API with the device ID
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
    throw new Error(`API Error: ${response.status}`);
  }

  console.log('User created successfully:', response.data);
  return response.data;
};

/**
 * Get or create a user based on the device ID
 */
const getDeviceUser = async () => {
  try {
    const deviceId = await getDeviceId();

    // Check if a user already exists
    const existingUser = await checkExistingUser(deviceId);
    if (existingUser) {
      return existingUser;
    }

    // If the user doesn't exist, we create it
    return await createUser(deviceId);
  } catch (error) {
    throw error;
  }
};

/**
 * Synchronize the unique phone ID with the backend server.
 * Gets the unique device ID and sends it to the REST API.
 */
export const syncUser = async () => {
  try {
    // Get the user from the API
    const user = await getDeviceUser();

    // Synchronize clothing
    await syncClothing(user);

    syncEmitter.emit('clothes-updated');
    return {
      message: 'Synchronized',
      data: user,
    };
  } catch (error) {
    console.error('User synchronization failed:', error);
    return {
      message: 'Sync error',
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
