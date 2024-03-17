import React, { useState } from "react";
import { View, Text, FlatList } from "react-native"

import Colors from "../../Constants/Colors";

const ManageFriendsModal = () => {

    return (
        <View style={{alignItems: 'center', paddingTop: 20}}>
            <Text style={{fontSize: 25}}>
                Manage Friends
            </Text>

            <View style={{backgroundColor: '#9c9c9c', width: "20%", height: 1, marginTop: 15, marginBottom: 10}}/>

            <View
                style={{
                flexDirection: "row",
                paddingTop: 10,
                paddingBottom: 10,
                width: "100%",
            }}>
                <FlatList
                    data={null}
                    scrollEventThrottle={1}
                    style={{
                        flex: 1,
                        marginBottom: 0,
                    }}
                    renderItem={({ item }) => {
                        return (<View/>);
                    }}
                />

            </View>

            {/* <FlatList>

            </FlatList> */}
        </View>
    );
}

export default ManageFriendsModal;