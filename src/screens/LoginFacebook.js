import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import { LoginManager, AccessToken } from 'react-native-fbsdk';

export default class LoginFacebook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // system values
      service: 'fb',
      // user fields
      user: null,
    };
    this.initUser = this.initUser.bind(this);
    this.handleFacebookLogin = this.handleFacebookLogin.bind(this);
  }

  initUser(token) {
    fetch(
      'https://graph.facebook.com/v5.0/me?fields=name,email,picture.type(large)&access_token=' +
      token,
    )
      .then(response => response.json())
      .then( json => {
        console.log(json);
        const  datacallback = {
          user : json,
          service: this.state.service
        }
        this.props.getData(datacallback)
      })
      .catch((err) => {
        console.log(err);
        console.log('ERROR GETTING DATA FROM FACEBOOK');
        return null;
      });
  }

  handleFacebookLogin() {
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      result => {
        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          AccessToken.getCurrentAccessToken().then(data => {
            const { accessToken } = data;
            this.initUser(accessToken);
          });
        }
      },
      error => {
        console.log('Login fail with error: ' + error);
      },
    );
  }

  render() {
    return (
      <TouchableOpacity
        style={styles.button}
        touchSoundDisabled={false}
        onPress={this.handleFacebookLogin}>
        <View style={styles.container}>
          <Image
            style={styles.facebookLogo}
            source={require('../assets/images/logofacebook.png')}
          />
          <Text style={styles.texto}>Continuar con Facebook</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

/*readPermissions={['email', 'public_profile']}*/
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
  },
  button: {
    alignItems: 'flex-start',
    alignSelf:'center',
    backgroundColor: '#122E5C',
    borderRadius: width*0.04,
    padding: height*0.02,
    width: width * 0.8,
    marginTop: height*0.01,
  },
  texto: {
    color: 'white',
    fontSize: width*0.04,
  },
  facebookLogo: {
    marginRight: width*0.03,
  },
});
/*
<View style={styles.container}>
        <LoginButton
          style={styles.btnFacebook}
          permissions={['email', 'user_friends', 'public_profile']}
          onLoginFinished={(error, result) => {
            if (error) {
              console.log('login has error: ' + result.error);
            } else if (result.isCancelled) {
              console.log('login is cancelled.');
            } else {
              AccessToken.getCurrentAccessToken().then(data => {
                const {accessToken} = data;
                this.initUser(accessToken);
              });
            }
          }}
          onLogoutFinished={() => console.log('logout.')}
        />
      </View>
*/
