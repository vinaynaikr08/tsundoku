import React from "react";
import { Text } from "react-native";
import CarouselTabs from "../Components/LibraryCarousel/LibraryCarouselTabs";

import { NavigationContext } from "../Contexts";
import { SafeAreaView } from "react-native-safe-area-context";

export const Library = (props) => {
  const { navigation } = props;

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
          Your Library
        </Text>
        <CarouselTabs />
      </SafeAreaView>
    </NavigationContext.Provider>
  );
};
