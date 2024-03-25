import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Query } from "appwrite";
import { client } from "../../appwrite";
import { Databases, Account } from "appwrite";
import ID from "../../Constants/ID";
import { BarChart } from "react-native-chart-kit";
import { ScreenWidth } from "@rneui/base";

const databases = new Databases(client);

const StatisticsTab = () => {
  async function getBookInfo(book_id: string) {
    let bookInfo = [];
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

  //   useEffect(() => {
  //     let activity = [];
  //     const account = new Account(client);
  //     account
  //       .get()
  //       .then((response) => {
  //         const user_id = response.$id;
  //         const databases = new Databases(client);
  //         const promise = databases.listDocuments(
  //           ID.mainDBID,
  //           ID.bookStatusCollectionID,
  //           [ Query.equal("user_id", user_id) ]
  //         );
  //         promise.then(function (response) {
  //           let documents = response.documents;
  //           documents = documents.filter((doc) => doc.status == "READ");

  //         documents.map(async (document) => {
  //                   const bookInfo = await getBookInfo(document.book.$id);
  //                   // console.log(bookInfo);
  //                   activity.push({
  //                     key: document.$id,
  //                     status: document.status,
  //                     username: document.user_id,
  //                     book: bookInfo[0],
  //                     timestamp: document.$createdAt,
  //                   });
  //                 }),
  //         });
  //         return activity;
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching user ID:", error);
  //       });
  //   }, []);
  //   return (
  //     <View style={{ alignItems: "center", paddingTop: 20 }}>
  //       {/* <Text style={{ fontSize: 25 }}>your stats</Text> */}
  //       <View
  //         style={{
  //           flexDirection: "row",
  //           paddingTop: 10,
  //           paddingBottom: 10,
  //           width: "100%",
  //         }}
  //       >
  //         <TouchableOpacity activeOpacity={1}>
  //           <Text style={{ margin: 10, fontSize: 20 }}>Text Statistics:</Text>
  //           <Text style={{ margin: 10, fontSize: 20 }}>Graphs:</Text>
  //         </TouchableOpacity>
  //       </View>
  //     </View>
  //   );
  const [activity, setActivity] = useState([]);
  //   const getMonthName = (index) => {
  //     const months = [
  //       "January",
  //       "February",
  //       "March",
  //       "April",
  //       "May",
  //       "June",
  //       "July",
  //       "August",
  //       "September",
  //       "October",
  //       "November",
  //       "December",
  //     ];
  //     return months[index];
  //   };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const account = new Account(client);
        const response = await account.get();
        const user_id = response.$id;

        const databases = new Databases(client);
        const queryResponse = await databases.listDocuments(
          ID.mainDBID,
          ID.bookStatusCollectionID,
          [Query.equal("user_id", user_id)],
        );

        let documents = queryResponse.documents.filter(
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
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  const booksReadByMonth = activity.reduce((acc, cur) => {
    const monthYear = cur.timestamp.substr(0, 7); // timestamp is in format YYYY-MM-DDTHH:MM:SS
    acc[monthYear] = (acc[monthYear] || 0) + 1;
    return acc;
  }, {});

  const sortedBooksByMonth = Object.entries(booksReadByMonth).sort(
    (a, b) => new Date(a[0]).getMonth() - new Date(b[0]).getMonth(),
  );
  const mostReadMonth =
    sortedBooksByMonth.length > 0
      ? sortedBooksByMonth[sortedBooksByMonth.length - 1][0]
      : null;

  const authorsRead = activity.reduce((acc, cur) => {
    const author = cur.book.author;
    acc[author] = (acc[author] || 0) + 1;
    return acc;
  }, {});

  const sortedAuthors = Object.entries(authorsRead).sort(
    (a, b) => Number(b[1]) - Number(a[1]),
  );

  const mostReadAuthor = sortedAuthors.length > 0 ? sortedAuthors[0][0] : null;

  const getMonthName = (index) => {
    const months = [
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
    return months[index - 1]; // zero-based indexing
  };

  const bookCounts = Array(12).fill(0);

  activity.forEach((cur) => {
    const monthIndex = new Date(cur.timestamp).getMonth();
    bookCounts[monthIndex]++;
  });

  //   const labels = [
  //     "January",
  //     "February",
  //     "March",
  //     "April",
  //     "May",
  //     "June",
  //     "July",
  //     "August",
  //     "September",
  //     "October",
  //     "November",
  //     "December",
  //   ];

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

  // Create datasets array with bookCounts
  //   const datasets = [
  //     {
  //       data: Array(12).fill(0),
  //     },
  //   ];

  //   // Populate datasets with book counts
  //   labels.forEach((month, index) => {
  //     const monthKey = `${index + 1}`.padStart(2, "0");
  //     const monthYear = `2024-${monthKey}`;
  //     datasets[0].data[index] = booksReadByMonth[monthYear] || 0;
  //   });

  const data = {
    labels: labels,
    datasets: datasets,
  };

  return (
    <View style={{ alignItems: "center", paddingTop: 20 }}>
      <Text style={{ fontSize: 25 }}>Your Stats</Text>
      <View
        style={{
          flexDirection: "row",
          paddingTop: 10,
          paddingBottom: 10,
          width: "100%",
        }}
      >
        <TouchableOpacity activeOpacity={1}>
          <Text style={{ margin: 10, fontSize: 22 }}>Books Read by Month:</Text>
          <View>
            {sortedBooksByMonth.map(([monthYear, count]) => (
              <Text
                style={{ margin: 10, fontSize: 18 }}
                key={monthYear}
              >{`${getMonthName(parseInt(monthYear.split("-")[1]))} ${monthYear.split("-")[0]}: ${count} books`}</Text>
            ))}
          </View>
        </TouchableOpacity>
      </View>
      {/* <View
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
      </View> */}
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
          barPercentage: 0.5, // width of bars
          propsForLabels: {
            fontSize: 10,
          },
        }}
      />
    </View>
  );
};

export default StatisticsTab;
