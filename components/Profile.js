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
          user: {},
          userGroups: null
        }
    
        this.handleRouteChange = this.handleRouteChange.bind(this);
        this.getUserGroups = this.getUserGroups.bind(this);
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
                });
                this.getUserGroups(user.uid);
            } else {
                return this.props.navigation.navigate('Login');
            }
        });
    }

    getUserGroups (userId) {
        let keys = [];
        let result = [];
        let groupsRef = db.ref('/groups'); 
        groupsRef.on('value', (data) => {
            let groups = data.val();
            let totalGroups = Object.keys(groups).length;
            if (totalGroups > 0) {
                Object.keys(groups).map((g,i) => keys.push(g));
                for (let i=0; i<keys.length; i++) {
                    if (groups[keys[i]]['members'].hasOwnProperty(userId)) {
                        result.push({
                            name: groups[keys[i]]['name'],
                            image: groups[keys[i]]['image'],
                            total_members: Object.keys(groups[keys[i]]['members']).length,
                            key: keys[i]
                        });
                    }
                    if (i === (keys.length-1)) {
                        this.setState({ userGroups: result });
                    }
                }
            }
        }); 
    }
    
    handleRouteChange (url, groupKey) {
        if (!this.state.isUserLogin) {
          return this.props.navigation.navigate('Login');
        } else {
          return this.props.navigation.navigate(url, { group_key: groupKey });
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
        let { user, userGroups } = this.state;
        return (
            <Container>
                <Content>
                    <Grid style={{ marginTop: 0, padding: 30, backgroundColor: '#E3E3E3' }}>
                        <Col style={{ width: '35%', alignContent: 'center' }}>
                            <Thumbnail large source={user.photo} />
                        </Col>
                        <Col style={{ width: '65%' }}>
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
                        { userGroups && userGroups.map((g,i) => {
                            return (
                                <ListItem key={i} avatar onPress={() => this.handleRouteChange('Group', g.key)}>
                                    <Left>
                                        <Thumbnail square source={{ uri: g.image }} />
                                    </Left>
                                    <Body>
                                        <Text>{g.name}</Text>
                                        <Text note>{g.total_members} member</Text>
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
