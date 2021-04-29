import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  ImageBackground,
  Platform,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
  Modal,
  Picker,
} from 'react-native';

import {connect} from 'react-redux';
import {getBreedsCat, getBreedsDog} from '../APIRequest/breedRequest';
import {addPet} from '../APIRequest/petRequest';
import {register, deauthenticate} from '../redux/actions/authActions';
import AsyncStorage from '@react-native-community/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import ImagePicker from 'react-native-image-picker';
import {PermissionsAndroid} from 'react-native';
import CustomHeader from '../components/header';
import ArrowRightGray from '../assets/svg/arrow-right-gray';
import CheckBox from '@react-native-community/checkbox';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

class Registro_foto extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //user: this.props.route.params.user,
      petExisting: null,
      petType: null,
      photo: null,
      breeds: [],
      name: null,
      breed: null,
      errorName: false,
      checkTerms: false,
      errorRequest: false,
      errorTextRequest: '',
      modalVisible: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.requestCameraPermission = this.requestCameraPermission.bind(this);
    this.requestCamaraPermissionIOS = this.requestCamaraPermissionIOS.bind(
      this,
    );
    this.handleChoosePhoto = this.handleChoosePhoto.bind(this);
    this.getCatsFromAPI = this.getCatsFromAPI.bind(this);
    this.getDogsFromAPI = this.getDogsFromAPI.bind(this);
    this._handleName = this._handleName.bind(this);
    this.navigationTerms = this.navigationTerms.bind(this);
    this._checkTerms = this._checkTerms.bind(this);
    this.showModal = this.showModal.bind(this);
  }

  async UNSAFE_componentWillMount() {
    const pet = await this.getStoreData('pet');
    try {
      const breedsState = await getBreedsDog();

      // Multirazas al inicio
      let multiraza = breedsState.pop();
      breedsState.unshift(multiraza);

      this.setState({
        breeds: await breedsState.map(
          breed => (breed = {...breed, label: breed.name, value: breed.name}),
        ),
        petType: 'Dog',
        petExisting: pet,
      });
    } catch (err) {
      console.log(err);
      Alert.alert(
        'Error conexion',
        'Verifique que su equipo este conectado a internet o intentelo mas tarde',
        [{text: 'Cerrar'}],
        {cancelable: true},
      );
    }
  }
  async getDogsFromAPI() {
    try {
      let breedsState = await getBreedsDog();

      // Multirazas al inicio
      let multiraza = breedsState.pop();
      breedsState.unshift(multiraza);

      this.setState({
        breeds: await breedsState.map(
          breed => (breed = {...breed, label: breed.name, value: breed.name}),
        ),
        petType: 'Dog',
      });
    } catch (err) {
      console.log(err);
    }
  }
  async getCatsFromAPI() {
    try {
      let breedsState = await getBreedsCat();

      // Multirazas al inicio
      let multiraza = breedsState.pop();
      breedsState.unshift(multiraza);
      //console.log(breedsState);

      this.setState({
        breeds: await breedsState.map(
          breed => (breed = {...breed, label: breed.name, value: breed.name}),
        ),
        petType: 'Cat',
      });
    } catch (err) {
      console.log(err);
    }
  }

  showModal = () => {
    this.setState(prevState => ({modalVisible: !prevState.modalVisible}));
  };

  _handleName(text) {
    if (text.length < 2) {
      this.setState({errorName: true});
    } else {
      this.setState({errorName: false});
    }
    this.setState({name: text});
  }
  _checkTerms() {
    this.setState(prevState => ({
      checkTerms: !prevState.checkTerms,
    }));
  }

  requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]);
      //console.log(granted);
      if (
        granted['android.permission.CAMERA'] ===
        PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('You have permissions for use the camera');
      }
    } catch (err) {
      console.warn('Permisions error', err);
    }
  };

  requestCamaraPermissionIOS = async () => {
    request(PERMISSIONS.IOS.CAMERA)
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log(
              'This feature is not available (on this device / in this context)',
            );
            break;
          case RESULTS.DENIED:
            console.log(
              'The permission has not been requested / is denied but requestable',
            );
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            break;
        }
      })
      .catch(error => {
        // …
      });
  };

  /*handleSubmit() {
   if (this.state.photo != null){
    this.props.navigation.navigate('RegistroCuentanosMascota', {photo : this.state.photo});
   } else {
     alert('No ha subido ninguna foto, seleccione una foto');
   }
  }*/
  async handleSubmit() {
    const {name, breed, photo, checkTerms} = this.state;
    const owner = await this.getStoreData('user');
    const token = await this.getStoreData('token');
    if (name && breed /* && photo */ && owner && token) {
      const pet = {name, photo, owner, breed, token};
      if (checkTerms) {
        try {
          let response = await addPet(pet);
          this.showModal();
          // console.log(response);
          if (response.name) {
            this.setStoreData('pet', 'si');
            this.props.navigation.navigate('Principal');
          } else {
            Alert.alert(
              'Error',
              'Hubo un problema al registrar a su mascota, inténtalo más tarde',
              [{text: 'Cerrar'}],
              {cancelable: true},
            );
          }
        } catch (err) {
          console.log(err);
          Alert.alert(
            'Error conexion',
            'Verifique que su equipo este conectado a internet o intentelo mas tarde',
            [{text: 'Cerrar'}],
            {cancelable: true},
          );
        }
      } else {
        this.setState({
          errorRequest: true,
          errorTextRequest: 'Acepte los términos y condiciones',
        });
      }
    } else {
      this.setState({
        errorRequest: true,
        errorTextRequest: 'Verifica todos los campos',
      });
    }
  }

  handleChoosePhoto = async () => {
    const options = {
      noData: true,
      title: 'Seleccione una foto',
      takePhotoButtonTitle: 'Tomar una foto',
      chooseFromLibraryButtonTitle: 'Seleccionar desde el telefono',
      maxWidth: 800,
      maxHeight: 800,
      quality: 0.9,
    };
    if (Platform.OS === 'ios') {
      await this.requestCamaraPermissionIOS();
    } else {
      await this.requestCameraPermission();
    }
    ImagePicker.showImagePicker(options, response => {
      // eslint-disable-next-line no-undef
      //console.log(response);
      if (response.didCancel) {
        //alert('Si desea subir una foto, tiene que seleccionar una');
      } else if (response.error) {
        //alert('Error al acceder a la cámara: ', response.error);
      } else if (response.customButton) {
        //alert('User tapped custom button: ', response.customButton);
      } else {
        this.setState({photo: response});
        //alert('Imagen subida correctamente');
      }
    });
  };

  navigationTerms = async () => {
    await this.props.navigation.navigate('PoliticasPrivacidad');
  };
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
  /*Prueba de cambio*/

  render() {
    const {petType, petExisting} = this.state;
    //console.log(petType);
    return (
      <KeyboardAvoidingView style={styles.container}>
        <ScrollView>
          <CustomHeader
            title={'Registrar a tu mascota'}
            navigation={this.props.navigation}
            isHome={false}
            actived={petExisting}
          />
          <View style={styles.containerContent}>
            <View style={styles.topText}>
              <Text style={styles.topContent}>
                Sube una foto con tu mascota:
              </Text>
            </View>
            <View style={styles.codeContainer}>
              <View style={styles.imageView}>
                <TouchableOpacity onPress={() => this.handleChoosePhoto()}>
                  {this.state.photo ? (
                    <Image
                      source={{uri: this.state.photo.uri}}
                      style={styles.photo}
                      resizeMode="contain"
                    />
                  ) : (
                    <Image
                      source={require('../assets/images/foto-mascota.png')}
                      style={styles.btnImage}
                    />
                  )}
                </TouchableOpacity>
              </View>
              <View style={styles.topText}>
                <Text style={styles.topContent}>Dinós que mascota tienes:</Text>
              </View>
              <View style={styles.imgsContainer}>
                <TouchableOpacity
                  onPress={async () => {
                    await this.getDogsFromAPI();
                  }}
                  title="Perro"
                  style={styles.BtnPerro}>
                  <Image
                    source={
                      petType === 'Dog'
                        ? require('../assets/images/REGISTRO.png')
                        : require('../assets/images/icon-perro-gris.png')
                    }
                    style={styles.img1}
                  />
                  <Text style={styles.txtBtnBreed}>Tengo un perro</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () => {
                    await this.getCatsFromAPI();
                  }}
                  title="Gato"
                  style={styles.BtnGato}>
                  <Image
                    source={
                      petType === 'Cat'
                        ? require('../assets/images/REGISTRO-2.png')
                        : require('../assets/images/icon-gato-gris.png')
                    }
                    style={styles.img2}
                  />
                  <Text style={styles.txtBtnBreed}>Tengo un gato</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.topText}>
                <Text style={styles.topContent}>
                  Cuentános mas de tu mascota:
                </Text>
              </View>
              <View style={styles.containerForm}>
                <View style={styles.labelContainer}>
                  <Text style={styles.labeltext}>Nombre de tu mascota:</Text>
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    label="Nombre de la Mascota"
                    name="name"
                    placeholder="Escribre el nombre de tu mascota"
                    value={this.state.name}
                    onChangeText={text => this._handleName(text)}
                  />
                  {this.state.errorName ? (
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
                {this.state.errorName ? (
                  <Text style={styles.alert1}>Ingrese un nombre válido</Text>
                ) : null}
                <View style={styles.labelContainer}>
                  <Text style={styles.labeltext}>
                    Seleccione la raza de su mascota:
                  </Text>
                </View>

                <RNPickerSelect
                  placeholder={{
                    label: 'Elije su raza',
                    value: null,
                  }}
                  items={this.state.breeds}
                  onValueChange={async value => {
                    this.setState({
                      breed: await value,
                    });
                    // console.log(this.state.breed);
                  }}
                  style={pickerSelectStyles}
                  useNativeAndroidPickerStyle={false}
                  Icon={() => {
                    return (
                      <View>
                        <ArrowRightGray
                          width={20}
                          height={20}
                          style={{marginTop: 15}}
                        />
                      </View>
                    );
                  }}
                />
                <View style={styles.terminosContainer}>
                  {Platform.OS === 'ios' ? (
                    <CheckBox
                      value={this.state.checkTerms}
                      onValueChange={() => this._checkTerms()}
                      boxType={'circle'}
                      lineWidth={2}
                      hideBox={false}
                      tintColor={'#122E5c'}
                      onCheckColor={'#fff'}
                      onFillColor={'#122E5c'}
                      onTintColor={'#122E5c'}
                      animationDuration={0.5}
                      onAnimationType={'bounce'}
                      offAnimationType={'stroke'}
                    />
                  ) : (
                    <CheckBox
                      value={this.state.checkTerms}
                      onValueChange={() => this._checkTerms()}
                      disabled={false}
                    />
                  )}
                  <Text style={styles.textTerms}>
                    Acepto estar deacuerdo con los{' '}
                    <Text
                      onPress={() => this.navigationTerms()}
                      style={styles.termLink}>
                      Términos de uso y política de privacidad
                    </Text>{' '}
                    de WASIPET
                  </Text>
                </View>
                <View style={styles.errorContainer}>
                  {this.state.errorRequest ? (
                    <Text style={styles.alert1}>
                      {this.state.errorTextRequest}
                    </Text>
                  ) : null}
                </View>
                <TouchableOpacity
                  style={styles.button}
                  touchSoundDisabled={false}
                  onPress={() => {
                    this.showModal();
                    this.handleSubmit();
                  }}>
                  <Text style={styles.texto}>ENVIAR</Text>
                </TouchableOpacity>
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
      </KeyboardAvoidingView>
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
    register: user => {
      return dispatch(register(user));
    },
    deauthenticate: token => {
      return dispatch(deauthenticate(token));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Registro_foto);

// ----------------------   Styles ------------------------------

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#122E5C',
  },
  containerImage: {
    width: '100%',
    height: height,
    flex: 1,
  },
  middleContainer: {
    flex: 3,
  },
  title: {
    textAlign: 'center',
    color: '#212F3C',
    fontWeight: 'bold',
    fontSize: width * 0.06,
    padding: 30,
  },
  containerContent: {
    flex: 6,
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
    backgroundColor: 'white',
  },
  photo: {
    marginTop: 10,
    marginBottom: 10,
    width: width * 0.5,
    height: height * 0.3,
  },
  codeContainer: {
    flex: 5,
    backgroundColor: 'white',
    //paddingHorizontal: 20,
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
  topContent: {
    fontSize: 20,
    fontFamily: 'ProximaNova-Bold',
    color: '#212F3C',
    textAlign: 'left',
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
  imageView: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginBottom: 15,
  },
  button: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: width * 0.04,
    alignSelf: 'center',
    bottom: 35,
    marginTop: height * 0.12,
    borderColor: '#122E5c',
    borderWidth: width * 0.004,
  },
  texto: {
    textAlign: 'center',
    paddingVertical: height * 0.02,
    color: '#122E5c',
    fontSize: width * 0.035,
    fontFamily: 'ProximaNova-Regular',
  },
  btnImage: {
    height: 200,
    resizeMode: 'center',
  },
  imgsContainer: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row', //width: '40%',
    marginHorizontal: 20,
  },
  img1: {
    //maxWidth: '50%',
    //marginHorizontal: '-55%',
    width: width * 0.35,
    height: height * 0.15,
    resizeMode: 'contain',
  },
  img2: {
    width: width * 0.35,
    height: height * 0.15,
    resizeMode: 'contain',
  },
  txtBtnBreed: {
    color: '#122E5C',
    fontFamily: 'ProximaNova-Regular',
    fontSize: 18,
    textAlign: 'center',
  },
  containerForm: {
    paddingHorizontal: 20,
    flexDirection: 'column',
  },
  labelContainer: {
    alignItems: 'flex-start',
    //paddingLeft: width * 0.07,
  },
  labeltext: {
    color: '#122E5c',
    fontFamily: 'ProximaNova-Regular',
    fontSize: width * 0.035,
    paddingLeft: width * 0.01,
    paddingBottom: height * 0.01,
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
    paddingLeft: width * 0.01,
    paddingBottom: height * 0.02,
    fontFamily: 'ProximaNova-Regular',
  },
  Pick: {
    borderStartColor: 'red',
    backgroundColor: '#FDFEFE',
  },
  terminosContainer: {
    flexDirection: 'row',
    flex: 1,
    paddingRight: 15,
  },
  textTerms: {
    color: '#122E5C',
    fontSize: 14,
    fontFamily: 'ProximaNova-Regular',
    paddingLeft: 5,
  },
  termLink: {
    textDecorationLine: 'underline',
  },
  checkTerms: {
    borderColor: '#122E5C',
    width: 20,
    height: 20,
    marginRight: 10,
  },
  errorContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 25,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    paddingLeft: 10,
    marginBottom: 15,
    fontSize: 13,
    fontFamily: 'ProximaNova-Regular',
    height: 45,
    borderWidth: 1,
    borderRadius: width * 0.04,
    width: '100%',
    backgroundColor: 'white',
    borderColor: '#B3B3B3',
  },
  inputAndroid: {
    paddingLeft: 10,
    marginBottom: 15,
    fontSize: 13,
    fontFamily: 'ProximaNova-Regular',
    height: 45,
    borderWidth: 1,
    borderRadius: width * 0.04,
    width: '100%',
    backgroundColor: 'white',
    borderColor: '#B3B3B3', // to ensure the text is never behind the icon
  },
  iconContainer: {
    paddingRight: 15,
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
