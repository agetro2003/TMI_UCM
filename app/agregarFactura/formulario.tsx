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
console.log(parsedData)
/*
const db = useSQLiteContext();

const insertReceipt = async() => {
    try {

      await db.execAsync(
        ` 
      CREATE TABLE IF NOT EXISTS Establecimiento (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT
      );
        `
    );

      await db.execAsync(
          ` 
        CREATE TABLE IF NOT EXISTS Factura (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        establecimiento INTEGER,
        fecha TEXT,
        total REAL,
        address TEXT,
        FOREIGN KEY (establecimiento) REFERENCES establecimiento (id)
        );
          `
      );
      
      await db.execAsync(
        `
        CREATE TABLE IF NOT EXISTS Productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price_per_unit REAL,
        UNIQUE(name, price_per_unit)
      );
        `);
      await db.execAsync(
        `
        CREATE TABLE IF NOT EXISTS Factura_Productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        factura_id INTEGER,
        producto_id INTEGER,
        quantity INTEGER,
        price REAL
        FOREIGN KEY (factura_id) REFERENCES facturas(id),
        FOREIGN KEY (producto_id) REFERENCES productos(id)
      );
      `
      );
      console.log("Tablas creadas");
      
      const resultFactura = await db.runAsync(
        `
        INSERT INTO facturas (establecimiento, fecha, total, address) 
        VALUES (${formData.establecimiento}, ${formData.fecha}, 
        ${formData.total}, ${formData.address});
        `
      );
      
      formData.items.forEach( async(item: any) => {
        const pricePerUnit = item.unit_price ? item.unit_price : item.price / item.quantity;

        await db.runAsync(
          `
           INSERT OR IGNORE INTO productos (name, price_per_unit) 
           VALUES (${item.name}, ${pricePerUnit});,
          `
        );  

        

        
      });


    } catch (error) {
      
    }
}
*/
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