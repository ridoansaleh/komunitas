import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Container, Header, Button, Text, Content, Form, Item, Input, Label } from 'native-base';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

class SignUpScreen extends Component {

    constructor (props) {
        super(props);
        
        this.handleRouteChanges = this.handleRouteChanges.bind(this);
    }

    handleRouteChanges () {
        return this.props.navigation.navigate('Login');
    }

    render() {
        return (
            <Container>
                <Content padder={true}>
                    <Form>
                        <Item floatingLabel>
                            <Label>Nama</Label>
                            <Input />
                        </Item>
                        <Item floatingLabel>
                            <Label>Email</Label>
                            <Input />
                        </Item>
                        <Item floatingLabel>
                            <Label>Kata Sandi</Label>
                            <Input secureTextEntry={true} />
                        </Item>
                        <Item floatingLabel last>
                            <Label>Konfirmasi Kata Sandi</Label>
                            <Input secureTextEntry={true} />
                        </Item>
                        <Button block info style={styles.signUpBtn}>
                            <Text> Daftar </Text>
                        </Button>
                    </Form>
                    <TouchableOpacity onPress={this.handleRouteChanges}>
                        <Text style={styles.loginText}>Sudah punya akun? Login</Text>
                    </TouchableOpacity>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    signUpBtn: {
        marginTop: 20
    },
    loginText: {
        marginTop: 20,
        textAlign: 'center'
    }
});

export default SignUpScreen;