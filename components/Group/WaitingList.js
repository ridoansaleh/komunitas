import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Content, Text, List, ListItem, Left, Body, Right, Thumbnail } from 'native-base';
import groupImage from '../../data/images/new/fishing.jpg';

class WaitingListScreen extends Component {

    render () {
        return (
            <View style={{ padding: 5 }}>
                <List>
                    <ListItem avatar>
                        <Left>
                            <Thumbnail square source={groupImage} />
                        </Left>
                        <Body>
                            <Text>{' Budi Sudarsono '}</Text>
                        </Body>
                    </ListItem>
                </List>
            </View>
        );
    }

}

export default WaitingListScreen;