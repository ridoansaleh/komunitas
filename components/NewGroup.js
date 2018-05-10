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
import Footer from './partials/Footer';

class NewGroupScreen extends Component {
    
    constructor (props) {
        super(props);
    
        this.state = {
          isUserLogin: true,
          activeMenu: 'NewGroup'
        }
    
        this.handleRouteChange = this.handleRouteChange.bind(this);
    }
    
    handleRouteChange (url) {
        if (!this.state.isUserLogin) {
          return this.props.navigation.navigate('Login');
        } else {
          return this.props.navigation.navigate(url);
        }
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
                <Footer onMenuChange={this.handleRouteChange} activeMenu={this.state.activeMenu} />
            </Container>
        );
    }

}

export default NewGroupScreen;
