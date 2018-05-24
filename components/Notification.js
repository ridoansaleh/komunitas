import React, { Component } from 'react';
import { Container, Content, List, ListItem, Left, Body, Right, Thumbnail, Text } from 'native-base';
import { avatars } from '../data/dummies';
import Footer from './partials/Footer';
import { auth, db } from '../firebase/config';

class NotificationScreen extends Component {
    
    constructor (props) {
        super(props);
    
        this.state = {
          isUserLogin: false,
          activeMenu: 'Notification'
        }
    
        this.handleRouteChange = this.handleRouteChange.bind(this);
    }

    componentDidMount () {
        auth.onAuthStateChanged(user => {
            if (user) {
                this.setState({ isUserLogin: true });
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
        return (
            <Container>
                <Content>
                    <List>
                        <ListItem itemHeader first>
                            <Text>Notifikasi</Text>
                        </ListItem>
                        { avatars.map( avt => {
                            return (
                                <ListItem key={avt.id} avatar>
                                    <Left>
                                        <Thumbnail source={avt.image} />
                                    </Left>
                                    <Body>
                                        <Text>{avt.actor}</Text>
                                        <Text note>{avt.information}</Text>
                                    </Body>
                                    <Right>
                                        <Text note>{avt.time}</Text>
                                    </Right>
                                </ListItem>
                            )
                        })}
                    </List>
                </Content>
                <Footer onMenuChange={this.handleRouteChange} activeMenu={this.state.activeMenu} />
            </Container>
        );
    }

}

export default NotificationScreen;
