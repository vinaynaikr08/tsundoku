import ID from "@/Constants/ID";
import { BACKEND_API_URL } from "@/Constants/URLs";
import { client } from "@/appwrite";
import { Account, Databases, Query } from "appwrite";
import * as React from "react";
import { useEffect, useState } from "react";
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
import useSWR, { mutate } from "swr";
import Colors from "../../Constants/Colors";
import Dimensions from "../../Constants/Dimensions";

const account = new Account(client);
const databases = new Databases(client);

async function getReviews(book_id: string) {
  const reviews = [];
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
    // console.log(review_data);
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
    const votesResponse = await fetch(
      `${BACKEND_API_URL}/v0/reviews/${document.$id}/vote`,
      {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: "Bearer " + (await account.createJWT()).jwt,
        }),
      },
    );
    const votesData = await votesResponse.json();
    const upvotes = votesData.filter((vote) => vote.vote === "UPVOTE").length;
    const downvotes = votesData.filter(
      (vote) => vote.vote === "DOWNVOTE",
    ).length;

    const res_json = await response.json();
    // console.log(res_json);
    if (res_json.name === undefined) {
      console.log(
        `Warning: the user with ID ${review_data.user_id} was not found in the system, possibly because the username was not set.`,
      );
    }
    const name = res_json.name || "Anonymous";
    const review = {
      rating: review_data.star_rating,
      desc: review_data.description,
      username: name,
      id: document.$id,
      user_id: review_data.user_id,
      upvotes,
      downvotes,
    };

    reviews.push(review);
  }
  return reviews;
}

export const BookInfoModalReview = ({ bookInfo, navigation }) => {
  const { data, error, isLoading } = useSWR(bookInfo.id, getReviews);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    if (!isLoading && data) {
      let totalRating = 0;
      data.forEach((review) => {
        totalRating += review.rating;
      });
      const avgRating = totalRating / data.length;
      setAverageRating(avgRating);
    }
  }, [data, isLoading]);

  const [thumbsUpClicked, setThumbsUpClicked] = useState([]);
  const [thumbsDownClicked, setThumbsDownClicked] = useState([]);

  const handleThumbsUpClick = async (index: number) => {
    const newThumbsUpClicked = [...thumbsUpClicked];
    // data[index].upvotes++;
    newThumbsUpClicked[index] = !newThumbsUpClicked[index];
    if (newThumbsUpClicked[index] && thumbsDownClicked[index]) {
      setThumbsDownClicked((prev) => {
        const newThumbsDownClicked = [...prev];
        newThumbsDownClicked[index] = false;
        // data[index].upvotes--;
        return newThumbsDownClicked;
      });
    }
    setThumbsUpClicked(newThumbsUpClicked);
    // const reviewId = data[index].id;
    // try {
    //   const res = await fetch(`${BACKEND_API_URL}/reviews/${reviewId}/vote`, {
    //     method: "POST",
    //     headers: new Headers({
    //       "Content-Type": "application/json",
    //       Authorization: "Bearer " + (await account.createJWT()).jwt,
    //     }),
    //     body: JSON.stringify({ vote: "UPVOTE" }),
    //   });
    //   if (res.ok) {
    //     const updatedData = [...data];
    //     updatedData[index].upvotes++;

    //     setThumbsUpClicked((prevThumbsUpClicked) => {
    //       const newThumbsUpClicked = [...prevThumbsUpClicked];
    //       newThumbsUpClicked[index] = true;
    //       return newThumbsUpClicked;
    //     });

    //     mutate(bookInfo.id, updatedData, false);
    //   } else {
    //     // Handle error
    //   }
    // } catch (error) {
    //   console.error("Error casting vote:", error);
    // }
  };

  const handleThumbsDownClick = async (index: number) => {
    const newThumbsDownClicked = [...thumbsDownClicked];
    newThumbsDownClicked[index] = !newThumbsDownClicked[index];
    if (newThumbsDownClicked[index] && thumbsUpClicked[index]) {
      setThumbsUpClicked((prev) => {
        const newThumbsUpClicked = [...prev];
        newThumbsUpClicked[index] = false;
        return newThumbsUpClicked;
      });
    }
    setThumbsDownClicked(newThumbsDownClicked);
    // const reviewId = data[index].id;
    // try {
    //   const res = await fetch(`${BACKEND_API_URL}/reviews/${reviewId}/vote`, {
    //     method: "POST",
    //     headers: new Headers({
    //       "Content-Type": "application/json",
    //       Authorization: "Bearer " + (await account.createJWT()).jwt,
    //     }),
    //     body: JSON.stringify({ vote: "DOWNVOTE" }),
    //   });
    //   if (res.ok) {
    //     const updatedData = [...data];
    //     updatedData[index].downvotes++; // Increment downvotes locally
    //     setThumbsDownClicked((prev) => {
    //       const newThumbsDownClicked = [...prev];
    //       newThumbsDownClicked[index] = true;
    //       return newThumbsDownClicked;
    //     });
    //     mutate(bookInfo.id, updatedData, false);
    //   } else {
    //     // Handle error
    //   }
    // } catch (error) {
    //   console.error("Error casting vote:", error);
    // }
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
                  Overall Rating: {(averageRating / 4).toFixed(2)}
                </Text>
                <FontAwesome
                  name={"star"}
                  color={Colors.BUTTON_PURPLE}
                  size={25}
                />
              </View>
            )}
            renderItem={({ item, index }) => (
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
                    <TouchableOpacity
                      onPress={() => handleThumbsUpClick(index)}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginLeft: 10,
                        }}
                      >
                        <FontAwesome
                          name={
                            thumbsUpClicked[index] ? "thumbs-up" : "thumbs-o-up"
                          }
                          color={
                            thumbsUpClicked[index]
                              ? Colors.BUTTON_PURPLE
                              : "grey"
                          }
                          size={30}
                        />
                        <Text style={{ marginLeft: 5 }}>
                          {item.upvotes || 0}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleThumbsDownClick(index)}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginLeft: 20,
                        }}
                      >
                        <FontAwesome
                          name={
                            thumbsDownClicked[index]
                              ? "thumbs-down"
                              : "thumbs-o-down"
                          }
                          color={
                            thumbsDownClicked[index]
                              ? Colors.BUTTON_PURPLE
                              : "grey"
                          }
                          size={30}
                        />
                        <Text style={{ marginLeft: 5 }}>
                          {item.downvotes || 0}
                        </Text>
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
