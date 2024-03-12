import React, { useContext, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { ProfileContext } from "../../Contexts";
import Colors from "@/Constants/Colors";
import Dimensions from "@/Constants/Dimensions";
import { Databases, Account } from "appwrite";

import { client } from "@/appwrite";
import { LoginStateContext } from "@/Providers/LoginStateProvider";

const account = new Account(client);

export const UsernameEditing = (props) => {
  const [username, setUsername] = useState(null);
  const [errorModalVisible, setErrorModalVisible] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { setLoggedIn } = React.useContext(LoginStateContext);
  let user_id;
  const { navigation } = props;
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  useEffect(() => {
    const account = new Account(client);
    account
      .get()
      .then((response) => {
        user_id = response.$id; // user id in $id ?
        setUsername(response.name);
        // setEmail(response.email);
        // const databases = new Databases(client);
        // const promise = databases.listDocuments(
        //   ID.mainDBID,
        //   ID.bookStatusCollectionID,
        //   [Query.equal("user_id", user_id)],
        // );
        // promise.then(
        //   function (response) {
        //     const documents = response.documents;
        //   },
        //   function (error) {
        //     console.log(error);
        //   },
        // );
      })
      .catch((error) => {
        console.error("Error fetching user ID:", error);
      });
  }, []);

  const handleSaveUsername = async () => {
    try {
      setLoading(true);

      if (!username.trim()) {
        setErrorMessage("Username cannot be empty");
        setErrorModalVisible(true);
        return;
      }

      // if username is already taken
      //   const isUsernameTaken = await checkUsernameAvailability(username);
      //   if (isUsernameTaken) {
      //     setErrorMessage("Username is already taken");
      //     setErrorModalVisible(true);
      //     return;
      //   }

      //   const promise = account.updateEmail(user_id, 'email@example.com');
      const promise = account.updateName(username);
      setUsername(username);

      promise.then(
        function (response) {
          console.log(response);
          navigation.navigate("Profile");
        },
        function (error) {
          console.log(error);
        },
      );
    } catch (error) {
      console.error("Error saving username:", error);
      setErrorMessage("An error occurred while saving the username");
      setErrorModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const checkUsernameAvailability = async (username) => {
    // TODO
    return false; // return true if username is already taken, false otherwise
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      testID="sign-in-view"
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.navigate("Profile")}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Change username</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="username"
              placeholderTextColor={Colors.TYPE_PLACEHOLDER_TEXT_COLOR}
              //   keyboardType="email-address"
              returnKeyType="done"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.saveButtonContainer}>
            <Pressable
              onPress={() => {
                setLoading(true);
                handleSaveUsername();
                // navigation.navigate("Profile");
              }}
              style={styles.saveButton}
            >
              {loading ? (
                <ActivityIndicator
                  color="#ffffff"
                  style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }] }}
                />
              ) : (
                <Text style={styles.saveButtonText}>Save</Text>
              )}
            </Pressable>
          </View>
          <StatusBar style="auto" />
        </View>
      </TouchableWithoutFeedback>
      <Modal
        transparent={true}
        visible={errorModalVisible}
        onRequestClose={() => setErrorModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{errorMessage}</Text>
            <Pressable onPress={() => setErrorModalVisible(false)}>
              <Text style={styles.modalButton}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default UsernameEditing;

const styles = StyleSheet.create({
  cancelButton: {
    position: "absolute",
    top: 100,
    left: 30,
    zIndex: 1,
  },
  cancelText: {
    color: Colors.BUTTON_PURPLE,
    fontSize: 20,
  },
  saveButton: {
    justifyContent: "center",
    alignItems: "center",
    width: "30%",
    borderRadius: 19,
    height: 40,
    backgroundColor: Colors.BUTTON_PURPLE,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
  },
  saveButtonContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  container: {
    flex: 1,
    // marginTop: "30%"
    justifyContent: "center",
  },
  title: {
    // marginTop: 10,
    marginBottom: 30,
    textAlign: "left",
    marginLeft: Dimensions.INITIAL_LAUNCH_SCREEN_TEXT_SIDE_MARGIN,
    fontSize: 30,
    color: Colors.SIGN_IN_TEXT_BLACK,
    fontWeight: "bold",
  },
  text: {
    margin: Dimensions.INITIAL_LAUNCH_SCREEN_TEXT_MARGIN,
    fontSize: Dimensions.INITIAL_LAUNCH_SCREEN_TEXT,
    color: Colors.INITIAL_LAUNCH_SCREEN_TEXT_WHITE,
    textAlign: "left",
    marginLeft: Dimensions.INITIAL_LAUNCH_SCREEN_TEXT_SIDE_MARGIN,
    marginRight: Dimensions.INITIAL_LAUNCH_SCREEN_TEXT_SIDE_MARGIN,
  },
  icon: {
    marginTop: 40,
  },
  inputContainer: {
    flexDirection: "row",
    width: "80%",
    alignItems: "center",
    marginBottom: 20,
    marginLeft: 50,
    marginRight: 50,
  },
  input: {
    flex: 1,
    fontSize: Dimensions.INITIAL_LAUNCH_SCREEN_TEXT,
    // color: Colors.INITIAL_LAUNCH_SCREEN_TEXT_WHITE,
    borderBottomWidth: 1,
    // borderBottomColor: Colors.INITIAL_LAUNCH_SCREEN_TEXT_WHITE,
    paddingVertical: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    fontSize: 16,
    color: "blue",
    textAlign: "center",
  },
});
