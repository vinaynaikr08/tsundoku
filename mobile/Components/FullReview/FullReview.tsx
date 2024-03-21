import Colors from "@/Constants/Colors";
import { BookInfoWrapperContext } from "@/Contexts";
import * as React from "react";
import { useContext } from "react";
import { Text, View, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Divider } from "react-native-paper";
import FontAwesome from "react-native-vector-icons/FontAwesome";

function FullReview({ route }) {
  const bookInfo = useContext(BookInfoWrapperContext);
  const { review } = route.params;
  const rating = review.rating / 4;

  return (
    <ScrollView>
      <Text style={styles.title}>Review by {review.username}</Text>
      <Text style={styles.bookTitle}>{bookInfo.title}</Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          gap: 5,
          marginVertical: 10,
        }}
      >
        <Text style={{ fontSize: 20 }}>{rating}</Text>
        <FontAwesome name={"star"} color={Colors.BUTTON_PURPLE} size={25} />
      </View>
      <Divider bold={true} horizontalInset={true} />
      <Text style={{ margin: 15 }}>{review.desc}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 30,
    textAlign: "center",
    paddingHorizontal: 10,
    marginTop: 30,
  },
  bookTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginHorizontal: 40,
    textAlign: "center",
    paddingHorizontal: 10,
    marginTop: 10,
    color: Colors.BUTTON_PURPLE,
  },
});

export default FullReview;
