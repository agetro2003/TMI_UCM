import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function VerFacturas () {
    return (
        <View style={styles.container}>
        <Text>Page 2</Text>
      

            <Link style={styles.button} href="..">
                Atrás
            </Link>

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
