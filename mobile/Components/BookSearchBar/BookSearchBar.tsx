import { View, Text } from "react-native";
import React from "react";
import { useState, } from "react";
import { Button, SearchBar, Overlay, CheckBox } from "@rneui/base";
import Icon from "react-native-vector-icons/Ionicons";
import { RadioButton } from 'react-native-paper';

type BookSearchBarProps = {
    searchingFrom: string; 
}

const BookSearchBar = ({ searchingFrom } ) => {
    const [search, setSearch] = useState("");
    const [checked, setChecked] = React.useState('title');
    const [isOverlayVisible, setOverlayVisible] = useState(false);

    const toggleOverlay = () => {
        setOverlayVisible(!isOverlayVisible);
    };

    const updateSearch = (search) => {
        setSearch(search);
    };

    return (
        <View>
            <View style={{ backgroundColor: "white", flexDirection: "row" }} >
                <View style={{ flex: 10 }}>
                    <SearchBar
                    placeholder={"Searching " + searchingFrom + "..."}
                    lightTheme
                    round
                    onChangeText={updateSearch}
                    value={search}
                    autoCorrect={false}
                    containerStyle={{padding: 0, backgroundColor: "transparent", borderBottomColor: "transparent", borderTopColor: "transparent"}}
                    inputContainerStyle={{borderRadius: 50, backgroundColor: "#dccae8"}}
                    style={{position: "relative", }}
                    />
                </View>
                <View style={{ flex: 2, alignItems:"center"}}>
                    <Button type="clear" onPress={ toggleOverlay } icon={<Icon name="filter" color={"#dccae8"} size={30} /> } />
                </View>
                <Overlay isVisible={isOverlayVisible} onBackdropPress={toggleOverlay} overlayStyle={{backgroundColor: "white", width: '75%', height: '60%', borderRadius: 20,}}>
                    <View style={{backgroundColor: "white"}}>
                        <Text style={{marginLeft: 0, marginTop: 0, paddingRight: 10, fontSize: 16, alignSelf: 'center'}}>Filter by Genre</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 8 }}>
                        <View style={{ flex: 1, }}>
                            <CheckBox 
                                checked={false}
                                title="temp genre 1"
                                onPress={() => {}}
                                containerStyle={{ paddingLeft: 0, paddingTop: 0 }}
                            />
                            <CheckBox 
                                checked={false}
                                title="temp genre 3"
                                onPress={() => {}}
                                containerStyle={{ paddingLeft: 0, paddingTop: 0 }}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <CheckBox 
                                checked={false}
                                title="temp genre 2"
                                onPress={() => {}}
                                containerStyle={{ paddingLeft: 0, paddingTop: 0 }}
                            />
                        </View>
                    </View>
                </Overlay>
            </View>
            <View style={{position: "absolute", bottom: -40, flexDirection: "row"}}>
                <Text style={{marginLeft: 0, marginTop: 8, paddingRight: 10, fontSize: 16, color: '#333',}}> 
                    Search by:  
                </Text> 
                <RadioButton.Android
                    value="title"
                    status={ checked === 'title' ? 'checked' : 'unchecked' }
                    onPress={() => setChecked('title')}
                    
                />
                <Text style={{marginLeft: -4, marginTop: 8, paddingRight: 10, fontSize: 16, color: '#333',}}> 
                    Title 
                </Text> 
                <RadioButton.Android
                    value="author"
                    status={ checked === 'author' ? 'checked' : 'unchecked' }
                    onPress={() => setChecked('author')}
                />
                <Text style={{marginLeft: -4, marginTop: 8, paddingRight: 10, fontSize: 16, color: '#333',}}> 
                    Author 
                </Text> 
                <RadioButton.Android
                    value="ISBN"
                    status={ checked === 'ISBN' ? 'checked' : 'unchecked' }
                    onPress={() => setChecked('ISBN')}
                />
                <Text style={{marginLeft: -4, marginTop: 8, paddingRight: 10, fontSize: 16, color: '#333',}}> 
                    ISBN 
                </Text> 
            </View>
        </View>
    );
}

export default BookSearchBar;