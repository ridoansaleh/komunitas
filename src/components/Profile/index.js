import React, { Component } from 'react';
import { StyleSheet, AsyncStorage } from 'react-native';
import { Container, Content, ActionSheet, Button, List, ListItem,
         Left, Body, Thumbnail, Text, H3, View, Spinner } from 'native-base';
import { Col, Grid } from 'react-native-easy-grid';
import Footer from '../partials/Footer';
import { auth, db } from '../../firebase/config';

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
          isFetching: true,
          activeMenu: 'Profile',
          userId: null,
          user: null,
          userGroups: null,
          totalNotif: 0
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
                    AsyncStorage.getItem('_totalNotif').then(notif => {
                        let _notif = parseInt(notif) || 0;
                        this.getUserGroups(user.uid, userData, _notif);
                    });
                });
            }
        });
    }

    getUserGroups (userId, userData, notif) {
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
                    });
                    if ((i === (keys.length-1)) && result.length) {
                        this.setState({
                            isUserLogin: true,
                            isFetching: false,
                            userId: userId,
                            user: userData,
                            userGroups: result,
                            totalNotif: notif
                        });
                    } else if ((i === (keys.length-1)) && !result.length) {
                        this.setState({
                            isUserLogin: true,
                            isFetching: false,
                            userId: userId,
                            user: userData,
                            userGroups: null,
                            totalNotif: notif
                        });
                    }
                }
            } else {
                this.setState({
                    isUserLogin: true,
                    isFetching: false,
                    userId: userId,
                    user: userData,
                    userGroups: null,
                    totalNotif: notif
                });
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
                    this.props.navigation.navigate('EditProfile', { user_key: this.state.userId });
                } else if (buttonIndex === 1) {
                        this.props.navigation.navigate('ChangePassword');
                } else if (buttonIndex === 2) {
                    auth.signOut()
                        .then(() => {
                            let data = ['_pass', '_totalNotif'];
                            AsyncStorage.multiRemove(data, (error) => {
                                error && console.log(error);
                            });
                            this.props.navigation.navigate('Home') 
                        })
                        .catch((error) => console.log('Error: cant logout ', error) );
                } 
            }
        )
    }

    render () {
        let { user, userGroups, totalNotif, isFetching } = this.state;
        return (
            <Container>
                <Content>
                    { (!isFetching && user) &&
                        <Grid style={styles.profileBox}>
                            <Col size={1} style={styles.profileLeft}>
                                <Thumbnail large source={{ uri: user.photo }}/>
                            </Col>
                            <Col size={2}>
                                <H3>{user.name}</H3>
                                <Text>{user.city}</Text>
                                <Button bordered small style={styles.settingButton} onPress={this.showSettings}>
                                    <Text>{'Settings'}</Text>
                                </Button> 
                            </Col>
                        </Grid>
                    }
                    { !isFetching &&
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
                        </List> }
                    { isFetching && <Spinner color='green' size='large' /> }
                </Content>
                <Footer onMenuChange={this.handleRouteChange} activeMenu={this.state.activeMenu} notif={totalNotif} />
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    profileBox: {
        marginTop: 0,
        paddingTop: 30,
        paddingRight: 15,
        paddingBottom: 30,
        paddingLeft: 15,
        backgroundColor: '#E3E3E3'
    },
    profileLeft: {
        alignContent: 'center'
    },
    settingButton: {
        marginTop: 10
    },
    groupsEmpty: {
        margin: 10,
        padding: 15,
        borderColor: '#71BBF5',
        borderWidth: 1,
        borderRadius: 5
    }
});

export default ProfileScreen;
