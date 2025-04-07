import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";

import { STORAGE_KEYS } from "../constants";

import { Outfit, OutfitFormData } from "@/types/clothing";

/**
 * Save a new outfit
 */
export const saveOutfit = async (
  outfitData: OutfitFormData,
): Promise<Outfit> => {
  try {
    const outfits = await getOutfits();

    // Create a new outfit
    const newOutfit: Outfit = {
      ...outfitData,
      id: uuid.v4().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedOutfits = [...outfits, newOutfit];
    await AsyncStorage.setItem(
      STORAGE_KEYS.OUTFITS,
      JSON.stringify(updatedOutfits),
    );

    return newOutfit;
  } catch (error) {
    console.error("Error saving outfit:", error);
    throw new Error("Could not save outfit");
  }
};

/**
 * Get all outfits
 */
export const getOutfits = async (): Promise<Outfit[]> => {
  try {
    const outfitsJson = await AsyncStorage.getItem(STORAGE_KEYS.OUTFITS);
    if (!outfitsJson) return [];

    // Convert dates from string to Date
    const outfits: Outfit[] = JSON.parse(outfitsJson);
    return outfits.map((item) => ({
      ...item,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    }));
  } catch (error) {
    console.error("Error retrieving outfits:", error);
    return [];
  }
};

/**
 * Get outfit by ID
 */
export const getOutfitById = async (id: string): Promise<Outfit | null> => {
  try {
    const outfits = await getOutfits();
    const outfit = outfits.find((item) => item.id === id);
    return outfit || null;
  } catch (error) {
    console.error("Error retrieving outfit:", error);
    return null;
  }
};

/**
 * Update an existing outfit
 */
export const updateOutfit = async (
  id: string,
  updatedData: OutfitFormData,
): Promise<Outfit | null> => {
  try {
    const outfits = await getOutfits();
    const outfitIndex = outfits.findIndex((item) => item.id === id);

    if (outfitIndex === -1) return null;

    const updatedOutfit: Outfit = {
      ...outfits[outfitIndex],
      ...updatedData,
      updatedAt: new Date(),
    };

    outfits[outfitIndex] = updatedOutfit;
    await AsyncStorage.setItem(STORAGE_KEYS.OUTFITS, JSON.stringify(outfits));

    return updatedOutfit;
  } catch (error) {
    console.error("Error updating outfit:", error);
    return null;
  }
};

/**
 * Delete an outfit
 */
export const deleteOutfit = async (id: string): Promise<boolean> => {
  try {
    const outfits = await getOutfits();
    const updatedOutfits = outfits.filter((item) => item.id !== id);

    if (updatedOutfits.length === outfits.length) {
      return false; // Outfit not found
    }

    await AsyncStorage.setItem(
      STORAGE_KEYS.OUTFITS,
      JSON.stringify(updatedOutfits),
    );
    return true;
  } catch (error) {
    console.error("Error deleting outfit:", error);
    return false;
  }
};
