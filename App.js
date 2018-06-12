import React, { Component } from 'react';
import { Root, Text } from 'native-base';
import { StackNavigator } from 'react-navigation';
import SignUpScreen from './src/components/SignUp';
import LoginScreen from './src/components/Login';
import HomeScreen from './src/components/Home';
import WhatsNewScreen from './src/components/WhatsNew';
import NotificationScreen from './src/components/Notification';
import ProfileScreen from './src/components/Profile';
import EditProfileScreen from './src/components/EditProfile';
import ChangePasswordScreen from './src/components/ChangePassword';
import ResetPasswordScreen from './src/components/ResetPassword';
import NewGroupScreen from './src/components/NewGroup';
import CategoryScreen from './src/components/Category';
import GroupScreen from './src/components/Group';
import NewEventScreen from './src/components/NewEvent';
import EventScreen from './src/components/Event';
import SearchResultScreen from './src/components/SearchResult';

let renderTitle = title => <Text style={{ color: 'white' }}>{title}</Text>

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
    SearchResult: {
      screen: SearchResultScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: renderTitle('Hasil Pencarian'),
        headerStyle: {
          backgroundColor: '#316ED0'
        }
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
    EditProfile: {
      screen: EditProfileScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: renderTitle('Edit Profil'),
        headerStyle: {
          backgroundColor: '#316ED0'
        }
      })
    },
    ChangePassword: {
      screen: ChangePasswordScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: renderTitle('Ubah Password'),
        headerStyle: {
          backgroundColor: '#316ED0'
        }
      })
    },
    ResetPassword: {
      screen: ResetPasswordScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: renderTitle('Reset Password'),
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
    NewEvent: {
      screen: NewEventScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: renderTitle('Event Baru'),
        headerStyle: {
          backgroundColor: '#316ED0'
        }
      })
    },
    Event: {
      screen: EventScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: renderTitle('Event'),
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
        headerTitle: renderTitle('Grup'),
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