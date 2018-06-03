import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, AsyncStorage, Alert } from 'react-native';
import { Container, View, Header, Button, Text, Content, Form, Item, Input, Label } from 'native-base';
import { auth as authenticate } from '../firebase';
import { auth } from '../firebase/config';

class LoginScreen extends Component {

    constructor (props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            isEmailValid: false,
            isEmailChanged: false,
            isPasswordValid: false
        }
        
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleRouteChanges = this.handleRouteChanges.bind(this);
        this.showDialogMessage = this.showDialogMessage.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeEmail (value) {
        if (/(.+)@(.+){2,}\.(.+){2,}/.test(value)) {
            this.setState({ email: value, isEmailValid: true, isEmailChanged: true });
        } else {
            this.setState({ email: value, isEmailValid: false, isEmailChanged: true })
        }
    }

    handleChangePassword (value) {
        if (value) {
            this.setState({ password: value, isPasswordValid: true });
        } else {
            this.setState({ password: value, isPasswordValid: false });
        }
    }

    handleSubmit () {
        let { email, password } = this.state;
        authenticate.doSignInWithEmailAndPassword(email, password)
            .then(data => {
                auth.onAuthStateChanged(user => {
                    if (user) {
                        return this.props.navigation.navigate('Profile');
                    }
                });
            })
            .catch(error => {
                if (error.code === 'auth/wrong-password') {
                    this.showDialogMessage(
                        'Tidak Valid',
                        'Email atau password Anda salah. Ingin mengatur ulang password ?',
                        'Lupa password',
                        'ResetPassword'
                    );
                } else {
                    this.showDialogMessage(
                        'Error',
                        'Akun ini tidak ada. Apakah Anda ingin membuat akun baru ?',
                        'Daftar',
                        'SignUp'
                    );
                }
            });
    }

    showDialogMessage (title, message, action, url) {
        Alert.alert(
            title,
            message,
            [
              {text: 'Tutup', onPress: () => {
                  console.log('Tutup diaglog');
              }},
              {text: action, onPress: () => {
                  return this.props.navigation.navigate(url);
              }}
            ],
            { cancelable: true }
        );
    }

    handleRouteChanges () {
        return this.props.navigation.navigate('SignUp');
    }

    render() {
        let { 
            email, password, 
            isEmailValid, isEmailChanged,
            isPasswordValid
        } = this.state;
        return (
            <Container>
                <Content padder={true} style={styles.content}>
                    <Form>
                        <Item floatingLabel style={isEmailChanged && !isEmailValid ? styles.errorBorder : {}}>
                            <Label>Email</Label>
                            <Input
                                value={email}
                                onChangeText={(email) => this.handleChangeEmail(email)}
                            />
                        </Item>
                        {
                            !isEmailValid && isEmailChanged &&
                            <Item style={styles.errorBox}>
                                <Text style={styles.errorMessage}>{ 'Email tidak valid' }</Text>
                            </Item>
                        }
                        <Item floatingLabel last>
                            <Label>Password</Label>
                            <Input
                                value={password}
                                onChangeText={(password) => this.handleChangePassword(password)}  
                                secureTextEntry={true}
                            />
                        </Item>
                        { (isEmailValid && isPasswordValid) && <Button block info style={styles.loginBtn} onPress={this.handleSubmit}>
                            <Text> Masuk </Text>
                        </Button> }
                        { (!isEmailValid || !isPasswordValid) && <Button block info style={styles.loginBtn} disabled>
                            <Text> Masuk </Text>
                        </Button> }
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
    },
    errorBox: {
        borderBottomWidth : 0
    },
    errorMessage: {
        fontSize: 12,
        color: '#FF5733'
    },
    errorBorder: {
        borderBottomColor: '#FF5733',
        borderBottomWidth: 2
    }
});

export default LoginScreen;