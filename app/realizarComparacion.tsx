import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { LinearGradient } from "expo-linear-gradient";

const factura = {
    "VENDOR_NAME": "Mercadona S.A.",
    "ADDRESS_BLOCK": "Rda. de Atocha, 26, Centro, 28012, Madrid",
    "TELEPHONE": "91 95 45 71",
    "INVOICE_RECEIPT_DATE": "20/02/2025 09:51",
    "ITEMS": [
        { "ITEM": "Pan blanco", "QUANTITY": 1, "PRICE": 1.05 },
        { "ITEM": "Nata Cocinar", "QUANTITY": 2, "PRICE": 1.00 },
        { "ITEM": "Rollo Cocina", "QUANTITY": 2, "PRICE": 2.95 },
        { "ITEM": "Mermelada Fresa", "QUANTITY": 1, "PRICE": 2.10 },
        { "ITEM": "Filete Merluza", "QUANTITY": 1, "PRICE": 4.20 }
    ],
    "TOTAL": 15.39
};

const screenWidth = Dimensions.get("window").width;

// Calcular el total basado en los precios
const totalPrice = factura.ITEMS.reduce((sum, item) => sum + item.PRICE, 0);

// Construir los datos para el gráfico con el porcentaje calculado
const data = factura.ITEMS.map((item, index) => {
    const percentage = ((item.PRICE / totalPrice) * 100).toFixed(2); // Calcula el %
    return {
        name: item.ITEM,
        population: item.PRICE,
        percentage, // Guarda el porcentaje calculado
        color: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"][index % 5],
        legendFontColor: "#7F7F7F",
        legendFontSize: 14
    };
});

export default function RealizarComparacion() {
    return (
        <View style={styles.container}>
            {/* Fondo degradado superior */}
            <LinearGradient colors={["#332b80", "#7a74b8"]} style={styles.header}>
                <Text style={styles.headerTitle}>Comparativa</Text>
                <Text style={styles.month}>xxxx</Text>
            </LinearGradient>

            {/* Tarjeta de informacion que incluye el grafico y la lista */}
            <View style={styles.card}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoTitle}>Promedio</Text>
                    <Text style={styles.infoValue}>{(totalPrice / factura.ITEMS.length).toFixed(2)}€</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoTitle}>Total</Text>
                    <Text style={styles.infoValue}>{totalPrice.toFixed(2)}€</Text>
                </View>

                {/* Grafica de pastel dentro de la tarjeta */}
                <PieChart
                    data={data}
                    width={screenWidth - 50}
                    height={150}
                    chartConfig={{
                        backgroundColor: "#ffffff",
                        backgroundGradientFrom: "#ffffff",
                        backgroundGradientTo: "#ffffff",
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    }}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="-5"
                    absolute = {false}
                />

                {/* Lista de categorías dentro de la tarjeta */}
                {data.map((item, index) => (
                    <View key={index} style={styles.listItem}>
                        <View style={[styles.dot, { backgroundColor: item.color }]} />
                        
                        {/* Contenedor de nombre y porcentaje */}
                        <View style={styles.categoryContainer}>
                            <Text style={styles.category}>{item.name}</Text>
                            <Text style={styles.percentage}>{item.percentage}%</Text>
                        </View>

                        <Text style={styles.amount}>{item.population.toFixed(2)}€</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        alignItems: "center",
    },
    header: {
        width: "100%",
        height: 160,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        paddingTop: 50,
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    month: {
        fontSize: 16,
        color: "#D8D8D8",
        marginTop: 5,
    },
    card: {
        backgroundColor: "#FFFFFF",
        width: "99%",
        borderRadius: 15,
        paddingVertical: 20,
        paddingHorizontal: 15,
        marginTop: -30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
        alignItems: "center",
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 10,
    },
    infoTitle: {
        fontSize: 16,
        color: "#7F7F7F",
    },
    infoValue: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    listItem: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        backgroundColor: "#F5F5F5",
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    categoryContainer: {
        flex: 1,
        flexDirection: "column",
    },
    category: {
        fontSize: 14,
        color: "#333",
        fontWeight: "bold",
    },
    percentage: {
        fontSize: 12,
        color: "#7F7F7F",
        marginTop: 2, // Espacio entre el nombre y el porcentaje
    },
    amount: {
        fontSize: 14,
        fontWeight: "bold",
    },
});
