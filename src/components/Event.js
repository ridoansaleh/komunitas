import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { Container, Content, Text, List, ListItem, Left, Thumbnail, Icon, Body, H1, H3 } from 'native-base';
import { Col, Grid } from "react-native-easy-grid";
import { auth, db } from '../firebase/config';
import defaultImage from '../data/images/new/hunting.jpg';

class EventScreen extends Component {

    constructor (props) {
        super(props);

        this.state = {
            isUserLogin: false,
            userKey: null,
            isUserMember: false,
            event: null,
            eventKey: this.props.navigation.state.params.event_key
        }

        this.fetchEventData = this.fetchEventData.bind(this);
        this.checkIsUserMember = this.checkIsUserMember.bind(this);
        this.handleCancelJoinEvent = this.handleCancelJoinEvent.bind(this);
        this.handleRequestJoinEvent = this.handleRequestJoinEvent.bind(this);
        this.showAlertMessage = this.showAlertMessage.bind(this);
    }

    componentDidMount () {
        auth.onAuthStateChanged(user => {
            if (user) {
                this.fetchEventData(true, user.uid);
            } else {
                this.fetchEventData(false);
            }
        });
    }

    fetchEventData (loginStatus, userKey) {
        let eventRef = db.ref('/events/'+this.state.eventKey);

        eventRef.on('value', (data) => {
            let groupName = '';
            let groupLocation = '';
            let groupAdmin = '';
            let totalMembers = 0;
            let result = {};
            let membersKey = [];
            let event = data.val();
            let groupRef = db.ref('/groups/'+event.group);

            if (event.members) {
                Object.keys(event.members).map((m,i) => membersKey.push(m));
                totalMembers = membersKey.length;
            }

            groupRef.on('value', (group) => {
                let usersRef = db.ref('/users/'+group.val().admin);
                usersRef.on('value', (user) => {
                    groupAdmin = user.val().name;
                    groupName = group.val().name;
                    groupImage = group.val().image;
                    groupLocation = group.val().location;
                    if (groupName && groupAdmin && groupLocation && groupImage) {
                        result = {
                            group_name: groupName,
                            group_location: groupLocation,
                            group_image: groupImage,
                            name: event.name,
                            date: event.date,
                            time: event.time,
                            location: event.location,
                            quota: event.quota,
                            host: groupAdmin,
                            total_members: totalMembers
                        };
                        if (loginStatus) { 
                            this.checkIsUserMember(loginStatus, userKey, result)
                        } else {
                            this.setState({ isUserLogin: loginStatus, event: result });
                        }
                    }
                });
            });
        })
    }

    checkIsUserMember (loginStatus, userKey, eventData) {
        let membersRef = db.ref('/events/'+this.state.eventKey+'/members');
        let membersKey = [];

        membersRef.on('value', (data) => {

            if (data.val()) {
                Object.keys(data.val()).map((m,i) => membersKey.push(m));
            }

            if (membersKey.length > 0) {
                for (let i=0; i<membersKey.length; i++) {
                    if (membersKey[i] === userKey) {
                        this.setState({
                            isUserLogin: loginStatus,
                            userKey: userKey,
                            isUserMember: true,
                            event: eventData
                        });
                    }
                    if (i === (membersKey.length-1) && !this.state.isUserMember) {
                        this.setState({
                            isUserLogin: loginStatus,
                            userKey: userKey,
                            event: eventData
                        });
                    }
                }
            } else {
                this.setState({
                    isUserLogin: loginStatus,
                    userKey: userKey,
                    event: eventData
                });
            }
        });
    }

    handleCancelJoinEvent (isUserMember, userKey) {
        let { eventKey } = this.state;

        if (!isUserMember) {
            this.showAlertMessage('Peringatan', 'Kamu BELUM ikut event ini !');
        } else {
            let eventKeys = [];
            let membersRef = db.ref('/events/'+eventKey+'/members/'+userKey);

            membersRef.on('value', (data) => {
                if (data.val()) {
                    Object.keys(data.val()).map((e,i) => eventKeys.push(e));
                }
            });

            if (eventKeys) {
                if (eventKeys.length > 1) {
                    db.ref('/events/'+eventKey+'/members/'+userKey).remove();
                    this.setState({ isUserMember: false });
                } else {
                    let eventRef = db.ref('/events/'+eventKey);
                    eventRef.update({ members: false });
                    this.setState({ isUserMember: false });
                }
            }
        }
    }

