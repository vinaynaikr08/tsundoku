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
  StyleSheet
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

function EditPrivateNotes({ navigation }) {
  const [text, setText] = React.useState("");
  function dismiss() {
    Alert.alert("Discard private note?", "You have unsaved changes.", [
      { text: "Don't leave", style: "cancel", onPress: () => {} },
      {
        text: "Discard",
        style: "destructive",
        onPress: () => navigation.navigate("navbar"),
      },
    ]);
  }

  const saveReview = async () => {
    // const account = new Account(client);
    // const res = await fetch(`${BACKEND_API_REVIEW_URL}`, {
    //   method: "post",
    //   headers: new Headers({
    //     "Content-Type": "application/json",
    //     Authorization: "Bearer " + (await account.createJWT()).jwt,
    //   }),
    //   body: JSON.stringify({
    //     book_id: bookInfo.id,
    //     star_rating: rating,
    //     description: text,
    //   }),
    // });
    // if (res.ok) {
    //   const res_json = await res.json();
    //   console.log("review saved to database: " + res_json);
    // } else {
    //   console.log("error number: " + res.status);
    //   console.log("error: " + res.statusText);
    // }
    // for (let i = 0; i < propertyData.length; i++) {
    //   const property = propertyData[i];
    //   const custom_res = await fetch(`${BACKEND_API_CUSTOM_PROPERTY_DATA_URL}`, {
    //     method: "post",
    //     headers: new Headers({
    //       "Content-Type": "application/json",
    //       Authorization: "Bearer " + (await account.createJWT()).jwt,
    //     }),
    //     body: JSON.stringify({
    //       book_id: bookInfo.id,
    //       template_id: property.template_id,
    //       value: property.value,
    //     }),
    //   });
    //   const custom_res_json = await custom_res.json();
    //   if (custom_res.ok) {
    //     console.log(
    //       "custom properties saved to database: " +
    //         JSON.stringify(custom_res_json),
    //     );
    //   } else {
    //     console.log(
    //       "error saving custom properties: " + JSON.stringify(custom_res_json),
    //     );
    //   }
    // }
    // Toast.show({
    //   type: "success",
    //   text1: "Review successfully saved!",
    //   position: "bottom",
    //   visibilityTime: 2000,
    // });
    // navigation.navigate("navbar");
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
