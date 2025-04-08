import { Link, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import MenuButtons from "@/components/MenuButton";

export default function VerFacturas () {
    const db = useSQLiteContext();
    const [data, setData]= useState<any[]>([])
    

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

    const getDatosLista = async() => {
        try {
            const facturas_establecimientos= await db.getAllAsync(`
                SELECT e.nombre, f.id, f.fecha, f.total 
                FROM facturas as f 
                INNER JOIN establecimientos as e on e.id=f.establecimiento;`);
            console.log("Opciones menu", facturas_establecimientos);
            setData(facturas_establecimientos);
           
        } catch (error) {
            console.log("Error al obtener facturas", error);
        }
    }

    useEffect(() => {
        getFacturas();
        getDatosLista();
    }, []);
    return (

        <View style={styles.container}>
        <Text>Page 2</Text>
      
<MenuButtons buttonsInfo={data}></MenuButtons>
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