    handleRequestJoinEvent (isUserMember, userKey) {
        let { eventKey } = this.state;

        if (isUserMember) {
            this.showAlertMessage('Peringatan', 'Kamu SUDAH ikut event ini !');
        } else {
            let eventRef = db.ref('/events/'+eventKey+'/members/'+userKey);
            eventRef.set({ status: true });
            this.setState({ isUserMember: true });
        }
    }

    showAlertMessage (title, content) {
        Alert.alert(
            title,
            content,
            [
              {text: 'Tutup', onPress: () => {
                console.log('Tutup');
              }}
            ],
            { cancelable: true }
        );
    }

    render () {
        let { isUserLogin, userKey, isUserMember, event } = this.state;
        return (
            <Container>
                { event && <Content>
                    <Grid style={styles.groupBox}>
                        <Col style={{ width: '30%' }}>
                            <Thumbnail square large source={{ uri: event.group_image }} />
                        </Col>
                        <Col style={{ width: '70%' }}>
                            <H3>{event.group_name}</H3>
                            <Text>{event.group_location}</Text>
                        </Col>
                    </Grid>
                    <View style={styles.eventBox}>
                        <H1>{ (event.name).toUpperCase() }</H1>
                    </View>
                    { ((event.quota > event.total_members) && isUserLogin) &&
                        <Grid style={styles.joinBox}>
                            <Col style={{ width: '70%' }}>
                                <Text>Apakah kamu ingin ikut ?</Text>
                            </Col>
                            <Col>
                                <TouchableOpacity onPress={() => this.handleCancelJoinEvent(isUserMember, userKey)}>
                                    { isUserMember && <Icon name='ios-close-circle-outline' /> }
                                    { !isUserMember && <Icon name='md-close-circle' /> }
                                </TouchableOpacity>
                            </Col>
                            <Col>
                                <TouchableOpacity onPress={() => this.handleRequestJoinEvent(isUserMember, userKey)}>
                                    { isUserMember && <Icon name='md-checkmark-circle' /> }
                                    { !isUserMember && <Icon name='ios-checkmark-circle-outline' /> }
                                </TouchableOpacity>
                            </Col>
                        </Grid> }
                    <List>
                        <ListItem avatar>
                            <Left>
                                <Icon name='ios-clock-outline' />
                            </Left>
                            <Body>
                                <Text>{event.date}</Text>
                                <Text note>{event.time}</Text>
                            </Body>
                        </ListItem>
                        <ListItem avatar>
                            <Left>
                                <Icon name='ios-map-outline' />
                            </Left>
                            <Body>
                                <Text>{event.location}</Text>
                            </Body>
                        </ListItem>
                        <ListItem avatar>
                            <Left>
                                <Icon name='ios-person-outline' />
                            </Left>
                            <Body>
                                <Text>{event.host}</Text>
                            </Body>
                        </ListItem>
                    </List>
                    { (event.quota > event.total_members) &&
                        <View style={styles.infoBox}>
                            { (event.total_members !== 0) && <Text>{event.total_members + ' orang ikut '}</Text> }
                            <Text>{' Sisa ' + (event.quota - event.total_members) + ' tempat lagi, buruan !! '}</Text>
                        </View>
                    }
                    { (event.quota === event.total_members) &&
                        <View style={styles.infoBox}>
                            <Text>{ 'Tidak ada tempat lagi :(' }</Text>
                        </View>
                    }
                </Content>}
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    groupBox: {
        marginTop: 0,
        padding: 15
    },
    eventBox: {
        padding: 15
    },
    joinBox: {
        padding: 15
    },
    infoBox: {
        marginLeft: 5,
        marginRight: 5,
        padding: 15,
        borderColor: '#EEA4A4',
        borderWidth: 1.5
    }
});

export default EventScreen;