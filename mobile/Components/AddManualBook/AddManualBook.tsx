import Colors from "@/Constants/Colors";
import * as React from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  TextInput,
  Alert,
  Pressable,
  StyleSheet,
} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const genres: String[] = ["Religion", "Fiction", "Juvenile Nonfiction"];
function AddManualBook({ navigation }) {
  const [title, setTitle] = React.useState("");
  const [author, setAuthor] = React.useState("");
  const [genre, setGenre] = React.useState("");
  function dismiss() {
    Alert.alert("Discard new book?", "You have not saved this book.", [
      { text: "Don't leave", style: "cancel", onPress: () => {} },
      {
        text: "Discard",
        style: "destructive",
        onPress: () => navigation.navigate("navbar"),
      },
    ]);
  }

  function saveBook() {}

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
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
        <Text style={styles.title}>Add New Book</Text>
        <TextInput
          style={styles.nameInput}
          onChangeText={setTitle}
          value={title}
          placeholder="Title"
          placeholderTextColor={Colors.BUTTON_TEXT_GRAY}
        />
        <TextInput
          style={styles.nameInput}
          onChangeText={setAuthor}
          value={author}
          placeholder="Author"
          placeholderTextColor={Colors.BUTTON_TEXT_GRAY}
        />
        <SelectDropdown
          data={genres}
          onSelect={(selectedItem) => {
            setGenre(selectedItem);
          }}
          dropdownOverlayColor={"transparent"}
          renderButton={(selectedItem, isOpen) => {
            return (
              <View style={styles.dropdown4BtnStyle}>
                <Icon
                  name={
                    isOpen
                      ? "chevron-up-circle-outline"
                      : "chevron-down-circle-outline"
                  }
                  color={Colors.BUTTON_PURPLE}
                  size={25}
                />
                <Text style={{ fontSize: 14, color: Colors.BUTTON_TEXT_GRAY }}>
                  {selectedItem || "Select genre"}
                </Text>
              </View>
            );
          }}
          renderItem={(item, index, isSelected) => {
            return (
              <View style={styles.dropdownItemStyle}>
                <Text style={styles.dropdownButtonTxtStyle}>{item}</Text>
              </View>
            );
          }}
        />

        <Pressable onPress={saveBook} style={styles.saveButton}>
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
    marginBottom: 30,
  },
  nameInput: {
    margin: 12,
    marginTop: 0,
    borderWidth: 1,
    padding: 10,
    borderColor: Colors.BOOK_INFO_MODAL_GREY_LINE_COLOR,
    borderRadius: 15,
    width: "80%",
    height: 50,
  },
  categoryInput: {
    display: "flex",
    margin: 12,
    marginTop: 5,
    borderWidth: 1,
    padding: 10,
    borderColor: Colors.BOOK_INFO_MODAL_GREY_LINE_COLOR,
    borderRadius: 15,
    width: 310,
    height: 50,
    justifyContent: "center",
    alignSelf: "center",
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
    marginBottom: 20,
    alignSelf: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    paddingLeft: 10,
  },
  dropdownItemStyle: {
    backgroundColor: Colors.BUTTON_GRAY,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 0.2,
    borderBottomColor: Colors.BOOK_INFO_MODAL_GREY_LINE_COLOR,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "400",
    color: "black",
    textAlign: "center",
  },
});

export default AddManualBook;
