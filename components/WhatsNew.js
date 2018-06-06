import React, { Component } from 'react';
import { StyleSheet, Image, Dimensions, AsyncStorage } from 'react-native';
import { Container, Content, ListItem, CheckBox, Text, Body, H2 } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import Footer from './partials/Footer';
import { auth, db } from '../firebase/config';

const { height, width } = Dimensions.get('window');

class WhatsNewScreen extends Component {

  constructor (props) {
    super(props);

    this.state = {
      activeMenu: 'WhatsNew',
      isUserLogin: false,
      userId: null,
      groups: null,
      isGroupFetched: false,
      isNearGroups: true,
      isAllGroups: false,
      totalNotif: 0
    }

    this.fetchGroups = this.fetchGroups.bind(this);
    this.changeGroupCategory = this.changeGroupCategory.bind(this);
    this.handleRouteChange = this.handleRouteChange.bind(this);
  }

  componentDidMount () {
    auth.onAuthStateChanged(user => {
      if (user) {
        AsyncStorage.getItem('_totalNotif').then(notif => {
          let _notif = parseInt(notif) || 0;
          this.fetchGroups(user.uid, true, 'near', _notif);
        });
      }
    });
  }

  fetchGroups (userKey, loginStatus, groupLocation, notif) {
    let groupsRef = db.ref('/groups');
    let userRef = db.ref('/users/'+userKey);
    let groups = null;
    let groupsKey = [];
    let result = [];
   
    groupsRef.on('value', (data) => {
      groups = data.val();
    });

    if (groups) {
      Object.keys(groups).map((g,i) => groupsKey.push(g));
      if (groupLocation === 'near') {
        if (groupsKey.length) {
          for (let i=0; i<groupsKey.length; i++) {
            let groupRef = db.ref('/groups/'+groupsKey[i]);
            groupRef.on('value', (group) => {
              userRef.on('value', (user) => {
                if (group.val().location === user.val().city) {
                  result.push(groups[groupsKey[i]]);
                }
              });
            });
            if ((i === (groupsKey.length-1)) && result.length > 0) {
              this.setState({
                isUserLogin: loginStatus,
                userId: userKey,
                groups: result,
                isGroupFetched: true,
                isNearGroups: groupLocation === 'near' ? true : false,
                isAllGroups: groupLocation === 'all' ? true : false,
                totalNotif: notif
              });
            } else if ((i === (groupsKey.length-1)) && result.length === 0) {
              this.setState({
                isUserLogin: loginStatus,
                userId: userKey,
                groups: null,
                isGroupFetched: true,
                isNearGroups: groupLocation === 'near' ? true : false,
                isAllGroups: groupLocation === 'all' ? true : false,
                totalNotif: notif
              });
            }
          }
        }
      } else {
        if (groupsKey.length) {
          for (let i=0; i<groupsKey.length; i++) {
            result.push(groups[groupsKey[i]]);
            if ((i === (groupsKey.length-1)) && result.length > 0) {
              this.setState({
                isUserLogin: loginStatus,
                userId: userKey,
                groups: result,
                isGroupFetched: true,
                isNearGroups: groupLocation === 'near' ? true : false,
                isAllGroups: groupLocation === 'all' ? true : false,
                totalNotif: notif
              });
            } else if ((i === (groupsKey.length-1)) && result.length === 0) {
              this.setState({
                isUserLogin: loginStatus,
                userId: userKey,
                groups: null,
                isGroupFetched: true,
                isNearGroups: groupLocation === 'near' ? true : false,
                isAllGroups: groupLocation === 'all' ? true : false,
                totalNotif: notif
              });
            }
          }
        }
      }
    } else {
      this.setState({
        isUserLogin: loginStatus,
        userId: userKey,
        groups: null,
        isGroupFetched: true,
        isNearGroups: groupLocation === 'near' ? true : false,
        isAllGroups: groupLocation === 'all' ? true : false,
        totalNotif: notif
      });
    }
  }

  changeGroupCategory (param) {
    let { userId, isUserLogin, totalNotif } = this.state;
    this.fetchGroups(userId, isUserLogin, param, totalNotif);
  }

  handleRouteChange (url) {
    if (!this.state.isUserLogin) {
      return this.props.navigation.navigate('Login');
    } else {
      return this.props.navigation.navigate(url);
    }
  }

  render() {
    let { isUserLogin, groups, isGroupFetched, isNearGroups, isAllGroups, totalNotif } = this.state;
    return (
      <Container>
        <Content padder={true}>
          <Grid style={styles.groupCategory}>
            <Col>
              <ListItem style={styles.list} onPress={() => this.changeGroupCategory('near')}>
                <CheckBox checked={isNearGroups ? true : false} />
                <Body>
                  <Text>Di Sekitar</Text>
                </Body>
              </ListItem>
            </Col>
            <Col>
              <ListItem style={styles.list} onPress={() => this.changeGroupCategory('all')}>
                <CheckBox checked={isAllGroups ? true : false} />
                <Body>
                  <Text>Semua</Text>
                </Body>
              </ListItem>
            </Col>
          </Grid>
          { groups && groups.map((g,i) => {
              return (
                <Grid key={i} style={{ marginBottom: 20 }}>
                  <Row>
                    <Image style={styles.groupImage} source={{ uri: g.image }}/>
                  </Row>
                  <Row>
                    <H2>{g.name}</H2>
                  </Row>
                  <Row>
                    <Text>{g.about}</Text>
                  </Row>
                </Grid>
              )
          })}
          { (isGroupFetched && !groups) &&
            <Grid style={{ marginBottom: 20 }}>
              <Row>
                <Text>{' Belum ada Grup di sekitar Anda '}</Text>
              </Row>
            </Grid>
          }
        </Content>
        <Footer onMenuChange={this.handleRouteChange} activeMenu={this.state.activeMenu} notif={totalNotif} />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  groupCategory: {
    borderBottomWidth: 1,
    marginBottom: 20
  },
  groupImage: {
    height: 200,
    width: (width-20)
  },
  list: {
      borderBottomWidth: 0
  }
});

export default WhatsNewScreen;