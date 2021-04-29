import React, {Component, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Modal,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-community/async-storage';
import {PermissionsAndroid} from 'react-native';
import {updateUser, getUserbytoken} from '../APIRequest/userRequest';
import CustomHeader from '../components/header';
import Camera from '../assets/svg/camera';
import Profile from '../assets/svg/menu-perfil';
import ArrowDown from '../assets/svg/arrow-down';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

//import DateTimePickerModal from 'react-native-modal-datetime-picker';
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
export default class AjustePerfil extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // loader
      initialfetch: true,
      fetching: false,
      // user inputs
      photo: null,
      name: null,
      surname: null,
      DNI: null,
      dateBorn: null,
      phone: null,
      email: null,
      type: null,
      provide_service: null,

      // imagepicker
      imagepickerphoto: false,

      // DAte picker

      isDateTimePickerVisible: false,
      date: new Date(),
      errors: {
        name: null,
        surname: null,
        email: null,
        phone: null,
        dni: null,
      },
      errorSubmit: null,
      showPicker: false,
      modalVisible: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.requestCameraPermission = this.requestCameraPermission.bind(this);
    this.requestCamaraPermissionIOS = this.requestCamaraPermissionIOS.bind(
      this,
    );
    this.handleChoosePhoto = this.handleChoosePhoto.bind(this);
    this.getStoreData = this.getStoreData.bind(this);
    this._handleName = this._handleName.bind(this);
    this._handleSurName = this._handleSurName.bind(this);
    this._handleEmail = this._handleEmail.bind(this);
    this._handlePhone = this._handlePhone.bind(this);
    this._handleDNI = this._handleDNI.bind(this);
    this.showDatepicker = this.showDatepicker.bind(this);
    this.onChangeDatePicker = this.onChangeDatePicker.bind(this);
    this.showModal = this.showModal.bind(this);
    this.newFormatDate = this.newFormatDate.bind(this);
  }

  async UNSAFE_componentWillMount() {
    const token = await this.getStoreData('token');
    const id = await this.getStoreData('user');
    const data = {id, token};
    try {
      const user = await getUserbytoken(data);
      console.log(user);
      if (user.name) {
        console.log('ingreso');
        this.setState({
          name: user.name,
          surname: user.surname,
          photo: user.photo,
          DNI: user.DNI,
          document: 'DNI',
          dateBorn: user.dateBorn ? new Date(user.dateBorn).toString() : null,
          phone: user.phone,
          email: user.email,
          provide_service: user.provide_service,
          type: user.type,
          initialfetch: false,
        });
      }
    } catch (err) {
      console.log(err);
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
      this.setState({errors: {name: 'Ingrese su nombre correctamente'}});
    } else {
      this.setState({errors: {name: null}});
    }
    this.setState({name: text});
  }
  _handleSurName(text) {
    // eslint-disable-next-line no-control-regex
    const regexSurName = /[A-Z][a-zA-Z][^#&<>\"~;$^%{}?]{1,20}$/g;
    console.log(
      '!regexEmail.test(String(text).toLowerCase())',
      !regexSurName.test(String(text).toLowerCase()),
    );
    if (!regexSurName.test(String(text))) {
      this.setState({errors: {surname: 'Ingrese su apellido correctamente'}});
    } else {
      this.setState({errors: {surname: null}});
    }
    this.setState({surname: text});
  }
  _handleEmail(text) {
    // eslint-disable-next-line no-control-regex
    const regexEmail = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    if (!regexEmail.test(String(text).toLowerCase())) {
      this.setState({errors: {email: 'Ingrese su e-mail correctamente'}});
    } else {
      this.setState({errors: {email: null}});
    }
    this.setState({email: text});
  }
  _handlePhone(text) {
    // eslint-disable-next-line no-control-regex
    const regexTelefono = /^[9]\d{8}$/g;
    if (!regexTelefono.test(text)) {
      this.setState({errors: {phone: 'Ingrese su celular correctamente'}});
    } else {
      this.setState({errors: {phone: null}});
    }
    this.setState({phone: text});
  }
  _handleDNI(text) {
    // eslint-disable-next-line no-control-regex
    const regexDNI = /\d{8}$/g;
    if (!regexDNI.test(text)) {
      this.setState({errors: {dni: 'Ingrese su DNI correctamente'}});
    } else {
      this.setState({errors: {dni: null}});
    }
    this.setState({DNI: text});
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
    // inicia el request
    this.setState({
      fetching: true,
    });
    const {name, surname, DNI, dateBorn, phone, email, photo} = this.state;
    const user_id = await this.getStoreData('user');
    const token = await this.getStoreData('token');
    if (name && surname && email) {
      const user = {
        name,
        surname,
        DNI,
        dateBorn,
        phone,
        email,
        photo,
        token,
        user_id,
      };
      /* const result = validate({name, surname, DNI, dateBorn, phone, email});
      if (Object.keys(result).length !== 0) {
        return this.setState({errors: result});
      } else { */
      try {
        let response = await updateUser(user);
        console.log(response);
        if (response.name !== null) {
          this.setState({
            fetching: false,
          });
          this.props.navigation.push('Principal');
          this.showModal();
        } else {
          this.setState({
            fetching: false,
            errorSubmit: 'Hubo un problema al registrar a su mascota',
          });
        }
      } catch (err) {
        console.log(err);
        this.setState({
          fetching: false,
          errorSubmit: 'No se actualizo correctamente',
        });
      }
    } else {
      this.setState({
        fetching: false,
        errorSubmit: 'Verifica todos los campos',
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
      console.log(response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        this.setState({
          photo: response,
          imagepickerphoto: true,
        });
        console.log('The image upload successfully');
      }
    });
  };
  onChangeDatePicker = async (event, selectedDate) => {
    console.log(event);
    if (event.type !== 'dismissed') {
      const currentDate = selectedDate || this.state.dateBorn;
      this.setState({showPicker: Platform.OS === 'ios'});
      await this.setState({
        dateBorn: currentDate.toString(),
      });
    } else {
      this.setState(prevState => ({showPicker: !prevState.showPicker}));
    }
  };
  showDatepicker = () => {
    this.setState(prevState => ({showPicker: !prevState.showPicker}));
    console.log(this.state.showPicker);
  };

  showModal = () => {
    this.setState(prevState => ({modalVisible: !prevState.modalVisible}));
  };

  newFormatDate(date) {
    let d = new Date(date);
    let newDate = `${(d.getMonth() + 1).toString().padStart(2, '0')}/${d
      .getDate()
      .toString()
      .padStart(2, '0')}/${d.getFullYear().toString()}`;

    return newDate;
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
    const {name, date, imagepickerphoto, photo, initialfetch} = this.state;
    console.log(photo);
    /* if (photo) {
      console.log('fake', photo.uri);
    } */
    return (
      <KeyboardAvoidingView>
        <ScrollView showsVerticalScrollIndicator={false}>
          <CustomHeader
            title={'Mi Perfil'}
            navigation={this.props.navigation}
            isHome={false}
          />
          {!initialfetch ? (
            <View style={styles.container}>
              <View style={styles.subContainer}>
                <View style={styles.imageView}>
                  <TouchableOpacity
                    style={styles.square}
                    onPress={() => this.handleChoosePhoto()}>
                    {!photo ? (
                      <Profile style={styles.photo} />
                    ) : (
                      <Image
                        // source={{uri: photo.uri}}
                        source={{
                          uri:
                            typeof photo.uri !== 'undefined'
                              ? photo.uri
                              : photo,
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
                    {this.state.name && this.state.surname
                      ? this.state.name + ' ' + this.state.surname
                      : null}
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
                <View style={styles.labelContainer}>
                  <Text style={styles.labeltext}>Apellido:</Text>
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    label="Surname"
                    name="surname"
                    placeholder="Escribre tu apellido"
                    autoCompleteType="name"
                    style={styles.colorInputText}
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
                {this.state.errors.surname && (
                  <Text style={styles.alert1}>{this.state.errors.surname}</Text>
                )}
                <View style={styles.labelContainer}>
                  <Text style={styles.labeltext}>Correo:</Text>
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    label="Correo electrónico"
                    name="email"
                    placeholder="Escribre tu correo"
                    style={styles.colorInputText}
                    autoCompleteType="email"
                    editable={false}
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
                {this.state.errors.email && (
                  <Text style={styles.alert1}>{this.state.errors.email}</Text>
                )}
                <View style={styles.labelContainer}>
                  <Text style={styles.labeltext}>Celular:</Text>
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    label="Celular"
                    name="phone"
                    maxLength={9}
                    placeholder="Escriba su celular"
                    style={styles.colorInputText}
                    value={this.state.phone}
                    onChangeText={text => this._handlePhone(text)}
                  />
                  {this.state.errors.phone ? (
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
                {this.state.errors.phone && (
                  <Text style={styles.alert1}>{this.state.errors.phone}</Text>
                )}

                {/* <View>
                <RNPickerSelect
                  placeholder={{
                    label: 'Selecciona tu tipo de documento',
                    value: null,
                  }}
                  style={{
                    inputAndroid: {
                      padding: 5,
                      margin: 5,
                      fontSize: 15,
                      borderWidth: 2.5,
                      width: '90%',
                      borderRadius: 25,
                      borderColor: '#909497',
                    },
                    inputIOS: {
                      padding: 5,
                      margin: 5,
                      fontSize: 15,
                      borderWidth: 2.5,
                      width: width * 0.9,
                      borderRadius: 25,
                      borderColor: '#909497',
                    },
                  }}
                  useNativeAndroidPickerStyle={false}
                  textInputProps={{underlineColor: 'yellow'}}
                  onValueChange={value => this.setState({document: value})}
                  items={[
                    {label: 'DNI', value: 'DNI'},
                    {label: 'Pasaporte', value: 'Pasaporte'},
                  ]}
                />
              </View> */}

                <View style={styles.labelContainer}>
                  <Text style={styles.labeltext}>Documento de Identidad:</Text>
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    label="DNI"
                    name="phone"
                    placeholder="Escriba su documento"
                    style={styles.colorInputText}
                    maxLength={8}
                    value={this.state.DNI}
                    onChangeText={text => this._handleDNI(text)}
                  />
                  {this.state.errors.dni ? (
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
                {this.state.errors.dni && (
                  <Text style={styles.alert1}>{this.state.errors.dni}</Text>
                )}
                <TouchableOpacity
                  style={styles.inputContainerDate}
                  onPress={() => this.showDatepicker()}>
                  <Text style={styles.colorInputTextDate}>
                    {this.state.dateBorn
                      ? this.newFormatDate(this.state.dateBorn)
                      : 'Fecha de nacimiento'}
                  </Text>
                  <ArrowDown style={styles.icon1} />
                </TouchableOpacity>
                {Platform.OS === 'ios' && this.state.showPicker ? (
                  <>
                    <TouchableOpacity
                      onPress={() => this.showDatepicker()}
                      style={styles.confirmarDateIOS}>
                      <Text style={styles.buttonText}>Confirmar</Text>
                    </TouchableOpacity>
                    <DateTimePicker
                      style={{
                        width: '100%',
                        flex: 1,
                        justifyContent: 'center',
                        marginBottom: 30,
                      }}
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
                    />
                  </>
                ) : null}
                {Platform.OS === 'android' && this.state.showPicker ? (
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
                  />
                ) : null}
                {this.state.errorSubmit && (
                  <Text style={styles.alert2}>{this.state.errorSubmit}</Text>
                )}
                <View styles={{paddingTop: 50, flex: 1}}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('CambiarContrasena', {
                        inicio: 'AjustePerfil',
                        title: 'Cambiar Contraseña',
                        email: this.state.email,
                      })
                    }>
                    <View style={styles.button}>
                      <Text style={styles.buttonText}>
                        Modificar contraseña
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.showModal()}>
                    <View style={styles.button}>
                      <Text style={styles.buttonText}>Guardar cambios</Text>
                    </View>
                  </TouchableOpacity>
                </View>
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
                      onPress={() => {
                        this.handleSubmit();
                        //this.showModal();
                      }}>
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
    fontSize: width * 0.044,
    color: '#122E5C',
    fontFamily: 'ProximaNova-Bold',
    margin: 10,
    width: '100%',
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
  Txtinput: {
    padding: 5,
    margin: 5,
    fontSize: 15,
    borderWidth: 2.5,
    width: '90%',
    borderRadius: 25,
    borderColor: '#909497',
  },

  inputSelect: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },

  button: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: width * 0.04,
    alignSelf: 'center',
    bottom: 35,
    marginTop: 15,
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
  DatePickerContainer: {
    margin: 10,
  },
  texto: {
    textAlign: 'center',
    paddingVertical: height * 0.02,
    color: '#122E5c',
    fontSize: width * 0.035,
    fontFamily: 'ProximaNova-Regular',
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
  alert1: {
    color: '#FF3030',
    paddingLeft: width * 0.01,
    paddingBottom: height * 0.02,
    fontFamily: 'ProximaNova-Regular',
  },
  colorInputText: {
    color: '#122E5C',
    width: '100%',
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
  confirmarDateIOS: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: width * 0.04,
    alignSelf: 'center',
    bottom: 35,
    marginTop: 15,
    borderColor: '#122E5c',
    borderWidth: width * 0.004,
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
});
