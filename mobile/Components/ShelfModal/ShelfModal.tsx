import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import React from "react";
import { useState, useContext } from "react";
import Modal from "react-native-modal";
import BookSearchBar from "../BookSearchBar";
import { Divider } from "@rneui/base";

import { NavigationContext } from "../../Contexts";
import { shelf } from "../DiscoverCarouselTabs";
import { genresSelected } from "../BookSearchBar";

function checkTitle(value, search) {
  return value.title.toUpperCase().includes(search.toUpperCase());
}

function checkAuthor(value, search) {
  return value.author.toUpperCase().includes(search.toUpperCase());
}

function checkGenres(value) {
  return genresSelected.includes(value.toUpperCase());
}

const ShelfModal = ({ route, navigation}) => {
  const {bookData} = route.params;
  const [search, setSearch] = useState("");
  console.log(bookData);

  const updateSearch = (search) => {
    setSearch(search);
  };

  const books = [
    { id: "1", title: "The Poppy War", author: "R. F. Kuang" },
    { id: "2", title: "The Fifth Season", author: "N. K. Jemisin" },
    { id: "3", title: "Six of Crows", author: "R. F. Kuang" },
    { id: "4", title: "The Poppy War", author: "R. F. Kuang" },
    { id: "5", title: "The Poppy War", author: "R. F. Kuang" },
  ];

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('gestureCancel', (e) => {
      Keyboard.dismiss;
    });
  
    return unsubscribe;
  }, [navigation]);

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        width: "100%",
        height: "100%",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View
          style={{
            width: "100%",
            position: "absolute",
            borderRadius: 5,
            alignSelf: "center",
            top: 10,
          }}
        >
          <View
            style={{
              backgroundColor: "#D3D3D3",
              height: 7,
              width: 70,
              borderRadius: 5,
              alignSelf: "center",
            }}
          />
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View
          style={{
            position: "absolute",
            top: 30,
            left: 20,
            width: "100%",
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 30 }}>{shelf}</Text>
        </View>
      </TouchableWithoutFeedback>

      <View
        style={{
          width: "93%",
          position: "absolute",
          borderRadius: 10,
          top: 75,
          left: 20,
          paddingBottom: 0,
        }}
      >
        <BookSearchBar search={search} updateSearch={updateSearch} />
      </View>
      <View
        style={{
          flex: 1,
          width: "100%",
          position: "absolute",
          height: "82.3%",
          borderRadius: 10,
          top: 150,
          left: 20,
          paddingTop: 0,
          marginTop: -14,
        }}
      >
        <FlatList
          data={bookData.filter(
            (e) =>
              checkTitle(e, search) || checkAuthor(e, search), //&& (checkGenres(e.genre))
          )}
          scrollEventThrottle={1}
          style={{
            flex: 1,
            marginBottom: 0,
          }}
          renderItem={({ item }) => {
            return (
              <View>
                <TouchableOpacity
                  onPress={() => alert("temp")}
                  style={{ flexDirection: "row", paddingTop: 8 }}
                >
                  <Image
                    style={{
                    width: 53,
                    height: 80,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "white",
                    shadowColor: "black",
                    }}
                    resizeMode="contain"
                    source={{ uri: item.image_url }}
                  />
                  <View
                    style={{
                      paddingLeft: 10,
                    }}
                  >
                    <Text style={{ fontSize: 20 }}>{item.title}</Text>
                    <Text>{item.author}</Text>
                    <Text>ISBN: temp</Text>
                  </View>
                </TouchableOpacity>
                <Divider style={{ paddingTop: 8, paddingBottom: 8 }} />
              </View>
            );
          }}
        />
      </View>
    </View>
    //</Modal>
  );
};
export default ShelfModal;

// <Modal
//   isVisible={isShelfModalVisible}
//   onSwipeComplete={() => { setShelfModalVisible(false); setSearch(""); Keyboard.dismiss }}
//   swipeDirection={["down"]}
//   style={{
//     marginBottom: 0,
//     marginRight: 0,
//     marginLeft: 0,
//   }}
//   propagateSwipe={true}
//   onBackdropPress={() => { setShelfModalVisible(false); setSearch("")}}
//   onSwipeCancel={Keyboard.dismiss}
// >
