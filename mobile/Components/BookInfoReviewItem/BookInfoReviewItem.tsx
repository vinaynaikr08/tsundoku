import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import useSWR from "swr";
import Colors from "@/Constants/Colors";
import Dimensions from "@/Constants/Dimensions";
import Backend from "@/Backend";

const backend = new Backend();

enum Vote {
  UPVOTE = "UPVOTE",
  DOWNVOTE = "DOWNVOTE",
  NONE = "NONE",
}

export const BookInfoReviewItem = ({ navigation, review_id }) => {
  const reviewSWR = useSWR(
    { func: backend.getReview, arg: review_id },
    backend.swrFetcher,
  );
  const reviewVoteSWR = useSWR(
    { func: backend.getReviewVotes, arg: review_id },
    backend.swrFetcher,
  );

  const [userVote, setUserVote] = React.useState<Vote>(Vote.NONE);
  const [upvotes, setUpvotes] = React.useState<number | null>(null);
  const [downvotes, setDownvotes] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (reviewVoteSWR.data) {
      if ("user_voted" in reviewVoteSWR.data) {
        setUserVote(reviewVoteSWR.data.user_voted);
      } else {
        setUserVote(Vote.NONE);
      }

      setUpvotes(reviewVoteSWR.data.upvotes);
      setDownvotes(reviewVoteSWR.data.downvotes);
    }
  }, [reviewVoteSWR.data]);

  if (reviewSWR.isLoading || reviewVoteSWR.isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: "white", margin: 30, alignItems: "center" }}>
        <View style={{ flexDirection: "row" }}>
          <Text>Loading review... </Text>
          <ActivityIndicator />
        </View>
      </View>
    );
  }

  const voteReview = async (type: Vote) => {
    if (type === Vote.UPVOTE) {
      if (userVote === Vote.DOWNVOTE) {
        setDownvotes(downvotes! - 1);
      }
      setUpvotes(upvotes! + 1);
    } else if (type === Vote.DOWNVOTE) {
      if (userVote === Vote.UPVOTE) {
        setUpvotes(upvotes! - 1);
      }
      setDownvotes(downvotes! + 1);
    } else if (type === Vote.NONE) {
      if (userVote === Vote.UPVOTE) {
        setUpvotes(upvotes! - 1);
      } else if (userVote === Vote.DOWNVOTE) {
        setDownvotes(downvotes! - 1);
      }
    }

    setUserVote(type);

    try {
      await backend.voteOnReview({ review_id, vote: type });
      reviewVoteSWR.mutate();
    } catch (error) {
      console.error("Error voting: ", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => navigation.navigate("bookInfoFullReview", { review_id })}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ marginRight: 10 }}>
            <Ionicons name={"person-circle"} color={"grey"} size={60} />
          </View>
          <View style={{ marginRight: 10 }}>
            <Text style={{ fontSize: 20, marginBottom: 5 }}>
              {reviewSWR.data.username}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {createStars(reviewSWR.data.star_rating / 4, 30)}
            </View>
          </View>
        </View>
        <ReviewTextBlurb text={reviewSWR.data.description} />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 30,
          }}
        >
          <TouchableOpacity
            onPress={async () => {
              await voteReview(
                userVote === Vote.UPVOTE ? Vote.NONE : Vote.UPVOTE,
              );
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 10,
              }}
            >
              <FontAwesome
                name={userVote === Vote.UPVOTE ? "thumbs-up" : "thumbs-o-up"}
                color={userVote === Vote.UPVOTE ? Colors.BUTTON_PURPLE : "grey"}
                size={30}
              />
              <Text style={{ marginLeft: 5 }}>{upvotes || 0}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              await voteReview(
                userVote === Vote.DOWNVOTE ? Vote.NONE : Vote.DOWNVOTE,
              );
            }}
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
                  userVote === Vote.DOWNVOTE ? "thumbs-down" : "thumbs-o-down"
                }
                color={
                  userVote === Vote.DOWNVOTE ? Colors.BUTTON_PURPLE : "grey"
                }
                size={30}
              />
              <Text style={{ marginLeft: 5 }}>{downvotes || 0}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
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

function ReviewTextBlurb({ text }: { text: string }) {
  if (text.length > 200) {
    return (
      <>
        <Text
          style={{
            fontSize: 15,
            margin: Dimensions.BOOK_INFO_MODAL_SUMMARY_MARGIN,
          }}
        >
          {text.substring(0, 200)}...
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
        {text}
      </Text>
    );
  }
}

export default BookInfoReviewItem;
