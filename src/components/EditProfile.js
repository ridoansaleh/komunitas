import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Content, Form, Item, Label, Input, Text, Button, Thumbnail } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ImagePicker } from 'expo';
import uuid from 'uuid';
import { ErrorStyles } from '../css/error';
import { db, st } from '../firebase/config';
import defaultPhoto from '../data/icon/camera.png';

const INITIAL_STATE = {
    photo: null,
    name: '',
    isNameValid: true,
    isNameChanged: false,
    city: '',
    isCityValid: true,
    isCityChanged: false
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
        this.uploadImageAsync = this.uploadImageAsync.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount () {
        let userRef = db.ref('/users/'+this.state.userId);
        userRef.on('value', (data) => {
            let user = data.val();
            this.setState({
                photo: user.photo,
                name: user.name,
                city: user.city
            });
        });
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
                uploadUrl = await this.uploadImageAsync(result.uri);
                this.setState({ photo: uploadUrl });
            }
        } catch (e) {
            console.log('Error while trying to upload user photo');
        } finally {
            console.log('Photo have been uploaded');
        }
    }

    uploadImageAsync = async (uri) => {
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
            photo: photo,
            name: name,
            city: city
        }).then(() => {
            this.showDialogMessage(
                'Sukses',
                'Selamat Anda berhasil mengubah profil'
            );
        }).catch((error) => {
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
                        { (photo && isNameValid && isCityValid) &&
                            <Button block info style={styles.saveBtn} onPress={this.handleSubmit} >
                                <Text>Simpan</Text>
                            </Button> }
                        { (!photo || !isNameValid || !isCityValid) &&
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