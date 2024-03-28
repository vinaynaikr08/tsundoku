import React from "react";
import { SafeAreaView, Text, } from "react-native"

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
  return (
    <SafeAreaView style={{width: '70%', height: '100%', justifyContent: 'center'}}>
      <Text style={{fontSize: 25, textAlign: 'center'}}>This year, you read {'\n'} {pages} pages!</Text>
    </SafeAreaView>
  );
} 