import React, { Component } from 'react';
import { StyleSheet, Image, Alert } from 'react-native';
import { Container, Content, View, Text, H3, Tabs, Tab, Button, Icon, Spinner } from 'native-base';
import Events from './Events';
import Members from './Members';
import WaitingList from './WaitingList';
import { auth, db } from '../../firebase/config';

class GroupScreen extends Component {

    constructor (props) {
        super(props);

        this.state = {
            isUserLogin: false,
            userId: null,
            isAdmin: false,
            isMember: false,
            isUserWaiting: false,
            isFetching: true,
            group: null,
            groupKey: this.props.navigation.state.params.group_key
        }

        this.handleRouteChange = this.handleRouteChange.bind(this);
        this.checkIsUserAdmin = this.checkIsUserAdmin.bind(this);
        this.checkIsUserMember = this.checkIsUserMember.bind(this);
        this.checkIsUserWaiting = this.checkIsUserWaiting.bind(this);
        this.handleRequestJoinGroup = this.handleRequestJoinGroup.bind(this);
        this.handleExitGroup = this.handleExitGroup.bind(this);
        this.handleDeleteEvent = this.handleDeleteEvent.bind(this);
        this.deleteEvent = this.deleteEvent.bind(this);
        this.showDialogMessage = this.showDialogMessage.bind(this);
    }

    componentDidMount () {
        let { groupKey } = this.state;
        let groupRef = db.ref('/groups/'+groupKey);

        auth.onAuthStateChanged(user => {
            if (user) {
                groupRef.on('value', data => {
                    let groupData = data.val();
                    this.checkIsUserAdmin(groupData, user.uid, groupKey);
                });
            } else {
                groupRef.on('value', data => {
                    let groupData = data.val();
                    this.setState({
                        group: groupData,
                        isFetching: false
                    });
                });
            }
        });
    }

    checkIsUserAdmin (groupData, userId, groupKey) {
        let groupRef = db.ref('/groups/'+groupKey);

        groupRef.on('value', data => {
            let admin = data.val().admin;
            if (userId === admin) {
                this.setState({
                    isUserLogin: true,
                    userId: userId,
                    isAdmin: true,
                    isMember: true,
                    isFetching: false,
                    group: groupData
                });
            } else {
                this.checkIsUserMember(groupData, userId, groupKey);
            }
        });
    }

    checkIsUserMember (groupData, userId, groupKey) {
        let memberRef = db.ref('/groups/'+groupKey+'/members');

        memberRef.on('value', data => {
            let members = data.val();
            let memberKeys = [];

            if (members) {
                Object.keys(members).map((m,i) => memberKeys.push(m));
            }

            if (memberKeys.length > 0) {
                for (let i=0; i<memberKeys.length; i++) {
                    if (userId === memberKeys[i]) {
                        this.setState({
                            isUserLogin: true,
                            userId: userId,
                            isMember: true,
                            isFetching: false,
                            group: groupData
                        });
                        break;
                    }
                    if ((i === (memberKeys.length-1)) && !this.state.isMember) {
                        this.checkIsUserWaiting(userId, groupData, groupKey);
                    }
                }
            } else {
                this.checkIsUserWaiting(userId, groupData, groupKey);
            }
        });
    }

    checkIsUserWaiting (userId, groupData, groupKey) {
        let waitingRef = db.ref('/groups/'+groupKey+'/waiting_list/');

        waitingRef.on('value', data => {
            let waitingList = data.val();
            let waitingListKeys = [];

            if (waitingList) {
                Object.keys(waitingList).map((w,i) => waitingListKeys.push(w));
            }

            if (waitingListKeys.length > 0) {
                for (let i=0; i<waitingListKeys.length; i++) {
                    if (userId === waitingListKeys[i]) {
                        this.setState({
                            isUserLogin: true,
                            userId: userId,
                            isUserWaiting: true,
                            isFetching: false,
                            group: groupData
                        });
                        break;
                    }
                    if ((i == (waitingListKeys.length-1)) && !this.state.isUserWaiting) {
                        this.setState({
                            isUserLogin: true,
                            isFetching: false,
                            userId: userId,
                            group: groupData
                        });
                    }
                }
            } else {
                this.setState({
                    isUserLogin: true,
                    isFetching: false,
                    userId: userId,
                    group: groupData
                });
            }
        });
    }

    handleRequestJoinGroup () {
        if (this.state.isUserLogin) {
            let { groupKey, userId } = this.state;
            db.ref('/groups/'+groupKey+'/waiting_list/'+userId).set({ status: true })
                .then(() => {
                    console.log('Succeed');
                })
                .catch((error) => {
                    console.log('Error');
                });
        } else {
            this.showDialogMessage(
                'Info',
                'Anda belum login. Apakah Anda ingin login atau belum punya akun ?'
            );
        }
    }

