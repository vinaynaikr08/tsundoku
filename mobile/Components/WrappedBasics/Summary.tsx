import React from "react";
import { SafeAreaView, Text, View, TouchableOpacity} from "react-native"
import { genrePieChart } from "./GenrePieChart";
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import Toast from "react-native-toast-message";

export function summary(data:any, imageRef: any) {
  const onSaveImageAsync = async () => {
    try {
      const localUri = await captureRef(imageRef, {
        height: 440,
        quality: 1,
      });

      await MediaLibrary.saveToLibraryAsync(localUri);
      if (localUri) {
        Toast.show({
          type: "success",
          text1: "Image saved to gallery!",
          position: "bottom",
          visibilityTime: 2000,
        });
      }
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Error saving to gallery",
        position: "bottom",
        visibilityTime: 2000,
      });
      console.log(e);
    }
  };
  
  return (
    <SafeAreaView style={{}}>
      <View ref={imageRef} collapsable={false} style={{paddingVertical: 20, flex: 7, backgroundColor: "#CBC3E3", width: '70%', height: '70%', justifyContent: 'center', flexDirection: 'column',}}>
        <View style={{paddingTop: 10, flex: 3}}>
          <Text style={{fontSize: 35, textAlign: 'center'}}>Wrapped Summary</Text>
          <View style={{height: 15}}/>
          <Text style={{fontSize: 20, textAlign: 'center'}}>Pages Read: {data.pages.toLocaleString()}</Text>
          <Text style={{fontSize: 20, textAlign: 'center'}}>Books Read: {data.genre_arr[0].population + data.genre_arr[1].population + data.genre_arr[2].population + data.genre_arr[3].population + data.genre_arr[4].population + data.genre_arr[5].population}</Text>
        </View>
        <View style={{width: '100%', height: 0, justifyContent: 'center', alignItems: 'center', marginTop: -100, flex: 3, paddingBottom: 30}}>
          {genrePieChart(data.genre_arr)}
        </View>
      </View>
      <View style={{ flex: 1, marginTop: 0, alignItems: 'center', }}>
        <TouchableOpacity onPress={onSaveImageAsync} style={{backgroundColor: '#BEB2C8', width: 150, borderRadius: 30}}>
          <Text style={{fontSize: 20, textAlign: 'center', paddingVertical: 10}}>Share</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}