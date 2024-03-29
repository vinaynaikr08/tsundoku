import ID from "@/Constants/ID";
import { BACKEND_API_URL } from "@/Constants/URLs";
import { client } from "@/appwrite";
import { Account, Databases, Query } from "appwrite";
import * as React from "react";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import useSWR from "swr";
import Colors from "../../Constants/Colors";
import Dimensions from "../../Constants/Dimensions";

const account = new Account(client);
const databases = new Databases(client);
let avgRating = 0;

async function getReviews(book_id: string) {
  const reviews = [];
  avgRating = 0;
  const documents = (
    await databases.listDocuments(ID.mainDBID, ID.reviewsCollectionID, [
      Query.equal("book", book_id),
    ])
  ).documents;

  for (const document of documents) {
    const review_data = await databases.getDocument(
      ID.mainDBID,
      ID.reviewsCollectionID,
      document.$id,
    );
    avgRating += review_data.star_rating;
    const response = await fetch(
      `${BACKEND_API_URL}/v0/users/${review_data.user_id}/name`,
      {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: "Bearer " + (await account.createJWT()).jwt,
        }),
      },
    );
    const res_json = await response.json();
    if (res_json.name === undefined) {
      console.log(`Warning: the user with ID ${review_data.user_id} was not found in the system, possibly because the username was not set.`)
    }
    const name = res_json.name || "Anonymous";

    const review = {
      rating: review_data.star_rating,
      desc: review_data.description,
      username: name,
      id: document.$id,
      user_id: review_data.user_id,
    };

    reviews.push(review);
  }

  avgRating = avgRating / reviews.length;

  return reviews;
}

export const BookInfoModalReview = ({ bookInfo, navigation }) => {
  const { data, error, isLoading } = useSWR(bookInfo.id, getReviews);

  const [thumbsUpClicked, setThumbsUpClicked] = useState(false);
  const [thumbsDownClicked, setThumbsDownClicked] = useState(false);

  const handleThumbsUpClick = () => {
    setThumbsUpClicked(!thumbsUpClicked);
    if (thumbsDownClicked) {
      setThumbsDownClicked(false);
    }
  };
  const handleThumbsDownClick = () => {
    setThumbsDownClicked(!thumbsDownClicked);
    if (thumbsUpClicked) {
      setThumbsUpClicked(false);
    }
  };

  const renderReviewDescription = (desc) => {
    if (desc.length > 200) {
      return (
        <>
          <Text
            style={{
              fontSize: 15,
              margin: Dimensions.BOOK_INFO_MODAL_SUMMARY_MARGIN,
            }}
          >
            {desc.substring(0, 200)}...
            <Text style={{ color: "#a3a3a3" }}> Read more</Text>
          </Text>
        </>
      );
    } else {
      return (
        <Text
          style={{
            fontSize: 15,
            margin: Dimensions.BOOK_INFO_MODAL_SUMMARY_MARGIN,
          }}
        >
          {desc}
        </Text>
      );
    }
  };

  if (isLoading || !data) {
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
            keyExtractor={(item) => item.username}
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
                  Overall Rating: {(avgRating / 4).toFixed(2)}
                </Text>
                <FontAwesome
                  name={"star"}
                  color={Colors.BUTTON_PURPLE}
                  size={25}
                />
              </View>
            )}
            renderItem={({ item }) => (
              <View style={{ flex: 1 }}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() =>
                    navigation.navigate("bookInfoFullReview", { review: item })
                  }
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={{ marginRight: 10 }}>
                      <Ionicons
                        name={"person-circle"}
                        color={"grey"}
                        size={60}
                      />
                    </View>
                    <View style={{ marginRight: 10 }}>
                      <Text style={{ fontSize: 20, marginBottom: 5 }}>
                        {item.username}
                      </Text>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        {createStars(item.rating / 4, 30)}
                      </View>
                    </View>
                  </View>
                  {renderReviewDescription(item.desc)}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 30,
                    }}
                  >
                    <TouchableOpacity onPress={handleThumbsUpClick}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginLeft: 10,
                          marginTop: 10,
                        }}
                      >
                        <FontAwesome
                          name={thumbsUpClicked ? "thumbs-up" : "thumbs-o-up"}
                          color={
                            thumbsUpClicked ? Colors.BUTTON_PURPLE : "grey"
                          }
                          size={30}
                        />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleThumbsDownClick}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginLeft: 20,
                        }}
                      >
                        <FontAwesome
                          name={
                            thumbsDownClicked ? "thumbs-down" : "thumbs-o-down"
                          }
                          color={
                            thumbsDownClicked ? Colors.BUTTON_PURPLE : "grey"
                          }
                          size={30}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

function createStars(rating, size) {
  const stars = [];

  for (let i = 0; i < 5; i++) {
    stars.push(
      <View key={i} style={{ marginRight: 3 }}>
        {i < rating ? (
          <FontAwesome name={"star"} color={Colors.BUTTON_PURPLE} size={size} />
        ) : (
          <FontAwesome
            name={"star-o"}
            color={Colors.BUTTON_PURPLE}
            size={size}
          />
        )}
      </View>,
    );
  }
  return stars;
}

export default BookInfoModalReview;

const styles = StyleSheet.create({
  scrollViewStyle: {
    paddingBottom: 330,
    marginBottom: 100,
    paddingHorizontal: 5,
    backgroundColor: "white",
  },
});
