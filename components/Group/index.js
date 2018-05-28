import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Container, Content, Text, H3, Tabs, Tab, Button, Icon } from 'native-base';
import Expo from "expo";
import Events from './Events';
import Members from './Members';
import WaitingList from './WaitingList';
import Footer from '../partials/Footer';
import { auth, db } from '../../firebase/config';
import groupImage from '../../data/images/new/fishing.jpg';

class GroupScreen extends Component {

    constructor (props) {
        super(props);

        this.state = {
            activeMenu: null,
            isUserLogin: false,
            loading: true
        }

        this.handleRouteChange = this.handleRouteChange.bind(this);
    }

    // WILL delete soon
    async componentWillMount() {
        await Expo.Font.loadAsync({
          'Roboto': require('native-base/Fonts/Roboto.ttf'),
          'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
          'Ionicons': require("@expo/vector-icons/fonts/Ionicons.ttf")
        });
        this.setState({ loading: false });
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
        let { activeMenu, loading } = this.state;
        if (loading) {
            return <Expo.AppLoading />;
        }
        return (
            <Container>
                <Content>
                    <View>
                        <Image style={styles.groupImage} source={groupImage} />
                        <Button danger small style={styles.addNewEvent}>
                            <Icon name='add'/>
                        </Button>
                        <H3 style={styles.groupName}>{' Grup Mancing Jakarta '}</H3>
                        <Text style={styles.description}>
                            {'Grup Mancing Jakarta adalah sebuah komunitas yang menyatukan pemuda-pemuda Jakarta yang menyukai aktivitas memancing.'}
                        </Text>
                    </View>
                    <Tabs initialPage={0}>
                        <Tab heading="Events">
                            <Events />
                        </Tab>
                        <Tab heading="Member">
                            <Members />
                        </Tab>
                        <Tab heading="Waiting List">
                            <WaitingList />
                        </Tab>
                    </Tabs>
                </Content>
                <Footer onMenuChange={this.handleRouteChange} activeMenu={activeMenu} />
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    groupImage: {
        height: 200,
        width: '100%'
    },
    addNewEvent: {
        position: 'absolute',
        top: 10,
        right: 10,
        borderRadius: 5
    },
    groupName: {
        marginTop: -40,
        backgroundColor: 'white',
        opacity: 0.7,
        padding: 10
    },
    description: {
        padding: 5
    }
  });

export default GroupScreen;