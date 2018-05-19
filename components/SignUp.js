import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Container, Header, Button, Text, Content, Form, Item, Input, Label, Toast } from 'native-base';
import { auth } from '../firebase';

class SignUpScreen extends Component {

    constructor (props) {
        super(props);

        this.state = {
            name: '',
            email: '',
            password1: '',
            password2: '',
            isValid: false
        }
        
        this.handleRouteChanges = this.handleRouteChanges.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePassword1 = this.handleChangePassword1.bind(this);
        this.handleChangePassword2 = this.handleChangePassword2.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.showToastMessage = this.showToastMessage.bind(this);
    }

    handleRouteChanges () {
        return this.props.navigation.navigate('Login');
    }

    handleChangeName (value) {
        this.setState({ name: value });
    }

    handleChangeEmail (value) {
        this.setState({ email: value });
    }

    handleChangePassword1 (value) {
        this.setState({ password1: value });
    }

    handleChangePassword2 (value) {
        this.setState({ password2: value });
    }

    handleSubmit () {
        let that = this;
        let { 
            name,
            email,
            password1,
            password2
        } = this.state;

        if (name && email && password1 && password2) {
            if (password1 !== password2) {
                that.showToastMessage('Konfirmasi kata sandi tidak sama');
            } else {
                auth.doCreateUserWithEmailAndPassword(email, password1)
                .then(authUser => {
                    this.setState({ 
                        name: '',
                        email: '',
                        password1: '',
                        password2: '',
                        isValid: false
                    });
                    that.showToastMessage('Kamu berhasil signup, silahkan login!');
                })
                .catch(error => {
                    that.showToastMessage('Kamu gagal signup, coba lagi!');
                });
            }
        } else {
            that.showToastMessage('Tidak boleh ada data yang kosong');
        }
    }

    showToastMessage (message) {
        Toast.show({
            text: message,
            textStyle: { color: 'yellow' },
            buttonText: 'Okay',
            duration: 3000
        })
    }

    render() {
        return (
            <Container>
                <Content padder={true}>
                    <Form>
                        <Item floatingLabel>
                            <Label>Nama</Label>
                            <Input
                                value={this.state.name}
                                onChangeText={(name) => this.handleChangeName(name)}
                            />
                        </Item>
                        <Item floatingLabel>
                            <Label>Email</Label>
                            <Input
                                value={this.state.email}
                                onChangeText={(email) => this.handleChangeEmail(email)}
                            />
                        </Item>
                        <Item floatingLabel>
                            <Label>Kata Sandi</Label>
                            <Input
                                value={this.state.password1}
                                onChangeText={(password1) => this.handleChangePassword1(password1)}
                                secureTextEntry={true}
                            />
                        </Item>
                        <Item floatingLabel last>
                            <Label>Konfirmasi Kata Sandi</Label>
                            <Input
                                value={this.state.password2}
                                onChangeText={(password2) => this.handleChangePassword2(password2)}
                                secureTextEntry={true}
                            />
                        </Item>
                        <Button block info style={styles.signUpBtn} onPress={this.handleSubmit}>
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