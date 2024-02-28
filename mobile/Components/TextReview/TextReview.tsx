import * as React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import Modal from "react-native-modal";
import Colors from "../../Constants/Colors";
import { useContext, useState } from "react";
import { Account, Databases, ID } from "appwrite";
import { client } from "../../appwrite";
import { BookInfoContext } from "@/Contexts";
import Toast from "react-native-toast-message";
import { BACKEND_API_REVIEW_URL } from "../../Constants/URLs";

function TextReview({ route, navigation }) {
  const { rating } = route.params;
  const { bookInfo } = useContext(BookInfoContext);
  console.log("textreview: " + bookInfo);
  const [text, setText] = useState("");

  // React.useEffect(
  //   () =>
  //     navigation.addListener("beforeRemove", (e) => {
  //       const action = e.data.action;
  //       if (text != "") {
  //         return;
  //       }

  //       e.preventDefault();

  //       Alert.alert("Discard review?", "You have an unsaved review.", [
  //         { text: "Don't leave", style: "cancel", onPress: () => {} },
  //         {
  //           text: "Discard",
  //           style: "destructive",
  //           onPress: () => navigation.dispatch(action),
  //         },
  //       ]);
  //     }),
  //   [navigation],
  // );

  const saveReview = async () => {
    const account = new Account(client);

    console.log("saving review\n");

    let res = await fetch(`${BACKEND_API_REVIEW_URL}`, {
      method: "post",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: "Bearer " + (await account.createJWT()).jwt,
      }),
      body: JSON.stringify({
        book_id: "65da0871ed3dadffe87d",
        star_rating: rating,
        description: text,
      }),
    });

    if (res.ok) {
      const res_json = await res.json();
      console.log("review saved to database: " + res_json);
    } else {
      console.log("error: " + res.status);
    }

    console.log("saved review\n");

    Toast.show({
      type: "success",
      text1: "Review successfully saved!",
      position: "bottom",
      visibilityTime: 2000,
    });
    navigation.navigate("navbar");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
          width: "100%",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
      >
        <Text style={styles.title}>What are your thoughts on this book?</Text>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, width: "90%" }}
        >
          <TextInput
            style={styles.reviewInput}
            onChangeText={setText}
            value={text}
            editable
            multiline
            numberOfLines={4}
          />
        </KeyboardAvoidingView>
        <Pressable onPress={saveReview} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
        <Pressable onPress={() => navigation.pop()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  slider: {
    marginBottom: 50,
  },
  title: {
    fontSize: 25,
    marginTop: 50,
    fontWeight: "600",
    marginHorizontal: 40,
    textAlign: "center",
  },
  text: {
    fontSize: 20,
  },
  saveButtonText: {
    color: Colors.BUTTON_PURPLE,
    fontWeight: "600",
    fontSize: 16,
  },
  backButtonText: {
    color: "black",
    fontWeight: "600",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: Colors.BUTTON_GRAY,
    padding: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10,
  },
  backButton: {
    backgroundColor: Colors.BUTTON_GRAY,
    padding: 10,
    paddingHorizontal: 20,
    marginBottom: 60,
    borderRadius: 10,
  },
  reviewInput: {
    height: "85%",
    margin: 12,
    marginTop: 40,
    borderWidth: 1,
    padding: 10,
    borderColor: Colors.BOOK_INFO_MODAL_GREY_LINE_COLOR,
    borderRadius: 15,
  },
});

export default TextReview;
