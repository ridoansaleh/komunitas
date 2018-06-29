import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { Container, Content, Text, List, ListItem, Left, Thumbnail, Icon, Body, H1, H3, Button } from 'native-base';
import { Col, Grid } from "react-native-easy-grid";
import { auth, db } from '../firebase/config';

class EventScreen extends Component {

    constructor (props) {
        super(props);

        this.state = {
            userKey: null,
            isUserAdmin: false,
            isUserJoinGroup: false,
            isUserJoinEvent: false,
            event: null,
            eventKey: this.props.navigation.state.params.event_key,
            groupKey: this.props.navigation.state.params.group_key
        }

        this.fetchEventData = this.fetchEventData.bind(this);
        this.checkIsUserAdmin = this.checkIsUserAdmin.bind(this);
        this.checkIsUserJoinEvent = this.checkIsUserJoinEvent.bind(this);
        this.checkIsUserJoinGroup = this.checkIsUserJoinGroup.bind(this);
        this.handleCancelJoinEvent = this.handleCancelJoinEvent.bind(this);
        this.handleRequestJoinEvent = this.handleRequestJoinEvent.bind(this);
        this.handleChangeRequest = this.handleChangeRequest.bind(this);
        this.handleDeleteEvent = this.handleDeleteEvent.bind(this);
        this.deleteEvent = this.deleteEvent.bind(this);
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
                            this.checkIsUserAdmin(userKey, result);
                        } else {
                            this.setState({ event: result });
                        }
                    }
                });
            });
        })
    }

    checkIsUserAdmin (userKey, result) {
        let adminRef = db.ref('/groups/'+this.state.groupKey+'/admin');
        adminRef.on('value', (data) => {
            let admin = data.val();
            if (admin === userKey) {
                this.setState({
                    userKey: userKey,
                    isUserAdmin: true,
                    isUserJoinGroup: true,
                    isUserJoinEvent: true,
                    event: result
                });
            } else {
                this.checkIsUserJoinGroup(userKey, result);
            }
        });
    }

    checkIsUserJoinEvent (userKey, eventData, joinGroupStatus) {
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
                            isUserAdmin: false,
                            isUserJoinGroup: joinGroupStatus,
                            isUserJoinEvent: true,
                            event: eventData
                        });
                    }
                    if (i === (membersKey.length-1) && !this.state.isUserJoinEvent) {
                        this.setState({
                            userKey: userKey,
                            isUserAdmin: false,
                            isUserJoinGroup: joinGroupStatus,
                            isUserJoinEvent: false,
                            event: eventData
                        });
                    }
                }
            } else {
                this.setState({
                    userKey: userKey,
                    isUserAdmin: false,
                    isUserJoinGroup: joinGroupStatus,
                    isUserJoinEvent: false,
                    event: eventData
                });
            }
        });
    }

    checkIsUserJoinGroup (userKey, eventData) {
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
                        this.checkIsUserJoinEvent(userKey, eventData, true);
                    }
                    if (i === (groupsKey.length-1) && !this.state.isUserJoinGroup) {
                        this.setState({
                            userKey: userKey,
                            isUserAdmin: false,
                            isUserJoinGroup: false,
                            isUserJoinEvent: false,
                            event: eventData
                        });
                    }
                }
            } else {
                this.setState({
                    userKey: userKey,
                    isUserAdmin: false,
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
        let { isUserAdmin, eventKey } = this.state;
        if (isUserAdmin) {
            this.showAlertMessage('Peringatan', 'Kamu tidak bisa keluar dari Event ini karena kamu adalah admin atau host');
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

    handleDeleteEvent () {
        Alert.alert(
            'Peringatan',
            'Apakah Anda yakin ingin menghapus event ini ?',
            [
                { text: 'Ya', onPress: () => { 
                    this.deleteEvent()
                }},
                { text: 'Tidak', onPress: () => {
                    console.log('Close') 
                }}
            ],
            { cancelable: true }
        );
    }

    deleteEvent () {
        let { eventKey, groupKey } = this.state;
        let eventsRef = db.ref('/groups/'+groupKey+'/events');
        let eventKeys = [];

        let delEvent = (eventKey) => {
            let eventKeys = [];
            let eventRef = db.ref('/events');

            eventRef.on('value', (data) => {
                if (data.val()) {
                    Object.keys(data.val()).map((e,i) => eventKeys.push(e));
                }
            });

            if (eventKeys) {
                if (eventKeys.length > 1) {
                    db.ref('/events/'+eventKey).remove();
                } else {
                    let rootRef = db.ref('/');
                    rootRef.update({ events: false });
                }
                this.props.navigation.navigate('Group', { group_key: groupKey });
            }
        }

        eventsRef.on('value', (data) => {
            if (data.val()) {
                Object.keys(data.val()).map((e,i) => eventKeys.push(e));
            }
        });

        if (eventKeys) {
            if (eventKeys.length > 1) {
                db.ref('/groups/'+groupKey+'/events/'+eventKey).remove();
                delEvent(eventKey);
            } else {
                let groupRef = db.ref('/groups/'+groupKey);
                groupRef.update({ events: false });
                delEvent(eventKey);
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
        let { userKey, isUserAdmin, isUserJoinEvent, isUserJoinGroup, event } = this.state;
        return (
            <Container>
                { event && <Content padder={true}>
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
                        <View style={styles.blueBox}>
                            { (event.total_members !== 0) && <Text>{event.total_members + ' orang ikut '}</Text> }
                            <Text>{'Sisa ' + (event.quota - event.total_members) + ' tempat lagi, buruan !!'}</Text>
                        </View>
                    }
                    { (event.quota === event.total_members) &&
                        <View style={styles.redBox}>
                            <Text>{ 'Tidak ada tempat lagi :(' }</Text>
                        </View>
                    }
                    {/* { isUserAdmin &&
                        <View style={styles.deleteBtn}>
                            <Button block danger onPress={() => this.handleDeleteEvent()}>
                                <Text>Hapus Event</Text>
                            </Button>
                        </View>
                    } */}
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
    blueBox: {
        marginLeft: 5,
        marginRight: 5,
        padding: 15,
        borderColor: '#316ED0',
        borderWidth: 1.5
    },
    redBox: {
        marginLeft: 5,
        marginRight: 5,
        padding: 15,
        borderColor: '#EEA4A4',
        borderWidth: 1.5
    },
    deleteBtn: {
        marginTop: 15
    }
});

export default EventScreen;