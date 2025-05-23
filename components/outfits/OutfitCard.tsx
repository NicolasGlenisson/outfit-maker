import { Link } from "expo-router";
import { View, StyleSheet, Image, Text } from "react-native";

import { Outfit } from "@/types/clothing";
import COLORS from "@/theme/colors";
export default function OutfitCard({ outfit }: { outfit: Outfit }) {
  return (
    <View style={styles.container}>
      {outfit.imageUrl ? (
        <Image source={{ uri: outfit.imageUrl }} style={styles.image} />
      ) : (
        <View
          style={[
            styles.image,
            {
              backgroundColor: COLORS.background,
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <Text>{outfit.name}</Text>
        </View>
      )}
      <Link href={`/outfit/${outfit.id}`}>
        <Text style={styles.title}>{outfit.name}</Text>
      </Link>
      <Text style={styles.subtitle}>
        {outfit.clothes.map((clothing) => clothing.name).join(", ")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text,
  },
});
