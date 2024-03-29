import React from "react";

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import Dimensions from "../Constants/Dimensions";
import { Account } from "appwrite";
import { client } from "@/appwrite";
import { Button, CheckBox } from "@rneui/base";
import { BACKEND_API_USER_URL } from "@/Constants/URLs";
import { LoginStateContext } from "@/Providers/LoginStateProvider";
import Toast from "react-native-toast-message";

const account = new Account(client);

function DeleteAccount() {
  const { loggedIn, setLoggedIn, refreshLoginState } =
    React.useContext(LoginStateContext);
  const [confirmed, setConfirmed] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  async function deleteAccount() {
    // User might have stale auth
    refreshLoginState();

    if (!loggedIn) {
      Toast.show({
        type: "error",
        text1:
          "Your session expired. Please sign-in again to proceed with account deletion.",
        position: "bottom",
        visibilityTime: 2000,
      });
      return;
    }
    try {
      const res = await fetch(`${BACKEND_API_USER_URL}`, {
        method: "DELETE",
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: "Bearer " + (await account.createJWT()).jwt,
        }),
      });

      if (res.ok) {
        account.deleteSessions();
        setLoggedIn(false);
        Toast.show({
          type: "success",
          text1: "Your account was successfully deleted! See you again soon!",
          position: "bottom",
          visibilityTime: 2000,
        });
      } else {
        console.error("Error deleting account");
        console.error(`${res.status} - ${JSON.stringify(res.json())}`);
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <View style={styles.container} testID="delete-account-view">
      <Text style={styles.title}>Delete account</Text>
      <Text style={styles.text}>
        Warning: you are attempting to delete your account. This will delete all
        data associated with your account, including but not limited to your
        book reviews, book reading status, friends list, and more. Are you sure
        you want to continue?
      </Text>
      <View style={{ paddingTop: 20, alignItems: "center" }}>
        <CheckBox
          testID="delete-account-confirm-checkbox"
          checked={confirmed}
          onPress={() => {
            setConfirmed(!confirmed);
          }}
          title="Yes, I'm sure I want to delete my account"
        />
      </View>
      <View style={{ paddingTop: 20, alignItems: "center" }}>
        {!deleting ? (
          <Button
            testID="delete-account-button"
            onPress={() => {
              setDeleting(true);
              deleteAccount();
            }}
            color={"red"}
            containerStyle={{ borderRadius: 30 }}
            disabled={!confirmed}
          >
            <Text
              style={{
                color: "white",
                paddingRight: 5,
                fontSize: 17,
                paddingTop: 5,
                paddingBottom: 5,
                alignSelf: "center",
              }}
            >
              Delete Account
            </Text>
          </Button>
        ) : (
          <ActivityIndicator />
        )}
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
  title: {
    marginTop: 80,
    marginLeft: 20,
    fontSize: 30,
  },
  text: {
    margin: Dimensions.INITIAL_LAUNCH_SCREEN_TEXT_MARGIN,
    fontSize: Dimensions.INITIAL_LAUNCH_SCREEN_TEXT,
    textAlign: "left",
    marginLeft: 20,
    marginRight: 20,
  },
});

export default DeleteAccount;
