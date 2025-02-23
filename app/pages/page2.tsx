import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Page2 () {
    return (
        <View style={styles.container}>
        <Text>Page 2</Text>
        <Link style={styles.button} href={{
                    pathname: "/pages/page1",
                }}> 
                <Text>Go to page 1</Text>
                </Link>
        <Link style={styles.button} href={{
            pathname: "/",
        }}>
            <Text>Go to index </Text></Link>      
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
