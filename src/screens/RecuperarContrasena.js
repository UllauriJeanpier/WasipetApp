import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import {sendEmailPassword} from '../APIRequest/userRequest';
import AsyncStorage from '@react-native-community/async-storage';
import CustomHeader from '../components/header';
import InputCheck from '../assets/svg/input-check';

export default class RecuperarContrasena extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // system data
      inicio: this.props.route.params.inicio,
      loading: false,
      // user data
      email: null,
      errorEmail: false,
      errorRequest: null,
    };
    this._handleEmail = this._handleEmail.bind(this);
    this.EmailPasswordSubmit = this.EmailPasswordSubmit.bind(this);
  }

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

  async EmailPasswordSubmit() {
    this.setState({loading: true});
    const {email, errorEmail} = this.state;
    /* const token = await this.getStoreData('token'); */
    if (email && !errorEmail) {
      try {
        const data = {email};
        const res = await sendEmailPassword(data);
        console.log(res);
        if (res.msg === 'Send it') {
          this.props.navigation.navigate('RecuperarContrasenaCodigo', {
            inicio: this.state.inicio,
            email: this.state.email,
          });
        } else {
          this.setState({
            errorRequest:
              'Ingrese el e-mail, con el cual se registró inicialmente',
          });
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      this.setState({
        errorRequest: 'Ingrese un correo electrónico válido',
      });
    }
    this.setState({loading: false});
  }

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
      <ScrollView>
        <CustomHeader
          title={'Recuperar Contraseña'}
          navigation={this.props.navigation}
          isHome={false}
        />
        <View style={styles.Container}>
          <View style={styles.topText}>
            <Text style={styles.topContent}>
              Ingresa tu correo electrónico:
            </Text>
          </View>
          <View style={styles.contentSpace}>
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
                <InputCheck width={25} height={25} style={styles.icon1} />
              )}
            </View>
            {this.state.errorEmail ? (
              <Text style={styles.alert1}>Escribe un correo válido</Text>
            ) : null}
            <View style={styles.pruebaText}>
              <Text style={styles.TxtEnd}>
                Enviaremos un correo a la siguiente dirección para poder
                recuperar tu contraseña
              </Text>
            </View>
            {this.state.errorRequest ? (
              <View style={styles.textErrorRequest}>
                <Text style={styles.alert2}>{this.state.errorRequest}</Text>
              </View>
            ) : null}
          </View>
          <View style={styles.LastContainer}>
            <TouchableOpacity
              onPress={() => this.EmailPasswordSubmit()}
              style={styles.positionBtnSend}>
              <Text style={styles.buttonText}>ENVIAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}
const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  Container: {
    flexDirection: 'column',
    height: height * 0.91,
    flex: 1,
    backgroundColor: '#122E5C',
  },
  LastContainer: {
    flex: 2,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    //paddingBottom: 50,
  },
  topText: {
    alignItems: 'flex-start',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
    paddingBottom: 1,
    //marginBottom: 20,
  },
  contentSpace: {
    width: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  pruebaText: {
    backgroundColor: 'white',
    paddingHorizontal: 25,
    marginTop: 40,
  },
  topContent: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212F3C',
    paddingTop: 20,
  },
  TxtEnd: {
    fontSize: 13,
    textAlign: 'center',
    color: '#B3B3B3',
  },
  buttonText: {
    color: '#122E5c',
    fontSize: width * 0.04,
    fontFamily: 'ProximaNova-Regular',
  },
  label: {
    fontSize: width * 0.035,
    paddingBottom: height * 0.01,
    marginTop: 15,
    color: '#122E5c',
    fontFamily: 'ProximaNova-Regular',
  },
  inputContainer: {
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    paddingLeft: width * 0.02,
    marginBottom: 10,
    fontSize: 13,
    borderWidth: 1,
    borderRadius: width * 0.04,
    width: '100%',
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
    textAlign: 'center',
    fontFamily: 'ProximaNova-Regular',
  },
  positionBtnSend: {
    position: 'absolute',
    bottom: 20,
    alignContent: 'center',
    width: '100%',
    backgroundColor: 'white',
    fontSize: 22,
    alignItems: 'center',
    borderRadius: width * 0.04,
    borderColor: '#122E5c',
    //marginTop: '5%',
    alignSelf: 'center',
    borderWidth: width * 0.003,
    paddingVertical: height * 0.02,
  },
  textErrorRequest: {
    marginTop: 15,
    width: '100%',
  },
});
