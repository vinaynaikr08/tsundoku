import React from "react";
import { SafeAreaView, Text, } from "react-native"

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

function getGenres(data) {
  const counter = Array(53).fill(0);
  const i = 0;

  if (data == undefined) {
    return counter;
  }

  data.forEach(element => {
    for (let i = 0; i < 53; i++) {
      if (genres[i] == element.genre) {
        counter[i]++;
      }
    }
  });

  const mostRead = [{ind: "Young Adult Fiction", count: 0}, {ind: "Fiction", count: 0}, {ind: "Art", count: 0}];

  for (let i = 0; i < 53; i++) {
    if (counter[i] > mostRead[0].count) {
      mostRead[2].ind = mostRead[1].ind;
      mostRead[2].count = mostRead[1].count;
      mostRead[1].ind = mostRead[0].ind;
      mostRead[1].count = mostRead[0].count;
      mostRead[0].ind = genres[i];
      mostRead[0].count = counter[i];
    } else if (counter[i] > mostRead[1].count) {
      mostRead[2].ind = mostRead[1].ind;
      mostRead[2].count = mostRead[1].count;
      mostRead[1].ind = genres[i];
      mostRead[1].count = counter[i];
    } else if (counter[i] > mostRead[2].count) {
      mostRead[2].ind = genres[i];
      mostRead[2].count = counter[i];
    }
  }

  return mostRead;
}

export function favoriteGenre(data) {
  const genreArray = getGenres(data);
  return (
    <SafeAreaView style={{width: '70%', height: '100%', justifyContent: 'center'}}>
      <Text style={{fontSize: 25, textAlign: 'center'}}>Your top genres this year were: {"\n"}</Text>
      <Text style={{fontSize: 30, textAlign: 'center'}}>1. {genreArray[0].ind}: {genreArray[0].count} {'\n'}2. {genreArray[1].ind}: {genreArray[1].count} {'\n'}3. {genreArray[2].ind}: {genreArray[2].count}</Text>
    </SafeAreaView>
  );
}