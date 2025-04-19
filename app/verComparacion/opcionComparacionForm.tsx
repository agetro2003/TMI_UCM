import React from 'react';
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
import { useState } from 'react';

export default function ComparacionForm() {
  const router = useRouter();
  const [graphType, setGraphType] = useState<'pie'|'bar'|'line'|null>(null);
  const { width } = Dimensions.get('window');
  const CARD_PADDING = 20;

  const handleGenerate = () => {
    if (!graphType) {
      return Alert.alert('Error', 'Debes escoger un tipo de gráfico.');
    }
    router.push({
      pathname: '../verComparacion/realizarComparacion',
      params: { graphType }
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.card, { width: width - 32, padding: CARD_PADDING }]}>
        <Text style={styles.fieldLabel}>Tipo de gráfico</Text>
        <View style={styles.pickerWrapper}>
         <Picker
           selectedValue={graphType}
           onValueChange={setGraphType}
           mode="dropdown"
           dropdownIconColor="#333"
           style={styles.picker}
           itemStyle={styles.pickerItem}      // altura de cada opción
         >
           <Picker.Item label="— Selecciona —" value={null} />
           <Picker.Item label="Pie" value="pie" />
           <Picker.Item label="Bar" value="bar" />
           <Picker.Item label="Line" value="line" />
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
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    overflow: 'hidden',
    height: 50,   
  },
  picker: {
    height: 50,
    width: '100%',
  },
  pickerItem: {
    height: 50,            // altura de cada elemento
    fontSize: 16,
  },
  generateButton: {
    backgroundColor: '#4A4E69',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 20,
  },
  generateText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
