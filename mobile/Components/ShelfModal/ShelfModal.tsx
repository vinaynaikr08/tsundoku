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
      onSwipeComplete={() => { setShelfModalVisible(false); }}
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
        height: "94%",
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
          <BookSearchBar />
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
              data={books}        
              scrollEventThrottle={1}
              style={{
                flex: 1,
                marginBottom: 0
              }}
              renderItem={({item}) => {
                return (
                  <TouchableOpacity activeOpacity={1} >
                    <Text style={{ fontSize: 20}}>{item.title}</Text>
                    <Text >{item.author}</Text>
                    <Text style={{ fontSize: 20}}>{item.title}</Text>
                    <Text >{item.author}</Text>
                    <Text style={{ fontSize: 20}}>{item.title}</Text>
                    <Text >{item.author}</Text>
                    <Text style={{ fontSize: 20}}>{item.title}</Text>
                    <Text >{item.author}</Text>
                  </TouchableOpacity>
                )
              }}
              />
        </View>
      </View>
    </Modal>
  );
}
/*<ScrollView>
            <TouchableOpacity activeOpacity={1}>
              <Text style={{fontSize:100}}>Here</Text>
              <Text style={{fontSize:100}}>Here</Text>
              <Text style={{fontSize:100}}>Here</Text>
              <Text style={{fontSize:100}}>Here</Text>

            </TouchableOpacity>
          </ScrollView>  */
export default ShelfModal;