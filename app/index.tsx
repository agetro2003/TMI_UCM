import { StyleSheet, Text, View } from "react-native";
import { Link, Stack } from "expo-router";

export default function Hello() {
    return (


        <View style={styles.container}>

        <Stack.Screen
         options={{
          title: 'My home',
          headerStyle: { backgroundColor: '#f4511e' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}/>



        <Text>Hello, world!</Text>

        <Link style={styles.button} href={{
          pathname: "/pages/agregarFacturas",
        }}>
          Agregar facturas
        </Link>

        <Link style={styles.button}  href={{
          pathname: "/pages/verFacturas",
        }}>
          Ver facturas
        </Link>

        <Link style={styles.button}  href={{
          pathname: "/pages/verInformes",
        }}>
          Ver informes
        </Link>

        <Link style={styles.button}  href={{
          pathname: "/pages/realizarComparacion",
        }}>
          Ver informes
        </Link>

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
