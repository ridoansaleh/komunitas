import React, { Component } from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { Container, Content, Text, List, ListItem, Left, Thumbnail, Icon, Body, H1, H3 } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import { auth, db } from '../firebase/config';
import defaultImage from '../data/images/new/hunting.jpg';

class EventScreen extends Component {

    constructor (props) {
        super(props);

        this.state = {
            events: null
        }
    }

    render () {
        let { events } = this.state;
        return (
            <Container>
                <Content>
                    <Grid style={styles.groupBox}>
                        <Col style={{ width: '30%' }}>
                            <Thumbnail square large source={defaultImage} />
                        </Col>
                        <Col style={{ width: '70%' }}>
                            <H3>{'Grup Komunitas Memancing Buaya'}</H3>
                            <Text>{'Jakarta'}</Text>
                        </Col>
                    </Grid>
                    <View style={styles.eventBox}>
                        <H1>{ ('Mancing Buaya di Danau Siberia Saat Musim Dingin').toUpperCase() }</H1>
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
                                <Text>{' 12 Juni 2018 '}</Text>
                                <Text note>{' 14.00 - 16.00 WIB '}</Text>
                            </Body>
                        </ListItem>
                        <ListItem avatar>
                            <Left>
                                <Icon name='ios-map-outline' />
                            </Left>
                            <Body>
                                <Text>{' Pantai Ancol '}</Text>
                            </Body>
                        </ListItem>
                        <ListItem avatar>
                            <Left>
                                <Icon name='ios-person-outline' />
                            </Left>
                            <Body>
                                <Text>{' Hosted by Andi '}</Text>
                            </Body>
                        </ListItem>
                    </List>
                    <View style={styles.infoBox}>
                        <Text>15 orang ikut</Text>
                        <Text>Sisa 6 tempat lagi, buruan !!</Text>
                    </View>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    groupBox: {
        marginTop: 0,
        padding: 15,
        borderBottomColor: '#E3E3E3',
        borderBottomWidth: 3
    },
    eventBox: {
        padding: 15
    },
    joinBox: {
        padding: 15,
        borderBottomColor: '#E3E3E3',
        borderBottomWidth: 2,
        borderTopColor: '#E3E3E3',
        borderTopWidth: 2
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