import AsyncStorage from '@react-native-async-storage/async-storage';
import { Clothing, ClothingFormData, Outfit, OutfitFormData } from '@/types/clothing';
import uuid from 'react-native-uuid';
import OutfitForm from '@/components/OutfitForm';

//storage keys
const STORAGE_KEYS = {
  CLOTHES: 'outfit-app-clothes',
  OUTFITS: 'outfit-app-outfits',
};

/**
 * Save a new clothe in local storage
 */
export const saveClothing = async (clothingData: ClothingFormData): Promise<Clothing> => {
  try {
    // get existing clothes
    const existingClothes = await getClothes();
    
    // Create a new clothe
    const newClothing: Clothing = {
      ...clothingData,
      id: uuid.v4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Ajouter le nouveau vêtement à la liste
    const updatedClothes = [...existingClothes, newClothing];
    
    // Enregistrer dans le stockage
    await AsyncStorage.setItem(STORAGE_KEYS.CLOTHES, JSON.stringify(updatedClothes));
    
    return newClothing;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du vêtement:', error);
    throw new Error('Impossible de sauvegarder le vêtement');
  }
};

/**
 * Récupère tous les vêtements stockés localement
 */
export const getClothes = async (): Promise<Clothing[]> => {
  try {
    const clothesJson = await AsyncStorage.getItem(STORAGE_KEYS.CLOTHES);
    if (!clothesJson) return [];
    
    // Convertir les dates de string à Date
    const clothes: Clothing[] = JSON.parse(clothesJson);
    return clothes.map(item => ({
      ...item,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des vêtements:', error);
    return [];
  }
};

export const getClothesByCategories = async(): Promise<Clothing[]> => {
    try {
        const clothes = await getClothes();

        
        return clothes;
    } catch (error) {
        console.error('Erreur lors de la récupération des vêtements:', error);
        return [];
      }
}
/**
 * Get clothing by ID
 */
export const getClothingById = async (id: string): Promise<Clothing | null> => {
  try {
    const clothes = await getClothes();
    console.log(id);
    console.log(clothes);
    const clothing = clothes.find(item => item.id === id);
    console.log(clothing);
    return clothing || null;
  } catch (error) {
    console.error('Erreur lors de la récupération du vêtement:', error);
    return null;
  }
};

/**
 * Met à jour un vêtement existant
 */
export const updateClothing = async (id: string, updatedData: Partial<ClothingFormData>): Promise<Clothing | null> => {
  try {
    const clothes = await getClothes();
    const clothingIndex = clothes.findIndex(item => item.id === id);
    
    if (clothingIndex === -1) return null;
    
    // Mettre à jour le vêtement
    const updatedClothing: Clothing = {
      ...clothes[clothingIndex],
      ...updatedData,
      updatedAt: new Date(),
    };
    
    clothes[clothingIndex] = updatedClothing;
    
    // Enregistrer la liste mise à jour
    await AsyncStorage.setItem(STORAGE_KEYS.CLOTHES, JSON.stringify(clothes));
    
    return updatedClothing;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du vêtement:', error);
    return null;
  }
};

/**
 * Supprime un vêtement
 */
export const deleteClothing = async (id: string): Promise<boolean> => {
  try {
    const clothes = await getClothes();
    const updatedClothes = clothes.filter(item => item.id !== id);
    
    if (updatedClothes.length === clothes.length) {
      return false; // Vêtement non trouvé
    }
    
    await AsyncStorage.setItem(STORAGE_KEYS.CLOTHES, JSON.stringify(updatedClothes));
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression du vêtement:', error);
    return false;
  }
};

export const saveOutfit = async (outfitData: OutfitFormData) => {

  try {
    const outfits = await getOutfits();

    // Create a new outfit
    const newOutfit: Outfit = {
      ...outfitData,
      id: uuid.v4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedOutfits = [...outfits, newOutfit];

    await AsyncStorage.setItem(STORAGE_KEYS.OUTFITS, JSON.stringify(updatedOutfits));

    return newOutfit;
  } catch(error) {
    console.error('Error saving outfit');
  }

}


/**
 * Récupère tous les outfits stockés localement
 */
export const getOutfits = async (): Promise<Outfit[]> => {
  try {
    const outfitsJson = await AsyncStorage.getItem(STORAGE_KEYS.OUTFITS);
    if (!outfitsJson) return [];
    
    // Convertir les dates de string à Date
    const outfits: Outfit[] = JSON.parse(outfitsJson);
    return outfits.map(item => ({
      ...item,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    }));
  } catch (error) {
    console.error('Error getting outfits:', error);
    return [];
  }
};

/**
 * Récupère un outfit par son ID
 */
export const getOutfitById = async (id: string): Promise<Outfit | null> => {
  try {
    const outfits = await getOutfits();
    const outfit = outfits.find(item => item.id === id);
    return outfit || null;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'outfit:', error);
    return null;
  }
};

/**
 * Met à jour un outfit existant
 */
export const updateOutfit = async (id: string, updatedData: OutfitFormData): Promise<Outfit | null> => {
  try {
    const outfits = await getOutfits();
    const outfitIndex = outfits.findIndex(item => item.id === id);
    
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
    console.error('Erreur lors de la mise à jour de l\'outfit:', error);
    return null;
  }
};

/**
 * Supprime un outfit
 */
export const deleteOutfit = async (id: string): Promise<boolean> => {
  try {
    const outfits = await getOutfits();
    const updatedOutfits = outfits.filter(item => item.id !== id);
    
    if (updatedOutfits.length === outfits.length) {
      return false; // Outfit non trouvé
    }
    
    await AsyncStorage.setItem(STORAGE_KEYS.OUTFITS, JSON.stringify(updatedOutfits));
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'outfit:', error);
    return false;
  }
};