import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Container, Header, Button, Text, Content, Form, Item, Input, Label } from 'native-base';
import { StackNavigator } from 'react-navigation';

class LoginScreen extends Component {

    constructor (props) {
        super(props);
        
        this.handleRouteChanges = this.handleRouteChanges.bind(this);
    }

    handleRouteChanges () {
        return this.props.navigation.navigate('SignUp');
    }

    render() {
        return (
            <Container>
                <Content padder={true} style={styles.content}>
                <Form>
                    <Item floatingLabel>
                    <Label>Email</Label>
                    <Input />
                    </Item>
                    <Item floatingLabel last>
                    <Label>Password</Label>
                    <Input secureTextEntry={true} />
                    </Item>
                    <Button block info style={styles.loginBtn}>
                        <Text> Masuk </Text>
                    </Button>
                </Form>
                <TouchableOpacity onPress={this.handleRouteChanges}>
                    <Text style={styles.signupText}>Belum punya akun? Daftar di sini</Text>
                </TouchableOpacity>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        height: '60%',
        marginTop: '30%',
        marginBottom: '10%'
    },
    loginBtn: {
        marginTop: 20
    },
    signupText: {
        marginTop: 20,
        textAlign: 'center'
    }
});

export default LoginScreen;