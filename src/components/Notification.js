import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { Container, Content, List, ListItem, Left, Body, Right, Thumbnail, Text } from 'native-base';
import Footer from './partials/Footer';
import { auth, db } from '../firebase/config';

class NotificationScreen extends Component {
    
    constructor (props) {
        super(props);
    
        this.state = {
          isUserLogin: false,
          activeMenu: 'Notification',
          notifications: null,
          isNotificationFetched: false,
          totalNotif: 0
        }
        
        this.fetchNotifications = this.fetchNotifications.bind(this);
        this.handleRouteChange = this.handleRouteChange.bind(this);
    }

    componentDidMount () {
        auth.onAuthStateChanged(user => {
            if (user) {
                this.fetchNotifications(true, user.uid);
            }
        });
    }

    fetchNotifications (loginStatus, userKey) {
        let notiRef = db.ref('/notifications');
        let notifsKey = [];
        
        notiRef.on('value', (data) => {
            let notifications = data.val();
            let result = [];

            if (notifications) {
                Object.keys(notifications).map((n,i) => notifsKey.push(n));
            }
            
            if (notifsKey.length) {
                for (let i=0; i<notifsKey.length; i++) {
                    db.ref('/notifications/'+notifsKey[i]+'/receivers').on('value', (data) => {
                        if (data.val().hasOwnProperty(userKey)) {
                            db.ref('/notifications/'+notifsKey[i]+'/receivers/'+userKey).on('value', (data) => {
                                let status = data.val().read;
                                if (!status) {
                                    db.ref('/notifications/'+notifsKey[i]+'/receivers/'+userKey).update({ read: true });
                                }
                            });
                            db.ref('/notifications/'+notifsKey[i]).on('value', (data) => {
                                let groupName = null;
                                let groupImage = null;
                                db.ref('/groups/'+data.val().sender).on('value', (group) => {
                                    groupName = group.val().name;
                                    groupImage = group.val().image;
                                });
                                if (groupName && groupImage) {
                                    result.push({
                                        'groupName': groupName,
                                        'groupImage': groupImage,
                                        'text': data.val().text,
                                        'time': data.val().time
                                    });
                                }
                            });
                        } else {
                            this.setState({
                                isUserLogin: loginStatus,
                                notifications: null,
                                isNotificationFetched: true,
                                totalNotif: 0
                            });
                        }
                    });
                    if ((i === (notifsKey.length-1)) && result.length > 0) {
                        AsyncStorage.removeItem('_totalNotif');
                        this.setState({
                            isUserLogin: loginStatus,
                            notifications: result,
                            isNotificationFetched: true,
                            totalNotif: 0
                        });
                    }
                }
            } else {
                this.setState({
                    isUserLogin: loginStatus,
                    notifications: null,
                    isNotificationFetched: true,
                    totalNotif: 0
                });
            }
        });
    }
    
    handleRouteChange (url) {
        if (!this.state.isUserLogin) {
          return this.props.navigation.navigate('Login');
        } else {
          return this.props.navigation.navigate(url);
        }
    }

    render () {
        let { activeMenu, isNotificationFetched, notifications, totalNotif } = this.state;
        return (
            <Container>
                <Content>
                    <List>
                        <ListItem itemHeader first>
                            <Text>Notifikasi</Text>
                        </ListItem>
                        { notifications && notifications.map((n,i) => {
                            return (
                                <ListItem key={i} avatar>
                                    <Left>
                                        <Thumbnail source={{ uri: n.groupImage }}/>
                                    </Left>
                                    <Body>
                                        <Text>{n.groupName}</Text>
                                        <Text note>{n.text}</Text>
                                    </Body>
                                    <Right>
                                        <Text note>{n.time}</Text>
                                    </Right>
                                </ListItem>
                            )
                        })}
                        { (isNotificationFetched && !notifications) &&
                            <ListItem>
                                <Body>
                                    <Text>{' Tidak ada Notifikasi '}</Text>
                                </Body>
                            </ListItem>
                        }
                    </List>
                </Content>
                <Footer onMenuChange={this.handleRouteChange} activeMenu={activeMenu} notif={totalNotif} />
            </Container>
        );
    }

}

export default NotificationScreen;
