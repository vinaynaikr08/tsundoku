import { View, Text, Button, TouchableOpacity } from "react-native";
import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import Colors from "../../Constants/Colors";
import Dimensions from "../../Constants/Dimensions";
import { Library } from "../../Screens/Library";
import { SignIn } from "../../Screens/SignIn";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Modal from "react-native-modal";
import { SearchBar } from "@rneui/base";


function ShelfModal() {
  const [isShelfModalVisible, setShelfModalVisible] = useState(false);

  const toggleShelfModal = () => {
    setShelfModalVisible(!isShelfModalVisible);
  };

  type SearchBarComponentProps = {};

  const [search, setSearch] = useState("");

  const updateSearch = (search) => {
    setSearch(search);
  };
  
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, height: 5 }}></View>
      <Button title="Show modal" onPress={toggleShelfModal} color="#000000" />
      <Modal 
      isVisible={isShelfModalVisible}
      onSwipeComplete={(e) => { setShelfModalVisible(false); }}
      swipeDirection={["down"]}
      style={{ 
        marginBottom: 0,
        marginRight: 0,
        marginLeft: 0
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
                marginTop: -680,
              }}
            />
          </View>
          <View
            style={{
              width:'100%',
              marginTop: -660,
              backgroundColor: "white"
            }}>
            <SearchBar
              placeholder="Search list..."
              lightTheme
              round
              onChangeText={updateSearch}
              value={search}
              autoCorrect={false}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default ShelfModal;