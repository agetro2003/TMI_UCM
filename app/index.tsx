import { Button, Image, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import IndexButtons from "@/components/IndexButtons";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect } from "react";


export default function Hello() {
    const db = useSQLiteContext();

const resetDatabase = async () => {
            console.log("Resetting database...");
            await db.execAsync("DROP TABLE Factura;");
            console.log("Facturas dropped");
            await db.execAsync("DROP TABLE Productos;");
            console.log("Productos dropped");
            await db.execAsync("DROP TABLE Establecimiento;");
            console.log("Establecimiento dropped");
            await db.execAsync("DROP TABLE Factura_productos;");
            console.log("Database reseted");
        }
        const checkdb = async () => {
            const tables = await db.getAllAsync("SELECT name FROM sqlite_master WHERE type='table';");
            console.log(tables);
        }
        const resetDb = async () => {
            await resetDatabase();
            await checkdb();
        }

        const createTables = async () => {
            try {
                await db.execAsync(
                    ` 
                  CREATE TABLE IF NOT EXISTS Establecimientos (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  nombre TEXT UNIQUE
                  );
                    `
                );
            
                  await db.execAsync(
                      ` 
                    CREATE TABLE IF NOT EXISTS Facturas (
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
                    price REAL,
                    FOREIGN KEY (factura_id) REFERENCES facturas(id),
                    FOREIGN KEY (producto_id) REFERENCES productos(id)
                  );
                  `
                  );
                  console.log("Tablas creadas");
                  await checkdb();

                } catch (error) {
                    console.log("Error al crear tablas", error);
                    }
                }
    //Reset database
    useEffect(() => {
        createTables();
      //  resetDb();
     console.log("Database reseted");
    }, []);
    
    const router = useRouter();

    const buttonsInfo = [
      {
      title: "Agregar facturas",
      image: require(`@/assets/images/agregarFac_Icon.png`),
      description: "Agrega informacion de facturas mediante una foto", 
      onPress: () => router.push("../agregarFactura/agregarFacturas"),
  },
      {
      title: "Ver facturas",
      image: require(`@/assets/images/verFac_Icon.png`),
      description: "Visualiza las facturas que has agregado",
      onPress: () => router.push("/verFacturas"),
  },
      {
      title: "Ver informes",
      image: require(`@/assets/images/verInfo_Icon.png`),
      description: "Visualiza los informes de tus facturas",
      onPress: () => router.push("/verInformes"),
  },
      {
      title: "Realizar comparación",
      image: require(`@/assets/images/hacerComp_Icon.png`),
      description: "Realiza una comparación entre facturas",
      onPress: () => router.push("/realizarComparacion"),
      }

];

    return (


        <View style={styles.container}>

           <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Buenos días 👋</Text>
                    <Text style={styles.username}>Pepito Pérez</Text>
                </View>
            </View>
        <IndexButtons buttonsInfo={buttonsInfo} />
        </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignSelf: "flex-start",
    marginLeft: 20,
    marginTop: 30,
  },
  greeting: {
      fontSize: 18,
      color: "#666",
  },
  username: {
      fontSize: 22,
      fontWeight: "bold",
      color: "#333",
  },
});
