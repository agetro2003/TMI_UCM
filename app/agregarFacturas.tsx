import SelectImage from "@/components/SelectImage";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
export default function AgregarFacturas () {
    const [image, setImage] = useState<string | null>(null);
    const db = useSQLiteContext();
    let fakeFactura = {
        fecha: "2022-01-01",
        productos:
            [
                { nombre: "Producto 1", precio: 100, cantidad: 1 },
                { nombre: "Producto 2", precio: 200, cantidad: 2 },
            ],
        establecimiento: "Establecimiento 1",
    };

    const insertFactura = async () => {
        if (image) {
            try{
            await db.execAsync(
                [
                    "CREATE TABLE IF NOT EXISTS facturas (",
                    "id INTEGER PRIMARY KEY AUTOINCREMENT,",
                    "fecha TEXT,",
                    "establecimiento TEXT",
                    ");",
                ].join(" ")
            );
            console.log("Tabla facturas creada");
            await db.execAsync(
                [
                    "CREATE TABLE IF NOT EXISTS productos (",
                    "id INTEGER PRIMARY KEY AUTOINCREMENT,",
                    "factura_id INTEGER,",
                    "nombre TEXT,",
                    "precio REAL,",
                    "cantidad INTEGER,",
                    "FOREIGN KEY (factura_id) REFERENCES facturas(id)",
                    ");",
                ].join(" ")
            );
            console.log("Tabla productos creada");
            await db.execAsync(
                `INSERT INTO facturas (fecha, establecimiento) VALUES ('${fakeFactura.fecha}', '${fakeFactura.establecimiento}');`,
            );
            console.log("Factura insertada");
            await db.execAsync(
                `INSERT INTO productos (factura_id, nombre, precio, cantidad) VALUES (${1}, '${fakeFactura.productos[0].nombre}', ${fakeFactura.productos[0].precio}, '${fakeFactura.productos[0].cantidad});`,
            )
            console.log("Factura insertada");
        } catch (error) {
            console.log("Error al insertar factura", error);
        }
        }
    }
    useEffect(() => {
        console.log("Insertando factura");
        insertFactura();

    }, [image]);

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
