import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

import { STORAGE_KEYS } from '../constants';

import { Clothing, ClothingFormData, Outfit } from '@/types/clothing';

/**
 * Save multiple clothing items in local storage
 */
export const saveClothing = async (
  clothingData: ClothingFormData | ClothingFormData[],
  clientId?: string
): Promise<Clothing | Clothing[]> => {
  try {
    // get existing clothes
    const existingClothes = await getClothes();

    // Check if we're dealing with a single item or an array
    const isArray = Array.isArray(clothingData);
    const clothingArray = isArray ? clothingData : [clothingData];

    // Create new clothing items
    const newClothingItems: Clothing[] = clothingArray.map((item) => ({
      ...item,
      clientId: clientId || uuid.v4().toString(), // We can set the clientId ourselves when syncing from the cloud
      createdAt: new Date(),
      updatedAt: new Date(),
      isSynced: false,
    }));

    // Add the new clothing items to the list
    const updatedClothes = [...existingClothes, ...newClothingItems];

    // Save to storage
    await AsyncStorage.setItem(
      STORAGE_KEYS.CLOTHES,
      JSON.stringify(updatedClothes)
    );

    // Return either a single clothing item or the array based on what was passed in
    return isArray ? newClothingItems : newClothingItems[0];
  } catch (error) {
    console.error('Error saving clothing:', error);
    throw new Error('Could not save clothing');
  }
};

/**
 * Retrieve all clothing items
 */
export const getClothes = async (
  getDeleted: boolean = false
): Promise<Clothing[]> => {
  try {
    const clothesJson = await AsyncStorage.getItem(STORAGE_KEYS.CLOTHES);
    if (!clothesJson) return [];

    // Convert dates from string to Date
    const clothes: Clothing[] = JSON.parse(clothesJson);
    return clothes
      .filter((item) => getDeleted || !item.isDeleted) // Don't display clothing tagged as deleted unless specified
      .map((item) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      }));
  } catch (error) {
    console.error('Error retrieving clothes:', error);
    return [];
  }
};

/**
 * Get clothing by ID
 */
export const getClothingById = async (id: string): Promise<Clothing | null> => {
  try {
    const clothes = await getClothes(true);
    const clothing = clothes.find((item) => item.clientId === id);
    return clothing || null;
  } catch (error) {
    console.error('Error retrieving clothing:', error);
    return null;
  }
};

/**
 * Update an existing clothing item
 */
export const updateClothing = async (
  clientId: string,
  updatedData: Partial<ClothingFormData>
): Promise<Clothing | null> => {
  try {
    const clothes = await getClothes();
    const clothingIndex = clothes.findIndex(
      (item) => item.clientId === clientId
    );

    if (clothingIndex === -1) return null;

    // Update the clothing
    const updatedClothing: Clothing = {
      ...clothes[clothingIndex],
      ...updatedData,
      updatedAt: new Date(),
      isSynced: false,
    };

    clothes[clothingIndex] = updatedClothing;

    // Save the updated list
    await AsyncStorage.setItem(STORAGE_KEYS.CLOTHES, JSON.stringify(clothes));

    return updatedClothing;
  } catch (error) {
    console.error('Error updating clothing:', error);
    return null;
  }
};

/**
 * Delete a clothing item
 */
export const deleteClothing = async (id: string): Promise<boolean> => {
  try {
    // Delete the clothing
    const clothes = await getClothes(true);
    const updatedClothes = clothes.filter((item) => item.clientId !== id);

    if (updatedClothes.length === clothes.length) {
      return false; // Clothing not found
    }

    await AsyncStorage.setItem(
      STORAGE_KEYS.CLOTHES,
      JSON.stringify(updatedClothes)
    );

    // Update outfits that contain this clothing item
    const outfitsJson = await AsyncStorage.getItem(STORAGE_KEYS.OUTFITS);
    if (outfitsJson) {
      const outfits = JSON.parse(outfitsJson);
      const updatedOutfits = outfits.map((outfit: Outfit) => ({
        ...outfit,
        clothes: outfit.clothes.filter(
          (clothing: Clothing) => clothing.clientId !== id
        ),
      }));

      await AsyncStorage.setItem(
        STORAGE_KEYS.OUTFITS,
        JSON.stringify(updatedOutfits)
      );
    }

    return true;
  } catch (error) {
    console.error('Error deleting clothing:', error);
    return false;
  }
};

export const tagDelete = async (id: string): Promise<boolean> => {
  try {
    const clothing = await getClothingById(id);
    if (!clothing) {
      throw new Error('Clothing item does not exist');
    }
    clothing.isDeleted = true;

    await updateClothing(id, clothing);

    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Get clothes by category
 */
export const getClothesByCategory = async (
  category: string
): Promise<Clothing[]> => {
  try {
    const clothes = await getClothes();
    return clothes.filter((item) => item.category === category);
  } catch (error) {
    console.error('Error retrieving clothes by category:', error);
    return [];
  }
};
