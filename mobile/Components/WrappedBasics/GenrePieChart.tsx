import React from "react";
import { SafeAreaView, Dimensions, View, Text } from "react-native"
import { PieChart } from "react-native-chart-kit"

const genres: Array<string> = [
  "Antiques & Collectibles",
  "Literary Collections",
  "Architecture",
  "Literary Criticism",
  "Art",
  "Mathematics",
  "Bibles",
  "Medical",
  "Biography & Autobiography",
  "Music",
  "Body, Mind & Spirit",
  "Nature",
  "Business & Economics",
  "Performing Arts",
  "Comics & Graphic Novels",
  "Pets",
  "Computers",
  "Philosophy",
  "Cooking",
  "Photography",
  "Crafts & Hobbies",
  "Poetry",
  "Design",
  "Political Science",
  "Drama",
  "Psychology",
  "Education",
  "Reference",
  "Family & Relationships",
  "Religion",
  "Fiction",
  "Science",
  "Foreign Language Study",
  "Self-Help",
  "Games & Activities",
  "Social Science",
  "Gardening",
  "Sports & Recreation",
  "Health & Fitness",
  "Study Aids",
  "History",
  "Technology & Engineering",
  "House & Home",
  "Transportation",
  "Humor",
  "Travel",
  "Juvenile Fiction",
  "True Crime",
  "Juvenile Nonfiction",
  "Young Adult Fiction",
  "Language Arts & Disciplines",
  "Young Adult Nonfiction",
  "Law",
]

class ListNode {
  data: any;
  next: any;
  constructor(data) {
    this.data = data
    this.next = null                
  }
}

function processData(data) {
  if (data == undefined) {
    return [];
  }
  let counter = Array(53).fill(0);

  data.forEach(element => {
    for (let i = 0; i < 53; i++) {
      if (genres[i] == element.genre) {
        counter[i]++;
      }
    }
  });

  let new_data = Array(6);

  let head = new ListNode({name: genres[0], count: counter[0]});

  for (let i = 1; i < 53; i++) {
    let temp = new ListNode({name: genres[i], count: counter[i]});
    let temp1 = head;
    let prev = head;
    while (temp1 != null) {
      if (temp.data.count > temp1.data.count) {
        break;
      }
      prev = temp1;
      temp1 = temp1.next;
    }
    if (temp1 == null) {
      prev.next = temp;
    } else if (temp1 == head) {
      head = temp;
      temp.next = prev;
    } else {
      temp.next = prev.next;
      prev.next = temp;
    }
  }
  let temp = head;

  let green = 139;
  let i = 0;
  const item = 32;
  const colors = ["#AD7A99", "#B2CEDE", "#8CDFD6", "#6DC0D5", "#5A716A", "#104547"];

  for (i = 0; i < 5; i++) {
    new_data[i] = {
      name: temp.data.name,
      population: temp.data.count,
      color: colors[i],
      legendFontColor: "#7F7F7F",
      legendFontSize: 15
    }
    temp = temp.next;
  }

  let count = 0;
  while (temp != null) {
    count += temp.data.count;
    temp = temp.next;
  }
  new_data[5] = {
    name: 'Other',
    population: count,
    color: colors[i],
    legendFontColor: "#7F7F7F",
    legendFontSize: 15
  }

  return new_data;
}

export function genrePieChart(unprocessedData) {
  let data = processData(unprocessedData);
  const chartConfig = {
    backgroundColor: "#e26a00",
    backgroundGradientFrom: "#fb8c00",
    backgroundGradientTo: "#ffa726",
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 0
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#ffa726"
    }
  };
  const {width, height} = Dimensions.get('screen'); 
  return (
    <SafeAreaView style={{height: height, width: width, justifyContent: 'center', alignItems: 'center'}}>
      <View>
        <PieChart
          data={data}
          width={width}
          height={height / 2}
          chartConfig={chartConfig}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"0"}
          hasLegend={false}
          center={[98, 0]}
          absolute
        />
      </View>
      <View style={{height: height / 3}}>
        {data.map((genre) => {
          return (
            <View style={{flexDirection: 'row'}}>
              <View style={{width: 20, height: 20, borderRadius: 10, backgroundColor: genre.color, marginRight: 5, marginBottom: 5}}/>
              <Text>{genre.population} </Text>
              <Text>{genre.name}</Text>
            </View>
          );
        })}
      </View>
      
    </SafeAreaView>
  );
} 