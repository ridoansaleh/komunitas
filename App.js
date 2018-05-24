import React, { Component } from 'react';
import { Root } from 'native-base';
import { StackNavigator } from 'react-navigation';
import SignUpScreen from './components/SignUp';
import LoginScreen from './components/Login';
import HomeScreen from './components/Home';
import WhatsNewScreen from './components/WhatsNew';
import NotificationScreen from './components/Notification';
import ProfileScreen from './components/Profile';
import NewGroupScreen from './components/NewGroup';
import CategoryScreen from './components/Category';

const AppNavigator = StackNavigator(
  {
    SignUp: {
      screen: SignUpScreen,
      navigationOptions: ({ navigation }) => ({
        headerStyle: {
          backgroundColor: '#316ED0'
        }
      })
    },
    Login: {
      screen: LoginScreen,
      navigationOptions: ({ navigation }) => ({
        headerStyle: {
          backgroundColor: '#316ED0'
        }
      })
    },
    Home: {
      screen: HomeScreen,
      navigationOptions: ({ navigation }) => ({
        header: null
      })
    },
    WhatsNew: {
      screen: WhatsNewScreen,
      navigationOptions: ({ navigation }) => ({
        headerStyle: {
          backgroundColor: '#316ED0'
        }
      })
    },
    Notification: {
      screen: NotificationScreen,
      navigationOptions: ({ navigation }) => ({
        headerStyle: {
          backgroundColor: '#316ED0'
        }
      })
    },
    Profile: {
      screen: ProfileScreen,
      navigationOptions: ({ navigation }) => ({
        headerStyle: {
          backgroundColor: '#316ED0'
        }
      })
    },
    NewGroup: {
      screen: NewGroupScreen,
      navigationOptions: ({ navigation }) => ({
        headerStyle: {
          backgroundColor: '#316ED0'
        }
      })
    },
    Category: {
      screen: CategoryScreen,
      navigationOptions: ({ navigation }) => ({
        headerStyle: {
          backgroundColor: '#316ED0'
        }
      })
    }
  },
  {
    initialRouteName: 'Home'
    // headerMode: 'none'
  }
);

class App extends Component {
  constructor (props) {
    super(props)
    console.ignoredYellowBox = [
      'Setting a timer'
    ];
  }

  render() {
    return (
      <Root>
        <AppNavigator />
      </Root>
    )
  }
}

export default App;