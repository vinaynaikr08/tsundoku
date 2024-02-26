import React, { useState } from "react";
import { View, Text, Pressable, Button } from "react-native";
import Carousel from "../Components/Carousel/Carousel";
import CarouselTabs from "../Components/DiscoverCarouselTabs/DiscoverCarouselTabs";
import StarRating from "../Components/StarRating/StarRating";
import { createStackNavigator } from "@react-navigation/stack";
import TextReview from "../Components/TextReview/TextReview";
import { useNavigation } from "@react-navigation/native";
import { createContext, useContext } from "react";

import { NavigationContext } from "../Contexts";
import { SafeAreaView } from "react-native-safe-area-context";

const Stack = createStackNavigator();

export const Discover = (props) => {
  const { navigation } = props;
  const [isReviewModalVisible, setReviewModalVisible] = useState(false);
  return (
    <NavigationContext.Provider value={navigation}>
      <SafeAreaView style={{ flexGrow: 1, backgroundColor: "white" }}>
        <Text
          style={{
            marginLeft: 20,
            marginBottom: 15,
            marginTop: 5,
            fontWeight: "700",
            fontSize: 21,
          }}
        >
          Discover
        </Text>
        <CarouselTabs navigation={navigation} />
        <Pressable
          onPress={() => navigation.navigate("review")}
          style={{ backgroundColor: "gray", padding: 10 }}
        >
          <Text>Star Rating</Text>
        </Pressable>
      </SafeAreaView>
    </NavigationContext.Provider>
  );
};
