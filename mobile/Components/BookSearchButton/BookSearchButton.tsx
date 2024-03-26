import { View, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { SearchBar } from "@rneui/base";

const BookSearchButton = ({ navigation, placeholder, navigateTo }) => {
  return (
    <View>
      <View style={styles.searchBarView}>
        <View style={{ flex: 10 }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(navigateTo);
            }}
          >
            <SearchBar
              placeholder={placeholder}
              lightTheme
              round
              containerStyle={styles.searchBarContainer}
              inputContainerStyle={styles.inputContainer}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default BookSearchButton;

const styles = StyleSheet.create({
  searchBarView: {
    backgroundColor: "white",
    flexDirection: "row",
  },
  searchBarContainer: {
    padding: 0,
    backgroundColor: "transparent",
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
    // Dummy search bar, don't allow typing
    pointerEvents: "none",
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
    paddingTop: 0,
  },
  checkboxText: {
    fontWeight: "normal",
    fontSize: 17,
    marginLeft: 7,
  },
});
