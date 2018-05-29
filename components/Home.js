import React, { Component } from 'react';
import { Image, StatusBar } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Content, Icon, Text, List, 
         ListItem, Item, Input, Form, DeckSwiper, Card, CardItem, Thumbnail, View,
         Spinner } from 'native-base';
import Expo from "expo";
import { popular_events, groups_category } from '../data/dummies';
import Footer from './partials/Footer';
import { auth, db } from '../firebase/config';
import emptyEvent from '../data/images/no_image.png';

class HomeScreen extends Component {

  constructor (props) {
    super(props);

    this.state = {
      loading: true,
      isUserLogin: false,
      searchStatus: false,
      activeMenu: 'Home',
      events: null,
      eventsFetched: false,
      groupsCategory: null
    }

    this.showSearch = this.showSearch.bind(this);
    this.handleRouteChange = this.handleRouteChange.bind(this);
    this.renderTopEvents = this.renderTopEvents.bind(this);
    this.renderEmptyEvent = this.renderEmptyEvent.bind(this);
  }

  async componentWillMount() {
    await Expo.Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      'Ionicons': require("@expo/vector-icons/fonts/Ionicons.ttf")
    });
    this.setState({ loading: false });
  }

  componentDidMount () {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ isUserLogin: true });
      }
    });

    /*
    Uncomment this line to see if there are no event yet
    this.setState({
      events: 0,
      eventsFetched: true
    });
    */

    let eventRef = db.ref('/events');
    let groupRef = db.ref('/groups');
    let categoryRef = db.ref('/categories');

    eventRef.on('value', data => {
      let event = data.val();

      if ((Object.keys(event).length > 0) && (event.constructor === Object)) {
        let eventNames = [];
        let topEvents = [];
        Object.keys(event).map((u,i) => eventNames.push(u));
        eventNames.map((e,i) => {
          groupRef.child(event[e]['group']).once('value', snap => {
            event[e]['group_name'] = snap.val().name;
						event[e]['group_image'] = snap.val().image;
						let newObj = event[e]; // i can't manipulate Object from firebase directly, so i create this
            topEvents.push(newObj);
            if (topEvents.length === eventNames.length) { // i can't call topEvents outside groupRef's block because the data is empty over there
              this.setState({ events: topEvents });
            }
          })
        });
      } else {
        this.setState({
          events: 0,
          eventsFetched: true
        });
      }
    }, error => console.log('error while fetching events'));

    categoryRef.on('value', data => {
      let categories = data.val();
      let categoryNames = [];
      let result = [];
      Object.keys(categories).map((c,i) => categoryNames.push(c));
      categoryNames.map((c,i) => {
        let newObj = categories[c];
        result.push(newObj);
        if (result.length === categoryNames.length) {
          this.setState({ groupsCategory: result });
        }
      });
    }, error => console.log('error while fetching categories'));
  }

  renderTopEvents (events) {
    return (
      <View style={{height: 435}}>
        <DeckSwiper
          dataSource={events}
          renderItem={item =>
            <Card style={{ elevation: 3 }}>
              <CardItem>
                <Left>
                  <Thumbnail source={{ uri: item.group_image}} />
                  <Body>
                    <Text>{item.group_name}</Text>
                    <Text note>{item.date}</Text>
                  </Body>
                </Left>
              </CardItem>
              <CardItem cardBody>
                <Image style={{ height: 300, flex: 1 }} source={{ uri: item.image }} />
              </CardItem>
              <CardItem>
                <Text>{item.name}</Text>
              </CardItem>
            </Card>
          }
        />
      </View>
    );
  }

  renderEmptyEvent () {
    return (
      <View style={{height: 435}}>
        <Card>
          <CardItem>
            <Left>
              <Body>
                <Text>{'Belum ada event di sekitar Anda'}</Text>
              </Body>
            </Left>
          </CardItem>
          <CardItem cardBody>
            <Image style={{ height: 300, flex: 1 }} source={emptyEvent} />
          </CardItem>
          <CardItem>
            <Text>{'Kamu dapat membuat event, caranya gampang. Terlebih dahulu kamu harus punya akun dan membuat Grup baru. Buruan!!'}</Text>
          </CardItem>
        </Card>
      </View>
    );
  }

  showSearch () {
    this.setState({ searchStatus: !this.state.searchStatus });
  }

  handleRouteChange (url, groupId) {
    let { navigate } = this.props.navigation;
    if (!this.state.isUserLogin) {
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
    let { groupsCategory, loading, searchStatus, events, eventsFetched, activeMenu } = this.state;
    if (loading) {
      return <Expo.AppLoading />;
    }
    return (
      <Container>
        { searchStatus &&
          (<Header style={{ marginTop: 25 }} searchBar rounded>
            <Item regular>
              <Icon name='md-arrow-back' onPress={this.showSearch} />
              <Input placeholder='Contoh: Jakarta Memancing'/>
              <Icon name='search' />
            </Item>
          </Header>)
        }
        { !searchStatus &&
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
          { events
            ? this.renderTopEvents(events)
            : eventsFetched
              ? this.renderEmptyEvent()
              : <Spinner color='green' size='large' /> }
          { groupsCategory && <List>
            <ListItem itemHeader first>
              <Text>Kategori Grup</Text>
            </ListItem>
            { groupsCategory.map((c,i) => {
                return (
                  <ListItem key={i} onPress={() => this.handleRouteChange('Category', c.id)} >
                    <Left>
                      <Icon name={c.icon}/>
                    </Left>
                    <Body>
                      <Text>{c.name}</Text>
                    </Body>
                    <Right />
                  </ListItem>
                ) 
            })}
          </List> }
        </Content>
        <Footer onMenuChange={this.handleRouteChange} activeMenu={activeMenu} />
      </Container>
    );
  }
}

export default HomeScreen;