import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  Alert,
  StyleSheet,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { useSQLiteContext } from 'expo-sqlite';

type VariableType = 'year' | 'establishment';

export default function ComparacionForm() {
  const router = useRouter();
  const db = useSQLiteContext();

  // Estados
  const [category, setCategory] = useState<string | null>(null);
  const [variableType, setVariableType] = useState<VariableType | null>(null);
  const [year, setYear] = useState<string | null>(null);
  const [graphType, setGraphType] = useState<'pie'|'bar'|'line'|null>(null);
  const [years, setYears] = useState<string[]>([]);

  const { width } = Dimensions.get('window');
  const CARD_PADDING = 20;

  // Cargar sólo años de Facturas
  useEffect(() => {
    (async () => {
      const res = await db.getAllAsync<{ year: string }>(
        `SELECT DISTINCT substr(fecha,7,4) AS year
         FROM Facturas
         ORDER BY year DESC;`
      );
      setYears(res.map(r => r.year));
    })();
  }, []);

  const handleGenerate = () => {
    if (!category || !variableType || !year || !graphType) {
      return Alert.alert(
        'Error',
        'Debes escoger categoría, variable a comparar, año y tipo de gráfico.'
      );
    }
    router.push({
      pathname: '../verComparacion/realizarComparacion',
      params: {
        category,
        variableType,
        variable: year,
        graphType
      }
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.card, { width: width - 32, padding: CARD_PADDING }]}>

        {/* Picker 1: Categoría */}
        <Text style={styles.fieldLabel}>Categoría</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={category}
            onValueChange={setCategory}
            mode="dropdown"
            dropdownIconColor="#333"
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label="— Selecciona —" value={null} />
            <Picker.Item label="Comestibles" value="comestibles" />
            <Picker.Item label="Ropa" value="ropa" />
            <Picker.Item label="Higiene" value="higiene" />
            <Picker.Item label="Electrónica" value="electronica" />
            <Picker.Item label="Entretenimiento" value="entretenimiento" />
          </Picker>
        </View>

        {/* Picker 2: Variable a comparar */}
        <Text style={[styles.fieldLabel, { marginTop: 20 }]}>
          Variable a comparar
        </Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={variableType}
            onValueChange={(val) => { setVariableType(val); setYear(null); }}
            mode="dropdown"
            dropdownIconColor="#333"
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label="— Selecciona —" value={null} />
            <Picker.Item label="Meses de año" value="year" />
            <Picker.Item label="Establecimiento" value="establishment" />
          </Picker>
        </View>

        {/* Picker 3: Año */}
        
          <>
            <Text style={[styles.fieldLabel, { marginTop: 20 }]}>
              Año
            </Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={year}
                onValueChange={setYear}
                mode="dropdown"
                dropdownIconColor="#333"
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                <Picker.Item label="— Selecciona —" value={null} />
                {years.map(y => (
                  <Picker.Item key={y} label={y} value={y} />
                ))}
              </Picker>
            </View>
          </>
        

        {/* Picker 4: Tipo de gráfico */}
        <Text style={[styles.fieldLabel, { marginTop: 20 }]}>
          Tipo de gráfico
        </Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={graphType}
            onValueChange={setGraphType}
            mode="dropdown"
            dropdownIconColor="#333"
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label="— Selecciona —" value={null} />
            <Picker.Item label="Sectores" value="pie" />
            <Picker.Item label="Barras" value="bar" />
            <Picker.Item label="Líneas" value="line" />
          </Picker>
        </View>

      </View>

      <Pressable style={styles.generateButton} onPress={handleGenerate}>
        <Text style={styles.generateText}>Generar</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    paddingBottom: 40
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5
  },
  fieldLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    overflow: 'hidden',
    height: 50
  },
  picker: {
    height: 50,
    width: '100%'
  },
  pickerItem: {
    height: 50,
    fontSize: 16
  },
  generateButton: {
    backgroundColor: '#4A4E69',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 20
  },
  generateText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16
  }
});
