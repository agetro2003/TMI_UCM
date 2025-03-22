import Input from "@/components/Input";
import ItemInput from "@/components/ItemInput";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {  ScrollView, Text, View,  } from "react-native";


export default function Formulario() {
const {receiptData} = useLocalSearchParams()
const parsedData = receiptData ? JSON.parse(receiptData as string) : {};
const [formData, setFormData] = useState(parsedData)
console.log(parsedData)
const handleInputChange = (key: string, e: string) => {
setFormData({
...formData,
[key]: e
})
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

</ScrollView>
)

}
