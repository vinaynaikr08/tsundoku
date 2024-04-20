import Colors from "@/Constants/Colors";
import { useFocusEffect } from "@react-navigation/native";
import { Account, Databases, Query } from "appwrite";
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import ID from "../../Constants/ID";
import { client } from "../../appwrite";
import BookStatusCount from "../BookStatusCount";
import Backend from "@/Backend";
import useSWR from "swr";

const databases = new Databases(client);
const backend = new Backend();

interface BookInfo {
  id: string;
  title: string;
  author: string;
  image_url: string;
}

interface ActivityData {
  key: string;
  status: string;
  username: string;
  book: BookInfo;
  timestamp: string;
}

const LABELS = [
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

async function getBookInfo(book_id: string): Promise<BookInfo | undefined> {
  const book_document = await databases.getDocument(
    ID.mainDBID,
    ID.bookCollectionID,
    book_id,
  );
  if (book_document) {
    return {
      id: book_document.$id,
      title: book_document.title,
      author: book_document.authors[0].name,
      image_url: book_document.editions[0].thumbnail_url,
    };
  }
  return undefined;
}

async function fetchData() {
  const user_id = await backend.getUserId();

  const queryResponse = await databases.listDocuments(
    ID.mainDBID,
    ID.bookStatusCollectionID,
    [Query.equal("user_id", user_id)],
  );

  const documents = queryResponse.documents.filter(
    (doc) => doc.status === "READ",
  );

  const activities = [];

  for (const document of documents) {
    const bookInfo = await getBookInfo(document.book.$id);

    if (bookInfo) {
      activities.push({
        key: document.$id,
        status: document.status,
        username: document.user_id,
        book: bookInfo,
        timestamp: document.$createdAt,
      });
    }
  }

  return activities;
}

const StatisticsTab = () => {
  const { data, error, isLoading, mutate } = useSWR(
    { func: fetchData, arg: null },
    backend.swrFetcher,
  );

  useFocusEffect(
    React.useCallback(() => {
      mutate();
    }, [mutate]),
  );

  if (isLoading) {
    return (
      <ActivityIndicator
        size="large"
        color={Colors.BUTTON_PURPLE}
        style={{ marginTop: 50 }}
      />
    );
  }

  const authorsRead = data.reduce((acc, cur) => {
    const author = cur.book.author;
    acc[author] = (acc[author] || 0) + 1;
    return acc;
  }, {});

  const sortedAuthors = Object.entries(authorsRead).sort(
    (a, b) => Number(b[1]) - Number(a[1]),
  );

  const mostReadAuthor = sortedAuthors.length > 0 ? sortedAuthors[0][0] : null;

  const bookCounts = Array(12).fill(0);

  data.forEach((activity: ActivityData) => {
    const monthIndex = new Date(activity.timestamp).getMonth();
    bookCounts[monthIndex]++;
  });

  const barchartData = {
    labels: LABELS,
    datasets: [{ data: bookCounts }],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Stats</Text>
      <View style={styles.content}>
        <TouchableOpacity activeOpacity={1}>
          <Text style={styles.readByMonthTitle}>Books Read by Month:</Text>
          <View>
            {LABELS.map((month, index) => (
              <Text
                style={styles.readByMonthEntries}
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
          <Text style={styles.mostReadAuthor}>
            Most Read Author: {mostReadAuthor}
          </Text>
        </TouchableOpacity>
      </View>
      <BarChart
        style={styles.barChart}
        width={Dimensions.get("window").width - 50}
        height={400}
        yAxisLabel=""
        yAxisSuffix=" books"
        data={barchartData}
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
    </View>
  );
};

export default StatisticsTab;

const styles = StyleSheet.create({
  container: { alignItems: "center", paddingTop: 20 },
  title: { fontSize: 25 },
  content: {
    flexDirection: "row",
    paddingTop: 10,
    paddingBottom: 10,
    width: "100%",
  },
  readByMonthTitle: { margin: 10, fontSize: 22 },
  readByMonthEntries: {
    margin: 10,
    marginBottom: -4,
    fontSize: 15,
  },
  mostReadAuthor: {
    margin: 10,
    fontSize: 20,
  },
  barChart: {
    marginTop: 20,
    marginLeft: -30,
  },
});
