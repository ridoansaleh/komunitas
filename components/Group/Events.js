import React, { Component } from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { Content, Text, Card, CardItem, Body, H2 } from 'native-base';
import { auth, db } from '../../firebase/config';

class EventScreen extends Component {

    constructor (props) {
        super(props);

        this.state = {
            events: null
        }

        this.handleRouteChange = this.handleRouteChange.bind(this);
    }

    componentDidMount () {
        let data = this.props.data;
        let eventsKey = [];
        let result = [];
        let totalEvents = 0;
        let eventsRef = db.ref('/events');
        if (data) {
            totalEvents = Object.keys(data).length;
        }      
        if (totalEvents > 0) {
            Object.keys(data).map((d,i) => eventsKey.push(d));
            eventsRef.on('value', (data) => {
                let events = data.val();
                for (let i=0; i<eventsKey.length; i++) {
                    if (events.hasOwnProperty(eventsKey[i])) {
                        result.push({
                            key: eventsKey[i],
                            name: events[eventsKey[i]].name,
                            date: events[eventsKey[i]].date,
                            location: events[eventsKey[i]].location
                        });
                    }
                    if (i === (eventsKey.length-1)) {
                        this.setState({ events: result });
                    }
                }
            });
        }
    }

    handleRouteChange (url, eventKey) {
        return this.props.onMenuChange('Event', { event_key: eventKey }); // we can't access props.navigation from child component
    }

    render () {
        let { events } = this.state;
        return (
            <View style={{ padding: 5 }}>
                { events && events.map((e,i) => {
                    return (
                        <Card key={i}>
                            <CardItem>
                                <Body>
                                    <TouchableOpacity onPress={() => this.handleRouteChange('Event', e.key)}>
                                        <H2>#{(i+1) + ' ' + e.name }</H2>
                                    </TouchableOpacity>
                                    <Text style={{ marginTop: 20 }}>{e.date}</Text>
                                    <Text style={{ marginTop: 20 }}>{e.location}</Text>
                                </Body>
                            </CardItem>
                        </Card> 
                    );
                })}
                { !events && 
                    <Card>
                        <CardItem>
                            <Body>
                                <Text style={{ textAlign: 'center' }}>{ 'Belum ada Event' }</Text>
                            </Body>
                        </CardItem>
                    </Card>
                }
            </View>
        );
    }
}

export default EventScreen;