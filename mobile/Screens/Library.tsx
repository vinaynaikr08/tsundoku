import React from "react";
import { View, Text, TouchableWithoutFeedback, Keyboard } from "react-native";

import CarouselTabs from "../Components/LibraryCarousel/LibraryCarouselTabs";

import { NavigationContext } from "../Contexts";
import { SafeAreaView } from "react-native-safe-area-context";
import BookSearchButton from "@/Components/BookSearchButton";

export const Library = (props) => {
  const { navigation } = props;

  return (
    <NavigationContext.Provider value={navigation}>
      <SafeAreaView style={{ flexGrow: 1, backgroundColor: "white" }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View testID="library-screen-view">
            <Text
              style={{
                marginLeft: 20,
                marginBottom: 15,
                marginTop: 5,
                fontWeight: "700",
                fontSize: 21,
              }}
            >
              Library
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <View style={{ paddingLeft: 10, paddingBottom: 10, paddingRight: 10 }}>
          <BookSearchButton
            navigation={navigation}
            placeholder={"Search all books"}
            navigateTo={"BookSearchScreen"}
          />
        </View>
        <CarouselTabs />
      </SafeAreaView>
    </NavigationContext.Provider>
  );
};
