import ID from "@/Constants/ID";
import { BACKEND_API_URL } from "@/Constants/URLs";
import { client } from "@/appwrite";
import { Account, Databases, Query } from "appwrite";
import React from "react";
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
import BookInfoReviewItem from "../BookInfoReviewItem";

const account = new Account(client);
const databases = new Databases(client);

interface Review {
  rating: number;
  desc: string;
  username: string;
  id: string;
  user_id: string;
  upvotes: number;
  downvotes: number;
}

async function getReviews(book_id: string): Promise<Review[]> {
  const reviews = [];
  const documents = (
    await databases.listDocuments(ID.mainDBID, ID.reviewsCollectionID, [
      Query.equal("book", book_id),
    ])
  ).documents;

  for (const document of documents) {
    try {
      const [review_data, votesData] = await Promise.all([
        databases.getDocument(
          ID.mainDBID,
          ID.reviewsCollectionID,
          document.$id,
        ),
        fetchVotesData(document.$id),
      ]);

      const response = await fetchUserData(review_data.user_id as string);

      const name: string = (response.name as string) || "Anonymous";
      const upvotes: number = votesData.upvotes || 0;
      const downvotes: number = votesData.downvotes || 0;
      // console.log(upvotes);
      const review = {
        rating: review_data.star_rating as number,
        desc: review_data.description as string,
        username: name,
        id: document.$id,
        user_id: review_data.user_id as string,
        upvotes,
        downvotes,
      };

      reviews.push(review);
    } catch (error) {
      console.error("Error fetching review:", error);
    }
  }
  return reviews;
}

async function fetchUserData(userId: string): Promise<unknown> {
  const response = await fetch(`${BACKEND_API_URL}/v0/users/${userId}/name`, {
    method: "GET",
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + (await account.createJWT()).jwt,
    }),
  });
  return response.json();
}

async function fetchVotesData(reviewId: string) {
  try {
    const votesResponse = await fetch(
      `${BACKEND_API_URL}/v0/reviews/${reviewId}/vote`,
      {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: "Bearer " + (await account.createJWT()).jwt,
        }),
      },
    );
    // console.log(votesResponse.json);
    if (!votesResponse.ok) {
      if (votesResponse.status == 404) return 0;
      console.error(await votesResponse.json());
    }

    return votesResponse.json();
  } catch (error) {
    console.error("Error fetching votes data:", error);
    return [];
  }
}

