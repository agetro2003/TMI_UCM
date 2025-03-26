import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect } from "react";

export default function VerFacturas () {
    const db = useSQLiteContext();

    const getFacturas = async () => {
        try {
            const facturas = await db.getAllAsync("SELECT * FROM facturas;");
            const productos = await db.getAllAsync("SELECT * FROM productos;");
            const establecimientos = await db.getAllAsync("SELECT * FROM establecimientos;");
            const facturaProductos = await db.getAllAsync("SELECT * FROM factura_productos;");
            console.log("Establecimientos", establecimientos);
            console.log("Productos", productos);
            console.log("Facturas", facturas);
            console.log("FacturaProductos", facturaProductos);
        } catch (error) {
            console.log("Error al obtener facturas", error);
        }
    }

    useEffect(() => {
        getFacturas();
    }, []);
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
