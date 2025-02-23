import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
export default function Hello() {
    return (

        <View style={styles.container}>
        <Text>Hello, world!</Text>
        <Link style={styles.button} href={{
          pathname: "/pages/page1",
        }}>
          Go to page 1
        </Link>
        <Link style={styles.button}  href={{
          pathname: "/pages/page2",
        }}>
          Go to page 2
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
