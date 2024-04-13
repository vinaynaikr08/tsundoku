import React from "react";
import { SafeAreaView, Text, View, TouchableOpacity} from "react-native"
import { genrePieChart } from "./GenrePieChart";

export function summary(data: any) {
  return (
    <SafeAreaView style={{width: '70%', height: '100%', justifyContent: 'center', flexDirection: 'column', marginTop: 70}}>
      <View style={{paddingTop: 0, flex: 3}}>
        <Text style={{fontSize: 35, textAlign: 'center'}}>Summary</Text>
        <Text style={{fontSize: 25, textAlign: 'center'}}>Pages Read: {data.pages}</Text>
        <Text style={{fontSize: 25, textAlign: 'center'}}>Books Read: {data.genre_arr[0].population + data.genre_arr[1].population + data.genre_arr[2].population + data.genre_arr[3].population + data.genre_arr[4].population + data.genre_arr[5].population}</Text>
      </View>
      <View style={{width: '100%', height: 0, justifyContent: 'center', alignItems: 'center', marginTop: -250, flex: 3}}>
        {genrePieChart(data.genre_arr)}
      </View>
      <View style={{flex: 1, marginTop: 0, alignItems: 'center'}}>
        <TouchableOpacity style={{backgroundColor: '#BEB2C8', width: 150, borderRadius: 30}}>
          <Text style={{fontSize: 20, textAlign: 'center', paddingVertical: 10}}>Share</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}