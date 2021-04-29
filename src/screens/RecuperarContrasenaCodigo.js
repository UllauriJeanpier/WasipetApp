import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {sendCodePassword} from '../APIRequest/userRequest';
import {sendEmailPassword} from '../APIRequest/userRequest';
import AsyncStorage from '@react-native-community/async-storage';
import CustomHeader from '../components/header';
import {ScrollView} from 'react-native-gesture-handler';
export default class RecuperarContrasenaCodigo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // system data

      loading: false,
      // user data
      email: this.props.route.params.email,
      inicio: this.props.route.params.inicio,
      //inicio: null,
      // user data
      num1: null,
      num2: null,
      num3: null,
      num4: null,
      errorRequest: false,
    };
    this.codePasswordSubmit = this.codePasswordSubmit.bind(this);
    this._focusNextField = this._focusNextField.bind(this);
  }

  async EmailPasswordSubmit() {
    this.setState({loading: true});
    const {email} = this.state;
    /* const token = await this.getStoreData('token'); */
    if (email) {
      try {
        const data = {email};
        const res = await sendEmailPassword(data);
        if (typeof res.msg !== 'undefined') {
        }
      } catch (err) {
        this.setState({
          errorRequest:
            'Error de conexion, verifique que su equipo este conectado a internet',
        });
      }
    } else {
      this.setState({
        errorRequest: 'Completa todos los campos',
      });
    }
    this.setState({loading: false});
  }

  async codePasswordSubmit() {
    const {num1, num2, num3, num4} = this.state;
    const codigo = num1 + num2 + num3 + num4;
    console.log(codigo);
    /* const token = await this.getStoreData('token'); */
    const email = this.state.email;
    if (codigo) {
      try {
        const data = {codigo, email};
        const res = await sendCodePassword(data);
        console.log(res);
        if (res.auth === true) {
          this.props.navigation.navigate('CambiarContrasena', {
            email: this.state.email,
            inicio: this.state.inicio,
          });
        } else {
          this.setState({
            errorRequest: 'Código inválido intenta de nuevo',
            num1: null,
            num2: null,
            num3: null,
            num4: null,
          });
          this._focusNextField('FirstInput');
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      this.setState({
        errorRequest: 'Completa todos los campos',
      });
    }
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
  _focusNextField(nextField) {
    this.refs[nextField].focus();
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.Container}>
          <CustomHeader
            title={'Recuperar Contraseña'}
            navigation={this.props.navigation}
            isHome={false}
          />
          <View style={styles.containerContent}>
            <View style={styles.topText}>
              <Text style={styles.topContent}>
                Ingrese el código de verificación:
              </Text>
            </View>
            <View style={styles.CodeContainer}>
              <TextInput
                ref="FirstInput"
                style={styles.TxtInput}
                placeholder="X"
                maxLength={1}
                textContentType="creditCardNumber"
                value={this.state.num1}
                autoFocus={true}
                onKeyPress={() => this._focusNextField('SecondInput')}
                onChangeText={text => this.setState({num1: text.toUpperCase()})}
              />
              <TextInput
                ref="SecondInput"
                style={styles.TxtInput}
                placeholder="X"
                maxLength={1}
                textContentType="creditCardNumber"
                value={this.state.num2}
                onChangeText={text => this.setState({num2: text.toUpperCase()})}
                onKeyPress={() => this._focusNextField('ThridInput')}
              />
              <TextInput
                ref="ThridInput"
                style={styles.TxtInput}
                placeholder="X"
                maxLength={1}
                textContentType="creditCardNumber"
                value={this.state.num3}
                onKeyPress={() => this._focusNextField('ForthInput')}
                onChangeText={text => this.setState({num3: text.toUpperCase()})}
              />
              <TextInput
                ref="ForthInput"
                style={styles.TxtInput}
                placeholder="X"
                maxLength={1}
                textContentType="creditCardNumber"
                value={this.state.num4}
                onChangeText={text => this.setState({num4: text.toUpperCase()})}
              />
            </View>
            {this.state.errorRequest ? (
              <View style={styles.textErrorRequest}>
                <Text style={styles.alert2}>{this.state.errorRequest}</Text>
              </View>
            ) : null}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                touchSoundDisabled={false}
                onPress={() => this.codePasswordSubmit()}>
                <Text style={styles.buttonText}>Validar Código</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                touchSoundDisabled={false}
                onPress={() => this.EmailPasswordSubmit()}>
                <Text style={styles.buttonText}>Reenviar Codigo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const {width, height} = Dimensions.get('window');

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
  CodeContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    height: height * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topText: {
    // flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 40,
  },
  topContent: {
    fontSize: 20,
    color: '#212F3C',
    fontFamily: 'ProximaNova-Bold',
  },
  TxtInput: {
    marginHorizontal: width * 0.02,
    textAlign: 'center',
    fontSize: 45,
    width: '20%',
    height: height * 0.13,
    backgroundColor: '#FDFEFE',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#B3B3B3',
    borderStyle: 'solid',
    fontFamily: 'ProximaNova-Regular',
  },
  buttonContainer: {
    flex: 3,
    backgroundColor: 'white',
    justifyContent: 'flex-end',
    paddingBottom: 30,
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
    fontFamily: 'ProximaNova-Regular',
  },
  buttonText: {
    color: '#122E5c',
    fontSize: width * 0.04,
    fontFamily: 'ProximaNova-Regular',
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
});
