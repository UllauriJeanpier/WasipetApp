import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  Dimensions,
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';
import ModalConfirm from '../components/ModalChanges';
import {
  getBreedsCat,
  getBreedsDog,
  getBreedbyid,
} from '../APIRequest/breedRequest';
import {getPetbyOwnew, updatePet} from '../APIRequest/petRequest';
import DateTimePicker from '@react-native-community/datetimepicker';
import ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';
import {refreshPet} from '../redux/actions/userActions';
import {PermissionsAndroid} from 'react-native';
import CustomHeader from '../components/header';
import Camera from '../assets/svg/camera';
import Mascota from '../assets/svg/menu-mascota';
import ArrowDown from '../assets/svg/arrow-down';
import ArrowRightGray from '../assets/svg/arrow-right-gray';
import RNPickerSelect from 'react-native-picker-select';
import {PET_GENDERS} from '../utils/constantes';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

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
  if (!values.phone) {
    errors.phone = 'Este campo es obligaotorio';
  }
  if (!values.DNI) {
    errors.dni = 'Este campo es obligaotorio';
  }

  return errors;
};

class AjustePerfilMascota extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // loader
      initialfetch: true,
      fetching: false,

      petOwner: null,
      stateChanges: 0,
      // breeds
      breeds: [],
      // pet inputs
      photo: null,
      name: null,
      breed: null,
      gender: null,
      BornDate: null,
      description: null,
      allergies: null,
      disability: null,
      cirugias: null,
      initialpet: true,
      errors: {
        name: null,
        breed: null,
        gender: null,
        bornDate: null,
        photo: null,
      },
      showPicker: false,
      modalVisible: false,
    };
    this._handleName = this._handleName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getCatsFromAPI = this.getCatsFromAPI.bind(this);
    this.getDogsFromAPI = this.getDogsFromAPI.bind(this);
    this.requestCameraPermission = this.requestCameraPermission.bind(this);
    this.showDatepicker = this.showDatepicker.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleChoosePhoto = this.handleChoosePhoto.bind(this);
    this.onChangeDatePicker = this.onChangeDatePicker.bind(this);
    this.newFormatDate = this.newFormatDate.bind(this);
  }

  showModal = () => {
    this.setState(prevState => ({modalVisible: !prevState.modalVisible}));
  };

  onChangeDatePicker = async (event, selectedDate) => {
    console.log(
      'Renzo: AjustePerfilMascota -> onChangeDatePicker -> event',
      event,
    );
    if (event.type !== 'dismissed') {
      const currentDate = this.state.dateBorn || selectedDate;
      this.setState({showPicker: Platform.OS === 'ios'});
      this.setState({
        BornDate: currentDate.toString(),
      });
    } else {
      this.setState(prevState => ({showPicker: !prevState.showPicker}));
    }
  };

  showDatepicker = () => {
    this.setState(prevState => ({showPicker: !prevState.showPicker}));
  };

  async UNSAFE_componentWillMount() {
    const token = await this.getStoreData('token');
    const petOwner = await this.getStoreData('pet');
    // console.log(petOwner);
    await this.setState({petOwner});
    try {
      const pet = await getPetbyOwnew(token);
      if (pet.msg == null) {
        const breed = await getBreedbyid(pet.breed);
        if (breed) {
          breed.type === 'Cat'
            ? await this.getCatsFromAPI()
            : await this.getDogsFromAPI();
          //console.log('breed', breed);
          await this.setState({
            breed: breed.name,
            name: pet.name,
            photo: pet.photo,
            gender: pet.gender,
            BornDate: pet.BornDate,
            allergies: pet.allergies,
            disability: pet.disability,
            description: pet.description,
            initialfetch: false,
          });
        }
      } else {
        this.setState({
          initialpet: false,
        });
      }
    } catch (err) {
      this.setState({
        initialpet: false,
      });
    }
  }

  async getDogsFromAPI() {
    let breedsState = await getBreedsDog();

    // Multirazas al inicio
    let multiraza = breedsState.pop();
    breedsState.unshift(multiraza);

    this.setState({
      breeds: breedsState.map(
        breed => (breed = {...breed, label: breed.name, value: breed.name}),
      ),
    });
  }
  async getCatsFromAPI() {
    let breedsState = await getBreedsCat();

    // Multirazas al inicio
    let multiraza = breedsState.pop();
    breedsState.unshift(multiraza);

    this.setState({
      breeds: await breedsState.map(
        breed => (breed = {...breed, label: breed.name, value: breed.name}),
      ),
    });
  }

  requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]);
      console.log(granted);
      if (
        granted['android.permission.CAMERA'] ==
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

  async handleSubmit() {
    // Inicia el request
    this.setState({
      fetching: true,
    });
    const {
      photo,
      name,
      breed,
      gender,
      BornDate,
      description,
      disability,
      allergies,
    } = this.state;
    const token = await this.getStoreData('token');
    const user = await this.getStoreData('user');
    //console.log(user);
    if (name && breed && gender && token) {
      const pet = {
        user,
        token,
        photo,
        name,
        breed,
        gender,
        BornDate,
        description,
        disability,
        allergies,
      };
      try {
        console.log('pet', pet);
        let response = await updatePet(pet);
        if (response.name !== null) {
          this.props.refreshPet(token, user);
          // Finaliza el request
          this.setState({
            fetching: false,
          });
          this.props.navigation.push('Principal');
          this.showModal();
        } else {
          this.setState({
            fetching: false,
          });
          alert('Hubo un problema al registrar a su mascota');
        }
      } catch (err) {
        this.setState({
          fetching: false,
        });
        console.log(err);
      }
    } else {
      this.setState({
        fetching: false,
      });
      alert('Verifica todos los campos');
    }
  }

  _handleName(text) {
    // eslint-disable-next-line no-control-regex
    const regexName = /[A-Z][a-zA-Z][^#&<>\"~;$^%{}?]{1,20}$/g;
    console.log(
      '!regexEmail.test(String(text).toLowerCase())',
      !regexName.test(String(text).toLowerCase()),
    );
    if (!regexName.test(String(text))) {
      this.setState({errors: {name: 'Ingrese un nombre correctamento'}});
    } else {
      this.setState({errors: {name: null}});
    }
    this.setState({name: text});
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
      console.log(response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        this.setState({photo: response});
        console.log('The image upload successfully');
      }
    });
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

  newFormatDate(date) {
    let d = new Date(date);
    let newDate = `${(d.getMonth() + 1).toString().padStart(2, '0')}/${d
      .getDate()
      .toString()
      .padStart(2, '0')}/${d.getFullYear().toString()}`;

    return newDate;
  }
  render() {
    return (
      <KeyboardAvoidingView>
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.state.petOwner && (
            <CustomHeader
              title={'Mi Mascota'}
              navigation={this.props.navigation}
              isHome={false}
              actived={this.state.petOwner}
            />
          )}
          {!this.state.initialfetch ? (
            <View style={styles.container}>
              <View style={styles.subContainer}>
                <View style={styles.imageView}>
                  <TouchableOpacity
                    style={styles.square}
                    onPress={() => this.handleChoosePhoto()}>
                    {!this.state.photo ? (
                      <Mascota
                        style={{
                          width: width * 0.1,
                          height: height * 0.1 /* styles.photo */,
                        }}
                      />
                    ) : (
                      <Image
                        // source={{uri: photo.uri}}
                        source={{
                          uri:
                            typeof this.state.photo.uri !== 'undefined'
                              ? this.state.photo.uri
                              : this.state.photo,
                        }}
                        style={styles.photo}
                        resizeMode="cover"
                      />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.CamaraIcon}
                    onPress={() => this.handleChoosePhoto()}>
                    <Camera width={25} height={25} />
                  </TouchableOpacity>
                  <Text style={styles.txtNombre}>
                    {this.state.name ? this.state.name : null}
                  </Text>
                </View>
                <View style={styles.labelContainer}>
                  <Text style={styles.labeltext}>Nombre:</Text>
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    label="Name"
                    name="name"
                    placeholder="Escribe tu nombre"
                    autoCompleteType="name"
                    textContentType="name"
                    style={styles.colorInputText}
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
                {this.state.errors.name && (
                  <Text style={styles.alert1}>{this.state.errors.name}</Text>
                )}
                {
                  <View style={styles.labelContainer}>
                    <Text style={styles.labeltext}>Raza de tu mascota:</Text>
                  </View>
                }
                {this.state.breeds ? (
                  <RNPickerSelect
                    placeholder={{
                      label: this.state.breed
                        ? this.state.breed
                        : 'Elije su raza',
                      value: null,
                    }}
                    placeholderTextColor="#122E5C"
                    // value={this.state.breed}
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
                ) : null}

                <View style={styles.labelContainer}>
                  <Text style={styles.labeltext}>Género:</Text>
                </View>
                <RNPickerSelect
                  placeholder={{
                    label: this.state.gender
                      ? this.state.gender
                      : 'Elije su genero',
                    value: null,
                  }}
                  //placeholderTextColor="#122E5C"
                  //value={this.state.gender}
                  items={PET_GENDERS}
                  onValueChange={async value => {
                    this.setState({
                      gender: await value,
                    });
                    console.log(this.state.gender);
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
                <View style={styles.labelContainer}>
                  <Text style={styles.labeltext}>Fecha de nacimiento:</Text>
                </View>
                <TouchableOpacity
                  style={styles.inputContainer}
                  onPress={() => this.showDatepicker()}>
                  <Text style={styles.colorInputTextDate}>
                    {this.state.BornDate
                      ? this.newFormatDate(this.state.BornDate)
                      : 'Fecha de nacimiento'}
                  </Text>
                  <ArrowDown style={styles.icon1} />
                </TouchableOpacity>
                {this.state.showPicker && (
                  <DateTimePicker
                    testID="datePickerProfile"
                    mode={'date'}
                    value={
                      this.state.dateBorn
                        ? new Date(this.state.dateBorn)
                        : new Date()
                    }
                    display="default"
                    onChange={this.onChangeDatePicker}
                    minimumDate={new Date(1920, 0, 1)}
                    locale="es"
                  />
                )}

                <View style={styles.labelContainer}>
                  <Text style={styles.labeltext}>Describe a tu mascota:</Text>
                </View>
                <TextInput
                  style={styles.textArea}
                  placeholder="Describe los rasgos indentificables de tu mascota"
                  textContentType="none"
                  label="description"
                  value={this.state.description}
                  multiline={true}
                  numberOfLines={4}
                  onChangeText={text => this.setState({description: text})}
                />
                <View style={styles.labelEjemploContainer}>
                  <Text style={styles.textEjemplo}>
                    Por ejemplo: color sal y pimienta, estatua mediana, cola
                    recortada, etc.
                  </Text>
                </View>

                <View style={styles.labelContainer}>
                  <Text style={styles.labeltext}>Cirugías:</Text>
                </View>
                <TextInput
                  style={styles.textArea}
                  placeholder="Escribe las cirugías que ha tenido tu mascota"
                  textContentType="none"
                  label="disability"
                  value={this.state.disability}
                  multiline={true}
                  numberOfLines={4}
                  onChangeText={text => this.setState({disability: text})}
                />
                <View style={styles.labelEjemploContainer}>
                  <Text style={styles.textEjemplo}>
                    Por ejemplo: castración, esterilización, etc.
                  </Text>
                </View>

                <View style={styles.labelContainer}>
                  <Text style={styles.labeltext}>Alergias:</Text>
                </View>
                <TextInput
                  style={styles.textArea}
                  placeholder="Escribe las alergias que tiene tu mascota"
                  textContentType="none"
                  label="allergies"
                  value={this.state.allergies}
                  multiline={true}
                  numberOfLines={4}
                  onChangeText={text => this.setState({allergies: text})}
                />
                <View style={styles.labelEjemploContainer}>
                  <Text style={styles.textEjemplo}>
                    Por ejemplo: dermatitis atópica, dematitis por pulgas,
                    medicamentos,etc.
                  </Text>
                </View>
                <TouchableOpacity onPress={() => this.showModal()}>
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>Guardar cambios</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: height * 0.7,
              }}>
              <ActivityIndicator size="large" color="#122E5C" />
            </View>
          )}
        </ScrollView>
        {
          <Modal transparent={true} visible={this.state.modalVisible}>
            <TouchableOpacity
              onPress={() => this.showModal()}
              style={styles.containerfondo}>
              {this.state.fetching ? (
                <View style={styles.containerModalfond}>
                  <ActivityIndicator size="large" color="#122E5C" />
                </View>
              ) : (
                <TouchableOpacity
                  activeOpacity={1}
                  style={styles.containerModalfond}>
                  <Text style={styles.preguntaModal}>
                    ¿ Desea guardar los {'\n'} cambios realizados ?
                  </Text>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.buttonModal}>
                      <Text
                        style={styles.textButtonModal}
                        onPress={() =>
                          this.props.navigation.navigate('Principal')
                        }>
                        Salir sin guardar
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.buttonModal}
                      onPress={() => this.handleSubmit()}>
                      <Text style={styles.textButtonModal}>Guardar</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          </Modal>
        }
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.userUpdates,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    refreshPet: (token, owner) => {
      return dispatch(refreshPet(token, owner));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AjustePerfilMascota);

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
    flex: 6,
    alignItems: 'center',
    backgroundColor: '#122E5C',
  },
  subContainer: {
    marginTop: 10,
    //flex: 6,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
    width: '100%',
    flexDirection: 'column',
    paddingVertical: 15,
  },
  square: {
    width: width * 0.2,
    height: width * 0.2,
    borderColor: '#122E5C',
    borderWidth: 3,
    borderRadius: 100,
    alignItems: 'center',
  },
  txtNombre: {
    fontSize: width * 0.045,
    color: '#122E5C',
    fontFamily: 'ProximaNova-Bold',
    margin: 10,
  },
  textArea: {
    textAlignVertical: 'top', // esto solo funciona para android
    padding: 10,
    marginBottom: 3,
    fontSize: 15,
    borderWidth: 1,
    width: '100%',
    height: 80,
    borderRadius: 20,
    borderColor: '#B3B3B3',
    color: '#122E5C',
    fontFamily: 'ProximaNova-Bold',
    /* justifyContent: "flex-start",
    alignItems: 'center' */
  },

  imageView: {
    flexDirection: 'row',
    //justifyContent: 'center',
    alignItems: 'center',
    //padding: 10,
    paddingVertical: 10,
    marginBottom: 15,
  },
  photo: {
    /*  marginTop: 10,
    marginBottom: 10, */
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 100,
  },
  button: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: width * 0.04,
    alignSelf: 'center',
    bottom: 35,
    //top: 35,
    marginTop: height * 0.125,
    borderColor: '#122E5c',
    borderWidth: width * 0.004,
  },
  buttonText: {
    textAlign: 'center',
    paddingVertical: height * 0.02,
    color: '#122E5c',
    fontSize: width * 0.035,
    fontFamily: 'ProximaNova-Regular',
  },
  vwMid: {
    margin: 5,
    alignSelf: 'flex-start',
    padding: 2,
  },
  txtMid: {
    fontSize: 18,
    margin: 10,
  },
  datePicker: {
    margin: 10,
  },
  inputContainerDate: {
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    paddingLeft: 5,
    fontSize: 13,
    height: 45,
    borderWidth: 1,
    borderRadius: width * 0.04,
    width: '100%',
    backgroundColor: '#FDFEFE',
    borderColor: '#B3B3B3',
    marginBottom: 60,
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
    //paddingLeft: width * 0.07,
  },
  labelEjemploContainer: {
    alignItems: 'flex-start',
    //paddingLeft: width * 0.07,
    marginBottom: 10,
  },
  alert1: {
    color: '#FF3030',
    paddingLeft: width * 0.01,
    paddingBottom: height * 0.02,
    fontFamily: 'ProximaNova-Regular',
  },
  colorInputText: {
    color: '#122E5C',
    fontFamily: 'ProximaNova-Bold',
  },
  colorInputTextDate: {
    color: '#122E5C',
    fontFamily: 'ProximaNova-Bold',
    paddingLeft: 5,
  },
  CamaraIcon: {
    position: 'absolute',
    top: 0,
    left: width * 0.14,
    padding: 5,
    borderWidth: 2,
    borderRadius: 100,
    borderColor: '#122E5C',
    //width: 200,
    backgroundColor: 'white',
  },
  alert2: {
    paddingBottom: height * 0.06,
    color: '#FF3030',
    alignSelf: 'center',
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
  preguntaModal: {
    color: '#122E5C',
    fontSize: width * 0.04,
    fontFamily: 'ProximaNova-Bold',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  buttonModal: {
    padding: 5,
    borderColor: '#122E5C',
    borderWidth: 1,
    borderRadius: 20,
    width: '50%',
    height: height * 0.07,
    marginHorizontal: 2,
    justifyContent: 'center',
    marginTop: 10,
  },
  textButtonModal: {
    color: '#122E5C',
    fontFamily: 'ProximaNova-Regular',
    fontSize: width * 0.035,
    textAlign: 'center',
  },
  textEjemplo: {
    color: '#B3B3B3',
    fontFamily: 'ProximaNova-Regular',
    fontSize: width * 0.027,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    paddingLeft: 10,
    marginBottom: 15,
    fontSize: 13,
    height: 45,
    borderWidth: 1,
    borderRadius: width * 0.04,
    width: '100%',
    backgroundColor: 'white',
    borderColor: '#B3B3B3',
    color: '#122E5C',
    fontFamily: 'ProximaNova-Bold',
  },
  inputAndroid: {
    paddingLeft: 10,
    marginBottom: 15,
    fontSize: 13,
    height: 45,
    borderWidth: 1,
    borderRadius: width * 0.04,
    width: '100%',
    backgroundColor: 'white',
    borderColor: '#B3B3B3',
    color: '#122E5C',
    fontFamily: 'ProximaNova-Bold', // to ensure the text is never behind the icon
  },
  placeholder: {
    color: '#122E5C',
  },
  iconContainer: {
    paddingRight: 15,
  },
});
