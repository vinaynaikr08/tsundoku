import Backend from "@/Backend";
import Colors from "@/Constants/Colors";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text } from "react-native";
import { Divider } from "react-native-paper";
import useSWR from "swr";

const backend = new Backend();

async function fetchBookStatusCount() {
  const bookStatusDocs = await backend.getBookStatusDocs({});

  const readCount = bookStatusDocs.filter(
    (doc) => doc.status === "READ",
  ).length;
  const currentlyReadingCount = bookStatusDocs.filter(
    (doc) => doc.status === "CURRENTLY_READING",
  ).length;
  const wantToReadCount = bookStatusDocs.filter(
    (doc) => doc.status === "WANT_TO_READ",
  ).length;
  const didNotFinishCount = bookStatusDocs.filter(
    (doc) => doc.status === "DID_NOT_FINISH",
  ).length;

  return {
    readCount,
    currentlyReadingCount,
    wantToReadCount,
    didNotFinishCount,
  };
}

function BookStatusCount() {
  const { data, isLoading, error, mutate } = useSWR(
    { func: fetchBookStatusCount, arg: null },
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

  return (
    <ScrollView
      testID="profile-tab-scroll-view"
      style={styles.scrollViewStyle}
      bounces={false}
      contentContainerStyle={styles.scrollViewContentStyle}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.text}>Books read: {data.readCount}</Text>
      <Text style={styles.text}>
        Books currently reading: {data.currentlyReadingCount}
      </Text>
      <Text style={styles.text}>
        Books want to read: {data.wantToReadCount}
      </Text>
      <Text style={styles.text}>
        Books did not finish: {data.didNotFinishCount}
      </Text>
      <Divider />
    </ScrollView>
  );
}

export default BookStatusCount;

const styles = StyleSheet.create({
  scrollViewStyle: { flex: 1, marginLeft: -120 },
  scrollViewContentStyle: {
    paddingHorizontal: 5,
    backgroundColor: "white",
  },
  text: {
    fontSize: 20,
    margin: 20,
  },
});
