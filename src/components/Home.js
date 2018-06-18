import React, { Component } from 'react';
import { StyleSheet, Image, TouchableOpacity, AsyncStorage } from 'react-native';
import { Container, Header, Left, Body, Right, Title, Content, Icon, Text, List, 
         ListItem, Item, Input, DeckSwiper, Card, CardItem, Thumbnail, View, Spinner } from 'native-base';
import Expo from "expo";
import Footer from './partials/Footer';
import { auth, db } from '../firebase/config';
import emptyEvent from '../images/no_image.png';

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
      groupsCategory: null,
      totalNotif: 0,
      group: ''
    }

    this.showSearch = this.showSearch.bind(this);
    this.handleRouteChange = this.handleRouteChange.bind(this);
    this.renderTopEvents = this.renderTopEvents.bind(this);
    this.renderEmptyEvent = this.renderEmptyEvent.bind(this);
    this.fetchTopEvents = this.fetchTopEvents.bind(this);
    this.fetchCategories = this.fetchCategories.bind(this);
    this.fetchNotifications = this.fetchNotifications.bind(this);
    this.handleGroupChange = this.handleGroupChange.bind(this);
    this.searchGroup = this.searchGroup.bind(this);
  }

  async UNSAFE_componentWillMount() {
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
        this.fetchNotifications(user.uid);
      } else {
        this.fetchTopEvents(false);
      }
    });
  }

  fetchNotifications (userKey) {
    let notiRef = db.ref('/notifications');
    let notifsKey = [];
    
    notiRef.on('value', (data) => {
        let notifications = data.val();

        if (notifications) {
          Object.keys(notifications).map((n,i) => notifsKey.push(n));
        }
        
        if (notifsKey.length) {
          let notif = 0;
          for (let i=0; i<notifsKey.length; i++) {
            db.ref('/notifications/'+notifsKey[i]+'/receivers').on('value', (data) => {
              if (data.val().hasOwnProperty(userKey)) {
                db.ref('/notifications/'+notifsKey[i]+'/receivers/'+userKey).on('value', (data) => {
                    let status = data.val().read;
                    if (!status) {
                        notif++;
                    } else {
                      this.fetchTopEvents(true, 0);
                    }
                });
              } else {
                  this.fetchTopEvents(true, 0);
              }
            });
            if ((i === (notifsKey.length-1)) && (notif > 0)) {
              this.fetchTopEvents(true, notif);
              try {
                AsyncStorage.setItem('_totalNotif', notif.toString());
              } catch (error) {
                console.log('Error while set totalNotif on storage');
              }
            }
          }
        } else {
          this.fetchTopEvents(true, 0);
        }
    });
  }

  fetchTopEvents (loginStatus, notif) {
    let eventRef = db.ref('/events');
    let groupRef = db.ref('/groups');

    groupRef.on('value', (data) => {
      let groups = data.val();
      
      if (groups) {
        eventRef.on('value', data => {
          let event = data.val();
          let eventNames = [];
          let topEvents = [];

          if (event) {
            Object.keys(event).map((u,i) => eventNames.push(u));
            eventNames.map((e,i) => {
              groupRef.child(event[e]['group']).once('value', g => {
                topEvents.push({
                  'key': e,
                  'name': event[e]['name'],
                  'image': event[e]['image'],
                  'date': event[e]['date'],
                  'group_key': event[e]['group'],
                  'group_name': g.val().name,
                  'group_image': g.val().image,
                });
                if (topEvents.length === eventNames.length) { // i can't call topEvents outside groupRef's block because the data is empty over there
                  this.fetchCategories(loginStatus, topEvents, true, notif);
                }
              })
            });
          } else {
            this.fetchCategories(loginStatus, null, true, notif);
          }
        }, error => console.log('error while fetching events'));
      } else {
        this.fetchCategories(loginStatus, null, true, notif);
      }
    });
  }

  fetchCategories (loginStatus, eventData, isEventFetched, notif) {
    let categoryRef = db.ref('/categories');

    categoryRef.on('value', data => {
      let categories = data.val();
      let categoryNames = [];
      let result = [];
      Object.keys(categories).map((c,i) => categoryNames.push(c));
      categoryNames.map((c,i) => {
        let newObj = categories[c];
        result.push(newObj);
        if (result.length === categoryNames.length) {
          this.setState({
            isUserLogin: loginStatus,
            events: eventData,
            eventsFetched: isEventFetched,
            groupsCategory: result,
            totalNotif: notif
          });
        }
      });
    }, error => console.log('error while fetching categories'));
  }

  showSearch () {
    this.setState({ searchStatus: !this.state.searchStatus });
  }

  handleGroupChange (value) {
    this.setState({ group: value });
  }

  searchGroup () {
    let { group } = this.state;
    if (group) {
      this.props.navigation.navigate('SearchResult', { search: group });
    }
  }

  handleRouteChange (url, param) {
    let { navigate } = this.props.navigation;
    if (!this.state.isUserLogin) {
      if (url === 'Category') {
        return navigate(url, param);
      } else if (url === 'Event') {
        return navigate(url, { event_key: param });
      } else {
        return navigate('Login');
      }
    } else {
      if (url === 'Event') {
        return navigate(url, {
          event_key: param.key,
          group_key: param.group_key
        });
      } else {
        return navigate(url, param);
      }
    }
  }

  renderTopEvents (events) {
    return (
      <View style={styles.cardWrapper}>
        <DeckSwiper
          dataSource={events}
          renderItem={item =>
            <Card style={styles.cardBlock}>
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
                <Image style={styles.cardImage} source={{ uri: item.image }} />
              </CardItem>
              <CardItem>
                <TouchableOpacity onPress={() => this.handleRouteChange('Event', item)}>
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              </CardItem>
            </Card>
          }
        />
      </View>
    );
  }

  renderEmptyEvent () {
    return (
      <View style={styles.cardWrapper}>
        <Card>
          <CardItem>
            <Left>
              <Body>
                <Text>{'Belum ada event di sekitar Anda'}</Text>
              </Body>
            </Left>
          </CardItem>
          <CardItem cardBody>
            <Image style={styles.cardImage} source={emptyEvent} />
          </CardItem>
          <CardItem>
            <Text>{'Kamu dapat membuat event, caranya gampang. Terlebih dahulu kamu harus punya akun dan membuat Grup baru. Buruan !'}</Text>
          </CardItem>
        </Card>
      </View>
    );
  }

  render() {
    let { groupsCategory, loading, searchStatus, events, eventsFetched, activeMenu, totalNotif, group } = this.state;
    if (loading) {
      return <Expo.AppLoading />;
    }
    return (
      <Container>
        { searchStatus &&
          (<Header style={styles.header} searchBar rounded>
            <Item regular>
              <Icon name='md-arrow-back' onPress={this.showSearch} />
              <Input
                value={group}
                onChangeText={this.handleGroupChange}
                placeholder='Contoh: Jakarta Memancing'/>
              <Icon name='search' onPress={() => this.searchGroup()} />
            </Item>
          </Header>)
        }
        { !searchStatus &&
          (<Header style={styles.header}>
            <Left>
              <Icon name='add' style={styles.white} onPress={() => this.handleRouteChange('NewGroup')} />
            </Left>
            <Body style={styles.headerTitle}>
              <Title>Komunitas</Title>
            </Body>
            <Right>
              <Icon name='search' style={styles.white} onPress={this.showSearch} />
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
            <ListItem>
              <Text>Kategori Grup</Text>
            </ListItem>
            { groupsCategory.map((c,i) => {
                return (
                  <ListItem key={i} onPress={() => this.handleRouteChange('Category', c)} >
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
        <Footer onMenuChange={this.handleRouteChange} activeMenu={activeMenu} notif={totalNotif}/>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    marginTop: 25
  },
  headerTitle: {
    alignItems: 'center'
  },
  cardWrapper: {
    height: 435
  },
  cardBlock: {
    elevation: 3
  },
  cardImage: {
    height: 300,
    flex: 1
  },
  white: {
    color: '#FFFFFF'
  }
});

export default HomeScreen;