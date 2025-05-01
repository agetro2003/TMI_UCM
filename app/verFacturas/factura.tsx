import { ScrollView, View, Text, StyleSheet, Dimensions, Alert, Pressable } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

interface Item {
  producto_id: number;
  name: string;
  quantity: number;
  price: number;
  price_per_unit: number;
  tag: string;
}

interface FacturaData {
  id: number;
  establecimiento: string;
  address: string;
  fecha: string;
  total: number;
  items: Item[];
}

export default function Factura() {
  const { facturaId } = useLocalSearchParams();
  const router = useRouter();
  const db = useSQLiteContext();
  const [factura, setFactura] = useState<FacturaData | null>(null);
  const { width } = Dimensions.get("window");
  const CARD_PADDING = 20;

  useEffect(() => {
    const fetchFactura = async () => {
      try {
        const header = await db.getFirstAsync<{
          establecimiento: string;
          address: string;
          fecha: string;
          total: string | number;
        }>(
          `
          SELECT e.nombre AS establecimiento, f.address, f.fecha, f.total
          FROM Facturas f
          JOIN Establecimientos e ON e.id = f.establecimiento
          WHERE f.id = ?;
          `,
          [facturaId as string]
        );
        if (!header) throw new Error("Factura no encontrada");
        const totalNum = typeof header.total === 'string'
          ? parseFloat(header.total.replace(',', '.'))
          : header.total;

        const rows = await db.getAllAsync<{
          producto_id: number;
          quantity: number;
          price: string | number;
          name: string;
          price_per_unit: number;
          tag: string;
        }>(
          `
          SELECT fp.producto_id, fp.quantity, fp.price, p.name, p.price_per_unit, p.tag
          FROM Factura_Productos fp
          JOIN Productos p ON p.id = fp.producto_id
          WHERE fp.factura_id = ?;
          `,
          [facturaId as string]
        );
        const items = rows.map(r => ({
          producto_id: r.producto_id,
          name: r.name,
          quantity: r.quantity,
          price: typeof r.price === 'string' ? parseFloat(r.price.replace(',', '.')) : r.price,
          price_per_unit: r.price_per_unit,
          tag: r.tag,
        }));

        setFactura({
          id: Number(facturaId),
          establecimiento: header.establecimiento,
          address: header.address,
          fecha: header.fecha,
          total: totalNum,
          items,
        });
      } catch (error) {
        console.log("Error al cargar factura:", error);
      }
    };
    fetchFactura();
  }, [facturaId]);

  const handleDeleteConfirmation = () => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de eliminar esta factura?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: deleteFactura }
      ]
    );
  };

  const deleteFactura = async () => {
    try {
      // Elimina relaciones en Factura_productos
      if (factura?.id !== undefined) {
        await db.runAsync(`DELETE FROM Factura_productos WHERE factura_id = ?;`, [factura.id]);
      } else {
        throw new Error("Factura ID is undefined");
      }
      // Elimina la factura
      await db.runAsync(`DELETE FROM Facturas WHERE id = ?;`, [factura?.id]);

      // Redirige a verFacturas
      router.push("../verFacturas/verFacturas");
    } catch (error) {
      console.log("Error al eliminar la factura:", error);
    }
  };

  if (!factura) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando factura...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.card, { width: width - 32, padding: CARD_PADDING }]}>        
        {/* Nombre de empresa */}
        <View style={styles.fieldContainer}>
          <Text style={styles.inputLabel}>Nombre de empresa</Text>
          <Text style={styles.mainValue}>{factura.establecimiento}</Text>
        </View>
        {/* Dirección */}
        <View style={styles.fieldContainer}>
          <Text style={styles.inputLabel}>Dirección</Text>
          <Text style={styles.mainValue}>{factura.address}</Text>
        </View>
        {/* Fecha */}
        <View style={styles.fieldContainer}>
          <Text style={styles.inputLabel}>Fecha de la factura</Text>
          <Text style={styles.mainValue}>{factura.fecha}</Text>
        </View>
        {/* Total */}
        <View style={styles.fieldContainer}>
          <Text style={styles.inputLabel}>Total (€)</Text>
          <Text style={styles.mainValue}>{factura.total.toFixed(2)}</Text>
        </View>

        <View style={styles.divider} />

        {/* Productos */}
        <View style={[styles.row, styles.tableHeader]}>
          <Text style={[styles.label, { flex: 3 }]}>Descripción</Text>
          <Text style={[styles.label, { flex: 1, textAlign: 'center' }]}>Cant.</Text>
          <Text style={[styles.label, { flex: 2, textAlign: 'right' }]}>Importe</Text>
          <Text style={[styles.label, { flex: 3, textAlign: 'right' }]}>Categoria</Text>
        </View>
        {factura.items.map((item, idx) => (
          <View key={idx} style={styles.itemRow}>
            <Text style={[styles.itemName, { flex: 2 }]}>{item.name}</Text>
            <Text style={[styles.itemQty, { flex: 1, textAlign: 'center' }]}>{item.quantity}</Text>
            <Text style={[styles.itemPrice, { flex: 1 }]}>{item.price.toFixed(2)}€</Text>
            <Text style={[styles.itemCategory, { flex: 2 }]}>{item.tag}</Text>
          </View>
        ))}

        <View style={styles.divider} />
      </View>

      {/* Botón Eliminar */}
      <View style={[styles.buttonsContainer, { width: width - 32 }]}>  
      <Pressable onPress={handleDeleteConfirmation} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Eliminar</Text>
    </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 16,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
  },
  fieldContainer: {
    width: '100%',
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  inputValue: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    lineHeight: 40,
    color: '#000',
  },
  mainValue: {
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  tableHeader: {
    marginBottom: 8,
  },
  label: {
    color: '#999',
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginVertical: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  itemName: {
    fontSize: 14,
    color: '#333',
  },
  itemQty: {
    fontSize: 14,
    color: '#333',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
    color: '#333',
  },
  itemCategory: {
    fontSize: 12,
    color: '#333',
    textAlign: 'right',
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 24,
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start', // Evita que ocupe todo el ancho
    marginTop: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});