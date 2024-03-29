import React from "react";
import { View, Text, TouchableWithoutFeedback, Keyboard } from "react-native";

import CarouselTabs from "../Components/LibraryCarousel/LibraryCarouselTabs";

import { NavigationContext } from "../Contexts";
import { SafeAreaView } from "react-native-safe-area-context";
import BookSearchButton from "@/Components/BookSearchButton";
import { Icon } from "@rneui/base";
import Colors from "@/Constants/Colors";

export const Library = (props) => {
  const { navigation } = props;

  return (
    <NavigationContext.Provider value={navigation}>
      <SafeAreaView style={{ flexGrow: 1, backgroundColor: "white" }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View testID="library-screen-view" style={{flexDirection: 'row'}}>
            <Text
              style={{
                marginLeft: 20,
                marginBottom: 15,
                marginTop: 5,
                fontWeight: "700",
                fontSize: 21,
                flex: 5
              }}
            >
              Library
            </Text>
            <View style={{flex: 1, marginTop: 5}}>
              <Icon name="notifications" ></Icon>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View style={{ paddingLeft: 10, paddingBottom: 10, paddingRight: 10 }}>
          <BookSearchButton
            navigation={navigation}
            placeholder={"Search all books"}
            navigateTo={"BookSearchScreen"}
          />
        </View>
        <CarouselTabs user_id={undefined}/>
      </SafeAreaView>
    </NavigationContext.Provider>
  );
};
