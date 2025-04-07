import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, Image, StyleSheet, View } from 'react-native';

import Button from './Button';

interface PhotoPickerProps {
  handleChangeImage: (arg: string) => void;
  initialImage?: string;
}

export default function PhotoPicker({
  handleChangeImage,
  initialImage,
}: PhotoPickerProps) {
  const [image, setImage] = useState<string | null>(initialImage || null);

  const pickImage = async () => {
    Alert.alert(
      'Choose an option',
      '',
      [
        {
          text: 'Take a picture',
          onPress: async () => {
            const permission =
              await ImagePicker.requestCameraPermissionsAsync();
            if (permission.granted) {
              const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ['images'],
                quality: 1,
                allowsEditing: true,
              });
              if (!result.canceled) {
                setImage(result.assets[0].uri);
                handleChangeImage(result.assets[0].uri);
              }
            }
          },
        },
        {
          text: 'Choose from gallery',
          onPress: async () => {
            const permission =
              await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (permission.granted) {
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                quality: 1,
                allowsEditing: true,
              });
              if (!result.canceled) {
                setImage(result.assets[0].uri);
                handleChangeImage(result.assets[0].uri);
              }
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View>
      <Button title="Choose an image" onPress={pickImage} isFullWidth={true} />
      {image && <Image source={{ uri: image }} style={styles.preview} />}
    </View>
  );
}

const styles = StyleSheet.create({
  preview: {
    width: '100%',
    height: 300,
    marginBottom: 16,
    borderRadius: 8,
    resizeMode: 'contain',
  },
});
