import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Text, Content, Form, Item, View,
         Input, Label, Toast, Spinner, Thumbnail, Icon } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Progress from 'react-native-progress';
import { ImagePicker } from 'expo';
import uuid from 'uuid';
import { getFullDate } from '../utils';
import { ErrorStyles } from '../css/error';
import defaultPhoto from '../images/add_photo.png';
import { auth, db } from '../firebase';
import { st, fbs } from '../firebase/config';

const INITIAL_STATE = {
    userPhoto: null,
    uploadProgress: 0,
    name: '',
    isNameChanged: false,
    isNameValid: false,
    email: '', 
    isEmailChanged: false,
    isEmailValid: false,
    city: '',
    isCityChanged: false,
    isCityValid: false,
    password1: '',
    isPassword1Changed: false,
    isPassword1Valid: false,
    password2: '',
    isPassword2Valid: false,
    isPassword2Changed: false,
    isPasswordShow: false,
    isSpinnerLoading: false
}

class SignUpScreen extends Component {

    constructor (props) {
        super(props);

        this.state = { ...INITIAL_STATE }
        
        this.handleRouteChanges = this.handleRouteChanges.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeCity = this.handleChangeCity.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePassword1 = this.handleChangePassword1.bind(this);
        this.handleChangePassword2 = this.handleChangePassword2.bind(this);
        this.showToastMessage = this.showToastMessage.bind(this);
        this.handleShowPassword = this.handleShowPassword.bind(this);
        this.choosePhoto = this.choosePhoto.bind(this);
        this.uploadImageAsync = this.uploadImageAsync.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleRouteChanges () {
        return this.props.navigation.navigate('Login');
    }

    handleChangeName (value) {
        if (/^[a-zA-Z\ ]+$/.test(value)) {
            this.setState({ name: value, isNameValid: true, isNameChanged: true });
        } else {
            this.setState({ name: value, isNameValid: false, isNameChanged: true });
        }
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

    choosePhoto = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: false,
          aspect: [4, 3]
        });
        
