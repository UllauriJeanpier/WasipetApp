import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {updatePassword} from '../APIRequest/userRequest';
import AsyncStorage from '@react-native-community/async-storage';
import Eye from '../assets/svg/eye';
import EyeFill from '../assets/svg/eye-fill';
import CustomHeader from '../components/header';

export default class RecuperarContrasena extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // system data
      inicio: this.props.route.params.inicio,
      email: this.props.route.params.email,
      //inicio: null,
      // user data
      password: null,
      confirm_password: null,
      errorPassword: false,
      errorConfirm_password: false,
      showPassword: true,
      showRePassword: true,
      errorText: null,
      resultText: null,
    };
    this.updatePasswordSubmit = this.updatePasswordSubmit.bind(this);
    this._showPassword = this._showPassword.bind(this);
    this._showRePassword = this._showRePassword.bind(this);
  }

  async updatePasswordSubmit() {
    const {confirm_password, password} = this.state;
    const email = this.state.email;
    /* const token = await this.getStoreData('token'); */
    if (password && confirm_password) {
      if (password === confirm_password) {
        try {
          const data = {password, email};
          const res = await updatePassword(data);
          if (res.msg === 'Success') {
            this.setState({
              errorText: null,
              resultText: 'Contraseña cambiada con éxito',
            });
            setTimeout(() => {
              this.props.navigation.navigate(this.state.inicio);
            }, 1000);
          } else {
            this.setState({
              errorText:
                'Ingrese el email, con el cual se registro inicialmente',
            });
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        this.setState({
          errorText:
            'Verifica correctamente tu contraseña, inténtalo nuevamente',
        });
      }
    } else {
      this.setState({errorText: 'Completa todos los campos'});
    }
  }

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
    const {title} = this.props.route.params;
    return (
      <ScrollView>
        <View style={styles.Container}>
          <CustomHeader
            title={!title ? 'Recuperar contraseña' : title}
            navigation={this.props.navigation}
            isHome={false}
          />
          <View style={styles.containerContent}>
            <View style={styles.topText}>
              <Text style={styles.topContent}>Ingresa nueva contraseña:</Text>
            </View>

            <View style={styles.codeContainer}>
              <View style={styles.labelContainer}>
                <Text style={styles.labeltext}>Contraseña:</Text>
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  label="Contraseña"
                  name="password"
                  placeholder="Crea una contraseña"
                  textContentType="password"
                  secureTextEntry={this.state.showPassword}
                  value={this.state.password}
                  onChangeText={text => this.setState({password: text})}
                />
                <TouchableOpacity
                  style={styles.icon2btn}
                  onPress={() => this._showPassword()}>
                  {this.state.showPassword ? (
                    <Eye width={25} height={25} style={styles.icon2} />
                  ) : (
                    <EyeFill width={25} height={25} style={styles.icon2} />
                  )}
                </TouchableOpacity>
              </View>
              {this.state.errorPassword && (
                <Text style={styles.alert1}>Escriba su contraseña</Text>
              )}
              <View style={styles.labelContainer}>
                <Text style={styles.labeltext}>Confirmar contraseña:</Text>
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  label="Confirmar_contraseña"
                  name="conf_password"
                  placeholder="Confirma la contraseña"
                  autoCompleteType="password"
                  secureTextEntry={this.state.showRePassword}
                  value={this.state.confirm_password}
                  onChangeText={text => this.setState({confirm_password: text})}
                />
                <TouchableOpacity
                  style={styles.icon2btn}
                  onPress={() => this._showRePassword()}>
                  {this.state.showRePassword ? (
                    <Eye width={25} height={25} style={styles.icon2} />
                  ) : (
                    <EyeFill width={25} height={25} style={styles.icon2} />
                  )}
                </TouchableOpacity>
              </View>
              {this.state.errorConfirm_password && (
                <Text style={styles.alert1}>Escriba su contraseña</Text>
              )}
            </View>
            {this.state.errorText ? (
              <View style={styles.textErrorRequest}>
                <Text style={styles.alert2}>{this.state.errorText}</Text>
              </View>
            ) : null}
            {this.state.resultText ? (
              <View style={styles.textErrorRequest}>
                <Text style={styles.alert3}>{this.state.resultText}</Text>
              </View>
            ) : null}

            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.button}
                touchSoundDisabled={false}
                onPress={() => this.updatePasswordSubmit()}>
                <Text style={styles.buttonText}>Continuar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const dim = Dimensions.get('screen');

const width =
  dim.height >= dim.width
    ? Dimensions.get('window').width
    : Dimensions.get('window').height;
const height =
  dim.height >= dim.width
    ? Dimensions.get('window').height
    : Dimensions.get('window').width;

const styles = StyleSheet.create({
  Container: {
    height: height,
    width: width,
    backgroundColor: '#122E5C',
  },
  containerContent: {
    flex: 6,
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
    backgroundColor: 'white',
  },
  topText: {
    //flex: 1,
    paddingTop: 20,
    marginBottom: 20,
    backgroundColor: 'white',
    borderTopStartRadius: 25,
    paddingHorizontal: 20,
    borderTopEndRadius: 25,
  },
  codeContainer: {
    flex: 2,
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  buttonsContainer: {
    flex: 3,
    backgroundColor: 'white',
    justifyContent: 'flex-end',
    paddingBottom: 30,
  },
  topContent: {
    fontSize: 20,
    fontFamily: 'ProximaNova-Bold',
    color: '#212F3C',
    textAlign: 'left',
  },
  TextMd: {
    color: 'blue',
    textAlign: 'center',
    margin: 30,
    fontSize: 25,
  },
  TxtInput: {
    padding: 15,
    borderStyle: 'solid',
    alignSelf: 'center',
    fontSize: 15,
    backgroundColor: '#FDFEFE',
    width: '85%',
    margin: 30,
    borderRadius: 10,
  },
  TxtEndContainer: {
    alignSelf: 'center',
    width: '90%',
    marginLeft: 25,
  },
  TxtEnd: {
    color: 'black',
    fontSize: 15,
  },
  btnEnviar: {
    width: '85%',
    alignItems: 'center',
    backgroundColor: '#212F3C',
    borderRadius: 10,
    alignSelf: 'center',
  },
  buttonText: {
    textAlign: 'center',
    paddingVertical: height * 0.02,
    color: '#122E5c',
    fontSize: width * 0.035,
    fontFamily: 'ProximaNova-Regular',
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
    width: '100%',
    backgroundColor: '#FDFEFE',
    borderColor: '#B3B3B3',
  },
  labeltext: {
    color: '#122E5c',
    fontFamily: 'ProximaNova-Regular',
    fontSize: width * 0.035,
    paddingLeft: width * 0.01,
    paddingBottom: height * 0.01,
  },
  labelContainer: {
    alignItems: 'flex-start',
  },
  alert1: {
    color: '#FF3030',
    paddingLeft: width * 0.08,
    paddingBottom: height * 0.02,
    fontFamily: 'ProximaNova-Regular',
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
  button: {
    width: '85%',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: width * 0.04,
    alignSelf: 'center',
    bottom: 35,
    marginTop: height * 0.2,
    borderColor: '#122E5c',
    borderWidth: width * 0.004,
  },
  textErrorRequest: {
    marginTop: 0,
    width: '100%',
  },
  alert2: {
    color: '#FF3030',
    alignSelf: 'center',
    textAlign: 'center',
    fontFamily: 'ProximaNova-Regular',
  },
  alert3: {
    color: '#4CB622',
    alignSelf: 'center',
    textAlign: 'center',
    fontFamily: 'ProximaNova-Regular',
  },
});
