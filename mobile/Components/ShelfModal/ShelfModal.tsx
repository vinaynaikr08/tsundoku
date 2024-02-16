import { View, } from "react-native";
import React from "react";
import { useState, } from "react";
import Modal from "react-native-modal";
import BookSearchBar from "../BookSearchBar";


const ShelfModal = ( {isShelfModalVisible, setShelfModalVisible} ) => {

  type SearchBarComponentProps = {};

  const [search, setSearch] = useState("");

  const updateSearch = (search) => {
    setSearch(search);
  };
  
  return (
    <Modal 
    isVisible={isShelfModalVisible}
    onSwipeComplete={() => { setShelfModalVisible(false); }}
    swipeDirection={["down"]}
    style={{ 
      marginBottom: 0,
      marginRight: 0,
      marginLeft: 0,
    }}>
      <View style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        width: "100%",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: 50
      }}>
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              backgroundColor: "#D3D3D3",
              height: 7,
              width: 70,
              borderRadius: 5,
              position: "absolute",
              bottom: 370,
            }}
          />
        </View>
        <View
          style={{
            width:'95%',
            position: "absolute",
            borderRadius: 10,
            bottom: 680,
          }}>
          <BookSearchBar/>
        </View>
      </View>
    </Modal>
  );
}

export default ShelfModal;