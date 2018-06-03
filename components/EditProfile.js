import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Container, Content, Form, Item, Label, Input, Text, Button, Thumbnail } from 'native-base';
import { db } from '../firebase/config';
import defaultPhoto from '../data/icon/camera.png';

const INITIAL_STATE = {
    name: '',
    isNameValid: false,
    isNameChanged: false,
    city: '',
    isCityValid: false,
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
        this.handleSubmit = this.handleSubmit.bind(this);
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

    handleSubmit () {
        let { name, city, userId } = this.state;
        let userRef = db.ref('/users/'+userId);
        userRef.update({
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
        let { name, isNameValid, isNameChanged, city, isCityValid, isCityChanged } = this.state; 
        return (
            <Container>
                <Content padder={true}>
                    <TouchableOpacity style={styles.photoUploadBox}>
                        <Thumbnail large source={defaultPhoto} />
                    </TouchableOpacity>
                    <Form>
                        <Item floatingLabel last style={isNameChanged && !isNameValid ? styles.errorBorder : {}}>
                            <Label>Nama</Label>
                            <Input
                                value={name}
                                onChangeText={(name) => this.handleChangeName(name)}
                            />
                        </Item>
                        {
                            !isNameValid && isNameChanged &&
                            <Item style={styles.errorBox}>
                                <Text style={styles.errorMessage}>{ 'Nama minimal terdiri dari 3 karakter' }</Text>
                            </Item>
                        }
                        <Item floatingLabel last style={isCityChanged && !isCityValid ? styles.errorBorder : {}}>
                            <Label>Kota</Label>
                            <Input
                                value={city}
                                onChangeText={(city) => this.handleChangeCity(city)}
                            />
                        </Item>
                        {
                            !isCityValid && isCityChanged &&
                            <Item style={styles.errorBox}>
                                <Text style={styles.errorMessage}>{ 'Kota minimal terdiri dari 4 karakter' }</Text>
                            </Item>
                        }
                        { (isNameValid && isCityValid) &&
                            <Button block info style={styles.saveBtn} onPress={this.handleSubmit} >
                                <Text>Simpan</Text>
                            </Button> }
                        { (!isNameValid || !isCityValid) &&
                            <Button block disabled style={styles.saveBtn}>
                                <Text>Simpan</Text>
                            </Button> }
                    </Form>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    photoUploadBox: {
        width: '30%',
        marginLeft: '35%',
        marginRight: '35%'
    },
    saveBtn: {
        marginTop: 10
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

export default EditProfileScreen;