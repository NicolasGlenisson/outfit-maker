import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";

import { STORAGE_KEYS } from "../constants";

import { Clothing, ClothingFormData, Outfit } from "@/types/clothing";

/**
 * Save a new clothing item in local storage
 */
export const saveClothing = async (
  clothingData: ClothingFormData,
  clientId?: string,
): Promise<Clothing> => {
  try {
    // get existing clothes
    const existingClothes = await getClothes();

    // Create a new clothe
    const newClothing: Clothing = {
      ...clothingData,
      clientId: clientId || uuid.v4().toString(), // On peut set nous meme le clientId si on synchro depuis le cloud
      createdAt: new Date(),
      updatedAt: new Date(),
      isSynced: false,
    };

    // Add the new clothing to the list
    const updatedClothes = [...existingClothes, newClothing];

    // Save to storage
    await AsyncStorage.setItem(
      STORAGE_KEYS.CLOTHES,
      JSON.stringify(updatedClothes),
    );

    return newClothing;
  } catch (error) {
    console.error("Error saving clothing:", error);
    throw new Error("Could not save clothing");
  }
};

/**
 * Retrieve all clothing items
 */
export const getClothes = async (): Promise<Clothing[]> => {
  try {
    const clothesJson = await AsyncStorage.getItem(STORAGE_KEYS.CLOTHES);
    if (!clothesJson) return [];

    // Convert dates from string to Date
    const clothes: Clothing[] = JSON.parse(clothesJson);
    return clothes.map((item) => ({
      ...item,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    }));
  } catch (error) {
    console.error("Error retrieving clothes:", error);
    return [];
  }
};

/**
 * Get clothing by ID
 */
export const getClothingById = async (id: string): Promise<Clothing | null> => {
  try {
    const clothes = await getClothes();
    const clothing = clothes.find((item) => item.clientId === id);
    return clothing || null;
  } catch (error) {
    console.error("Error retrieving clothing:", error);
    return null;
  }
};

/**
 * Update an existing clothing item
 */
export const updateClothing = async (
  id: string,
  updatedData: Partial<ClothingFormData>,
): Promise<Clothing | null> => {
  try {
    const clothes = await getClothes();
    const clothingIndex = clothes.findIndex((item) => item.clientId === id);

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
    console.error("Error updating clothing:", error);
    return null;
  }
};

/**
 * Delete a clothing item
 */
export const deleteClothing = async (id: string): Promise<boolean> => {
  try {
    // Delete the clothing
    const clothes = await getClothes();
    const updatedClothes = clothes.filter((item) => item.clientId !== id);

    if (updatedClothes.length === clothes.length) {
      return false; // Clothing not found
    }

    await AsyncStorage.setItem(
      STORAGE_KEYS.CLOTHES,
      JSON.stringify(updatedClothes),
    );

    // Update outfits that contain this clothing item
    const outfitsJson = await AsyncStorage.getItem(STORAGE_KEYS.OUTFITS);
    if (outfitsJson) {
      const outfits = JSON.parse(outfitsJson);
      const updatedOutfits = outfits.map((outfit: Outfit) => ({
        ...outfit,
        clothes: outfit.clothes.filter((clothing: Clothing) => clothing.clientId !== id)
      }));
      
      await AsyncStorage.setItem(
        STORAGE_KEYS.OUTFITS,
        JSON.stringify(updatedOutfits),
      );
    }

    return true;
  } catch (error) {
    console.error("Error deleting clothing:", error);
    return false;
  }
};

/**
 * Get clothes by category
 */
export const getClothesByCategory = async (
  category: string,
): Promise<Clothing[]> => {
  try {
    const clothes = await getClothes();
    return clothes.filter((item) => item.category === category);
  } catch (error) {
    console.error("Error retrieving clothes by category:", error);
    return [];
  }
};