        !result.cancelled
          ? this.uploadImageAsync(result.uri)
          : 0
    }

    uploadImageAsync = async (uri) => {
        let response = await fetch(uri);
        let blob = await response.blob();
        let ref = st.child(uuid.v4());  
        let uploadTask = ref.put(blob);

        uploadTask.on('state_changed', (snapshot) => {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            this.setState({ uploadProgress: progress });
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case fbs.TaskState.PAUSED:
                    console.log('Upload is paused');
                    break;
                case fbs.TaskState.RUNNING:
                    console.log('Upload is running');
                    break;
            }
        }, (error) => {
            console.log(error);
        }, () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                console.log('File available at', downloadURL);
                this.setState({ userPhoto: downloadURL });
            });
        });
    }

    handleSubmit () {
        let { name, email, city, password1, userPhoto } = this.state;
        this.setState({ isSpinnerLoading: true });
        auth.doCreateUserWithEmailAndPassword(email, password1)
            .then(authUser => {
                db.saveUser({
                    id: authUser.uid,
                    name: name,
                    email: email,
                    join_date: getFullDate(),
                    city: city,
                    photo: userPhoto
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

    handleShowPassword () {
        this.setState({ isPasswordShow: !this.state.isPasswordShow });
    }

    render() {
        let { 
            userPhoto, uploadProgress, name, isNameValid, isNameChanged, email, isEmailValid, isEmailChanged,
            city, isCityValid, isCityChanged, password1, isPassword1Valid, isPassword1Changed,
            password2, isPassword2Valid, isPassword2Changed, isPasswordShow, isSpinnerLoading
        } = this.state;

        return (
            <KeyboardAwareScrollView enableOnAndroid={true}>
                <Content padder={true}>
                    <TouchableOpacity style={styles.photoBox} onPress={this.choosePhoto}>
                        {!userPhoto && <Thumbnail large source={defaultPhoto} />}
                        {userPhoto && <Thumbnail large source={{ uri: userPhoto }} />}
                    </TouchableOpacity>
                    <View style={(uploadProgress && uploadProgress < 100) ? styles.progressBox : styles.hide}>
                        <Progress.Bar progress={uploadProgress} />
                        <Text style={{ textAlign: 'center' }}>{Math.floor(uploadProgress)+' %'}</Text>
                    </View>
                    <Form>
                        <Item
                          floatingLabel
                          last
                          error={(isNameChanged && !isNameValid) ? true : false}>
                            <Label>Nama</Label>
                            <Input
                                value={name}
                                onChangeText={(name) => this.handleChangeName(name)}
                            />
                            { (isNameChanged && !isNameValid) && <Icon style={{ marginBottom: 10 }} name='close-circle' /> }
                        </Item>
                        {
                            (!isNameValid && isNameChanged) &&
                            <Item style={ErrorStyles.errorBox}>
                                <Text style={ErrorStyles.errorMessage}>{ 'Nama tidak boleh angka atau karakter spesial' }</Text>
                            </Item>
                        }
                        <Item
                          floatingLabel
                          last
                          error={(isEmailChanged && !isEmailValid) ? true : false}>
                            <Label>Email</Label>
                            <Input
                                value={email}
                                onChangeText={(email) => this.handleChangeEmail(email)}
                            />
                            { (isEmailChanged && !isEmailValid) && <Icon style={{ marginBottom: 10 }} name='close-circle' /> }
                        </Item>
                        {
                            (!isEmailValid && isEmailChanged) &&
                            <Item style={ErrorStyles.errorBox}>
                                <Text style={ErrorStyles.errorMessage}>{ 'Email tidak valid' }</Text>
                            </Item>
                        }
                        <Item
                          floatingLabel
                          last
                          error={(isCityChanged && !isCityValid) ? true : false}>
                            <Label>Kota</Label>
                            <Input
                                value={city}
                                onChangeText={(city) => this.handleChangeCity(city)}
                            />
                            { (isCityChanged && !isCityValid) && <Icon style={{ marginBottom: 10 }} name='close-circle' /> }
                        </Item>
                        {
                            (!isCityValid && isCityChanged) &&
                            <Item style={ErrorStyles.errorBox}>
                                <Text style={ErrorStyles.errorMessage}>{ 'Nama kota terlalu pendek' }</Text>
                            </Item>
                        }
                        <Item
                          floatingLabel
                          last
                          error={(isPassword1Changed && !isPassword1Valid) ? true : false}>
                            <Label>Kata Sandi</Label>
                            <Input
                                value={password1}
                                onChangeText={(password1) => this.handleChangePassword1(password1)}
                                secureTextEntry={ isPasswordShow ? false : true } />
                            <Icon
                              active
                              onPress={() => this.handleShowPassword()}
                              name={!isPasswordShow ? 'ios-eye-off-outline' : 'ios-eye-outline'} />
                        </Item>
                        {
                            (!isPassword1Valid && isPassword1Changed) &&
                            <Item style={ErrorStyles.errorBox}>
                                <Text style={ErrorStyles.errorMessage}>{ 'Password minimal terdiri dari 8 karakter' }</Text>
                            </Item>
                        }
                        <Item
                          floatingLabel
                          last
                          error={(isPassword2Changed && !isPassword2Valid) ? true : false}>
                            <Label>Konfirmasi Kata Sandi</Label>
                            <Input
                                value={password2}
                                onChangeText={(password2) => this.handleChangePassword2(password2)}
                                secureTextEntry={true}
                            />
                            { (isPassword2Changed && !isPassword2Valid) && <Icon name='close-circle' /> }
                        </Item>
                        {
                            (!isPassword2Valid && isPassword2Changed) &&
                            <Item style={ErrorStyles.errorBox}>
                                <Text style={ErrorStyles.errorMessage}>{ 'Konfirmasi password harus sama dengan sebelumnya' }</Text>
                            </Item>
                        }
                        { (userPhoto && isNameValid && isEmailValid && isPassword1Valid && isPassword2Valid) &&
                            <Button block info style={styles.signupBtn} onPress={this.handleSubmit}>
                                { isSpinnerLoading && <Spinner color='green' /> }
                                { !isSpinnerLoading && <Text> Daftar </Text> }
                            </Button> }
                        { (!userPhoto || !isNameValid || !isEmailValid || !isPassword1Valid || !isPassword2Valid) &&
                            <Button disabled block style={styles.signupBtn}>
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
    photoBox: {
        width: '30%',
        marginTop: 20,
        marginLeft: '35%',
        marginRight: '35%'
    },
    progressBox: {
        display: 'flex',
        width: '50%',
        marginLeft: '25%',
        marginRight: '25%',
        marginTop: 15
    },
    hide: {
        display: 'none'
    },
    signupBtn: {
        marginTop: 20
    },
    loginText: {
        marginTop: 20,
        textAlign: 'center'
    }
});

export default SignUpScreen;