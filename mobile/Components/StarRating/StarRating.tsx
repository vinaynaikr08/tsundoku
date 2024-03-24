import * as React from "react";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import Colors from "../../Constants/Colors";
import Slider from "@react-native-community/slider";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Icon from "react-native-vector-icons/MaterialIcons";

function StarRating(props) {
  const [isTextReviewModalVisible, setTextReviewModalVisible] = useState(false);
  const { navigation } = props;

  const [rating, setRating] = useState(0.0);

  useEffect(() => {
    if (isTextReviewModalVisible === true) {
      setTextReviewModalVisible(false);
      navigation.navigate("textReviewModal");
    }
  }, [isTextReviewModalVisible]);

  function dismiss() {
    Alert.alert("Discard review?", "You have an unsaved review.", [
      { text: "Don't leave", style: "cancel", onPress: () => {} },
      {
        text: "Discard",
        style: "destructive",
        onPress: () => navigation.navigate("navbar"),
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{ margin: 20, marginBottom: 10, alignSelf: "flex-end" }}
        onPress={dismiss}
      >
        <Icon name={"close"} color="black" size={25} />
      </TouchableOpacity>
      <Text style={styles.title}>How would you rate this book?</Text>
      <View style={{ alignItems: "center" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 20,
            justifyContent: "center",
            marginVertical: 50,
          }}
        >
          <Text style={{ fontSize: 50 }}>{rating / 4}</Text>
          <FontAwesome name={"star"} color={Colors.BUTTON_PURPLE} size={60} />
        </View>
        <View style={styles.slider}>
          <Slider
            style={{ width: 300, height: 40 }}
            onValueChange={setRating}
            minimumValue={0}
            maximumValue={20}
            step={1}
            thumbTintColor={Colors.BUTTON_PURPLE}
            minimumTrackTintColor="black"
            maximumTrackTintColor={Colors.BOOK_INFO_MODAL_GREY_LINE_COLOR}
          />
        </View>
        <Pressable
          onPress={() =>
            navigation.navigate("customPropertyModal", { rating: rating })
          }
          style={styles.nextButton}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  slider: {
    marginBottom: 50,
  },
  title: {
    fontSize: 25,
    marginTop: 50,
    marginVertical: 20,
    fontWeight: "600",
    marginHorizontal: 50,
    textAlign: "center",
  },
  text: {
    fontSize: 20,
  },
  nextButtonText: {
    color: "black",
    fontWeight: "600",
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: Colors.BUTTON_GRAY,
    padding: 10,
    paddingHorizontal: 20,
    marginBottom: 100,
    borderRadius: 10,
  },
});

export default StarRating;
