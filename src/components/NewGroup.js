import React, { Component } from 'react';
import { StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Content, Button, Text, Form, Item, Label, Input, Textarea, Picker, Thumbnail } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ImagePicker } from 'expo';
import uuid from 'uuid';
import { ErrorStyles } from '../css/error';
import defaultPhoto from '../images/group.png';
import { auth, st } from '../firebase/config';
import { getFullDate } from '../utils';
import { db as database } from '../firebase';

const INITIAL_STATE = {
    isUserLogin: false,
    userId: null,
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
    isDescriptionChanged: false,
    groupPhoto: null
}

class NewGroupScreen extends Component {
    
    constructor (props) {
        super(props);

        this.state = { ...INITIAL_STATE }

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleLocationChange = this.handleLocationChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleNameBlur = this.handleNameBlur.bind(this);
        this.handleLocationBlur = this.handleLocationBlur.bind(this);
        this.handleDescriptionBlur = this.handleDescriptionBlur.bind(this);
        this.choosePhoto = this.choosePhoto.bind(this);
        this.handlePhotoPicked = this.handlePhotoPicked.bind(this);
        this.uploadImageAsync = this.uploadImageAsync.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount () {
        auth.onAuthStateChanged(user => {
            if (user) {
                this.setState({ isUserLogin: true, userId: user.uid });
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
                this.setState({ groupPhoto: uploadUrl });
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
        let { name, categorySelected, location, description, userId, groupPhoto } = this.state;
        let key = (name + getFullDate() + location).split(' ').join('').split('a').join('_');
        let data = {
            key: key,
            name: name,
            image: groupPhoto,
            category: categorySelected,
            location: location,
            about: description,
            created_date: getFullDate(),
            active: true,
            member: userId,
            admin: userId,
            waiting_list: false,
            events: false            
        };
        database.saveGroup(data);
        this.setState({ ...INITIAL_STATE });
        Alert.alert(
            'Sukses',
            'Horee, Anda berhasil membuat grup baru.',
            [
              {text: 'Home', onPress: () => {
                  return this.props.navigation.navigate('Home');
              }},
              {text: 'Lihat Grup', onPress: () => {
                  return this.props.navigation.navigate('Group', { group_key: key });
              }}
            ],
            { cancelable: true }
        );
    } 

    render () {
        let { name, isNameValid, isNameChanged, categorySelected, isCategoryValid, isCategoryChanged, location,
              isLocationValid, isLocationChanged, description, isDescriptionValid, isDescriptionChanged, groupPhoto } = this.state;
        return (
            <KeyboardAwareScrollView enableOnAndroid={true}>
                <Content padder={true}>
                    <Form>
                        <TouchableOpacity style={styles.photoBox} onPress={this.choosePhoto}>
                            { !groupPhoto && <Thumbnail large source={defaultPhoto} /> }
                            { groupPhoto && <Thumbnail large source={{ uri: groupPhoto }} /> }
                        </TouchableOpacity>
                        <Item floatingLabel last style={isNameChanged && !isNameValid ? ErrorStyles.errorBorder : {}}>
                            <Label>Nama Grup</Label>
                            <Input
                                value={name}
                                onChangeText={this.handleNameChange}
                                onBlur={this.handleNameBlur}
                            />
                        </Item>
                        {
                            !isNameValid && isNameChanged &&
                            <Item style={ErrorStyles.errorBox}>
                                <Text style={ErrorStyles.errorMessage}>{ 'Tidak boleh kosong, kurang dari 10 karakter atau karakter spesial' }</Text>
                            </Item>
                        }
                        <Item last style={isCategoryChanged && !isCategoryValid ? ErrorStyles.errorBorder : { paddingTop: 10, paddingBottom: 3 }}>
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
                            <Item style={ErrorStyles.errorBox}>
                                <Text style={ErrorStyles.errorMessage}>{ 'Kategori harus dipilih' }</Text>
                            </Item>
                        }
                        <Item floatingLabel last style={isLocationChanged && !isLocationValid ? ErrorStyles.errorBorder : {}}>
                            <Label>Lokasi</Label>
                            <Input
                                value={location}
                                onChangeText={this.handleLocationChange}
                                onBlur={this.handleLocationBlur}
                            />
                        </Item>
                        {
                            !isLocationValid && isLocationChanged &&
                            <Item style={ErrorStyles.errorBox}>
                                <Text style={ErrorStyles.errorMessage}>{ 'Lokasi harus diisi dan minimal 4 karakter' }</Text>
                            </Item>
                        }
                        <Textarea
                            rowSpan={5}
                            value={description}
                            onChangeText={(description) => this.handleDescriptionChange(description)}
                            onBlur={this.handleDescriptionBlur}
                            bordered
                            style={isDescriptionChanged && !isDescriptionValid ? ErrorStyles.errorBorder : { paddingTop: 5 }}
                            placeholder="Deskripsi" />
                        {
                            !isDescriptionValid && isDescriptionChanged &&
                            <Item style={ErrorStyles.errorBox}>
                                <Text style={ErrorStyles.errorMessage}>{ 'Deskripsi minimal mengandung 30 karakter' }</Text>
                            </Item>
                        }
                        { groupPhoto && isNameValid && isCategoryValid && isLocationValid && isDescriptionValid &&
                            <Button block info style={{ marginTop: 5 }} onPress={this.handleSubmit} >
                                <Text> Submit </Text>
                            </Button> }
                        { (!groupPhoto || !isNameValid || !isCategoryValid || !isLocationValid || !isDescriptionValid) &&
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
    photoBox: {
        width: '25%',
        marginLeft: '37.5%',
        marginRight: '37.5%',
        marginTop: 30
    }
});

export default NewGroupScreen;
