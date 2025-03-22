import { TextInput, Text, View, StyleSheet } from "react-native";

type InputsProps = {
  label: string;
  value: string;
  name: string;
  onChange: (key: string, text: string) => void;
};

export default function Input({ label, value, name, onChange }: InputsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={(text) => onChange(name, text)}
        placeholder={label} // Opcional, para mejorar UX
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5, // Espacio entre el label y el input
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
});
