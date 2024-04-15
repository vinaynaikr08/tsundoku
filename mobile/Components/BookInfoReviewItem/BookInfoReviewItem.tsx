import { BACKEND_API_URL } from "@/Constants/URLs";
import { client } from "@/appwrite";
import { Account, Databases } from "appwrite";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import useSWR from "swr";
import Colors from "../../Constants/Colors";
import Dimensions from "../../Constants/Dimensions";

const account = new Account(client);
const databases = new Databases(client);

export const BookInfoReviewItem = ({ bookInfo, navigation, item, index }) => {
  const { data, error, isLoading } = useSWR(bookInfo.id);
  const initialThumbsUpClicked = item.userVote === "UPVOTE";
  const initialThumbsDownClicked = item.userVote === "DOWNVOTE";
  const [thumbsUpClicked, setThumbsUpClicked] = useState(
    initialThumbsUpClicked,
  );
  const [thumbsDownClicked, setThumbsDownClicked] = useState(
    initialThumbsDownClicked,
  );

  const [upvotes, setUpvotes] = useState(item.upvotes || 0);
  const [downvotes, setDownvotes] = useState(item.downvotes || 0);

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
        if (response.status != 404)
          console.error("Voting failed:", await response.json());
        if (vote === "UPVOTE") {
          setUpvotes(upvotes + 1);
        } else if (vote === "DOWNVOTE") {
          setDownvotes(downvotes + 1);
        }
        return;
      }
      if (vote === "UPVOTE") {
        setUpvotes(upvotes + 1);
      } else if (vote === "DOWNVOTE") {
        setDownvotes(downvotes + 1);
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  useEffect(() => {
    setUpvotes(item.upvotes || 0);
    setDownvotes(item.downvotes || 0);

    if (item.userVote === "UPVOTE") {
      setThumbsUpClicked(true);
      setThumbsDownClicked(false);
    } else if (item.userVote === "DOWNVOTE") {
      setThumbsUpClicked(false);
      setThumbsDownClicked(true);
    } else {
      setThumbsUpClicked(false);
      setThumbsDownClicked(false);
    }
  }, [item]);

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
        if (response.status != 404)
          console.error("unvote failed:", await response.json());
        if (vote === "UPVOTE") {
          setUpvotes(upvotes - 1);
        } else if (vote === "DOWNVOTE") {
          setDownvotes(downvotes - 1);
        }
        return;
      }
      if (vote === "UPVOTE") {
        setUpvotes(upvotes - 1);
      } else if (vote === "DOWNVOTE") {
        setDownvotes(downvotes - 1);
      }
    } catch (error) {
      console.error("Error unvoting:", error);
    }
  };

  const handleThumbsUpClick = async (reviewId: string, index: number) => {
    const newThumbsUpClicked = !thumbsUpClicked;
    setThumbsUpClicked(newThumbsUpClicked);

    if (thumbsDownClicked) {
      setThumbsDownClicked(false);
      await handleUnvote(reviewId, "DOWNVOTE");
    }

    if (newThumbsUpClicked) {
      await handleVote(reviewId, "UPVOTE");
    } else {
      await handleUnvote(reviewId, "UPVOTE");
    }
  };

  const handleThumbsDownClick = async (reviewId: string, index: number) => {
    const newThumbsDownClicked = !thumbsDownClicked;
    setThumbsDownClicked(newThumbsDownClicked);

    if (thumbsUpClicked) {
      setThumbsUpClicked(false);
      await handleUnvote(reviewId, "UPVOTE");
    }

    if (newThumbsDownClicked) {
      await handleVote(reviewId, "DOWNVOTE");
    } else {
      await handleUnvote(reviewId, "DOWNVOTE");
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
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() =>
          navigation.navigate("bookInfoFullReview", { review: item })
        }
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ marginRight: 10 }}>
            <Ionicons name={"person-circle"} color={"grey"} size={60} />
          </View>
          <View style={{ marginRight: 10 }}>
            <Text style={{ fontSize: 20, marginBottom: 5 }}>
              {item.username}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
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
          <TouchableOpacity onPress={() => handleThumbsUpClick(item.id, index)}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 10,
              }}
            >
              <FontAwesome
                name={thumbsUpClicked ? "thumbs-up" : "thumbs-o-up"}
                color={thumbsUpClicked ? Colors.BUTTON_PURPLE : "grey"}
                size={30}
              />
              <Text style={{ marginLeft: 5 }}>{upvotes || 0}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleThumbsDownClick(item.id, index)}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 20,
              }}
            >
              <FontAwesome
                name={thumbsDownClicked ? "thumbs-down" : "thumbs-o-down"}
                color={thumbsDownClicked ? Colors.BUTTON_PURPLE : "grey"}
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

export default BookInfoReviewItem;
