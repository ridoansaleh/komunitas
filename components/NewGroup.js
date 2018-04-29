import React, { Component } from 'react';
import { 
    Container,
    Content, 
    Footer, 
    FooterTab, 
    Button, 
    Icon,
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
    
        this.state = {
          isUserLogin: true
        }
    
        this.checkLoginStatus = this.checkLoginStatus.bind(this);
    }
    
    checkLoginStatus (url) {
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
                <Footer>
                    <FooterTab>
                        <Button onPress={() => this.checkLoginStatus('Home')} vertical active>
                            <Icon active name="home" />
                            <Text style={{fontSize: 9.5}}>Home</Text>
                        </Button>
                        <Button onPress={() => this.checkLoginStatus('WhatsNew')} vertical>
                            <Icon name="megaphone" />
                            <Text style={{fontSize: 9.5}}>Baru</Text>
                        </Button>
                        <Button onPress={() => this.checkLoginStatus('Notification')} vertical>
                            <Icon name="notifications" />
                            <Text style={{fontSize: 9.5}}>Notifikasi</Text>
                        </Button>
                        <Button onPress={() => this.checkLoginStatus('Profile')} vertical>
                            <Icon name="person" />
                            <Text style={{fontSize: 9.5}}>Profil</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        );
    }

}

export default NewGroupScreen;
