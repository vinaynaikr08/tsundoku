import React, { useState } from "react";
import BookInfoModal from "../Components/BookInfoModal";
import {
  View,
  Text,
  SafeAreaView,
  Button,
  Pressable,
  TouchableOpacity,
} from "react-native";

export const Profile = () => {
  const [isBookInfoModalVisible, setIsBookInfoModalVisible] = useState(false);

  // Function to toggle the visibility of the modal
  const toggleBookInfoModal = () => {
    setIsBookInfoModalVisible(!isBookInfoModalVisible);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>Profile!</Text>
      <TouchableOpacity
        onPress={toggleBookInfoModal}
        style={{
          backgroundColor: "purple",
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 5,
          margin: 130,
        }}
      >
        <Text style={{ color: "white" }}>Testing Book Info</Text>
      </TouchableOpacity>
      <BookInfoModal
        isVisible={isBookInfoModalVisible}
        onClose={toggleBookInfoModal}
        bookInfo={{
          coverImage: "",
          title: "The Poppy War",
          author: "R Kuang",
          summary:
            "The Poppy War is a 2018 novel by R. F. Kuang, published by Harper Voyager. The Poppy War, a grimdark fantasy, draws its plot and politics from mid-20th-century China, with the conflict in the novel based on the Second Sino-Japanese War, and an atmosphere inspired by the Song dynasty.",
        }}
      />
    </SafeAreaView>
  );
};
