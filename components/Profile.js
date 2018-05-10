import React, { Component } from 'react';
import { 
    Container,
    Content,
    ActionSheet,
    Button,
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
import Footer from './partials/Footer';

var BUTTONS = [
    { text: "Edit Profil", icon: "md-cog", iconColor: "#2c8ef4" },
    { text: "Ubah Password", icon: "md-construct", iconColor: "#2c8ef4" },
    { text: "Logout", icon: "md-exit", iconColor: "#2c8ef4" }
];
var CANCEL_INDEX = 2;

class ProfileScreen extends Component {
    
    constructor (props) {
        super(props);
    
        this.state = {
          isUserLogin: true,
          activeMenu: 'Profile'
        }
    
        this.handleRouteChange = this.handleRouteChange.bind(this);
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
                <Content padder={true}>
                    <Grid style={{ marginTop: 20 }}>
                        <Col style={{ alignItems: 'center' }}>
                            <Thumbnail large source={userAvatar} />
                        </Col>
                        <Col>
                            <H3>Ridoan Saleh Nasution</H3>
                            <Text>Jakarta</Text>
                            <Button
                                style={{ marginTop: 5 }}
                                onPress={() =>
                                    ActionSheet.show(
                                        {
                                            options: BUTTONS,
                                            cancelButtonIndex: CANCEL_INDEX,
                                            title: 'Pengaturan Profil'
                                        },
                                        buttonIndex => {
                                            this.setState({ clicked: BUTTONS[buttonIndex] });
                                        }
                                    )
                                }>
                                <Text>Settings</Text>
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
                <Footer onMenuChange={this.handleRouteChange} activeMenu={this.state.activeMenu} />
            </Container>
        );
    }

}

export default ProfileScreen;
