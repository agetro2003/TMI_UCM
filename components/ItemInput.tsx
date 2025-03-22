import { TextInput, View, StyleSheet } from "react-native";

type ItemInputProps = {
  name: string;
  quantity: number;
  price: number;
  onChange: (key: string, value: string, index: number) => void;
  index: number;
};

export default function ItemInput({ name, quantity, price, onChange, index }: ItemInputProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, styles.nameInput]}
        value={name}
        onChangeText={(text) => onChange("name", text, index)}
        placeholder="Nombre"
      />
      <TextInput
        style={[styles.input, styles.quantityInput]}
        value={quantity.toString()}
        keyboardType="numeric"
        onChangeText={(text) => onChange("quantity", text, index)}
        placeholder="Cant."
      />
      <TextInput
        style={[styles.input, styles.priceInput]}
        value={price.toString()}
        keyboardType="numeric"
        onChangeText={(text) => onChange("price", text, index)}
        placeholder="Precio"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  nameInput: {
    flex: 6, // 60%
  },
  quantityInput: {
    flex: 1.5, // 15%
    textAlign: "center",
  },
  priceInput: {
    flex: 2.5, // 25%
    textAlign: "right",
  },
});
