import { ApiResponse, Clothing, UserAPI } from "@/types/clothing";
import { getClothes as getClothesLocal, saveClothing } from '@/utils/storage/index';
import axios from "axios";


export const getClothes = async (user:UserAPI) => {
  try {
    const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/clothing/user/${user._id}`);
    return {
      data: response.data as Clothing[],
      message: "Trouvé"
    }
  } catch(error) {
    throw error;
  }
}

const createClothes = async(user:UserAPI, clothing: Clothing) => {
  try {
    const body = {...clothing, clientId: clothing.clientId, user};
    const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/api/clothing/`, body);
    return {
      message: "Clothing créé",
      data: response
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Structure pour classer les vêtements selon leur présence
 */
interface SyncStatus {
  localOnly: Clothing[];
  cloudOnly: Clothing[];
  bothSources: {
    local: Clothing;
    cloud: Clothing;
  }[];
}

/**
 * Catégorise les vêtements selon leur présence en local ou dans le cloud
 * @param localClothes Liste des vêtements locaux
 * @param cloudClothes Liste des vêtements du cloud
 * @returns Structure organisée des vêtements par catégorie
 */
export const categorizeClothes = (localClothes: Clothing[], cloudClothes: Clothing[]): SyncStatus => {
  // Initialiser la structure
  const syncStatus: SyncStatus = {
    localOnly: [],
    cloudOnly: [],
    bothSources: []
  };

  // Map pour accéder rapidement aux vêtements du cloud par leur identifiant client
  const cloudClothesMap = new Map();
  cloudClothes.forEach((cloudItem: Clothing) => {
    if (cloudItem.clientId) {
      cloudClothesMap.set(cloudItem.clientId, cloudItem);
    }
  });

  // Parcourir les vêtements locaux et les classer
  localClothes.forEach((localItem: Clothing) => {
    const matchingCloudItem = cloudClothesMap.get(localItem.clientId);
    
    if (matchingCloudItem) {
      // Présent dans les deux sources
      syncStatus.bothSources.push({
        local: localItem,
        cloud: matchingCloudItem
      });
      // Retirer l'élément de la map pour identifier les éléments uniquement cloud après
      cloudClothesMap.delete(localItem.clientId);
    } else {
      // Présent uniquement en local
      syncStatus.localOnly.push(localItem);
    }
  });

  // Les éléments restants dans la map sont uniquement présents dans le cloud
  cloudClothesMap.forEach((cloudItem) => {
    syncStatus.cloudOnly.push(cloudItem);
  });

  return syncStatus;
};

/**
 * Synchronise les vêtements entre la base de données locale et le serveur
 * @param user Utilisateur actuel
 * @returns Résultat de la synchronisation
 */
export const syncClothing = async (user: UserAPI) => {
  try {
    const response: ApiResponse<Clothing[]> = await getClothes(user);
    const cloudClothes = response.data || [];
    const localClothes = await getClothesLocal();
    
    // Catégoriser les vêtements avec la fonction dédiée
    const syncStatus = categorizeClothes(localClothes, cloudClothes);



    console.log('Synchronisation status:', {
      localOnly: syncStatus.localOnly.length,
      cloudOnly: syncStatus.cloudOnly.length,
      bothSources: syncStatus.bothSources.length
    });

    // Créer les vêtements localOnly sur le cloud
    await sendToCloud(user, syncStatus.localOnly);

    // Créer les vêtements cloudOnly en local
    // // TODO: implémenter flag isDeleted pour ne pas copier en local des elements qu'on a voulu supprimer
    await copyFromCloud(user, syncStatus.cloudOnly);
    
    return syncStatus;
  } catch(error) {
    console.error('Erreur lors de la synchronisation:', error);
    throw error;
  }
}

const sendToCloud = async(user:UserAPI, localClothes: Clothing[]) => {

  try {
    localClothes.forEach( async(localClothing) => {
      await createClothes(user, localClothing);
    })
  } catch (error) {
    throw error;
  }

}

const copyFromCloud = async(user:UserAPI, cloudClothes: Clothing[]) => {

  try {
    cloudClothes.forEach( async(cloudClothing) => {
      await saveClothing(cloudClothing, cloudClothing.clientId);
    })
  } catch (error) {
    throw error;
  }

}