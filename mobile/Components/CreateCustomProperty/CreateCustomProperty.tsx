import Colors from "@/Constants/Colors";
import * as React from "react";
import { useState } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import SelectDropdown from "react-native-select-dropdown";

function CreateCustomProperty({ navigation }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");

  function dismiss() {
    Alert.alert("Discard property?", "You have an unsaved custom property.", [
      { text: "Don't leave", style: "cancel", onPress: () => {} },
      {
        text: "Discard",
        style: "destructive",
        onPress: () => navigation.navigate("navbar"),
      },
    ]);
  }

  const propertyTypes = ["numerical", "categorical", "boolean"];

  function saveCustomProperty() {}
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          //justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
          width: "100%",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
      >
        <TouchableOpacity
          style={{ margin: 20, marginBottom: 10, alignSelf: "flex-end" }}
          onPress={dismiss}
        >
          <Icon name={"close"} color="black" size={25} />
        </TouchableOpacity>
        <Text style={styles.title}>Create Custom Property</Text>
        <TextInput
          style={styles.nameInput}
          onChangeText={setName}
          value={name}
          placeholder="Property Name"
          placeholderTextColor={Colors.BUTTON_TEXT_GRAY}
        />
        <SelectDropdown
          data={propertyTypes}
          onSelect={(selectedItem, index) => {
            setType(selectedItem);
          }}
          defaultButtonText={"Select property type"}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem;
          }}
          rowTextForSelection={(item, index) => {
            return item;
          }}
          buttonStyle={styles.dropdown4BtnStyle}
          buttonTextStyle={{ color: Colors.BUTTON_TEXT_GRAY }}
          dropdownOverlayColor={"transparent"}
          renderDropdownIcon={(isOpened) => {
            return (
              <Icon
                name={
                  isOpened
                    ? "chevron-up-circle-outline"
                    : "chevron-down-circle-outline"
                }
                color={Colors.BUTTON_PURPLE}
                size={25}
              />
            );
          }}
          dropdownIconPosition={"left"}
        />
        <Pressable onPress={saveCustomProperty} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginHorizontal: 40,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  nameInput: {
    margin: 12,
    marginTop: 40,
    borderWidth: 1,
    padding: 10,
    borderColor: Colors.BOOK_INFO_MODAL_GREY_LINE_COLOR,
    borderRadius: 15,
    width: "80%",
    height: 50,
  },
  saveButton: {
    backgroundColor: Colors.BUTTON_PURPLE,
    padding: 10,
    paddingHorizontal: 20,
    marginBottom: 100,
    borderRadius: 10,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  dropdown4BtnStyle: {
    width: "80%",
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.BOOK_INFO_MODAL_GREY_LINE_COLOR,
    marginBottom: 20
  },
});

export default CreateCustomProperty;
