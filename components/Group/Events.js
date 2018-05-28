import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Content, Text, Card, CardItem, Body, H2 } from 'native-base';

class EventScreen extends Component {

    render () {
        return (
            <View style={{ padding: 5 }}>
                <Card>
                    <CardItem>
                        <Body>
                            <H2>#1 Mancing Ikan Paus di Selat Sunda</H2>
                            <Text style={{ marginTop: 20 }}>{' 12 September 2018 (20.30 WIB) '}</Text>
                            <Text style={{ marginTop: 20 }}>{' Selat Sunda '}</Text>
                        </Body>
                    </CardItem>
                </Card>
                <Card>
                    <CardItem>
                        <Body>
                            <H2>#2 Mancing Ikan Paus di Selat Sunda</H2>
                            <Text style={{ marginTop: 20 }}>{' 12 September 2018 (20.30 WIB) '}</Text>
                            <Text style={{ marginTop: 20 }}>{' Selat Sunda '}</Text>
                        </Body>
                    </CardItem>
                </Card>
                <Card>
                    <CardItem>
                        <Body>
                            <H2>#3 Mancing Ikan Paus di Selat Sunda</H2>
                            <Text style={{ marginTop: 20 }}>{' 12 September 2018 (20.30 WIB) '}</Text>
                            <Text style={{ marginTop: 20 }}>{' Selat Sunda '}</Text>
                        </Body>
                    </CardItem>
                </Card>
            </View>
        );
    }

}

export default EventScreen;