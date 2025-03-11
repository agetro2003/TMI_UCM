import SelectImage from "@/components/SelectImage";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { AnalyzeExpenseCommand, AnalyzeExpenseCommandOutput, TextractClient } from "@aws-sdk/client-textract";
import * as FileSystem from "expo-file-system";
import "react-native-get-random-values"
export default function AgregarFacturas () {
    const [image, setImage] = useState<string | null>(null);
    const [imageBuffer, setImageBuffer] = useState<string | ArrayBuffer | null>(null);
 /*   const client = new TextractClient({
         region: "eu-west-3", 
        credentials: {
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
        },
        });
*/

const getValueFromResponse = (response: AnalyzeExpenseCommandOutput, type: string) => {
    let value = "";
    response.ExpenseDocuments!![0].SummaryFields!!.forEach(element => {
        if (element.Type?.Text == type) {
            value = element.ValueDetection?.Text!!;
        }
    });
    return value;
};

const base64toUint8Array = (base64: string) => {
    const binaryString = window.atob(base64);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
        const ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
    }
    return bytes;
};

// analyze invoice and receipt images
    const analyzeImage = async (image: string) => {
        try {
           // Leer la imagen y convertirla a Base64
           const base64 = await FileSystem.readAsStringAsync(image, { encoding: 'base64' });
            const imageBuffer = base64toUint8Array(base64);
           // Configurar los parámetros de la solicitud a AWS Textract
           const params = {
               Document: { Bytes: imageBuffer },
           };
                
            const eExpense = new AnalyzeExpenseCommand(params);
            const response = await client.send(eExpense);
            let establecimiento = getValueFromResponse(response, "VENDOR_NAME");
            let fecha = getValueFromResponse(response, "INVOICE_RECEIPT_DATE");
            let total = getValueFromResponse(response, "TOTAL");
            let address = getValueFromResponse(response, "ADDRESS_BLOCK");
            
            console.log("Response", { establecimiento, fecha, total, address });
        } catch (error) {
            console.log("Error al analizar imagen", error);
        }
    }


    /*const db = useSQLiteContext();
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
                INSERT INTO facturas (fecha, establecimiento) VALUES ('${fakeFactura.fecha}', '${fakeFactura.establecimiento}');,
            );
            console.log("Factura insertada");
            await db.execAsync(
                INSERT INTO productos (factura_id, nombre, precio, cantidad) VALUES (${1}, '${fakeFactura.productos[0].nombre}', ${fakeFactura.productos[0].precio}, '${fakeFactura.productos[0].cantidad});,
            )
            console.log("Factura insertada");
        } catch (error) {
            console.log("Error al insertar factura", error);
        }
        }
    }*/
    useEffect(() => {
        console.log("Insertando factura");
        if (image) {
            analyzeImage(image);
        }
        //insertFactura();

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