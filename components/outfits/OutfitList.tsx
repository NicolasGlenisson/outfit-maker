import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, FlatList, StyleSheet } from "react-native";

import OutfitCard from "@/components/outfits/OutfitCard";
import { Outfit } from "@/types/clothing";
import { getOutfits } from "@/utils/storage/index";
import COLORS from "@/theme/colors";

export default function OutfitList() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadOutfits = async () => {
    const outfitsData = await getOutfits();
    setOutfits(outfitsData);
    setIsLoading(false);
  };

  useEffect(() => {
    loadOutfits();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.primary} />
      ) : (
        <FlatList
          data={outfits}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <OutfitCard outfit={item} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
