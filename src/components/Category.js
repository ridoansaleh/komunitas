import React,  { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Container, Content, Segment, Button, Text, List, ListItem, Body, Left, Thumbnail, H3 } from 'native-base';
import { auth, db } from '../firebase/config';

class CategoryScreen extends Component {

    constructor (props) {
        super(props);

        this.state = {
            groups: null
        }

        this.handleRouteChange = this.handleRouteChange.bind(this);
    }

    componentDidMount () {
        let { name } = this.props.navigation.state.params;
        let categoryKey = name.toLowerCase();
        let groupsRef = db.ref('/groups');
        let groupsKey = [];
        let result = [];

        groupsRef.on('value', (data) => {
            let groupList = data.val();

            if (groupList) {
                Object.keys(groupList).map((g,i) => groupsKey.push(g));
                for (let i=0; i<groupsKey.length; i++) {
                    db.ref('/groups/' + groupsKey[i]).on('value', (data) => {
                        if (data.val().category === categoryKey) {
                            result.push({
                                ...data.val(),
                                groupKey: groupsKey[i]
                            });
                        }
                        if ((i === (groupsKey.length - 1)) && result.length) {
                            this.setState({ groups: result });
                        }
                    });
                }
            } else {
                this.setState({ groups: null });
            }
        });
    }

    handleRouteChange (url, groupKey) {
        this.props.navigation.navigate(url, { group_key: groupKey });
    }

    render () {
        let { groups } = this.state;
        let { image, name } = this.props.navigation.state.params;
        return (
            <Container>
                <Content> 
                    <View>
                        <Image source={{ uri: image }} style={styles.categoryImage} />
                        <H3 style={styles.categoryName}>{name}</H3>
                    </View>
                    <List style={styles.groupList}>
                        { groups && groups.map((g,i) => {
                                return (
                                    <ListItem key={i}
                                      avatar
                                      style={styles.listItem}
                                      onPress={() => this.handleRouteChange('Group', g.groupKey)}>
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
    },
    categoryName: {
        marginTop: -40,
        backgroundColor: 'white',
        opacity: 0.7,
        padding: 10
    },
    groupList: {
        marginTop: 10
    },
    listItem: {
        marginBottom: 5
    }
});

export default CategoryScreen;
