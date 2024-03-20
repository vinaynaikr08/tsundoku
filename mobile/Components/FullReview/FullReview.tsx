import { BookInfoWrapperContext } from "@/Contexts";
import * as React from "react";
import { useContext } from "react";
import { Text, View } from "react-native";

function FullReview() {
  const bookInfo = useContext(BookInfoWrapperContext);

  return (
    <View>
      <Text>reviews for {bookInfo.title}</Text>
    </View>
  );
}

export default FullReview;
