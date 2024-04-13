import React from "react";
import { SafeAreaView, Text, } from "react-native"

export function pagesRead(data: any) {
  return (
    <SafeAreaView style={{width: '70%', height: '100%', justifyContent: 'center'}}>
      <Text style={{fontSize: 25, textAlign: 'center'}}>This year, you read {'\n'} {data.toLocaleString()} pages!</Text>
    </SafeAreaView>
  );
}