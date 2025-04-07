import { SafeAreaView, StyleSheet } from "react-native";
import { COLORS } from "@/theme/colors";

import ClotheList from "@/components/clothes/ClothingList";
import LinkButton from "@/components/ui/LinkButton";

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <LinkButton title="Add clothing" href="/clothes/add" isFullWidth />
      <ClotheList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
