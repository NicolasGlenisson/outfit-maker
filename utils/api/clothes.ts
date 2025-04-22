import { ApiResponse, Clothing, UserAPI } from '@/types/clothing';
import {
  deleteClothing as deleteClothingLocal,
  getClothingById,
  updateClothing as updateClothingLocal,
} from '@/utils/storage/clothes';
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
      message: 'Found',
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
      message: 'Clothing created',
      data: response,
    };
  } catch (error) {
    throw error;
  }
};

const deleteClothing = async (user: UserAPI, clientId: string) => {
  try {
    const response = await axios.delete(
      `${process.env.EXPO_PUBLIC_API_URL}/api/clothing/client/${clientId}`
    );
    return {
      message: 'Clothing deleted',
      data: response,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Structure to classify clothing items by presence
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
 * Categorizes clothing items based on their presence in local storage or cloud
 * @param localClothes List of local clothing items
 * @param cloudClothes List of cloud clothing items
 * @returns Organized structure of clothing items by category
 */
export const categorizeClothes = (
  localClothes: Clothing[],
  cloudClothes: Clothing[]
): SyncStatus => {
  // Initialize structure
  const syncStatus: SyncStatus = {
    localOnly: [],
    cloudOnly: [],
    bothSources: [],
  };

  // Map for quick access to cloud clothing items by their client identifier
  const cloudClothesMap = new Map();
  cloudClothes.forEach((cloudItem: Clothing) => {
    if (cloudItem.clientId) {
      cloudClothesMap.set(cloudItem.clientId, cloudItem);
    }
  });

  // Loop through local clothing items and classify them
  localClothes.forEach((localItem: Clothing) => {
    const matchingCloudItem = cloudClothesMap.get(localItem.clientId);

    if (matchingCloudItem) {
      // Present in both sources
      syncStatus.bothSources.push({
        local: localItem,
        cloud: matchingCloudItem,
      });
      // Remove the item from the map to identify cloud-only items later
      cloudClothesMap.delete(localItem.clientId);
    } else {
      // Present only in local storage
      syncStatus.localOnly.push(localItem);
    }
  });

  // Remaining items in the map are only present in the cloud
  cloudClothesMap.forEach((cloudItem) => {
    syncStatus.cloudOnly.push(cloudItem);
  });

  return syncStatus;
};

/**
 * Synchronizes clothing items between local database and server
 * @param user Current user
 * @returns Synchronization result
 */
export const syncClothing = async (user: UserAPI) => {
  try {
    const response: ApiResponse<Clothing[]> = await getClothes(user);
    const cloudClothes = response.data || [];
    const localClothes = await getClothesLocal();

    // Categorize clothing items with the dedicated function
    const syncStatus = categorizeClothes(localClothes, cloudClothes);
    // Log the count of items in each category
    console.log(`Synchronization - Stats:
      - Local-only items: ${syncStatus.localOnly.length}
      - Cloud-only items: ${syncStatus.cloudOnly.length}
      - Items present in both locations: ${syncStatus.bothSources.length}
    `);
    // Create localOnly clothing items on the cloud
    await sendToCloud(user, syncStatus.localOnly);

    // Create cloudOnly clothing items locally
    // // TODO: implement isDeleted flag to avoid copying locally items that we wanted to delete
    await copyFromCloud(user, syncStatus.cloudOnly);

    // If present on cloud and locally, keep the most recent
    await syncBothSources(user, syncStatus.bothSources);

    return syncStatus;
  } catch (error) {
    console.error('Error during synchronization:', error);
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
      clientId: cloudClothing.clientId,
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
      const clothingId = clothingDataArray[i].clientId;
      // Check if clothing already exists locally and is tagged as deleted
      const localClothing = await getClothingById(clothingId);
      console.log(JSON.stringify(localClothing));
      if (localClothing?.isDeleted) {
        console.log('deleteLocal');
        const isDeletedLocally = await deleteClothingLocal(clothingId);
        // Then we delete on cloud
        if (isDeletedLocally) {
          await deleteClothing(user, clothingId);
          console.log('delete cloud');
        }
      } else {
        await saveClothing(clothingDataArray[i], clientIds[i]);
      }
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
      // Local version more up-to-date
      if (
        new Date(clothes[i].local.updatedAt).getTime() >
        new Date(clothes[i].cloud.updatedAt).getTime()
      ) {
        await updateClothing(user, clothes[i].local);
        // Cloud version more up-to-date
      } else if (
        new Date(clothes[i].local.updatedAt).getTime() <
        new Date(clothes[i].cloud.updatedAt).getTime()
      ) {
        await updateClothingLocal(clothes[i].local.clientId, clothes[i].cloud);
      }
    }
  } catch (error) {
    throw new Error("Can't sync both sources");
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
      message: 'Clothing updated',
      data: response,
    };
  } catch (error) {
    throw error;
  }
};
