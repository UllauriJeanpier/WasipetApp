/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable no-alert */
import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
  ImageBackground,
  Platform,
  ScrollView,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';

import { connect } from 'react-redux';
import {register} from '../APIRequest/authRequest';
import ImagePicker from 'react-native-image-picker';
import CustomHeader from '../components/header';
import AsyncStorage from '@react-native-community/async-storage';
import { PermissionsAndroid } from 'react-native';
import Eye from '../assets/svg/eye';
import EyeFill from '../assets/svg/eye-fill';


const validate = values => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Este campo es obligatorio';
  }
  if (!values.surname) {
    errors.surname = 'Este campo es obligatorio';
  }
  if (!values.email) {
    errors.email = 'Este campo es obligaotorio';
  }
  /* if (!values.phone){
    errors.phone = 'Este campo es obligaotorio';
  } */
  if (!values.password) {
    errors.password = 'Este campo es obligatorio';
  }
  if (!values.confirm_password) {
    errors.confirm_password = 'Este campo es obligatorio';
  }
  if (values.password !== values.confirm_password) {
    errors.confirm_password = 'La verificacion no coincide, intentelo nuevamente';
  }

  return errors;

};


class Registry extends Component {
  constructor(props) {
    super(props);
    this.state = {

      service: null,
      photo: null,

      name: null,
      surname: null,
      email: null,
      // phone: null,
      type_user: 'user',
      password: null,
      confirm_password: null,

      errors: {
        name:null,
        surname:null,
        email:null,
        password:null,
        confirm_password:null,
      },
      showPassword:true,
      showRePassword:true,
      modalVisible: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.requestCameraPermission = this.requestCameraPermission.bind(this);
    this.setStoreData = this.setStoreData.bind(this);
    this.getStoreData = this.getStoreData.bind(this);
    this._showPassword = this._showPassword.bind(this);
    this._showRePassword = this._showRePassword.bind(this);
    this._handleName = this._handleName.bind(this);
    this._handleSurName = this._handleSurName.bind(this);
    this._handleEmail = this._handleEmail.bind(this);
    this.showModal = this.showModal.bind(this);
  }

  showModal = () => {
    this.setState(prevState => ({modalVisible: !prevState.modalVisible}));
  };

  _showPassword() {
    this.setState(prevState => ({
      showPassword: !prevState.showPassword,
    }));
  }
  _showRePassword() {
    this.setState(prevState => ({
      showRePassword: !prevState.showRePassword,
    }));
  }
  _handleName(text) {
    // eslint-disable-next-line no-control-regex
    const regexName = /[A-Z][a-zA-Z][^#&<>\"~;$^%{}?]{1,20}$/g;
    console.log('!regexEmail.test(String(text).toLowerCase())',!regexName.test(String(text).toLowerCase()));
    if (!regexName.test(String(text))) {
      this.setState({errors:{name : 'Ingrese su nombre correctamente'}});
    } else {
      this.setState({errors:{name : null}});
    }
    this.setState({name: text});
  }
  _handleSurName(text) {
    // eslint-disable-next-line no-control-regex
    const regexSurName = /[A-Z][a-zA-Z][^#&<>\"~;$^%{}?]{1,20}$/g;
    console.log('!regexEmail.test(String(text).toLowerCase())',!regexSurName.test(String(text).toLowerCase()));
    if (!regexSurName.test(String(text))) {
      this.setState({errors:{surname : 'Ingrese su apellido correctamente'}});
    } else {
      this.setState({errors:{surname : null}});
    }
    this.setState({surname: text});
  }

  _handleEmail(text) {
    // eslint-disable-next-line no-control-regex
    const regexEmail = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    if (!regexEmail.test(String(text).toLowerCase())) {
      this.setState({errors:{email : 'Ingrese su e-mail correctamente'}});
    } else {
      this.setState({errors:{email : null}});
    }
    this.setState({email: text});
  }

  async componentDidMount() {
    if (this.props.route.params.service === 'fb') {
      const { user } = this.props.route.params;
      console.log(user.picture);
      this.setState({
        service: this.props.route.params.service,
        email: user.email,
        name: user.name,
        photo: (user.picture ? user.picture.data.url : null),
      });
    } else if (this.props.route.params.service === 'gmail') {
      const { user } = this.props.route.params;
      this.setState({
        service: this.props.route.params.service,
        email: user.email,
        name: user.givenName,
        surname: user.familyName,
        photo: user.photo,   // puede ser null
      });
    }
  }
  /* async componentDidUpdate() {
    // console.log(this.state)
    if (this.props.session.token && this.props.session.user) {
      this.setStoreData('token', this.props.session.token);
      this.setStoreData('user', this.props.session.user);
      this.props.navigation.navigate('Registro_foto');
    }
  } */

  requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]);
      console.log(granted);
      if (granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You have permissions for use the camera');
      }
    } catch (err) {
      console.warn('Permisions error', err);
    }
  };

  handleSubmit = async () => {
    const { name, surname, /* phone */ email, password, confirm_password, service, photo } = this.state;

    const result = validate({ name, surname, /* phone */ email, password, confirm_password });

    console.log(Object.keys(result));
    if (Object.keys(result).length !== 0) {
      this.showModal();
      return this.setState({ errors: result });
    } else {
      const user = {
        name, surname, email, password, photo,
        provide_service: service,
      };
      //this.props.register(user);
      try {
        const response = await register(user);
        this.showModal();
        if (response.msg) {
          console.log(response.msg);
          Alert.alert(
            'Error al registrarse',
            'Este email ya se encuentra registrado',
            [{text: 'Cerrar'}],
            {cancelable: true},
          );
        } else {
          //dispatch({type: AUTHENTICATE, payload: response});
          this.setStoreData('token', response.token);
          this.setStoreData('user', response.id);
          this.setStoreData('pet', 'no');
          this.setStoreData('scan', 'no');
          console.log('User register successfuly');
          this.props.navigation.navigate('Registro_foto');
        }
      } catch (err){

      }

    }

    /* if (name && surname && phone && email && password && confirm_password) {
      if (password !== confirm_password) {
        alert('Confima nuevamente tu contraseña');
      } else {
        //this.props.navigation.navigate('Registro_foto', {user: this.state});
        const user = {
          name, surname, phone, email, password, photo,
          provide_service: service
        }
        this.props.register(user);
      }
    } else {
      console.log('Complete all the fiels');
      alert('Complete all the fields');
    } */
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
    const { errors } = this.state;
    return (
      /*<ImageBackground
        source={require('../assets/images/pruebaback.jpg')}
        style={styles.containerImage}>*/
      <KeyboardAvoidingView style={styles.container}>
        <ScrollView>
        <CustomHeader title={'Registro'} navigation={this.props.navigation} isHome={false} />
          <View style={styles.middleContainer}>
            <Text style={styles.title}>Ingresa tus datos:</Text>
            <View style={styles.containerForm}>
              <View style={styles.labelContainer}><Text style={styles.labeltext}>Nombre:</Text></View>
              <View style={styles.inputContainer}>
                <TextInput
                  label="Name"
                  name="name"
                  placeholder="Escribe tu nombre"
                  autoCompleteType="name"
                  textContentType="name"
                  style={styles.inputWidth}
                  value={this.state.name}
                  onChangeText={text => this._handleName(text)}
                />
                 {this.state.errors.name ? (
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
              {errors.name && (<Text style={styles.alert1}>{errors.name}</Text>)}
              <View style={styles.labelContainer}><Text style={styles.labeltext}>Apellido:</Text></View>
              <View style={styles.inputContainer}>
                <TextInput
                  label="Surname"
                  name="surname"
                  placeholder="Escribre tu apellido"
                  autoCompleteType="name"
                  style={styles.inputWidth}
                  value={this.state.surname}
                  onChangeText={text => this._handleSurName(text)}
                />
                 {this.state.errors.surname ? (
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
              {errors.surname && (<Text style={styles.alert1}>{errors.surname}</Text>)}
              <View style={styles.labelContainer}><Text style={styles.labeltext}>Correo:</Text></View>
              <View style={styles.inputContainer}>
                <TextInput
                  label="Correo electrónico"
                  name="email"
                  placeholder="Escribre tu correo"
                  autoCompleteType="email"
                  style={styles.inputWidth}
                  textContentType="emailAddress"
                  value={this.state.email}
                  onChangeText={text => this._handleEmail(text)}
                />
                  {this.state.errors.email ? (
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
              {errors.email && (<Text style={styles.alert1}>{errors.email}</Text>)}

              <View style={styles.labelContainer}><Text style={styles.labeltext}>Contraseña:</Text></View>
              <View style={styles.inputContainer}>
                <TextInput
                  label="Contraseña"
                  name="password"
                  placeholder="Crea una contraseña"
                  textContentType="password"
                  style={styles.inputWidth}
                  secureTextEntry={this.state.showPassword}
                  value={this.state.password}
                  onChangeText={text => this.setState({ password: text })}
                />
                <TouchableOpacity style={styles.icon2btn} onPress={() => this._showPassword()}>
                {this.state.showPassword ? (
                    <Eye width={25} height={25} style={styles.icon2} />
                  ) : (
                    <EyeFill width={25} height={25} style={styles.icon2} />
                  )}
                </TouchableOpacity>
              </View>
              {errors.password && (<Text style={styles.alert1}>{errors.password}</Text>)}
              <View style={styles.labelContainer}><Text style={styles.labeltext}>Confirmar contraseña:</Text></View>
              <View style={styles.inputContainer}>
                <TextInput
                  label="Confirmar_contraseña"
                  name="conf_password"
                  placeholder="Confirma la contraseña"
                  autoCompleteType="password"
                  style={styles.inputWidth}
                  secureTextEntry={this.state.showRePassword}
                  value={this.state.confirm_password}
                  onChangeText={text => this.setState({ confirm_password: text })}
                />
                <TouchableOpacity style={styles.icon2btn} onPress={() => this._showRePassword()}>
                {this.state.showRePassword ? (
                    <Eye width={25} height={25} style={styles.icon2} />
                  ) : (
                    <EyeFill width={25} height={25} style={styles.icon2} />
                  )}
                </TouchableOpacity>
              </View>
              {errors.confirm_password && (<Text style={styles.alert1}>{errors.confirm_password}</Text>)}
              <TouchableOpacity
                style={styles.button}
                touchSoundDisabled={false}
                onPress={() => {
                  this.showModal();
                  this.handleSubmit();
                }}>
                <Text style={styles.texto}>Continuar</Text>
              </TouchableOpacity>
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
      </KeyboardAvoidingView>
      /* </ImageBackground>*/
    );
  }
}

const mapStateToProps = state => {
  return {
    session: state.authentication,  // session.token , session.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    register: (user) => {
      return dispatch(register(user));
    },
    deauthenticate: (token) => {
      return dispatch(deauthenticate(token));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Registry);

// ----------------------   Styles ------------------------------

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#122E5C',
  },
  containerForm:{
    flexDirection: 'column',
  },
  containerImage: {
    width: '100%',
    height: height,
    flex: 1,
  },
  middleContainer: {
    //height: height * 0.95,
    backgroundColor: 'white',
    borderTopLeftRadius:25,
    borderTopRightRadius:25,
    paddingBottom:50,
  },
  title: {
    alignSelf: 'flex-start',
    textAlign: 'center',
    color: '#212F3C',
    fontWeight: 'bold',
    fontSize: width * 0.05,
    padding: 15,
    margin: 10,
    fontFamily: 'ProximaNova-Bold',
  },
  subTitle: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 21,
    padding: 15,
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
  item: {
    padding: 10,
    marginBottom: 15,
    fontSize: 13,
    height: 40,
    borderWidth: 1,
    borderRadius: width * 0.04,
    width: '85%',
    alignSelf: 'center',
    backgroundColor: '#FDFEFE',
    borderColor: '#B3B3B3',
  },
  item2: {
    padding: 10,
    marginBottom: 15,
    fontSize: 13,
    height: 40,
    width: '85%',
    alignSelf: 'center',
    backgroundColor: '#FDFEFE',
  },
  imagebutton: {
    backgroundColor: '#232323',
    color: 'white',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 35,
    paddingTop: 10,
    paddingBottom: 10,
    width: '50%',
  },
  imageView: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginBottom: 15,
  },
  button: {
    width: '85%',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: width * 0.04,
    alignSelf: 'center',
    bottom:35,
    marginTop: height * 0.12,
    borderColor: '#122E5c',
    borderWidth: width * 0.004,
  },
  texto: {
    textAlign: 'center',
    paddingVertical: height * 0.02,
    color: '#122E5c',
    fontSize: width * 0.035,
    fontFamily:'ProximaNova-Regular',
  },
  imgInput: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: 'stretch',
    alignItems: 'center',
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
  inputContainer: {
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    paddingLeft: 5,
    marginBottom: 15,
    fontSize: 13,
    height: 45,
    borderWidth: 1,
    borderRadius: width * 0.04,
    width: '85%',
    backgroundColor: '#FDFEFE',
    borderColor: '#B3B3B3',
  },
  labeltext: {
    color: '#122E5c',
    fontFamily: 'ProximaNova-Regular',
    fontSize:width * 0.035,
    paddingLeft: width * 0.01,
    paddingBottom: height * 0.01,
  },
  labelContainer: {
    alignItems: 'flex-start',
    paddingLeft: width * 0.07,
  },
  alert1: {
    color: '#FF3030',
    paddingLeft: width * 0.08,
    paddingBottom: height * 0.02,
    fontFamily: 'ProximaNova-Regular',
  },
  inputWidth: {
    width: '85%',
    color: '#122E5C',
    fontFamily: 'ProximaNova-Regular',
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
