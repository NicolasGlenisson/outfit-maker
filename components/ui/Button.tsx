import COLORS from '@/theme/colors';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

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
  const buttonText = title || '';

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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
    borderRadius: 18,
  },
  button: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 40,
  },
  buttonFullWidth: {
    width: '100%',
  },
  buttonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: COLORS.text,
    fontSize: 16,
  },
  buttonLabelSelected: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
});
