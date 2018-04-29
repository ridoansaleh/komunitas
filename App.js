import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import SignUpScreen from './components/SignUp';
import LoginScreen from './components/Login';
import HomeScreen from './components/Home';
import WhatsNewScreen from './components/WhatsNew';
import NotificationScreen from './components/Notification';
import ProfileScreen from './components/Profile';
import NewGroupScreen from './components/NewGroup';

const RootStack = StackNavigator(
  {
    SignUp: {
      screen: SignUpScreen
    },
    Login: {
      screen: LoginScreen
    },
    Home: {
      screen: HomeScreen
    },
    WhatsNew: {
      screen: WhatsNewScreen
    },
    Notification: {
      screen: NotificationScreen
    },
    Profile: {
      screen: ProfileScreen
    },
    NewGroup: {
      screen: NewGroupScreen
    }
  },
  {
    initialRouteName: 'Home'
    // headerMode: 'none'
  }
);

class App extends Component {
  render() {
    return <RootStack />;
  }
}

export default App;