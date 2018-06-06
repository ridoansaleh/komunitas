import React, { Component } from 'react';
import { StyleSheet, View, Image, Alert, AsyncStorage } from 'react-native';
import { Container, Content, Text, H3, Tabs, Tab, Button, Icon, Spinner } from 'native-base';
import Events from './Events';
import Members from './Members';
import WaitingList from './WaitingList';
import Footer from '../partials/Footer';
import { auth, db } from '../../firebase/config';
import groupImage from '../../data/images/new/fishing.jpg';

class GroupScreen extends Component {

    constructor (props) {
        super(props);

        this.state = {
            activeMenu: null,
            isUserLogin: false,
            userId: null,
            isAdmin: false,
            isMember: false,
            isUserWaiting: false,
            group: null,
            groupKey: this.props.navigation.state.params.group_key,
            totalNotif: 0
        }

        this.handleRouteChange = this.handleRouteChange.bind(this);
        this.checkIsUserAdmin = this.checkIsUserAdmin.bind(this);
        this.checkIsUserMember = this.checkIsUserMember.bind(this);
        this.checkIsUserWaiting = this.checkIsUserWaiting.bind(this);
        this.handleRequestJoinGroup = this.handleRequestJoinGroup.bind(this);
        this.handleExitGroup = this.handleExitGroup.bind(this);
        this.showDialogMessage = this.showDialogMessage.bind(this);
    }

    componentDidMount () {
        let { groupKey } = this.state;
        let groupRef = db.ref('/groups/'+groupKey);

        auth.onAuthStateChanged(user => {
            if (user) {
                groupRef.on('value', data => {
                    let groupData = data.val();
                    AsyncStorage.getItem('_totalNotif').then(notif => {
                        let _notif = parseInt(notif) || 0;
                        this.checkIsUserAdmin(groupData, user.uid, groupKey, _notif);
                    });
                });
            } else {
                groupRef.on('value', data => {
                    let groupData = data.val();
                    this.setState({ group: groupData });
                });
            }
        });
    }

    checkIsUserAdmin (groupData, userId, groupKey, notif) {
        let groupRef = db.ref('/groups/'+groupKey);

        groupRef.on('value', data => {
            let admin = data.val().admin;
            if (userId === admin) {
                this.setState({
                    isUserLogin: true,
                    userId: userId,
                    isAdmin: true,
                    isMember: true,
                    group: groupData,
                    totalNotif: notif
                });
            } else {
                this.checkIsUserMember(groupData, userId, groupKey, notif);
            }
        });
    }

    checkIsUserMember (groupData, userId, groupKey, notif) {
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
                            group: groupData,
                            totalNotif: notif
                        });
                        break;
                    }
                    if ((i === (memberKeys.length-1)) && !this.state.isMember ) {
                        this.checkIsUserWaiting(userId, groupData, groupKey, notif);
                    }
                }
            } else {
                this.checkIsUserWaiting(userId, groupData, groupKey, notif);
            }
        });
    }

    checkIsUserWaiting (userId, groupData, groupKey, notif) {
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
                            group: groupData,
                            totalNotif: notif
                        });
                        break;
                    }
                    if ((i == (waitingListKeys.length-1)) && !this.state.isUserWaiting) {
                        this.setState({
                            isUserLogin: true,
                            userId: userId,
                            group: groupData,
                            totalNotif: notif
                        });
                    }
                }
            } else {
                this.setState({
                    isUserLogin: true,
                    userId: userId,
                    group: groupData,
                    totalNotif: notif
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
        let { activeMenu, group, groupKey, isAdmin, isMember, isUserWaiting, totalNotif } = this.state;
        return (
            <Container>
                { group &&
                    <Content>
                        <View>
                            <Image style={styles.groupImage} source={groupImage} />
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
                                    data={group.events}
                                    onMenuChange={this.handleRouteChange}
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
                { !group && <Spinner color='green' size='large' /> }
                <Footer onMenuChange={this.handleRouteChange} activeMenu={activeMenu} notif={totalNotif} />
            </Container>
        );
    }
}

const styles = StyleSheet.create({
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