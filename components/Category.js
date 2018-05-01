import React,  { Component } from 'react';
import { Container, Header, Content, Segment, Button, Text } from 'native-base';


class Category extends Component {
    
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
                </Content>
            </Container>
        )
    }
}

export default Category;
