import React from "react";
import { SafeAreaView, Text, } from "react-native"

function pageCounter(data: any) {
  let counter = 0;
  if (data == undefined) {
    return 0;
  }
  data.forEach((element: any) => {
    counter += element.pages;
  });
  return counter;
}

export function pagesRead(data: any) {
  return (
    <SafeAreaView style={{width: '70%', height: '100%', justifyContent: 'center'}}>
      <Text style={{fontSize: 25, textAlign: 'center'}}>This year, you read {'\n'} {data} pages!</Text>
    </SafeAreaView>
  );
}