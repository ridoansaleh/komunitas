import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Content, Button, Text, Form, Item, Label, Input, Textarea, Picker } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { auth, db } from '../firebase/config';

class NewGroupScreen extends Component {
    
    constructor (props) {
        super(props);

        this.state = {
            isUserLogin: false,
            name: '',
            isNameValid: false,
            isNameChanged: false,
            categorySelected: 'nothing',
            isCategoryValid: false,
            isCategoryChanged: false,
            location: '',
            isLocationValid: false,
            isLocationChanged: false,
            description: '',
            isDescriptionValid: false,
            isDescriptionChanged: false
        }

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleLocationChange = this.handleLocationChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleNameBlur = this.handleNameBlur.bind(this);
        this.handleLocationBlur = this.handleLocationBlur.bind(this);
        this.handleDescriptionBlur = this.handleDescriptionBlur.bind(this);
    }

    componentDidMount () {
        auth.onAuthStateChanged(user => {
            if (user) {
                this.setState({ isUserLogin: true });
            } else {
                return this.props.navigation.navigate('Login');
            }
        });
    }

    handleNameChange (value) {
        if ((value.length >= 10) && (/^[0-9a-zA-Z\_ ]+$/.test(value))) {
            this.setState({ name: value, isNameValid: true, isNameChanged: true });
        } else {
            this.setState({ name: value, isNameValid: false, isNameChanged: true });
        }
    }

    handleNameBlur () {
        if (!this.state.isNameValid) {
            this.setState({ isNameChanged: false });
        }
    }

    handleCategoryChange (value) {
        if (value !== 'nothing') {
            this.setState({ categorySelected: value, isCategoryValid: true, isCategoryChanged: true });
        } else {
            this.setState({ categorySelected: value, isCategoryValid: false, isCategoryChanged: true });
        }
    }

    handleLocationChange (value) {
        if (value.length >= 4) {
            this.setState({ location: value, isLocationValid: true, isLocationChanged: true });
        } else {
            this.setState({ location: value, isLocationValid: false, isLocationChanged: true });
        }
    }

    handleLocationBlur () {
        if (!this.state.isLocationValid) {
            this.setState({ isLocationChanged: false });
        }
    }

    handleDescriptionChange (value) {
        if (value.length >= 30) {
            this.setState({ description: value, isDescriptionValid: true, isDescriptionChanged: true });
        } else {
            this.setState({ description: value, isDescriptionValid: false, isDescriptionChanged: true });
        }
    }

    handleDescriptionBlur (value) {
        if (!this.state.isDescriptionValid) {
            this.setState({ isDescriptionChanged: false });
        }
    }

    render () {
        let { name, isNameValid, isNameChanged, categorySelected, isCategoryValid, isCategoryChanged, location,
              isLocationValid, isLocationChanged, description, isDescriptionValid, isDescriptionChanged } = this.state;
        return (
            <KeyboardAwareScrollView enableOnAndroid={true}>
                <Content padder={true}>
                    <Form>
                        <Item floatingLabel last style={isNameChanged && !isNameValid ? styles.errorBorder : {}}>
                            <Label>Nama Grup</Label>
                            <Input
                                value={name}
                                onChangeText={this.handleNameChange}
                                onBlur={this.handleNameBlur}
                            />
                        </Item>
                        {
                            !isNameValid && isNameChanged &&
                            <Item style={styles.errorBox}>
                                <Text style={styles.errorMessage}>{ 'Tidak boleh kosong, kurang dari 10 karakter atau karakter spesial' }</Text>
                            </Item>
                        }
                        <Item last style={isCategoryChanged && !isCategoryValid ? styles.errorBorder : { paddingTop: 10, paddingBottom: 3 }}>
                            <Picker
                                mode="dropdown"
                                selectedValue={categorySelected}
                                onValueChange={this.handleCategoryChange}>
                                <Picker.Item disabled label="Pilih Kategori" value="nothing" />
                                <Picker.Item label="Belajar" value="belajar" />
                                <Picker.Item label="Bisnis" value="bisnis" />
                                <Picker.Item label="Musik" value="musik" />
                                <Picker.Item label="Olahraga" value="olahraga" />
                                <Picker.Item label="Travelling" value="travelling" />
                            </Picker>
                        </Item>
                        {
                            !isCategoryValid && isCategoryChanged &&
                            <Item style={styles.errorBox}>
                                <Text style={styles.errorMessage}>{ 'Kategori harus dipilih' }</Text>
                            </Item>
                        }
                        <Item floatingLabel last style={isLocationChanged && !isLocationValid ? styles.errorBorder : {}}>
                            <Label>Lokasi</Label>
                            <Input
                                value={location}
                                onChangeText={this.handleLocationChange}
                                onBlur={this.handleLocationBlur}
                            />
                        </Item>
                        {
                            !isLocationValid && isLocationChanged &&
                            <Item style={styles.errorBox}>
                                <Text style={styles.errorMessage}>{ 'Lokasi harus diisi dan minimal 4 karakter' }</Text>
                            </Item>
                        }
                        <Textarea
                            rowSpan={5}
                            value={description}
                            onChangeText={this.handleDescriptionChange}
                            onBlur={this.handleDescriptionBlur}
                            bordered
                            style={isDescriptionChanged && !isDescriptionValid ? styles.errorBorder : { paddingTop: 5 }}
                            placeholder="Deskripsi" />
                        {
                            !isDescriptionValid && isDescriptionChanged &&
                            <Item style={styles.errorBox}>
                                <Text style={styles.errorMessage}>{ 'Deskripsi minimal mengandung 30 karakter' }</Text>
                            </Item>
                        }
                        { isNameValid && isCategoryValid && isLocationValid && isDescriptionValid &&
                            <Button block info style={{ marginTop: 5 }}>
                                <Text> Submit </Text>
                            </Button> }
                        { (!isNameValid || !isCategoryValid || !isLocationValid || !isDescriptionValid) &&
                            <Button block disabled style={{ marginTop: 5 }}>
                                <Text> Submit </Text>
                            </Button> }
                    </Form>
                </Content>
            </KeyboardAwareScrollView>
        );
    }
}

const styles = StyleSheet.create({
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

export default NewGroupScreen;
