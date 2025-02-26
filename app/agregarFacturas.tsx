import SelectImage from "@/components/SelectImage";
import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function AgregarFacturas () {
    const [image, setImage] = useState<string | null>(null);


    return (
        <View style={styles.container}>
        <Text style={styles.headerText}>Seleccione una imagen para procesar</Text>
        
        <Image style={styles.image} source={{uri:image as string }} />
        <SelectImage setImage={setImage} />
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
    headerText: {
        fontSize: 20,
        margin: 10,
        fontWeight: "bold",
    },
    image: {
        width: 280, 
        height: 500 ,
        margin: 10,
        borderWidth: 1,
        borderColor: "black",
        backgroundColor: "#F1F1F1",
    }
})
