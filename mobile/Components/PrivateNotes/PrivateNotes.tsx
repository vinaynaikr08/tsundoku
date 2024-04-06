import Colors from "@/Constants/Colors";
import * as React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

function PrivateNotes({ navigation }) {
  return (
    <ScrollView style={{ backgroundColor: "white", marginTop: 10 }}>
      <Text style={{marginBottom: 10, alignSelf: "center"}}>You have no private notes!</Text>
      <Pressable
        onPress={() => navigation.navigate("EditPrivateNotes", {newNote: false})}
        style={styles.saveButton}
      >
        <Text style={styles.saveButtonText}>Edit</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  saveButton: {
    backgroundColor: Colors.BUTTON_PURPLE,
    padding: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10,
    width: "25%",
    alignSelf: "center"
  },
  saveButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center"
  },
});

export default PrivateNotes;
