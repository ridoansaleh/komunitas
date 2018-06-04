import React, { Component } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { Container, Content, Form, Item, Label, Input, Text, Button } from 'native-base';
import { ErrorStyles } from '../css/error';
import { auth } from '../firebase';

const INITIAL_STATE = {
    email: '',
    isEmailValid: false,
    isEmailChanged: false
}

class ResetPasswordScreen extends Component {

    constructor (props) {
        super(props);

        this.state = {
            ...INITIAL_STATE
        };

        this.handleChangeEmail = this.handleChangeEmail.bind(this);
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

    showDialogMessage (title, message) {
        Alert.alert(
            title,
            message,
            [
              {text: 'Tutup', onPress: () => console.log('Tutup diaglog')}
            ],
            { cancelable: true }
        );
    }

    handleSubmit () {
        let { email } = this.state;
        auth.doPasswordReset(email)
            .then((data) => {
                this.setState({ ...INITIAL_STATE });
                this.showDialogMessage(
                    'Sukses',
                    'Permintaan reset password berhasil. Silahkan cek email Anda untuk membuat password baru !'
                );
            })
            .catch(error => {
                this.showDialogMessage(
                    'Error',
                    'Tidak bisa melakukan reset password. Pastikan email yang Anda masukkan adalah email yang eksis.'
                );
            });
    }

    render () {
        let { email, isEmailValid, isEmailChanged } = this.state;
        return (
            <Container>
                <Content style={styles.content}>
                    <Form>
                        <Item floatingLabel last style={isEmailChanged && !isEmailValid ? ErrorStyles.errorBorder : {}}>
                            <Label>Email</Label>
                            <Input
                                value={email}
                                onChangeText={(email) => this.handleChangeEmail(email)}
                            />
                        </Item>
                        {
                            !isEmailValid && isEmailChanged &&
                            <Item style={ErrorStyles.errorBox}>
                                <Text style={ErrorStyles.errorMessage}>{ 'Email tidak valid' }</Text>
                            </Item>
                        }
                        { isEmailValid && <Button block info style={styles.resetBtn} onPress={this.handleSubmit}>
                            <Text>Reset</Text>
                        </Button> }
                        { !isEmailValid && <Button block disabled style={styles.resetBtn}>
                            <Text>Reset</Text>
                        </Button> }
                    </Form>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        height: '20%',
        marginTop: '40%',
        marginBottom: '40%',
        padding: 10
    },
    resetBtn: {
        marginTop: 10
    }
});

export default ResetPasswordScreen;