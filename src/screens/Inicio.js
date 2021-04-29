import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import {clearReduxStore} from '../redux/actions/userActions';
import AsyncStorage from '@react-native-community/async-storage';
import UserIcon from '../assets/svg/menu-perfil';
import LoginGoogle from './LoginGoogle';
import {loginSocialNetwork} from '../APIRequest/authRequest';

import {authenticate_ext} from '../redux/actions/authActions';

class Inicio extends Component {
  constructor() {
    super();
    this.state = {
      // system
      auth: false,
      existing: false,
      // user
      service: null,
      user: null,
      // count
    };
    this.getUserResponse = this.getUserResponse.bind(this);
    this.getStoreData = this.getStoreData.bind(this);
    this.setStoreData = this.setStoreData.bind(this);
  }

  UNSAFE_componentWillMount() {
    this.props.clearReduxStore();
  }

  async componentDidUpdate() {
    if (this.state.existing) {
      // this.checkPermission();
      this.props.navigation.navigate('Principal');
    }
    /*if (this.state.auth) {
      this.props.navigation.navigate('Registry', {
        user: this.state.user,
        service: this.state.service,
      });
    }*/
  }

  async getUserResponse(result) {
    console.log(result);
    if (result) {
      this.setState({
        service: result.service,
        user: result.user,
      });
      if (this.state.user.email) {
        try {
          const response = await loginSocialNetwork({
            email: this.state.user.email,
            service: result.service,
          });
          console.log(response);
          if (!response.token) {
            console.log(response.auth);
            if (response.auth) {
              Alert.alert(
                'Error al Iniciar Sesión',
                'Alguien mas a ingresado con esta cuenta',
                [{text: 'Cerrar'}],
                {cancelable: true},
              );
            } else if (response.msg) {
              if (response.msg === "The email doesn't exists") {
                /*Alert.alert(
                  'Error al Iniciar Sesión',
                  'El correo eléctronico ingresado no existe',
                  [{text: 'Cerrar'}],
                  {cancelable: true},
                );*/
                /*this.setState({
                  auth: true,
                });*/
                this.props.navigation.navigate('Registry', {
                  user: this.state.user,
                  service: this.state.service,
                });
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
            console.log('User logged successfuly');
            if (response.petOwner == 'no') {
              this.props.navigation.navigate('Registro_foto');
            } else {
              this.props.navigation.navigate('Principal');
            }
          }
        } catch (err) {
          console.log(err);
          Alert.alert(
            'Error al Iniciar Sesión',
            'Error de conexion, verifique su conexion a internet',
            [{text: 'Cerrar'}],
            {cancelable: true},
          );
        }
        /*
        console.log(account);
        if (typeof account.token !== 'undefined') {
          this.setStoreData('token', account.token);
          this.setStoreData('user', account.user);
          this.setState({
            existing: true,
          });
        } else {
          this.setState({
            auth: true,
          });
        } */
      } else {
        console.log('Hubo Problemas a la hora de obtener los datos');
      }
    }
  }

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

  render() {
    return (
      <>
        <View style={styles.Container}>
          <View>
            <Image
              source={require('../assets/images/logo-wasipet.png')}
              style={styles.ImgMain}
            />
          </View>
          <View>
            <Text style={styles.txt1}>
              ¡La mejor forma de consentir a tu mejor amigo!
            </Text>
          </View>
        </View>
        <View style={styles.Container2}>
          <View>
            <Text style={styles.txt2}>Regístrate: </Text>
          </View>
          {/*  <View style={styles.paddLoginGoogle}>
              <LoginGoogle getData={this.getUserResponse} />
            </View> */}
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('Registry', {service: 'app'})
            }
            style={styles.paddLoginGoogle}>
            <View style={styles.email}>
              <Image
                style={styles.messagelogo}
                source={require('../assets/images/message.png')}
              />
              <Text style={styles.buttonText}>Regístrate con tu correo</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.ContainerLine}>
            <View style={styles.lineWithText} />
            <Text style={styles.textInTheLine}>ó</Text>
            <View style={styles.lineWithText} />
          </View>
          <View>
            <Text style={styles.txt2}>Ingresa a tu cuenta:</Text>
          </View>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Login')}
            style={styles.paddLoginGoogle}>
            <View style={styles.email}>
              <UserIcon style={styles.userIcon} />
              <Text style={styles.buttonText}>Iniciar sesión</Text>
            </View>
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Login')}>
            <View style={styles.ContainerLogin}>
              <Text style={styles.txt4}>Ya tengo cuenta</Text>
              <Text style={styles.txt5}>Iniciar sesión</Text>
            </View>
          </TouchableOpacity> */}
        </View>
      </>
    );
  }
}

const {width, height} = Dimensions.get('window');

const mapStateToProps = state => {
  return {
    session: state.authentication, // session.token , session.user
    user: state.userUpdates,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    clearReduxStore: () => {
      return dispatch(clearReduxStore());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Inicio);

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FDFEFE',
    justifyContent: 'center',
    maxHeight: height,
    //marginTop: 30,
  },
  paddLoginGoogle: {
    paddingHorizontal: 20,
  },
  ContainerLogin: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  ContainerLine: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginTop: 25,
    marginBottom: 25,
  },
  ImgMain: {
    resizeMode: 'contain',
    // margin: 'auto',
    //marginLeft: 0,
    //marginRight: width * 0.3,
    width: width * 0.8,
    height: height * 0.3,
  },
  textInTheLine: {
    alignSelf: 'center',
    paddingHorizontal: 5,
    fontSize: 18,
    fontFamily: 'ProximaNova-Bold',
    color: '#B3B3B3',
  },
  lineWithText: {
    backgroundColor: '#B3B3B3',
    height: 1,
    flex: 1,
    alignSelf: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  Container2: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 0,
  },
  txt1: {
    paddingTop: 25,
    color: '#122E5C',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    maxWidth: '65%',
    fontFamily: 'ProximaNova-Bold',
  },
  txt2: {
    paddingLeft: 25,
    marginVertical: 10,
    color: '#122E5C',
    fontSize: 20,
    textAlign: 'left',
    fontFamily: 'ProximaNova-Bold',
  },
  buttonText: {
    color: '#122E5c',
    //fontSize: width * 0.04,
    fontSize: 18,
    fontFamily: 'ProximaNova-Regular',
  },
  email: {
    padding: height * 0.02,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: width * 0.04,
    borderColor: '#122E5c',
    borderWidth: width * 0.004,
  },
  messagelogo: {
    marginRight: 10,
    width: 25,
  },
  txt3: {
    color: '#B3B3B3',
    fontSize: 21,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  txt4: {
    marginHorizontal: 10,
    marginTop: height * 0.04,
    color: '#B3B3B3',
    fontSize: width * 0.038,
    textAlign: 'center',
    fontFamily: 'ProximaNova-Regular',
  },
  txt5: {
    //marginHorizontal: 10,
    marginTop: height * 0.04,
    color: '#122E5c',
    fontSize: width * 0.038,
    textAlign: 'center',
    fontFamily: 'ProximaNova-Regular',
    textDecorationLine: 'underline',
  },
  userIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
});
