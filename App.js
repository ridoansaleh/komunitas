import React, { Component } from 'react';
import { Root, Text } from 'native-base';
import { StackNavigator } from 'react-navigation';
import SignUpScreen from './components/SignUp';
import LoginScreen from './components/Login';
import HomeScreen from './components/Home';
import WhatsNewScreen from './components/WhatsNew';
import NotificationScreen from './components/Notification';
import ProfileScreen from './components/Profile';
import NewGroupScreen from './components/NewGroup';
import CategoryScreen from './components/Category';
import GroupScreen from './components/Group';

let renderTitle = (title) => {
  return <Text style={{ color: 'white' }}>{title}</Text>
}

const AppNavigator = StackNavigator(
  {
    SignUp: {
      screen: SignUpScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: renderTitle('Sign Up'),
        headerStyle: {
          backgroundColor: '#316ED0'
        }
      })
    },
    Login: {
      screen: LoginScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: renderTitle('Login'),
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
        headerTitle: renderTitle('Baru'),
        headerStyle: {
          backgroundColor: '#316ED0'
        }
      })
    },
    Notification: {
      screen: NotificationScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: renderTitle('Notifikasi'),
        headerStyle: {
          backgroundColor: '#316ED0'
        }
      })
    },
    Profile: {
      screen: ProfileScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: renderTitle('Profil'),
        headerStyle: {
          backgroundColor: '#316ED0'
        }
      })
    },
    NewGroup: {
      screen: NewGroupScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: renderTitle('Grup Baru'),
        headerStyle: {
          backgroundColor: '#316ED0'
        }
      })
    },
    Category: {
      screen: CategoryScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: renderTitle('Kategori Grup'),
        headerStyle: {
          backgroundColor: '#316ED0'
        }
      })
    },
    Group: {
      screen: GroupScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: renderTitle('Group'),
        headerStyle: {
          backgroundColor: '#316ED0'
        }
      })
    }
  },
  {
    initialRouteName: 'Home'
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