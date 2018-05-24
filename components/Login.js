import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, AsyncStorage } from 'react-native';
import { Container, Header, Button, Text, Content, Form, Item, Input, Label, Toast } from 'native-base';
import { auth } from '../firebase';

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
        this.showToastMessage = this.showToastMessage.bind(this);
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
        auth.doSignInWithEmailAndPassword(email, password)
            .then(data => {
                console.log('login>success : ',data)
                setLoginStorate = async () => {
                    try {
                        await AsyncStorage.setItem('user_login', data);
                    } catch (error) {
                        console.log(error);
                    }
                }
                setLoginStorate();
                return this.props.navigation.navigate('Profile');
            })
            .catch(error => {
                if (error.code === 'auth/wrong-password') {
                    this.showToastMessage('Email atau password salah')
                } else {
                    this.showToastMessage('Akun tidak ditemukan')
                }
            });
    }

    showToastMessage (message) {
        Toast.show({
            text: message,
            textStyle: { color: 'yellow' },
            buttonText: 'Close',
            duration: 3000
        })
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