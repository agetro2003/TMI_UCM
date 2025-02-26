import { Button, StyleSheet, Text, View } from "react-native";
import { Link, Stack, useRouter } from "expo-router";

export default function Hello() {
    const router = useRouter();
    return (


        <View style={styles.container}>

        <Text>Hello, world!</Text>

        <Button title="Agregar facturas" onPress={() => router.push("/agregarFacturas")} />
        <Button title="Ver facturas" onPress={() => router.push("/verFacturas")} />
        <Button title="Ver informes" onPress={() => router.push("/verInformes")} />
        <Button title="Realizar comparación" onPress={() => router.push("/realizarComparacion")} />

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
