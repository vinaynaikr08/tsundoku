import React from "react";
import { View, Text, SafeAreaView } from "react-native";
import Carousel from "../Components/Carousel/Carousel";
import CarouselTabs from "../Components/CarouselTabs/CarouselTabs";

export const Library = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Text style={{ margin: 20, marginLeft: 15, fontWeight: "700", fontSize: 21 }}>Your Library</Text>
      <CarouselTabs/>
    </SafeAreaView>
  );
};
