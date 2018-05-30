import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Container, Content, Text, H3, Tabs, Tab, Button, Icon, Spinner } from 'native-base';
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
            group: null,
            groupKey: this.props.navigation.state.params.group_key
        }

        this.handleRouteChange = this.handleRouteChange.bind(this);
    }

    componentDidMount () {
        auth.onAuthStateChanged(user => {
            if (user) {
                this.setState({ isUserLogin: true });
            }
        });

        let groupRef = db.ref('/groups/' + this.state.groupKey);
        
        groupRef.on('value', data => {
            let groupData = data.val();
            this.setState({ group: groupData });
        });
    }

    handleRouteChange (url, paramKey) {
        if (!this.state.isUserLogin) {
            return this.props.navigation.navigate('Login');
        } else {
            return this.props.navigation.navigate(url, paramKey);
        }
    }

    render () {
        let { activeMenu, group, groupKey } = this.state;
        return (
            <Container>
                { group &&
                    <Content>
                        <View>
                            <Image style={styles.groupImage} source={groupImage} />
                            <Button danger small style={styles.addNewEvent} onPress={() => this.handleRouteChange('NewEvent', { group_key: groupKey })} >
                                <Icon name='add'/>
                            </Button>
                            <H3 style={styles.groupName}> {group.name} </H3>
                            <Text style={styles.description}> {group.about} </Text>
                        </View>
                        <Tabs initialPage={0}>
                            <Tab heading="Events">
                                <Events data={group.events} onMenuChange={this.handleRouteChange} />
                            </Tab>
                            <Tab heading="Member">
                                <Members data={group.members} />
                            </Tab>
                            <Tab heading="Waiting List">
                                <WaitingList data={group.waiting_list} />
                            </Tab>
                        </Tabs>
                    </Content> }
                { !group && <Spinner color='green' size='large' /> }
                <Footer onMenuChange={this.handleRouteChange} activeMenu={activeMenu} />
            </Container>
        );
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