import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, TouchableHighlight, Alert, CameraRoll } from 'react-native';
import { Container, Header, Button, Text, Content, Form, Item,
         Input, Label, Toast, Icon, ListItem, CheckBox, Body,
         Spinner, Thumbnail, Picker } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getFullDate } from '../utils';
import { ErrorStyles } from '../css/error';
import defaultPhoto from '../data/icon/camera.png';
import { auth, db } from '../firebase';

const INITIAL_STATE = {
    name: '', 
    email: '', 
    city: '',
    password1: '', 
    password2: '',
    isNameValid: false,
    isEmailValid: false,
    isEmailChanged: false,
    isCityValid: false,
    isCityChanged: false,
    isPassword1Valid: false,
    isPassword1Changed: false,
    isPassword2Valid: false,
    isPassword2Changed: false,
    isPasswordChecked: false,
    isSpinnerLoading: false
}

class SignUpScreen extends Component {

    constructor (props) {
        super(props);

        this.state = { ...INITIAL_STATE }
        
        this.handlePhotoUploadOptions = this.handlePhotoUploadOptions.bind(this);
        this.handleRouteChanges = this.handleRouteChanges.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeCity = this.handleChangeCity.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePassword1 = this.handleChangePassword1.bind(this);
        this.handleChangePassword2 = this.handleChangePassword2.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.showToastMessage = this.showToastMessage.bind(this);
        this.handlePasswordCheck = this.handlePasswordCheck.bind(this);
        this._showCamera = this._showCamera.bind(this);
    }

    handleRouteChanges () {
        return this.props.navigation.navigate('Login');
    }

    handleChangeName (value) {
        this.setState({ name: value, isNameValid: true });
    }

    handleChangeEmail (value) {
        if (/(.+)@(.+){2,}\.(.+){2,}/.test(value)) {
            this.setState({ email: value, isEmailValid: true, isEmailChanged: true });
        } else {
            this.setState({ email: value, isEmailValid: false, isEmailChanged: true })
        }
    }

    handleChangeCity (value) {
        if (value.length >= 3) {
            this.setState({ city: value, isCityValid: true, isCityChanged: true });
        } else {
            this.setState({ city: value, isCityValid: false, isCityChanged: true });
        }
    }

    handleChangePassword1 (value) {
        if (value.length >= 8) {
            this.setState({ password1: value, isPassword1Valid: true, isPassword1Changed: true });
        } else {
            this.setState({ password1: value, isPassword1Valid: false, isPassword1Changed: true });
        }
    }

    handleChangePassword2 (value) {
        if (this.state.password1 === value) {
            this.setState({ password2: value, isPassword2Valid: true, isPassword2Changed: true });
        } else {
            this.setState({ password2: value, isPassword2Valid: false, isPassword2Changed: true });
        }
    }

