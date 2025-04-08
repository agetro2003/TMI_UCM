import { Text, View } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";




export default function Factura (){
    const {facturaId} = useLocalSearchParams()
    const db = useSQLiteContext();
    const [data, setData]= useState<any[]>([])
    
    
    const getDatosFormulario = async()=> {
    // PreparedStatement
        try{

            const resultFactura = await db.getAllAsync(
            `
            SELECT *
            FROM Facturas as f
            WHERE f.id = (?);
            `, [facturaId.toString()]
            );
            setData(resultFactura);

            const resultFacturaItem =  await db.getAllAsync(
                `
                SELECT *
                FROM Factura_productos as f
                WHERE f.factura_id = (?);
                `, [facturaId.toString()]
            );
            setData(resultFacturaItem);

            const resultItemsTodos: any[]= [];
            const mum_items = resultFacturaItem.length;
            //let flag_data_complete=0;

            
           resultFacturaItem.forEach(async(item: any) => {
                const resultItem = await db.getAllAsync(
                    `
                    SELECT *
                    FROM Productos as p
                    WHERE p.id = (?);
                    `, [item.producto_id]
                );
                console.log(resultItem[0]);
                resultItemsTodos.push(resultItem[0]);
                //flag_data_complete=flag_data_complete+1;

                console.log(resultItemsTodos);
            });
            /*
           
            /*const datos_completos= await db.getAllAsync(
            );*/
            console.log(resultFacturaItem);
            //console.log(resultItemsTodos);
        } catch (error) {
            console.log("Error al obtener facturas", error);
        }
     }

     useEffect(() => {
        getDatosFormulario();
    
    }, []);




    return (
        <View>
            <Text>Factura {facturaId}</Text>
        </View>
    )
} 