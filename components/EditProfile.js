import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Container, Content, Form, Item, Label, Input, Text, Button, Thumbnail } from 'native-base';
import defaultPhoto from '../data/icon/camera.png';

class EditProfileScreen extends Component {

    constructor (props) {
        super(props);

        this.state = {};
    }

    render () {
        return (
            <Container>
                <Content padder={true}>
                    <TouchableOpacity style={styles.photoUploadBox}>
                        <Thumbnail large source={defaultPhoto} />
                    </TouchableOpacity>
                    <Form>
                        <Item floatingLabel last>
                            <Label>Nama</Label>
                            <Input />
                        </Item>
                        <Item floatingLabel last>
                            <Label>Kota</Label>
                            <Input />
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
    }
});

export default EditProfileScreen;