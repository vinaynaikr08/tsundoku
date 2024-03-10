import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
} from "react-native";
import React, { useEffect } from "react";
import { useState } from "react";
import { Button, SearchBar, Overlay, CheckBox, Divider } from "@rneui/base";
import Icon from "react-native-vector-icons/Ionicons";
import {} from "react-native-vector-icons";
import { RadioButton } from "react-native-paper";

export const genresSelected: Array<string> = [
  "YOUNG ADULT FICTION",
  "ANTIQUES & COLLECTIBLES",
  "LITERARY COLLECTIONS",
  "ARCHITECTURE",
  "LITERARY CRITICISM",
  "ART",
  "MATHEMATICS",
  "BIBLES",
  "MEDICAL",
  "BIOGRAPHY & AUTOBIOGRAPHY",
  "MUSIC",
  "BODY",
  "MIND & SPIRIT",
  "NATURE",
  "BUSINESS & ECONOMICS",
  "PERFORMING ARTS",
  "COMICS & GRAPHIC NOVELS",
  "PETS",
  "COMPUTERS",
  "PHILOSOPHY",
  "COOKING",
  "PHOTOGRAPHY",
  "CRAFTS & HOBBIES",
  "POETRY",
];

const CommunityUsersSearchBar = ({
  search,
  updateSearch,
  newPlaceholder,
  loading,
  showFilter,
  GENRES,
}) => {
  const [isOverlayVisible, setOverlayVisible] = useState(false);

  const toggleOverlay = () => {
    setOverlayVisible(!isOverlayVisible);
  };

  function clearFilter() {
    for (var value of GENRES) {
      value.setter[0](false);
      value.setter[1](false);
    }
  }

  return (
    <View>
      <View style={{ backgroundColor: "white", flexDirection: "row" }}>
        <View style={{ flex: 10 }}>
          <SearchBar
            placeholder={newPlaceholder}
            lightTheme
            showLoading={loading}
            round
            onChangeText={updateSearch}
            value={search}
            autoCorrect={false}
            containerStyle={{
              padding: 0,
              backgroundColor: "transparent",
              borderBottomColor: "transparent",
              borderTopColor: "transparent",
            }}
            inputContainerStyle={{
              borderRadius: 20,
              backgroundColor: "#F7F7F7",
            }}
            //onSubmitEditing={() => alert("temp")}
          />
        </View>
        {/* {showFilter && (
          <View style={{ flex: 2, alignItems: "center" }}>
            <Button
              type="clear"
              onPress={() => {
                toggleOverlay();
                Keyboard.dismiss;
              }}
              icon={<Icon name="filter" color={"#5B2FA3"} size={30} />}
            />
          </View>
        )} */}
        {/* 
        <Overlay
          isVisible={isOverlayVisible}
          onBackdropPress={toggleOverlay}
          overlayStyle={{
            backgroundColor: "white",
            width: "89%",
            height: "70%",
            borderRadius: 20,
            marginTop: 60,
          }}
        > */}
        {/* <View style={{ backgroundColor: "white" }}>
            <Text
              style={{
                marginLeft: 0,
                marginTop: 5,
                marginBottom: 5,
                fontWeight: "bold",
                fontSize: 20,
                alignSelf: "center",
              }}
            >
              Filter by Genre
            </Text>
          </View> */}
        {/* <View style={{ flexDirection: "row", marginTop: 8, height: "83%" }}>
            <FlatList
              data={GENRES}
              renderItem={({ item }) => (
                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 1, justifyContent: "center" }}>
                    <CheckBox
                      checked={item.state[0]}
                      uncheckedIcon={<Icon name="square-outline" size={20} />}
                      checkedIcon={<Icon name="checkbox-outline" size={20} />}
                      title={item.title[0]}
                      onPress={() => {
                        item.setter[0](!item.state[0]);
                      }}
                      containerStyle={{ paddingLeft: 0, paddingTop: 0 }}
                      textStyle={{
                        fontWeight: "normal",
                        fontSize: 17,
                        marginLeft: 7,
                      }}
                    />
                  </View>
                  <View style={{ flex: 1, justifyContent: "center" }}>
                    {item.title[1] != "" ? (
                      <CheckBox
                        checked={item.state[1]}
                        uncheckedIcon={<Icon name="square-outline" size={20} />}
                        checkedIcon={<Icon name="checkbox-outline" size={20} />}
                        title={item.title[1]}
                        onPress={() => {
                          item.setter[1](!item.state[1]);
                        }}
                        containerStyle={{ paddingLeft: 0, paddingTop: 0 }}
                        textStyle={{
                          fontWeight: "normal",
                          fontSize: 17,
                          marginLeft: 7,
                        }}
                      />
                    ) : (
                      <View />
                    )}
                  </View>
                </View>
              )}
            />
          </View> */}
        {/* <View
            style={{
              position: "absolute",
              bottom: 20,
              alignSelf: "center",
              borderRadius: 20,
            }}
          >
            <Button
              buttonStyle={{ borderRadius: 10 }}
              color={"#5B2FA3"}
              onPress={clearFilter}
            >
              Clear all
            </Button>
        //   </View> */}
        {/* </Overlay> */}
      </View>
      <Divider style={{ marginTop: 101, paddingBottom: 0 }} />
    </View>
  );
};

export default CommunityUsersSearchBar;
