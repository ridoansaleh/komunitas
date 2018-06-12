import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, List, ListItem, Left, Body, Thumbnail } from 'native-base';
import { db } from '../../firebase/config';

class MemberScreen extends Component {

    constructor (props) {
        super(props);

        this.state = {
            members: null
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
                        this.setState({ members: result });
                    }
                }
            });
        }
    }

    render () {
        let { members } = this.state;
        return (
            <View style={{ padding: 5 }}>
                <List>
                    { members && members.map((m,i) => {
                        return (
                            <ListItem
                              key={i}
                              avatar
                              style={styles.list}>
                                <Left>
                                    <Thumbnail square source={{ uri: m.image }} />
                                </Left>
                                <Body>
                                    <Text>{m.name}</Text>
                                </Body>
                            </ListItem>
                        );
                    })}
                    { !members &&
                        <ListItem>
                            <Body>
                                <Text>{' Belum ada Member '}</Text>
                            </Body>
                        </ListItem>
                    }
                </List>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    list: {
        marginBottom: 5
    }
});

export default MemberScreen;