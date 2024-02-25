import * as React from "react";
import { View, Text, Pressable, StyleSheet, TextInput } from "react-native";
import Modal from "react-native-modal";
import Colors from "../../Constants/Colors";
import { useState } from "react";

function TextReview(props) {
  const { navigation } = props;
  const [text, setText] = useState("");
  return (
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
      <Text style={styles.title}>What are your thoughts on this book?</Text>
      <TextInput
        style={styles.reviewInput}
        onChangeText={setText}
        value={text}
        editable
        multiline
        numberOfLines={4}
      />
      <Pressable
        onPress={() => navigation.navigate("navbar")}
        style={styles.saveButton}
      >
        <Text style={styles.saveButtonText}>Save</Text>
      </Pressable>
      <Pressable onPress={() => navigation.pop()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  slider: {
    marginBottom: 50,
  },
  title: {
    fontSize: 25,
    marginTop: 50,
    marginVertical: 20,
    fontWeight: "600",
    marginHorizontal: 40,
    textAlign: "center",
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
    marginBottom: 100,
    borderRadius: 10,
  },
  reviewInput: {
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default TextReview;
