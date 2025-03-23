import { Href, Link } from "expo-router";
import { StyleSheet, View, Text } from "react-native";

interface LinkButtonProps {
  href: Href;
  title: string;
  isFullWidth?: boolean;
}

export default function LinkButton({
  href,
  title,
  isFullWidth = false,
}: LinkButtonProps) {
  return (
    <View style={styles.buttonContainer}>
      <Link
        style={[styles.button, isFullWidth && styles.buttonFullWidth]}
        href={href}
      >
        <Text style={styles.buttonLabel}>{title}</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
    borderRadius: 18,
    width: "auto",
  },
  button: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ffd33d",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 40,
    textAlign: "center",
  },
  buttonFullWidth: {
    width: "100%",
  },
  buttonLabel: {
    color: "#333",
    fontSize: 16,
    textAlign: "center",
  },
});
