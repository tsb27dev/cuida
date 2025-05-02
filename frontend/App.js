import React, { useState } from 'react';
import { Button, Image, View, Alert, StyleSheet, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const [imageUri, setImageUri] = useState(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Preciso de acesso às fotos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if ((!result.canceled && result.assets?.length > 0) || (!result.cancelled && result.uri)) {
      const uri = result.uri ?? result.assets[0].uri;
      setImageUri(uri);
    }
  };

  const uploadImage = async () => {
    if (!imageUri) {
      Alert.alert('Escolhe imagem primeiro');
      return;
    }

    const formData = new FormData();
    const filename = imageUri.split('/').pop();

    // converter data URI em blob (necessário no web)
    const blob = await fetch(imageUri).then(res => res.blob());
    formData.append('image', blob, filename);

    try {
      console.log('➡️ a fazer POST…');
      const res = await fetch('https://cuida-ftm2.onrender.com/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error(`Servidor respondeu com ${res.status}`);

      const json = await res.json();
      console.log('✅ resposta:', json);
      Alert.alert('Upload concluído', JSON.stringify(json));
    } catch (err) {
      console.error('❌ erro no upload', err);
      Alert.alert('Erro', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Escolher Imagem" onPress={pickImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}
      <View style={{ height: 20 }} />
      <Button title="Enviar ao Servidor" onPress={uploadImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  preview: { width: 200, height: 200, marginTop: 20, borderRadius: 10 },
});
