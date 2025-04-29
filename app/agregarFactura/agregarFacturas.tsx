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
import {classifier}  from "@/api/axios"

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
            
            const namesOfProducts = items.map((item: any) => item.name);
            const res = await classifier.post(
                "/categorizar",
                { nombres: namesOfProducts }
              );
              const tags = res.data;
              items.forEach((item: any, index: number) => {
                  item.tag = tags[index].tag;
                });
                
   
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

    useEffect(() => {
        if (!image) return;
        
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