import Colors from "@/Constants/Colors";
import { useFocusEffect } from "@react-navigation/native";
import { Account, Databases, Query } from "appwrite";
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import ID from "../../Constants/ID";
import { client } from "../../appwrite";
import BookStatusCount from "../BookStatusCount";

const databases = new Databases(client);

const StatisticsTab = () => {
  const [loading, setLoading] = React.useState(true); // State variable to track loading status
  async function getBookInfo(book_id: string) {
    const bookInfo = [];
    const account = new Account(client);
    let user_id;
    try {
      user_id = (await account.get()).$id;
    } catch (error: any) {
      console.warn(
        "An unknown error occurred attempting to fetch user details.",
      );
      return bookInfo;
    }
    const book_document = await databases.getDocument(
      ID.mainDBID,
      ID.bookCollectionID,
      book_id,
    );
    if (book_document) {
      bookInfo.push({
        id: book_document.$id,
        title: book_document.title,
        author: book_document.authors[0].name,
        image_url: book_document.editions[0].thumbnail_url,
      });
    }
    return bookInfo;
  }

  const [activity, setActivity] = React.useState([]);
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const account = new Account(client);
          const response = await account.get();
          const user_id = response.$id;

          const databases = new Databases(client);
          const queryResponse = await databases.listDocuments(
            ID.mainDBID,
            ID.bookStatusCollectionID,
            [Query.equal("user_id", user_id)],
          );

          const documents = queryResponse.documents.filter(
            (doc) => doc.status === "READ",
          );

          const updatedActivity = await Promise.all(
            documents.map(async (document) => {
              const bookInfo = await getBookInfo(document.book.$id);
              return {
                key: document.$id,
                status: document.status,
                username: document.user_id,
                book: bookInfo[0],
                timestamp: document.$createdAt,
              };
            }),
          );

          setActivity(updatedActivity);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setLoading(false);
        }
      };

      fetchData();
    }, []),
  );

  const authorsRead = activity.reduce((acc, cur) => {
    const author = cur.book.author;
    acc[author] = (acc[author] || 0) + 1;
    return acc;
  }, {});

  const sortedAuthors = Object.entries(authorsRead).sort(
    (a, b) => Number(b[1]) - Number(a[1]),
  );

  const mostReadAuthor = sortedAuthors.length > 0 ? sortedAuthors[0][0] : null;

  const bookCounts = Array(12).fill(0);

  activity.forEach((cur) => {
    const monthIndex = new Date(cur.timestamp).getMonth();
    bookCounts[monthIndex]++;
  });

  const datasets = [
    {
      data: bookCounts,
    },
  ];
  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const data = {
    labels: labels,
    datasets: datasets,
  };

  return (
    <View style={{ alignItems: "center", paddingTop: 20 }}>
      <Text style={{ fontSize: 25 }}>Your Stats</Text>
      {loading && (
        <ActivityIndicator
          size="large"
          color={Colors.BUTTON_PURPLE}
          style={{ marginTop: 50 }}
        />
      )}
      {!loading && (
        <>
          <View
            style={{
              flexDirection: "row",
              paddingTop: 10,
              paddingBottom: 10,
              width: "100%",
            }}
          >
            <TouchableOpacity activeOpacity={1}>
              <Text style={{ margin: 10, fontSize: 22 }}>
                Books Read by Month:
              </Text>
              <View>
                {labels.map((month, index) => (
                  <Text
                    style={{ margin: 10, marginBottom: -4, fontSize: 15 }}
                    key={month}
                  >{`${month}: ${bookCounts[index]} books`}</Text>
                ))}
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingTop: 10,
              paddingBottom: 10,
              width: "100%",
            }}
          >
            <TouchableOpacity activeOpacity={1}>
              <Text style={{ margin: 10, fontSize: 20 }}>
                Most Read Author: {mostReadAuthor}
              </Text>
            </TouchableOpacity>
          </View>
          <BarChart
            style={{ marginTop: 20, marginLeft: -30 }}
            width={Dimensions.get("window").width - 50}
            height={400}
            yAxisLabel=""
            yAxisSuffix=" books"
            data={data}
            verticalLabelRotation={90}
            chartConfig={{
              backgroundColor: "#FFFFFF",
              backgroundGradientFrom: "#FFFFFF",
              backgroundGradientTo: "#FFFFFF",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              barPercentage: 0.5,
              propsForLabels: {
                fontSize: 10,
              },
            }}
          />
          <BookStatusCount></BookStatusCount>
        </>
      )}
    </View>
  );
};

export default StatisticsTab;