    handleSubmit () {
        let { name, email, city, password1, password2 } = this.state;
        this.setState({ isSpinnerLoading: true });
        auth.doCreateUserWithEmailAndPassword(email, password1)
            .then(authUser => {
                db.saveUser({
                    id: authUser.uid,
                    name: name,
                    email: email,
                    join_date: getFullDate(),
                    city: city,
                    photo: '-'
                });
                this.setState({ ...INITIAL_STATE });
                this.showToastMessage('Kamu berhasil signup, silahkan login!');
            })
            .catch(error => {
                this.setState({ isSpinnerLoading: false });
                if (error.code === 'auth/email-already-in-use') {
                    this.showToastMessage('Email tersebut sudah digunakan akun lain');
                } else {
                    this.showToastMessage('Kamu gagal signup, coba lagi!');
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

    handlePasswordCheck () {
        this.setState({ isPasswordChecked: !this.state.isPasswordChecked });
    }

    _showCamera () {
        CameraRoll.getPhotos({
            first: 20,
            assetType: 'Photos',
          })
          .then(r => {
            this.setState({ photos: r.edges });
          })
          .catch((err) => {
             //Error Loading Images
          });
    }

    handlePhotoUploadOptions () {
        let that = this;
        Alert.alert(
            'Photo Profil',
            'Bagaimana Anda mengupload photo ?',
            [
              {text: 'Camera', onPress: () => this._showCamera() },
              {text: 'Gallery', onPress: () => console.log('open gallery')},
            ],
            { cancelable: true }
        )
    }

    render() {
        let { 
            name, email, city, password1, password2, isNameValid,
            isEmailValid, isEmailChanged, isCityValid, isCityChanged, 
            isPassword1Valid, isPassword1Changed, isPassword2Valid, 
            isPassword2Changed, isPasswordChecked, isSpinnerLoading
        } = this.state;

        return (
            <KeyboardAwareScrollView enableOnAndroid={true}>
                <Content padder={true}>
                    <TouchableOpacity style={{ width: '30%', marginLeft: '35%', marginRight: '35%' }} onPress={this.handlePhotoUploadOptions}>
                        <Thumbnail large source={defaultPhoto} />
                    </TouchableOpacity>
                    <Form>
                        <Item floatingLabel last>
                            <Label>Nama</Label>
                            <Input
                                value={name}
                                onChangeText={(name) => this.handleChangeName(name)}
                            />
                        </Item>
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
                        <Item floatingLabel last style={isCityChanged && !isCityValid ? ErrorStyles.errorBorder : {}}>
                            <Label>City</Label>
                            <Input
                                value={city}
                                onChangeText={(city) => this.handleChangeCity(city)}
                            />
                        </Item>
                        {
                            !isCityValid && isCityChanged &&
                            <Item style={ErrorStyles.errorBox}>
                                <Text style={ErrorStyles.errorMessage}>{ 'Nama kota terlalu pendek' }</Text>
                            </Item>
                        }
                        <Item floatingLabel last style={isPassword1Changed && !isPassword1Valid ? ErrorStyles.errorBorder : {}}>
                            <Label>Kata Sandi</Label>
                            <Input
                                value={password1}
                                onChangeText={(password1) => this.handleChangePassword1(password1)}
                                secureTextEntry={ isPasswordChecked ? false : true }
                            />
                        </Item>
                        {
                            !isPassword1Valid && isPassword1Changed &&
                            <Item style={ErrorStyles.errorBox}>
                                <Text style={ErrorStyles.errorMessage}>{ 'Password minimal terdiri dari 8 karakter' }</Text>
                            </Item>
                        }
                        <Item floatingLabel last style={isPassword2Changed && !isPassword2Valid ? ErrorStyles.errorBorder : {}}>
                            <Label>Konfirmasi Kata Sandi</Label>
                            { isPassword1Valid && 
                                <Input
                                    value={password2}
                                    onChangeText={(password2) => this.handleChangePassword2(password2)}
                                    secureTextEntry={ isPasswordChecked ? false : true }
                                /> }
                            { !isPassword1Valid && 
                                <Input 
                                    disabled
                                    value={''}
                                /> }
                        </Item>
                        {
                            !isPassword2Valid && isPassword2Changed &&
                            <Item style={ErrorStyles.errorBox}>
                                <Text style={ErrorStyles.errorMessage}>{ 'Konfirmasi password harus sama dengan sebelumnya' }</Text>
                            </Item>
                        }
                        <ListItem style={ErrorStyles.errorBox} onPress={() => this.handlePasswordCheck()}>
                            <CheckBox checked={ isPasswordChecked ? true : false } />
                            <Body>
                                <Text>Lihat Password</Text>
                            </Body>
                        </ListItem>
                        { isNameValid && isEmailValid && isPassword1Valid && isPassword2Valid &&
                            <Button block info style={styles.signupBtn} onPress={this.handleSubmit}>
                                { isSpinnerLoading && <Spinner color='green' /> }
                                { !isSpinnerLoading && <Text> Daftar </Text> }
                            </Button> }
                        { (!isNameValid || !isEmailValid || !isPassword1Valid || !isPassword2Valid) &&
                            <Button disabled block style={styles.signupBtn} onPress={this.handleSubmit}>
                                <Text> Daftar </Text>
                            </Button> }
                    </Form>
                    <TouchableOpacity onPress={this.handleRouteChanges}>
                        <Text style={styles.loginText}>Sudah punya akun? Login</Text>
                    </TouchableOpacity>
                </Content>
            </KeyboardAwareScrollView>
        );
    }
}

const styles = StyleSheet.create({
    signupBtn: {
        marginTop: 20
    },
    loginText: {
        marginTop: 20,
        textAlign: 'center'
    }
});

export default SignUpScreen;