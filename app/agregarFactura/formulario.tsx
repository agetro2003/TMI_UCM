import Input from "@/components/Input";
import ItemInput from "@/components/ItemInput";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {  ScrollView, Text, View, Pressable, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

export default function Formulario() {
const {receiptData} = useLocalSearchParams()
const parsedData = receiptData ? JSON.parse(receiptData as string) : {};
const [formData, setFormData] = useState(parsedData)
const router = useRouter();
//console.log(parsedData)

const db = useSQLiteContext();

const insertReceipt = async() => {
    try {

      const resultEstablecimiento = await db.runAsync(
        ` 
        INSERT OR IGNORE INTO Establecimientos (nombre) 
        VALUES (?);
        `, [formData.establecimiento]
      );  
      console.log("Establecimiento insertado: \n", resultEstablecimiento);
      // ver estructura de la tabla Facturas
     // const tablaFacturas = await db.getAllAsync("PRAGMA table_info(Facturas);");
      //console.log("Estructura de la tabla Facturas: \n", tablaFacturas);
      const resultFactura = await db.runAsync(
        `
        INSERT INTO Facturas (establecimiento, fecha, total, address) 
        VALUES (?, ?, ?, ?);
        `, [resultEstablecimiento.lastInsertRowId, formData.fecha, formData.total, formData.address]
      );
      console.log("Factura insertada: \n", resultFactura);
      
      formData.items.forEach( async(item: any) => {
        const pricePerUnit = item.unit_price ? item.unit_price : item.price / item.quantity;

        const resultItem = await db.runAsync(
          `
           INSERT OR IGNORE INTO Productos (name, price_per_unit) 
           VALUES (?, ?);,
          `, [item.name, pricePerUnit]
        );  
        console.log("Producto insertado: \n", resultItem);
        const resultFacturaItem = await db.runAsync(
          `
          INSERT INTO Factura_productos (factura_id, producto_id, quantity, price)
          VALUES (?, ?, ?, ?);
          `, [resultFactura.lastInsertRowId, resultItem.lastInsertRowId, item.quantity, item.price]
        );
        console.log("Producto de factura insertado: \n", resultFacturaItem);
      });


    } catch (error) {
      console.log("Error en la creación de tablas o en insercion de datos: ", error);
    }
}

const handleInputChange = (key: string, e: string) => {
setFormData({
...formData,
[key]: e
})
}



const showConfirmation = () => {
  Alert.alert(
    "Confirmar acción", 
    "¿Estás seguro de que deseas agregar estos datos?",
    [
      { text: "Cancelar", style: "cancel" },
      { text: "Aceptar", onPress: confirmReceipt }
    ]
  );
};

const confirmReceipt = ()=>{

  console.log("confirmado");
  insertReceipt();
  router.push("../..");
  
}

const handleItemChange = (key: string, value: string | number, index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      items: prev.items?.map((item: any, i: number) => {
        console.log("i:", i);
        console.log("index:", index);
        console.log("item:", item);
  
        if (i === index) {
          return {
            ...item,
            [key]: value,
          };
        }
        return item; // <-- Asegurar que siempre devolvemos algo
      }) || [], // <-- Asegurar que `items` siempre es un array
    }));
  };
  
return(
    <ScrollView style={{ flex: 1, padding:10}}  contentContainerStyle={{ paddingBottom: 20 }}>
<Text>Datos de la factura</Text>
<Input 
label="Nombre del establecimiento" 
value={formData.establecimiento} 
name="establecimiento"
onChange={handleInputChange}
/>
<Input 
label="Dirección" 
value={formData.address} 
name="address"
onChange={handleInputChange}
/>
<Input
label="Fecha de la factura"
value={formData.fecha}
name="fecha"
onChange={handleInputChange}
/>
<Input
label="Total de la factura"
value={formData.total}
name="total"
onChange={handleInputChange}
/>
<Text>Productos</Text>
{ formData.items && formData.items.map((item: any, index: number) => (
    <ItemInput name={item.name} quantity={item.quantity} price={item.price} onChange={handleItemChange} index={index} key={index} />
    
    ))}

<Pressable onPress={showConfirmation}
  style={styles.confirm_button}
  >
 <Text> Confirmar </Text>

  </Pressable> 
</ScrollView>
)

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
    confirm_button: {
      width: 200, 
      height: 30 ,
      margin: 10,
      borderWidth: 1,
      borderColor: "black",
      backgroundColor: "#F1F1F1",
    },
})