import React from "react";
import { View, Text, SafeAreaView } from "react-native";
import Carousel from "../Components/Carousel/Carousel";

export const Library = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Carousel />
    </SafeAreaView>
  );
};
