import React, { Component } from 'react';
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
          isNotificationFetched: false
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
                let totalNotif = 0;
                for (let i=0; i<notifsKey.length; i++) {
                    db.ref('/notifications/'+notifsKey[i]+'/receivers').on('value', (data) => {
                        if (data.val().hasOwnProperty(userKey)) {
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
                            totalNotif++;
                        } else {
                            this.setState({
                                isUserLogin: true,
                                notifications: null,
                                isNotificationFetched: true,
                            });
                        }
                    });
                    if ((i === (notifsKey.length-1)) && result.length > 0) {
                        this.setState({
                            isUserLogin: true,
                            notifications: result,
                            isNotificationFetched: true
                        });
                    }
                }
            } else {
                this.setState({
                    isUserLogin: true,
                    notifications: null,
                    isNotificationFetched: true
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
        let { isUserLogin, isNotificationFetched, notifications } = this.state;
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
                <Footer onMenuChange={this.handleRouteChange} activeMenu={this.state.activeMenu} />
            </Container>
        );
    }

}

export default NotificationScreen;
