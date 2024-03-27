import React, { useEffect, useState} from "react";
import { SafeAreaView, Text, } from "react-native"
import Backend from "@/Backend";
import useSWR from "swr";

const backend = new Backend();

function pageCounter(data) {
  let counter = 0;
  if (data == undefined) {
    return 0;
  }
  data.forEach(element => {
    counter += element.pages;
  });
  return counter;
}

export function pagesRead(data) {
  let pages = pageCounter(data).toLocaleString();
  console.log(pages);
  return (
    <SafeAreaView style={{width: '70%', height: '100%', justifyContent: 'center'}}>
      <Text style={{fontSize: 25, textAlign: 'center'}}>This year, you read {'\n'} {pages} pages!</Text>
    </SafeAreaView>
  );
} 