import React, { Component } from 'react';
import { Container, Content, ActionSheet, Button, List, ListItem, Left, Body, Right, Thumbnail, Text, H3 } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import userAvatar from '../data/images/user_avatar.png';
import { new_groups } from '../data/dummies';
import Footer from './partials/Footer';
import { auth, db } from '../firebase/config';

const BUTTONS = [
    { text: "Edit Profil", icon: "md-cog", iconColor: "#2c8ef4" },
    { text: "Ubah Password", icon: "md-construct", iconColor: "#2c8ef4" },
    { text: "Logout", icon: "md-exit", iconColor: "#2c8ef4" }
];

class ProfileScreen extends Component {
    
    constructor (props) {
        super(props);
    
        this.state = {
          isUserLogin: false,
          activeMenu: 'Profile',
          user: {}
        }
    
        this.handleRouteChange = this.handleRouteChange.bind(this);
        this.showSettings = this.showSettings.bind(this);
    }

    componentDidMount () {
        auth.onAuthStateChanged(user => {
            if (user) {
                let ref = db.ref('/users/'+user.uid)
                ref.once('value', data => {
                    let usr = data.val()
                    this.setState({
                        user: {
                            name: usr.name,
                            city: usr.city,
                            photo: userAvatar, // default image, will be change soon
                            groups: usr.groups ? usr.groups : {}
                        },
                        isUserLogin: true
                    })
                })
            } else {
                return this.props.navigation.navigate('Login');
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

    showSettings () {
        ActionSheet.show(
            {
                options: BUTTONS,
                title: 'Pengaturan Profil'
            },
            buttonIndex => {
                if (buttonIndex === 2) {
                    auth.signOut()
                        .then(() => this.props.navigation.navigate('Home') )
                        .catch((error) => console.log('Error: cant logout ', error) );
                }
            }
        )
    }

    render () {
        let { user } = this.state;
        return (
            <Container>
                <Content padder={true}>
                    <Grid style={{ marginTop: 20 }}>
                        <Col style={{ alignItems: 'center' }}>
                            <Thumbnail large source={user.photo} />
                        </Col>
                        <Col>
                            <H3>{user.name}</H3>
                            <Text>{user.city}</Text>
                            <Button
                                style={{ marginTop: 5 }}
                                onPress={this.showSettings}>
                                <Text>Settings</Text>
                            </Button> 
                        </Col>
                    </Grid>
                    <List>
                        <ListItem itemHeader first>
                            <Text>Member</Text>
                        </ListItem>
                        {new_groups.map(group => {
                            return (
                                <ListItem key={group.id} avatar>
                                    <Left>
                                        <Thumbnail square source={group.image} />
                                    </Left>
                                    <Body>
                                        <Text>{group.title}</Text>
                                        <Text note>{group.total_members} member</Text>
                                    </Body>
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

export default ProfileScreen;
