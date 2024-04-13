import Colors from "@/Constants/Colors";
import { BACKEND_API_AUTHORS, BACKEND_API_AUTHOR_SEARCH_URL, BACKEND_API_BOOKS, BACKEND_API_EDITIONS } from "@/Constants/URLs";
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
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { client } from "@/appwrite";
import { Account } from "appwrite";

const account = new Account(client);

const genres: String[] = ["Religion", "Fiction", "Juvenile Nonfiction"];
function AddManualBook({ navigation }) {
  const [title, setTitle] = React.useState("");
  const [author, setAuthor] = React.useState("");
  const [genre, setGenre] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [pageCount, setPageCount] = React.useState("");
  const [publisher, setPublisher] = React.useState("");
  const [isbn10, setISBN10] = React.useState("");
  const [isbn13, setISBN13] = React.useState("");
  const [coverURL, setCoverURL] = React.useState("");

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

  async function getAuthor() {
    try {
      const res = await fetch(
        `${BACKEND_API_AUTHOR_SEARCH_URL}?` +
          new URLSearchParams({
            name: author,
          }),
        {
          method: "get",
          headers: new Headers({
            "Content-Type": "application/json",
            Authorization: "Bearer " + (await account.createJWT()).jwt,
          }),
        },
      );

      const res_json = await res.json();
      if (res.ok) {
        console.log("author: " + JSON.stringify(res_json));
        if (res_json.results.documents.length == 0) {
          const author_res = await fetch(`${BACKEND_API_AUTHORS}`, {
            method: "post",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + (await account.createJWT()).jwt,
            }),
            body: JSON.stringify({
              name: author
            }),
          });
    
          const author_res_json = await author_res.json();
          if (author_res.ok) {
            console.log("author created: " + JSON.stringify(author_res_json));
            return author_res_json.results.author_id;
          } else {
            console.log(
              "error creating author: " + JSON.stringify(author_res_json),
            );
          }
        } else {
          return res_json.results.documents[0].$id;
        }
      } else {
        console.log(
          "error getting raw author: " + JSON.stringify(res_json),
        );
      }
    } catch (error) {
      console.error(error);
      // setErrorMessage("An error occurred fetching the books.");
      // setErrorModalVisible(true);
    }
  }

  async function createEdition() {
    try {
      const res = await fetch(`${BACKEND_API_EDITIONS}`, {
        method: "post",
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: "Bearer " + (await account.createJWT()).jwt,
        }),
        body: JSON.stringify({
          isbn_10: isbn10,
          isbn_13: isbn13,
          page_count: pageCount,
          publisher: publisher,
          thumbnail_url: coverURL
        }),
      });

      const res_json = await res.json();
      if (res.ok) {
        console.log("edition: " + JSON.stringify(res_json));
        return res_json.results.edition_id;
      } else {
        console.log(
          "error creating edition: " + JSON.stringify(res_json),
        );
      }
    } catch (error) {
      console.error(error);
      // setErrorMessage("An error occurred fetching the books.");
      // setErrorModalVisible(true);
    }
  }

  async function saveBook() {
    const author_id: string = await getAuthor();
    const edition_id: string = await createEdition();

    try {
      const res = await fetch(`${BACKEND_API_BOOKS}`, {
        method: "post",
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: "Bearer " + (await account.createJWT()).jwt,
        }),
        body: JSON.stringify({
          title: title,
          authors: [author_id],
          editions: [edition_id],
          description: description,
          genre: genre
        }),
      });

      const res_json = await res.json();
      if (res.ok) {
        console.log("new book: " + JSON.stringify(res_json));
      } else {
        console.log(
          "error creating book: " + JSON.stringify(res_json),
        );
      }
    } catch (error) {
      console.error(error);
      // setErrorMessage("An error occurred fetching the books.");
      // setErrorModalVisible(true);
    }
    Toast.show({
      type: "success",
      text1: "Book successfully created!",
      position: "bottom",
      visibilityTime: 2000,
    });
    navigation.navigate("navbar");
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, flexDirection: 'column',justifyContent: 'center',}} behavior="padding" enabled   keyboardVerticalOffset={50}>
      <ScrollView style={{flex: 1}}>
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
            <TextInput
              style={styles.nameInput}
              onChangeText={setPublisher}
              value={publisher}
              placeholder="Publisher"
              placeholderTextColor={Colors.BUTTON_TEXT_GRAY}
            />
            <TextInput
              style={styles.nameInput}
              onChangeText={setPageCount}
              value={pageCount}
              placeholder="Page Count"
              placeholderTextColor={Colors.BUTTON_TEXT_GRAY}
            />
            <TextInput
              style={styles.nameInput}
              onChangeText={setISBN10}
              value={isbn10}
              placeholder="ISBN 10"
              placeholderTextColor={Colors.BUTTON_TEXT_GRAY}
            />
            <TextInput
              style={styles.nameInput}
              onChangeText={setISBN13}
              value={isbn13}
              placeholder="ISBN 13"
              placeholderTextColor={Colors.BUTTON_TEXT_GRAY}
            />
            <TextInput
              style={styles.nameInput}
              onChangeText={setCoverURL}
              value={coverURL}
              placeholder="Cover URL"
              placeholderTextColor={Colors.BUTTON_TEXT_GRAY}
            />
            <TextInput
                style={styles.reviewInput}
                onChangeText={setDescription}
                value={description}
                editable
                multiline
                numberOfLines={4}
                placeholder="Description"
                placeholderTextColor={Colors.BUTTON_TEXT_GRAY}
              />
            <Pressable onPress={saveBook} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </Pressable>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
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
    borderRadius: 10,
    marginBottom: 20
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
    marginBottom: 10,
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
  reviewInput: {
    height: 200,
    margin: 12,
    marginTop: 0,
    borderWidth: 1,
    padding: 12,
    paddingTop: 17,
    borderColor: Colors.BOOK_INFO_MODAL_GREY_LINE_COLOR,
    borderRadius: 15,
    width: "80%"
  },
});

export default AddManualBook;
