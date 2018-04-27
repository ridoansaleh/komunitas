import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';

export default class WhatsNewScreen extends Component {

  constructor (props) {
    super(props);

    this.state = {
      isUserLogin: false
    }
  }

  render() {
    return (
        <ScrollView>
          <View style={styles.navbar}>
            <Text style={styles.menu}  onPress={() => this.props.navigation.navigate('Home')} >Home</Text>
            <Text style={styles.menu}  onPress={() => this.props.navigation.navigate('WhatsNew')} >Whats New</Text>
            <Text style={styles.menu}>Notifikasi</Text>
            <Text style={styles.menu}>Profil</Text>
          </View>
          <Text>WhatsNew Page</Text>
        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  navbar: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    justifyContent: 'space-between',
    height: 60,
    paddingTop: 10
  },
  menu: {
    color: '#FFFFFF',
    padding: 5
  }
});