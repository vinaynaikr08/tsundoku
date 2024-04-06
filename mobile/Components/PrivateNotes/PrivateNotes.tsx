import Colors from "@/Constants/Colors";
import * as React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

function PrivateNotes({ navigation }) {
  return (
    <ScrollView style={{ backgroundColor: "white", marginTop: 10 }}>
      <Text>You have no private notes!</Text>
      <Pressable
        onPress={() => navigation.navigate("EditPrivateNotes")}
        style={styles.saveButton}
      >
        <Text style={styles.saveButtonText}>Edit</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  saveButton: {
    backgroundColor: Colors.BUTTON_GRAY,
    padding: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10,
  },
  saveButtonText: {
    color: Colors.BUTTON_PURPLE,
    fontWeight: "600",
    fontSize: 16,
  },
});

export default PrivateNotes;
