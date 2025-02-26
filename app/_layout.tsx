import { Stack } from "expo-router";

export default function Layout() {
  return (
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
  );
}
