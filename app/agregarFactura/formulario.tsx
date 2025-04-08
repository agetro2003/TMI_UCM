
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import FacturaForm from "@/components/facturaForm";

export default function Formulario() {
const {receiptData} = useLocalSearchParams()
const parsedData = receiptData ? JSON.parse(receiptData as string) : {};
const [formData, setFormData] = useState(parsedData)
  
return(
    <FacturaForm receiptData={formData} isCreating={true} >

    </FacturaForm> 
)

}
