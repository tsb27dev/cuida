import React, { useState } from 'react';
import { Button, Image, View, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const [imageUri, setImageUri] = useState(null);

  // 1) Pedir permissão e escolher imagem
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
  
    console.log('🎯 picker result:', result);
  
    // para SDKs antigos e novos
    if ((!result.canceled && result.assets?.length > 0) || (!result.cancelled && result.uri)) {
      // escolhe o primeiro URI que existir
      const uri = result.uri 
                  ?? result.assets[0].uri;
      setImageUri(uri);
    }
  };
  

  // 2) Enviar ao servidor
  const uploadImage = async () => {
    if (!imageUri) {
      Alert.alert('Escolhe imagem primeiro');
      return;
    }
  
    const formData = new FormData();
    const filename = imageUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';
  
    formData.append('image', { uri: imageUri, name: filename, type });
  
    try {
      console.log('➡️ a fazer POST…');
      const res = await fetch('https://cuida-ftm2.onrender.com/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',  // no Android/Expo é essencial
        },
      });
      const json = await res.json();
      console.log('✅ resposta:', json);
      Alert.alert('Upload concluído', JSON.stringify(json));
    } catch (err) {
      console.error('❌ erro no upload', err);
      Alert.alert('Erro', err.message);
    }
  };
  
  console.log({ imageUri });

  return (
    <View style={styles.container}>
      <Button title="Escolher Imagem" onPress={pickImage} />
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.preview} />
      )}
      <View style={{ height: 20 }} />
      <Button title="Enviar ao Servidor" onPress={uploadImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  preview: { width: 200, height: 200, marginTop: 20, borderRadius: 10 },
});
