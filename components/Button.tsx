import { Href, Link } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface ButtonProps {
  title?: string;
  onPress?: () => void;
  selected?: boolean;
  loading?: boolean;
  isFullWidth?: boolean;
  style?: object;
}

export default function Button({
  onPress,
  title,
  selected = false,
  loading = false,
  isFullWidth = false,
  style,
}: ButtonProps) {
  // Utiliser les props alternatives si les originales ne sont pas fournies
  const buttonText = title || "";

  return (
    <View style={[styles.buttonContainer, style]}>
      <Pressable
        style={[
          styles.button,
          selected && styles.buttonSelected,
          loading && styles.buttonDisabled,
          isFullWidth && styles.buttonFullWidth,
        ]}
        onPress={loading ? undefined : onPress}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#000" size="small" />
        ) : (
          <Text
            style={[styles.buttonLabel, selected && styles.buttonLabelSelected]}
          >
            {buttonText}
          </Text>
        )}
      </Pressable>
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
  },
  buttonFullWidth: {
    width: "100%",
  },
  buttonSelected: {
    backgroundColor: "#ffd33d",
    borderColor: "#ffd33d",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: "#333",
    fontSize: 16,
  },
  buttonLabelSelected: {
    color: "#000",
    fontWeight: "bold",
  },
});
