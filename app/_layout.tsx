import { Stack } from "expo-router";
import {SQLiteProvider} from 'expo-sqlite';
export default function Layout() {
  return (
    <SQLiteProvider databaseName="facturas.db">
    <Stack>
        <Stack.Screen 
            name="index" 
            options={{ title: "Inicio", headerShown: true }}
            />
      <Stack.Screen name="agregarFacturas"
        options={{
          title: 'Agregar facturas',
          headerShown: true,
          headerBackVisible: true,
        }}
      />
      <Stack.Screen name="verFacturas"
        options={{
          title: 'Ver facturas',
          headerShown: true,
          headerBackVisible: true,

        }}
      />
      <Stack.Screen name="verInformes"
        options={{
          title: 'Ver informes',
          headerShown: true,
          headerBackVisible: true,

        }}
      />
      <Stack.Screen name="realizarComparacion"
        options={{
          title: 'Realizar comparación',
          headerShown: true,
          headerBackVisible: true,

        }}
      />
    </Stack>
    </SQLiteProvider>
  );
}
