import LinkButton from "@/components/LinkButton";
import { SafeAreaView, StyleSheet, View } from "react-native";
import ClotheList from "@/components/ClotheList";

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <LinkButton title="Add clothing" href="/clothes/add" isFullWidth={true} />
      <ClotheList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
