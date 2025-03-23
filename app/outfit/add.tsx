import { useState } from "react";
import { ScrollView, Text, StyleSheet, Alert, View } from "react-native";
import { OutfitFormData } from "@/types/clothing";
import OutfitForm from "@/components/OutfitForm";
import { saveOutfit } from "@/utils/storage";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitForm = async (formData: OutfitFormData) => {
    setIsLoading(true);
    try {
      await saveOutfit(formData);
      router.push("/outfit");
    } catch (error) {
      Alert.alert("Error", "Couldn't save the outfit.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Add New Outfit</Text>
        </View>

        <OutfitForm onSubmit={handleSubmitForm} isLoading={isLoading} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
});
