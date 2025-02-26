import { View, Text, StyleSheet } from "react-native";
export default function VerInformes() {
    return (
        <View style={styles.container}>
            <Text>Ver informes</Text>
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