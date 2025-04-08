import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function MenuButtons({buttonsInfo}: {buttonsInfo: {id: number, nombre: string, total: string|number, fecha: string}[]}) {
    
    const router = useRouter();
    const onPress = (id : number) => {
        router.push({
            pathname: "../verFacturas/factura",
            params: {
                facturaId: id,
            }
        });
    }
    return (
        <View style={styles.container}>
            {buttonsInfo.map((buttonInfo, index) => (
                <TouchableOpacity 
                onPress={() => onPress(buttonInfo.id)}
                style={styles.button} key={index}  activeOpacity={0.7}>
                    <View style={styles.content}>
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>{buttonInfo.nombre}</Text>
                            <Text style={styles.description}>{buttonInfo.fecha}</Text>
                        </View>
                        <View>
                            <Text style={styles.title}>{buttonInfo.total}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-evenly",
        width: "100%",
        alignItems: "center",
        paddingVertical: 20,
    },
    button: {
        width: "90%",
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 25,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
        marginBottom: 15,
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    textContainer: {
        flex: 1,
        marginRight: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },
    description: {
        fontSize: 14,
        color: "#666",
    },
    image: {
        width: 80,
        height: 80,
        resizeMode: "contain",
    },
});
