import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Container, Content, Form, Item, Label, Input, Text, Button, Thumbnail } from 'native-base';
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
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeName (value) {

    }

    handleChangeCity (value) {

    }

    handleSubmit () {

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
                        <Item floatingLabel last>
                            <Label>Nama</Label>
                            <Input
                                value={name}
                                onChangeText={(name) => this.handleChangeName(name)}
                            />
                        </Item>
                        <Item floatingLabel last>
                            <Label>Kota</Label>
                            <Input
                                value={city}
                                onChangeText={(city) => this.handleChangeCity(city)}
                            />
                        </Item>
                        <Button block info style={styles.saveBtn}>
                            <Text>Simpan</Text>
                        </Button>
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