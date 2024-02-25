import React, { useState } from "react";
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
} from "react-native";
import Colors from "../Constants/Colors";
import { Icon } from "@rneui/themed";
import Dimensions from "../Constants/Dimensions";
import { Account } from "appwrite";
import type { Models } from "appwrite";

// TODO: make this root import
import { client } from "../appwrite";

const account = new Account(client);

export const SignIn = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [session, setSession] = useState(null);
  const [loggedInUser, setLoggedInUser] =
    useState<Models.User<Models.Preferences> | null>(null);
  const { navigation } = props;
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  const handleSignIn = () => {
    setSession(
      account
        .createEmailSession(email, password)
        .then(() => {
          account
            .get()
            .then((user) => {
              setLoggedInUser(user);
              console.log(user);
            })
            .catch((e) => {
              setErrorMessage(`An error occurred: ${e}`);
              setErrorModalVisible(true);
            });
        })
        .catch((e) => {
          setErrorMessage(`An error occurred: ${e}`);
          setErrorModalVisible(true);
        }),
    );
    // if sign-in successful, nav to next screen
    // navigation.navigate('screen');
    navigation.navigate("navbar");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      //   behavior="padding"
      behavior={Platform.OS === "ios" ? "padding" : null}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.container}>
          <Text style={styles.title}>Sign in</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="email"
              placeholderTextColor={Colors.TYPE_PLACEHOLDER_TEXT_COLOR}
              keyboardType="email-address"
              returnKeyType="done"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="password"
              placeholderTextColor={Colors.TYPE_PLACEHOLDER_TEXT_COLOR}
              secureTextEntry={true}
              returnKeyType="done"
              autoCapitalize="none"
            />
          </View>
          <Pressable onPress={handleSignIn}>
            <Icon
              style={styles.icon}
              name={"arrow-forward"}
              size={Dimensions.INITIAL_LAUNCH_SCREEN_NEXT_ARROW_SIZE}
              color={Colors.INITIAL_LAUNCH_SCREEN_ARROW_WHITE}
            />
          </Pressable>
          <StatusBar style="auto" />
        </View>
      </TouchableWithoutFeedback>
      <Modal
        // animationType="slide"
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.INITIAL_LAUNCH_SCREEN_BG_PINK,
    // alignItems: "center",
    justifyContent: "center",
    marginBottom: "-20%",
  },
  title: {
    marginTop: 350,
    marginBottom: 30,
    textAlign: "left",
    marginLeft: Dimensions.INITIAL_LAUNCH_SCREEN_TEXT_SIDE_MARGIN,
    fontSize: Dimensions.INITIAL_LAUNCH_SCREEN_TITLE,
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
    color: Colors.INITIAL_LAUNCH_SCREEN_TEXT_WHITE,
    borderBottomWidth: 2,
    borderBottomColor: Colors.INITIAL_LAUNCH_SCREEN_TEXT_WHITE,
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
