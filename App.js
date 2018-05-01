import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import SignUpScreen from './components/SignUp';
import LoginScreen from './components/Login';
import HomeScreen from './components/Home';
import WhatsNewScreen from './components/WhatsNew';
import NotificationScreen from './components/Notification';
import ProfileScreen from './components/Profile';
import NewGroupScreen from './components/NewGroup';
import CategoryScreen from './components/Category';

const RootStack = StackNavigator(
  {
    SignUp: {
      screen: SignUpScreen
    },
    Login: {
      screen: LoginScreen
    },
    Home: {
      screen: HomeScreen,
      navigationOptions: ({ navigation }) => ({
        header: null
      })
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
    },
    Category: {
      screen: CategoryScreen
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