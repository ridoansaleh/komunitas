import React, { Component } from 'react';
import { 
    Container,
    Content,
    Button,
    Text,
    Form,
    Item,
    Label,
    Input,
    Textarea 
} from 'native-base';

class NewGroupScreen extends Component {
    
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <Container>
                <Content padder={true}>
                    <Form>
                        <Item regular>
                            <Input placeholder='Nama Grup' />
                        </Item>
                        <Item regular style={{ marginTop: 5 }}>
                            <Input placeholder='Lokasi' />
                        </Item>
                        <Textarea rowSpan={5} bordered placeholder="Deskripsi" />
                        <Button block info style={{ marginTop: 5 }}>
                            <Text> Submit </Text>
                        </Button>
                    </Form>
                </Content>
            </Container>
        );
    }

}

export default NewGroupScreen;
