import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Clipboard,
  Alert,
} from 'react-native';
import {Dimensions} from 'react-native';
import Share from 'react-native-share';
import {addDeferred} from '../APIRequest/userRequest';
import AsyncStorage from '@react-native-community/async-storage';
import CustomHeader from '../components/header';

import Copy from '../assets/svg/copy';
import Send from '../assets/svg/send';

export default class Referidos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      codigo: null,
      referedCod: null,
      errors: {
        referedCod: null,
      },
      errorCod: null,
    };
    this.navigationTerms = this.navigationTerms.bind(this);
  }

  async UNSAFE_componentWillMount() {
    const id = await this.getStoreData('user');
    this.setState({
      codigo: id,
    });
  }

  validate = values => {
    const errors = {};
    if (!values.referedCod) {
      errors.referedCod = 'Este campo es obligatorio';
      this.setState({
        errorCod: 'Ingrese un codigo',
      });
    }
    return errors;
  };

  copyClipboard = () => {
    Clipboard.setString(this.state.codigo);
  };

  getStoreData = async key => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        return value;
      } else {
        return null;
      }
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  onshare = async () => {
    try {
      const shareOptions = {
        /* title: 'Share via',
        message: 'some message',
        url: 'some share url',
        social: Share.Social.WHATSAPP,
        whatsAppNumber: '9199999999', // country code + phone number
        filename: 'test', // only for base64 file in Android */

        url: 'https://play.google.com/store/apps/details?id=com.wasipet_app',
        title: 'Invita a tus amigos y gana 10 puntos',
        message: `¡Hola Pet Lover! Te regalo 10 puntos para que disfrutes canjeando por tus productos favoritos para tu mascota 🐶🐱 ${'\n'}
        Descarga la app, activa mi código ${
          this.state.codigo
        } y empieza a canjear.
        `,
        //icon: 'data:<data_type>/<file_extension>;base64,<base64_data>',
      };
      Share.open(shareOptions);
    } catch (error) {
      alert(error.message);
    }
  };

  submitCode = async () => {
    const token = await this.getStoreData('token');
    const {referedCod} = this.state;
    const result = this.validate({referedCod});
    if (Object.keys(result).length !== 0) {
      return this.setState({errors: result});
    } else {
      try {
        const res = await addDeferred(token, referedCod);
        console.log(res);
        if (res.msg == 'error, el codigo es el mismo') {
          this.setState({
            errorCod: 'Ingrese un codigo valido, diferente al suyo',
          });
        } else if (res.msg == 'ok') {
          // refrescar puntos
          this.props.navigation.goBack();
        } else {
          console.log('entro aqui');
          this.setState({
            errorCod: 'Ingrese un codigo valido',
          });
        }
      } catch (err) {
        console.log(err);
        alert(
          'Error de red, verifique que su equipo este conectado a internet, o intentenlo mas tarde',
        );
      }
    }
  };

  navigationTerms = async () => {
    await this.props.navigation.navigate('PoliticasPrivacidad');
  };

  render() {
    return (
      <KeyboardAvoidingView>
        <ScrollView>
          <CustomHeader
            title={'Mi Perfil'}
            navigation={this.props.navigation}
            isHome={false}
          />
          <View style={styles.container}>
            <View style={styles.imgContainer}>
              <View style={styles.imgCont}>
                <Image
                  source={require('../assets/images/image-referidos.png')}
                  resizeMode="stretch"
                  style={styles.img}
                />
              </View>
              <View style={styles.titleContainer}>
                <Text style={styles.titleBig}>
                  ¡Gana 10 puntos.{'\n'} por cada amigo referido!
                </Text>
                <Text style={styles.title}>
                  Invita a tus amigos y gana 10 puntos por su primer canje con
                  tú código
                </Text>
              </View>
            </View>

            <View style={styles.toPA}>
              <View style={styles.subcontainer}>
                <Text style={styles.buttonText}>Tu código</Text>
                <View style={styles.tuCodigoContainer}>
                  <Text style={styles.textCodigo}>{this.state.codigo}</Text>
                  <TouchableOpacity
                    onPress={() => this.copyClipboard()}
                    style={styles.codigo}>
                    <Text
                      style={{
                        color: 'white',
                        fontFamily: 'ProximaNova-Bold',
                      }}>
                      Copiar
                    </Text>
                    <Copy
                      style={{width: 15, height: 15, marginHorizontal: 5}}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.containerCompartir}>
                  <TouchableOpacity
                    style={styles.btnCompartir}
                    onPress={() => this.onshare()}>
                    <Text style={styles.textCompartir}>Compartir</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.buttonText}>
                  Ingresa un código de referido
                </Text>
                <View style={styles.ingresarCodigoContainer}>
                  {/* <Text style={styles.textCodigo}>{this.state.codigo}</Text> */}
                  <TextInput
                    style={styles.textCodigo2}
                    label="Codigo"
                    name="Codigo"
                    placeholder="Ingresa un codigo"
                    autoCompleteType="name"
                    textContentType="name"
                    value={this.state.referedCod}
                    onChangeText={text => this.setState({referedCod: text})}
                  />
                  <TouchableOpacity
                    onPress={() => this.submitCode()}
                    style={styles.codigo}>
                    <Text
                      style={{
                        color: '#122E5C',
                        fontFamily: 'ProximaNova-Regular',
                      }}>
                      Enviar
                    </Text>
                    <Send
                      style={{width: 15, height: 15, marginHorizontal: 5}}
                    />
                  </TouchableOpacity>
                </View>
                {this.state.errorCod && (
                  <Text style={styles.alert1}>{this.state.errorCod}</Text>
                )}

                <Text
                  onPress={() => this.navigationTerms()}
                  style={styles.terminos}>
                  Terminos y condiciones
                </Text>
                <View style={styles.containerCerrar}>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.goBack()}
                    style={styles.btnCerrar}>
                    <Text style={styles.textCompartir}>Cerrar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    height: height,
    backgroundColor: 'white',
  },
  imgContainer: {
    flex: 2.5,
    alignItems: 'center',
    marginHorizontal: width * 0.1,
    // backgroundColor: 'red',
  },
  imgCont: {
    flex: 3,
    padding: height * 0.02,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#F5FCFF',
    flexDirection: 'column',
    width: '100%',
  },
  titleContainer: {
    flex: 1,
    width: '100%',
    //paddingTop: height * 0.04,
    //backgroundColor: 'red',
    //height: '30%',
  },
  titleBig: {
    fontFamily: 'ProximaNova-Bold',
    color: '#122E5C',
    textAlign: 'center',
    fontSize: width * 0.06,
  },
  title: {
    fontFamily: 'ProximaNova-Bold',
    color: '#122E5C',
    textAlign: 'center',
    fontSize: width * 0.025,
  },

  img: {
    flex: 1,
    width: width * 0.9,
    height: height * 0.5,
    //backgroundColor: 'red',
    resizeMode: 'stretch',
  },

  tuCodigoContainer: {
    //flex: 2,
    borderRadius: width * 0.04,
    paddingHorizontal: width * 0.03,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#122E5C',
    width: '90%',
    height: height * 0.075,
    //height: '10%',
  },
  ingresarCodigoContainer: {
    //flex: 1,
    borderRadius: width * 0.04,
    paddingHorizontal: width * 0.03,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    borderWidth: 1,
    borderColor: '#122E5C',
    height: height * 0.075,
    //backgroundColor: 'red',
  },
  codigo: {
    flex: 1,
    flexDirection: 'row',
  },
  containerCompartir: {
    //flex: 2,
    paddingVertical: height * 0.02,
    borderRadius: width * 0.04,
    paddingHorizontal: width * 0.03,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
  },
  btnCompartir: {
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: '#122E5C',
    backgroundColor: 'white',
    borderColor: '#122E5c',
    borderWidth: width * 0.003,
    borderRadius: width * 0.05,
    width: '70%',
    height: height * 0.075,
  },
  containerCerrar: {
    borderRadius: width * 0.04,
    //paddingHorizontal: width * 0.03,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
  },
  btnCerrar: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#122E5c',
    backgroundColor: 'white',
    borderWidth: width * 0.003,
    borderRadius: width * 0.05,
    width: '100%',
    height: height * 0.075,
  },
  textCodigo: {
    flex: 3.5,
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'ProximaNova-Regular',
    color: 'white',
  },
  textCodigo2: {
    flex: 3.5,
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'ProximaNova-Bold',
    color: '#122E5c',
  },
  alert1: {
    color: 'red',
    paddingLeft: width * 0.01,
    marginTop: height * 0.009,
    paddingBottom: height * 0.02,
    fontFamily: 'ProximaNova-Regular',
  },
  subcontainer: {
    flex: 1,
    //marginBottom: 100,
    width: '100%',
    alignItems: 'flex-start',
    //backgroundColor: 'white',
  },
  buttonText: {
    //flex: 1,
    textAlign: 'center',
    marginVertical: height * 0.015,
    color: '#122E5C',
    fontFamily: 'ProximaNova-Bold',
    fontSize: width * 0.05,
  },
  textCompartir: {
    fontFamily: 'ProximaNova-Bold',
    color: '#122E5c',
    fontSize: width * 0.04,
  },
  toPA: {
    flex: 4,
    // backgroundColor: 'blue',
    //alignSelf: 'flex-start',
  },
  terminos: {
    marginTop: height * 0.04,
    marginBottom: height * 0.02,
    alignSelf: 'center',
    fontSize: width * 0.035,
    fontFamily: 'ProximaNova-Regular',
    color: '#122E5C',
    textDecorationLine: 'underline',
  },
});
