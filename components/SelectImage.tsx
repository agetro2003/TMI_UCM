import * as ImagePicker from "expo-image-picker";
import { Button } from '@rneui/themed';
import { StyleSheet, View } from "react-native";

export default function SelectImage({setImage }: {setImage: (image: string) => void}) {

  const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 1,
          });
      
      
          if (!result.canceled) {
            setImage(result.assets[0].uri);
          }
      };
      const takeImage = async () => {
        // No permissions request is necessary for launching the camera
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            quality: 1,
          });
      
      
          if (!result.canceled) {
            setImage(result.assets[0].uri);
          }
        }
// botones con el logo
        return (
            <View style={styles.container}>
                <Button 
                title={"Galería"}
                icon={{
                        name: "images",
                        type: "font-awesome-5",
                        color: "white",
                    }} 
                onPress={pickImage}
                buttonStyle={{
                    backgroundColor: "#4A4E69",
                    borderRadius: 90,
                }}
                />
                <Button
                title={"Cámara"}
                icon={{
                    name: "camera",
                    type: "font-awesome-5",
                    color: "white",
                }} 
                onPress={takeImage}
                buttonStyle={{
                    backgroundColor: "#4A4E69",
                    borderRadius: 90,
                }}
                 />
            </View>
        );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: "#fff",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-around",
    },
   
})