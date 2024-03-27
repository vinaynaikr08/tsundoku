import React, { useEffect, useState} from "react";
import { SafeAreaView, Text, } from "react-native"
import Backend from "@/Backend";
import useSWR from "swr";

const backend = new Backend();

function pageCounter() {
  let counter = 0;
  const date = new Date()
  const { data } = useSWR(
    "READ",
    backend.getBooksOfStatusFromDate,
  );

  data.forEach(element => {
    counter += element.pages;
  });
  return (counter);
}

export function pagesRead() {
  const pages = pageCounter().toLocaleString();
  return (
    <SafeAreaView style={{width: '70%', height: '100%', justifyContent: 'center'}}>
      <Text style={{fontSize: 25, textAlign: 'center'}}>This year, you read {'\n'} {pages} pages!</Text>
    </SafeAreaView>
  );
} 