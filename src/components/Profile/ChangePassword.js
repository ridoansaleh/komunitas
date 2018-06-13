import React, { Component } from 'react';
import { StyleSheet, Alert, AsyncStorage } from 'react-native';
import { Content, Form, Item, Label, Input, Text, Button } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ErrorStyles } from '../../css/error';
import { auth } from '../../firebase';

const INITIAL_STATE = {
    password: '',
    isPasswordValid: false,
    isPasswordChanged: false,
    new_password: '',
    isNewPasswordValid: false,
    isNewPasswordChanged: false,
    retype_password: '',
    isRetypePasswordValid: false,
    isRetypePasswordChanged: false,
    _pass: null
}

class ChangePasswordScreen extends Component {

    constructor (props) {
        super(props);

        this.state = {
            ...INITIAL_STATE
        };

        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleChangeNewPassword = this.handleChangeNewPassword.bind(this);
        this.handleChangePasswordConfirmation = this.handleChangePasswordConfirmation.bind(this);
        this.showDialogMessage = this.showDialogMessage.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount () {
        AsyncStorage.getItem('_pass').then(pass => {
            this.setState({ _pass: pass });
        });
    }

    handleChangePassword (value) {
        if (value === this.state._pass) {
            this.setState({ password: value, isPasswordValid: true, isPasswordChanged: true });
        } else {
            this.setState({ password: value, isPasswordValid: false, isPasswordChanged: true });
        }
    }

    handleChangeNewPassword (value) {
        if (value.length >= 8) {
            this.setState({ new_password: value, isNewPasswordValid: true, isNewPasswordChanged: true });
        } else {
            this.setState({ new_password: value, isNewPasswordValid: false, isNewPasswordChanged: true });
        }
    }

    handleChangePasswordConfirmation (value) {
        if (value === this.state.new_password) {
            this.setState({ retype_password: value, isRetypePasswordValid: true, isRetypePasswordChanged: true });
        } else {
            this.setState({ retype_password: value, isRetypePasswordValid: false, isRetypePasswordChanged: true });
        }
    }

    showDialogMessage (title, message) {
        Alert.alert(
            title,
            message,
            [
              {text: 'Tutup', onPress: () => console.log('Tutup diaglog')},
              {text: 'Kembali', onPress: () => this.props.navigation.goBack() }
            ],
            { cancelable: true }
        );
    }

    handleSubmit () {
        let { new_password } = this.state;
        auth.doPasswordUpdate(new_password)
            .then((data) => {
                try {
                    AsyncStorage.setItem('_pass', new_password);
                } catch (error) {
                    console.log('Error while set storage : ',error);
                }
                this.showDialogMessage(
                    'Sukses',
                    'Password Anda berhasil diperbaharui'
                );
            })
            .catch(error => {
                this.showDialogMessage(
                    'Error',
                    'Tidak bisa mengubah password. Silahkan login kembali !'
                );
            });
    }

    render () {
        let { password, isPasswordValid, isPasswordChanged,
              new_password, isNewPasswordValid, isNewPasswordChanged,
              retype_password, isRetypePasswordValid, isRetypePasswordChanged } = this.state;
        return (
            <KeyboardAwareScrollView enableOnAndroid={true}>
                <Content style={styles.content}>
                    <Form>
                        <Item floatingLabel last style={isPasswordChanged && !isPasswordValid ? ErrorStyles.errorBorder : {}}>
                            <Label>Password</Label>
                            <Input
                                value={password}
                                secureTextEntry={true}
                                onChangeText={(password) => this.handleChangePassword(password)}
                            />
                        </Item>
                        {
                            !isPasswordValid && isPasswordChanged &&
                            <Item style={ErrorStyles.errorBox}>
                                <Text style={ErrorStyles.errorMessage}>{ 'Password Anda salah' }</Text>
                            </Item>
                        }
                        <Item floatingLabel last style={isNewPasswordChanged && !isNewPasswordValid ? ErrorStyles.errorBorder : {}}>
                            <Label>Password Baru</Label>
                            <Input
                                value={new_password}
                                secureTextEntry={true}
                                onChangeText={(new_password) => this.handleChangeNewPassword(new_password)}
                            />
                        </Item>
                        {
                            !isNewPasswordValid && isNewPasswordChanged &&
                            <Item style={ErrorStyles.errorBox}>
                                <Text style={ErrorStyles.errorMessage}>{ 'Password minimal terdiri dari 8 karakter' }</Text>
                            </Item>
                        }
                        <Item floatingLabel last style={isRetypePasswordChanged && !isRetypePasswordValid ? ErrorStyles.errorBorder : {}}>
                            <Label>Konfirmasi Password Baru</Label>
                            <Input
                                value={retype_password}
                                secureTextEntry={true}
                                onChangeText={(retype_password) => this.handleChangePasswordConfirmation(retype_password)}
                            />
                        </Item>
                        {
                            !isRetypePasswordValid && isRetypePasswordChanged &&
                            <Item style={ErrorStyles.errorBox}>
                                <Text style={ErrorStyles.errorMessage}>{ 'Konfirmasi password harus sama dengan password baru' }</Text>
                            </Item>
                        }
                        { (isPasswordValid && isRetypePasswordValid) &&
                            <Button block info style={styles.changeBtn} onPress={this.handleSubmit}>
                                <Text>Ubah</Text>
                            </Button> }
                        { (!isPasswordValid || !isRetypePasswordValid) && 
                            <Button block disabled style={styles.changeBtn}>
                                <Text>Ubah</Text>
                            </Button> }
                    </Form>
                </Content>
            </KeyboardAwareScrollView>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        height: '40%',
        marginTop: '30%',
        marginBottom: '30%',
        padding: 10
    },
    changeBtn: {
        marginTop: 10
    }
});

export default ChangePasswordScreen;