    handleExitGroup () {
        let { groupKey, userId } = this.state;
        let membersKey = [];
        let membersRef = db.ref('/groups/'+groupKey+'/members');

        membersRef.on('value', (data) => {
            if (data.val()) {
                Object.keys(data.val()).map((m,i) => membersKey.push(m));
            }
        });

        if (membersKey) {
            if (membersKey.length > 1) {
                db.ref('/groups/'+groupKey+'/members/'+userId).remove();
            } else {
                let groupRef = db.ref('/groups/'+groupKey);
                groupRef.update({ members: false });
            }
            this.props.navigation.navigate('Group', { group_key: groupKey });
        }
    }

    handleDeleteEvent (eventKey) {
        Alert.alert(
            'Peringatan',
            'Apakah kamu yakin ingin menghapus event ini ?',
            [
                { text: 'Ya', onPress: () => { 
                    this.deleteEvent(eventKey);
                }},
                { text: 'Tidak', onPress: () => {
                    console.log('Close'); 
                }}
            ],
            { cancelable: true }
        );
    }

    deleteEvent (eventKey) {
        let { groupKey } = this.state;
        let eventsRef = db.ref('/groups/'+groupKey+'/events');
        let eventKeys = [];

        delEvent = () => {
            let eventRef = db.ref('/events');
            let eventKeys = [];

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
                delEvent();
            } else {
                let groupRef = db.ref('/groups/'+groupKey);
                groupRef.update({ events: false });
                delEvent();
            }
        }
    }

    showDialogMessage (title, message) {
        Alert.alert(
            title,
            message,
            [
              {text: 'Tutup', onPress: () => console.log('Tutup diaglog')},
              {text: 'Login', onPress: () => this.props.navigation.navigate('Login')},
              {text: 'Daftar', onPress: () => this.props.navigation.navigate('SignUp')}
            ],
            { cancelable: true }
        );
    }

    handleRouteChange (url, paramKey) {
        let { navigate } = this.props.navigation;
        if (!this.state.isUserLogin) {
            if (url === 'Event') {
                return navigate(url, paramKey);
            } else {
                return navigate('Login');
            }
        } else {
            return navigate(url, paramKey);
        }
    }

    render () {
        let { group, groupKey, isAdmin, isMember, isUserWaiting, isFetching } = this.state;
        return (
            <Container>
                { (!isFetching && group) &&
                    <Content>
                        <View>
                            <Image style={styles.groupImage} source={{ uri: group.image }} />
                            { isAdmin &&
                                <Button
                                  danger small style={styles.addNewEvent}
                                  onPress={() => this.handleRouteChange('NewEvent', { group_key: groupKey })} >
                                    <Icon name='add'/>
                                </Button> }
                            { (!isAdmin && isMember) &&
                                <Button
                                  small
                                  warning
                                  onPress={() => this.handleExitGroup()}
                                  style={styles.exitGroup}>
                                    <Text>{' Keluar '}</Text>
                                </Button> }
                            { (!isAdmin && !isMember && !isUserWaiting) &&
                                <Button
                                  small
                                  onPress={() => this.handleRequestJoinGroup()}
                                  style={styles.joinGroup}>
                                    <Text>{' Bergabung '}</Text>
                                </Button> }
                            { isUserWaiting &&
                                <View style={styles.waiting}>
                                    <Text style={{ color: 'white' }}>{' Masih Menunggu Persetujuan '}</Text>
                                </View> }
                            <H3 style={styles.groupName}>{group.name}</H3>
                            <Text style={styles.description}>{group.about}</Text>
                        </View>
                        <Tabs initialPage={0}>
                            <Tab heading="Events">
                                <Events
                                    groupKey={groupKey}
                                    data={group.events}
                                    onMenuChange={this.handleRouteChange}
                                    onDeleteEvent={this.handleDeleteEvent}
                                />
                            </Tab>
                            <Tab heading="Member">
                                <Members data={group.members} />
                            </Tab>
                            { isAdmin && <Tab heading="Waiting List">
                                <WaitingList
                                    data={group.waiting_list}
                                    groupKey={groupKey}
                                    onMenuChange={this.handleRouteChange}
                                />
                            </Tab> }
                        </Tabs>
                    </Content> }
                { isFetching &&
                    <View style={styles.container}>
                        <Spinner color='green' size='large'/> 
                    </View>
                }
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF'
    },
    groupImage: {
        height: 200,
        width: '100%'
    },
    addNewEvent: {
        position: 'absolute',
        top: 10,
        right: 10,
        borderRadius: 5
    },
    exitGroup: {
        position: 'absolute',
        top: 10,
        right: 10
    },
    joinGroup: {
        position: 'absolute',
        top: 10,
        right: 10,
        borderWidth: 2
    },
    waiting: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'grey'
    },
    groupName: {
        marginTop: -40,
        backgroundColor: 'white',
        opacity: 0.7,
        padding: 10
    },
    description: {
        padding: 15
    }
});

export default GroupScreen;