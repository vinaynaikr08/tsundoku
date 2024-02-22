import * as React from "react";
import { useEffect, useState } from "react";
import { View, Text, Pressable, Button } from "react-native";
import Modal from "react-native-modal";
import TextReview from "../TextReview/TextReview";
import Colors from "../../Constants/Colors";
import { createStackNavigator } from "@react-navigation/stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, useNavigation } from "@react-navigation/native";

const Stack = createStackNavigator();

function StarRating(props) {
  const [isTextReviewModalVisible, setTextReviewModalVisible] = useState(false);
  const { navigation } = props;

  useEffect(() => {
    if (isTextReviewModalVisible === true) {
      setTextReviewModalVisible(false);
      navigation.navigate("textReviewModal");
    }
  }, [isTextReviewModalVisible]);

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
      <Text>I am the modal content!</Text>
      <Pressable
        onPress={() => setTextReviewModalVisible(true)}
        style={{ backgroundColor: Colors.BUTTON_GRAY, padding: 10 }}
      >
        <Text>Go to text review</Text>
      </Pressable>
    </View>
  );
}

// function RandomComponent({navigation}) {
//   return (
//     <View>
//       <Text>Hello random</Text>
//       <Button onPress={() => navigation.goBack()} title="Dismiss" />
//     </View>
//   );
// }

// function StarRating({ isStarRatingModalVisible, setStarRatingModalVisible }) {
//   return (
//     <Modal
//       isVisible={isStarRatingModalVisible}
//       onSwipeComplete={() => {
//         setStarRatingModalVisible(false);
//       }}
//       swipeDirection={["down"]}
//       style={{
//         marginBottom: 0,
//         marginRight: 0,
//         marginLeft: 0,
//         marginTop: 50,
//       }}
//     >

//     </Modal>
//   );
// }

export default StarRating;
