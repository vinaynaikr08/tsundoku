import React from "react";

import { StyleSheet, Text, View, Pressable, Modal } from "react-native";

function ErrorModal({ message, visible, setVisible }) {
  if (typeof message === "object") {
    console.error(
      "Error: the ErrorModal was supplied an object in the message parameter. We only support strings.",
    );
    console.info(
      `The object being attempted to render in the error module is the following: ${JSON.stringify(message)}`,
    );
    return;
  }

  return (
    <Modal
      // animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => setVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>{message}</Text>
          <Pressable onPress={() => setVisible(false)}>
            <Text style={styles.modalButton}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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

export default ErrorModal;
