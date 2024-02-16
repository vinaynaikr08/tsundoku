import { View, } from "react-native";
import React from "react";
import { useState, } from "react";
import Modal from "react-native-modal";
import { Button, SearchBar } from "@rneui/base";
import { transform } from "typescript";


const BookSearchBar = ( {} ) => {
    const [search, setSearch] = useState("");

    const updateSearch = (search) => {
        setSearch(search);
    };

    return (
        <View style={{ backgroundColor: "white" }} >
            <SearchBar
            placeholder="Search list..."
            lightTheme
            round
            onChangeText={updateSearch}
            value={search}
            autoCorrect={false}
            containerStyle={{padding: 0, borderRadius: 50, backgroundColor: "transparent", borderBottomColor: "transparent", borderTopColor: "transparent"}}
            inputContainerStyle={{borderRadius: 50, backgroundColor: "#dccae8"}}
            style={{position: "relative",}}
            />
            <Button color="black" style={{width: "20%", height: 20, position: "relative"}} />
        </View>
    );
}

export default BookSearchBar;