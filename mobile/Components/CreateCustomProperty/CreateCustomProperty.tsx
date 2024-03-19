import * as React from "react";
import { useState } from "react";
import { Text, TextInput, View, StyleSheet } from "react-native";

function CreateCustomProperty() {
  const [name, setName] = useState("");
  return (
    <View>
      <Text> Create Custom Property </Text>
      <TextInput
        style={styles.nameInput}
        onChangeText={setName}
        value={name}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  nameInput: {
    margin: 12
  },
});

export default CreateCustomProperty;
