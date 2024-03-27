import { Icon } from "@rneui/base";
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
import { intro } from "../Components/WrappedBasics/Intro";
import { pagesRead } from "@/Components/WrappedBasics/PagesRead";

export const WrappedScreen = (props) => {
    const { navigation } = props;
    const {width, height} = Dimensions.get('screen');
    const items = [
        {
            name: "number1",
            screen: intro(),
            index: 1,
        }, 
        {
            name: "number2",
            screen: pagesRead(),
            index: 2,
        },  
        {
            name: "number3",
            screen: intro(),
            index: 3,
        },  
        {
            name: "number4",
            screen: intro(),
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
        <View style={{height: height}}>
            <FlatList
                data={items}
                renderItem={({item}) => 
                <View style={{backgroundColor: "#CBC3E3", width: width, alignItems: "center"}}>
                    {item.screen}
                </View>
                }
                horizontal
                pagingEnabled
                snapToAlignment="center"
                showsHorizontalScrollIndicator={false}
                onScroll={handleOnScroll}
            />
            <SafeAreaView style={{flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 25}}>
                {items.map((item) => {
                    const inputRange = [(item.index - 2) * width, (item.index - 1) * width, (item.index) * width];
                    const dotWidth = scrollX.interpolate({
                        inputRange,
                        outputRange: [12, 30, 12],
                        extrapolate: "clamp",
                    });
                    return (
                        <Animated.View key={item.index} style={[{width: 12, height: 12, borderRadius: 6, backgroundColor: "black", marginHorizontal: 3}, {width: dotWidth}]}/>
                    )
                })}
            </SafeAreaView>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{height: '10%', position: 'absolute', right: 15}}>
                <SafeAreaView>
                    <Icon name="close" color="red" size={30}/>
                </SafeAreaView>
            </TouchableOpacity>
        </View>
    )
}