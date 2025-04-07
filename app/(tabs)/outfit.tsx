import { SafeAreaView, StyleSheet } from "react-native";
import { COLORS } from "@/theme/colors";

import OutfitList from "@/components/outfits/OutfitList";
import LinkButton from "@/components/ui/LinkButton";

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <LinkButton title="Create outfit" href="/outfit/add" isFullWidth />
      <OutfitList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
