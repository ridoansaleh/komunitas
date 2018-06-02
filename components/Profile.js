import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Content, ActionSheet, Button, List, ListItem, Left, Body, 
         Right, Thumbnail, Text, H3, View } from 'native-base';
import { Col, Grid } from "react-native-easy-grid";
import userAvatar from '../data/images/user_avatar.png';
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
          userId: null,
          user: null,
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
                    let userData = {
                        name: data.val().name,
                        city: data.val().city,
                        photo: data.val().photo,
                    };
                    this.getUserGroups(user.uid, userData);
                });
            } else {
                return this.props.navigation.navigate('Login');
            }
        });
    }

    getUserGroups (userId, userData) {
        let keys = [];
        let result = [];
        let groupsRef = db.ref('/groups'); 

        groupsRef.on('value', (data) => {
            let groups = data.val();

            if (groups) {
                Object.keys(groups).map((g,i) => keys.push(g));
            }

            if (keys.length > 0) {
                for (let i=0; i<keys.length; i++) {
                    let membersRef = db.ref('/groups/'+keys[i]+'/members');
                    membersRef.on('value', (data) => {
                        if (data.val() && data.val().hasOwnProperty(userId)) {
                            result.push({
                                name: groups[keys[i]]['name'],
                                image: groups[keys[i]]['image'],
                                total_members: Object.keys(groups[keys[i]]['members']).length,
                                key: keys[i]
                            });
                        }
                        if ((i === (keys.length-1)) && (result.length === 0)) {
                            this.setState({ isUserLogin: true, userId: userId, user: userData });
                        }
                    });
                    if ((i === (keys.length-1)) && result.length) {
                        this.setState({
                            isUserLogin: true,
                            userId: userId,
                            user: userData,
                            userGroups: result
                        });
                    }
                }
            } else {
                this.setState({ isUserLogin: true,  userId: userId, user: userData });
            }
        }); 
    }
    
    handleRouteChange (url, groupKey) {
        if (!this.state.isUserLogin) {
          return this.props.navigation.navigate('Login', { user_key: this.state.userId });
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
                if (buttonIndex === 0) {
                    this.props.navigation.navigate('EditProfile');
                } else if (buttonIndex === 2) {
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
                    { user && <Grid style={{ marginTop: 0, padding: 30, backgroundColor: '#E3E3E3' }}>
                        <Col style={{width: '35%', alignContent: 'center'}}>
                            <Thumbnail large source={{ uri: user.photo }}/>
                        </Col>
                        <Col style={{width: '65%'}}>
                            <H3>{user.name}</H3>
                            <Text>{user.city}</Text>
                            <Button  bordered small style={{ marginTop: 10 }} onPress={this.showSettings}>
                                <Text>{'Settings'}</Text>
                            </Button> 
                        </Col>
                    </Grid> }
                    <List>
                        <ListItem first>
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
                        { !userGroups &&
                            <View style={styles.groupsEmpty}>
                                <Text>Hi, kamu belum bergabung dengan grup apapun</Text>
                            </View>
                        }
                    </List>
                </Content>
                <Footer onMenuChange={this.handleRouteChange} activeMenu={this.state.activeMenu} />
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    groupsEmpty: {
        margin: 10,
        padding: 15,
        borderColor: '#71BBF5',
        borderWidth: 1,
        borderRadius: 5
    }
});

export default ProfileScreen;
