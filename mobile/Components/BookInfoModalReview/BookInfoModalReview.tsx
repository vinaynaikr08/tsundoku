import Colors from "@/Constants/Colors";
import ID from "@/Constants/ID";
import { BACKEND_API_URL } from "@/Constants/URLs";
import { client } from "@/appwrite";
import { Account, Databases, Query } from "appwrite";
import React from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import useSWR from "swr";
import BookInfoReviewItem from "../BookInfoReviewItem";
import { useFocusEffect } from "@react-navigation/native";

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
  userVote: string;
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

      const name: string = response.name ?? "Anonymous";
      const upvotes: number = votesData ? votesData.results.upvotes : 0;
      const downvotes: number = votesData ? votesData.results.downvotes : 0;
      const userVote: string = votesData ? votesData.results.user_voted : "";
      const review = {
        rating: review_data.star_rating as number,
        desc: review_data.description as string,
        username: name,
        id: document.$id,
        user_id: review_data.user_id as string,
        upvotes,
        downvotes,
        userVote,
      };

      reviews.push(review);
    } catch (error) {
      console.error("Error fetching review:", error);
    }
  }
  return reviews;
}

interface UserDataResponse {
  name: string | undefined;
}

async function fetchUserData(userId: string): Promise<UserDataResponse> {
  const response = await fetch(`${BACKEND_API_URL}/v0/users/${userId}/name`, {
    method: "GET",
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + (await account.createJWT()).jwt,
    }),
  });
  return response.json() as unknown as UserDataResponse;
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

    if (!votesResponse.ok) {
      if (votesResponse.status == 404) return null;
      console.error(await votesResponse.json());
    }

    return votesResponse.json();
  } catch (error) {
    console.error("Error fetching votes data:", error);
    return null;
  }
}

export const BookInfoModalReview = ({ bookInfo, navigation }) => {
  const { data, error, isLoading, mutate } = useSWR(bookInfo.id, getReviews);
  const [averageRating, setAverageRating] = React.useState(0);

  useFocusEffect(
    React.useCallback(() => {
      mutate();
    }, [mutate]),
  );

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
            renderItem={({ item }) => (
              <BookInfoReviewItem
                bookInfo={bookInfo}
                navigation={navigation}
                item={item}
              />
            )}
          />
        </View>
      )}
    </View>
  );
};

export default BookInfoModalReview;
