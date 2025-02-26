import { Link } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";

export default function AgregarFacturas () {
    const [image, setImage] = useState<string | null>(null);

    const imagenGaleria = async () => {
        const result = await launchImageLibrary({
            mediaType: "photo",
        });
        const uri = result.assets?.[0].uri;
        setImage(uri as string);
    };


    return (
        <View style={styles.container}>
        <Text>Agregar facturas</Text>

       
        <Text style={styles.button} onPress={imagenGaleria}>Buscar foto</Text>

        <Image style={{ width: 200, height: 200 }} source={{uri:image as string }} />
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
});
