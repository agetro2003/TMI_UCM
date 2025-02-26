import { View, Text, StyleSheet } from "react-native";

export default function RealizarComparacion() {
    return (
        <View style={styles.container}>
            <Text>Realizar comparación</Text>
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
});