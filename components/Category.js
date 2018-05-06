import React,  { Component } from 'react';
import { Container, Content, Segment, Button, Text, List, ListItem, Body } from 'native-base';
import { groups_category } from '../data/dummies';

class CategoryScreen extends Component {

    constructor (props) {
        super(props);
    }

    render () {
        return (
            <Container>
                <Content> 
                    <Segment style={{ backgroundColor: '#848484' }}> 
                        <Button first><Text>Rekomendasi</Text></Button>
                        <Button last active><Text>Tanggal</Text></Button>
                    </Segment>
                    <List>
                        { groups_category.map(ctg => {
                            if (ctg.id === this.props.navigation.state.params.group_id) {
                                return ctg.groups.map(group => {
                                    return (
                                        <ListItem key={group.id}>
                                            <Body>
                                                <Text>{group.title}</Text>
                                            </Body>
                                        </ListItem>
                                    )
                                })
                            }
                        })}
                    </List>
                </Content>
            </Container>
        )
    }
}

export default CategoryScreen;
