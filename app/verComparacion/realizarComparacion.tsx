import React, { useEffect, useState } from "react";
import { Image, ScrollView, View, Text, StyleSheet, Dimensions } from "react-native";
import { PieChart, BarChart, LineChart } from "react-native-chart-kit";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
type MonthData = { month: string; total: number };

const monthNames = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
];

const categoryIcons: Record<string, any> = {
  comestibles: require('@/assets/images/comestibles.png'),
  electronica: require('@/assets/images/electronica.png'), 
  entretenimiento: require('@/assets/images/entretenimiento.png'),
  higiene: require('@/assets/images/higiene.png'),
  ropa: require('@/assets/images/ropa.png'), 
};

const screenWidth = Dimensions.get("window").width;

export default function RealizarComparacion() {
  const { category, variableType, variable, graphType } = useLocalSearchParams<{ category: string; variableType: "year" | "establishment"; variable: string; graphType: "pie" | "bar" | "line"; }>();
  const db = useSQLiteContext();
  const zeroed = monthNames.map(m => ({ month: m, total: 0 }));
  const [data, setData] = useState<MonthData[]>(zeroed);
  const [totalAll, setTotalAll] = useState(0);

  useEffect(() => {
    (async () => {
      let rows: { mes: string; total: number }[] = [];

      if (variableType === "year") {
        rows = await db.getAllAsync(
          `SELECT substr(f.fecha,4,2) AS mes, SUM(fp.price) AS total
           FROM Factura_Productos fp
           JOIN Facturas f ON fp.factura_id = f.id
           JOIN Productos p ON fp.producto_id = p.id
           WHERE substr(f.fecha,7,4)=? AND p.tag=?
           GROUP BY mes;`,
          [variable, category]
        );
      } else {
        rows = await db.getAllAsync(
          `SELECT e.nombre AS mes, SUM(fp.price) AS total
           FROM Factura_Productos fp
           JOIN Facturas f ON fp.factura_id = f.id
           JOIN Establecimientos e ON f.establecimiento = e.id
           JOIN Productos p ON fp.producto_id = p.id
           WHERE substr(f.fecha,7,4)=? AND p.tag=?
           GROUP BY e.nombre;`,
          [variable, category]
        );
      }

      const mapped = variableType === "year"
        ? monthNames.map((name, i) => {
            const key = (i+1).toString().padStart(2,"0");
            const found = rows.find(r => r.mes===key);
            return { month: name, total: found?.total ?? 0 };
          })
        : rows.map(r => ({ month: r.mes, total: r.total }));

      setData(mapped);
      setTotalAll(mapped.reduce((sum, d) => sum + d.total, 0));
    })();
  }, []);

  let dataset = data.map(d => isFinite(d.total) ? d.total : 0);
  const max = Math.max(...dataset);
  const min = Math.min(...dataset);
  if (max === min) dataset[dataset.length - 1] = max + 1;

  const labels = data.map(d => d.month);
  const pieData = data.map((d,i) => ({
    name: d.month,
    population: d.total,
    color: ["#FF6384","#36A2EB","#FFCE56","#4BC0C0","#9966FF",'#89d256','#b46cd7','#8099d5', '#d58c80','#ffc259','#b2b0ad','#80d4d0'][i%12],
    legendFontColor: "#7F7F7F",
    legendFontSize: 12,
  }));

  const commonConfig = {
    backgroundColor: "#fff",
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity=1) => `rgba(0,0,0,${opacity})`,
    labelColor: (opacity=1) => `rgba(0,0,0,${opacity})`,
    propsForLabels: {
      fontSize: 8
    },
    propsForVerticalLabels: {
      fontSize: 10
    },
    propsForHorizontalLabels: {
      fontSize: 10
    },
    propsForDots: {
      r: "3"
    },
    barPercentage: 0.3,  
  };

  const renderChart = () => {
    const CARD_MARGIN = 16;
    const CARD_PADDING = 16;
    const chartWidth = screenWidth - (CARD_MARGIN * 2) - (CARD_PADDING * 2);
    switch(graphType) {
      case "bar":
        return (
          <BarChart
          style={{ 
            marginVertical: 4,
            alignSelf: 'flex-start',
            paddingBottom: 16,
            marginLeft: -15
          }}
            data={{ labels, datasets:[{ data: dataset }] }}
            width={chartWidth} height={220}
            chartConfig={commonConfig}
            yAxisLabel="€" 
            yAxisSuffix=""
            fromZero
            showValuesOnTopOfBars
            verticalLabelRotation={20}
            segments={5}
          />
        );
      case "line":
        return (
          <LineChart
            style={{
              marginVertical: 4,
              alignSelf: 'flex-start',
              paddingBottom: 20,
              marginLeft: -10
            }}
            data={{ labels, datasets:[{ data: dataset }] }}
            width={chartWidth} height={220}
            chartConfig={commonConfig}
            verticalLabelRotation={17}
            segments={5}
            bezier
          />
        );
      default:
        return (
          <PieChart
            style={styles.chartCentered}
            data={pieData}
            width={chartWidth} height={180}
            chartConfig={commonConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="50"
            hasLegend={false}
          />
        );
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom:20 }}>
      <LinearGradient colors={["#332b80","#7a74b8"]} style={styles.header}>
      <View style={styles.headerTextContainer}>
        <Text style={styles.headerTitle}>Comparativa</Text>
        <Text style={styles.subTitle}>
          {variableType==="year"
            ? `Año ${variable} • ${category}`
            : `Establecimientos ${variable} • ${category}`}
        </Text>
      </View>
      { categoryIcons[category] && (
        <Image
          source={categoryIcons[category]}
          style={styles.headerIcon}
        />
        ) }
      </LinearGradient>


      <View style={styles.card}>
        <View style={styles.infoRow}>
          <Text style={styles.infoTitle}>Total</Text>
          <Text style={styles.infoValue}>{totalAll.toFixed(2)}€</Text>
        </View>

        {renderChart()}

        {pieData.map((item,idx) => (
          <View key={idx} style={styles.legendItem}>
            <View style={[styles.dot,{ backgroundColor:item.color }]} />
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
  container: { flex:1, backgroundColor:"#F5F5F5" },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
  subTitle: {
    fontSize: 14,
    color: "#D8D8D8",
    marginTop: 4,
  },
  card: { backgroundColor:"#FFF", margin:16, borderRadius:12, padding:16, elevation:3 },
  infoRow: { flexDirection:"row", justifyContent:"space-between", marginBottom:12 },
  infoTitle: { fontSize:16, color:"#7F7F7F" },
  infoValue: { fontSize:18, fontWeight:"bold", color:"#333" },
  chart: { 
    marginVertical: 4, 
    alignSelf: 'flex-start',
    paddingBottom: 20 
  },  
  chartCentered: { marginVertical: 8, alignSelf: 'center' },
  dot: { width:10, height:10, borderRadius:5, marginRight:8 },
  legendText: {
    fontSize: 14,
    color: "#333",
    flexShrink: 1,       // Permite encoger el texto si es necesario
    flexWrap: "wrap"     // Permite distribuir el texto en varias líneas
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    flexWrap: "wrap"
  },
  headerIcon: {
    width: 60,
    height: 60,
    marginLeft: 12,
    marginRight: 30,
    resizeMode: "contain",
  },
  headerTextContainer: {
    flex: 1,
    justifyContent: "center", 
    marginLeft: 16,
  },
});
