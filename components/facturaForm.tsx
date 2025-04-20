import Input from "@/components/Input";
import ItemInput from "@/components/ItemInput";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { Alert, Pressable, ScrollView, View, Text, StyleSheet, Dimensions} from "react-native";
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
        tag: string;
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
      // ver estructura de la tabla Facturas
     // const tablaFacturas = await db.getAllAsync("PRAGMA table_info(Facturas);");
      //console.log("Estructura de la tabla Facturas: \n", tablaFacturas);
      const resultFactura = await db.runAsync(
        `
        INSERT INTO Facturas (establecimiento, fecha, total, address) 
        VALUES (?, ?, ?, ?);
        `, [resultEstablecimiento.lastInsertRowId, formData.fecha, formData.total, formData.address]
      );
      formData.items.forEach( async(item: any) => {
        
        item.price = item.price.split(" ")[0];
        item.price =item.price.replace(",", ".");

        const pricePerUnit = item.unit_price ? item.unit_price : Number(item.price) / Number(item.quantity);
        const resultItem = await db.runAsync(
          `
           INSERT OR IGNORE INTO Productos (name, price_per_unit, tag) 
           VALUES (?, ?, ?);
          `, [item.name, pricePerUnit, item.tag]
        );  
        const resultFacturaItem = await db.runAsync(
          `
          INSERT INTO Factura_productos (factura_id, producto_id, quantity, price)
          VALUES (?, ?, ?, ?);
          `, [resultFactura.lastInsertRowId, resultItem.lastInsertRowId, item.quantity, item.price]
        );
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
    if (!hasChanged && !isCreating) {
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

    isCreating ? insertReceipt() : updateReceipt();
    router.push("../..");
    
  }

  const handleItemChange = (key: string, value: string | number, index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      items: prev.items?.map((item: any, i: number) => {
  
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

  const { width } = Dimensions.get("window");
  const CARD_PADDING = 20;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.card, { width: width - 32, padding: CARD_PADDING }]}>
        <Input
          label="Nombre de empresa"
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
          label="Total (€)"
          value={formData.total.toString()}
          name="total"
          onChange={handleInputChange}
        />

        <View style={styles.divider} />

        {/* --- Tabla de productos editables --- */}
        <View style={[styles.row, styles.tableHeader]}>
          <Text style={[styles.label, { flex: 2 }]}>Descripción</Text>
          <Text style={[styles.label, { flex: 1, textAlign: "center" }]}>
            Cantidad
          </Text>
          <Text style={[styles.label, { flex: 1, textAlign: "right" }]}>
            Importe (€)
          </Text>
        </View>
        <View style={[styles.row, styles.tableHeader]}>
          <Text style={[styles.label, { flex: 1, textAlign: "center" }]}>
          Categoría
          </Text>
          
        </View>

        {formData.items.map((item, idx) => (
          <ItemInput
            key={idx}
            name={item.name}
            quantity={item.quantity}
            price={item.price as any}
            index={idx}
            tag={item.tag}
            onChange={handleItemChange}
          />
        ))}

        <View style={styles.divider} />
      </View>

      {/* --- Botones al pie --- */}
      <View style={[styles.buttonsContainer, { width: width - 32 }]}>
        <Pressable
          style={styles.discardButton}
          onPress={() => router.push("/")}
        >
          <Text style={styles.discardText}>Descartar</Text>
        </Pressable>
        <Pressable style={styles.saveButton} onPress={showConfirmation}>
          <Text style={styles.saveText}>
            {isCreating ? "Guardar" : "Actualizar"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    // sombra iOS
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    // elevación Android
    elevation: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  tableHeader: {
    marginBottom: 8,
  },
  label: {
    color: "#999",
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "#EEE",
    marginVertical: 12,
  },
  buttonsContainer: {
    flexDirection: "row",
    marginTop: 24,
    justifyContent: "space-between",
  },
  discardButton: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: "#4A4E69",
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  discardText: {
    color: "#4A4E69",
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 12,
    backgroundColor: "#4A4E69",
    borderRadius: 12,
    alignItems: "center",
  },
  saveText: {
    color: "#FFF",
    fontWeight: "600",
  },
});
