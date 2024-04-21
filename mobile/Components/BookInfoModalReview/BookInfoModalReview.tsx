import Backend from "@/Backend";
import Colors from "@/Constants/Colors";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import useSWR from "swr";
import BookInfoReviewItem from "../BookInfoReviewItem";

const backend = new Backend();

export const BookInfoModalReview = ({ bookInfo, navigation }) => {
  const { data, isLoading, mutate } = useSWR(
    { func: backend.getReviews, arg: bookInfo.id },
    backend.swrFetcher,
  );
  const [averageRating, setAverageRating] = React.useState(0);

  useFocusEffect(
    React.useCallback(() => {
      mutate();
    }, [mutate]),
  );

  React.useEffect(() => {
    if (data) {
      let totalRating = 0;
      data.forEach((review_doc: any) => {
        totalRating += review_doc.star_rating;
      });
      const avgRating = totalRating / data.length;
      setAverageRating(avgRating);
    }
  }, [data]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {data.length === 0 ? (
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            margin: 30,
            color: "grey",
          }}
        >
          No Reviews
        </Text>
      ) : (
        <View style={{ flex: 1, paddingBottom: 330 }}>
          <FlatList
            data={data}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.$id}
            ListHeaderComponent={() => (
              <View
                style={{
                  flexDirection: "row",
                  marginVertical: 30,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", marginRight: 5 }}
                >
                  Overall Rating: {(averageRating / 4).toFixed(2)}
                </Text>
                <FontAwesome
                  name={"star"}
                  color={Colors.BUTTON_PURPLE}
                  size={25}
                />
              </View>
            )}
            renderItem={({ item }) => (
              <BookInfoReviewItem
                navigation={navigation}
                review_id={item.$id}
              />
            )}
          />
        </View>
      )}
    </View>
  );
};

export default BookInfoModalReview;
