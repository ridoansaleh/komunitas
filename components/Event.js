import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Container, Content, Text, List, ListItem, Left, Thumbnail, Icon, Body, H1, H3 } from 'native-base';
import { Col, Grid } from "react-native-easy-grid";
import { auth, db } from '../firebase/config';
import defaultImage from '../data/images/new/hunting.jpg';

class EventScreen extends Component {

    constructor (props) {
        super(props);

        this.state = {
            event: null,
            eventKey: this.props.navigation.state.params.event_key
        }
    }

    componentDidMount () {
        let eventRef = db.ref('/events/'+this.state.eventKey);
        eventRef.on('value', (data) => {
            let groupName = '';
            let groupLocation = '';
            let groupAdmin = '';
            let totalMembers = 0;
            let result = {};
            let membersKey = [];
            let event = data.val();
            let groupRef = db.ref('/groups/'+event.group);

            if (event.members) {
                Object.keys(event.members).map((m,i) => membersKey.push(m));
                totalMembers = membersKey.length;
            }

            groupRef.on('value', (group) => {
                let usersRef = db.ref('/users/'+group.val().admin);
                usersRef.on('value', (user) => {
                    groupAdmin = user.val().name;
                    groupName = group.val().name;
                    groupLocation = group.val().location;
                    if (groupName && groupAdmin && groupLocation) {
                        result = {
                            group_name: groupName,
                            group_location: groupLocation,
                            name: event.name,
                            date: event.date,
                            time: event.time,
                            location: event.location,
                            quota: event.quota,
                            host: groupAdmin,
                            total_members: totalMembers
                        };
                        this.setState({ event: result });
                    }
                });
            });
        })
    }

    render () {
        let { event } = this.state;
        return (
            <Container>
                { event && <Content>
                    <Grid style={styles.groupBox}>
                        <Col style={{ width: '30%' }}>
                            <Thumbnail square large source={defaultImage} />
                        </Col>
                        <Col style={{ width: '70%' }}>
                            <H3>{event.group_name}</H3>
                            <Text>{event.group_location}</Text>
                        </Col>
                    </Grid>
                    <View style={styles.eventBox}>
                        <H1>{ (event.name).toUpperCase() }</H1>
                    </View>
                    <Grid style={styles.joinBox}>
                        <Col style={{ width: '70%' }}>
                            <Text>Apakah kamu ingin ikut ?</Text>
                        </Col>
                        <Col>
                            <TouchableOpacity>
                                <Icon name='ios-close-circle-outline' />
                            </TouchableOpacity>
                        </Col>
                        <Col>
                            <TouchableOpacity>
                                <Icon name='ios-checkmark-circle-outline' />
                            </TouchableOpacity>
                        </Col>
                    </Grid>
                    <List>
                        <ListItem avatar>
                            <Left>
                                <Icon name='ios-clock-outline' />
                            </Left>
                            <Body>
                                <Text>{event.date}</Text>
                                <Text note>{event.time}</Text>
                            </Body>
                        </ListItem>
                        <ListItem avatar>
                            <Left>
                                <Icon name='ios-map-outline' />
                            </Left>
                            <Body>
                                <Text>{event.location}</Text>
                            </Body>
                        </ListItem>
                        <ListItem avatar>
                            <Left>
                                <Icon name='ios-person-outline' />
                            </Left>
                            <Body>
                                <Text>{event.host}</Text>
                            </Body>
                        </ListItem>
                    </List>
                    { (event.quota > event.total_members) &&
                        <View style={styles.infoBox}>
                            { (event.total_members !== 0) && <Text>{event.total_members + ' orang ikut '}</Text> }
                            <Text>{' Sisa ' + (event.quota - event.total_members) + ' tempat lagi, buruan !! '}</Text>
                        </View>
                    }
                    { (event.quota === event.total_members) &&
                        <View style={styles.infoBox}>
                            <Text>{ 'Tidak ada tempat lagi :(' }</Text>
                        </View>
                    }
                </Content>}
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    groupBox: {
        marginTop: 0,
        padding: 15
    },
    eventBox: {
        padding: 15
    },
    joinBox: {
        padding: 15
    },
    infoBox: {
        marginLeft: 5,
        marginRight: 5,
        padding: 15,
        borderColor: '#EEA4A4',
        borderWidth: 1.5
    }
});

export default EventScreen;