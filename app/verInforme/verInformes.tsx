import { ScrollView, View, Text, StyleSheet, ActivityIndicator, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";
import { useRouter } from "expo-router";

type MonthSummary = {
  year: string;
  month: string;
  label: string;
  total: number;
};

export default function VerInformes() {
  const db = useSQLiteContext();
  const router = useRouter();
  const [summaries, setSummaries] = useState<MonthSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const iconColors = [
    '#A8E6CF', '#D3D3D3', '#FFD3B6', '#FFFFFF', '#E0E0E0', '#FF8C94'
  ];

  const monthNames = [
    '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  useEffect(() => {
    (async () => {
      try {
        // Agrupar y sumar directamente en SQLite
        const rows: { year: string; month: string; total: number }[] =
          await db.getAllAsync(
            `
            SELECT 
              substr(fecha, 7, 4) AS year,
              substr(fecha, 4, 2) AS month,
              SUM(total) AS total
            FROM Facturas
            GROUP BY year, month
            ORDER BY year DESC, month DESC;
            `
          );

        // Generar summaries con etiqueta y total
        const list = rows.map((r, index) => ({
          year: r.year,
          month: r.month,
          label: monthNames[+r.month],
          total: r.total,
        }));

        setSummaries(list);
      } catch (error) {
        console.log('[VerInformes] Error al cargar resúmenes:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A4E69" />
        <Text style={styles.loadingText}>Cargando informes...</Text>
      </View>
    );
  }

  if (summaries.length === 0) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No hay facturas registradas.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {summaries.map(({ year, month, label, total }, index) => (
        <Pressable
          key={`${year}-${month}`}
          style={styles.option}
          onPress={() =>
            router.push({ pathname: "../verInforme/informe", params: { year, month } })
          }
        >
          <View style={[styles.iconContainer, { backgroundColor: iconColors[index % iconColors.length] }]}>  
            <Text style={styles.iconLetter}>{label.charAt(0)}</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.subLabel}>{year}</Text>
          </View>
          <Text style={styles.total}>{total.toFixed(2)}€</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  iconLetter: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#000',
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  subLabel: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  noDataContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
  },
});