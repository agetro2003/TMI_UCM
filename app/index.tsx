import { Button, Image, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import IndexButtons from "@/components/IndexButtons";


export default function Hello() {
 

    const router = useRouter();

    const buttonsInfo = [
      {
      title: "Agregar facturas",
      image: require(`@/assets/images/facturaDibujada.png`),
      description: "Agrega informacion de facturas mediante una foto", 
      onPress: () => router.push("/agregarFacturas"),
  },
      {
      title: "Ver facturas",
      image: require(`@/assets/images/facturaDibujada.png`),
      description: "Visualiza las facturas que has agregado",
      onPress: () => router.push("/verFacturas"),
  },
      {
      title: "Ver informes",
      image: require(`@/assets/images/facturaDibujada.png`),
      description: "Visualiza los informes de tus facturas",
      onPress: () => router.push("/verInformes"),
  },
      {
      title: "Realizar comparación",
      image: require(`@/assets/images/facturaDibujada.png`),
      description: "Realiza una comparación entre facturas",
      onPress: () => router.push("/realizarComparacion"),
      }

];

    return (


        <View style={styles.container}>

        <IndexButtons buttonsInfo={buttonsInfo} />
        </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: "blue",
    color: "white",
    padding: 10,
    borderRadius: 5,
  }
});
