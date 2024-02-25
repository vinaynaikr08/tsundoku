import { View, Text, TouchableWithoutFeedback, Keyboard, FlatList, } from "react-native";
import React from "react";
import { useState, } from "react";
import { Button, SearchBar, Overlay, CheckBox, Divider, } from "@rneui/base";
import Icon from "react-native-vector-icons/Ionicons";
import {} from "react-native-vector-icons"
import { RadioButton } from 'react-native-paper';
import { DATA } from "./Genres";

const BookSearchBar = ( {search, updateSearch} ) => {
    const [checked, setChecked] = React.useState('title');
    const [isOverlayVisible, setOverlayVisible] = useState(false);

    const [fantasy, setFantasy] = useState(false);
    const [romance, setRomance] = useState(false);
    const [scienceFiction, setScienceFiction] = useState(false);
    const [mystery, setMystery] = useState(false);

    const toggleOverlay = () => {
        setOverlayVisible(!isOverlayVisible);
    };

    const GENRES = DATA();

    function clearFilter() {
        for (var value of GENRES) {
            value.setter[0](false);
            value.setter[1](false);
        }
    }

    return (
        <View>
            <View style={{ backgroundColor: "white", flexDirection: "row" }} >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <View style={{ flex: 10 }}>
                        <SearchBar
                        placeholder={"Search list"}
                        lightTheme
                        round
                        onChangeText={updateSearch}
                        value={search}
                        autoCorrect={false}
                        containerStyle={{padding: 0, backgroundColor: "transparent", borderBottomColor: "transparent", borderTopColor: "transparent"}}
                        inputContainerStyle={{borderRadius: 20, backgroundColor: "#F7F7F7"}}
                        style={{position: "relative", }}
                        />
                    </View>
                </TouchableWithoutFeedback>
                <View style={{ flex: 2, alignItems:"center"}}>
                    <Button type="clear" onPress={ toggleOverlay } icon={<Icon name="filter" color={"#5B2FA3"} size={30} /> } />
                </View>

                <Overlay isVisible={isOverlayVisible} onBackdropPress={toggleOverlay} overlayStyle={{ backgroundColor: "white", width: '89%', height: '70%', borderRadius: 20, marginTop: 60 }}>
                    <View style={{ backgroundColor: "white" }}>
                        <Text style={{marginLeft: 0, marginTop: 5, marginBottom: 5, fontWeight: 'bold', fontSize: 20, alignSelf: 'center'}}>Filter by Genre</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 8, height: '83%' }}>
                        <FlatList 
                            data={GENRES}
                            renderItem={({item}) => 
                            <View style={{flexDirection: 'row'}}>
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <CheckBox 
                                        checked={item.state[0]}
                                        uncheckedIcon={<Icon name="square-outline" size={20} />}
                                        checkedIcon={<Icon name="checkbox-outline" size={20}  />}
                                        title={item.title[0]}
                                        onPress={() => {item.setter[0](!item.state[0])}}
                                        containerStyle={{ paddingLeft: 0, paddingTop: 0, }}
                                        textStyle={{ fontWeight: 'normal', fontSize: 17, marginLeft: 7 }}
                                    />
                                </View>
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                   
                                    {item.title[1] != "" ? <CheckBox 
                                        checked={item.state[1]}
                                        uncheckedIcon={<Icon name="square-outline" size={20} />}
                                        checkedIcon={<Icon name="checkbox-outline" size={20}  />}
                                        title={item.title[1]}
                                        onPress={() => {item.setter[1](!item.state[1])}}
                                        containerStyle={{ paddingLeft: 0, paddingTop: 0, }}
                                        textStyle={{ fontWeight: 'normal', fontSize: 17, marginLeft: 7 }}
                                    /> : <View/>}
                                </View>
                            </View>
                            }
                        />
                            {/* <CheckBox 
                                checked={fantasy}
                                uncheckedIcon={<Icon name="square-outline" size={20} />}
                                checkedIcon={<Icon name="checkbox-outline" size={20}  />}
                                title="Fantasy"
                                onPress={() => {setFantasy(!fantasy)}}
                                containerStyle={{ paddingLeft: 0, paddingTop: 0, }}
                                textStyle={{ fontWeight: 'normal', fontSize: 17, marginLeft: 7 }}
                            />
                            <CheckBox 
                                checked={scienceFiction}
                                uncheckedIcon={<Icon name="square-outline" size={20} />}
                                checkedIcon={<Icon name="checkbox-outline" size={20}  />}
                                title="Science Fiction"
                                onPress={() => {setScienceFiction(!scienceFiction)}}
                                containerStyle={{ paddingLeft: 0, paddingTop: 0 }}
                                textStyle={{ fontWeight: 'normal', fontSize: 17, marginLeft: 7 }}
                            /> */}
                        {/* <View style={{ flex: 1 }}>
                            <CheckBox 
                                checked={romance}
                                uncheckedIcon={<Icon name="square-outline" size={20} />}
                                checkedIcon={<Icon name="checkbox-outline" size={20}  />}
                                title="Romance"
                                onPress={() => {setRomance(!romance)}}
                                containerStyle={{ paddingLeft: 0, paddingTop: 0 }}
                                textStyle={{ fontWeight: 'normal', fontSize: 17, marginLeft: 7 }}
                            />
                            <CheckBox 
                                checked={mystery}
                                uncheckedIcon={<Icon name="square-outline" size={20} />}
                                checkedIcon={<Icon name="checkbox-outline" size={20}  />}
                                title="Mystery"
                                onPress={() => {setMystery(!mystery)}}
                                containerStyle={{ paddingLeft: 0, paddingTop: 0 }}
                                textStyle={{ fontWeight: 'normal', fontSize: 17, marginLeft: 7 }}
                            />
                        </View> */}
                    </View>
                    <View style={{ position: 'absolute', bottom: 20, alignSelf: 'center', borderRadius: 20 }} >
                        <Button buttonStyle={{ borderRadius: 10 }} color={"#5B2FA3"} onPress={clearFilter} >Clear all</Button>
                    </View>
                </Overlay>
            </View>
            <Divider style={{marginTop: 11, paddingBottom: 0}}/>

            {/*}
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
                
    </View>*/}
        </View>
    );
}

export default BookSearchBar;