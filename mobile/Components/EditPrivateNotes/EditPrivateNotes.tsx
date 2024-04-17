import Colors from "@/Constants/Colors";
import * as React from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { client } from "@/appwrite";
import { Account } from "appwrite";
import { BACKEND_API_PRIVATE_NOTES } from "@/Constants/URLs";
import Toast from "react-native-toast-message";
import { BookInfoWrapperContext } from "@/Contexts";
import { useNavigation } from "@react-navigation/native";

const account = new Account(client);

function EditPrivateNotes({ route }) {
  const navigation = useNavigation();
  const { noteId } = route.params;
  const bookInfo = React.useContext(BookInfoWrapperContext);
  const [loading, setLoading] = React.useState(false);
  const [text, setText] = React.useState("");

  React.useEffect(() => {
    async function getPrivateNote() {
      try {
        const res = await fetch(
          `${BACKEND_API_PRIVATE_NOTES}?` +
            new URLSearchParams({
              book_id: bookInfo.id,
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
          return res_json.results.documents[0].notes;
        } else {
          console.log(
            "error getting raw property data: " + JSON.stringify(res_json),
          );
        }
      } catch (error) {
        console.error(error);
        // setErrorMessage("An error occurred fetching the books.");
        // setErrorModalVisible(true);
      }
    }

    if (noteId != "null") {
      getPrivateNote()
      .then((data) => {
        setText(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        // setErrorMessage("An error occurred fetching the recommended books.");
        // setErrorModalVisible(true);
      });
    }
  }, []);

  function dismiss() {
    Alert.alert("Discard private note?", "You have unsaved changes.", [
      { text: "Don't leave", style: "cancel", onPress: () => {} },
      {
        text: "Discard",
        style: "destructive",
        onPress: () => navigation.pop(),
      },
    ]);
  }

  const savePrivateNote = async () => {
    const account = new Account(client);
    if (noteId != "null") {
      const res = await fetch(`${BACKEND_API_PRIVATE_NOTES}/${noteId}`, {
        method: "patch",
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: "Bearer " + (await account.createJWT()).jwt,
        }),
        body: JSON.stringify({
          notes: text,
        }),
      });
      const res_json = await res.json();
      if (res.ok) {
        console.log("private note updated in database: " + res_json);
      } else {
        console.log("error number: " + res.status);
        console.log("error: " + JSON.stringify(res_json));
      }
      Toast.show({
        type: "success",
        text1: "Private note updated!",
        position: "bottom",
        visibilityTime: 2000,
      });
    } else {
      const res = await fetch(`${BACKEND_API_PRIVATE_NOTES}`, {
        method: "post",
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: "Bearer " + (await account.createJWT()).jwt,
        }),
        body: JSON.stringify({
          book_id: bookInfo.id,
          notes: text,
        }),
      });
      const res_json = await res.json();
      if (res.ok) {
        console.log("private note saved to database: " + res_json);
      } else {
        console.log("error number: " + res.status);
        console.log("error: " + JSON.stringify(res_json));
      }
      Toast.show({
        type: "success",
        text1: "Private note created!",
        position: "bottom",
        visibilityTime: 2000,
      });
    }

    navigation.navigate("navbar");
  };

  return (
    // <View style={{backgroundColor: "white"}}>
    //   <Text>Edit private notes</Text>
    // </View>
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
        <TouchableOpacity
          style={{ margin: 20, marginBottom: 10, alignSelf: "flex-end" }}
          onPress={dismiss}
        >
          <Icon name={"close"} color="black" size={25} />
        </TouchableOpacity>
        <Text style={styles.title}>Private Notes</Text>
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
            maxLength={1700}
          />
        </KeyboardAvoidingView>
        <Pressable onPress={savePrivateNote} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
        <Pressable onPress={() => dismiss()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back</Text>
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

export default EditPrivateNotes;
