import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Content, Text, List, ListItem, Left, Body, Right, Thumbnail } from 'native-base';
import { auth, db } from '../../firebase/config';

class WaitingListScreen extends Component {

    constructor (props) {
        super(props);

        this.state = {
            waitingList: null
        }
    }

    componentDidMount () {
        let data = this.props.data;
        let usersKey = [];
        let result = [];
        let totalUsers = 0;
        let usersRef = db.ref('/users');
        if (data) {
            totalUsers = Object.keys(data).length;
        }      
        if (totalUsers > 0) {
            Object.keys(data).map((d,i) => usersKey.push(d));
            usersRef.on('value', (data) => {
                let users = data.val();
                for (let i=0; i<usersKey.length; i++) {
                    if (users.hasOwnProperty(usersKey[i])) {
                        result.push({
                            name: users[usersKey[i]].name,
                            image: users[usersKey[i]].photo
                        });
                    }
                    if (i === (usersKey.length-1)) {
                        this.setState({ waitingList: result });
                    }
                }
            });
        }
    }

    render () {
        let { waitingList } = this.state;
        return (
            <View style={{ padding: 5 }}>
                <List>
                    { waitingList && waitingList.map((m,i) => {
                        return (
                            <ListItem key={i} avatar>
                                <Left>
                                    <Thumbnail square source={{ uri: m.image }} />
                                </Left>
                                <Body>
                                    <Text>{m.name}</Text>
                                </Body>
                            </ListItem>
                        );
                    })}
                    { !waitingList &&
                        <ListItem>
                            <Body>
                                <Text>{' Belum ada user yang ingin bergabung '}</Text>
                            </Body>
                        </ListItem>
                    }
                </List>
            </View>
        );
    }

}

export default WaitingListScreen;