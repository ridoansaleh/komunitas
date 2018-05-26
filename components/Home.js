import React, { Component } from 'react';
import { Image, StatusBar } from 'react-native';
import {
  Container, Header, Left, Body, Right, Title, Content, Icon, Text, List, 
  ListItem, Item, Input, Form, DeckSwiper, Card, CardItem, Thumbnail, View 
} from 'native-base';
import Expo from "expo";
import { popular_events, groups_category } from '../data/dummies';
import Footer from './partials/Footer';
import { auth, db } from '../firebase/config';

class HomeScreen extends Component {

  constructor (props) {
    super(props);

    this.state = {
      loading: true,
      searchStatus: false,
      activeMenu: 'Home'
    }

    this.showSearch = this.showSearch.bind(this);
    this.handleRouteChange = this.handleRouteChange.bind(this);
  }

  async componentWillMount() {
    await Expo.Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      'Ionicons': require("@expo/vector-icons/fonts/Ionicons.ttf")
    });
    this.setState({ loading: false });
  }

  showSearch () {
    this.setState({ searchStatus: !this.state.searchStatus });
  }

  handleRouteChange (url, groupId) {
    let { navigate } = this.props.navigation;
    let isUserLogin = false;
    auth.onAuthStateChanged(user => {
      if (user) {
        isUserLogin: true;
      }
    });
    if (!isUserLogin) {
      if (url === 'Category') {
        return navigate(url, { group_id: groupId });
      } else {
        return navigate('Login');
      }
    } else {
      return navigate(url, { group_id: groupId });
    }
  }

  render() {
    if (this.state.loading) {
      return <Expo.AppLoading />;
    }
    return (
      <Container>
        { this.state.searchStatus &&
          (<Header style={{ marginTop: 25 }} searchBar rounded>
            <Item regular>
              <Icon name='md-arrow-back' onPress={this.showSearch} />
              <Input placeholder='Contoh: Jakarta Memancing'/>
              <Icon name='search' />
            </Item>
          </Header>)
        }
        { !this.state.searchStatus &&
          (<Header style={{ marginTop: 25}}>
            <Left>
              <Icon name='add' style={{color: '#FFFFFF'}} onPress={() => this.handleRouteChange('NewGroup')} />
            </Left>
            <Body style={{ alignItems: 'center' }}>
              <Title>Komunitas</Title>
            </Body>
            <Right>
              <Icon name='search' style={{color: '#FFFFFF'}} onPress={this.showSearch} />
            </Right>
          </Header>)
        }
        <Content padder={true}>
          <View style={{height: 435}}>
            <DeckSwiper
              dataSource={popular_events}
              renderItem={item =>
                <Card style={{ elevation: 3 }}>
                  <CardItem>
                    <Left>
                      <Thumbnail source={item.group_image} />
                      <Body>
                        <Text>{item.group}</Text>
                        <Text note>{item.date}</Text>
                      </Body>
                    </Left>
                  </CardItem>
                  <CardItem cardBody>
                    <Image style={{ height: 300, flex: 1 }} source={item.image} />
                  </CardItem>
                  <CardItem>
                    <Text>{item.name}</Text>
                  </CardItem>
                </Card>
              }
            />
          </View>
          <List>
            <ListItem itemHeader first>
              <Text>Kategori Grup</Text>
            </ListItem>
            { groups_category.map(group => {
                return (
                  <ListItem key={group.id} onPress={() => this.handleRouteChange('Category', group.id)} >
                    <Left>
                      <Icon name={group.icon}/>
                    </Left>
                    <Body>
                      <Text>{group.name}</Text>
                    </Body>
                    <Right />
                  </ListItem>
                ) 
            })}
          </List>
        </Content>
        <Footer onMenuChange={this.handleRouteChange} activeMenu={this.state.activeMenu} />
      </Container>
    );
  }
}

export default HomeScreen;