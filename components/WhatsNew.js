import React, { Component } from 'react';
import { StyleSheet, Image, Dimensions } from 'react-native';
import { Container, Content, Footer, ListItem, CheckBox, Text, Body, FooterTab, Button, Icon, H2 } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import { new_groups } from '../data/dummies';

class WhatsNewScreen extends Component {

  constructor (props) {
    super(props);

    this.state = {
      isUserLogin: true
    }

    this.checkLoginStatus = this.checkLoginStatus.bind(this);
  }

  checkLoginStatus (url) {
    if (!this.state.isUserLogin) {
      return this.props.navigation.navigate('Login');
    } else {
      return this.props.navigation.navigate(url);
    }
  }

  render() {
    let { height, width } = Dimensions.get('window');
    return (
      <Container>
        <Content padder={true}>
          <Grid>
            <Col>
              <ListItem style={styles.list}>
                <CheckBox checked={true} />
                <Body>
                  <Text>Grup</Text>
                </Body>
              </ListItem>
            </Col>
            <Col>
              <ListItem style={styles.list}>
                <CheckBox checked={false} />
                <Body>
                  <Text>Berita</Text>
                </Body>
              </ListItem>
            </Col>
          </Grid>
          {new_groups.map( group => {
              return (
                <Grid key={group.id}>
                  <Row>
                    <Image style={{height: 130, width: (width-20)}} source={group.image} />
                  </Row>
                  <Row>
                    <H2>{group.title}</H2>
                  </Row>
                  <Row>
                    <Text>{group.description}</Text>
                  </Row>
                </Grid>
              )
            }
          )}
        </Content>
        <Footer>
          <FooterTab>
            <Button onPress={() => this.checkLoginStatus('Home')} vertical>
              <Icon active name="home" />
              <Text style={{fontSize: 9.5}}>Home</Text>
            </Button>
            <Button onPress={() => this.checkLoginStatus('WhatsNew')} vertical active>
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

const styles = StyleSheet.create({
  list: {
      borderBottomWidth: 0
  }
});

export default WhatsNewScreen;