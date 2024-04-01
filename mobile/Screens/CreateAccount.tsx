import { Icon } from "@rneui/themed";
import { Account, ID } from "appwrite";
import { StatusBar } from "expo-status-bar";
import { registerIndieID } from "native-notify";
import React from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Colors from "../Constants/Colors";
import Dimensions from "../Constants/Dimensions";

import { client } from "@/appwrite";
import { LoginStateContext } from "@/Providers/LoginStateProvider";
import { BACKEND_API_USERNAME_URL } from "@/Constants/URLs";

const account = new Account(client);

export const CreateAccount = (props) => {
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const { navigation } = props;
  const [password, setPassword] = React.useState("");
  const [errorModalVisible, setErrorModalVisible] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { setLoggedIn } = React.useContext(LoginStateContext);

  const handleSwitch = () => {
    navigation.navigate("sign_in");
  };
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  const checkUsernameAvailability = async (token) => {
    const res = await fetch(`${BACKEND_API_USERNAME_URL}`, {
      method: "PATCH",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      }),
      body: JSON.stringify({
        username: username,
      }),
    });
    return res;
  };
  const handleSaveUsername = async () => {
    try {
      setLoading(true);
      const token = await account.createJWT();
      const res = await checkUsernameAvailability(token);
      if (!res.ok) {
        const res_json = await res.json();
        setErrorMessage("Error: " + res_json.reason);
        setErrorModalVisible(true);
      } else {
        const res_json = await res.json();
      }
    } catch (error) {
      console.error("Error saving username:", error);
      setErrorMessage("An error occurred while saving the username");
      setLoading(false);
      setErrorModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!name || !username || !email || !password) {
      setErrorMessage("Error: Please fill in all fields");
      setErrorModalVisible(true);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await account.create(ID.unique(), email, password, name);
      await account.createEmailPasswordSession(email, password);
      const userResponse = await account.get();
      setLoggedIn(true);
      await registerIndieID(userResponse.$id, 20437, "yoXi9lQ377rDWZeu0R8IdW");
      await handleSaveUsername();
    } catch (error) {
      setErrorMessage(error.message);
      setErrorModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      testID="sign-in-view"
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.container}>
          <Text style={styles.title}>Create your account</Text>
          <View style={styles.inputContainer}>
            <TextInput
              testID="sign-in-email-field"
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="username"
              placeholderTextColor={Colors.TYPE_PLACEHOLDER_TEXT_COLOR}
              returnKeyType="done"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              testID="sign-in-email-field"
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="name"
              placeholderTextColor={Colors.TYPE_PLACEHOLDER_TEXT_COLOR}
              returnKeyType="done"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              testID="sign-in-email-field"
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
              testID="sign-in-password-field"
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
          <Pressable onPress={handleSwitch}>
            <Text style={styles.createAccountText}>
              already have an account? sign in
            </Text>
          </Pressable>
          <Pressable
            testID="sign-in-signin-arrow"
            onPress={() => {
              setLoading(true);
              handleSignIn();
            }}
          >
            {loading ? (
              <ActivityIndicator
                color="#ffffff"
                style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }] }}
              />
            ) : (
              <Icon
                style={styles.icon}
                name={"arrow-forward"}
                size={Dimensions.INITIAL_LAUNCH_SCREEN_NEXT_ARROW_SIZE}
                color={Colors.INITIAL_LAUNCH_SCREEN_ARROW_WHITE}
              />
            )}
          </Pressable>
          <StatusBar style="auto" />
        </View>
      </TouchableWithoutFeedback>
      <Modal
        transparent={true}
        visible={errorModalVisible}
        onRequestClose={() => setErrorModalVisible(false)}
      >
        <View style={styles.modalContainer} testID="sign-in-error-modal">
          <View style={styles.modalContent}>
            <Text style={styles.modalText} testID="sign-in-error-modal-message">
              {errorMessage}
            </Text>
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
    justifyContent: "center",
  },
  title: {
    marginTop: 200,
    marginBottom: 30,
    textAlign: "left",
    marginLeft: Dimensions.INITIAL_LAUNCH_SCREEN_TEXT_SIDE_MARGIN,
    fontSize: 60,
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
  createAccountText: {
    margin: Dimensions.INITIAL_LAUNCH_SCREEN_TEXT_MARGIN,
    fontSize: 17,
    color: "#0544ff",
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
