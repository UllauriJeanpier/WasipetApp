import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';

export default class LoginGoogle extends Component {
  constructor() {
    super();
    this.state = {
      // system values
      service: 'fb',
      // user fields
      user: null,
    };
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
    this.getCurrentUserInfo = this.getCurrentUserInfo.bind(this);
  }

  componentDidMount() {
    GoogleSignin.configure({
      webClientId:
        '39060478916-d44rk3hhvmchedichl0mpqi3a1u45ib2.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    });
    this.getCurrentUserInfo();
  }

  signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const userInfo = await GoogleSignin.signIn();
      this.user = userInfo.user;
      if (this.user) {
        this.props.getData({
          service: 'gmail',
          user: this.user,
        });
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.log('user cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        console.log('operation (e.g. sign in) is in progress already');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        Alert.alert(
          'Error al Iniciar Sesión',
          'play services not available or outdated',
          [{text: 'Cerrar'}],
          {cancelable: true},
        );
        console.log('play services not available or outdated');
      } else {
        console.log(error);
      }
    }
  };

  signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      this.user = []; // Remember to remove the user from your app's state as well
      console.log('Estas deslogueado');
    } catch (error) {
      console.error(error);
    }
  };

  getCurrentUserInfo = async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      this.setState({userInfo});
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        // user has not signed in yet
      } else {
        Alert.alert('Error al Iniciar Sesión', error.code, [{text: 'Cerrar'}], {
          cancelable: true,
        });
      }
    }
  };

  render() {
    return (
      <View>
        {/* <GoogleSigninButton
          style={styles.buttonGoogle}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={this.signIn}
          disabled={this.state.isSigninInProgress}
        /> */}
        <TouchableOpacity
          style={styles.buttonGoogle}
          touchSoundDisabled={false}
          onPress={this.signIn}>
          <View style={styles.container}>
            <Image
              style={styles.googlelogo}
              source={require('../assets/images/logogoogle.png')}
            />
            <Text style={styles.texto}>Continuar con Google</Text>
          </View>
        </TouchableOpacity>
        {/*<TouchableOpacity
          style={styles.button}
          touchSoundDisabled={false}
          onPress={this.signOut}>
          <View style={styles.container}>
            <Text style={styles.texto}>Salir de Google</Text>
          </View>
        </TouchableOpacity>*/}
      </View>
    );
  }
}
const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
  },
  buttonGoogle: {
    alignItems: 'flex-start',
    alignSelf: 'center',
    backgroundColor: 'transparent',
    borderRadius: width * 0.04,
    padding: height * 0.02,
    width: '100%',
    marginTop: height * 0.03,
    borderColor: '#122E5C',
    borderWidth: width * 0.004,
  },
  button: {
    alignSelf: 'center',
    alignItems: 'center',
  },
  texto: {
    color: '#122E5C',
    //fontSize: height * 0.025,
    fontSize: 18,
    fontFamily: 'ProximaNova-Regular',
  },
  googlelogo: {
    marginRight: width * 0.02,
    width: 25,
  },
});
