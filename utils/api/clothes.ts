import { ApiResponse, Clothing, UserAPI } from '@/types/clothing';
import { updateClothing as updateClothingLocal } from '@/utils/storage/clothes';
import {
  getClothes as getClothesLocal,
  saveClothing,
} from '@/utils/storage/index';
import axios from 'axios';
export const getClothes = async (user: UserAPI) => {
  try {
    const response = await axios.get(
      `${process.env.EXPO_PUBLIC_API_URL}/api/clothing/user/${user._id}`
    );
    return {
      data: response.data as Clothing[],
      message: 'Trouvé',
    };
  } catch (error) {
    throw error;
  }
};

const createClothes = async (user: UserAPI, clothing: Clothing) => {
  try {
    const body = { ...clothing, clientId: clothing.clientId, user };
    const response = await axios.post(
      `${process.env.EXPO_PUBLIC_API_URL}/api/clothing/`,
      body
    );
    return {
      message: 'Clothing créé',
      data: response,
    };
  } catch (error) {
    throw error;
  }
};

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
export const categorizeClothes = (
  localClothes: Clothing[],
  cloudClothes: Clothing[]
): SyncStatus => {
  // Initialiser la structure
  const syncStatus: SyncStatus = {
    localOnly: [],
    cloudOnly: [],
    bothSources: [],
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
        cloud: matchingCloudItem,
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

    // Créer les vêtements localOnly sur le cloud
    await sendToCloud(user, syncStatus.localOnly);

    // Créer les vêtements cloudOnly en local
    // // TODO: implémenter flag isDeleted pour ne pas copier en local des elements qu'on a voulu supprimer
    await copyFromCloud(user, syncStatus.cloudOnly);

    // Si c'est présent sur le cloud et en loca, on garde le plus récent
    await syncBothSources(user, syncStatus.bothSources);

    return syncStatus;
  } catch (error) {
    console.error('Erreur lors de la synchronisation:', error);
    throw error;
  }
};

const sendToCloud = async (user: UserAPI, localClothes: Clothing[]) => {
  try {
    localClothes.forEach(async (localClothing) => {
      await createClothes(user, localClothing);
    });
  } catch (error) {
    throw error;
  }
};

const copyFromCloud = async (user: UserAPI, cloudClothes: Clothing[]) => {
  try {
    // If there are no cloud clothes to copy, return early
    if (cloudClothes.length === 0) return;

    // We can now pass all the clothing items at once
    const clothingDataArray = cloudClothes.map((cloudClothing) => ({
      name: cloudClothing.name,
      category: cloudClothing.category,
      color: cloudClothing.color,
      brand: cloudClothing.brand,
      imageUrl: cloudClothing.imageUrl,
      seasons: cloudClothing.seasons,
      occasions: cloudClothing.occasions,
    }));

    // Create client IDs array matching the order of clothingDataArray
    const clientIds = cloudClothes.map((item) => item.clientId);

    // Save all clothing items in a batch, preserving the client IDs
    for (let i = 0; i < clothingDataArray.length; i++) {
      await saveClothing(clothingDataArray[i], clientIds[i]);
    }
  } catch (error) {
    throw error;
  }
};

const syncBothSources = async (
  user: UserAPI,
  clothes: { local: Clothing; cloud: Clothing }[]
) => {
  try {
    for (let i = 0; i < clothes.length; i++) {
      // Version local plus à jour
      if (
        new Date(clothes[i].local.updatedAt).getTime() >
        new Date(clothes[i].cloud.updatedAt).getTime()
      ) {
        await updateClothing(user, clothes[i].local);
        // Version cloud plus à jour
      } else if (
        new Date(clothes[i].local.updatedAt).getTime() <
        new Date(clothes[i].cloud.updatedAt).getTime()
      ) {
        await updateClothingLocal(clothes[i].local.clientId, clothes[i].cloud);
      }
    }
  } catch (error) {
    throw new Error("Can't sync both source");
  }
};

const updateClothing = async (user: UserAPI, clothing: Clothing) => {
  try {
    const body = { ...clothing, clientId: clothing.clientId, user };
    const response = await axios.put(
      `${process.env.EXPO_PUBLIC_API_URL}/api/clothing/client/${clothing.clientId}`,
      body
    );
    return {
      message: 'Clothing mis à jour',
      data: response,
    };
  } catch (error) {
    throw error;
  }
};
