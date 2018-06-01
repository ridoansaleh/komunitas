import React,  { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Container, Content, Segment, Button, Text, List, ListItem, Body, Left, Thumbnail } from 'native-base';
import { auth, db } from '../firebase/config';

class CategoryScreen extends Component {

    constructor (props) {
        super(props);

        this.state = {
            groups: null
        }
    }

    componentDidMount () {
        let { name } = this.props.navigation.state.params;
        let categoryKey = name.toLowerCase();
        let groupsRef = db.ref('/groups');
        let groups = [];

        groupsRef.on('value', (data) => {
            let groupKeys = Object.keys(data.val());
            if (groupKeys.length > 0) {
                for (let i=0; i<groupKeys.length; i++) {
                    db.ref('/groups/' + groupKeys[i]).on('value', (data) => {
                        if (data.val().category === categoryKey) {
                            groups.push(data.val());
                        }
                        if ((i === (groupKeys.length - 1)) && groups.length) {
                            this.setState({ groups: groups });
                        }
                    });
                }
            } else {
                this.setState({ groups: null });
            }
        });
    }

    render () {
        let { groups } = this.state;
        let { image } = this.props.navigation.state.params;
        return (
            <Container>
                <Content> 
                    <View>
                        <Image source={{ uri: image }} style={styles.categoryImage} />
                    </View>
                    <List>
                        { groups && groups.map((g,i) => {
                                return (
                                    <ListItem key={i} avatar>
                                        <Left>
                                            <Thumbnail square source={{ uri: g.image }} />
                                        </Left>
                                        <Body>
                                            <Text>{g.name}</Text>
                                        </Body>
                                    </ListItem>
                                )
                            })
                        }
                        { !groups &&
                            (<ListItem>
                                <Body>
                                    <Text>{' Belum ada grup '}</Text>
                                </Body>
                            </ListItem>)
                        }
                    </List>
                </Content>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    categoryImage: {
        height: 200,
        width: '100%'
    }
});

export default CategoryScreen;
