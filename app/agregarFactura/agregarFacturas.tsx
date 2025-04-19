import SelectImage from "@/components/SelectImage";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, ActivityIndicator, StatusBar } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { AnalyzeExpenseCommand, AnalyzeExpenseCommandOutput, TextractClient } from "@aws-sdk/client-textract";
import * as FileSystem from "expo-file-system";
import "react-native-get-random-values"
import { Icon } from "@rneui/themed";
import { useRouter } from "expo-router";
import { Image } from "expo-image";

export default function AgregarFacturas () {
    const [image, setImage] = useState<string | null>(null);
    const [imageBuffer, setImageBuffer] = useState<string | ArrayBuffer | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const client = new TextractClient({
         region: "eu-west-3", 
        credentials: {
            accessKeyId: process.env.EXPO_PUBLIC_ACCESS_KEY_ID as string,
            secretAccessKey: process.env.EXPO_PUBLIC_SECRET_ACCESS_KEY as string,
        },
        });


const getValueFromResponse = (response: AnalyzeExpenseCommandOutput, type: string) => {
    let value = "";
    response.ExpenseDocuments!![0].SummaryFields!!.forEach(element => {
        if (element.Type?.Text == type) {
            value = element.ValueDetection?.Text!!;
        }
    });
    return value;
};

const getFieldsFromLineItem = (LineItems: any[], type: string) => {
    let value = "";
    LineItems.forEach(element => {
        if (element.Type?.Text == type) {
            value = element.ValueDetection?.Text!!;
        }
    }
    );
    
   
    return value;
}

const getItemsFromResponse = (response: AnalyzeExpenseCommandOutput) => {
    let items = [] as any;
    response.ExpenseDocuments!![0].LineItemGroups!![0].LineItems!!.forEach(element => {
        let lineItems = element.LineItemExpenseFields!!;
        if(getFieldsFromLineItem(lineItems, "UNIT_PRICE")){
            let item = {
                name: getFieldsFromLineItem(lineItems, "ITEM"),
                price: getFieldsFromLineItem(lineItems, "PRICE"),
                quantity: getFieldsFromLineItem(lineItems, "QUANTITY"),
                unit_price: getFieldsFromLineItem(lineItems, "UNIT_PRICE"),
            };
            items.push(item);
        }
        else{
            let item = {
                name: getFieldsFromLineItem(lineItems, "ITEM"),
                price: getFieldsFromLineItem(lineItems, "PRICE"),
                quantity: getFieldsFromLineItem(lineItems, "QUANTITY"),
            };
            items.push(item);
        }
        
       
        
    });
    return items;
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
        setLoading(true);

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
            let items = getItemsFromResponse(response);
            
           /* const receiptData = { establecimiento: "ds", fecha: "ds", total: "fsd", address:"as", items: [
                { name: "Producto 1", price: 100, quantity: 1 },
                { name: "Producto 2", price: 200, quantity: 2 },
            ] };*/
            const receiptData = { establecimiento, fecha, total, address, items };
            router.push({
                pathname: "../agregarFactura/formulario",
                params: { receiptData: JSON.stringify(receiptData) }, // Convertir a string
            });
        } catch (error) {
            console.log("Error al analizar imagen", error);
        }
        setLoading(false);
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
        if (!image) return;
        console.log("Insertando factura");
        
        if (image) {
            analyzeImage(image);
        }
        //insertFactura();
        

    }, [image]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
              <Image
                source={require("@/assets/images/loading_doc.gif")}
                style={styles.loadingGif}
                contentFit="contain"
                priority="high"
              />
              <Text style={styles.loadingText}>Procesando imagen</Text>
            </View>
          );
    }
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
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        paddingTop: StatusBar.currentHeight,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingGif: {
        width: 200,
        height: 200,
        marginTop: -10,
        marginBottom: 30,
        },
    loadingText: {
        fontSize: 16,
        color: "#333",
    },
})