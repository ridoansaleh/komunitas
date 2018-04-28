import React, { Component } from 'react';
import { Image, StatusBar } from 'react-native';
import { 
  Container, 
  Header, 
  Left, 
  Body, 
  Right, 
  Title, 
  Content, 
  Icon, 
  Text,
  List, 
  ListItem,
  Item, 
  Input,
  Form,
  DeckSwiper,
  Card, 
  CardItem, 
  Thumbnail,
  View,
  Footer,
  FooterTab,
  Button
} from 'native-base';
import Expo from "expo";
import { cards, groups_category } from '../data/dummies';

class HomeScreen extends Component {

  constructor (props) {
    super(props);

    this.state = {
      loading: true,
      isUserLogin: true,
      searchStatus: false
    }

    this.showSearch = this.showSearch.bind(this);
    this.checkLoginStatus = this.checkLoginStatus.bind(this);
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

  checkLoginStatus (url) {
    if (!this.state.isUserLogin) {
      return this.props.navigation.navigate('Login');
    } else {
      return this.props.navigation.navigate(url);
    }
  }

  render() {
    if (this.state.loading) {
      return <Expo.AppLoading />;
    }
    return (
      <Container>
        { this.state.searchStatus &&
          (<Header searchBar rounded>
            <Item regular>
              <Icon name='md-arrow-back' onPress={this.showSearch} />
              <Input placeholder='Contoh: Jakarta Memancing'/>
              <Icon name='search' />
            </Item>
          </Header>)
        }
        { !this.state.searchStatus &&
          (<Header>
            <Left>
              <Icon name='add' style={{color: '#FFFFFF'}} />
            </Left>
            <Body style={{ alignItems: 'center' }}>
              <Title>Komunitas</Title>
            </Body>
            <Right>
              <Icon name='search' style={{color: '#FFFFFF'}} onPress={this.showSearch} />
            </Right>
          </Header>)
        }
        {/* Content */}
        <Content padder={true}>
          <View style={{height: 470}}>
            <DeckSwiper
              dataSource={cards}
              renderItem={item =>
                <Card style={{ elevation: 3 }}>
                  <CardItem>
                    <Left>
                      <Thumbnail source={item.image} />
                      <Body>
                        <Text>{item.text}</Text>
                        <Text note>NativeBase</Text>
                      </Body>
                    </Left>
                  </CardItem>
                  <CardItem cardBody>
                    <Image style={{ height: 300, flex: 1 }} source={item.image} />
                  </CardItem>
                  <CardItem>
                    <Icon name="heart" style={{ color: '#ED4A6A' }} />
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
                  <ListItem key={group.id}>
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
        {/* Content */}
        <Footer>
          <FooterTab>
            <Button onPress={() => this.checkLoginStatus('Home')} vertical active>
              <Icon active name="home" />
              <Text style={{fontSize: 9.5}}>Home</Text>
            </Button>
            <Button onPress={() => this.checkLoginStatus('WhatsNew')} vertical>
              <Icon name="megaphone" />
              <Text style={{fontSize: 9.5}}>Baru</Text>
            </Button>
            <Button onPress={() => this.checkLoginStatus('Notification')} vertical>
              <Icon name="notifications" />
              <Text style={{fontSize: 9.5}}>Notifikasi</Text>
            </Button>
            <Button onPress={() => this.checkLoginStatus('Profile')} vertical>
              <Icon name="person" />
              <Text style={{fontSize: 9.5}}>Profil</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

export default HomeScreen;