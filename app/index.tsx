import { Button, Image, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import IndexButtons from "@/components/IndexButtons";


export default function Hello() {
 

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
