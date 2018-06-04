import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Content, Text, List, ListItem, Left, Body, Right, Thumbnail, Button } from 'native-base';
import { auth, db } from '../../firebase/config';

class WaitingListScreen extends Component {

    constructor (props) {
        super(props);

        this.state = {
            groupKey: this.props.groupKey,
            waitingList: null
        }

        this.handleConfirmJoinRequest = this.handleConfirmJoinRequest.bind(this);
        this.handleRouteChange = this.handleRouteChange.bind(this);
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
                            key: usersKey[i],
                            name: users[usersKey[i]].name,
                            image: users[usersKey[i]].photo
                        });
                    }
                    if ((i === (usersKey.length-1)) && result.length) {
                        this.setState({ waitingList: result });
                    }
                }
            });
        }
    }

    handleConfirmJoinRequest (userKey, groupKey) {
        let totalWaiting = [];
        let waitingRef = db.ref('/groups/'+groupKey+'/waiting_list');

        waitingRef.on('value', data => {
            let waitingList = data.val();
            if (waitingList) {
                Object.keys(waitingList).map((w,i) => totalWaiting.push(w));
            }
        });

        if (totalWaiting) {
            if (totalWaiting.length > 1) {
                db.ref('/groups/'+groupKey+'/waiting_list/'+userKey).remove();
            } else {
                db.ref('/groups/'+groupKey).update({ waiting_list: false });
            }
        }
        db.ref('/groups/'+groupKey+'/members/'+userKey).set({ status: true });
        this.handleRouteChange('Group', { group_key: groupKey });   
    }

    handleRouteChange (url, param) {
        return this.props.onMenuChange(url, param);
    }

    render () {
        let { waitingList, groupKey } = this.state;
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
                                <Right>
                                    <Button small onPress={() => this.handleConfirmJoinRequest(m.key, groupKey)}>
                                        <Text>{ 'Konfirmasi' }</Text>
                                    </Button>
                                </Right>
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