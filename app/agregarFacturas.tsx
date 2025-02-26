import { Link } from "expo-router";
import { useState } from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function AgregarFacturas () {
    const [image, setImage] = useState<string | null>(null);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 1,
          });
      
          console.log(result);
      
          if (!result.canceled) {
            setImage(result.assets[0].uri);
          }
      };
      const takeImage = async () => {
        // No permissions request is necessary for launching the camera
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            quality: 1,
          });
      
          console.log(result);
      
          if (!result.canceled) {
            setImage(result.assets[0].uri);
          }
        }

    return (
        <View style={styles.container}>
        <Text>Agregar facturas</Text>

        <Button title="Seleccionar imagen" onPress={pickImage} />
        <Button title="Tomar imagen" onPress={takeImage} />
        <Image style={{ width: 200, height: 400 }} source={{uri:image as string }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    button: {
        backgroundColor: "blue",
        color: "white",
        padding: 10,
        borderRadius: 5,
    },
})
