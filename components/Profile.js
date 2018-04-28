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
    Text,
    H3
} from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import userAvatar from '../data/images/user_avatar.png';
import { new_groups } from '../data/dummies';

class ProfileScreen extends Component {
    
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
                <Content padder={true}>
                    <Grid style={{ marginTop: 20 }}>
                        <Col style={{ alignItems: 'center' }}>
                            <Thumbnail large source={userAvatar} />
                        </Col>
                        <Col>
                            <H3>Ridoan Saleh Nasution</H3>
                            <Text>Jakarta</Text>
                            <Button style={{ marginTop: 5 }}>
                                <Text>Edit Profile</Text>
                            </Button> 
                        </Col>
                    </Grid>
                    <List>
                        <ListItem itemHeader first>
                            <Text>Member</Text>
                        </ListItem>
                        { new_groups.map( group => {
                            return (
                                <ListItem key={group.id} avatar>
                                    <Left>
                                        <Thumbnail source={group.image} />
                                    </Left>
                                    <Body>
                                        <Text>{group.title}</Text>
                                        <Text note>{group.total_members} Orang</Text>
                                    </Body>
                                    {/* <Right>
                                        <Text note>{avt.time}</Text>
                                    </Right> */}
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
                        <Button onPress={() => this.checkLoginStatus('Notification')} vertical>
                            <Icon name="notifications" />
                            <Text style={{fontSize: 9.5}}>Notifikasi</Text>
                        </Button>
                        <Button onPress={() => this.checkLoginStatus('Profile')} vertical active>
                            <Icon name="person" />
                            <Text style={{fontSize: 9.5}}>Profil</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        );
    }

}

export default ProfileScreen;