export const BookInfoModalReview = ({ bookInfo, navigation }) => {
  const { data, error, isLoading, mutate } = useSWR(bookInfo.id, getReviews);
  const [averageRating, setAverageRating] = React.useState(0);

  React.useEffect(() => {
    if (!isLoading && data) {
      let totalRating = 0;
      data.forEach((review) => {
        totalRating += review.rating;
      });
      const avgRating = totalRating / data.length;
      setAverageRating(avgRating);
    }
  }, [data, isLoading]);

  const handleVote = async (reviewId: string, vote: string) => {
    try {
      const jwt = (await account.createJWT()).jwt;
      const response = await fetch(
        `${BACKEND_API_URL}/v0/reviews/${reviewId}/vote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({ vote }),
        },
      );

      if (!response.ok) {
        console.error("Voting failed:", await response.json());
        return;
      }

      // If vote was successful, update the state or trigger a re-fetch of reviews
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const [thumbsUpClicked, setThumbsUpClicked] = React.useState([]);
  const [thumbsDownClicked, setThumbsDownClicked] = React.useState([]);

  const handleThumbsUpClick = async (reviewId: string, index: number) => {
    const newThumbsUpClicked = [...thumbsUpClicked];
    newThumbsUpClicked[index] = !newThumbsUpClicked[index];
    setThumbsUpClicked(newThumbsUpClicked);

    if (newThumbsUpClicked[index]) {
      await handleVote(reviewId, "UPVOTE");
    } else {
      await handleUnvote(reviewId, "UPVOTE");
    }

    if (thumbsDownClicked[index]) {
      const newThumbsDownClicked = [...thumbsDownClicked];
      newThumbsDownClicked[index] = false;
      setThumbsDownClicked(newThumbsDownClicked);
      await handleUnvote(reviewId, "DOWNVOTE");
    }
  };

  const handleThumbsDownClick = async (reviewId: string, index: number) => {
    const newThumbsDownClicked = [...thumbsDownClicked];
    newThumbsDownClicked[index] = !newThumbsDownClicked[index];
    setThumbsDownClicked(newThumbsDownClicked);

    if (newThumbsDownClicked[index]) {
      await handleVote(reviewId, "DOWNVOTE");
    } else {
      await handleUnvote(reviewId, "DOWNVOTE");
    }

    if (thumbsUpClicked[index]) {
      const newThumbsUpClicked = [...thumbsUpClicked];
      newThumbsUpClicked[index] = false;
      setThumbsUpClicked(newThumbsUpClicked);
      await handleUnvote(reviewId, "UPVOTE");
    }
  };

  const handleUnvote = async (reviewId: string, vote: string) => {
    try {
      const jwt = (await account.createJWT()).jwt;
      const response = await fetch(
        `${BACKEND_API_URL}/v0/reviews/${reviewId}/vote`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        },
      );
      if (!response.ok) {
        console.error("unvote failed:", await response.json());
        return;
      }

      console.log(`Unvoting ${vote} for review ${reviewId}`);
    } catch (error) {
      console.error("Error unvoting:", error);
    }
  };

  const renderReviewDescription = (desc: string) => {
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
              <BookInfoReviewItem
                bookInfo={bookInfo}
                navigation={navigation}
                item={item}
                index={index}
              />
              // <View style={{ flex: 1 }}>
              //   <TouchableOpacity
              //     activeOpacity={1}
              //     onPress={() =>
              //       navigation.navigate("bookInfoFullReview", { review: item })
              //     }
              //   >
              //     <View style={{ flexDirection: "row", alignItems: "center" }}>
              //       <View style={{ marginRight: 10 }}>
              //         <Ionicons
              //           name={"person-circle"}
              //           color={"grey"}
              //           size={60}
              //         />
              //       </View>
              //       <View style={{ marginRight: 10 }}>
              //         <Text style={{ fontSize: 20, marginBottom: 5 }}>
              //           {item.username}
              //         </Text>
              //         <View
              //           style={{ flexDirection: "row", alignItems: "center" }}
              //         >
              //           {createStars(item.rating / 4, 30)}
              //         </View>
              //       </View>
              //     </View>
              //     {renderReviewDescription(item.desc)}
              //     <View
              //       style={{
              //         flexDirection: "row",
              //         alignItems: "center",
              //         marginBottom: 30,
              //       }}
              //     >
              //       <TouchableOpacity
              //         onPress={() => handleThumbsUpClick(item.id, index)}
              //       >
              //         <View
              //           style={{
              //             flexDirection: "row",
              //             alignItems: "center",
              //             marginLeft: 10,
              //           }}
              //         >
              //           <FontAwesome
              //             name={
              //               thumbsUpClicked[index] ? "thumbs-up" : "thumbs-o-up"
              //             }
              //             color={
              //               thumbsUpClicked[index]
              //                 ? Colors.BUTTON_PURPLE
              //                 : "grey"
              //             }
              //             size={30}
              //           />
              //           <Text style={{ marginLeft: 5 }}>
              //             {item.upvotes || 0}
              //           </Text>
              //         </View>
              //       </TouchableOpacity>
              //       <TouchableOpacity
              //         onPress={() => handleThumbsDownClick(item.id, index)}
              //       >
              //         <View
              //           style={{
              //             flexDirection: "row",
              //             alignItems: "center",
              //             marginLeft: 20,
              //           }}
              //         >
              //           <FontAwesome
              //             name={
              //               thumbsDownClicked[index]
              //                 ? "thumbs-down"
              //                 : "thumbs-o-down"
              //             }
              //             color={
              //               thumbsDownClicked[index]
              //                 ? Colors.BUTTON_PURPLE
              //                 : "grey"
              //             }
              //             size={30}
              //           />
              //           <Text style={{ marginLeft: 5 }}>
              //             {item.downvotes || 0}
              //           </Text>
              //         </View>
              //       </TouchableOpacity>
              //     </View>
              //   </TouchableOpacity>
              // </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

function createStars(rating: number, size: number) {
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
