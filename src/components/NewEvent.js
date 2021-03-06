import React, { Component } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { Content, Form, Item, Picker, Textarea, Label, Input, Text, Button } from 'native-base';
import DatePicker from 'react-native-datepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ErrorStyles } from '../css/error';
import { auth, db } from '../firebase/config';
import { getFullDate, getTodayDate } from '../utils';
import { db as database } from '../firebase';

const INITIAL_STATE = {
    userKey: '',
    groupKey: '',
    name: '',
    isNameValid: false,
    isNameChanged: false,
    description: '',
    isDescriptionValid: false,
    isDescriptionChanged: false,
    location: '',
    isLocationValid: false,
    isLocationChanged: false,
    quota: '',
    isQuotaValid: false,
    isQuotaChanged: false,
    timeSelected: 'nothing',
    isTimeValid: false,
    isTimeChanged: false,
    date: getTodayDate(),
    isDateValid: false,
    isDateChanged: false
}

class NewEventScreen extends Component {

    constructor (props) {
        super(props);

        this.state = {
            ...INITIAL_STATE,
            groupKey: this.props.navigation.state.params.group_key
        };

        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeDescription = this.handleChangeDescription.bind(this);
        this.handleChangeLocation = this.handleChangeLocation.bind(this);
        this.handleChangeQuota = this.handleChangeQuota.bind(this);
        this.handleChangeTime = this.handleChangeTime.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.sendNotification = this.sendNotification.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount () {
        auth.onAuthStateChanged(user => {
            if (user) {
                this.setState({ isUserLogin: true, userKey: user.uid });
            } else {
                return this.props.navigation.navigate('Login');
            }
        });
    }

    handleChangeName (value) {
        if ((value.length >= 10) && (/^[0-9a-zA-Z\_ ]+$/.test(value))) {
            this.setState({ name: value, isNameValid: true, isNameChanged: true });
        } else {
            this.setState({ name: value, isNameValid: false, isNameChanged: true });
        }
    }

    handleChangeDescription (value) {
        if (value.length >= 30) {
            this.setState({ description: value, isDescriptionValid: true, isDescriptionChanged: true });
        } else {
            this.setState({ description: value, isDescriptionValid: false, isDescriptionChanged: true });
        }
    }

    handleChangeLocation (value) {
        if (value.length >= 4) {
            this.setState({ location: value, isLocationValid: true, isLocationChanged: true });
        } else {
            this.setState({ location: value, isLocationValid: false, isLocationChanged: true });
        }
    }

    handleChangeQuota (value) {
        let regex = /[0-9]|\./;
        if (regex.test(value)) {
            this.setState({ quota: value, isQuotaValid: true, isQuotaChanged: true });
        } else {
            this.setState({ quota: value, isQuotaValid: false, isQuotaChanged: true });
        }
    }

    handleChangeTime (value) {
        if (value !== 'nothing') {
            this.setState({ timeSelected: value, isTimeValid: true, isTimeChanged: true });
        } else {
            this.setState({ timeSelected: value, isTimeValid: false, isTimeChanged: true });
        }
    }

    handleChangeDate (value) {
        if (value !== getTodayDate()) {
            this.setState({ date: value, isDateValid: true, isDateChanged: true });
        } else {
            this.setState({ date: value, isDateValid: false, isDateChanged: true });
        }
    }

    sendNotification (eventName, eventDate) {
        let { userKey, groupKey } = this.state;

        let membersRef = db.ref('/groups/'+this.state.groupKey+'/members');
        let notifKey = userKey.substring(2,7) + (Math.random()).toString().substring(2,5) + groupKey.substring(1,4);
        let notiRef = db.ref('/notifications/'+notifKey);
        let groupRef = db.ref('/groups/'+groupKey); 
        let membersKey = [];
        let groupName = null;

        groupRef.on('value', (data) => {
            groupName = data.val().name;
        });

        membersRef.on('value', (data) => {
            let members = data.val();
            if (members) {
                Object.keys(members).map((m,i) => membersKey.push(m));
            }
        });

        if (groupName && membersKey.length) {
            notiRef.set({
                sender: groupKey,
                receivers: false,
                text: 'Grup '+ groupName +' telah membuat event baru, yaitu ' + eventName + ' untuk tanggal '+eventDate,
                time: getFullDate(),
            });
            for (let i=0; i<membersKey.length; i++) {
                db.ref('/notifications/'+notifKey+'/receivers/'+membersKey[i]).set({ read: false });
            }
        }
    }

    handleSubmit () {
        let { name, description, location, quota, timeSelected, date, groupKey, userKey } = this.state;
        let monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        let formatDate = (date) => {
            let year = date.substring(0,4);
            let month = monthNames[(date.substring(5,7))-1];
            let day = date.substring(8,10);
            return day + ' ' + month + ' ' + year;
        }
        let key = name.split(' ').join('') + quota + description.substring(1,7);
        let eventDate = formatDate(date);
        let data = {
            'eventKey': key,
            'name': name,
            'description': description,
            'location': location,
            'quota': quota,
            'time': timeSelected,
            'date': eventDate,
            'created_date': getTodayDate(),
            'group': groupKey,
            'image': 'https://firebasestorage.googleapis.com/v0/b/komunitas-3baa3.appspot.com/o/swim_group.jpg?alt=media&token=1644145f-d542-4a86-a92f-07c4b4033b37',
            'member': userKey
        };
        database.saveEvent(data);
        database.addEventToGroup({
            eventKey: key,
            groupKey: groupKey, 
            status: true
        });
        this.sendNotification(name, eventDate);
        this.setState({ ...INITIAL_STATE }, () => {
            Alert.alert(
                'Sukses',
                'Horee, Anda berhasil membuat event baru.',
                [
                  {text: 'Kembali', onPress: () => {
                      return this.props.navigation.navigate('Group', { group_key: groupKey });
                  }},
                  {text: 'Lihat Event', onPress: () => {
                      return this.props.navigation.navigate('Event', { event_key: key });
                  }}
                ],
                { cancelable: true }
            );
        });
    }

    render () {
        let { name, description, location, quota, timeSelected, date,
              isNameValid, isDescriptionValid, isLocationValid, isQuotaValid, isTimeValid, isDateValid,
              isNameChanged, isDescriptionChanged, isLocationChanged, isQuotaChanged, isTimeChanged, isDateChanged } = this.state; 
        return (
            <KeyboardAwareScrollView enableOnAndroid={true}>
                <Content padder={true}>
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
                                <Text style={ErrorStyles.errorMessage}>{ 'Tidak boleh kosong, kurang dari 10 karakter atau karakter spesial' }</Text>
                            </Item>
                        }
                        <Textarea
                            rowSpan={5}
                            value={description}
                            onChangeText={(description) => this.handleChangeDescription(description)}
                            bordered
                            style={isDescriptionChanged && !isDescriptionValid ? ErrorStyles.errorBorder : { paddingTop: 5 }}
                            placeholder="Deskripsi" />
                        {
                            !isDescriptionValid && isDescriptionChanged &&
                            <Item style={ErrorStyles.errorBox}>
                                <Text style={ErrorStyles.errorMessage}>{ 'Deskripsi minimal mengandung 30 karakter' }</Text>
                            </Item>
                        }
                        <Item floatingLabel last style={isLocationChanged && !isLocationValid ? ErrorStyles.errorBorder : {}}>
                            <Label>Lokasi</Label>
                            <Input
                                value={location}
                                onChangeText={(location) => this.handleChangeLocation(location)}
                            />
                        </Item>
                        {
                            !isLocationValid && isLocationChanged &&
                            <Item style={ErrorStyles.errorBox}>
                                <Text style={ErrorStyles.errorMessage}>{ 'Lokasi harus diisi dan minimal 4 karakter' }</Text>
                            </Item>
                        }
                        <Item floatingLabel last style={isQuotaChanged && !isQuotaValid ? ErrorStyles.errorBorder : {}}>
                            <Label>Kuota</Label>
                            <Input
                                value={quota}
                                onChangeText={(quota) => this.handleChangeQuota(quota)}
                            />
                        </Item>
                        {
                            !isQuotaValid && isQuotaChanged &&
                            <Item style={ErrorStyles.errorBox}>
                                <Text style={ErrorStyles.errorMessage}>{ 'Kuota harus diisi dan hanya menerima angka' }</Text>
                            </Item>
                        }
                        <Item last style={isTimeChanged && !isTimeValid ? ErrorStyles.errorBorder : {}}>
                            <Picker
                                mode="dropdown"
                                selectedValue={timeSelected}
                                onValueChange={this.handleChangeTime}>
                                <Picker.Item disabled label="Pilih Jam" value="nothing" />
                                <Picker.Item label="08.00 - 10.00 WIB" value="08.00 - 10.00 WIB" />
                                <Picker.Item label="10.00 - 12.00 WIB" value="10.00 - 12.00 WIB" />
                                <Picker.Item label="13.00 - 15.00 WIB" value="13.00 - 15.00 WIB" />
                                <Picker.Item label="16.00 - 18.00 WIB" value="16.00 - 18.00 WIB" />
                                <Picker.Item label="19.00 - 21.00 WIB" value="19.00 - 21.00 WIB" />
                            </Picker>
                        </Item>
                        {
                            !isTimeValid && isTimeChanged &&
                            <Item style={ErrorStyles.errorBox}>
                                <Text style={ErrorStyles.errorMessage}>{ 'Jam event harus dipilih' }</Text>
                            </Item>
                        }
                        <DatePicker
                            style={ isDateChanged && !isDateValid ? styles.errorDate : styles.date }
                            date={date}
                            mode="date"
                            placeholder="Pilih Tanggal"
                            format="YYYY-MM-DD"
                            minDate={getTodayDate()}
                            maxDate="2050-01-01"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                                dateIcon: {
                                    position: 'absolute',
                                    right: 0,
                                    top: 4
                                }
                            }}
                            onDateChange={(date) => this.handleChangeDate(date)}
                        />
                        {
                            !isDateValid && isDateChanged &&
                            <Item style={ErrorStyles.errorBox}>
                                <Text style={ErrorStyles.errorMessage}>{ 'Tanggal event harus dipilih dan tidak boleh hari ini' }</Text>
                            </Item>
                        }
                        { isNameValid && isDescriptionValid && isLocationValid && isQuotaValid && isTimeValid && isDateValid &&
                          <Button info block onPress={this.handleSubmit} style={styles.submitBtn}>
                            <Text> Submit </Text>
                          </Button> }
                        { (!isNameValid || !isDescriptionValid || !isLocationValid || !isQuotaValid || !isTimeValid || !isDateValid) &&
                          <Button disabled block style={styles.submitBtn}>
                            <Text> Submit </Text>
                          </Button> }
                    </Form>
                </Content>
            </KeyboardAwareScrollView>
        );
    }
}

const styles = StyleSheet.create({
    errorDate: {
        borderColor: '#FF5733',
        width: '100%',
        marginTop: 15
    },
    date: {
        width: '100%',
        marginTop: 15
    },
    submitBtn: {
        marginTop: 15
    }
});

export default NewEventScreen;