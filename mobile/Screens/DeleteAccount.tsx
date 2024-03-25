import React from "react";

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Dimensions from "../Constants/Dimensions";
import { Button, CheckBox } from "@rneui/base";

function DeleteAccount() {
  const [confirmed, setConfirmed] = React.useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delete account</Text>
      <Text style={styles.text}>
        Warning: you are attempting to delete your account. This will delete all
        data associated with your account, including but not limited to your
        book reviews, book reading status, friends list, and more. Are you sure
        you want to continue?
      </Text>
      <View style={{ paddingTop: 20, alignItems: "center" }}>
        <CheckBox
          checked={confirmed}
          onPress={() => {
            setConfirmed(!confirmed);
          }}
          title="Yes, I'm sure I want to delete my account"
        />
      </View>
      <View style={{ paddingTop: 20, alignItems: "center" }}>
        <Button
          onPress={deleteAccount}
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
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

function deleteAccount() {
  console.log("Delete button pressed");
  // TODO: implement
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
