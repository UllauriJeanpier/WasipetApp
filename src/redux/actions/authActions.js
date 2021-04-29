/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
import {AUTHENTICATE, DEAUTHENTICATE, USER} from '../types';
import {API} from '../../config';
import {Platform, Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
// AUTHENTICATE FUNTIONS

const getStoreData = async key => {
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

const setStoreData = async (key, value) => {
  //console.log(key, value);
  try {
    await AsyncStorage.setItem(key, value);
  } catch (err) {
    console.log(err);
  }
};

export const register = ({
  name,
  surname,
  photo,
  email,
  /* phone, */ password,
  provide_service,
}) => {
  return dispatch => {
    let postData = {
      name,
      surname,
      email,
      /* phone, */
      password,
      provide_service,
    };

    let data = new FormData();
    if (photo) {
      if (typeof photo === 'string') {
        data.append('photo', photo);
      } else {
        data.append('image', {
          name: photo.fileName,
          type: photo.type,
          uri:
            Platform.OS === 'android'
              ? photo.uri
              : photo.uri.replace('file://', ''),
        });
      }
    }

    Object.keys(postData).forEach(key => {
      if (postData[key]) {
        data.append(key, postData[key]);
      }
    });

    console.log(data);

    fetch(`${API}/register`, {
      method: 'POST',
      headers: {
        // eslint-disable-next-line prettier/prettier
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: data,
    })
      .then(response => response.json())
      .then(response => {
        if (response.msg) {
          console.log(response.msg);
          alert('Este email ya se encuentra registrado');
        } else {
          dispatch({type: AUTHENTICATE, payload: response});
          console.log('User register successfuly');
        }
      })
      .catch(error => {
        console.log('upload error', error);
        alert('Register failed!');
      });
  };
};

export const authenticate = ({email, password}) => {
  return dispatch => {
    let postdata = {
      email,
      password,
    };

    let data = new FormData();
    Object.keys(postdata).forEach(key => {
      data.append(key, postdata[key]);
    });

    fetch(`${API}/login`, {
      method: 'POST',
      headers: {
        // eslint-disable-next-line prettier/prettier
        'Accept': 'application/json',
      },
      body: data,
    })
      .then(response => response.json())
      .then(response => {
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
        } else {
          /* setStoreData('token', response.token);
          setStoreData('user', response.id); */
          dispatch({type: AUTHENTICATE, payload: response});
          console.log('User logged successfuly');
        }
      })
      .catch(error => {
        console.log('lOGIN FAILED', error);
        Alert.alert(
          'Error al Iniciar Sesión',
          'Ha habido un problema al ingresar, inténtelo mas tarde',
          [{text: 'Cerrar'}],
          {cancelable: true},
        );
      });
  };
};

export const authenticate_ext = ({email, service}) => {
  return dispatch => {
    let postdata = {
      email,
      service,
    };

    let data = new FormData();
    Object.keys(postdata).forEach(key => {
      data.append(key, postdata[key]);
    });

    fetch(`${API}/login`, {
      method: 'POST',
      headers: {
        // eslint-disable-next-line prettier/prettier
        'Accept': 'application/json',
      },
      body: data,
    })
      .then(response => response.json())
      .then(response => {
        console.log(response);
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
        } else {
          dispatch({type: AUTHENTICATE, payload: response});
          console.log('User logged successfuly');
        }
      })
      .catch(error => {
        console.log('lOGIN FAILED', error);
        Alert.alert(
          'Error al Iniciar Sesión',
          'Ha habido un problema al ingresar, inténtelo mas tarde',
          [{text: 'Cerrar'}],
          {cancelable: true},
        );
      });
  };
};

export const deauthenticate = () => {
  console.log('Deslogueando');
  return dispatch => {
    dispatch({type: DEAUTHENTICATE});
  };
};

export const reauthenticate = session => {
  return dispatch => {
    dispatch({type: AUTHENTICATE, payload: session});
  };
};
