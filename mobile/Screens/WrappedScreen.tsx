import React, {useRef} from "react";
import {
  Text,
  View,
  Pressable,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import { NavigationContext } from "../Contexts";


export const WrappedScreen = (props) => {
    const { navigation } = props;
    const {width, height} = Dimensions.get('screen');
    const items = [
        {
            name: "number1",
            index: 1,
        }, 
        {
            name: "number2",
            index: 2,
        },  
        {
            name: "number3",
            index: 3,
        },  
        {
            name: "number4",
            index: 4,
        }, 
    ]
    const scrollX = useRef(new Animated.Value(0)).current;
    const handleOnScroll = event => {
        Animated.event([
            {
                nativeEvent: {
                    contentOffset: {
                        x: scrollX,
                    }
                }
            }
        ], 
        {
            useNativeDriver: false,
        })(event);
    };
    return (
        <SafeAreaView style={{height: height}}>
            <FlatList
                data={items}
                renderItem={({item}) => 
                    <View style={{backgroundColor: "purple", borderWidth: 10, borderColor: 'white', width: width, alignItems: "center"}}>
                        <Text style={{color: "white"}}>{item.name}</Text>
                    </View>
                }
                horizontal
                pagingEnabled
                snapToAlignment="center"
                showsHorizontalScrollIndicator={false}
                onScroll={handleOnScroll}
            />
            <View style={{flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                {items.map((item) => {
                    const inputRange = [(item.index - 2) * width, (item.index - 1) * width, (item.index) * width];
                    const dotWidth = scrollX.interpolate({
                        inputRange,
                        outputRange: [12, 30, 12],
                        extrapolate: "clamp",
                    });
                    return (
                        <Animated.View key={item.index} style={[{width: 12, height: 12, borderRadius: 6, backgroundColor: "#ccc", marginHorizontal: 3}, {width: dotWidth}]}/>
                    )
                })}
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("discover")} style={{height: '10%'}}>
                <Text>press to go back</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}