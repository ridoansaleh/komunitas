import React, { Component } from 'react';
import { 
    Container,
    Content, 
    Footer, 
    FooterTab, 
    Button, 
    Icon, 
    List, 
    ListItem, 
    Left, 
    Body, 
    Right, 
    Thumbnail, 
    Text 
} from 'native-base';
import { avatars } from '../data/dummies';

class NotificationScreen extends Component {
    
    constructor (props) {
        super(props);
    
        this.state = {
          isUserLogin: true
        }
    
        this.checkLoginStatus = this.checkLoginStatus.bind(this);
    }
    
    checkLoginStatus (url) {
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
                <Footer>
                    <FooterTab>
                        <Button onPress={() => this.checkLoginStatus('Home')} vertical>
                            <Icon active name="home" />
                            <Text style={{fontSize: 9.5}}>Home</Text>
                        </Button>
                        <Button onPress={() => this.checkLoginStatus('WhatsNew')} vertical>
                            <Icon name="megaphone" />
                            <Text style={{fontSize: 9.5}}>Baru</Text>
                        </Button>
                        <Button onPress={() => this.checkLoginStatus('Notification')} vertical active>
                            <Icon name="notifications" />
                            <Text style={{fontSize: 9.5}}>Notifikasi</Text>
                        </Button>
                        <Button onPress={() => this.checkLoginStatus('Profile')} vertical>
                            <Icon name="person" />
                            <Text style={{fontSize: 9.5}}>Profil</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        );
    }

}

export default NotificationScreen;
