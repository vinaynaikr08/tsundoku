import React from "react";
import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";

import CarouselTabs from "../Components/DiscoverCarouselTabs/DiscoverCarouselTabs";
import { NavigationContext } from "../Contexts";
import { SafeAreaView } from "react-native-safe-area-context";
import BookSearchButton from "@/Components/BookSearchButton";

const windowHeight = Dimensions.get("window").height;

export const Discover = ({ navigation }) => {
  return (
    <NavigationContext.Provider value={navigation}>
      <SafeAreaView style={styles.safeArea}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View>
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
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.bookSearchContainer}>
          <BookSearchButton
            navigation={navigation}
            placeholder={"Search all books"}
            navigateTo={"BookSearchScreen"}
          />
        </View>

        {/* Wrapped banner */}
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 15,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("wrappedScreen")}
          >
            <Image
              source={require("../assets/wrapped-banner.png")}
              style={{
                width: "90%",
                height: undefined,
                aspectRatio: 5 / 2,
                borderRadius: 15,
                overflow: "hidden",
              }}
            />
            <View
              style={{
                position: "absolute",
                top: "15%",
                width: 300,
                justifyContent: "center",
                alignSelf: "center",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 20,
                  textAlign: "center",
                  fontWeight: "500",
                }}
              >
                Your {new Date().getFullYear()} Tsundoku Wrapped is here!
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: "white",
                  padding: 0,
                  margin: 0,
                  height: 36,
                  width: "36%",
                  top: 10,
                  justifyContent: "center",
                  alignSelf: "center",
                  borderRadius: 15,
                }}
                onPress={() => navigation.navigate("wrappedScreen")}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "#5E3FC5",
                    fontSize: 15,
                  }}
                >
                  Open
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
        <CarouselTabs />
      </SafeAreaView>
    </NavigationContext.Provider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flexGrow: 1,
    backgroundColor: "white",
  },
  bookSearchContainer: {
    paddingLeft: 10,
    paddingBottom: 10,
    paddingRight: 10,
  },
  searchResultContainer: {
    backgroundColor: "#F7F7F7",
    width: "100%",
    position: "absolute",
    top: "21.5%",
    zIndex: 100,
    borderColor: "black",
    borderWidth: 0,
    maxHeight: windowHeight - 230,
  },
  resultItemContainer: {
    flexDirection: "row",
    paddingTop: 10,
    paddingBottom: 10,
  },
  image: {
    width: 80,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    shadowColor: "black",
  },
});
