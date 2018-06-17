import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Alert, AsyncStorage } from 'react-native';
import { Content, Form, Item, Label, Input, Text, Button, Thumbnail } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ImagePicker } from 'expo';
import uuid from 'uuid';
import { ErrorStyles } from '../../css/error';
import { db, st } from '../../firebase/config';
import defaultPhoto from '../../images/camera.png';

const INITIAL_STATE = {
    photo: null,
    name: '',
    isNameValid: false,
    isNameChanged: false,
    city: '',
    isCityValid: false,
    isCityChanged: false,
    _name: '',
    _city: '',
    _photo: ''
}

class EditProfileScreen extends Component {

    constructor (props) {
        super(props);

        this.state = {
            ...INITIAL_STATE,
            userId: this.props.navigation.state.params.user_key
        };

        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeCity = this.handleChangeCity.bind(this);
        this.showDialogMessage = this.showDialogMessage.bind(this);
        this.choosePhoto = this.choosePhoto.bind(this);
        this.handlePhotoPicked = this.handlePhotoPicked.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.isInputsValid = this.isInputsValid.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount () {
        let old_name, old_city, old_photo = '';
        let userRef = db.ref('/users/'+this.state.userId);

        AsyncStorage.getItem('_name').then(data => old_name = data);
        AsyncStorage.getItem('_city').then(data => old_city = data);
        AsyncStorage.getItem('_photo').then(data => old_photo = data);

        userRef.on('value', (data) => {
            let user = data.val();
            setTimeout(() => {
                if (old_name && old_city && old_photo) {
                    this.setState({
                        name: user.name,
                        city: user.city,
                        photo: user.photo,
                        _name: old_name,
                        _city: old_city,
                        _photo: old_photo
                    });
                }
            }, 1000);
        });
    }

    isInputsValid () {
        let { name, city, photo,
              _name, _city, _photo } = this.state;
        if ((name && name.trim() === _name) &&
            (city && city.trim() === _city) &&
            (photo && photo.trim() === _photo)) {
            return false;
        } else {
            return true;
        }
    }

    handleChangeName (value) {
        if (value.length >= 3) {
            this.setState({ name: value, isNameValid: true, isNameChanged: true });
        } else {
            this.setState({ name: value, isNameValid: false, isNameChanged: true });
        }
    }

    handleChangeCity (value) {
        if (value.length >= 4) {
            this.setState({ city: value, isCityValid: true, isCityChanged: true });
        } else {
            this.setState({ city: value, isCityValid: false, isCityChanged: true });
        }
    }

    showDialogMessage (title, message) {
        Alert.alert(
            title,
            message,
            [
              {text: 'Tutup', onPress: () => console.log('Tutup diaglog')},
              {text: 'Kembali', onPress: () => this.props.navigation.navigate('Profile') }
            ],
            { cancelable: true }
        );
    }

    choosePhoto = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: false,
          aspect: [4, 3]
        });
        this.handlePhotoPicked(result);
    }

    handlePhotoPicked = async result => {
        try {
            if (!result.cancelled) {
                uploadUrl = await this.uploadImage(result.uri);
                this.setState({ photo: uploadUrl });
            }
        } catch (e) {
            console.log('Error while trying to upload user photo');
        } finally {
            console.log('Photo have been uploaded');
        }
    }

    uploadImage = async (uri) => {
        let response = await fetch(uri);
        let blob = await response.blob();
        let ref = st.child(uuid.v4());  
        let snapshot = await ref.put(blob);
        return snapshot.downloadURL;
    }

    handleSubmit () {
        let { photo, name, city, userId } = this.state;
        let userRef = db.ref('/users/'+userId);
        userRef.update({
            'name': name,
            'city': city,
            'photo': photo
        }).then(() => {
            AsyncStorage.setItem('_name', name);
            AsyncStorage.setItem('_city', city);
            AsyncStorage.setItem('_photo', photo);
            this.showDialogMessage(
                'Sukses',
                'Selamat Anda berhasil mengubah profil'
            );
        }).catch(() => {
            this.showDialogMessage(
                'Error',
                'Maaf, tidak bisa mengubah profil. Terjadi kesalahan.'
            );
        });
    }

    render () {
        let { photo, name, isNameValid, isNameChanged, city, isCityValid, isCityChanged } = this.state;
        return (
            <KeyboardAwareScrollView enableOnAndroid={true}>
                <Content padder={true} style={styles.content}>
                    <TouchableOpacity style={styles.photoUploadBox} onPress={this.choosePhoto}>
                        { !photo && <Thumbnail large source={defaultPhoto} /> }
                        { photo && <Thumbnail large source={{ uri: photo }} /> }
                    </TouchableOpacity>
                    <Form>
                        <Item floatingLabel last style={isNameChanged && !isNameValid ? ErrorStyles.errorBorder : {}}>
                            <Label>Nama</Label>
                            <Input
                                value={name}
                                onChangeText={(name) => this.handleChangeName(name)}
                            />
                        </Item>
                        {
                            !isNameValid && isNameChanged &&
                            <Item style={ErrorStyles.errorBox}>
                                <Text style={ErrorStyles.errorMessage}>{ 'Nama minimal terdiri dari 3 karakter' }</Text>
                            </Item>
                        }
                        <Item floatingLabel last style={isCityChanged && !isCityValid ? ErrorStyles.errorBorder : {}}>
                            <Label>Kota</Label>
                            <Input
                                value={city}
                                onChangeText={(city) => this.handleChangeCity(city)}
                            />
                        </Item>
                        {
                            !isCityValid && isCityChanged &&
                            <Item style={ErrorStyles.errorBox}>
                                <Text style={ErrorStyles.errorMessage}>{ 'Kota minimal terdiri dari 4 karakter' }</Text>
                            </Item>
                        }
                        { this.isInputsValid() &&
                            <Button block info style={styles.saveBtn} onPress={this.handleSubmit} >
                                <Text>Simpan</Text>
                            </Button> }
                        { !this.isInputsValid() &&
                            <Button block disabled style={styles.saveBtn}>
                                <Text>Simpan</Text>
                            </Button> }
                    </Form>
                </Content>
            </KeyboardAwareScrollView>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        height: '50%',
        marginTop: '25%',
        marginBottom: '25%'
    },
    photoUploadBox: {
        width: '30%',
        marginLeft: '35%',
        marginRight: '35%'
    },
    saveBtn: {
        marginTop: 10
    }
});

export default EditProfileScreen;