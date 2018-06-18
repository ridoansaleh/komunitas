import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { Container, Content, Text, List, ListItem, Left, Thumbnail, Icon, Body, H1, H3 } from 'native-base';
import { Col, Grid } from "react-native-easy-grid";
import { auth, db } from '../firebase/config';

class EventScreen extends Component {

    constructor (props) {
        super(props);

        this.state = {
            userKey: null,
            isUserJoinGroup: false,
            isUserJoinEvent: false,
            event: null,
            eventKey: this.props.navigation.state.params.event_key,
            groupKey: this.props.navigation.state.params.group_key
        }

        this.fetchEventData = this.fetchEventData.bind(this);
        this.checkIsUserJoinEvent = this.checkIsUserJoinEvent.bind(this);
        this.checkIsUserJoinGroup = this.checkIsUserJoinGroup.bind(this);
        this.handleCancelJoinEvent = this.handleCancelJoinEvent.bind(this);
        this.handleRequestJoinEvent = this.handleRequestJoinEvent.bind(this);
        this.handleChangeRequest = this.handleChangeRequest.bind(this);
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
                            this.checkIsUserJoinGroup(loginStatus, userKey, result);
                        } else {
                            this.setState({ event: result });
                        }
                    }
                });
            });
        })
    }

    checkIsUserJoinEvent (loginStatus, userKey, eventData, joinGroupStatus) {
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
                            userKey: userKey,
                            isUserJoinGroup: joinGroupStatus,
                            isUserJoinEvent: true,
                            event: eventData
                        });
                    }
                    if (i === (membersKey.length-1) && !this.state.isUserJoinEvent) {
                        this.setState({
                            userKey: userKey,
                            isUserJoinGroup: joinGroupStatus,
                            isUserJoinEvent: false,
                            event: eventData
                        });
                    }
                }
            } else {
                this.setState({
                    userKey: userKey,
                    isUserJoinGroup: joinGroupStatus,
                    isUserJoinEvent: false,
                    event: eventData
                });
            }
        });
    }

    checkIsUserJoinGroup (loginStatus, userKey, eventData) {
        let { groupKey } = this.state;
        let groupRef = db.ref('/groups/'+groupKey+'/members');
        let groupsKey = []; 

        groupRef.on('value', (data) => {
            if (data.val()) {
                Object.keys(data.val()).map((g,i) => groupsKey.push(g));
            }

            if (groupsKey.length > 0) {
                for (let i=0; i<groupsKey.length; i++) {
                    if (groupsKey[i] === userKey) {
                        this.checkIsUserJoinEvent(loginStatus, userKey, eventData, true);
                    }
                    if (i === (groupsKey.length-1) && !this.state.isUserJoinGroup) {
                        this.setState({
                            userKey: userKey,
                            isUserJoinGroup: false,
                            isUserJoinEvent: false,
                            event: eventData
                        });
                    }
                }
            } else {
                this.setState({
                    userKey: userKey,
                    isUserJoinGroup: false,
                    isUserJoinEvent: false,
                    event: eventData
                });
            }
        });
    }

    handleCancelJoinEvent (isUserJoinEvent, userKey) {
        let { eventKey } = this.state;

        if (!isUserJoinEvent) {
            this.showAlertMessage('Peringatan', 'Kamu BELUM ikut event ini !');
        } else {
            let eventKeys = [];
            let membersRef = db.ref('/events/'+eventKey+'/members');

            membersRef.on('value', (data) => {
                if (data.val()) {
                    Object.keys(data.val()).map((e,i) => eventKeys.push(e));
                }
            });

            if (eventKeys) {
                if (eventKeys.length > 1) {
                    db.ref('/events/'+eventKey+'/members/'+userKey).remove();
                    this.setState({ isUserJoinEvent: false });
                } else {
                    let eventRef = db.ref('/events/'+eventKey);
                    eventRef.update({ members: false });
                    this.setState({ isUserJoinEvent: false });
                }
            }
        }
    }

    handleRequestJoinEvent (isUserJoinEvent, userKey) {
        let { eventKey } = this.state;

        if (isUserJoinEvent) {
            this.showAlertMessage('Peringatan', 'Kamu SUDAH ikut event ini !');
        } else {
            let eventRef = db.ref('/events/'+eventKey+'/members/'+userKey);
            eventRef.set({ status: true });
            this.setState({ isUserJoinEvent: true });
        }
    }

    handleChangeRequest (userKey) {
        let { eventKey } = this.state;
        let eventKeys = [];
        let membersRef = db.ref('/events/'+eventKey+'/members');

        membersRef.on('value', (data) => {
            if (data.val()) {
                Object.keys(data.val()).map((e,i) => eventKeys.push(e));
            }
        });

        if (eventKeys) {
            if (eventKeys.length > 1) {
                db.ref('/events/'+eventKey+'/members/'+userKey).remove();
                this.setState({ isUserJoinEvent: false });
            } else {
                let eventRef = db.ref('/events/'+eventKey);
                eventRef.update({ members: false });
                this.setState({ isUserJoinEvent: false });
            }
        }
    }

    showAlertMessage (title, content) {
        Alert.alert(
            title,
            content,
            [
              {text: 'Tutup', onPress: () => {
                console.log('Close');
              }}
            ],
            { cancelable: true }
        );
    }

    render () {
        let { userKey, isUserJoinEvent, isUserJoinGroup, event } = this.state;
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
                    { ((event.quota > event.total_members) && isUserJoinGroup && !isUserJoinEvent) &&
                        <Grid style={styles.joinBox}>
                            <Col style={{ width: '70%' }}>
                                <Text>Apakah kamu ingin ikut ?</Text>
                            </Col>
                            <Col>
                                <TouchableOpacity onPress={() => this.handleCancelJoinEvent(isUserJoinEvent, userKey)}>
                                    { isUserJoinEvent && <Icon name='ios-close-circle-outline' /> }
                                    { !isUserJoinEvent && <Icon name='md-close-circle' /> }
                                </TouchableOpacity>
                            </Col>
                            <Col>
                                <TouchableOpacity onPress={() => this.handleRequestJoinEvent(isUserJoinEvent, userKey)}>
                                    { isUserJoinEvent && <Icon name='md-checkmark-circle' /> }
                                    { !isUserJoinEvent && <Icon name='ios-checkmark-circle-outline' /> }
                                </TouchableOpacity>
                            </Col>
                        </Grid>
                    }
                    { ((event.quota > event.total_members) && isUserJoinGroup && isUserJoinEvent) &&
                        <Grid style={styles.joinBox}>
                            <Col style={{ width: '55%' }}>
                                <Text>Kamu ikut</Text>
                            </Col>
                            <Col>
                                <TouchableOpacity onPress={() => this.handleChangeRequest(userKey)}>
                                    <Text>Batalkan</Text>
                                </TouchableOpacity>
                            </Col>
                            <Col style={{ alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => this.handleChangeRequest(userKey)}>
                                    <Icon name='md-checkmark-circle' />
                                </TouchableOpacity>
                            </Col>
                        </Grid>
                    }
                    <List style={{ marginBottom: 10 }}>
                        <ListItem avatar>
                            <Left>
                                <Icon name='ios-clock-outline' />
                            </Left>
                            <Body style={{ borderBottomWidth: 0 }}>
                                <Text>{event.date}</Text>
                                <Text note>{event.time}</Text>
                            </Body>
                        </ListItem>
                        <ListItem avatar>
                            <Left>
                                <Icon name='ios-map-outline' />
                            </Left>
                            <Body style={{ borderBottomWidth: 0 }}>
                                <Text>{event.location}</Text>
                            </Body>
                        </ListItem>
                        <ListItem avatar>
                            <Left>
                                <Icon name='ios-person-outline' />
                            </Left>
                            <Body style={{ borderBottomWidth: 0 }}>
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
        width: '90%',
        marginLeft: '5%',
        marginRight: '5%',
        padding: 15,
        borderTopWidth: 0.5,
        borderTopColor: '#AEAFB0',
        borderBottomWidth: 0.5,
        borderBottomColor: '#AEAFB0'
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