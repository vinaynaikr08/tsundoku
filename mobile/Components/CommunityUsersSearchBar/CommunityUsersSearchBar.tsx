import { Divider, SearchBar } from "@rneui/base";
import React from "react";
import { View } from "react-native";

export const genresSelected: string[] = [
  "YOUNG ADULT FICTION",
  "ANTIQUES & COLLECTIBLES",
  "LITERARY COLLECTIONS",
  "ARCHITECTURE",
  "LITERARY CRITICISM",
  "ART",
  "MATHEMATICS",
  "BIBLES",
  "MEDICAL",
  "BIOGRAPHY & AUTOBIOGRAPHY",
  "MUSIC",
  "BODY",
  "MIND & SPIRIT",
  "NATURE",
  "BUSINESS & ECONOMICS",
  "PERFORMING ARTS",
  "COMICS & GRAPHIC NOVELS",
  "PETS",
  "COMPUTERS",
  "PHILOSOPHY",
  "COOKING",
  "PHOTOGRAPHY",
  "CRAFTS & HOBBIES",
  "POETRY",
];

const CommunityUsersSearchBar = ({
  search,
  updateSearch,
  newPlaceholder,
  loading,
  showFilter,
  GENRES,
}) => {
  return (
    <View>
      <View style={{ backgroundColor: "white", flexDirection: "row" }}>
        <View style={{ flex: 10 }}>
          <SearchBar
            placeholder={newPlaceholder}
            lightTheme
            showLoading={loading}
            round
            onChangeText={updateSearch}
            value={search}
            autoCorrect={false}
            containerStyle={{
              padding: 0,
              backgroundColor: "transparent",
              borderBottomColor: "transparent",
              borderTopColor: "transparent",
            }}
            inputContainerStyle={{
              borderRadius: 20,
              backgroundColor: "#F7F7F7",
            }}
          />
        </View>
      </View>
      <Divider style={{ marginTop: 101, paddingBottom: 0 }} />
    </View>
  );
};

export default CommunityUsersSearchBar;
