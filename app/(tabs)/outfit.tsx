import LinkButton from "@/components/LinkButton";
import { SafeAreaView, StyleSheet, View } from "react-native";
import OutfitList from "@/components/OutfitList";

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <LinkButton title="Create outfit" href="/outfit/add" isFullWidth={true} />
      <OutfitList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
