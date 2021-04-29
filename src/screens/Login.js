import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';

import {API} from '../config';

import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';
import CustomHeader from '../components/header';
import {login} from '../APIRequest/authRequest';
import {
  authenticate,
  deauthenticate,
  reauthenticate,
} from '../redux/actions/authActions';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      respuestaError: null,
      errorEmail: false,
      erroPassword: false,
      showPassword: true,
      modalVisible: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getStoreData = this.getStoreData.bind(this);
    this.setStoreData = this.setStoreData.bind(this);
    this._showPassword = this._showPassword.bind(this);
    this._handleEmail = this._handleEmail.bind(this);
    this.updatePasswordSubmit = this.updatePasswordSubmit.bind(this);
    this.showModal = this.showModal.bind(this);
    // this.checkPermission = this.checkPermission.bind(this);
    // this.requestPermission = this.requestPermission.bind(this);
    //  this.getToken = this.getToken.bind(this);
  }

  showModal = () => {
    this.setState(prevState => ({modalVisible: !prevState.modalVisible}));
  };

  _handleEmail(text) {
    // eslint-disable-next-line no-control-regex
    const regexEmail = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    if (!regexEmail.test(String(text).toLowerCase())) {
      this.setState({errorEmail: true});
    } else {
      this.setState({errorEmail: false});
    }
    this.setState({email: text});
  }

  _showPassword() {
    this.setState(prevState => ({
      showPassword: !prevState.showPassword,
    }));
  }

  /* async componentDidMount() {
    const token = await this.getStoreData('token');
    const user = await this.getStoreData('user');

    console.log(token);
    console.log(user)

    if (token && user) {
      let session = {
        token,
        id: user,
      };
      //  this.checkPermission();
      //this.props.reauthenticate(session);
      this.props.navigation.navigate('Menu');
    }
    //AsyncStorage.getItem('token').then(value => (session.token = value));
    //AsyncStorage.getItem('user').then(value => (session.user = value));
  } */

  /* async componentDidUpdate() {
    //let token = this.getStoreData('data');
    // console.log(this.props.session.auth);
    if (this.props.session.token && this.props.session.user) {
      this.setStoreData('token', this.props.session.token);
      this.setStoreData('user', this.props.session.user);
      // this.checkPermission();
      this.props.navigation.navigate('Principal');
    }
  } */

  setStoreData = async (key, value) => {
    //console.log(key, value);
    try {
      await AsyncStorage.setItem(key, value);
    } catch (err) {
      console.log(err);
    }
  };

  getStoreData = async key => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        return value;
      }
      return value;
    } catch (err) {
      console.log(err);
    }
    return null;
  };

  /*
  async checkPermission() {
    const enabled = await messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  //3
  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      fcmToken = await messaging().getToken();
      if (fcmToken) {
        // user has a device token
        await this.setStoreData('fcmToken', fcmToken);
       // this.updatefcmToken(fcmToken);

      //Agregar token de dispositivo
      } else {
        console.log('no se puedo obtener fcmtoken de firebase');
      }
    }
  } */

  //2
  /*
  async requestPermission() {
    try {
      if (!messaging().isDeviceRegisteredForRemoteMessages) {
        await messaging().registerDeviceForRemoteMessages();
      }

      await messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  } */

  async updatefcmToken(token) {
    let data = new FormData();
    data.append('id', this.props.session.user);
    data.append('tokenfcm', token);

    fetch(`${API}/tokenfcm`, {
      method: 'PUT',
      headers: {
        // eslint-disable-next-line prettier/prettier
        'Accept': 'application/json',
      },
      body: data,
    })
      .then(response => response.json())
      .then(response => {
        console.log(`update token : ${response.auth}`);
      })
      .catch(err => {
        console.log(err);
      });
  }

  async handleSubmit() {
    try {
      const {email, password} = this.state;
      if (email && password) {
        //this.props.authenticate(this.state);
        try {
          const response = await login({email, password});
          console.log(response);
          if (!response.token) {
            console.log(response.auth);
            if (response.auth) {
              console.log('lOGIN FAILED');
              Alert.alert(
                'Error al Iniciar Sesión',
                'Alguien mas a ingresado con esta cuenta',
                [{text: 'Cerrar'}],
                {cancelable: true},
              );
            } else if (response.msg) {
              if (response.msg === "The email doesn't exists") {
                Alert.alert(
                  'Error al Iniciar Sesión',
                  'El correo eléctronico ingresado no existe',
                  [{text: 'Cerrar'}],
                  {cancelable: true},
                );
              } else {
                Alert.alert(
                  'Error al Iniciar Sesión',
                  'Tu contraseña o email son incorrectos',
                  [{text: 'Cerrar'}],
                  {cancelable: true},
                );
              }
            }
          } else {
            this.setStoreData('token', response.token);
            this.setStoreData('user', response.id);
            this.setStoreData('pet', response.petOwner);
            if (response.petOwner == 'no') {
              this.props.navigation.navigate('Registro_foto');
            } else {
              this.props.navigation.navigate('Principal');
            }
          }
        } catch (err) {
          console.log('lOGIN FAILED', err);
          Alert.alert(
            'Error al Iniciar Sesión',
            'Error de conexion,, verifique su conexion a internet',
            [{text: 'Cerrar'}],
            {cancelable: true},
          );
        }

        this.setState({respuestaError: null});
      } else {
        this.setState({
          respuestaError: 'Complete todos campos correctamente',
        });
      }
    } catch (e) {
      console.log(e);
      this.setState({
        respuestaError: 'Complete todos campos correctamente',
      });
    }
  }

  updatePasswordSubmit() {
    this.props.navigation.navigate('RecuperarContrasena', {inicio: 'Login'});
  }

  render() {
    return (
      /*<ImageBackground
        source={require('../assets/images/pruebaback.jpg')}
        style={styles.containerImage}>*/
      <ScrollView>
        <View style={styles.container}>
          <CustomHeader
            title={'Acceder'}
            navigation={this.props.navigation}
            isHome={false}
          />
          <View style={styles.topContainer}>
            <Text style={styles.title}>Ingresa a tu cuenta:</Text>
            {/*<Image
              style={styles.images}
              source={require('../assets/images/logo.png')}
            />*/}
          </View>
          <View style={styles.middleContainer}>
            {/*<Text style={styles.subTitle}>Formulario</Text>*/}
            <View style={styles.containerImage}>
              <Text style={styles.label}>Correo:</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  label="Correo electrónico"
                  name="email"
                  placeholder="Escribe tu correo"
                  autoCompleteType="email"
                  textContentType="emailAddress"
                  value={this.state.email}
                  style={styles.inputWidth}
                  onChangeText={text => this._handleEmail(text)}
                />
                {this.state.errorEmail ? (
                  <Image
                    source={require('../assets/images/error.png')}
                    style={styles.icon1}
                  />
                ) : (
                  <Image
                    source={require('../assets/images/check.png')}
                    style={styles.icon1}
                  />
                )}
              </View>
              {this.state.errorEmail ? (
                <Text style={styles.alert1}>Escribe un correo válido</Text>
              ) : null}
              <Text style={styles.label}>Contraseña:</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  label="Contraseña"
                  name="password"
                  placeholder="Escribre tu contraseña"
                  autoCompleteType="password"
                  secureTextEntry={this.state.showPassword}
                  style={styles.inputWidth}
                  value={this.state.password}
                  onChangeText={text => this.setState({password: text})}
                />
                <TouchableOpacity
                  style={styles.icon2btn}
                  onPress={() => this._showPassword()}>
                  <Image
                    style={styles.icon2}
                    source={require('../assets/images/vision.png')}
                  />
                </TouchableOpacity>
              </View>
              {this.state.respuestaError ? (
                <Text style={styles.alert2}>{this.state.respuestaError}</Text>
              ) : null}
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={styles.button}
                  touchSoundDisabled={false}
                  onPress={() => {
                    this.handleSubmit();
                  }}>
                  <Text style={styles.texto}>Iniciar sesión</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  touchSoundDisabled={false}
                  onPress={() => this.updatePasswordSubmit()}>
                  <Text style={styles.texto}>Recuperar contraseña</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Modal transparent={true} visible={this.state.modalVisible}>
            <TouchableOpacity
              //onPress={() => this.showModal()}
              style={styles.containerfondo}>
              <View style={styles.containerModalfond}>
                <ActivityIndicator size="large" color="#122E5C" />
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
      </ScrollView>
      /* </ImageBackground>*/
    );
  }
}

