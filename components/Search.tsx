import { useState } from "react";
import { StyleSheet, TextInput } from "react-native";

export default function Search({data, setShowedData}: {data: any[], setShowedData: (data: any[]) => void}) {
    const [searchText, setSearchText] = useState("");

    const handleSearch = (text: string) => {
        setSearchText(text);
        if (text === "") {
            setShowedData(data);
        } else {
            const filteredData = data.filter((item) =>
                item.nombre.toLowerCase().includes(text.toLowerCase())
            );
            setShowedData(filteredData);
        }
    };

    return (
        <TextInput
            style={styles.searchInput}
            value={searchText}
            onChangeText={handleSearch}
            placeholder="Buscar por establecimiento..."
        />
    );


}

const styles = StyleSheet.create({
    searchInput: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 16,
        backgroundColor: "#fff",
        marginBottom: 15,
        marginTop: 15,
    },
});