import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Footer, FooterTab, Button, Icon, Text } from 'native-base';

class FooterScreen extends Component {

    constructor (props) {
        super(props);
    
        this.handleRouteChange = this.handleRouteChange.bind(this);
    }

    handleRouteChange (route) {
        this.props.onMenuChange(route)
    }

    render () {
        let activeMenu = this.props.activeMenu;
        return (
            <Footer>
                <FooterTab>
                    <Button
                      onPress={() => this.handleRouteChange('Home')} 
                      active={activeMenu === 'Home' ? true : false }
                      vertical>
                        <Icon name="home" />
                        <Text style={styles.text}>Home</Text>
                    </Button>
                    <Button
                      onPress={() => this.handleRouteChange('WhatsNew')}
                      active={activeMenu === 'WhatsNew' ? true : false }
                      vertical>
                        <Icon name="megaphone" />
                        <Text style={styles.text}>Baru</Text>
                    </Button>
                    <Button
                      onPress={() => this.handleRouteChange('Notification')}
                      active={activeMenu === 'Notification' ? true : false }
                      vertical>
                        <Icon name="notifications" />
                        <Text style={styles.text}>Notifikasi</Text>
                    </Button>
                    <Button
                      onPress={() => this.handleRouteChange('Profile')}
                      active={activeMenu === 'Profile' ? true : false }
                      vertical>
                        <Icon name="person" />
                        <Text style={styles.text}>Profil</Text>
                    </Button>
                </FooterTab>
            </Footer>
        );
    }
}

const styles = StyleSheet.create({
    text: {
        fontSize: 9.5
    }
})

export default FooterScreen;