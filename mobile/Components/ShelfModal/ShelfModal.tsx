import { View, Text, FlatList, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { useState, } from "react";
import Modal from "react-native-modal";
import BookSearchBar from "../BookSearchBar";
import { Divider } from "@rneui/base";

const ShelfModal = ( {isShelfModalVisible, setShelfModalVisible, currentShelf, books} ) => {

  type SearchBarComponentProps = {};

  const [search, setSearch] = useState("");

  const updateSearch = (search) => {
    setSearch(search);
  };
   
  return (
    <Modal 
      isVisible={isShelfModalVisible}
      onSwipeComplete={() => { setShelfModalVisible(false); setSearch("") }}
      swipeDirection={["down"]}
      style={{ 
        marginBottom: 0,
        marginRight: 0,
        marginLeft: 0,
      }}
      propagateSwipe={true}
      scrollOffset={10000}
    >
      <View style={{
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        width: "100%",
        height: "86%",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: '30%'
      }}>
        <View
            style={{
              backgroundColor: "#D3D3D3",
              height: 7,
              width: 70,
              borderRadius: 5,
              alignSelf: "center",
              marginTop: "-175%",
            }}
          />
        <View style={{
          position: "absolute",
          top: 35,
          left: 20,
        }}>
          <Text style={{fontWeight: 'bold', fontSize: 24}}>{currentShelf}</Text>
        </View>
        <View
          style={{
            width:'93%',
            position: "absolute",
            borderRadius: 10,
            top: 75,
            left: 20,
            paddingBottom: 0
          }}>
          <BookSearchBar search={search} updateSearch={updateSearch} />
          <Divider style={{marginTop: 11, paddingBottom: 0}}/>
        </View>
        <View style={{
            flex: 1,
            width:'100%',
            position: "absolute",
            height: "82.3%",
            borderRadius: 10,
            top: 150,
            left: 20,
            paddingTop: 0,
            marginTop: -14
          }}>
            <FlatList 
              data={books.filter((e) => (((e.title).toUpperCase()).includes(search.toUpperCase()) || ((e.author).toUpperCase()).includes(search.toUpperCase())))}        
              scrollEventThrottle={1}
              style={{
                flex: 1,
                marginBottom: 0
              }}
              renderItem={({item}) => {
                return (
                  <View >
                    <TouchableOpacity activeOpacity={1} style={{flexDirection: "row", paddingTop: 8}} >
                      <View style={{
                        backgroundColor: "pink",
                        width: 45,
                        height: 60,
                        
                      }}/>
                      <View style={{
                        paddingLeft: 10
                      }}>
                        <Text style={{ fontSize: 20}}>{item.title}</Text>
                        <Text >{item.author}</Text>
                        <Text >ISBN: temp</Text>
                      </View>
                    </TouchableOpacity>
                    <Divider style={{paddingTop: 8, paddingBottom: 8}} />
                  </View>
                )
              }}
              />
        </View>
      </View>
    </Modal>
  );
}
export default ShelfModal;