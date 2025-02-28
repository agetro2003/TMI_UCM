import { Image, StyleSheet, Text, TouchableHighlight, View } from "react-native";

export default function IndexButtons({buttonsInfo}: {buttonsInfo: {title: string, image: any, description: string, onPress: () => void}[]}) {

    return(
<View style={style.container}>
        {buttonsInfo.map((buttonInfo, index) => (
          <TouchableHighlight activeOpacity={0} style={style.touchable} key={index} onPress={buttonInfo.onPress} >
            <View style={style.touchableContainer}> 
            <View style={style.textContainer}>
            <Text style={style.title}> 
                {buttonInfo.title}
            </Text>
            <Text style={style.description}>{buttonInfo.description}</Text>
            </View>
            <Image style={style.image}   source={buttonInfo.image}
            />
            </View>
          </TouchableHighlight>
        ))}
      </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        height: "90%",
        width: "100%",
        justifyContent: "space-around",
        alignItems: "center",
    },
    touchable: {
        backgroundColor: "lightgrey",
        borderRadius: 10,
    },
    touchableContainer: {
        width: "90%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        padding: 10,
    },
    title: {
        marginBottom: 15,
        fontSize: 20,
        fontWeight: "bold",
    }, 
    description: {
        fontSize: 15,
    }, 
    textContainer: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginRight: 10,
    },
    image: {
        width: 100,
        height: 100,
    }

})