import {
  View,
  Text,
  Keyboard,
  FlatList,
  StyleSheet,
} from "react-native";
import React, { useEffect } from "react";
import { useState } from "react";
import { Button, SearchBar, Overlay, CheckBox, Divider } from "@rneui/base";
import Icon from "react-native-vector-icons/Ionicons";
import {} from "react-native-vector-icons";

const BookSearchBar = ({
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
      <View style={styles.searchBarView}>
        <View style={{ flex: 10 }}>
          <SearchBar
            placeholder={newPlaceholder}
            lightTheme
            showLoading={loading}
            round
            onChangeText={updateSearch}
            value={search}
            autoCorrect={false}
            containerStyle={styles.searchBarContainer}
            inputContainerStyle={styles.inputContainer}
          />
        </View>
        {showFilter && (
          <View style={styles.filterButton}>
            <Button
              type="clear"
              onPress={() => {
                toggleOverlay();
                Keyboard.dismiss;
              }}
              icon={<Icon name="filter" color={"#5B2FA3"} size={30} />}
            />
          </View>
        )}

        <Overlay
          isVisible={isOverlayVisible}
          onBackdropPress={toggleOverlay}
          overlayStyle={styles.filterOverlay}
        >
          <View style={{ backgroundColor: "white" }}>
            <Text style={styles.filterText}>
              Filter by Genre
            </Text>
          </View>
          <View style={{ flexDirection: "row", marginTop: 8, height: "83%" }}>
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
                      containerStyle={styles.checkboxContainer}
                      textStyle={styles.checkboxText}
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
                        containerStyle={styles.checkboxContainer}
                        textStyle={styles.checkboxText}
                      />
                    ) : (
                      <View />
                    )}
                  </View>
                </View>
              )}
            />
          </View>
          <View style={styles.clearAllButton}>
            <Button
              buttonStyle={{ borderRadius: 10 }}
              color={"#5B2FA3"}
              onPress={clearFilter}
            >
              Clear all
            </Button>
          </View>
        </Overlay>
      </View>
      <Divider style={{ marginTop: 11, paddingBottom: 0 }} />

      {/*}
            <View style={{position: "absolute", bottom: -40, flexDirection: "row"}}>
                <Text style={{marginLeft: 0, marginTop: 8, paddingRight: 10, fontSize: 16, color: '#333',}}> 
                    Search by:  
                </Text> 
                <RadioButton.Android
                    value="title"
                    status={ checked === 'title' ? 'checked' : 'unchecked' }
                    onPress={() => setChecked('title')}
                    
                />
                <Text style={{marginLeft: -4, marginTop: 8, paddingRight: 10, fontSize: 16, color: '#333',}}> 
                    Title 
                </Text> 
                <RadioButton.Android
                    value="author"
                    status={ checked === 'author' ? 'checked' : 'unchecked' }
                    onPress={() => setChecked('author')}
                />
                <Text style={{marginLeft: -4, marginTop: 8, paddingRight: 10, fontSize: 16, color: '#333',}}> 
                    Author 
                </Text> 
                <RadioButton.Android
                    value="ISBN"
                    status={ checked === 'ISBN' ? 'checked' : 'unchecked' }
                    onPress={() => setChecked('ISBN')}
                />
                <Text style={{marginLeft: -4, marginTop: 8, paddingRight: 10, fontSize: 16, color: '#333',}}> 
                    ISBN 
                </Text> 
                
    </View>*/}
    </View>
  );
};

export default BookSearchBar;

const styles = StyleSheet.create({
    searchBarView: { 
        backgroundColor: "white", 
        flexDirection: "row" 
    },
    searchBarContainer: {
        padding: 0,
        backgroundColor: "transparent",
        borderBottomColor: "transparent",
        borderTopColor: "transparent",
    },
    inputContainer: {
        borderRadius: 20,
        backgroundColor: "#F7F7F7",
    },
    filterButton: { 
        flex: 2, 
        alignItems: "center", 
    },
    filterOverlay: {
        backgroundColor: "white",
        width: "89%",
        height: "70%",
        borderRadius: 20,
        marginTop: 60,
    },
    filterText: {
        marginLeft: 0,
        marginTop: 5,
        marginBottom: 5,
        fontWeight: "bold",
        fontSize: 20,
        alignSelf: "center",
    },
    checkboxContainer: { 
        paddingLeft: 0, 
        paddingTop: 0 
    },
    checkboxText: {
        fontWeight: "normal",
        fontSize: 17,
        marginLeft: 7,
    },
    clearAllButton: {
        position: "absolute",
        bottom: 20,
        alignSelf: "center",
        borderRadius: 20,
    },
});
