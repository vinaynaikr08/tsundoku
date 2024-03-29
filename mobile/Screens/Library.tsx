import React from "react";
import { Keyboard, Text, TouchableWithoutFeedback, View } from "react-native";

import CarouselTabs from "../Components/LibraryCarousel/LibraryCarouselTabs";

import BookSearchButton from "@/Components/BookSearchButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContext } from "../Contexts";

export const Library = (props) => {
  const { navigation } = props;

  return (
    <NavigationContext.Provider value={navigation}>
      <SafeAreaView style={{ flexGrow: 1, backgroundColor: "white" }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View testID="library-screen-view" style={{ flexDirection: "row" }}>
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
        <CarouselTabs user_id={undefined} />
      </SafeAreaView>
    </NavigationContext.Provider>
  );
};
