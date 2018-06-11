import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Content, List, ListItem, Left, Thumbnail, Body, View, Text, Spinner } from 'native-base';
import { db } from '../firebase/config';

class SearchResultScreen extends Component {

    constructor (props) {
        super(props);

        this.state = {
            result: null,
            search: this.props.navigation.state.params.search,
            isFetching: true
        };
    }

    componentDidMount () {
        let { search } = this.state;
        let groupsRef = db.ref('/groups');
        let groupsKey = [];
        let groupsName = [];
        let gName, gImage = null;

        let searchWords = search.split(' ');
        
        groupsRef.on('value', (data) => {
            let groups = data.val();
            
            if (groups) {
                Object.keys(groups).map((g,i) => groupsKey.push(g));
                if (groupsKey.length > 0) {
                    for (let i=0; i<groupsKey.length; i++) {
                        db.ref('/groups/'+groupsKey[i]).on('value', (data) => {
                            gName = data.val().name;
                            gImage = data.val().image;
                        });
                        let totalMembers = null;
                        db.ref('/groups/'+groupsKey[i]+'/members').on('value', (data) => {
                            let members = data.val();
                            let membersKey = [];
                            Object.keys(members).map((m,i) => membersKey.push(m));
                            totalMembers = membersKey.length;
                        });
                        if (gName) {
                            if (searchWords.length > 1) {
                                for (let j=0; j<searchWords.length; j++) {
                                    if (gName.indexOf(searchWords[j]) > -1) {
                                        groupsName.push({
                                            'key': groupsKey[i],
                                            'name': gName,
                                            'image': gImage,
                                            'total_members': totalMembers,
                                        });
                                        break;
                                    }
                                }
                            } else {
                                if (gName.charAt(0) === search.charAt(0)) {
                                    groupsName.push({
                                        'key': groupsKey[i],
                                        'name': gName,
                                        'image': gImage,
                                        'total_members': totalMembers,
                                    });
                                }
                            }
                        }
                        if ((i === (groupsKey.length-1)) && groupsName.length) {
                            this.setState({
                                result: groupsName,
                                isFetching: false
                            });
                        } else if ((i === (groupsKey.length-1)) && !groupsName.length) {
                            this.setState({
                                result: null,
                                isFetching: false
                            });
                        }
                    }
                }
            } else {
                this.setState({ result: null, isFetching: false });
            }
        });
    }

    render () {
        let { search, result, isFetching } = this.state;
        return (
            <Container>
                <Content padder={true}>
                    { !isFetching && <List>
                        <ListItem first>
                            <Text>Hasil Pencarian untuk "{search}"</Text>
                        </ListItem>
                        { result && result.map((g,i) => {
                            return (
                                <ListItem
                                  key={i}
                                  avatar
                                  onPress={() => this.props.navigation.navigate('Group', { group_key: g.key })}>
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
                        { !result &&
                            <View style={styles.groupsEmpty}>
                                <Text>Maaf, grup yang Anda cari tidak ada. Coba cari grup yang lain !</Text>
                            </View>
                        }
                    </List> }
                    { isFetching && <Spinner color='green' size='large' /> }
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    groupsEmpty: {
        margin: 10,
        padding: 15,
        borderColor: '#71BBF5',
        borderWidth: 1,
        borderRadius: 5
    }
});

export default SearchResultScreen;