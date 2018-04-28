import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import LoginScreen from './components/Login';
import HomeScreen from './components/Home';
import WhatsNewScreen from './components/WhatsNew';
import SignUpScreen from './components/SignUp';

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