import React, { Component } from 'react';
import { StyleSheet, Image, Dimensions } from 'react-native';
import { Container, Content, ListItem, CheckBox, Text, Body, H2 } from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
import { new_groups } from '../data/dummies';
import Footer from './partials/Footer';

class WhatsNewScreen extends Component {

  constructor (props) {
    super(props);

    this.state = {
      isUserLogin: true,
      activeMenu: 'WhatsNew'
    }

    this.handleRouteChange = this.handleRouteChange.bind(this);
  }

  handleRouteChange (url) {
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
          <Grid style={{ borderBottomWidth: 1, marginBottom: 20 }}>
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
          { new_groups.map( group => {
              return (
                <Grid key={group.id} style={{ marginBottom: 20 }}>
                  <Row>
                    <Image style={{height: 200, width: (width-20)}} source={group.image} />
                  </Row>
                  <Row>
                    <H2>{group.title}</H2>
                  </Row>
                  <Row>
                    <Text>{group.description}</Text>
                  </Row>
                </Grid>
              )
          })}
        </Content>
        <Footer onMenuChange={this.handleRouteChange} activeMenu={this.state.activeMenu} />
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