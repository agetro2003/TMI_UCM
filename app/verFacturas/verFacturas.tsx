import { Link, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import MenuButtons from "@/components/MenuButton";
import Search from "@/components/Search";

export default function VerFacturas () {
    const db = useSQLiteContext();
    const [data, setData]= useState<any[]>([])
    const [showedData, setShowedData]= useState<any[]>([])


    

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
                INNER JOIN establecimientos as e on e.id=f.establecimiento;
                `);
            setData(facturas_establecimientos);
            setShowedData(facturas_establecimientos);
            console.log("data", facturas_establecimientos);
           
        } catch (error) {
            console.log("Error al obtener facturas", error);
        }
    }

    useEffect(() => {
      //  getFacturas();
        getDatosLista();
    }, []);
    return (

        <View style={styles.container}>
      <Search data={data} setShowedData={setShowedData} />
<MenuButtons buttonsInfo={showedData}></MenuButtons>
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
        backgroundColor: "#4A4E69",
        color: "white",
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
});
