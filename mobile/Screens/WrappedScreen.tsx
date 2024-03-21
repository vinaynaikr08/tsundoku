import React from "react";
import {
  Text,
  View,
  Pressable,
  SafeAreaView,
  TouchableOpacity
} from "react-native";
import { NavigationContext } from "../Contexts";


export const WrappedScreen = (props) => {
    const { navigation } = props;
    return (
        <SafeAreaView>
            <TouchableOpacity onPress={() => navigation.navigate("discover")} style={{height: '50%'}}>
                <Text>nothing here for now</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}