import Input from "@/components/Input";
import ItemInput from "@/components/ItemInput";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text } from "react-native";

export default function FacturaForm(
    {receiptData, isCreating}: {receiptData: {
        id?: number;
        establecimiento: string;
        address: string;
        fecha: string;
        total: string;
        items: {
            id?: number; // Añadido para el ID del producto
            factura_producto_id?: number; // Añadido para el ID del producto de la factura
            name: string;
            quantity: number;
            price: string | number;
            unit_price?: number; // Añadido para el precio por unidad
        }[];
    },
    isCreating: boolean,
},
) {
const router = useRouter();
const [formData, setFormData] = useState(receiptData)

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
        
        item.price = item.price.split(" ")[0];
        item.price =item.price.replace(",", ".");
        console.log(item.unit_price);
        console.log(Number(item.price));
        console.log(Number(item.quantity));

        const pricePerUnit = item.unit_price ? item.unit_price : Number(item.price) / Number(item.quantity);
        console.log(pricePerUnit);
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

const updateReceipt = async() => {
    try {
        // Actualizar el establecimiento si ha cambiado
        if (formData.establecimiento !== receiptData.establecimiento) {
            await db.runAsync(
                `UPDATE Establecimientos SET nombre = ? WHERE nombre = ?`,
                [formData.establecimiento, receiptData.establecimiento]
            );
        }
        // Actualizar la factura si ha cambiado
        if (formData.fecha !== receiptData.fecha || formData.total !== receiptData.total || formData.address !== receiptData.address) {
            await db.runAsync(
                `UPDATE Facturas SET fecha = ?, total = ?, address = ? WHERE id = ?`,
                [formData.fecha, formData.total, formData.address, receiptData.id!!.toString()]
            );
        }
        // Actualizar los productos de la factura si han cambiado
        formData.items.forEach(async (item: any, index: number) => {
            if (item.name !== receiptData.items[index].name || item.quantity !== receiptData.items[index].quantity || item.price !== receiptData.items[index].price) {
                await db.runAsync(
                    `UPDATE Productos SET name = ?, price_per_unit = ? WHERE id = ?`,
                    [item.name, item.unit_price? item.unit_price : item.price / item.quantity, receiptData.items[index].id]
                );
                await db.runAsync(
                    `UPDATE Factura_productos SET quantity = ?, price = ? WHERE factura_id = ? AND producto_id = ?`,
                    [item.quantity, item.price, receiptData.id!!.toString(), receiptData.items[index].factura_producto_id]
                );
            }
        });

    } catch (error) {
        console.log("Error en la actualización de datos: ", error);
    }
}



const handleInputChange = (key: string, e: string) => {
setFormData({
...formData,
[key]: e
})
}



const showConfirmation = () => {
    // check if data has changed
    const hasChanged = JSON.stringify(receiptData) !== JSON.stringify(formData);
    if (!hasChanged) {
        Alert.alert("No hay cambios", "No se han realizado cambios en los datos.");
        return;
    }
    Alert.alert(
    "Confirmar acción", 
    isCreating ? "¿Estás seguro de que deseas agregar estos datos?" : "¿Estás seguro de que deseas modificar estos datos?",
    [
      { text: "Cancelar", style: "cancel" },
      { text: "Aceptar", onPress: confirmReceipt }
    ]
  );
};

const confirmReceipt = ()=>{

  console.log("confirmado");
  isCreating ? insertReceipt() : updateReceipt();
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