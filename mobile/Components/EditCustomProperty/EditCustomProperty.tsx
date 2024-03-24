import Colors from "@/Constants/Colors";
import { BACKEND_API_CUSTOM_PROPERTY_TEMPLATE_URL } from "@/Constants/URLs";
import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Account } from "appwrite";
import { client } from "@/appwrite";
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const account = new Account(client);

function EditCustomProperty({ navigation, route }) {
  const { propertyInfo, setPropertiesChanged } = route.params;
  const [newName, setNewName] = React.useState("");

  async function updateCustomProperty() {
    if (newName.length == 0) {
      return;
    }
    try {
      const res = await fetch(
        `${BACKEND_API_CUSTOM_PROPERTY_TEMPLATE_URL}/${propertyInfo.id}`,
        {
          method: "patch",
          headers: new Headers({
            "Content-Type": "application/json",
            Authorization: "Bearer " + (await account.createJWT()).jwt,
          }),
          body: JSON.stringify({
            name: newName,
          }),
        },
      );

      const res_json = await res.json();

      if (res.ok) {
        console.log("updated property template name");
        setPropertiesChanged((prev) => !prev);
        navigation.pop();
      } else {
        console.log("did not updated: " + JSON.stringify(res_json));
      }
    } catch (error) {
      console.error(error);
      // setErrorMessage("An error occurred fetching the books.");
      // setErrorModalVisible(true);
    }
  }
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={{ flex: 1, backgroundColor: "white", justifyContent: "center" }}
      >
        <View>
          <Text style={styles.title}>Edit: </Text>
          <Text style={styles.propertyName}>{propertyInfo.name}</Text>
        </View>
        <TextInput
          style={styles.nameInput}
          onChangeText={setNewName}
          value={newName}
          placeholder="New Property Name"
          placeholderTextColor={Colors.BUTTON_TEXT_GRAY}
        />
        <View
          style={{ flexDirection: "row", justifyContent: "center", gap: 10 }}
        >
          <Pressable
            onPress={() => updateCustomProperty()}
            style={styles.saveButton}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </Pressable>
          <Pressable onPress={() => navigation.pop()} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Cancel</Text>
          </Pressable>
        </View>
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
  propertyName: {
    fontSize: 20,
    fontWeight: "600",
    marginHorizontal: 40,
    textAlign: "center",
    paddingHorizontal: 10,
    color: Colors.BUTTON_PURPLE,
  },
  nameInput: {
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: Colors.BOOK_INFO_MODAL_GREY_LINE_COLOR,
    borderRadius: 15,
    width: "80%",
    height: 50,
    alignSelf: "center",
  },
  saveButton: {
    backgroundColor: Colors.BUTTON_PURPLE,
    borderRadius: 10,
    width: 110,
    alignSelf: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
    margin: 10,
    textAlign: "center",
  },
});

export default EditCustomProperty;
