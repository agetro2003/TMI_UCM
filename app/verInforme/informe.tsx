import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

type ProductSummary = {
  name: string;
  totalPrice: number;
};

export default function Informe() {
  const { year, month } = useLocalSearchParams<{ year: string; month: string }>();
  const db = useSQLiteContext();
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [monthTotal, setMonthTotal] = useState(0);
  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    (async () => {
      // 1) Total mensual
      const resTotal: { total: number }[] = await db.getAllAsync(
        `SELECT SUM(total) AS total
         FROM Facturas
         WHERE substr(fecha,7,4)=? AND substr(fecha,4,2)=?;`,
        [year, month]
      );
      setMonthTotal(resTotal[0]?.total || 0);

      // 2) Desglosar por producto
      const rows: { name: string; totalPrice: number }[] =
        await db.getAllAsync(
          `SELECT p.name AS name,
                  SUM(fp.price) AS totalPrice
           FROM Factura_Productos fp
           JOIN Productos p ON fp.producto_id = p.id
           JOIN Facturas f ON fp.factura_id = f.id
           WHERE substr(f.fecha,7,4)=? AND substr(f.fecha,4,2)=?
           GROUP BY p.name;`,
          [year, month]
        );
      setProducts(rows);
    })();
  }, []);

  const pieData = products.map((p, i) => ({
    name: p.name,
    population: p.totalPrice,
    color: ["#FF6384","#36A2EB","#FFCE56","#4BC0C0","#9966FF",'#89d256','#b46cd7','#8099d5', '#d58c80','#ffc259','#b2b0ad','#80d4d0'][i%12],
    legendFontColor: "#7F7F7F",
    legendFontSize: 14,
  }));

  // Para el header
  const monthNames = [
    "", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  const label = `${monthNames[+month]} ${year}`;

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={["#332b80", "#7a74b8"]} style={styles.header}>
        <Text style={styles.headerTitle}>Informe mensual</Text>
        <Text style={styles.subTitle}>{label}</Text>
      </LinearGradient>

      <View style={styles.card}>
        <View style={styles.infoRow}>
          <Text style={styles.infoTitle}>Total Gastos</Text>
          <Text style={styles.infoValue}>{monthTotal.toFixed(2)}€</Text>
        </View>

        <PieChart
          data={pieData}
          width={screenWidth - 40}
          height={200}
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
          hasLegend={false} 
        />

        {pieData.map((item, idx) => (
          <View key={idx} style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>
              {item.name} – {item.population.toFixed(2)}€
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  header: {
    width: "100%",
    height: 140,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  headerTitle: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  subTitle: { color: "#D8D8D8", fontSize: 16, marginTop: 4 },

  card: {
    backgroundColor: "#FFF",
    margin: 16,
    borderRadius: 12,
    padding: 16,
    // sombra
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  infoTitle: { fontSize: 16, color: "#7F7F7F" },
  infoValue: { fontSize: 18, fontWeight: "bold", color: "#333" },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  legendText: { fontSize: 14, color: "#333" },
});