const mapStateToProps = state => {
  return {
    session: state.authentication, // session.token , session.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    authenticate: user => {
      return dispatch(authenticate(user));
    },
    deauthenticate: () => {
      return dispatch(deauthenticate());
    },
    reauthenticate: session => {
      return dispatch(reauthenticate(session));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login);

/*readPermissions={['email', 'public_profile']}*/

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#122E5C',
  },
  containerInputs: {
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  containerImage: {
    width: '100%',
    //height: height,
    flex: 1,
    backgroundColor: 'white',
  },
  inputContainer: {
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    paddingLeft: width * 0.02,
    marginBottom: 15,
    fontSize: 13,
    height: height * 0.07,
    borderWidth: 1,
    borderRadius: width * 0.04,
    width: '90%',
    backgroundColor: '#FDFEFE',
    borderColor: '#B3B3B3',
  },
  inputWidth: {
    width: '85%',
    color: '#122E5C',
    fontFamily: 'ProximaNova-Regular',
  },
  icon1: {
    resizeMode: 'center',
    position: 'absolute',
    marginRight: 15,
    right: 0,
    width: 25,
    height: 25,
    backgroundColor: 'white',
  },
  icon2btn: {
    resizeMode: 'center',
    position: 'absolute',
    marginRight: 15,
    right: 0,
    backgroundColor: 'white',
  },
  icon2: {
    width: 25,
    height: 25,
  },
  topContainer: {
    paddingLeft: width * 0.06,
    paddingTop: height * 0.05,
    paddingBottom: height * 0.02,
    alignItems: 'flex-start',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: 'white',
  },
  middleContainer: {
    flex: 4,
    backgroundColor: 'white',
  },
  title: {
    color: '#122E5c',
    fontSize: width * 0.05,
    fontFamily: 'ProximaNova-Bold',
  },
  subTitle: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 21,
    padding: 15,
  },
  images: {
    width: 80,
    height: 80,
  },
  button: {
    backgroundColor: 'white',
    width: '90%',
    fontSize: 22,
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: width * 0.04,
    borderColor: '#122E5c',
    marginTop: '5%',
    borderWidth: width * 0.003,
    paddingVertical: height * 0.02,
  },
  buttonsContainer: {
    marginTop: height * 0.3,
    paddingBottom: 60,
  },
  texto: {
    color: '#122E5c',
    fontSize: width * 0.04,
    fontFamily: 'ProximaNova-Regular',
  },
  btnFacebook: {
    marginTop: 25,
    backgroundColor: 'blue',
    borderRadius: 10,
  },
  label: {
    fontSize: width * 0.035,
    paddingLeft: width * 0.06,
    paddingBottom: height * 0.01,
    color: '#122E5c',
    fontFamily: 'ProximaNova-Regular',
  },
  alert1: {
    color: '#FF3030',
    paddingLeft: width * 0.06,
    paddingBottom: height * 0.02,
    fontFamily: 'ProximaNova-Regular',
  },
  alert2: {
    paddingTop: height * 0.02,
    color: '#FF3030',
    alignSelf: 'center',
  },
  //Modal de Confirmación:
  containerfondo: {
    flex: 1,
    backgroundColor: '#000000aa',
  },
  containerModalfond: {
    backgroundColor: '#ffffff',
    marginTop: height * 0.4,
    marginLeft: width * 0.15,
    marginRight: width * 0.15,
    marginBottom: width * 0.15,
    padding: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
